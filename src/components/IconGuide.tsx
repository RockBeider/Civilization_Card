// ============================================================
// IconGuide.tsx - 시대별 아이콘 & 이미지 가이드 페이지
// ============================================================

import React from 'react';
import {
    SwordIcon,
    BowIcon,
    StoneAxeIcon,
    StoneColumnIcon,
    CastleTowerIcon,
    CompassIcon,
    GearIcon,
    RocketNetworkIcon,
} from './ui/GameIcons';

// Resource Icons (PNG)
import iconProduction from '../assets/icon_production.png';
import iconFood from '../assets/icon_food.png';
import iconScience from '../assets/icon_science.png';
import iconCrisis from '../assets/icon_crisis.png';
import iconWheat from '../assets/icon_wheat.png';
import iconBook from '../assets/icon_book.png';

// Asset imports - Ages
import AgeStone from '../assets/ages/age_0_stone.png';
import AgeAncient from '../assets/ages/age_1_ancient.png';
import AgeMedieval from '../assets/ages/age_2_medieval.png';
import AgeIndustrial from '../assets/ages/age_3_industrial.png';
import AgeModern from '../assets/ages/age_4_modern.png';
import AgeSpace from '../assets/ages/age_5_space.png';

// Asset imports - Grounds
import GroundStone from '../assets/grounds/ground_stone.png';
import GroundAncient from '../assets/grounds/ground_ancient.png';
import GroundMedieval from '../assets/grounds/ground_medieval.png';
import GroundIndustrial from '../assets/grounds/ground_industrial.png';
import GroundModern from '../assets/grounds/ground_modern.png';
import GroundSpace from '../assets/grounds/ground_space.png';

// Asset imports - Races
import RaceHuman from '../assets/race_human.png';
import RaceNeanderthal from '../assets/race_neanderthal.png';
import RaceAtlantean from '../assets/race_atlantean.png';

// Asset imports - Wonders
import WonderHuman from '../assets/wonder_human.png';
import WonderNeanderthal from '../assets/wonder_neanderthal.png';
import WonderAtlantean from '../assets/wonder_atlantean.png';

// Asset imports - Technologies
import TechFire from '../assets/techs/fire.png';
import TechTools from '../assets/techs/tools.png';
import TechFarming from '../assets/techs/farming.png';
import TechWriting from '../assets/techs/writing.png';
import TechGovernance from '../assets/techs/governance.png';
import TechIrrigation from '../assets/techs/irrigation.png';
import TechMathematics from '../assets/techs/mathematics.png';
import TechWarfare from '../assets/techs/warfare.png';
import TechHeavyMining from '../assets/techs/heavy_mining.png';
import TechPrinting from '../assets/techs/printing.png';
import TechSteam from '../assets/techs/steam.png';
import TechSteel from '../assets/techs/steel.png';
import TechElectricity from '../assets/techs/electricity.png';
import TechBiology from '../assets/techs/biology.png';
import TechGlobalization from '../assets/techs/globalization.png';
import TechComputer from '../assets/techs/computer.png';
import TechInternet from '../assets/techs/internet.png';
import TechRocketry from '../assets/techs/rocketry.png';
import TechCrystalPower from '../assets/techs/crystal_power.png';
import TechTimeWarp from '../assets/techs/time_warp.png';
import TechFtl from '../assets/techs/ftl.png';

import '../styles/icon-guide.scss';

