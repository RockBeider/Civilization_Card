/**
 * ============================================================
 * Full Game Simulation - Complete Game Loop Until Ending
 * ============================================================
 *
 * 이 스크립트는 게임의 전체 루프를 시뮬레이션합니다:
 * - 턴 진행 (준비 -> 행동 -> 위기 -> 정산)
 * - 자원 관리
 * - 카드 플레이
 * - 위기 발생 및 해결
 * - 시대 발전
 * - 승리/패배 조건
 */

// ============================================================
// 타입 정의
// ============================================================
interface Resources {
    food: number;
    production: number;
    science: number;
}

interface CardStats {
    attack?: number;
    health?: number;
    upkeep?: number;
}

interface Card {
    id: string;
    name: string;
    type: 'action' | 'structure' | 'unit' | 'crisis';
    cost: Partial<Resources>;
    effect?: (state: GameState) => Partial<GameState>;
    stats?: CardStats;
    passive?: { trigger: 'turn_start'; effect: (state: GameState) => Partial<Resources> };
    instanceId?: string;
    unplayable?: boolean;
}

interface Crisis {
    id: string;
    name: string;
    description: string;
    requirement: { type: 'combat' | 'resource_check'; value: number; resource?: keyof Resources };
    penalty: { type: 'damage_hp' | 'lose_resource'; value: number };
    reward?: { type: 'gain_resource'; resource: keyof Resources; value: number };
}

type PhaseType = 'start' | 'action' | 'crisis' | 'end';
type GameStatus = 'playing' | 'victory' | 'gameover';

interface GameState {
    resources: Resources;
    era: number;
    turn: number;
    phase: PhaseType;
    status: GameStatus;
    playerStats: { health: number; maxHealth: number };
    deck: { drawPile: Card[]; hand: Card[]; discardPile: Card[] };
    field: { structures: Card[]; units: Card[] };
    shopCards: Card[];
    currentCrisis: Crisis | null;
    nextCrisis: Crisis | null;
    crisisCooldown: number;
    logs: string[];
}

// ============================================================
// 게임 상수
// ============================================================
const GAME_CONSTANTS = {
    PLAYER_HP: 50,
    PLAYER_MAX_HP: 50,
    BASE_PRODUCTION: 3,
    HAND_SIZE: 5,
    STARTING_FOOD: 10,
    STARTING_SCIENCE: 0,
    STARVATION_DAMAGE: 5,
    ERA_COSTS: [20, 50, 100, 200, 500],
    MAX_ERA: 5,
    MAX_TURNS: 100,
    CRISIS_COOLDOWN_MIN: 2,
    CRISIS_COOLDOWN_MAX: 5,
};

// ============================================================
// 헬퍼 함수
// ============================================================
const generateId = (): string => Math.random().toString(36).substring(2, 11);

const shuffleArray = <T>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

const instantiate = (card: Card): Card => ({ ...card, instanceId: generateId() });

const log = (state: GameState, msg: string): void => {
    state.logs.push(msg);
    console.log(msg);
};

const getRandomCooldown = (): number => {
    return Math.floor(Math.random() * (GAME_CONSTANTS.CRISIS_COOLDOWN_MAX - GAME_CONSTANTS.CRISIS_COOLDOWN_MIN + 1)) + GAME_CONSTANTS.CRISIS_COOLDOWN_MIN;
};

// ============================================================
// 카드 데이터
// ============================================================
const CARD_TEMPLATES: Card[] = [
    { id: 'gather', name: '채집', type: 'action', cost: {}, effect: (s) => ({ resources: { ...s.resources, food: s.resources.food + 1 } }) },
    { id: 'hunt', name: '사냥', type: 'action', cost: { production: 1 }, effect: (s) => ({ resources: { ...s.resources, food: s.resources.food + 3 } }) },
    { id: 'research', name: '연구', type: 'action', cost: {}, effect: (s) => ({ resources: { ...s.resources, science: s.resources.science + 1 } }) },
    { id: 'worker', name: '일꾼', type: 'unit', cost: { production: 2 }, stats: { attack: 0, health: 2, upkeep: 1 }, effect: (s) => ({ resources: { ...s.resources, production: s.resources.production + 2 } }) },
    { id: 'warrior', name: '전사', type: 'unit', cost: { production: 3 }, stats: { attack: 3, health: 5, upkeep: 1 }, effect: () => ({}) },
    { id: 'farm', name: '농장', type: 'structure', cost: { production: 3 }, stats: { upkeep: 0 }, passive: { trigger: 'turn_start', effect: () => ({ food: 2, production: 0, science: 0 }) } },
    { id: 'library', name: '도서관', type: 'structure', cost: { production: 5 }, stats: { upkeep: 0 }, passive: { trigger: 'turn_start', effect: () => ({ food: 0, production: 0, science: 1 }) } },
];

