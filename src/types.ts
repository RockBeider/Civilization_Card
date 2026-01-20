// ============================================================
// Civilization Deck Builder - Type Definitions
// ============================================================

// --- Resource Types ---
export type ResourceType = 'food' | 'production' | 'science';

// --- Card Types ---
export type CardType = 'action' | 'structure' | 'unit' | 'tech' | 'crisis';

// --- Game Status ---
export type GameStatus = 'title' | 'race_selection' | 'playing' | 'gameover' | 'victory';

// --- Resources State ---
export interface Resources {
    food: number;
    production: number;
    science: number;
}

// --- Card Definition ---
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

    // Player Stats
    playerStats: {
        health: number;
        maxHealth: number;
    };

    /**
     * Selected Race ID (e.g., 'human', 'elf')
     */
    playerRace: string | null;

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

    // Turn Management
    endTurn: () => void;

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
