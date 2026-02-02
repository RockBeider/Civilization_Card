// Game constants and data
import age0Img from '../assets/ages/age_0_stone.png';
import age1Img from '../assets/ages/age_1_ancient.png';
import age2Img from '../assets/ages/age_2_medieval.png';
import age3Img from '../assets/ages/age_3_industrial.png';
import age4Img from '../assets/ages/age_4_modern.png';
import age5Img from '../assets/ages/age_5_space.png';
// 시대별 바닥 배경 이미지
import groundStone from '../assets/grounds/ground_stone.png';
import groundAncient from '../assets/grounds/ground_ancient.png';
import groundMedieval from '../assets/grounds/ground_medieval.png';
import groundIndustrial from '../assets/grounds/ground_industrial.png';
import groundModern from '../assets/grounds/ground_modern.png';
import groundSpace from '../assets/grounds/ground_space.png';
import raceHuman from '../assets/race_human.png';
import raceNeanderthal from '../assets/race_neanderthal.png';
import raceAtlantean from '../assets/race_atlantean.png';

// Import Cards
// Note: In a real scenario we might need to be careful about circular dependencies if Cards import constants, but they don't currently.
import { CARD_POOLS } from './cards';
import { RaceData, AgeData } from '../types/index';

/**
 * 게임 밸런싱 상수
 * 기획안에 명시된 기본값들을 정의합니다.
 */
export const GAME_CONSTANTS = {
    // 플레이어 초기 체력 (수도 내구도)
    PLAYER_HP: 50,
    PLAYER_MAX_HP: 50,

    // 매 턴 기본 제공 생산력
    BASE_PRODUCTION: 3,

    // 매 턴 드로우하는 카드 수
    HAND_SIZE: 5,

    // 필드 슬롯 제한
    FIELD_SLOTS: {
        structures: 5,
        units: 5
    },

    // 시대 발전 비용 (인덱스 = 현재 시대)
    // [원시→고대, 고대→중세, 중세→르네상스, 르네상스→산업, 산업→우주]
    ERA_COSTS: [20, 50, 100, 200, 500],

    // 기아 피해 (식량 1 부족당)
    STARVATION_DAMAGE: 5,

    // 초기 식량
    STARTING_FOOD: 10,

    // 초기 과학
    STARTING_SCIENCE: 0,

    // 위기 발생 간격 (턴)
    CRISIS_COOLDOWN_MIN: 2,
    CRISIS_COOLDOWN_MAX: 5,
} as const;


export const RACES: RaceData[] = [
    {
        id: 'human',
        name: '호모 사피엔스',
        desc: '균형 잡힌 능력. 매 턴 카드 교체.',
        bonus: { food: 0, prod: 0, sci: 0, energy: 0 }, // Bonus logic moved to GameLoop or specific perks
        img: raceHuman,
        starter_deck: ["card_worker_01", "card_worker_01", "card_worker_01", "card_worker_01", "card_research_01", "card_research_01", "card_gather_01", "card_gather_01", "card_gather_01", "card_tent_01"] // 10 cards
    },
    {
        id: 'neanderthal',
        name: '네안데르탈인',
        desc: '전투 특화. 생산력 카드가 많음.',
        bonus: { food: 0, prod: 0, sci: 0, energy: 0 },
        img: raceNeanderthal,
        starter_deck: ["card_worker_01", "card_worker_01", "card_worker_01", "card_worker_01", "card_worker_01", "card_hunt_01", "card_hunt_01", "card_hunt_01", "card_gather_01", "card_gather_01"]
    },
    {
        id: 'atlantean',
        name: '아틀란티스인',
        desc: '고효율 고비용. 시민 유지비 높음.',
        bonus: { food: 0, prod: 0, sci: 0, energy: 1 }, // Start with +1 Energy check?
        img: raceAtlantean,
        starter_deck: ["card_research_01", "card_research_01", "card_research_01", "card_worker_01", "card_worker_01", "card_gather_01", "card_gather_01", "card_gather_01", "card_gather_01", "card_gather_01"]
    }
];

export const AGES: AgeData[] = [
    { id: 0, name: '원시 시대', color: 'age-stone', img: age0Img, groundImg: groundStone, cardPool: CARD_POOLS[0] },
    { id: 1, name: '고대 시대', color: 'age-amber', img: age1Img, groundImg: groundAncient, cardPool: CARD_POOLS[1] },
    { id: 2, name: '중세 시대', color: 'age-slate', img: age2Img, groundImg: groundMedieval, cardPool: [] },
    { id: 3, name: '산업 시대', color: 'age-orange', img: age3Img, groundImg: groundIndustrial, cardPool: [] },
    { id: 4, name: '현대 시대', color: 'age-cyan', img: age4Img, groundImg: groundModern, cardPool: [] },
    { id: 5, name: '우주 시대', color: 'age-violet', img: age5Img, groundImg: groundSpace, cardPool: [] }
];

export const SLOT_PREFIX = 'civ_deck_save_slot_';
export const SLOT_COUNT = 3;
