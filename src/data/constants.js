// Game constants and data
import age0Img from '../assets/ages/age_0_stone.png';
import age1Img from '../assets/ages/age_1_ancient.png';
import age2Img from '../assets/ages/age_2_medieval.png';
import age3Img from '../assets/ages/age_3_industrial.png';
import age4Img from '../assets/ages/age_4_modern.png';
import age5Img from '../assets/ages/age_5_space.png';
import raceHuman from '../assets/race_human.png';
import raceNeanderthal from '../assets/race_neanderthal.png';
import raceAtlantean from '../assets/race_atlantean.png';

// Import Cards
// Note: In a real scenario we might need to be careful about circular dependencies if Cards import constants, but they don't currently.
import { CARD_POOLS } from './cards';

export const RACES = [
    {
        id: 'human',
        name: '호모 사피엔스',
        desc: '균형 잡힌 능력',
        bonus: { food: 1.0, prod: 1.0, sci: 1.0 },
        img: raceHuman,
        starter_deck: ["card_gather_01", "card_gather_01", "card_gather_01", "card_hunt_01", "card_explore_01"]
    },
    {
        id: 'neanderthal',
        name: '네안데르탈인',
        desc: '높은 생산력, 낮은 연구',
        bonus: { food: 0.9, prod: 1.5, sci: 0.7 },
        img: raceNeanderthal,
        starter_deck: ["card_gather_01", "card_hunt_01", "card_hunt_01", "card_hunt_01", "card_tent_01"]
    },
    {
        id: 'atlantean',
        name: '아틀란티스인',
        desc: '높은 지능, 많은 식량 소모',
        bonus: { food: 0.7, prod: 0.8, sci: 1.5 },
        img: raceAtlantean,
        starter_deck: ["card_gather_01", "card_gather_01", "card_explore_01", "card_explore_01", "card_explore_01"]
    }
];

export const AGES = [
    { id: 0, name: '원시 시대', color: 'age-stone', img: age0Img, cardPool: CARD_POOLS[0] },
    { id: 1, name: '고대 시대', color: 'age-amber', img: age1Img, cardPool: CARD_POOLS[1] },
    { id: 2, name: '중세 시대', color: 'age-slate', img: age2Img, cardPool: [] },
    { id: 3, name: '산업 시대', color: 'age-orange', img: age3Img, cardPool: [] },
    { id: 4, name: '현대 시대', color: 'age-cyan', img: age4Img, cardPool: [] },
    { id: 5, name: '우주 시대', color: 'age-violet', img: age5Img, cardPool: [] }
];

export const SLOT_PREFIX = 'civ_deck_save_slot_';
export const SLOT_COUNT = 3;
