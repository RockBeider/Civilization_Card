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
import { createStarterDeck } from './data/mockCards';
import type { Card, RaceData } from './types';
import IconGuide from './components/IconGuide';
import TopBar from './components/TopBar';
import FieldSection from './components/game/FieldSection';
import HandSection from './components/game/HandSection';
// URL 파라미터로 가이드 페이지 접근 체크
const urlParams = new URLSearchParams(window.location.search);
const showGuide = urlParams.get('guide') === 'true';
const initialDebug = urlParams.get('debug') === 'true';

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

    // Derived State (reserved for future use)
    // const currentAge = Math.min(era - 1, AGES.length - 1);

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
            <div className="gameover-screen">
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
                <FieldSection
                    structures={field.structures}
                    units={field.units}
                    logs={logs}
                />
                {/* ========== HAND SECTION ========== */}
                <HandSection
                    hand={deck.hand}
                    drawPileCount={deck.drawPile.length}
                    discardPileCount={deck.discardPile.length}
                    resources={resources}
                    onPlayCard={handlePlayCard}
                    onEndTurn={endTurn}
                />
            </div>
        </div>
    );
}

export default App;
