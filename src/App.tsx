// ============================================================
// App.tsx - Main Application Component (Reference UI Style)
// ============================================================

import { useState, useEffect } from 'react';
import { useGameStore } from './store';
import { useSound } from './hooks/useSound';
import { RaceSelectionScreen } from './components/screens/RaceSelectionScreen';
import { StartScreen } from './components/screens/StartScreen';
import { CardLibraryScreen } from './components/screens/CardLibraryScreen';
import { SimulationDashboard } from './components/screens/SimulationDashboard';
import { GameReportScreen } from './components/screens/GameReportScreen';
import GameTest from './components/GameTest';
import { createStarterDeck } from './data/mockCards';
import type { Card } from './types';
import IconGuide from './components/IconGuide';
import TopBar from './components/TopBar';
import FieldSection from './components/game/FieldSection';
import HandSection from './components/game/HandSection';
import CrisisModal from './components/game/CrisisModal';
import './styles/main.scss';
// URL 파라미터로 가이드 페이지 접근 체크
const urlParams = new URLSearchParams(window.location.search);
const showGuide = urlParams.get('guide') === 'true';
const initialDebug = urlParams.get('debug') === 'true';
declare global {
    interface Window {
        toggleDebug: () => void;
        openSimulation: () => void;
    }
}



function App() {
    const [showDebug, setShowDebug] = useState(initialDebug);

    useEffect(() => {
        window.toggleDebug = () => {
            setShowDebug(prev => !prev);
            console.log('Debug mode toggled');
        };

        window.openSimulation = () => {
            console.log(`[AutoBot] Opening simulation dashboard...`);
            useGameStore.getState().enterSimulation();
        };

        return () => {
            // Optional cleanup
        };
    }, []);

    // Handlers
    const handleStartGame = (race: { id: string; name: string }) => {
        initAudio();
        const starterDeck = createStarterDeck(); // TODO: Use race-specific deck
        startGame(starterDeck, race.name);
    };
    const {
        status,
        phase,
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
        openLibrary,
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
                onLibrary={openLibrary}
            />
        );
    }

    // --- Render: Simulation ---
    if (status === 'simulation') {
        return <SimulationDashboard onBack={resetGame} />;
    }

    // --- Render: Race Selection ---
    if (status === 'race_selection') {
        return (
            <RaceSelectionScreen
                onSelect={handleStartGame}
            />
        );
    }

    // --- Render: Victory or Game Over (Game Report) ---
    if (status === 'victory' || status === 'gameover') {
        return <GameReportScreen onRestart={() => window.location.reload()} />;
    }

    // --- Render: Card Library ---
    if (status === 'library') {
        return <CardLibraryScreen />;
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
                {phase === 'crisis' && <CrisisModal />}
            </div >
        </div >
    );
}

export default App;
