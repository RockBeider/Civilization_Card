import React, { useState } from 'react';
import { useSimulationStore } from '../../simulation/SimulationLogger';
import { runSimulationBatch } from '../../simulation/AutoBot';
import { SimulationResult } from '../../types';
import './SimulationDashboard.scss'; // Ensure we create this file later

interface Props {
    onBack: () => void;
}

export const SimulationDashboard: React.FC<Props> = ({ onBack }) => {
    const { isRunning, progress, targetRuns, results, globalStats, simLogs, resetSimulation } = useSimulationStore();
    const [runsInput, setRunsInput] = useState<number>(100);

    const handleStart = async () => {
        resetSimulation();
        // Bot 동작은 UI 메인 스레드를 차지할 수 있으므로, 적절한 setTimeout 으로 풀려있습니다.
        runSimulationBatch(runsInput); 
    };

    const handleStop = () => {
        // Zustand isRunning 플래그 false로 전환시켜 루프 정지 유도
        useSimulationStore.setState({ isRunning: false });
    };

    const percentage = targetRuns > 0 ? Math.floor((progress / targetRuns) * 100) : 0;

    return (
        <div className="simulation-dashboard">
            <div className="dashboard-header">
                <h2>🤖 Auto-Bot Balance Simulator</h2>
                <button onClick={onBack} disabled={isRunning} className="btn-back">메인으로 돌아가기</button>
            </div>

            <div className="dashboard-controls">
                <label>
                    시뮬레이션 횟수 (세션): 
                    <input 
                        type="number" 
                        value={runsInput} 
                        onChange={e => setRunsInput(Number(e.target.value))}
                        disabled={isRunning}
                        min={1}
                        max={10000}
                    />
                </label>
                {!isRunning ? (
                    <button onClick={handleStart} className="btn-run">▶ 시뮬레이션 시작</button>
                ) : (
                    <button onClick={handleStop} className="btn-stop">⏹ 즉시 중단</button>
                )}
            </div>

            <div className="dashboard-progress">
                <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${percentage}%` }}></div>
                </div>
                <p>진행 상황: {progress} / {targetRuns} ({percentage}%) {isRunning && '🏃 달리는 중...'}</p>
            </div>

            <div className="simulation-logs-panel">
                <h4>📜 실시간 시뮬레이션 로그</h4>
                <div className="logs-container">
                    {simLogs.slice().reverse().map((log, i) => (
                        <div key={i} className="log-line">{log}</div>
                    ))}
                    {simLogs.length === 0 && <div className="log-line empty">로그 대기 중...</div>}
                </div>
            </div>

            {globalStats && (
                <div className="dashboard-results">
                    <h3>📊 시뮬레이션 결과 리포트</h3>
                    
                    <div className="stats-grid">
                        <div className="stat-card">
                            <h4>승률 (Win Rate)</h4>
                            <p className="big-number">
                                {globalStats.totalRuns > 0 ? ((globalStats.wins / globalStats.totalRuns) * 100).toFixed(1) : 0}%
                            </p>
                            <span className="sub-text">{globalStats.wins} 승 / {globalStats.losses} 패</span>
                        </div>
                        <div className="stat-card">
                            <h4>평균 생존 턴 달성 (TTK)</h4>
                            <p className="big-number">{globalStats.avgTotalTurns} 턴</p>
                        </div>
                        <div className="stat-card">
                            <h4>위기 극복 성향</h4>
                            <p>정면 돌파: {globalStats.avgCrisisSuccess} 회</p>
                            <p>건물 헷지: {globalStats.avgCrisisHedge} 회</p>
                            <p>긴급 손절: {globalStats.avgCrisisStopLoss} 회</p>
                        </div>
                    </div>

                    <div className="detail-panel">
                        <div className="era-ttk">
                            <h4>⏳ 시대별 등반 평균 턴수</h4>
                            <table>
                                <thead>
                                    <tr>
                                        <th>1. 고대</th>
                                        <th>2. 중세</th>
                                        <th>3. 르네상스</th>
                                        <th>4. 산업</th>
                                        <th>5. 우주</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{globalStats.avgEraTurns[1] > 0 ? `${globalStats.avgEraTurns[1]} 턴` : '-'}</td>
                                        <td>{globalStats.avgEraTurns[2] > 0 ? `${globalStats.avgEraTurns[2]} 턴` : '-'}</td>
                                        <td>{globalStats.avgEraTurns[3] > 0 ? `${globalStats.avgEraTurns[3]} 턴` : '-'}</td>
                                        <td>{globalStats.avgEraTurns[4] > 0 ? `${globalStats.avgEraTurns[4]} 턴` : '-'}</td>
                                        <td>{globalStats.avgEraTurns[5] > 0 ? `${globalStats.avgEraTurns[5]} 턴` : '-'}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <p className="note">* 기획 의도: 각 시대는 평균 5~8턴 내 돌파되어야 적절한 텐션이 유지됨.</p>
                        </div>

                        <div className="death-reasons">
                            <h4>💀 주 패배 원인 분포</h4>
                            <ul>
                                {Object.entries(globalStats.deathReasons).map(([reason, count]) => (
                                    <li key={reason}>
                                        <span className="reason-label">{reason === 'starvation' ? '식량 아사' : reason === 'crisis_damage' ? '위기 치명타' : '기타 미확인'}</span>
                                        <span className="reason-count">{count} 건</span>
                                    </li>
                                ))}
                                {Object.keys(globalStats.deathReasons).length === 0 && <li>사망 기록 없음</li>}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
            
        </div>
    );
};
