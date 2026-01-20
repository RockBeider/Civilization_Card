import { RACES } from '../../data/constants';
import { CARDS } from '../../data/cards';
import bgImage from '../../assets/race_selection_bg.png';
import { RaceData } from '../../types';

interface RaceSelectionScreenProps {
    onSelect: (race: RaceData) => void;
    onLoad: () => void;
}

export function RaceSelectionScreen({ onSelect, onLoad }: RaceSelectionScreenProps) {
    const getDeckSummary = (deckIds: string[]) => {
        const counts: Record<string, number> = {};
        deckIds.forEach(id => {
            counts[id] = (counts[id] || 0) + 1;
        });

        return Object.entries(counts).map(([id, count]) => {
            const card = CARDS.find(c => c.id === id);
            return {
                name: card ? card.name : id,
                count,
                id
            };
        });
    };

    return (
        <div className="selection-screen" style={{
            backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.7)), url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
        }}>
            <h1 className="selection-title">종족을 선택하십시오</h1>
            <div className="race-grid animate-fade-in">
                {RACES.map(race => {
                    const deckSummary = getDeckSummary(race.starter_deck || []);
                    return (
                        <div key={race.id} onClick={() => onSelect(race)} className="race-card">
                            <div className="race-icon-wrapper">
                                <img src={race.img} alt={race.name} className="race-img" />
                            </div>
                            <h2 className="race-name">{race.name}</h2>
                            <p className="race-desc">{race.desc}</p>

                            <div className="race-deck-info">
                                <h4 className="deck-title">시작 카드</h4>
                                <div className="deck-list">
                                    {deckSummary.map(item => (
                                        <div key={item.id} className="deck-item">
                                            <span className="card-name">{item.name}</span>
                                            <span className="card-count">x{item.count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="race-start">새 게임 시작</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