const CRISIS_TEMPLATES: Crisis[] = [
    { id: 'raid', name: '야만인 습격', description: '전투력 3 이상 필요', requirement: { type: 'combat', value: 3 }, penalty: { type: 'damage_hp', value: 10 }, reward: { type: 'gain_resource', resource: 'food', value: 5 } },
    { id: 'famine', name: '기근', description: '식량 5 필요', requirement: { type: 'resource_check', value: 5, resource: 'food' }, penalty: { type: 'damage_hp', value: 8 } },
    { id: 'disease', name: '역병', description: '과학 3 필요', requirement: { type: 'resource_check', value: 3, resource: 'science' }, penalty: { type: 'damage_hp', value: 15 } },
];

// ============================================================
// 시작 덱 생성
// ============================================================
const createStarterDeck = (): Card[] => {
    const deck: Card[] = [];
    for (let i = 0; i < 4; i++) deck.push(instantiate(CARD_TEMPLATES[0]));
    for (let i = 0; i < 2; i++) deck.push(instantiate(CARD_TEMPLATES[1]));
    for (let i = 0; i < 2; i++) deck.push(instantiate(CARD_TEMPLATES[2]));
    for (let i = 0; i < 2; i++) deck.push(instantiate(CARD_TEMPLATES[3]));
    return shuffleArray(deck);
};

// ============================================================
// 상점 로직
// ============================================================
const getShopCards = (era: number): Card[] => {
    const available = CARD_TEMPLATES.filter(c => c.type !== 'crisis');
    return Array(3).fill(null).map(() => instantiate(available[Math.floor(Math.random() * available.length)]));
};

// ============================================================
// 위기 생성
// ============================================================
const getRandomCrisis = (era: number): Crisis => {
    const crisis = CRISIS_TEMPLATES[Math.floor(Math.random() * CRISIS_TEMPLATES.length)];
    return {
        ...crisis,
        requirement: { ...crisis.requirement, value: crisis.requirement.value + era },
        penalty: { ...crisis.penalty, value: crisis.penalty.value + era * 2 },
    };
};

// ============================================================
// 게임 상태 초기화
// ============================================================
const initGame = (): GameState => {
    const deck = createStarterDeck();
    return {
        resources: { food: GAME_CONSTANTS.STARTING_FOOD, production: GAME_CONSTANTS.BASE_PRODUCTION, science: GAME_CONSTANTS.STARTING_SCIENCE },
        era: 0,
        turn: 1,
        phase: 'start',
        status: 'playing',
        playerStats: { health: GAME_CONSTANTS.PLAYER_HP, maxHealth: GAME_CONSTANTS.PLAYER_MAX_HP },
        deck: { drawPile: deck, hand: [], discardPile: [] },
        field: { structures: [], units: [] },
        shopCards: getShopCards(0),
        currentCrisis: null,
        nextCrisis: null,
        crisisCooldown: getRandomCooldown(),
        logs: [],
    };
};

// ============================================================
// 카드 드로우
// ============================================================
const drawCards = (state: GameState, count: number): void => {
    for (let i = 0; i < count; i++) {
        if (state.deck.drawPile.length === 0) {
            if (state.deck.discardPile.length === 0) break;
            state.deck.drawPile = shuffleArray(state.deck.discardPile);
            state.deck.discardPile = [];
            log(state, '🔄 덱 재셔플');
        }
        const card = state.deck.drawPile.pop();
        if (card) state.deck.hand.push(card);
    }
};

