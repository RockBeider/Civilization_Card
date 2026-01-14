import { CardData } from '../types';

export const CARDS: CardData[] = [
    // --- Primitive Action Cards (Cost: Energy) ---
    {
        id: "card_gather_01",
        name: "채집",
        type: "Action",
        cost: { energy: 0 },
        effect: { type: "resource", target: "food", value: 1 },
        description: "식량 1을 얻습니다. (소모값 0)",
        era: 0,
        img: "action_gather"
    },
    {
        id: "card_hunt_01",
        name: "사냥",
        type: "Action",
        cost: { energy: 1 },
        effect: { type: "resource", target: "food", value: 3 },
        description: "행동력 1을 소모하여 식량 3을 얻습니다.",
        era: 0,
        img: "action_hunt"
    },
    {
        id: "card_research_01",
        name: "탐구",
        type: "Action",
        cost: { energy: 1 },
        effect: { type: "resource", target: "science", value: 1 },
        description: "행동력 1을 소모하여 과학 1을 얻습니다.",
        era: 0,
        img: "action_explore"
    },
    {
        id: "card_worker_01",
        name: "일꾼",
        type: "Unit",
        cost: { energy: 1, food: 1 }, // Food cost to deploy? Or just energy? Let's keep energy for now.
        stats: { health: 2, attack: 0, upkeep: 1 },
        effect: { type: "resource", target: "prod", value: 2 }, // Immediate effect? or Passive?
        // Decisions: Workers give production when PLAYED (Action-like Unit) or when ON FIELD (Passive Unit)?
        // Design Doc says "Production resets every turn".
        // Let's make Worker an "ActionUnit" -> Plays, gives Prod, stays on field?
        // For deck builder simplicity: Play -> Gain Prod (Effect).
        // If it stays on field, it needs Passive Effect.
        // Let's stick to: Plays -> Gain Prod 2. (Like a 'Ritual').
        // But if it's a UNIT, it should defend?
        // Let's make Worker a deployed unit that gives passive production?
        // "passive": { trigger: "turn_start", type: "resource_gain", value: 1, target: "prod" }
        // Changing to: Deployed Unit. Cost: 1 Energy.
        passive: { trigger: "turn_start", type: "resource_gain", value: 1, target: "prod" },
        description: "매 턴 생산력 +1. (유지비: 식량 1)",
        era: 0,
        img: "unit_worker"
    },
    {
        id: "card_warrior_01",
        name: "전사",
        type: "Unit",
        cost: { energy: 1, production: 2 }, // Needs production to build weapons?
        stats: { health: 5, attack: 3, upkeep: 1 },
        description: "기본적인 전투 유닛입니다. (공격력 3, 체력 5)",
        era: 0,
        img: "unit_warrior"
    },

    // --- Structures (Cost: Production) ---
    {
        id: "card_tent_01",
        name: "움막",
        type: "Structure",
        cost: { production: 3 },
        stats: { health: 5, upkeep: 0 },
        passive: { trigger: "turn_start", type: "resource_gain", value: 1, target: "food" },
        description: "매 턴 식량 +1.",
        era: 0,
        img: "structure_tent"
    },
    {
        id: "card_farm_01",
        name: "비옥한 농장",
        type: "Structure",
        cost: { production: 5 },
        stats: { health: 10, upkeep: 0 },
        passive: { trigger: "turn_start", type: "resource_gain", value: 2, target: "food" },
        description: "매 턴 식량 +2.",
        era: 1,
        img: "structure_farm"
    },
    {
        id: "card_mine_01",
        name: "노천 광산",
        type: "Structure",
        cost: { production: 6 },
        stats: { health: 10, upkeep: 0 },
        passive: { trigger: "turn_start", type: "resource_gain", value: 1, target: "prod" },
        description: "매 턴 생산력 +1.",
        era: 1,
        img: "structure_mine"
    },

    // --- Tech (Cost: Science) ---
    {
        id: "tech_fire_01",
        name: "불의 발견",
        type: "Tech",
        cost: { science: 10 },
        effect: { type: "transform_hand", target: "card_gather_01", result: "card_hunt_01" },
        description: "내 덱의 [채집] 1장을 [사냥]으로 변경합니다.",
        era: 0,
        img: "tech_fire"
    },

    // --- Crisis (Penalty) ---
    {
        id: "crisis_starvation",
        name: "기아",
        type: "Crisis",
        cost: { energy: 0 },
        effect: { type: "damage", value: 5, target: "self" },
        description: "사용 불가. 턴 종료 시 보유하면 피해 5를 입습니다.",
        unplayable: true,
        era: 99,
        img: "crisis_starvation"
    }
];

export const CARD_POOLS = {
    0: ["card_gather_01", "card_hunt_01", "card_research_01", "card_worker_01", "card_warrior_01", "card_tent_01"],
    1: ["card_farm_01", "card_mine_01"]
};
