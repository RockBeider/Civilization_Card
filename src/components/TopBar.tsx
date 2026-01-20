// ============================================================
// TopBar.tsx - Top Bar Component (Turn Info, Resources, Controls)
// ============================================================

import React from 'react';
import { Home, Save, Volume2, VolumeX, Heart } from './ui/Icons';
import { CastleTowerIcon } from './ui/GameIcons';
import { AGES, RACES } from '../data/constants';

// Resource Icons (PNG)
import iconProduction from '../assets/icon_production.png';
import iconFood from '../assets/icon_food.png';
import iconScience from '../assets/icon_science.png';

interface TopBarProps {
    turn: number;
    era: number;
    resources: {
        production: number;
        food: number;
        science: number;
    };
    playerStats: {
        health: number;
    };
    playerRace: string | null;
    isMuted: boolean;
    onQuit: () => void;
    onSave: () => void;
    onToggleMute: () => void;
}

const TopBar: React.FC<TopBarProps> = ({
    turn,
    era,
    resources,
    playerStats,
    playerRace,
    isMuted,
    onQuit,
    onSave,
    onToggleMute,
}) => {
    const currentAge = Math.min(era - 1, AGES.length - 1);

    return (
        <div className="top-bar-wrapper">
            <div className="top-bar-content top-bar">
                <div className="race-info">
                    {playerRace ? (
                        <img
                            src={RACES.find(r => r.name === playerRace)?.img}
                            alt={playerRace}
                            className="race-icon"
                        />
                    ) : (
                        <div className="race-placeholder">?</div>
                    )}
                </div>
                <div className="turn-info">
                    <CastleTowerIcon size={40} className="era-icon" />
                    <div className="turn-badge">{turn}/{turn}</div>
                    <div className="era-name">Turn {turn}: {AGES[currentAge]?.name || 'Medieval Era'}</div>
                </div>
                <div className="resource-bar">
                    <div className="resource-card primitive">
                        <img src={iconProduction} alt="Production" style={{ width: 24, height: 24 }} />
                        <span className="resource-value">{resources.production}</span>
                    </div>
                    <div className="resource-card primitive">
                        <img src={iconFood} alt="Food" style={{ width: 24, height: 24 }} />
                        <span className="resource-value">{resources.food}</span>
                    </div>
                    <div className="resource-card primitive">
                        <img src={iconScience} alt="Science" style={{ width: 24, height: 24 }} />
                        <span className="resource-value">{resources.science}/100</span>
                    </div>
                    <div className="resource-card primitive">
                        <Heart size={20} className="icon-text-red" />
                        <span className="resource-value">{playerStats.health}</span>
                    </div>
                </div>
                <div className="control-buttons">
                    <button onClick={onQuit} title="메인으로" className="control-btn primitive">
                        <Home size={20} />
                    </button>
                    <button
                        onClick={onSave}
                        title="저장하기"
                        className="control-btn primitive"
                    >
                        <Save size={20} />
                    </button>
                    <button onClick={onToggleMute} title="음소거" className="control-btn primitive">
                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TopBar;
