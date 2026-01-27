// ============================================================
// Civilization Deck Builder - Zustand Game Store
// ============================================================

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Card, GameState, GameStore, DeckState, FieldState, Resources, PhaseType } from './types';
import { GAME_CONSTANTS } from './data/constants';
import { getRandomCrisisCard, getCurseCardById } from './data/cards';

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
    food: GAME_CONSTANTS.STARTING_FOOD,
    production: 0,
    science: GAME_CONSTANTS.STARTING_SCIENCE,
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
    era: 0,
    deck: initialDeck,
    field: initialField,
    turn: 1,
    status: 'title',
    phase: 'start',
    currentCrisis: null,
    nextCrisis: null,
    playerStats: {
        health: GAME_CONSTANTS.PLAYER_HP,
        maxHealth: GAME_CONSTANTS.PLAYER_MAX_HP,
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
                    phase: 'start',
                    playerRace: race,
                    deck: {
                        drawPile: shuffledDeck,
                        hand: [],
                        discardPile: [],
                    },
                    logs: [`🎮 ${race} 종족으로 게임 시작!`],
                });

                // Execute Start Phase
                get().executeStartPhase();
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

                // Can only play cards during Action phase
                if (state.phase !== 'action') {
                    set((s) => ({
                        logs: [...s.logs, '❌ 행동 단계에서만 카드를 사용할 수 있습니다.'],
                    }));
                    return;
                }

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

                // Check cost (uses production primarily)
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

                // Check field slot limits
                if (card.type === 'structure' && state.field.structures.length >= GAME_CONSTANTS.FIELD_SLOTS.structures) {
                    set((s) => ({
                        logs: [...s.logs, `❌ 건물 슬롯이 가득 찼습니다. (최대 ${GAME_CONSTANTS.FIELD_SLOTS.structures})`],
                    }));
                    return;
                }
                if (card.type === 'unit' && state.field.units.length >= GAME_CONSTANTS.FIELD_SLOTS.units) {
                    set((s) => ({
                        logs: [...s.logs, `❌ 유닛 슬롯이 가득 찼습니다. (최대 ${GAME_CONSTANTS.FIELD_SLOTS.units})`],
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

            // ========== PHASE MANAGEMENT ==========

            /**
             * Execute Start Phase (Phase 1)
             * - Reset production to base value
             * - Trigger structure passives
             * - Draw cards
             * - Activate crisis
             */
            executeStartPhase: () => {
                const state = get();
                const newLogs = [...state.logs];

                newLogs.push(`--- 턴 ${state.turn} 준비 단계 ---`);

                // 1. Reset production to base value
                let newProduction = GAME_CONSTANTS.BASE_PRODUCTION;
                let newFood = state.resources.food;
                let newScience = state.resources.science;

                // 2. Trigger structure passives (turn_start)
                state.field.structures.forEach((structure) => {
                    if (structure.passive?.trigger === 'turn_start') {
                        const effectResult = structure.passive.effect(state);
                        if (effectResult.resources) {
                            newFood += effectResult.resources.food || 0;
                            newProduction += effectResult.resources.production || 0;
                            newScience += effectResult.resources.science || 0;
                        }
                        newLogs.push(`🏭 ${structure.name}: 효과 발동!`);
                    }
                });

                newLogs.push(`⚡ 생산력 ${newProduction} 획득`);

                // 3. Activate current crisis (from nextCrisis preview)
                const currentCrisis = state.nextCrisis;
                if (currentCrisis) {
                    newLogs.push(`⚠️ 위기 발생: ${currentCrisis.name} - ${currentCrisis.description}`);
                }

                // 4. Generate next turn crisis preview (예고 시스템)
                const nextCrisis = getRandomCrisisCard(state.era);
                if (nextCrisis) {
                    newLogs.push(`📢 다음 턴 위기 예고: ${nextCrisis.name}`);
                }

                set({
                    resources: {
                        food: newFood,
                        production: newProduction,
                        science: newScience,
                    },
                    currentCrisis: currentCrisis,
                    nextCrisis: nextCrisis,
                    phase: 'action',
                    logs: newLogs,
                });

                // 5. Draw cards (생산력 비례 드로우)
                // HandSize = 5(기본) + floor(TurnProduction / 10), 최대 10장
                const baseHandSize = GAME_CONSTANTS.HAND_SIZE; // 5
                const bonusCards = Math.floor(newProduction / 10);
                const maxHandSize = 10;
                const totalHandSize = Math.min(baseHandSize + bonusCards, maxHandSize);

                get().drawCard(totalHandSize);

                set((s) => ({
                    logs: [...s.logs, `🃏 카드 ${totalHandSize}장 드로우 (기본 ${baseHandSize} + 보너스 ${bonusCards}${totalHandSize >= maxHandSize ? ', 최대' : ''}). 행동 단계 시작!`],
                }));
            },

            /**
             * Move to next phase
             * 행동 단계에서 "턴 종료" 버튼 클릭 시 호출
             */
            nextPhase: () => {
                const state = get();

                // 행동 단계에서 턴 종료 버튼 클릭 시 → 위기+정산 처리
                if (state.phase === 'action') {
                    set({ phase: 'crisis' });
                    // endTurn()이 위기 판정 + 정산 단계를 모두 처리
                    get().endTurn();
                } else if (state.phase === 'start') {
                    // 준비 단계 완료 후 행동 단계로
                    set({ phase: 'action' });
                }
                // crisis, end 단계는 endTurn() 내부에서 자동 처리됨
            },

            /**
             * Resolve current crisis (Phase 3)
             */
            resolveCrisis: () => {
                const state = get();
                const newLogs = [...state.logs];
                let newHealth = state.playerStats.health;
                let newResources = { ...state.resources };
                let newDeck = { ...state.deck };

                newLogs.push(`--- 위기 단계 ---`);

                if (!state.currentCrisis) {
                    newLogs.push('✨ 이번 턴에는 위기가 없습니다.');
                } else {
                    const crisis = state.currentCrisis;
                    newLogs.push(`⚔️ ${crisis.name} 해결 판정...`);

                    let resolved = false;

                    // --- Combat Crisis ---
                    if (crisis.requirement.type === 'combat') {
                        const totalAttack = state.field.units.reduce(
                            (sum, unit) => sum + (unit.stats?.attack || 0),
                            0
                        );
                        const requiredAttack = crisis.requirement.value;

                        if (totalAttack >= requiredAttack) {
                            newLogs.push(`✅ 방어 성공! (아군 공격력 ${totalAttack} >= 위기 공격력 ${requiredAttack})`);
                            resolved = true;
                        } else {
                            newLogs.push(`❌ 방어 실패! (아군 공격력 ${totalAttack} < 위기 공격력 ${requiredAttack})`);
                        }
                    }
                    // --- Resource Crisis ---
                    else if (crisis.requirement.type === 'resource_check') {
                        const resource = crisis.requirement.resource!;
                        const requiredAmount = crisis.requirement.value;
                        const currentAmount = newResources[resource];

                        if (currentAmount >= requiredAmount) {
                            newResources[resource] -= requiredAmount;
                            newLogs.push(`✅ ${resource} ${requiredAmount} 소모하여 해결!`);
                            resolved = true;
                        } else {
                            newLogs.push(`❌ ${resource} 부족! (보유 ${currentAmount} < 필요 ${requiredAmount})`);
                        }
                    }
                    // --- Tech Crisis ---
                    else if (crisis.requirement.type === 'tech') {
                        const techCards = [...state.deck.hand, ...state.deck.drawPile, ...state.deck.discardPile]
                            .filter(c => c.type === 'tech');
                        const requiredCount = crisis.requirement.value;

                        if (techCards.length >= requiredCount) {
                            newLogs.push(`✅ 기술 카드 ${techCards.length}장 보유로 해결!`);
                            resolved = true;
                        } else {
                            newLogs.push(`❌ 기술 카드 부족! (보유 ${techCards.length} < 필요 ${requiredCount})`);
                        }
                    }

                    // --- Apply Penalty or Reward ---
                    if (!resolved) {
                        // Apply Penalty
                        const penalty = crisis.penalty;
                        switch (penalty.type) {
                            case 'damage_hp':
                                newHealth -= penalty.value;
                                newLogs.push(`💥 피해 ${penalty.value} 입음!`);
                                break;
                            case 'lose_resource':
                                // Lose percentage of food (value = percentage)
                                const lostFood = Math.floor(newResources.food * (penalty.value / 100));
                                newResources.food -= lostFood;
                                newLogs.push(`💸 식량 ${lostFood} 손실!`);
                                break;
                            case 'destroy_structure':
                                // Remove last structure
                                if (state.field.structures.length > 0) {
                                    newLogs.push(`🔥 건물 파괴!`);
                                }
                                break;
                            case 'add_curse_card':
                                // Add curse card to deck
                                const curseCard = getCurseCardById(penalty.targetId || 'curse_starvation');
                                if (curseCard) {
                                    for (let i = 0; i < penalty.value; i++) {
                                        const instantiated = { ...curseCard, instanceId: Math.random().toString(36).substring(2, 11) };
                                        newDeck.drawPile = [...newDeck.drawPile, instantiated];
                                    }
                                    newDeck.drawPile = shuffleArray(newDeck.drawPile);
                                    newLogs.push(`😱 저주 카드 "${curseCard.name}" ${penalty.value}장이 덱에 추가됨!`);
                                }
                                break;
                        }
                    } else {
                        // Apply Reward (if any)
                        if (crisis.reward) {
                            const reward = crisis.reward;
                            if (reward.type === 'gain_resource' && reward.resource && reward.value) {
                                newResources[reward.resource] += reward.value;
                                newLogs.push(`🎁 보상: ${reward.resource} +${reward.value}`);
                            }
                        }
                    }
                }

                // Check game over
                if (newHealth <= 0) {
                    newLogs.push('💀 체력 소진! 게임 오버.');
                    set({
                        status: 'gameover',
                        playerStats: { ...state.playerStats, health: 0 },
                        logs: newLogs,
                        currentCrisis: null,
                    });
                    return;
                }

                set({
                    resources: newResources,
                    deck: newDeck,
                    playerStats: { ...state.playerStats, health: newHealth },
                    logs: newLogs,
                    currentCrisis: null,
                    phase: 'end',
                });

                // Proceed to End Phase
                get().endTurn();
            },

            /**
             * End Phase (Phase 4) - 통합된 턴 종료 처리
             * 1. 위기 판정 (Crisis Resolution)
             * 2. 유지비 지불 (Pay upkeep)
             * 3. 기아 판정 (Starvation check)
             * 4. 핸드 버리기 (Discard hand)
             * 5. 턴 증가 (Increment turn)
             */
            endTurn: () => {
                const currentState = get();
                const newLogs = [...currentState.logs];
                let newHealth = currentState.playerStats.health;
                let newResources = { ...currentState.resources };
                let newDeck = { ...currentState.deck };

                // ========== 1. 위기 판정 (Crisis Resolution) ==========
                newLogs.push(`--- 위기 단계 ---`);

                if (!currentState.currentCrisis) {
                    newLogs.push('✨ 이번 턴에는 위기가 없습니다.');
                } else {
                    const crisis = currentState.currentCrisis;
                    newLogs.push(`⚔️ ${crisis.name} 해결 판정...`);

                    let resolved = false;

                    // --- Combat Crisis ---
                    if (crisis.requirement.type === 'combat') {
                        const totalAttack = currentState.field.units.reduce(
                            (sum, unit) => sum + (unit.stats?.attack || 0),
                            0
                        );
                        const requiredAttack = crisis.requirement.value;

                        if (totalAttack >= requiredAttack) {
                            newLogs.push(`✅ 방어 성공! (아군 공격력 ${totalAttack} >= 위기 공격력 ${requiredAttack})`);
                            resolved = true;
                        } else {
                            newLogs.push(`❌ 방어 실패! (아군 공격력 ${totalAttack} < 위기 공격력 ${requiredAttack})`);
                        }
                    }
                    // --- Resource Crisis ---
                    else if (crisis.requirement.type === 'resource_check') {
                        const resource = crisis.requirement.resource!;
                        const requiredAmount = crisis.requirement.value;
                        const currentAmount = newResources[resource];

                        if (currentAmount >= requiredAmount) {
                            newResources[resource] -= requiredAmount;
                            newLogs.push(`✅ ${resource} ${requiredAmount} 소모하여 해결!`);
                            resolved = true;
                        } else {
                            newLogs.push(`❌ ${resource} 부족! (보유 ${currentAmount} < 필요 ${requiredAmount})`);
                        }
                    }
                    // --- Tech Crisis ---
                    else if (crisis.requirement.type === 'tech') {
                        const techCards = [...currentState.deck.hand, ...currentState.deck.drawPile, ...currentState.deck.discardPile]
                            .filter(c => c.type === 'tech');
                        const requiredCount = crisis.requirement.value;

                        if (techCards.length >= requiredCount) {
                            newLogs.push(`✅ 기술 카드 ${techCards.length}장 보유로 해결!`);
                            resolved = true;
                        } else {
                            newLogs.push(`❌ 기술 카드 부족! (보유 ${techCards.length} < 필요 ${requiredCount})`);
                        }
                    }

                    // --- Apply Penalty or Reward ---
                    if (!resolved) {
                        const penalty = crisis.penalty;
                        switch (penalty.type) {
                            case 'damage_hp':
                                newHealth -= penalty.value;
                                newLogs.push(`💥 피해 ${penalty.value} 입음!`);
                                break;
                            case 'lose_resource':
                                const lostFood = Math.floor(newResources.food * (penalty.value / 100));
                                newResources.food -= lostFood;
                                newLogs.push(`💸 식량 ${lostFood} 손실!`);
                                break;
                            case 'destroy_structure':
                                if (currentState.field.structures.length > 0) {
                                    newLogs.push(`🔥 건물 파괴!`);
                                }
                                break;
                            case 'add_curse_card':
                                const curseCard = getCurseCardById(penalty.targetId || 'curse_starvation');
                                if (curseCard) {
                                    for (let i = 0; i < penalty.value; i++) {
                                        const instantiated = { ...curseCard, instanceId: Math.random().toString(36).substring(2, 11) };
                                        newDeck.drawPile = [...newDeck.drawPile, instantiated];
                                    }
                                    newDeck.drawPile = shuffleArray(newDeck.drawPile);
                                    newLogs.push(`😱 저주 카드 "${curseCard.name}" ${penalty.value}장이 덱에 추가됨!`);
                                }
                                break;
                        }
                    } else {
                        // Apply Reward (if any)
                        if (crisis.reward) {
                            const reward = crisis.reward;
                            if (reward.type === 'gain_resource' && reward.resource && reward.value) {
                                newResources[reward.resource] += reward.value;
                                newLogs.push(`🎁 보상: ${reward.resource} +${reward.value}`);
                            }
                        }
                    }
                }

                // Check game over from crisis
                if (newHealth <= 0) {
                    newLogs.push('💀 체력 소진! 게임 오버.');
                    set({
                        status: 'gameover',
                        playerStats: { ...currentState.playerStats, health: 0 },
                        logs: newLogs,
                        currentCrisis: null,
                    });
                    return;
                }

                // ========== 2. 정산 단계 (End Phase) ==========
                newLogs.push(`--- 정산 단계 ---`);

                // --- 유지비 계산 (Upkeep) ---
                const unitUpkeep = currentState.field.units.reduce(
                    (sum, unit) => sum + (unit.stats?.upkeep || 1),
                    0
                );
                const structureUpkeep = currentState.field.structures.reduce(
                    (sum, struct) => sum + (struct.stats?.upkeep || 0),
                    0
                );
                const totalUpkeep = unitUpkeep + structureUpkeep;

                let newFood = newResources.food - totalUpkeep;

                // --- 기아 판정 (Starvation Check) ---
                if (newFood < 0) {
                    const deficit = Math.abs(newFood);
                    const damage = deficit * GAME_CONSTANTS.STARVATION_DAMAGE;
                    newHealth -= damage;
                    newFood = 0;
                    newLogs.push(`⚠️ 식량 부족! 피해 ${damage} 입음. (부족량: ${deficit})`);
                } else {
                    newLogs.push(`🍖 유지비 ${totalUpkeep} 식량 소모.`);
                }

                // Check game over from starvation
                if (newHealth <= 0) {
                    newLogs.push('💀 체력 소진! 게임 오버.');
                    set({
                        status: 'gameover',
                        playerStats: { ...currentState.playerStats, health: 0 },
                        logs: newLogs,
                    });
                    return;
                }

                // --- 핸드 버리기 ---
                const discardedHand = [...currentState.deck.hand];
                newLogs.push(`🗑️ 핸드 ${discardedHand.length}장 버림.`);

                // --- 턴 증가 ---
                const newTurn = currentState.turn + 1;
                newLogs.push(`✨ 턴 ${currentState.turn} 종료. 다음 턴 준비...`);

                // Update state
                set({
                    resources: {
                        ...newResources,
                        food: newFood,
                        production: 0,
                    },
                    deck: {
                        ...newDeck,
                        hand: [],
                        discardPile: [...newDeck.discardPile, ...discardedHand],
                    },
                    turn: newTurn,
                    phase: 'start' as PhaseType,
                    playerStats: { ...currentState.playerStats, health: newHealth },
                    currentCrisis: null,
                    logs: newLogs,
                });

                // Start next turn
                get().executeStartPhase();
            },

            /**
             * Advance to next era
             */
            advanceEra: () => {
                const state = get();
                const currentEra = state.era;

                if (currentEra >= 5) {
                    // Victory condition: Space age reached
                    set((s) => ({
                        status: 'victory',
                        logs: [...s.logs, '🎉 우주 시대에 도달했습니다! 승리!'],
                    }));
                    return;
                }

                const cost = GAME_CONSTANTS.ERA_COSTS[currentEra];

                if (state.resources.science < cost) {
                    set((s) => ({
                        logs: [...s.logs, `❌ 과학이 부족합니다. (필요: ${cost}, 보유: ${state.resources.science})`],
                    }));
                    return;
                }

                set((s) => ({
                    era: currentEra + 1,
                    resources: {
                        ...s.resources,
                        science: s.resources.science - cost,
                    },
                    logs: [...s.logs, `🎊 시대 발전! 시대 ${currentEra + 1}로 진입!`],
                }));
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
