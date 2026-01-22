import { CardData, EraType, CrisisCardData, Card, GameState } from '../types';

// ============================================================
// 저주(Curse) 카드 데이터 - 덱에 섞여 들어가는 패널티 카드
// ============================================================
export const CURSE_CARDS: Card[] = [
    {
        id: "curse_starvation",
        name: "기아",
        type: "crisis",
        era: 0,
        cost: {},
        description: "뽑는 즉시 체력 5를 잃습니다.",
        unplayable: true,
        effect: (state: GameState) => ({
            playerStats: {
                ...state.playerStats,
                health: state.playerStats.health - 5
            }
        })
    },
    {
        id: "curse_plague",
        name: "전염병",
        type: "crisis",
        era: 1,
        cost: {},
        description: "뽑는 즉시 유닛 1개가 사라집니다.",
        unplayable: true,
        effect: (state: GameState) => ({
            field: {
                ...state.field,
                units: state.field.units.slice(0, -1) // 마지막 유닛 제거
            }
        })
    },
    {
        id: "curse_despair",
        name: "절망",
        type: "crisis",
        era: 0,
        cost: {},
        description: "뽑는 즉시 이번 턴 생산력 -2.",
        unplayable: true,
        effect: (state: GameState) => ({
            resources: {
                ...state.resources,
                production: Math.max(0, state.resources.production - 2)
            }
        })
    },
    {
        id: "curse_rebellion",
        name: "반란",
        type: "crisis",
        era: 2,
        cost: {},
        description: "뽑는 즉시 건물 1개가 파괴됩니다.",
        unplayable: true,
        effect: (state: GameState) => ({
            field: {
                ...state.field,
                structures: state.field.structures.slice(0, -1)
            }
        })
    }
];

// 저주 카드 ID로 찾기
export const getCurseCardById = (id: string): Card | undefined => {
    return CURSE_CARDS.find(c => c.id === id);
};

