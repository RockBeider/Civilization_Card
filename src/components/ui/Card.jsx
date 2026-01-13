import React from 'react';
import { Wheat, Hammer, FlaskConical, Skull, Home, Zap } from './Icons'; // Assuming these icons exist

const Card = ({ card, onClick, disabled, isPlayable }) => {
    const { name, type, cost, description, img, era } = card;

    const getCostIcon = () => {
        if (cost.food) return <Wheat size={14} />;
        if (cost.production) return <Hammer size={14} />;
        if (cost.science) return <FlaskConical size={14} />;
        return <Zap size={14} />;
    };

    const getCostValue = () => {
        if (cost.food) return cost.food;
        if (cost.production) return cost.production;
        if (cost.science) return cost.science;
        return 0;
    };

    const getTypeColor = () => {
        switch (type) {
            case 'Action': return 'card-type-action';
            case 'Structure': return 'card-type-structure';
            case 'Crisis': return 'card-type-crisis';
            default: return 'card-type-default';
        }
    };

    return (
        <div
            className={`game-card ${getTypeColor()} ${isPlayable ? 'playable' : ''} ${disabled ? 'disabled' : ''}`}
            onClick={() => !disabled && isPlayable && onClick && onClick(card)}
        >
            <div className="card-header">
                <span className="card-name">{name}</span>
                <span className="card-cost">
                    {getCostValue()} {getCostIcon()}
                </span>
            </div>
            <div className="card-image-placeholder">
                {/* Image would go here, using a placeholder for now */}
                <div className={`img-icon ${img}`}></div>
            </div>
            <div className="card-body">
                <p className="card-desc">{description}</p>
                <div className="card-type-tag">{type}</div>
            </div>
        </div>
    );
};

export default Card;
