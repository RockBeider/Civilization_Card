// ============================================================
// GameTest.tsx - Debug Component for Testing Game Logic
// ============================================================

import React from 'react';
import { useGameStore } from '../store';
import { mockCards, createStarterDeck } from '../data/mockCards';
import type { Card } from '../types';

interface GameTestProps {
    onClose?: () => void;
}

const GameTest: React.FC<GameTestProps> = ({ onClose }) => {
    const {
        status,
        resources,
        era,
        turn,
        deck,
        field,
        playerStats,
        logs,
        startGame,
        resetGame,
        drawCard,
        playCard,
        endTurn,
        cheat,
    } = useGameStore();

    const handleStartGame = () => {
        const starterDeck = createStarterDeck();
        startGame(starterDeck);
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>🎮 Game Debug Panel</h1>

            {/* Status Bar */}
            <div style={styles.statusBar}>
                <span>상태: <strong>{status}</strong></span>
                <span>턴: <strong>{turn}</strong></span>
                <span>시대: <strong>{era}</strong></span>
                <span>체력: <strong>{playerStats.health}/{playerStats.maxHealth}</strong></span>
            </div>

            {/* Resources */}
            <div style={styles.section}>
                <h2>📦 자원</h2>
                <div style={styles.resourceGrid}>
                    <div style={styles.resourceCard}>
                        <span>🍖 식량</span>
                        <strong>{resources.food}</strong>
                    </div>
                    <div style={styles.resourceCard}>
                        <span>⚙️ 생산</span>
                        <strong>{resources.production}</strong>
                    </div>
                    <div style={styles.resourceCard}>
                        <span>🔬 과학</span>
                        <strong>{resources.science}</strong>
                    </div>
                </div>
            </div>

            {/* Hand */}
            <div style={styles.section}>
                <h2>🖐️ 손패 ({deck.hand.length})</h2>
                <div style={styles.cardGrid}>
                    {deck.hand.map((card) => (
                        <div key={card.instanceId} style={styles.card}>
                            <div style={styles.cardHeader}>
                                <span>{card.name}</span>
                                <span style={styles.cardCost}>
                                    {card.cost.production && `⚙️${card.cost.production}`}
                                    {card.cost.food && `🍖${card.cost.food}`}
                                    {card.cost.science && `🔬${card.cost.science}`}
                                    {!card.cost.production && !card.cost.food && !card.cost.science && '0'}
                                </span>
                            </div>
                            <div style={styles.cardType}>{card.type}</div>
                            <div style={styles.cardDesc}>{card.description}</div>
                            <button
                                style={styles.playButton}
                                onClick={() => playCard(card.instanceId!)}
                                disabled={card.unplayable}
                            >
                                사용
                            </button>
                        </div>
                    ))}
                    {deck.hand.length === 0 && <p>손패가 비어있습니다.</p>}
                </div>
            </div>

            {/* Field */}
            <div style={styles.section}>
                <h2>🏗️ 필드</h2>
                <div style={styles.fieldRow}>
                    <div>
                        <h3>건물 ({field.structures.length})</h3>
                        {field.structures.map((card) => (
                            <div key={card.instanceId} style={styles.fieldCard}>
                                {card.name}
                            </div>
                        ))}
                    </div>
                    <div>
                        <h3>유닛 ({field.units.length})</h3>
                        {field.units.map((card) => (
                            <div key={card.instanceId} style={styles.fieldCard}>
                                {card.name} {card.stats?.attack && `⚔️${card.stats.attack}`}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Deck Info */}
            <div style={styles.section}>
                <h2>📚 덱 정보</h2>
                <p>뽑기 더미: {deck.drawPile.length} | 버림 더미: {deck.discardPile.length}</p>
            </div>

            {/* Actions */}
            <div style={styles.section}>
                <h2>🎯 액션</h2>
                <div style={styles.buttonRow}>
                    {(status === 'title' || status === 'race_selection') && (
                        <button style={styles.button} onClick={handleStartGame}>
                            게임 시작
                        </button>
                    )}
                    {onClose && (
                        <button style={styles.buttonClose} onClick={onClose}>
                            게임으로 돌아가기
                        </button>
                    )}
                    {status === 'playing' && (
                        <>
                            <button style={styles.button} onClick={() => drawCard(1)}>
                                카드 뽑기
                            </button>
                            <button style={styles.button} onClick={endTurn}>
                                턴 종료
                            </button>
                            <button style={styles.buttonCheat} onClick={() => cheat.addResources(10)}>
                                [CHEAT] +10 자원
                            </button>
                        </>
                    )}
                    {(status === 'gameover' || status === 'victory') && (
                        <button style={styles.button} onClick={resetGame}>
                            다시 시작
                        </button>
                    )}
                </div>
            </div>

            {/* Logs */}
            <div style={styles.section}>
                <h2>📜 로그</h2>
                <div style={styles.logBox}>
                    {logs.slice(-10).reverse().map((log, idx) => (
                        <div key={idx} style={styles.logEntry}>{log}</div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- Styles ---
const styles: Record<string, React.CSSProperties> = {
    container: {
        fontFamily: 'system-ui, sans-serif',
        padding: '20px',
        maxWidth: '900px',
        margin: '0 auto',
        backgroundColor: '#1a1a2e',
        color: '#eee',
        minHeight: '100vh',
    },
    title: {
        textAlign: 'center',
        color: '#ffd700',
    },
    statusBar: {
        display: 'flex',
        justifyContent: 'space-around',
        padding: '10px',
        backgroundColor: '#16213e',
        borderRadius: '8px',
        marginBottom: '20px',
    },
    section: {
        backgroundColor: '#0f3460',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '15px',
    },
    resourceGrid: {
        display: 'flex',
        gap: '15px',
    },
    resourceCard: {
        flex: 1,
        textAlign: 'center' as const,
        padding: '15px',
        backgroundColor: '#1a1a2e',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '5px',
    },
    cardGrid: {
        display: 'flex',
        flexWrap: 'wrap' as const,
        gap: '10px',
    },
    card: {
        width: '150px',
        backgroundColor: '#e94560',
        borderRadius: '8px',
        padding: '10px',
        color: '#fff',
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        fontWeight: 'bold',
        marginBottom: '5px',
    },
    cardCost: {
        fontSize: '12px',
    },
    cardType: {
        fontSize: '10px',
        textTransform: 'uppercase' as const,
        opacity: 0.7,
        marginBottom: '5px',
    },
    cardDesc: {
        fontSize: '11px',
        marginBottom: '10px',
        minHeight: '30px',
    },
    playButton: {
        width: '100%',
        padding: '5px',
        cursor: 'pointer',
        backgroundColor: '#ffd700',
        border: 'none',
        borderRadius: '4px',
        fontWeight: 'bold',
    },
    fieldRow: {
        display: 'flex',
        gap: '20px',
    },
    fieldCard: {
        display: 'inline-block',
        padding: '8px 12px',
        backgroundColor: '#53354a',
        borderRadius: '4px',
        marginRight: '8px',
        marginTop: '5px',
    },
    buttonRow: {
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap' as const,
    },
    button: {
        padding: '10px 20px',
        fontSize: '14px',
        cursor: 'pointer',
        backgroundColor: '#00af54',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
    },
    buttonCheat: {
        padding: '10px 20px',
        fontSize: '14px',
        cursor: 'pointer',
        backgroundColor: '#ff6b6b',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
    },
    buttonClose: {
        padding: '10px 20px',
        fontSize: '14px',
        cursor: 'pointer',
        backgroundColor: '#6c757d',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
    },
    logBox: {
        backgroundColor: '#1a1a2e',
        padding: '10px',
        borderRadius: '6px',
        maxHeight: '150px',
        overflowY: 'auto' as const,
        fontSize: '12px',
    },
    logEntry: {
        padding: '3px 0',
        borderBottom: '1px solid #333',
    },
};

export default GameTest;
