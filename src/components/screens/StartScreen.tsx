import { useGameStore } from '../../store';
import bgImage from '../../assets/race_selection_bg.png';

interface StartScreenProps {
    onStartGame: () => void;
    onContinue?: () => void;
}

export function StartScreen({ onStartGame, onContinue }: StartScreenProps) {
    return (
        <div className="start-screen" style={{
            backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.7)), url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
        }}>
            <div className="start-menu-panel animate-fade-in">
                <div className="start-logo-area">
                    <h1 className="main-logo-text">
                        <span className="logo-subtitle"><span>Card</span> <small>of</small></span> Civilization
                    </h1>
                </div>
                <div className="start-menu-items">
                    <button onClick={onStartGame} className="start-menu-btn">
                        Start Game
                    </button>
                    <button
                        onClick={onContinue}
                        className="start-menu-btn"
                    // If no continue handler or save implementation, maybe show alert or disable
                    >
                        Continue
                    </button>
                    <button
                        className="start-menu-btn disabled"
                        style={{ marginTop: 'auto', fontSize: '1rem', opacity: 0.7 }}
                    >
                        v0.1.0 Alpha
                    </button>
                </div>
            </div>
        </div>
    );
}
