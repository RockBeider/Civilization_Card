// ============================================================
// App.tsx - Main Application Component (Reference UI Style)
// ============================================================

import { useGameStore } from './store';
import { useSound } from './hooks/useSound';
import { RaceSelectionScreen } from './components/screens/RaceSelectionScreen';
import { VictoryScreen } from './components/screens/VictoryScreen';
import { Home, Save, Volume2, VolumeX, Heart } from './components/ui/Icons';
import { ProductionIcon, FoodIcon, ScienceIcon, CastleTowerIcon } from './components/ui/GameIcons';
import { AGES, RACES } from './data/constants';
import { createStarterDeck } from './data/mockCards';
import type { RaceData, Card } from './types';
import GameCard from './components/ui/Card';
import './styles/primitive-theme.scss';

// UI Assets
import endTurnImg from '/assets/ui_end_turn.png';

function App() {
    // Zustand Store
    const {
        status,
        resources,
        era,
        turn,
        deck,
        field,
        logs,
        playerStats,
        startGame,
        resetGame,
        playCard,
        endTurn,
    } = useGameStore();

    // Sound Hook
    const { initAudio, toggleMute, isMuted } = useSound();

    // Derived State
    const currentAge = Math.min(era - 1, AGES.length - 1);

    // Handlers
    const handleStartGame = (race: RaceData) => {
        initAudio();
        const starterDeck = createStarterDeck();
        startGame(starterDeck);
    };

    const handleQuitGame = () => {
        resetGame();
    };

    const handlePlayCard = (card: Card) => {
        if (card.instanceId) {
            playCard(card.instanceId);
        }
    };

    // --- Render: Race Selection ---
    if (status === 'idle') {
        return (
            <RaceSelectionScreen
                onSelect={handleStartGame}
                onLoad={() => alert("저장/불러오기 기능은 현재 개발 중입니다.")}
            />
        );
    }

    // --- Render: Victory ---
    if (status === 'victory') {
        return <VictoryScreen onRestart={() => window.location.reload()} />;
    }

    // --- Render: Game Over ---
    if (status === 'gameover') {
        return (
            <div className="gameover-screen primitive-theme">
                <div className="gameover-content">
                    <h1>💀 문명 멸망</h1>
                    <p>역사 속으로 사라졌습니다.</p>
                    <button onClick={() => window.location.reload()} className="btn-restart">
                        다시 시작
                    </button>
                </div>
            </div>
        );
    }

    // --- Render: Main Game ---
    return (
        <div className="game-container primitive-theme">
            {/* ========== TOP BAR ========== */}
            <div className="top-bar-wrapper">
                <div className="top-bar-content">
                    <div className="turn-info">
                        <CastleTowerIcon size={40} className="era-icon" />
                        <div className="turn-badge">{turn}/{turn}</div>
                        <div className="era-name">Turn {turn}: {AGES[currentAge]?.name || 'Medieval Era'}</div>
                    </div>

                    <div className="resource-bar">
                        <div className="resource-card primitive">
                            <ProductionIcon size={20} />
                            <span className="resource-value">{resources.production}</span>
                        </div>
                        <div className="resource-card primitive">
                            <FoodIcon size={20} />
                            <span className="resource-value">{resources.food}</span>
                        </div>
                        <div className="resource-card primitive">
                            <ScienceIcon size={20} />
                            <span className="resource-value">{resources.science}/100</span>
                        </div>
                        <div className="resource-card primitive">
                            <Heart size={20} className="icon-text-red" />
                            <span className="resource-value">{playerStats.health}</span>
                        </div>
                    </div>

                    <div className="control-buttons">
                        <button onClick={handleQuitGame} title="메인으로" className="control-btn primitive">
                            <Home size={20} />
                        </button>
                        <button
                            onClick={() => alert("저장 기능은 현재 개발 중입니다.")}
                            title="저장하기"
                            className="control-btn primitive"
                        >
                            <Save size={20} />
                        </button>
                        <button onClick={toggleMute} title="음소거" className="control-btn primitive">
                            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* ========== FIELD SECTION ========== */}
            <div className="field-section primitive">
                <div className="field-content">
                    {/* Building Zone */}
                    <div className="zone-wrapper">
                        <div className="zone-inner">
                            <div className="zone-header">
                                <span className="zone-title">Building Zone</span>
                                <span className="zone-count">{field.structures.length}/5</span>
                            </div>
                            <div className="zone-content">
                                {field.structures.map((card) => (
                                    <GameCard
                                        key={card.instanceId}
                                        card={card}
                                        disabled={true}
                                    />
                                ))}
                                {field.structures.length === 0 && (
                                    <div className="zone-empty">No buildings</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Unit Zone */}
                    <div className="zone-wrapper">
                        <div className="zone-inner">
                            <div className="zone-header">
                                <span className="zone-title">Unit Zone</span>
                                <span className="zone-count">{field.units.length}</span>
                            </div>
                            <div className="zone-content">
                                {field.units.map((card) => (
                                    <GameCard
                                        key={card.instanceId}
                                        card={card}
                                        disabled={true}
                                    />
                                ))}
                                {field.units.length === 0 && (
                                    <div className="zone-empty">No units</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Log Panel - Next Turn Warning */}
                <div className="log-panel primitive">
                    <div className="log-header">💀 Next Turn:</div>
                    <div className="log-content">
                        {logs.slice(-3).reverse().map((log, i) => (
                            <div key={i} className="log-entry">{log}</div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ========== HAND SECTION ========== */}
            <div className="hand-section primitive">
                {/* Draw Pile */}
                <div className="deck-info primitive">
                    <div className="deck-pile">
                        <span style={{
                            fontSize: '14px',
                            fontWeight: 'bold',
                            color: '#f5f0e6',
                            textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                        }}>
                            Draw<br />Pile
                        </span>
                        <span className="deck-count">{deck.drawPile.length}</span>
                    </div>
                    <span className="deck-label"></span>
                </div>

                {/* Hand Cards */}
                <div className="hand-container">
                    <div className="hand-wrapper">
                        {deck.hand.map((card, index) => {
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
                                        onClick={() => handlePlayCard(card)}
                                        isPlayable={isPlayable}
                                    />
                                </div>
                            );
                        })}
                        {deck.hand.length === 0 && (
                            <div className="hand-empty">No cards in hand</div>
                        )}
                    </div>
                </div>

                {/* End Turn Button */}
                <div className="turn-end-container" onClick={endTurn}>
                    <img src={endTurnImg} alt="End Turn" />
                </div>

                {/* Discard Pile */}
                <div className="discard-info primitive">
                    <div className="discard-pile">
                        <span className="discard-count">{deck.discardPile.length}</span>
                    </div>
                    <span className="deck-label">Discard<br />Pile</span>
                </div>
            </div>
        </div>
    );
}

export default App;
