import React from 'react';
import Card from './Card';

const HandView = ({ hand, onPlayCard, resources }) => {
    return (
        <div className="hand-container">
            <div className="hand-wrapper">
                {hand.map((cardInstance, index) => {
                    // primitive logic checking cost
                    const cost = cardInstance.cost;
                    let isPlayable = true;
                    if (cost.production && resources.prod < cost.production) isPlayable = false;
                    if (cost.food && resources.food < cost.food) isPlayable = false;
                    if (cost.science && resources.sci < cost.science) isPlayable = false;

                    return (
                        <div key={cardInstance.uniqueId} className="hand-card-wrapper" style={{ '--index': index, '--total': hand.length }}>
                            <Card
                                card={cardInstance}
                                onClick={() => onPlayCard(cardInstance)}
                                isPlayable={isPlayable}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default HandView;