// ============================================================
// 준비 단계
// ============================================================
const executeStartPhase = (state: GameState): void => {
    log(state, `\n========== 턴 ${state.turn} 준비 단계 ==========`);

    state.resources.production = GAME_CONSTANTS.BASE_PRODUCTION;

    state.field.structures.forEach(struct => {
        if (struct.passive?.trigger === 'turn_start') {
            const bonus = struct.passive.effect(state);
            state.resources.food += bonus.food || 0;
            state.resources.production += bonus.production || 0;
            state.resources.science += bonus.science || 0;
            log(state, `🏭 ${struct.name}: 효과 발동`);
        }
    });

    state.shopCards = getShopCards(state.era);

    // 위기 쿨다운 체크
    if (state.crisisCooldown > 0) {
        state.crisisCooldown--;
        log(state, `🛡️ 평화로운 턴 (다음 위기까지 ${state.crisisCooldown}턴)`);
        state.currentCrisis = null;
    } else {
        state.currentCrisis = state.nextCrisis || getRandomCrisis(state.era);
        state.nextCrisis = getRandomCrisis(state.era);
        state.crisisCooldown = getRandomCooldown();
        if (state.currentCrisis) {
            log(state, `⚠️ 위기 발생: ${state.currentCrisis.name} (다음 위기까지 ${state.crisisCooldown}턴)`);
        }
    }

    drawCards(state, GAME_CONSTANTS.HAND_SIZE);

    log(state, `📊 자원: 식량 ${state.resources.food}, 생산 ${state.resources.production}, 과학 ${state.resources.science}`);
    log(state, `🃏 손패: ${state.deck.hand.length}장`);

    state.phase = 'action';
};

// ============================================================
// 행동 단계 (AI 시뮬레이션)
// ============================================================
const executeActionPhase = (state: GameState): void => {
    log(state, `\n---------- 행동 단계 ----------`);

    let played = true;
    while (played && state.deck.hand.length > 0) {
        played = false;
        for (let i = 0; i < state.deck.hand.length; i++) {
            const card = state.deck.hand[i];
            if (card.unplayable) continue;

            const cost = card.cost;
            const canAfford =
                (cost.food || 0) <= state.resources.food &&
                (cost.production || 0) <= state.resources.production &&
                (cost.science || 0) <= state.resources.science;

            if (canAfford) {
                state.resources.food -= cost.food || 0;
                state.resources.production -= cost.production || 0;
                state.resources.science -= cost.science || 0;

                if (card.effect) {
                    const result = card.effect(state);
                    if (result.resources) state.resources = { ...state.resources, ...result.resources };
                }

                state.deck.hand.splice(i, 1);
                if (card.type === 'structure') {
                    state.field.structures.push(card);
                    log(state, `🏗️ ${card.name} 건설`);
                } else if (card.type === 'unit') {
                    state.field.units.push(card);
                    log(state, `⚔️ ${card.name} 징집`);
                } else {
                    state.deck.discardPile.push(card);
                    log(state, `▶️ ${card.name} 사용`);
                }

                played = true;
                break;
            }
        }
    }

    if (state.resources.production >= 3 && state.shopCards.length > 0) {
        const affordable = state.shopCards.filter(c => (c.cost.production || 0) <= state.resources.production);
        if (affordable.length > 0) {
            const card = affordable[0];
            state.resources.production -= card.cost.production || 0;
            state.deck.discardPile.push(instantiate(card));
            state.shopCards = state.shopCards.filter(c => c.instanceId !== card.instanceId);
            log(state, `💰 상점: ${card.name} 구매`);
        }
    }

    const eraCost = GAME_CONSTANTS.ERA_COSTS[state.era];
    if (state.era < GAME_CONSTANTS.MAX_ERA && state.resources.science >= eraCost) {
        state.resources.science -= eraCost;
        state.era++;
        log(state, `🎊 시대 발전! -> 시대 ${state.era}`);

        if (state.era >= GAME_CONSTANTS.MAX_ERA) {
            state.status = 'victory';
            log(state, `🏆 우주 시대 도달! 승리!`);
            return;
        }
    }

    state.phase = 'crisis';
};