const IconGuide: React.FC = () => {
    return (
        <div className="icon-guide">
            <header className="icon-guide__header">
                <h1>🎮 Civilization Card - 아이콘 & 이미지 가이드</h1>
                <p>게임에서 사용되는 모든 아이콘과 이미지 에셋을 시대별로 정리한 가이드입니다.</p>
            </header>

            {/* 시대 아이콘 (SVG) */}
            <section className="icon-guide__section">
                <h2>⏳ 시대 아이콘 (Era Icons - SVG)</h2>
                <div className="icon-grid icon-grid--svg">
                    <div className="icon-item">
                        <StoneAxeIcon size={64} />
                        <span className="icon-item__name">원시 시대</span>
                        <code>StoneAxeIcon</code>
                    </div>
                    <div className="icon-item">
                        <StoneColumnIcon size={64} />
                        <span className="icon-item__name">고대 시대</span>
                        <code>StoneColumnIcon</code>
                    </div>
                    <div className="icon-item">
                        <CastleTowerIcon size={64} />
                        <span className="icon-item__name">중세 시대</span>
                        <code>CastleTowerIcon</code>
                    </div>
                    <div className="icon-item">
                        <CompassIcon size={64} />
                        <span className="icon-item__name">르네상스</span>
                        <code>CompassIcon</code>
                    </div>
                    <div className="icon-item">
                        <GearIcon size={64} />
                        <span className="icon-item__name">산업 시대</span>
                        <code>GearIcon</code>
                    </div>
                    <div className="icon-item">
                        <RocketNetworkIcon size={64} />
                        <span className="icon-item__name">우주 시대</span>
                        <code>RocketNetworkIcon</code>
                    </div>
                </div>
            </section>

            {/* 리소스 아이콘 */}
            <section className="icon-guide__section">
                <h2>📦 리소스 아이콘 (Resource Icons - PNG)</h2>
                <div className="icon-grid icon-grid--svg">
                    <div className="icon-item">
                        <img src={iconProduction} alt="생산력" style={{ width: 64, height: 64 }} />
                        <span className="icon-item__name">생산력</span>
                        <code>icon_production.png</code>
                    </div>
                    <div className="icon-item">
                        <img src={iconFood} alt="식량" style={{ width: 64, height: 64 }} />
                        <span className="icon-item__name">식량</span>
                        <code>icon_food.png</code>
                    </div>
                    <div className="icon-item">
                        <img src={iconScience} alt="과학" style={{ width: 64, height: 64 }} />
                        <span className="icon-item__name">과학</span>
                        <code>icon_science.png</code>
                    </div>
                </div>
            </section>

            {/* 카드 타입 아이콘 */}
            <section className="icon-guide__section">
                <h2>🃏 카드 타입 아이콘 (Card Type Icons)</h2>
                <div className="icon-grid icon-grid--svg">
                    <div className="icon-item">
                        <img src={iconCrisis} alt="위기" style={{ width: 64, height: 64 }} />
                        <span className="icon-item__name">위기</span>
                        <code>icon_crisis.png</code>
                    </div>
                    <div className="icon-item">
                        <img src={iconWheat} alt="농장" style={{ width: 64, height: 64 }} />
                        <span className="icon-item__name">농장</span>
                        <code>icon_wheat.png</code>
                    </div>
                    <div className="icon-item">
                        <img src={iconBook} alt="도서관" style={{ width: 64, height: 64 }} />
                        <span className="icon-item__name">도서관</span>
                        <code>icon_book.png</code>
                    </div>
                    <div className="icon-item">
                        <SwordIcon size={64} />
                        <span className="icon-item__name">기사</span>
                        <code>SwordIcon</code>
                    </div>
                    <div className="icon-item">
                        <BowIcon size={64} />
                        <span className="icon-item__name">궁수</span>
                        <code>BowIcon</code>
                    </div>
                </div>
            </section>

            {/* 시대 배경 이미지 */}
            <section className="icon-guide__section">
                <h2>🏔️ 시대 배경 이미지 (Age Background)</h2>
                <p className="section-desc">각 시대별 게임 배경으로 사용되는 일러스트 이미지입니다.</p>
                <div className="icon-grid icon-grid--image">
                    <div className="image-item">
                        <img src={AgeStone} alt="원시 시대" />
                        <span className="image-item__name">원시 시대</span>
                        <code>age_0_stone.png</code>
                    </div>
                    <div className="image-item">
                        <img src={AgeAncient} alt="고대 시대" />
                        <span className="image-item__name">고대 시대</span>
                        <code>age_1_ancient.png</code>
                    </div>
                    <div className="image-item">
                        <img src={AgeMedieval} alt="중세 시대" />
                        <span className="image-item__name">중세 시대</span>
                        <code>age_2_medieval.png</code>
                    </div>
                    <div className="image-item">
                        <img src={AgeIndustrial} alt="산업 시대" />
                        <span className="image-item__name">산업 시대</span>
                        <code>age_3_industrial.png</code>
                    </div>
                    <div className="image-item">
                        <img src={AgeModern} alt="현대" />
                        <span className="image-item__name">현대</span>
                        <code>age_4_modern.png</code>
                    </div>
                    <div className="image-item">
                        <img src={AgeSpace} alt="우주 시대" />
                        <span className="image-item__name">우주 시대</span>
                        <code>age_5_space.png</code>
                    </div>
                </div>
            </section>

            {/* 시대 지형 이미지 */}
            <section className="icon-guide__section">
                <h2>🌍 시대 지형 이미지 (Era Ground)</h2>
                <p className="section-desc">각 시대별 문명 활동 지형을 나타내는 이미지입니다.</p>
                <div className="icon-grid icon-grid--image">
                    <div className="image-item">
                        <img src={GroundStone} alt="원시 지형" />
                        <span className="image-item__name">원시 지형</span>
                        <code>ground_stone.png</code>
                    </div>
                    <div className="image-item">
                        <img src={GroundAncient} alt="고대 지형" />
                        <span className="image-item__name">고대 지형</span>
                        <code>ground_ancient.png</code>
                    </div>
                    <div className="image-item">
                        <img src={GroundMedieval} alt="중세 지형" />
                        <span className="image-item__name">중세 지형</span>
                        <code>ground_medieval.png</code>
                    </div>
                    <div className="image-item">
                        <img src={GroundIndustrial} alt="산업 지형" />
                        <span className="image-item__name">산업 지형</span>
                        <code>ground_industrial.png</code>
                    </div>
                    <div className="image-item">
                        <img src={GroundModern} alt="현대 지형" />
                        <span className="image-item__name">현대 지형</span>
                        <code>ground_modern.png</code>
                    </div>
                    <div className="image-item">
                        <img src={GroundSpace} alt="우주 지형" />
                        <span className="image-item__name">우주 지형</span>
                        <code>ground_space.png</code>
                    </div>
                </div>
            </section>

            {/* 종족 이미지 */}
            <section className="icon-guide__section">
                <h2>👥 종족 이미지 (Race Images)</h2>
                <p className="section-desc">선택 가능한 종족의 대표 일러스트입니다.</p>
                <div className="icon-grid icon-grid--image">
                    <div className="image-item">
                        <img src={RaceHuman} alt="인류" />
                        <span className="image-item__name">인류</span>
                        <code>race_human.png</code>
                    </div>
                    <div className="image-item">
                        <img src={RaceNeanderthal} alt="네안데르탈" />
                        <span className="image-item__name">네안데르탈</span>
                        <code>race_neanderthal.png</code>
                    </div>
                    <div className="image-item">
                        <img src={RaceAtlantean} alt="아틀란티안" />
                        <span className="image-item__name">아틀란티안</span>
                        <code>race_atlantean.png</code>
                    </div>
                </div>
            </section>

            {/* 경이 이미지 */}
            <section className="icon-guide__section">
                <h2>🏛️ 경이 이미지 (Wonder Images)</h2>
                <p className="section-desc">각 종족별 최종 승리 조건인 경이 건설물입니다.</p>
                <div className="icon-grid icon-grid--image">
                    <div className="image-item">
                        <img src={WonderHuman} alt="인류 경이" />
                        <span className="image-item__name">인류 경이</span>
                        <code>wonder_human.png</code>
                    </div>
                    <div className="image-item">
                        <img src={WonderNeanderthal} alt="네안데르탈 경이" />
                        <span className="image-item__name">네안데르탈 경이</span>
                        <code>wonder_neanderthal.png</code>
                    </div>
                    <div className="image-item">
                        <img src={WonderAtlantean} alt="아틀란티안 경이" />
                        <span className="image-item__name">아틀란티안 경이</span>
                        <code>wonder_atlantean.png</code>
                    </div>
                </div>
            </section>

            {/* 기술 이미지 */}
            <section className="icon-guide__section">
                <h2>🔬 기술 이미지 (Technology Images)</h2>
                <p className="section-desc">기술 트리에서 연구 가능한 기술들의 이미지입니다.</p>

                <h3>원시 시대 기술</h3>
                <div className="icon-grid icon-grid--tech">
                    <div className="image-item image-item--tech">
                        <img src={TechFire} alt="불" />
                        <span className="image-item__name">불</span>
                        <code>fire.png</code>
                    </div>
                    <div className="image-item image-item--tech">
                        <img src={TechTools} alt="도구" />
                        <span className="image-item__name">도구</span>
                        <code>tools.png</code>
                    </div>
                </div>

                <h3>고대 시대 기술</h3>
                <div className="icon-grid icon-grid--tech">
                    <div className="image-item image-item--tech">
                        <img src={TechFarming} alt="농경" />
                        <span className="image-item__name">농경</span>
                        <code>farming.png</code>
                    </div>
                    <div className="image-item image-item--tech">
                        <img src={TechWriting} alt="문자" />
                        <span className="image-item__name">문자</span>
                        <code>writing.png</code>
                    </div>
                    <div className="image-item image-item--tech">
                        <img src={TechGovernance} alt="통치" />
                        <span className="image-item__name">통치</span>
                        <code>governance.png</code>
                    </div>
                    <div className="image-item image-item--tech">
                        <img src={TechIrrigation} alt="관개" />
                        <span className="image-item__name">관개</span>
                        <code>irrigation.png</code>
                    </div>
                    <div className="image-item image-item--tech">
                        <img src={TechMathematics} alt="수학" />
                        <span className="image-item__name">수학</span>
                        <code>mathematics.png</code>
                    </div>
                </div>

                <h3>중세 시대 기술</h3>
                <div className="icon-grid icon-grid--tech">
                    <div className="image-item image-item--tech">
                        <img src={TechWarfare} alt="전쟁술" />
                        <span className="image-item__name">전쟁술</span>
                        <code>warfare.png</code>
                    </div>
                    <div className="image-item image-item--tech">
                        <img src={TechHeavyMining} alt="중광업" />
                        <span className="image-item__name">중광업</span>
                        <code>heavy_mining.png</code>
                    </div>
                    <div className="image-item image-item--tech">
                        <img src={TechPrinting} alt="인쇄술" />
                        <span className="image-item__name">인쇄술</span>
                        <code>printing.png</code>
                    </div>
                </div>

                <h3>산업 시대 기술</h3>
                <div className="icon-grid icon-grid--tech">
                    <div className="image-item image-item--tech">
                        <img src={TechSteam} alt="증기기관" />
                        <span className="image-item__name">증기기관</span>
                        <code>steam.png</code>
                    </div>
                    <div className="image-item image-item--tech">
                        <img src={TechSteel} alt="강철" />
                        <span className="image-item__name">강철</span>
                        <code>steel.png</code>
                    </div>
                    <div className="image-item image-item--tech">
                        <img src={TechElectricity} alt="전기" />
                        <span className="image-item__name">전기</span>
                        <code>electricity.png</code>
                    </div>
                </div>

                <h3>현대 기술</h3>
                <div className="icon-grid icon-grid--tech">
                    <div className="image-item image-item--tech">
                        <img src={TechBiology} alt="생물학" />
                        <span className="image-item__name">생물학</span>
                        <code>biology.png</code>
                    </div>
                    <div className="image-item image-item--tech">
                        <img src={TechGlobalization} alt="세계화" />
                        <span className="image-item__name">세계화</span>
                        <code>globalization.png</code>
                    </div>
                    <div className="image-item image-item--tech">
                        <img src={TechComputer} alt="컴퓨터" />
                        <span className="image-item__name">컴퓨터</span>
                        <code>computer.png</code>
                    </div>
                    <div className="image-item image-item--tech">
                        <img src={TechInternet} alt="인터넷" />
                        <span className="image-item__name">인터넷</span>
                        <code>internet.png</code>
                    </div>
                </div>

                <h3>우주 시대 기술</h3>
                <div className="icon-grid icon-grid--tech">
                    <div className="image-item image-item--tech">
                        <img src={TechRocketry} alt="로켓 공학" />
                        <span className="image-item__name">로켓 공학</span>
                        <code>rocketry.png</code>
                    </div>
                    <div className="image-item image-item--tech">
                        <img src={TechCrystalPower} alt="크리스탈 파워" />
                        <span className="image-item__name">크리스탈 파워</span>
                        <code>crystal_power.png</code>
                    </div>
                    <div className="image-item image-item--tech">
                        <img src={TechTimeWarp} alt="시간 왜곡" />
                        <span className="image-item__name">시간 왜곡</span>
                        <code>time_warp.png</code>
                    </div>
                    <div className="image-item image-item--tech">
                        <img src={TechFtl} alt="초광속 여행" />
                        <span className="image-item__name">초광속 여행</span>
                        <code>ftl.png</code>
                    </div>
                </div>
            </section>

            <footer className="icon-guide__footer">
                <p>📌 사용법: 해당 컴포넌트를 import하여 사용하세요.</p>
                <pre>
                    {`// SVG 아이콘 사용
import { StoneAxeIcon, ProductionIcon } from './components/ui/GameIcons';
<StoneAxeIcon size={32} className="my-class" />

// 이미지 사용
import AgeStone from '../assets/ages/age_0_stone.png';
<img src={AgeStone} alt="원시 시대" />`}
                </pre>
            </footer>
        </div>
    );
};

export default IconGuide;
