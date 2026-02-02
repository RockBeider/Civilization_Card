// ============================================================
// App.tsx - Main Application Component (Reference UI Style)
// ============================================================

import { useState, useEffect } from 'react';
import { useGameStore } from './store';
import { useSound } from './hooks/useSound';
import { RaceSelectionScreen } from './components/screens/RaceSelectionScreen';
import { StartScreen } from './components/screens/StartScreen';
import { VictoryScreen } from './components/screens/VictoryScreen';
import GameTest from './components/GameTest';
import { AGES } from './data/constants';
import { createStarterDeck } from './data/mockCards';
import type { Card } from './types';
import GameCard from './components/ui/Card';
import IconGuide from './components/IconGuide';
import TopBar from './components/TopBar';
import Shop from './components/Shop'; // Import Shop
import './styles/primitive-theme.scss';

// UI Assets
import endTurnImg from '/assets/ui_end_turn.png';
// URL 파라미터로 가이드 페이지 접근 체크
const urlParams = new URLSearchParams(window.location.search);
const showGuide = urlParams.get('guide') === 'true';
const initialDebug = urlParams.get('debug') === 'true';

// Define RaceData locally if not exported from types (Quick fix for lint)
// Or better, just use 'any' or check if we can remove it.
// The lint error said: Module '"./types"' has no exported member 'RaceData'.
// Let's assume it was intended to be there or I can just use { name: string, ... }
interface RaceData {
    id: string;
    name: string;
    description: string;
    bonus?: string;
}

function App() {
    const [showDebug, setShowDebug] = useState(initialDebug);

    useEffect(() => {
        window.toggleDebug = () => {
            setShowDebug(prev => !prev);
            console.log('Debug mode toggled');
        };

        return () => {
            // Optional cleanup
        };
    }, []);

    // Handlers
    const handleStartGame = (race: RaceData) => {
        initAudio();
        const starterDeck = createStarterDeck(); // TODO: Use race-specific deck
        startGame(starterDeck, race.name);
    };
    const {
        status,
        resources,
        era,
        turn,
        deck,
        field,
        logs,

        playerStats,
        playerRace,
        startGame,
        resetGame,
        playCard,
        endTurn,
        enterRaceSelection,
    } = useGameStore();

    // Sound Hook
    const { initAudio, toggleMute, isMuted } = useSound();

    // Derived State
    const currentAge = Math.min(era - 1, AGES.length - 1);

    const handleQuitGame = () => {
        resetGame();
    };

    const handlePlayCard = (card: Card) => {
        if (card.instanceId) {
            playCard(card.instanceId);
        }
    };

    // --- Render: Guide Screen ---
    if (showGuide) {
        return <IconGuide />;
    }

    // --- Render: Debug Screen ---
    if (showDebug) {
        return <GameTest onClose={() => setShowDebug(false)} />;
    }

    // --- Render: Title Screen ---
    if (status === 'title') {
        return (
            <StartScreen
                onStartGame={enterRaceSelection}
                onContinue={() => alert("저장된 게임이 없습니다.")} // TODO: Implement load functionality
            />
        );
    }

    // --- Render: Race Selection ---
    if (status === 'race_selection') {
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
        <div className="game-wrapper">
            <div className="game-container">
                {/* ========== TOP BAR ========== */}
                <TopBar
                    turn={turn}
                    era={era}
                    resources={resources}

                    playerStats={playerStats}
                    playerRace={playerRace}
                    isMuted={isMuted}
                    onQuit={handleQuitGame}
                    onSave={() => alert("저장 기능은 현재 개발 중입니다.")}
                    onToggleMute={toggleMute}
                />
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

                    {/* Shop Section */}
                    <Shop />
                    
                    {/* Log Panel - Adjusted Position (Left shifted via inline style in previous step) */}
                    <div className="log-panel primitive" style={{ right: '270px' }}>
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
        </div>
    );
}

export default App;
