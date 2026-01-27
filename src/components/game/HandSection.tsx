// ============================================================
// HandSection.tsx - Hand Area Component (Draw Pile, Hand Cards, Discard)
// ============================================================

import type { Card, Resources } from '../../types';
import GameCard from '../ui/Card';

// UI Assets
import endTurnImg from '/assets/ui_end_turn.png';

interface HandSectionProps {
    hand: Card[];
    drawPileCount: number;
    discardPileCount: number;
    resources: Resources;
    onPlayCard: (card: Card) => void;
    onEndTurn: () => void;
}

const HandSection: React.FC<HandSectionProps> = ({
    hand,
    drawPileCount,
    discardPileCount,
    resources,
    onPlayCard,
    onEndTurn,
}) => {
    return (
        <div className="hand-section">
            {/* Draw Pile */}
            <div className="deck-info">
                <div className="deck-pile">
                    <span style={{
                        fontSize: '14px',
                        fontWeight: 'bold',
                        color: '#f5f0e6',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                    }}>
                        Draw<br />Pile
                    </span>
                    <span className="deck-count">{drawPileCount}</span>
                </div>
                <span className="deck-label"></span>
            </div>

            {/* Hand Cards */}
            <div className="hand-container">
                <div className="hand-wrapper">
                    {hand.map((card, index) => {
                        const cost = card.cost;
                        let isPlayable = !card.unplayable;
                        if (cost.production && resources.production < cost.production) isPlayable = false;
                        if (cost.food && resources.food < cost.food) isPlayable = false;
                        if (cost.science && resources.science < cost.science) isPlayable = false;

                        return (
                            <div
                                key={card.instanceId || index}
                                className="hand-card-wrapper"
                            >
                                <GameCard
                                    card={card}
                                    onClick={() => onPlayCard(card)}
                                    isPlayable={isPlayable}
                                />
                            </div>
                        );
                    })}
                    {hand.length === 0 && (
                        <div className="hand-empty">No cards in hand</div>
                    )}
                </div>
            </div>

            {/* End Turn Button */}
            <div className="turn-end-container" onClick={onEndTurn}>
                <img src={endTurnImg} alt="End Turn" />
            </div>

            {/* Discard Pile */}
            <div className="discard-info">
                <div className="discard-pile">
                    <span className="discard-count">{discardPileCount}</span>
                </div>
                <span className="deck-label">Discard<br />Pile</span>
            </div>
        </div>
    );
};

export default HandSection;
