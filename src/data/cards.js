export const CARDS = [
    // --- Primitive Era ---
    {
        id: "card_gather_01",
        name: "채집",
        type: "Action",
        cost: { production: 0 },
        effect: { type: "resource", target: "food", value: 2 },
        description: "식량을 2 얻습니다.",
        era: 0,
        img: "action_gather" // Placeholder for image mapping
    },
    {
        id: "card_hunt_01",
        name: "사냥",
        type: "Action",
        cost: { production: 1 },
        effect: { type: "resource", target: "food", value: 4 },
        description: "생산력 1을 소모하여 식량 4를 얻습니다.",
        era: 0,
        img: "action_hunt"
    },
    {
        id: "card_explore_01",
        name: "탐험",
        type: "Action",
        cost: { production: 1 },
        effect: { type: "resource", target: "science", value: 2 },
        description: "생산력 1을 소모하여 과학 2를 얻습니다.",
        era: 0,
        img: "action_explore"
    },
    {
        id: "card_tent_01",
        name: "움막",
        type: "Structure",
        cost: { production: 3 },
        passive_effect: { type: "resource_start", target: "food", value: 1 },
        description: "매 턴 시작 시 식량 1을 얻습니다.",
        era: 0,
        img: "structure_tent"
    },

    // --- Ancient Era ---
    {
        id: "card_farm_01",
        name: "농장",
        type: "Structure",
        cost: { production: 4 },
        passive_effect: { type: "resource_start", target: "food", value: 2 },
        description: "매 턴 시작 시 식량 2를 얻습니다.",
        era: 1,
        img: "structure_farm"
    },
    {
        id: "card_mine_01",
        name: "광산",
        type: "Structure",
        cost: { production: 5 },
        passive_effect: { type: "resource_start", target: "production", value: 1 },
        description: "매 턴 시작 시 생산력 1을 추가로 얻습니다.",
        era: 1,
        img: "structure_mine"
    },
    {
        id: "card_library_01",
        name: "도서관",
        type: "Structure",
        cost: { production: 5 },
        passive_effect: { type: "resource_start", target: "science", value: 1 },
        description: "매 턴 시작 시 과학 1을 얻습니다.",
        era: 1,
        img: "structure_library"
    },

    // --- Tech / Crisis examples (Generic) ---
    {
        id: "crisis_starvation",
        name: "기아",
        type: "Crisis",
        cost: { production: 0 },
        effect: { type: "damage", value: 10 },
        description: "턴 종료 시 체력 10 피해를 입습니다. (식량 부족시 자동 생성)",
        unplayable: true,
        era: 99
    }
];

export const CARD_POOLS = {
    0: ["card_gather_01", "card_hunt_01", "card_explore_01", "card_tent_01"],
    1: ["card_farm_01", "card_mine_01", "card_library_01"]
};
