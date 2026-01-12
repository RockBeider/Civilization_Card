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

export const RACES = [
    { id: 'human', name: '호모 사피엔스', desc: '균형 잡힌 능력', bonus: { food: 1.0, prod: 1.0, sci: 1.0 }, img: raceHuman },
    { id: 'neanderthal', name: '네안데르탈인', desc: '높은 생산력, 낮은 연구', bonus: { food: 0.9, prod: 1.5, sci: 0.7 }, img: raceNeanderthal },
    { id: 'atlantean', name: '아틀란티스인', desc: '높은 지능, 많은 식량 소모', bonus: { food: 0.7, prod: 0.8, sci: 1.5 }, img: raceAtlantean }
];

export const DISASTERS_BY_AGE = {
    0: [{ name: '대가뭄', type: 'resource', target: 'food', ratio: 0.3, desc: '가뭄으로 식량 30%가 유실되었습니다!' }, { name: '산불', type: 'building', target: 'farm', count: 1, desc: '산불이 번져 채집지 1곳이 불탔습니다!' }],
    1: [{ name: '대홍수', type: 'resource', target: 'food', ratio: 0.4, desc: '홍수로 식량 40%가 떠내려갔습니다!' }, { name: '지진', type: 'building', target: 'mine', count: 1, desc: '지진으로 광산 1곳이 무너졌습니다!' }],
    2: [{ name: '흑사병', type: 'resource', target: 'food', ratio: 0.5, desc: '역병으로 식량 생산이 50% 급감했습니다!' }, { name: '전쟁', type: 'resource', target: 'prod', ratio: 0.4, desc: '전쟁 발발! 생산 물자 40%가 징발되었습니다.' }],
    3: [{ name: '공장 화재', type: 'building', target: 'mine', count: 2, desc: '대형 화재로 공장 2곳이 전소되었습니다!' }, { name: '경제 대공황', type: 'resource', target: 'prod', ratio: 0.5, desc: '대공황으로 생산력이 50% 감소했습니다.' }],
    4: [{ name: '금융 위기', type: 'resource', target: 'prod', ratio: 0.6, desc: '금융 위기로 생산 자금 60%가 증발했습니다.' }, { name: '사이버 테러', type: 'resource', target: 'sci', ratio: 0.4, desc: '해킹으로 연구 데이터 40%가 삭제되었습니다.' }],
    5: [{ name: '태양 흑점 폭발', type: 'resource', target: 'sci', ratio: 0.8, desc: '강력한 자기장으로 연구 데이터 80% 손실!' }, { name: '소행성 충돌', type: 'building_all', count: 1, desc: '소행성 파편이 떨어져 모든 종류의 건물이 1개씩 파괴되었습니다!' }]
};

// Wonder Images
import wonderHuman from '../assets/wonder_human.png';
import wonderNeanderthal from '../assets/wonder_neanderthal.png';
import wonderAtlantean from '../assets/wonder_atlantean.png';

export const WONDERS = {
    human: { name: '대피라미드', desc: '위대한 유산: 모든 자원 생산량 +50%', cost: { food: 3000, prod: 3000, sci: 750 }, effect: 'all_boost', img: wonderHuman },
    neanderthal: { name: '거인의 제단', desc: '고대의 힘: 생산력 획득량 2배', cost: { food: 1500, prod: 5000, sci: 250 }, effect: 'prod_boost', img: wonderNeanderthal },
    atlantean: { name: '심해의 수정탑', desc: '잃어버린 기술: 과학 획득량 2배', cost: { food: 3000, prod: 750, sci: 3000 }, effect: 'sci_boost', img: wonderAtlantean }
};

export const AGES = [
    { id: 0, name: '원시 시대', color: 'age-stone', img: age0Img },
    { id: 1, name: '고대 시대', color: 'age-amber', img: age1Img },
    { id: 2, name: '중세 시대', color: 'age-slate', img: age2Img },
    { id: 3, name: '산업 시대', color: 'age-orange', img: age3Img },
    { id: 4, name: '현대 시대', color: 'age-cyan', img: age4Img },
    { id: 5, name: '우주 시대', color: 'age-violet', img: age5Img }
];

// Tech Images
import techFire from '../assets/techs/fire.png';
import techTools from '../assets/techs/tools.png';
import techIrrigation from '../assets/techs/irrigation.png';
import techFarming from '../assets/techs/farming.png';
import techMathematics from '../assets/techs/mathematics.png';
import techWriting from '../assets/techs/writing.png';
import techHeavyMining from '../assets/techs/heavy_mining.png';
import techCrystalPower from '../assets/techs/crystal_power.png';
import techSteel from '../assets/techs/steel.png';
import techGovernance from '../assets/techs/governance.png';
import techPrinting from '../assets/techs/printing.png';
import techBiology from '../assets/techs/biology.png';
import techSteam from '../assets/techs/steam.png';
import techWarfare from '../assets/techs/warfare.png';
import techElectricity from '../assets/techs/electricity.png';
import techInternet from '../assets/techs/internet.png';
import techGlobalization from '../assets/techs/globalization.png';
import techComputer from '../assets/techs/computer.png';
import techTimeWarp from '../assets/techs/time_warp.png';
import techRocketry from '../assets/techs/rocketry.png';
import techFtl from '../assets/techs/ftl.png';

