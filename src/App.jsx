import { useState } from 'react';
import { useGameLoop } from './hooks/useGameLoop';
import { RaceSelectionScreen } from './components/screens/RaceSelectionScreen';
import { VictoryScreen } from './components/screens/VictoryScreen'; // Assuming compatible
import HandView from './components/ui/HandView';
import FieldView from './components/ui/FieldView';
import { ResourceCard } from './components/ui/BasicComponents'; // Trying to reuse
import { Wheat, Hammer, FlaskConical, Scroll, Hourglass } from './components/ui/Icons';
import { AGES } from './data/constants';

function App() {
    const {
        gameState,
        selectedRace,
        resources,
        currentAge,
        turn,
        hand,
        field,
        logs,
        startGame,
        playCard,
        endTurn
    } = useGameLoop();

    if (gameState === 'selection') {
        return <RaceSelectionScreen onSelect={(race) => startGame(race.id)} onLoad={() => alert("Save/Load not implemented in this version yet.")} />;
    }

    if (gameState === 'victory') {
        return <VictoryScreen onRestart={() => window.location.reload()} />;
    }

    return (
        <div className="game-container">
            {/* Header */}
            <header className="game-header header-bg" style={{ backgroundImage: `url(${AGES[currentAge].img})` }}>
                <div className="header-overlay"></div>
                <div className="header-content">
                    <div className="header-info">
                        <div className={`age-icon ${AGES[currentAge].color}`}>
                            {selectedRace && <img src={selectedRace.img} alt={selectedRace.name} className="block w-full h-auto" />}
                        </div>
                        <div>
                            <h1 className={`age-title ${AGES[currentAge].color}`}>{AGES[currentAge].name}</h1>
                            <p className="civ-info">{selectedRace?.name} | <Hourglass size={14} /> Turn {turn}</p>
                        </div>
                    </div>

                    <div className="resource-bar">
                        <ResourceCard icon={<Wheat size={20} className="icon-text-yellow" />} label="식량" value={resources.food} />
                        <ResourceCard icon={<Hammer size={20} className="icon-text-orange" />} label="생산" value={resources.prod} />
                        <ResourceCard icon={<FlaskConical size={20} className="icon-text-blue" />} label="과학" value={resources.sci} />
                    </div>
                </div>
            </header>

            <div className="main-content">
                {/* Main Play Area */}
                <div className="panel-center" style={{ flex: 3, display: 'flex', flexDirection: 'column' }}>
                    <div className="field-area" style={{ flex: 1 }}>
                        <FieldView field={field} />
                    </div>

                    <div className="hand-area" style={{ flex: 1, position: 'relative' }}>
                        <HandView hand={hand} onPlayCard={playCard} resources={resources} />
                    </div>

                    <div className="controls-area" style={{ position: 'absolute', right: '350px', bottom: '20px', zIndex: 100 }}>
                        <button className="btn-primary"
                            style={{ padding: '15px 30px', fontSize: '1.2rem', backgroundColor: '#3b82f6', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer' }}
                            onClick={endTurn}>
                            턴 종료
                        </button>
                    </div>
                </div>

                {/* Right Information Panel */}
                <div className="panel-right" style={{ flex: 1, minWidth: '300px' }}>
                    <div className="panel-inner" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <div className="log-header">
                            <h3>로그</h3>
                        </div>
                        <div className="log-content" style={{ flex: 1, overflowY: 'auto' }}>
                            {logs.map((log, i) => (
                                <div key={i} className="log-entry" style={{ padding: '5px', borderBottom: '1px solid #333', fontSize: '0.9rem' }}>
                                    {log}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
