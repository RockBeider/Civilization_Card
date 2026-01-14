export type ResourceType = 'food' | 'prod' | 'science' | 'energy';
export type CardType = 'Unit' | 'Structure' | 'Tech' | 'Action' | 'Crisis';

export interface Resources {
    energy?: number;
    food: number;
    prod: number;
    sci: number;
    [key: string]: number | undefined;
}

export interface CardCost {
    energy?: number;
    production?: number;
    science?: number;
    food?: number;
}

export interface CardEffect {
    type: string; // 'resource', 'transform_hand', 'damage', etc.
    target?: string;
    value?: number;
    result?: string; // For transform
}

export interface CardStats {
    health?: number;
    attack?: number;
    upkeep?: number;
}

export interface CardPassive {
    trigger: 'turn_start' | 'turn_end' | 'on_play';
    type: 'resource_gain' | 'stat_buff';
    value: number;
    target: string;
}

export interface CardData {
    id: string;
    name: string;
    type: CardType;
    cost: CardCost;
    effect?: CardEffect;
    stats?: CardStats;
    passive?: CardPassive;
    passive_effect?: { // Legacy support during migration (can remove later)
        type: string;
        target: string;
        value: number;
    };
    description: string;
    era: number;
    img?: string;
    uniqueId?: string; // Runtime ID
    unplayable?: boolean;
    disabled?: boolean; // UI state
}

export interface RaceData {
    id: string;
    name: string;
    desc: string;
    bonus: {
        food: number;
        prod: number;
        sci: number;
        energy?: number;
    };
    img: string; // URL or path
    starter_deck: string[];
}

export interface AgeData {
    id: number;
    name: string;
    color: string;
    img: string;
    groundImg: string;
    cardPool: string[];
}

export interface EnemyData {
    id: string;
    name: string;
    type: string;
    stats: {
        health: number;
        attack: number;
    };
    effect: {
        on_spawn?: string;
        on_turn_end?: string;
    };
    reward?: {
        resource: string;
        value: number;
    };
    era: number;
}
