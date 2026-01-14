import { EnemyData } from '../types';

export const ENEMIES: EnemyData[] = [
    {
        id: "enemy_barbarian_01",
        name: "야만인 정찰병",
        type: "Barbarian",
        stats: {
            health: 5,
            attack: 2
        },
        effect: {
            on_spawn: "이웃한 건물이 있다면 1개 파괴합니다.",
            on_turn_end: "플레이어에게 피해 2를 입힙니다."
        },
        reward: {
            resource: "food",
            value: 5
        },
        era: 0
    },
    {
        id: "enemy_wolf_01",
        name: "늑대 무리",
        type: "Barbarian",
        stats: {
            health: 3,
            attack: 3
        },
        effect: {
            on_turn_end: "식량 2를 약탈합니다. 식량이 없으면 피해 3을 입힙니다."
        },
        reward: {
            resource: "food",
            value: 3
        },
        era: 0
    }
];

export const CRISES: any[] = [
    {
        id: "crisis_drought_01",
        name: "가뭄",
        type: "Disaster",
        // Crisis represents a global effect or a 'Status' enemy that needs to be solved
        stats: {
            health: 10 // Need to 'heal' or 'repair' (spend resources) to remove?
            // Or 'Cost to solve'
        },
        solve_cost: {
            food: 5,
            production: 5
        },
        effect: {
            on_turn_end: "농장의 생산량이 0이 됩니다."
        },
        description: "가뭄이 들었습니다. 식량 5와 생산 5를 사용하여 관개 시설을 보수해야 합니다."
    }
];
