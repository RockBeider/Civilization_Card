// ============================================================
// Civilization Deck Builder - Type Definitions
// ============================================================

// --- Resource Types ---
export type ResourceType = 'food' | 'production' | 'science';

// --- Card Types ---
export type CardType = 'action' | 'structure' | 'unit' | 'tech' | 'crisis';

// --- Era Types ---
export type EraType = 'Primitive' | 'Ancient' | 'Medieval' | 'Renaissance' | 'Industrial' | 'Space';

// 시대 번호 매핑 (기존 숫자 시스템과의 호환용)
export const ERA_MAP: Record<number, EraType> = {
    0: 'Primitive',
    1: 'Ancient',
    2: 'Medieval',
    3: 'Renaissance',
    4: 'Industrial',
    5: 'Space'
};

// --- Effect Types ---
export type EffectType = 'gain_resource' | 'buff' | 'draw' | 'damage' | 'special' | 'resource' | 'transform_hand' | 'resource_gain';
export type EffectTargetType = 'player' | 'enemy' | 'self_units' | 'self' | 'food' | 'prod' | 'science';

// --- Phase Types ---
export type PhaseType = 'start' | 'action' | 'crisis' | 'end';

// --- Game Status ---
export type GameStatus = 'title' | 'race_selection' | 'playing' | 'gameover' | 'victory';

// --- Crisis Requirement ---
export interface CrisisRequirement {
    type: 'resource_check' | 'combat' | 'tech';
    resource?: ResourceType;
    value: number;
}

// --- Crisis Penalty ---
export interface CrisisPenalty {
    type: 'damage_hp' | 'destroy_structure' | 'add_curse_card' | 'lose_resource';
    value: number;
    targetId?: string;  // 덱에 추가될 저주 카드 ID
}

// --- Crisis Reward (성공 보상) ---
export interface CrisisReward {
    type: 'gain_resource' | 'gain_card';
    resource?: ResourceType;
    value?: number;
    cardId?: string;    // 획득할 카드 ID
}

// --- Crisis Card Data ---
export interface CrisisCardData extends CardData {
    requirement: CrisisRequirement;
    penalty: CrisisPenalty;
    reward?: CrisisReward;  // 성공 보상 (옵션)
}

// --- Resources State ---
export interface Resources {
    food: number;
    production: number;
    science: number;
}

// --- Card Definition (Runtime) ---
export interface Card {
    id: string;
    name: string;
    type: CardType;
    cost: Partial<Record<ResourceType, number>>;
    /**
     * Effect function that takes current state and returns partial state updates.
     * This allows cards to have complex, dynamic effects.
     */
    effect: (state: GameState) => Partial<GameState>;
    description: string;
    era: number;
    /**
     * Optional stats for units/structures
     */
    stats?: {
        health?: number;
        attack?: number;
        upkeep?: number; // Food consumed per turn
    };
    /**
     * Passive effect triggered at turn start (for structures)
     */
    passive?: {
        trigger: 'turn_start' | 'turn_end';
        effect: (state: GameState) => Partial<GameState>;
    };
    /**
     * If true, this card cannot be played by the player (e.g., Crisis cards)
     */
    unplayable?: boolean;
    /**
     * Runtime unique ID for card instances in deck
     */
    instanceId?: string;
    /**
     * Image path or identifier
     */
    image?: string;
}

// --- Card Data Definition (Static data from cards.ts) ---
export interface CardData {
    id: string;             // 고유 ID
    name: string;           // 카드 이름
    type: string;           // 카드 종류 (Action, Unit, Structure, Tech, Crisis)
    era: number;            // 등장 시대 (0: 원시 ~ 5: 우주)
    cost: Partial<Record<string, number>>; // 비용 (energy, food, production, science)
    description: string;    // 카드 설명
    img?: string;           // 이미지 경로/식별자

    // 유닛/건물 전용 스탯
    stats?: {
        attack?: number;      // 공격력 (유닛/위기)
        health?: number;      // 체력/내구도 (유닛/건물)
        upkeep?: number;      // 턴당 식량 소모량 (유닛)
    };

    // 효과 (로직 처리를 위한 식별자 및 수치)
    effect?: {
        type: EffectType;           // 효과 타입
        target?: EffectTargetType | string;  // 대상
        value?: number;             // 효과 수치
        resource?: ResourceType;    // 대상 자원
        result?: string;            // 변환 결과 (transform_hand용)
    };

    // 패시브 효과 (턴 시작/종료 시 발동)
    passive?: {
        trigger: 'turn_start' | 'turn_end';
        type: EffectType;
        target?: string;
        value?: number;
    };

    // 플레이 불가능 플래그 (위기 카드 등)
    unplayable?: boolean;
}


// --- Deck State ---
export interface DeckState {
    drawPile: Card[];
    hand: Card[];
    discardPile: Card[];
}

// --- Field State (Deployed cards) ---
export interface FieldState {
    structures: Card[];
    units: Card[];
}

// --- Complete Game State ---
export interface GameState {
    // Core Resources
    resources: Resources;
    era: number;

    // Deck Management
    deck: DeckState;

    // Field (Deployed Cards)
    field: FieldState;

    // Turn Counter
    turn: number;

    // Game Status
    status: GameStatus;

    // Current Phase
    phase: PhaseType;

    // Current Active Crisis
    currentCrisis: CrisisCardData | null;

    // Next Turn Crisis (예고)
    nextCrisis: CrisisCardData | null;

    // Crisis Cooldown (위기 발생까지 남은 턴 수)
    crisisCooldown: number;

    // Player Stats
    playerStats: {
        health: number;
        maxHealth: number;
    };

    /**
     * Selected Race ID (e.g., 'human', 'elf')
     */
    playerRace: string | null;

    // Shop State
    shopCards: Card[];

    // Log Messages
    logs: string[];
}

// --- Game Actions (Zustand Store Methods) ---
export interface GameActions {
    // Game Flow
    enterRaceSelection: () => void;
    startGame: (starterDeck: Card[], race: string) => void;
    resetGame: () => void;

    // Card Actions
    drawCard: (count: number) => void;
    playCard: (cardInstanceId: string) => void;
    discardCard: (cardInstanceId: string) => void;

    // Shop Actions
    refreshShop: () => void;
    buyCard: (card: Card) => void;
    removeCard: (cardInstanceId: string) => void;

    // Phase Management
    nextPhase: () => void;
    executeStartPhase: () => void;
    resolveCrisis: () => void;

    // Turn Management (Legacy - now handled by phases)
    endTurn: () => void;

    // Era Advancement
    advanceEra: () => void;

    // Utility
    shuffleDeck: () => void;
    addLog: (message: string) => void;

    // Cheats (for debugging)
    cheat: {
        addResources: (amount: number) => void;
        drawCards: (count: number) => void;
    };
}

// --- Combined Store Type ---
export type GameStore = GameState & GameActions;
