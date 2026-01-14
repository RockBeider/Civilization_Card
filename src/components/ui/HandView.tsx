// ============================================================
// HandView.tsx - Hand Display Component (Zustand Version)
// ============================================================

import React from 'react';
import Card from './Card';
import type { Card as CardType, Resources } from '../../types';

interface HandViewProps {
    hand: CardType[];
    onPlayCard: (card: CardType) => void;
    resources: Resources;
}

const HandView: React.FC<HandViewProps> = ({ hand, onPlayCard, resources }) => {
    return (
        <div className="hand-container">
            <div className="hand-wrapper">
                {hand.map((cardInstance, index) => {
                    // Check if card is playable based on cost
                    const cost = cardInstance.cost;
                    let isPlayable = !cardInstance.unplayable;

                    if (cost.production && resources.production < cost.production) {
                        isPlayable = false;
                    }
                    if (cost.food && resources.food < cost.food) {
                        isPlayable = false;
                    }
                    if (cost.science && resources.science < cost.science) {
                        isPlayable = false;
                    }

                    return (
                        <div
                            key={cardInstance.instanceId || index}
                            className="hand-card-wrapper"
                            style={{ '--index': index, '--total': hand.length } as React.CSSProperties}
                        >
                            <Card
                                card={cardInstance}
                                onClick={() => onPlayCard(cardInstance)}
                                isPlayable={isPlayable}
                            />
                        </div>
                    );
                })}
                {hand.length === 0 && (
                    <div className="hand-empty">손패가 비어있습니다</div>
                )}
            </div>
        </div>
    );
};

export default HandView;