// ============================================================
// 위기(Crisis) 카드 데이터
// ============================================================
export const CRISIS_CARDS: CrisisCardData[] = [
    // --- 원시 시대 위기 ---
    {
        id: "crisis_drought",
        name: "대가뭄",
        type: "crisis",
        era: 0,
        cost: {},
        description: "식량을 비축하지 않으면 백성이 굶주립니다.",
        unplayable: true,
        requirement: { type: "resource_check", resource: "food", value: 5 },
        penalty: { type: "damage_hp", value: 10 },
        reward: { type: "gain_resource", resource: "science", value: 3 }
    },
    {
        id: "crisis_barbarian_raid",
        name: "야만인 습격",
        type: "crisis",
        era: 0,
        cost: {},
        description: "야만인들이 마을을 공격합니다!",
        unplayable: true,
        stats: { attack: 3 },
        requirement: { type: "combat", value: 3 },
        penalty: { type: "damage_hp", value: 5 },
        reward: { type: "gain_resource", resource: "food", value: 3 }
    },
    // --- 고대 위기 ---
    {
        id: "crisis_plague",
        name: "역병",
        type: "crisis",
        era: 1,
        cost: {},
        description: "전염병이 창궐합니다. 식량을 소모하여 치료하세요.",
        unplayable: true,
        requirement: { type: "resource_check", resource: "food", value: 8 },
        penalty: { type: "add_curse_card", value: 1, targetId: "curse_plague" },
        reward: { type: "gain_resource", resource: "science", value: 5 }
    },
    {
        id: "crisis_barbarian_horde",
        name: "야만인 대군",
        type: "crisis",
        era: 1,
        cost: {},
        description: "대규모 야만인 군대가 침공합니다!",
        unplayable: true,
        stats: { attack: 6 },
        requirement: { type: "combat", value: 6 },
        penalty: { type: "damage_hp", value: 10 },
        reward: { type: "gain_resource", resource: "food", value: 5 }
    },
    // --- 중세 위기 ---
    {
        id: "crisis_siege",
        name: "포위 공격",
        type: "crisis",
        era: 2,
        cost: {},
        description: "적군이 성을 포위했습니다!",
        unplayable: true,
        stats: { attack: 10 },
        requirement: { type: "combat", value: 10 },
        penalty: { type: "damage_hp", value: 20 },
        reward: { type: "gain_resource", resource: "production", value: 5 }
    },
    {
        id: "crisis_famine",
        name: "대기근",
        type: "crisis",
        era: 2,
        cost: {},
        description: "흉작으로 백성들이 굶주립니다.",
        unplayable: true,
        requirement: { type: "resource_check", resource: "food", value: 15 },
        penalty: { type: "lose_resource", value: 100 }, // 모든 식량 손실
        reward: { type: "gain_resource", resource: "science", value: 10 }
    },
    // --- 특수형 위기 (Tech) ---
    {
        id: "crisis_tech_regression",
        name: "기술 퇴보",
        type: "crisis",
        era: 1,
        cost: {},
        description: "과학 발전이 정체됩니다. 기술 카드가 필요합니다!",
        unplayable: true,
        requirement: { type: "tech", value: 1 }, // 기술 카드 1장 보유 필요
        penalty: { type: "add_curse_card", value: 1, targetId: "curse_despair" },
        reward: { type: "gain_resource", resource: "science", value: 10 }
    },
    {
        id: "crisis_dark_age",
        name: "암흑기",
        type: "crisis",
        era: 2,
        cost: {},
        description: "문명이 쇠퇴합니다. 고급 기술이 필요합니다!",
        unplayable: true,
        requirement: { type: "tech", value: 2 },
        penalty: { type: "add_curse_card", value: 2, targetId: "curse_rebellion" },
        reward: { type: "gain_resource", resource: "science", value: 20 }
    },
    // --- 원시 시대 추가 위기 ---
    {
        id: "crisis_harsh_winter",
        name: "혹독한 겨울",
        type: "crisis",
        era: 0,
        cost: {},
        description: "매서운 추위가 몰아칩니다. 식량을 비축하세요!",
        unplayable: true,
        requirement: { type: "resource_check", resource: "food", value: 3 },
        penalty: { type: "damage_hp", value: 3 },
        reward: { type: "gain_resource", resource: "production", value: 2 }
    },
    // --- 고대 추가 위기 ---
    {
        id: "crisis_flood",
        name: "홍수",
        type: "crisis",
        era: 1,
        cost: {},
        description: "강이 범람합니다! 제방을 쌓아야 합니다.",
        unplayable: true,
        requirement: { type: "resource_check", resource: "production", value: 5 },
        penalty: { type: "destroy_structure", value: 1 },
        reward: { type: "gain_resource", resource: "food", value: 5 }
    },
    // --- 중세 추가 위기 ---
    {
        id: "crisis_black_death",
        name: "흑사병",
        type: "crisis",
        era: 2,
        cost: {},
        description: "죽음의 역병이 퍼집니다. 의학 지식이 필요합니다!",
        unplayable: true,
        requirement: { type: "tech", value: 1 },
        penalty: { type: "add_curse_card", value: 2, targetId: "curse_plague" },
        reward: { type: "gain_resource", resource: "science", value: 15 }
    },
    {
        id: "crisis_crusade",
        name: "십자군 원정",
        type: "crisis",
        era: 2,
        cost: {},
        description: "대규모 군대가 침공합니다!",
        unplayable: true,
        stats: { attack: 15 },
        requirement: { type: "combat", value: 15 },
        penalty: { type: "damage_hp", value: 15 },
        reward: { type: "gain_resource", resource: "food", value: 10 }
    },
    // --- 산업 시대 위기 ---
    {
        id: "crisis_smog",
        name: "스모그",
        type: "crisis",
        era: 4,
        cost: {},
        description: "공장 매연이 도시를 뒤덮습니다. 환경 기술이 필요합니다!",
        unplayable: true,
        requirement: { type: "tech", value: 2 },
        penalty: { type: "lose_resource", value: 50 }, // 생산력 50% 손실 효과
        reward: { type: "gain_resource", resource: "science", value: 20 }
    },
    {
        id: "crisis_world_war",
        name: "세계 대전",
        type: "crisis",
        era: 4,
        cost: {},
        description: "세계적 전쟁이 발발합니다!",
        unplayable: true,
        stats: { attack: 30 },
        requirement: { type: "combat", value: 30 },
        penalty: { type: "damage_hp", value: 30 },
        reward: { type: "gain_resource", resource: "production", value: 20 }
    },
    // --- 우주 시대 위기 ---
    {
        id: "crisis_alien_invasion",
        name: "외계 침공",
        type: "crisis",
        era: 5,
        cost: {},
        description: "외계 함대가 지구를 공격합니다! 방어하지 못하면 멸망합니다.",
        unplayable: true,
        stats: { attack: 50 },
        requirement: { type: "combat", value: 50 },
        penalty: { type: "damage_hp", value: 999 }, // 게임 오버급 피해
        reward: { type: "gain_resource", resource: "science", value: 100 }
    },
    {
        id: "crisis_ai_rebellion",
        name: "AI 반란",
        type: "crisis",
        era: 5,
        cost: {},
        description: "인공지능이 반란을 일으킵니다! 고급 과학 지식이 필요합니다.",
        unplayable: true,
        requirement: { type: "tech", value: 3 },
        penalty: { type: "add_curse_card", value: 3, targetId: "curse_rebellion" },
        reward: { type: "gain_resource", resource: "science", value: 50 }
    }
];

