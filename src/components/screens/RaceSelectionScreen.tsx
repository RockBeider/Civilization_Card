import { RACES, AGES } from '../../data/constants';
import { Scroll, Wheat, FlaskConical, Crown, Flame, FilePlus } from '../ui/Icons';
import bgImage from '../../assets/race_selection_bg.png';
import { RaceData } from '../../types';

interface RaceSelectionScreenProps {
    onSelect: (race: RaceData) => void;
    onLoad: () => void;
}

export function RaceSelectionScreen({ onSelect, onLoad }: RaceSelectionScreenProps) {
    return (
        <div className="selection-screen" style={{
            backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.7)), url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
        }}>
            <div className="selection-header animate-fade-in">
                <h1 className="selection-title">문명 <br className='d-none-sm' /> 시뮬레이션</h1>
                <p className="selection-subtitle">당신의 문명을 선택하여 우주 시대로 이끄십시오.</p>
            </div>

            <div className="guide-box animate-fade-in">
                <h3 className="guide-title">
                    <Scroll size={20} className="icon-blue" /> 게임 가이드
                </h3>
                <div className="guide-grid">
                    <div className="guide-item"><div className="guide-icon icon-text-yellow"><Wheat size={16} /></div><div><strong>자원 관리</strong>식량(유지), 생산(건설), 과학(연구) 3가지 자원을 모아 문명을 발전시키세요.</div></div>
                    <div className="guide-item"><div className="guide-icon icon-text-blue"><FlaskConical size={16} /></div><div><strong>시대 발전</strong>기술을 연구하여 원시 시대부터 우주 시대까지 6단계의 시대를 거쳐야 합니다.</div></div>
                    <div className="guide-item"><div className="guide-icon icon-text-yellow"><Crown size={16} /></div><div><strong>불가사의 건설</strong>각 종족 고유의 '불가사의'를 건설하면 영구적이고 강력한 보너스를 얻습니다.</div></div>
                    <div className="guide-item"><div className="guide-icon icon-text-red"><Flame size={16} /></div><div><strong>재해 대비</strong>무작위로 발생하는 재해는 자원이나 건물을 파괴할 수 있습니다.</div></div>
                </div>
            </div>

            <div className="load-game-btn animate-fade-in">
                <button onClick={onLoad}>
                    <FilePlus size={20} /> 저장된 게임 불러오기
                </button>
            </div>

            <div className="race-grid animate-fade-in">
                {RACES.map(race => (
                    <div key={race.id} onClick={() => onSelect(race)} className="race-card">
                        <div className="race-icon-wrapper">
                            <img src={race.img} alt={race.name} className="race-img" />
                        </div>
                        <h2 className="race-name">{race.name}</h2>
                        <p className="race-desc">{race.desc}</p>
                        <div className="race-stats">
                            <div className="stat-row"><span className="stat-label">식량 효율</span> <span className={`stat-value ${race.bonus.food > 1 ? 'positive' : race.bonus.food < 1 ? 'negative' : 'neutral'}`}>{race.bonus.food * 100}%</span></div>
                            <div className="stat-row"><span className="stat-label">생산 효율</span> <span className={`stat-value ${race.bonus.prod > 1 ? 'positive' : race.bonus.prod < 1 ? 'negative' : 'neutral'}`}>{race.bonus.prod * 100}%</span></div>
                            <div className="stat-row"><span className="stat-label">과학 효율</span> <span className={`stat-value ${race.bonus.sci > 1 ? 'positive' : race.bonus.sci < 1 ? 'negative' : 'neutral'}`}>{race.bonus.sci * 100}%</span></div>
                        </div>
                        <div className="race-start">새 게임 시작</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
