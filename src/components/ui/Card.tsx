// ============================================================
// Card.tsx - Card Display Component (Zustand Version)
// ============================================================

import React from 'react';
import { Wheat, Hammer, FlaskConical, Skull, Zap } from './Icons';
import type { Card as CardType } from '../../types';

interface CardProps {
    card: CardType;
    onClick?: (card: CardType) => void;
    disabled?: boolean;
    isPlayable?: boolean;
}

const Card: React.FC<CardProps> = ({ card, onClick, disabled, isPlayable = true }) => {
    const { name, type, cost, description, stats } = card;

    // Get primary cost icon
    const getCostIcon = () => {
        if (cost.production) return <Hammer size={14} className="icon-text-orange" />;
        if (cost.food) return <Wheat size={14} className="icon-text-yellow" />;
        if (cost.science) return <FlaskConical size={14} className="icon-text-blue" />;
        return <Zap size={14} className="icon-text-green" />;
    };

    // Get primary cost value
    const getCostValue = () => {
        if (cost.production) return cost.production;
        if (cost.food) return cost.food;
        if (cost.science) return cost.science;
        return 0;
    };

    // Get card type color class
    const getTypeColor = () => {
        switch (type) {
            case 'action': return 'card-type-action';
            case 'structure': return 'card-type-structure';
            case 'unit': return 'card-type-unit';
            case 'tech': return 'card-type-tech';
            case 'crisis': return 'card-type-crisis';
            default: return 'card-type-default';
        }
    };

    // Get type display name
    const getTypeName = () => {
        switch (type) {
            case 'action': return '액션';
            case 'structure': return '건물';
            case 'unit': return '유닛';
            case 'tech': return '기술';
            case 'crisis': return '재해';
            default: return type;
        }
    };

    const handleClick = () => {
        if (!disabled && isPlayable && onClick) {
            onClick(card);
        }
    };

    return (
        <div
            className={`game-card ${getTypeColor()} ${isPlayable ? 'playable' : 'unplayable'} ${disabled ? 'disabled' : ''}`}
            onClick={handleClick}
        >
            <div className="card-header">
                <span className="card-name">{name}</span>
                <span className="card-cost">
                    {getCostValue()} {getCostIcon()}
                </span>
            </div>

            <div className="card-image-placeholder">
                {/* Stats Display for Units */}
                {stats && (stats.attack !== undefined || stats.health !== undefined) && (
                    <div className="card-stats">
                        {stats.attack !== undefined && <span className="stat-attack">⚔️{stats.attack}</span>}
                        {stats.health !== undefined && <span className="stat-health">❤️{stats.health}</span>}
                    </div>
                )}
            </div>

            <div className="card-body">
                <p className="card-desc">{description}</p>
                <div className="card-footer">
                    <div className="card-type-tag">{getTypeName()}</div>
                    {stats?.upkeep !== undefined && stats.upkeep > 0 && (
                        <div className="card-upkeep">🍖{stats.upkeep}/턴</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Card;