// 시대별 위기 카드 풀 가져오기
export const getCrisisCardsForEra = (era: number): CrisisCardData[] => {
    return CRISIS_CARDS.filter(c => c.era <= era);
};

// 랜덤 위기 카드 가져오기
export const getRandomCrisisCard = (era: number): CrisisCardData | null => {
    const pool = getCrisisCardsForEra(era);
    if (pool.length === 0) return null;
    return pool[Math.floor(Math.random() * pool.length)];
};


// 시대별 카드 데이터
export interface EraCardGroup {
    era: EraType;
    cards: CardData[];
}

// 전체 카드 데이터 (시대별로 그룹화)
export const CARDS_BY_ERA: EraCardGroup[] = [
    {
        era: "Primitive",
        cards: [
            {
                id: "p_gather",
                name: "채집",
                type: "action",
                era: 0,
                cost: { production: 0 },
                effect: { type: "gain_resource", resource: "food", value: 2 },
                description: "생존을 위한 가장 기초적인 활동입니다."
            },
            {
                id: "p_warrior",
                name: "돌도끼 전사",
                type: "unit",
                era: 0,
                cost: { production: 2 },
                stats: { attack: 2, health: 3, upkeep: 1 },
                description: "투박한 무기를 든 부족의 수호자입니다."
            },
            {
                id: "p_slinger",
                name: "투석병",
                type: "unit",
                era: 0,
                cost: { production: 2 },
                stats: { attack: 3, health: 1, upkeep: 1 },
                description: "멀리서 돌을 던져 공격하지만 맷집이 약합니다."
            },
            {
                id: "p_cave",
                name: "동굴 거주지",
                type: "structure",
                era: 0,
                cost: { production: 3 },
                stats: { health: 10 },
                passive: { trigger: "turn_start", type: "gain_resource", target: "production", value: 1 },
                description: "비바람을 피하는 안식처입니다."
            },
            {
                id: "p_wall",
                name: "나무 방벽",
                type: "structure",
                era: 0,
                cost: { production: 2 },
                stats: { health: 15 },
                effect: { type: "special", value: 3 },
                description: "야만인의 침입을 막기 위해 뾰족한 나무를 세웠습니다."
            },
            {
                id: "p_fire",
                name: "불의 발견",
                type: "tech",
                era: 0,
                cost: { science: 0 },
                effect: { type: "buff", target: "self_units", value: 1 },
                description: "어둠을 밝히고 맹수를 쫓아냅니다."
            }
        ]
    },
    {
        era: "Ancient",
        cards: [
            {
                id: "a_irrigation",
                name: "관개 수로",
                type: "action",
                era: 1,
                cost: { production: 2 },
                effect: { type: "gain_resource", resource: "food", value: 5 },
                description: "물을 다스려 풍요를 가져옵니다."
            },
            {
                id: "a_spearman",
                name: "장창병",
                type: "unit",
                era: 1,
                cost: { production: 3 },
                stats: { attack: 3, health: 5, upkeep: 2 },
                description: "기병과 야만인에게 효과적인 긴 창을 사용합니다."
            },
            {
                id: "a_farm",
                name: "비옥한 농장",
                type: "structure",
                era: 1,
                cost: { production: 4 },
                stats: { health: 5 },
                passive: { trigger: "turn_start", type: "gain_resource", target: "food", value: 3 },
                description: "안정적인 식량 공급원입니다. 방어에는 취약합니다."
            },
            {
                id: "a_library",
                name: "대도서관",
                type: "structure",
                era: 1,
                cost: { production: 5 },
                stats: { health: 5 },
                passive: { trigger: "turn_start", type: "gain_resource", target: "science", value: 2 },
                description: "지혜를 모아 다음 시대로 나아갑니다."
            },
            {
                id: "a_wall",
                name: "돌 성벽",
                type: "structure",
                era: 1,
                cost: { production: 5 },
                stats: { health: 30 },
                effect: { type: "special", value: 7 },
                description: "쉽게 무너지지 않는 견고한 돌벽입니다."
            }
        ]
    },
    {
        era: "Medieval",
        cards: [
            {
                id: "m_tax",
                name: "징세",
                type: "action",
                era: 2,
                cost: { production: 1 },
                effect: { type: "gain_resource", resource: "production", value: 5 },
                description: "영주가 백성들에게 자원을 걷습니다."
            },
            {
                id: "m_knight",
                name: "중갑 기사",
                type: "unit",
                era: 2,
                cost: { production: 5 },
                stats: { attack: 7, health: 6, upkeep: 3 },
                description: "강력한 돌격으로 전선을 돌파합니다."
            },
            {
                id: "m_crossbow",
                name: "석궁병",
                type: "unit",
                era: 2,
                cost: { production: 4 },
                stats: { attack: 6, health: 3, upkeep: 2 },
                description: "두꺼운 갑옷도 뚫을 수 있는 강력한 원거리 유닛입니다."
            },
            {
                id: "m_castle",
                name: "거대 성곽",
                type: "structure",
                era: 2,
                cost: { production: 8 },
                stats: { health: 50 },
                effect: { type: "special", value: 12 },
                description: "난공불락의 요새입니다."
            },
            {
                id: "m_guild",
                name: "상인 길드",
                type: "structure",
                era: 2,
                cost: { production: 4 },
                stats: { health: 10 },
                passive: { trigger: "turn_start", type: "draw", value: 1 },
                description: "부를 축적하여 더 많은 기회를 창출합니다."
            }
        ]
    },
    {
        era: "Renaissance",
        cards: [
            {
                id: "r_explore",
                name: "신대륙 탐험",
                type: "action",
                era: 3,
                cost: { production: 3 },
                effect: { type: "draw", value: 3 },
                description: "미지의 세계에서 새로운 자원과 지식을 가져옵니다."
            },
            {
                id: "r_musket",
                name: "머스킷 병",
                type: "unit",
                era: 3,
                cost: { production: 4 },
                stats: { attack: 10, health: 4, upkeep: 3 },
                description: "화약을 사용하는 현대적 보병의 시초입니다."
            },
            {
                id: "r_cannon",
                name: "대포",
                type: "unit",
                era: 3,
                cost: { production: 6 },
                stats: { attack: 15, health: 3, upkeep: 4 },
                description: "적의 성벽과 방어선을 무너뜨리는 압도적 화력입니다."
            },
            {
                id: "r_university",
                name: "대학",
                type: "structure",
                era: 3,
                cost: { production: 6 },
                stats: { health: 10 },
                passive: { trigger: "turn_start", type: "gain_resource", target: "science", value: 5 },
                description: "체계적인 학문 연구가 이루어집니다."
            },
            {
                id: "r_printing",
                name: "금속 활자",
                type: "tech",
                era: 3,
                cost: { science: 0 },
                effect: { type: "special" },
                description: "지식의 전파 속도가 혁명적으로 빨라집니다."
            }
        ]
    },
    {
        era: "Industrial",
        cards: [
            {
                id: "i_railroad",
                name: "철도망",
                type: "action",
                era: 4,
                cost: { production: 2 },
                effect: { type: "gain_resource", resource: "production", value: 10 },
                description: "물류의 혁명으로 생산 효율이 급증합니다."
            },
            {
                id: "i_infantry",
                name: "참호 보병",
                type: "unit",
                era: 4,
                cost: { production: 5 },
                stats: { attack: 12, health: 12, upkeep: 4 },
                description: "참호를 파고 끈질기게 버티는 방어형 보병입니다."
            },
            {
                id: "i_tank",
                name: "전차",
                type: "unit",
                era: 4,
                cost: { production: 8 },
                stats: { attack: 20, health: 15, upkeep: 6 },
                description: "전장의 판도를 바꾸는 강철의 야수입니다."
            },
            {
                id: "i_factory",
                name: "대형 공장",
                type: "structure",
                era: 4,
                cost: { production: 7 },
                stats: { health: 20 },
                passive: { trigger: "turn_start", type: "gain_resource", target: "production", value: 8 },
                description: "검은 연기를 내뿜으며 끊임없이 물자를 생산합니다."
            },
            {
                id: "i_bunker",
                name: "지하 벙커",
                type: "structure",
                era: 4,
                cost: { production: 6 },
                stats: { health: 40 },
                effect: { type: "special", value: 15 },
                description: "폭격에도 견딜 수 있는 콘크리트 요새입니다."
            }
        ]
    },
    {
        era: "Space",
        cards: [
            {
                id: "s_fusion",
                name: "핵융합 발전",
                type: "action",
                era: 5,
                cost: { production: 0 },
                effect: { type: "gain_resource", resource: "production", value: 50 },
                description: "무한한 청정 에너지를 손에 넣었습니다."
            },
            {
                id: "s_marine",
                name: "우주 해병",
                type: "unit",
                era: 5,
                cost: { production: 10 },
                stats: { attack: 30, health: 25, upkeep: 8 },
                description: "강화복을 입고 어떤 환경에서도 작전이 가능합니다."
            },
            {
                id: "s_shield",
                name: "행성 방어막",
                type: "structure",
                era: 5,
                cost: { production: 15 },
                stats: { health: 100 },
                effect: { type: "special", value: 30 },
                description: "궤도 폭격조차 막아내는 에너지 장막입니다."
            },
            {
                id: "s_lab",
                name: "반중력 연구소",
                type: "structure",
                era: 5,
                cost: { production: 10 },
                stats: { health: 20 },
                passive: { trigger: "turn_start", type: "gain_resource", target: "science", value: 20 },
                description: "물리 법칙을 초월한 기술을 연구합니다."
            },
            {
                id: "s_rocket",
                name: "알파 센타우리 우주선",
                type: "structure",
                era: 5,
                cost: { production: 50 },
                stats: { health: 50 },
                effect: { type: "special" },
                description: "인류의 새로운 터전을 찾아 떠나는 방주입니다. 5턴 유지 시 승리!"
            }
        ]
    }
];