// ============================================================
// 위기 단계
// ============================================================
const executeCrisisPhase = (state: GameState): void => {
    log(state, `\n---------- 위기 단계 ----------`);

    if (!state.currentCrisis) {
        log(state, `✨ 이번 턴에는 위기가 없습니다.`);
        state.phase = 'end';
        return;
    }

    const crisis = state.currentCrisis;
    let resolved = false;

    if (crisis.requirement.type === 'combat') {
        const totalAttack = state.field.units.reduce((sum, u) => sum + (u.stats?.attack || 0), 0);
        if (totalAttack >= crisis.requirement.value) {
            log(state, `✅ ${crisis.name} 방어 성공! (공격력 ${totalAttack} >= ${crisis.requirement.value})`);
            resolved = true;
        } else {
            log(state, `❌ ${crisis.name} 방어 실패! (공격력 ${totalAttack} < ${crisis.requirement.value})`);
        }
    } else if (crisis.requirement.type === 'resource_check') {
        const resource = crisis.requirement.resource!;
        const current = state.resources[resource];
        if (current >= crisis.requirement.value) {
            state.resources[resource] -= crisis.requirement.value;
            log(state, `✅ ${crisis.name} 해결! (${resource} ${crisis.requirement.value} 소모)`);
            resolved = true;
        } else {
            log(state, `❌ ${crisis.name} 해결 실패! (${resource} ${current} < ${crisis.requirement.value})`);
        }
    }

    if (!resolved) {
        if (crisis.penalty.type === 'damage_hp') {
            state.playerStats.health -= crisis.penalty.value;
            log(state, `💥 피해 ${crisis.penalty.value} 입음! (체력: ${state.playerStats.health}/${state.playerStats.maxHealth})`);
        }
    } else if (crisis.reward) {
        state.resources[crisis.reward.resource] += crisis.reward.value;
        log(state, `🎁 보상: ${crisis.reward.resource} +${crisis.reward.value}`);
    }

    state.currentCrisis = null;
    state.phase = 'end';

    if (state.playerStats.health <= 0) {
        state.status = 'gameover';
        log(state, `💀 체력 소진! 게임 오버.`);
    }
};

// ============================================================
// 정산 단계
// ============================================================
const executeEndPhase = (state: GameState): void => {
    log(state, `\n---------- 정산 단계 ----------`);

    const unitUpkeep = state.field.units.reduce((sum, u) => sum + (u.stats?.upkeep || 1), 0);
    state.resources.food -= unitUpkeep;
    log(state, `🍖 유지비: ${unitUpkeep} 식량 소모`);

    if (state.resources.food < 0) {
        const deficit = Math.abs(state.resources.food);
        const damage = deficit * GAME_CONSTANTS.STARVATION_DAMAGE;
        state.playerStats.health -= damage;
        state.resources.food = 0;
        log(state, `⚠️ 기아! 피해 ${damage} (부족량: ${deficit})`);

        if (state.playerStats.health <= 0) {
            state.status = 'gameover';
            log(state, `💀 체력 소진! 게임 오버.`);
            return;
        }
    }

    state.deck.discardPile.push(...state.deck.hand);
    state.deck.hand = [];

    state.turn++;
    state.phase = 'start';

    log(state, `📊 턴 종료. 체력: ${state.playerStats.health}/${state.playerStats.maxHealth}`);
};

// ============================================================
// 메인 게임 루프
// ============================================================
const runSimulation = (): void => {
    console.log('╔════════════════════════════════════════╗');
    console.log('║   문명 카드 게임 - 전체 시뮬레이션    ║');
    console.log('║   (위기 발생: 2~5턴 간격)              ║');
    console.log('╚════════════════════════════════════════╝\n');

    const state = initGame();
    log(state, `🎮 게임 시작! 목표: 시대 ${GAME_CONSTANTS.MAX_ERA} (우주 시대) 도달`);
    log(state, `🛡️ 첫 위기까지 ${state.crisisCooldown}턴`);

    while (state.status === 'playing' && state.turn <= GAME_CONSTANTS.MAX_TURNS) {
        switch (state.phase) {
            case 'start':
                executeStartPhase(state);
                break;
            case 'action':
                executeActionPhase(state);
                break;
            case 'crisis':
                executeCrisisPhase(state);
                break;
            case 'end':
                executeEndPhase(state);
                break;
        }

        if (state.status !== 'playing') break;
    }

    console.log('\n╔════════════════════════════════════════╗');
    if (state.status === 'victory') {
        console.log('║            🏆 승리! 🏆                 ║');
    } else if (state.status === 'gameover') {
        console.log('║            💀 패배... 💀               ║');
    } else {
        console.log('║        ⏰ 최대 턴 도달 (무승부)        ║');
    }
    console.log('╚════════════════════════════════════════╝');

    console.log(`\n📊 최종 통계:`);
    console.log(`   - 총 턴: ${state.turn - 1}`);
    console.log(`   - 최종 시대: ${state.era}`);
    console.log(`   - 최종 체력: ${state.playerStats.health}/${state.playerStats.maxHealth}`);
    console.log(`   - 건물 수: ${state.field.structures.length}`);
    console.log(`   - 유닛 수: ${state.field.units.length}`);
    console.log(`   - 덱 크기: ${state.deck.drawPile.length + state.deck.hand.length + state.deck.discardPile.length}장`);
};

runSimulation();