export const TECH_TREE = [
    { id: 'tools', name: '석기 도구', cost: 20, type: 'sci', ageReq: 0, effect: 'prod_eff', desc: '생산 효율 2배', img: techTools },
    { id: 'irrigation', name: '관개 수로', cost: 60, type: 'sci', ageReq: 0, effect: 'food_eff', desc: '식량 효율 2배', img: techIrrigation },
    { id: 'fire', name: '불의 발견', cost: 10, type: 'sci', ageReq: 0, unlocks: 'ancient', desc: '고대 시대로 진입', img: techFire },

    { id: 'farming', name: '농경 시작', cost: 100, type: 'sci', ageReq: 1, reqTech: 'irrigation', effect: 'food_eff', desc: '식량 효율 2배', img: techFarming },
    { id: 'mathematics', name: '수학', cost: 300, type: 'sci', ageReq: 1, reqTech: 'fire', effect: 'sci_eff', desc: '과학 효율 2배', img: techMathematics },
    { id: 'heavy_mining', name: '중채굴', cost: 300, type: 'sci', ageReq: 1, reqTech: 'tools', reqRace: 'neanderthal', effect: 'prod_eff', desc: '생산 효율 2배 (네안데르탈인 전용)', img: techHeavyMining },
    { id: 'crystal_power', name: '수정 에너지', cost: 300, type: 'sci', ageReq: 1, reqTech: 'mathematics', reqRace: 'atlantean', effect: 'sci_eff', desc: '과학 효율 2배 (아틀란티스인 전용)', img: techCrystalPower },
    { id: 'writing', name: '문자 발명', cost: 200, type: 'sci', ageReq: 1, reqTech: 'mathematics', unlocks: 'medieval', desc: '중세 시대로 진입', img: techWriting },

    { id: 'steel', name: '강철 제련', cost: 500, type: 'sci', ageReq: 2, reqTech: 'tools', effect: 'prod_eff', desc: '생산 효율 2배', img: techSteel },
    { id: 'governance', name: '통치 체제', cost: 1000, type: 'sci', ageReq: 2, reqTech: 'farming', reqRace: 'human', effect: 'food_eff', desc: '식량/생산 효율 증가 (인간 전용)', img: techGovernance },
    { id: 'printing', name: '인쇄술', cost: 800, type: 'sci', ageReq: 2, reqTech: 'writing', unlocks: 'industrial', desc: '산업 시대로 진입', img: techPrinting },

    { id: 'biology', name: '생물학', cost: 2500, type: 'sci', ageReq: 3, reqTech: 'farming', effect: 'food_eff', desc: '식량 효율 2배', img: techBiology },
    { id: 'steam', name: '증기 기관', cost: 2000, type: 'sci', ageReq: 3, reqTech: 'steel', effect: 'auto_prod', desc: '자동 생산력 증가', img: techSteam },
    { id: 'warfare', name: '총력전', cost: 3000, type: 'sci', ageReq: 3, reqTech: 'steam', reqRace: 'neanderthal', effect: 'prod_eff', desc: '생산 효율 3배 (네안데르탈인 전용)', img: techWarfare },
    { id: 'electricity', name: '전기', cost: 3500, type: 'sci', ageReq: 3, reqTech: 'printing', unlocks: 'modern', desc: '현대 시대로 진입', img: techElectricity },

    { id: 'internet', name: '인터넷', cost: 6000, type: 'sci', ageReq: 4, reqTech: 'electricity', effect: 'sci_eff', desc: '과학 효율 2배', img: techInternet },
    { id: 'globalization', name: '세계화', cost: 7000, type: 'sci', ageReq: 4, reqTech: 'internet', reqRace: 'human', effect: 'all_eff', desc: '모든 효율 증가 (인간 전용)', img: techGlobalization },
    { id: 'computer', name: '컴퓨터', cost: 8000, type: 'sci', ageReq: 4, reqTech: 'internet', effect: 'sci_eff', desc: '과학 효율 2배', img: techComputer },
    { id: 'time_warp', name: '시간 왜곡', cost: 7000, type: 'sci', ageReq: 4, reqTech: 'computer', reqRace: 'atlantean', effect: 'sci_eff_3x', desc: '과학 효율 3배 (아틀란티스인 전용)', img: techTimeWarp },
    { id: 'rocketry', name: '로켓 공학', cost: 15000, type: 'sci', ageReq: 4, reqTech: 'computer', unlocks: 'space', desc: '우주 시대로 진입', img: techRocketry },
    { id: 'ftl', name: '초광속 여행', cost: 50000, type: 'sci', ageReq: 5, reqTech: 'rocketry', unlocks: 'win', desc: '승리', img: techFtl }
];

export const BUILDINGS = {
    farm: { name: '농장/채집지', cost: { food: 10, prod: 0, sci: 0 }, output: { food: 1, prod: 0, sci: 0 }, desc: '식량 생산' },
    mine: { name: '광산/공장', cost: { food: 20, prod: 10, sci: 0 }, output: { food: 0, prod: 1, sci: 0 }, desc: '생산력 생산' },
    lab: { name: '연구소', cost: { food: 50, prod: 50, sci: 0 }, output: { food: 0, prod: 0, sci: 1 }, desc: '과학 생산' }
};

export const SLOT_PREFIX = 'civ_save_slot_';
export const SLOT_COUNT = 3;