// 플랫 카드 리스트 (기존 호환용)
export const CARDS: CardData[] = CARDS_BY_ERA.flatMap(group => group.cards);

// 시대별 카드 ID 풀 (기존 호환용)
export const CARD_POOLS: Record<number, string[]> = {
    0: CARDS_BY_ERA.find(g => g.era === 'Primitive')?.cards.map(c => c.id) || [],
    1: CARDS_BY_ERA.find(g => g.era === 'Ancient')?.cards.map(c => c.id) || [],
    2: CARDS_BY_ERA.find(g => g.era === 'Medieval')?.cards.map(c => c.id) || [],
    3: CARDS_BY_ERA.find(g => g.era === 'Renaissance')?.cards.map(c => c.id) || [],
    4: CARDS_BY_ERA.find(g => g.era === 'Industrial')?.cards.map(c => c.id) || [],
    5: CARDS_BY_ERA.find(g => g.era === 'Space')?.cards.map(c => c.id) || []
};

// ID로 카드 찾기 헬퍼
export const getCardById = (id: string): CardData | undefined => {
    return CARDS.find(c => c.id === id);
};

// 시대로 카드 목록 찾기 헬퍼
export const getCardsByEra = (era: EraType): CardData[] => {
    return CARDS_BY_ERA.find(g => g.era === era)?.cards || [];
};
