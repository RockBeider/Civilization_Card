// ============================================================
// TopBar.tsx - Top Bar Component (Turn Info, Resources, Controls)
// ============================================================

import React from 'react';
import { Home, Save, Volume2, VolumeX } from './ui/Icons';
import { AGES, RACES } from '../data/constants';

// Resource Icons (Modern / Civ VII Style)
import iconProduction from '../assets/icon_production_modern.png';
import iconFood from '../assets/icon_food_modern.png';
import iconScience from '../assets/icon_science_modern.png';
import iconHealth from '../assets/icon_health_modern.png';

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
                {/* LEFT: Resources */}
                <div className="top-bar-left">
                    <div className="race-health">
                        {playerRace && (
                            <img
                                src={RACES.find(r => r.name === playerRace)?.img}
                                alt={playerRace}
                                className="race-icon-small"
                            />
                        )}
                    </div>
                    <div className="resource-card">
                        <img src={iconHealth} alt="Health" className="resource-icon" />
                        <span className="resource-value">{playerStats.health}</span>
                    </div>
                    <div className="turn-info">
                        <span className="era-name">Turn <span className="highlight">{turn}</span> | {AGES[currentAge]?.name || 'Medieval Era'}</span>
                    </div>
                    <div className="resource-bar">
                        <div className="resource-card">
                            <img src={iconProduction} alt="Production" className="resource-icon" />
                            <span className="resource-value">{resources.production}</span>
                        </div>
                        <div className="resource-card">
                            <img src={iconFood} alt="Food" className="resource-icon" />
                            <span className="resource-value">{resources.food}</span>
                        </div>
                        <div className="resource-card">
                            <img src={iconScience} alt="Science" className="resource-icon" />
                            <span className="resource-value">{resources.science}</span>
                        </div>

                    </div>
                </div>

                {/* RIGHT: Turn Info + Controls */}
                <div className="top-bar-right">
                    <div className="control-buttons">
                        <button onClick={onQuit} title="메인으로" className="control-btn modern">
                            <Home size={18} />
                        </button>
                        <button onClick={onSave} title="저장하기" className="control-btn modern">
                            <Save size={18} />
                        </button>
                        <button onClick={onToggleMute} title="음소거" className="control-btn modern">
                            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopBar;
