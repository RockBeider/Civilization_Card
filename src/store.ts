// ============================================================
// Civilization Deck Builder - Zustand Game Store
// ============================================================

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Card, GameState, GameStore, DeckState, FieldState, Resources } from './types';

// --- Helper: Generate unique instance ID ---
const generateInstanceId = (): string => {
    return Math.random().toString(36).substring(2, 11);
};

// --- Helper: Fisher-Yates Shuffle ---
const shuffleArray = <T>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

// --- Helper: Instantiate Card (add unique instanceId) ---
const instantiateCard = (card: Card): Card => ({
    ...card,
    instanceId: generateInstanceId(),
});

// --- Initial State ---
const initialResources: Resources = {
    food: 10,
    production: 0,
    science: 0,
};

const initialDeck: DeckState = {
    drawPile: [],
    hand: [],
    discardPile: [],
};

const initialField: FieldState = {
    structures: [],
    units: [],
};

const initialState: GameState = {
    resources: initialResources,
    era: 1,
    deck: initialDeck,
    field: initialField,
    turn: 1,
    status: 'title',
    playerStats: {
        health: 100,
        maxHealth: 100,
    },
    playerRace: null,
    logs: [],
};

// --- Zustand Store ---
export const useGameStore = create<GameStore>()(
    devtools(
        (set, get) => ({
            // ========== STATE ==========
            ...initialState,

            // ========== ACTIONS ==========

            /**
             * Enter Race Selection Screen
             */
            enterRaceSelection: () => {
                set({ status: 'race_selection' });
            },

            /**
             * Start a new game with the given starter deck and race
             */
            startGame: (starterDeck: Card[], race: string) => {
                const instantiatedDeck = starterDeck.map(instantiateCard);
                const shuffledDeck = shuffleArray(instantiatedDeck);

                set({
                    ...initialState,
                    status: 'playing',
                    playerRace: race,
                    deck: {
                        drawPile: shuffledDeck,
                        hand: [],
                        discardPile: [],
                    },
                    logs: [`🎮 ${race} 종족으로 게임 시작!`],
                });

                // Draw initial hand (5 cards)
                get().drawCard(5);
            },

            /**
             * Reset game to initial state
             */
            resetGame: () => {
                set(initialState);
            },

            /**
             * Draw cards from drawPile to hand
             */
            drawCard: (count: number) => {
                set((state) => {
                    let { drawPile, hand, discardPile } = state.deck;
                    const drawnCards: Card[] = [];
                    const newLogs = [...state.logs];

                    for (let i = 0; i < count; i++) {
                        // If drawPile is empty, shuffle discardPile into drawPile
                        if (drawPile.length === 0) {
                            if (discardPile.length === 0) {
                                newLogs.push('⚠️ 더 이상 뽑을 카드가 없습니다.');
                                break; // No cards left to draw
                            }
                            drawPile = shuffleArray(discardPile);
                            discardPile = [];
                            newLogs.push('🔄 덱을 섞었습니다.');
                        }

                        const card = drawPile.pop();
                        if (card) {
                            drawnCards.push(card);
                        }
                    }

                    return {
                        deck: {
                            drawPile: [...drawPile],
                            hand: [...hand, ...drawnCards],
                            discardPile: [...discardPile],
                        },
                        logs: newLogs,
                    };
                });
            },

            /**
             * Play a card from hand
             */
            playCard: (cardInstanceId: string) => {
                const state = get();
                const cardIndex = state.deck.hand.findIndex(
                    (c) => c.instanceId === cardInstanceId
                );

                if (cardIndex === -1) {
                    set((s) => ({
                        logs: [...s.logs, '❌ 카드를 찾을 수 없습니다.'],
                    }));
                    return;
                }

                const card = state.deck.hand[cardIndex];

                // Check if card is playable
                if (card.unplayable) {
                    set((s) => ({
                        logs: [...s.logs, `❌ ${card.name}은(는) 사용할 수 없는 카드입니다.`],
                    }));
                    return;
                }

                // Check cost
                const { food = 0, production = 0, science = 0 } = card.cost;
                if (
                    state.resources.food < food ||
                    state.resources.production < production ||
                    state.resources.science < science
                ) {
                    set((s) => ({
                        logs: [...s.logs, `❌ 자원이 부족합니다. (필요: 식량 ${food}, 생산 ${production}, 과학 ${science})`],
                    }));
                    return;
                }

                // Deduct cost
                const newResources: Resources = {
                    food: state.resources.food - food,
                    production: state.resources.production - production,
                    science: state.resources.science - science,
                };

                // Remove card from hand
                const newHand = [...state.deck.hand];
                newHand.splice(cardIndex, 1);

                // Apply card effect
                const effectResult = card.effect(state);

                // Merge effect result with current state
                const mergedResources = {
                    ...newResources,
                    ...(effectResult.resources || {}),
                };

                // Determine where the card goes after being played
                let newDiscardPile = [...state.deck.discardPile];
                let newStructures = [...state.field.structures];
                let newUnits = [...state.field.units];

                if (card.type === 'structure') {
                    newStructures.push(card);
                } else if (card.type === 'unit') {
                    newUnits.push(card);
                } else {
                    // Action, Tech, Crisis -> Discard
                    newDiscardPile.push(card);
                }

                set({
                    resources: mergedResources,
                    deck: {
                        ...state.deck,
                        hand: newHand,
                        discardPile: newDiscardPile,
                    },
                    field: {
                        structures: newStructures,
                        units: newUnits,
                    },
                    // Merge any other state changes from effect
                    era: effectResult.era ?? state.era,
                    playerStats: effectResult.playerStats ?? state.playerStats,
                    logs: [...state.logs, `✅ ${card.name} 사용!`],
                });
            },

            /**
             * Discard a specific card from hand
             */
            discardCard: (cardInstanceId: string) => {
                set((state) => {
                    const cardIndex = state.deck.hand.findIndex(
                        (c) => c.instanceId === cardInstanceId
                    );

                    if (cardIndex === -1) return state;

                    const card = state.deck.hand[cardIndex];
                    const newHand = [...state.deck.hand];
                    newHand.splice(cardIndex, 1);

                    return {
                        deck: {
                            ...state.deck,
                            hand: newHand,
                            discardPile: [...state.deck.discardPile, card],
                        },
                        logs: [...state.logs, `🗑️ ${card.name} 버림.`],
                    };
                });
            },

            /**
             * End the current turn
             */
            endTurn: () => {
                set((state) => {
                    const newLogs = [...state.logs];

                    // --- 1. Calculate Upkeep (Food) ---
                    const unitUpkeep = state.field.units.reduce(
                        (sum, unit) => sum + (unit.stats?.upkeep || 1),
                        0
                    );
                    const structureUpkeep = state.field.structures.reduce(
                        (sum, struct) => sum + (struct.stats?.upkeep || 0),
                        0
                    );
                    const totalUpkeep = unitUpkeep + structureUpkeep;

                    let newFood = state.resources.food - totalUpkeep;
                    let newHealth = state.playerStats.health;

                    if (newFood < 0) {
                        // Starvation penalty
                        const deficit = Math.abs(newFood);
                        newHealth -= deficit * 5; // 5 damage per missing food
                        newFood = 0;
                        newLogs.push(`⚠️ 식량 부족! 피해 ${deficit * 5} 입음.`);
                    } else {
                        newLogs.push(`🍖 유지비 ${totalUpkeep} 식량 소모.`);
                    }

                    // Check game over
                    if (newHealth <= 0) {
                        newLogs.push('💀 체력 소진! 게임 오버.');
                        return {
                            ...state,
                            status: 'gameover',
                            playerStats: { ...state.playerStats, health: 0 },
                            logs: newLogs,
                        };
                    }

                    // --- 2. Trigger Structure Passives (Turn Start Effects) ---
                    let resourceGains: Resources = { food: 0, production: 0, science: 0 };
                    state.field.structures.forEach((structure) => {
                        if (structure.passive?.trigger === 'turn_start') {
                            const effectResult = structure.passive.effect(state);
                            if (effectResult.resources) {
                                resourceGains.food += effectResult.resources.food || 0;
                                resourceGains.production += effectResult.resources.production || 0;
                                resourceGains.science += effectResult.resources.science || 0;
                            }
                        }
                    });

                    if (resourceGains.food > 0 || resourceGains.production > 0 || resourceGains.science > 0) {
                        newLogs.push(`🏭 건물 생산: 식량+${resourceGains.food}, 생산+${resourceGains.production}, 과학+${resourceGains.science}`);
                    }

                    // --- 3. Reset Production & Apply Gains ---
                    const finalResources: Resources = {
                        food: newFood + resourceGains.food,
                        production: 0 + resourceGains.production, // Reset production
                        science: state.resources.science + resourceGains.science,
                    };

                    // --- 4. Discard Hand ---
                    const discardedHand = [...state.deck.hand];

                    // --- 5. Prepare for next turn ---
                    const newTurn = state.turn + 1;
                    newLogs.push(`--- 턴 ${newTurn} 시작 ---`);

                    // Create new state first (before drawing cards)
                    const newState = {
                        resources: finalResources,
                        deck: {
                            ...state.deck,
                            hand: [],
                            discardPile: [...state.deck.discardPile, ...discardedHand],
                        },
                        turn: newTurn,
                        playerStats: { ...state.playerStats, health: newHealth },
                        logs: newLogs,
                    };

                    return newState;
                });

                // Draw new hand (5 cards)
                get().drawCard(5);
            },

            /**
             * Shuffle the deck (draw pile)
             */
            shuffleDeck: () => {
                set((state) => ({
                    deck: {
                        ...state.deck,
                        drawPile: shuffleArray(state.deck.drawPile),
                    },
                    logs: [...state.logs, '🔄 덱을 섞었습니다.'],
                }));
            },

            /**
             * Add a log message
             */
            addLog: (message: string) => {
                set((state) => ({
                    logs: [...state.logs, message].slice(-50), // Keep last 50 logs
                }));
            },

            /**
             * Cheat functions for debugging
             */
            cheat: {
                addResources: (amount: number) => {
                    set((state) => ({
                        resources: {
                            food: state.resources.food + amount,
                            production: state.resources.production + amount,
                            science: state.resources.science + amount,
                        },
                        logs: [...state.logs, `[CHEAT] 자원 +${amount}`],
                    }));
                },
                drawCards: (count: number) => {
                    get().drawCard(count);
                },
            },
        }),
        { name: 'CivDeckBuilder' } // DevTools name
    )
);
