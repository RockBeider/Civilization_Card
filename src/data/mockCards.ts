// ============================================================
// Mock Cards - Sample Card Data for Testing
// ============================================================

import type { Card, GameState } from '../types';

// --- Helper: Create a resource gain effect ---
const resourceEffect = (
    resource: 'food' | 'production' | 'science',
    amount: number
) => {
    return (state: GameState): Partial<GameState> => ({
        resources: {
            ...state.resources,
            [resource]: state.resources[resource] + amount,
        },
    });
};

// --- Mock Cards ---
export const mockCards: Record<string, Card> = {
    // === Action Cards ===
    gathering: {
        id: 'gathering',
        name: '채집',
        type: 'action',
        cost: {},
        effect: resourceEffect('food', 1),
        description: '식량 +1을 얻습니다.',
        era: 1,
    },
    hunt: {
        id: 'hunt',
        name: '사냥',
        type: 'action',
        cost: { production: 1 },
        effect: resourceEffect('food', 3),
        description: '생산 1을 소모하여 식량 +3을 얻습니다.',
        era: 1,
    },
    research: {
        id: 'research',
        name: '연구',
        type: 'action',
        cost: {},
        effect: resourceEffect('science', 1),
        description: '과학 +1을 얻습니다.',
        era: 1,
    },

    // === Unit Cards ===
    worker: {
        id: 'worker',
        name: '일꾼',
        type: 'unit',
        cost: { food: 2 },
        effect: (state) => ({
            resources: {
                ...state.resources,
                production: state.resources.production + 2,
            },
        }),
        description: '배치 시 생산력 +2. 매 턴 식량 1 소모.',
        era: 1,
        stats: {
            health: 2,
            attack: 0,
            upkeep: 1,
        },
    },
    warrior: {
        id: 'warrior',
        name: '전사',
        type: 'unit',
        cost: { production: 2, food: 1 },
        effect: () => ({}), // No immediate effect
        description: '공격력 3의 전투 유닛. 매 턴 식량 1 소모.',
        era: 1,
        stats: {
            health: 5,
            attack: 3,
            upkeep: 1,
        },
    },

    // === Structure Cards ===
    farm: {
        id: 'farm',
        name: '농장',
        type: 'structure',
        cost: { production: 3 },
        effect: () => ({}), // No immediate effect
        description: '매 턴 시작 시 식량 +2를 생산합니다.',
        era: 1,
        stats: {
            health: 10,
            upkeep: 0,
        },
        passive: {
            trigger: 'turn_start',
            effect: resourceEffect('food', 2),
        },
    },
    mine: {
        id: 'mine',
        name: '광산',
        type: 'structure',
        cost: { production: 4 },
        effect: () => ({}),
        description: '매 턴 시작 시 생산력 +1을 생산합니다.',
        era: 1,
        stats: {
            health: 10,
            upkeep: 0,
        },
        passive: {
            trigger: 'turn_start',
            effect: resourceEffect('production', 1),
        },
    },
    library: {
        id: 'library',
        name: '도서관',
        type: 'structure',
        cost: { production: 5 },
        effect: () => ({}),
        description: '매 턴 시작 시 과학 +1을 생산합니다.',
        era: 1,
        stats: {
            health: 8,
            upkeep: 0,
        },
        passive: {
            trigger: 'turn_start',
            effect: resourceEffect('science', 1),
        },
    },

    // === Crisis Cards ===
    hunger: {
        id: 'hunger',
        name: '기아',
        type: 'crisis',
        cost: {},
        effect: (state) => ({
            playerStats: {
                ...state.playerStats,
                health: state.playerStats.health - 5,
            },
        }),
        description: '(사용 불가) 이 카드를 가지고 있으면 피해를 입습니다.',
        era: 99,
        unplayable: true,
    },
};

// --- Helper: Create a starter deck ---
export const createStarterDeck = (): Card[] => {
    const deck: Card[] = [];

    // 4x Gathering
    for (let i = 0; i < 4; i++) {
        deck.push({ ...mockCards.gathering });
    }

    // 3x Worker
    for (let i = 0; i < 3; i++) {
        deck.push({ ...mockCards.worker });
    }

    // 2x Hunt
    for (let i = 0; i < 2; i++) {
        deck.push({ ...mockCards.hunt });
    }

    // 1x Research
    deck.push({ ...mockCards.research });

    return deck;
};
