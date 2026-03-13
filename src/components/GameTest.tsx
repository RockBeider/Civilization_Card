// ============================================================
// GameTest.tsx - Debug Component for Testing Game Logic
// ============================================================

import React from 'react';
import { useGameStore } from '../store';
import { createStarterDeck } from '../data/mockCards';
import { playTurn } from '../simulation/AutoBot';
import { debugLogger } from '../utils/DebugLogger';

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
        startGame(starterDeck, 'debug_race');
    };

    const [isAutoPlaying, setIsAutoPlaying] = React.useState(false);
    const autoPlayRef = React.useRef<number | NodeJS.Timeout | null>(null);

    const handleStep = () => {
        const currentState = useGameStore.getState();
        if (currentState.status === 'gameover' || currentState.status === 'victory') {
            setIsAutoPlaying(false);
            return;
        }
        
        // 1턴 액션 실행
        playTurn(currentState);

        // 실행 직후 바뀐 상태 확인하여 게임이 끝났다면 종합 로그 남기기
        const nextState = useGameStore.getState();
        if (nextState.status === 'gameover' || nextState.status === 'victory') {
             const resultTxt = nextState.status === 'victory' ? '✅ 승리' : '💀 패배';
             const reasonTxt = nextState.status === 'gameover' 
                ? (nextState.logs.slice(-5).join(" ").includes("식량 부족") ? "만성적 기아(아사)" : "위험 페널티 피해 누적") 
                : "우주 시대 도달 완료";
             const endReport = '[AutoBot 종료 보고서] 결과: ' + resultTxt + ' | 도달 턴: ' + nextState.turn + '턴 | 최종 시대: ' + nextState.era + ' | 원인/달성: ' + reasonTxt + ' | 남은 식량: ' + nextState.resources.food + ', 남은 체력: ' + nextState.playerStats.health;
             useGameStore.getState().addLog(endReport);
             setIsAutoPlaying(false);
        }
    };

    React.useEffect(() => {
        if (isAutoPlaying) {
            autoPlayRef.current = setInterval(handleStep, 500); // 0.5초 간격으로 자동 진행
        } else {
            if (autoPlayRef.current) {
                clearInterval(autoPlayRef.current as number);
                autoPlayRef.current = null;
            }
        }
        return () => {
            if (autoPlayRef.current) clearInterval(autoPlayRef.current as number);
        };
    }, [isAutoPlaying]);

    const handleExportJson = () => {
        const currentState = useGameStore.getState();
        const exportData = {
            turn: currentState.turn,
            era: currentState.era,
            status: currentState.status,
            phase: currentState.phase,
            resources: currentState.resources,
            playerStats: currentState.playerStats,
            deckCounts: {
                hand: currentState.deck.hand.length,
                draw: currentState.deck.drawPile.length,
                discard: currentState.deck.discardPile.length,
            },
            hand: currentState.deck.hand.map(c => ({ name: c.name, type: c.type, cost: c.cost })),
            field: {
                structures: currentState.field.structures.map(c => ({ name: c.name })),
                units: currentState.field.units.map(c => ({ name: c.name, attack: c.stats?.attack })),
            },
            currentCrisis: currentState.currentCrisis ? {
                name: currentState.currentCrisis.name,
                requirement: currentState.currentCrisis.requirement,
                penalty: currentState.currentCrisis.penalty
            } : null,
            recentLogs: currentState.logs.slice(-50)
        };

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", 'debug_turn_' + currentState.turn + '.json');
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const handleCopyLogs = () => {
        const allLogs = debugLogger.getAllLogs();
        const text = allLogs.join('\n');
        navigator.clipboard.writeText('[GameTest 전체 로그 분석용 - 총 ' + allLogs.length + '줄]\n' + text)
            .then(() => alert('📝 전체 자동 플레이 로그(' + allLogs.length + '줄)가 복사되었습니다! AI에게 전달해주세요.'))
            .catch(err => console.error('복사 실패:', err));
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
                            <button style={{ ...styles.button, backgroundColor: '#8e44ad' }} onClick={handleStep}>
                                ▶ 1턴 스텝
                            </button>
                            <button 
                                style={{ ...styles.button, backgroundColor: isAutoPlaying ? '#e67e22' : '#2980b9' }} 
                                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                            >
                                {isAutoPlaying ? '⏸ 일시정지' : '▶▶ 오토 플레이'}
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
                <div style={styles.logHeaderRow}>
                    <h2>📜 로그</h2>
                    <div>
                        <button style={styles.buttonAction} onClick={handleCopyLogs}>📋 텍스트 복사</button>
                        <button style={styles.buttonAction} onClick={handleExportJson}>💾 JSON 다운로드</button>
                    </div>
                </div>
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
    buttonAction: {
        padding: '6px 12px',
        fontSize: '12px',
        cursor: 'pointer',
        backgroundColor: '#4a4e69',
        color: '#fff',
        border: '1px solid #9a8c98',
        borderRadius: '4px',
        marginLeft: '10px',
    },
    logHeaderRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px',
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
