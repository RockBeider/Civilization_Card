import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { SimulationStore, SimulationResult, SimulationStats } from '../types';

const calculateStats = (results: SimulationResult[]): SimulationStats => {
    const totalRuns = results.length;
    if (totalRuns === 0) {
        return {
            totalRuns: 0,
            wins: 0,
            losses: 0,
            avgTotalTurns: 0,
            avgEraTurns: [0, 0, 0, 0, 0, 0],
            avgCrisisHedge: 0,
            avgCrisisStopLoss: 0,
            avgCrisisSuccess: 0,
            deathReasons: {}
        };
    }

    let wins = 0;
    let totalTurnsSum = 0;
    
    // 시대별(1~5) 시대 달성 유효 게임의 턴 수 덧셈 기록, 카운트 기록
    const eraTurnSums = [0, 0, 0, 0, 0, 0];
    const eraTurnCounts = [0, 0, 0, 0, 0, 0];

    let totalHedge = 0;
    let totalStopLoss = 0;
    let totalSuccess = 0;

    const deathReasons: Record<string, number> = {};

    results.forEach(res => {
        if (res.isWin) wins++;
        else {
            const reason = res.deathReason || 'unknown';
            deathReasons[reason] = (deathReasons[reason] || 0) + 1;
        }

        totalTurnsSum += res.totalTurns;
        totalHedge += res.crisisHedgeCount;
        totalStopLoss += res.crisisStopLossCount;
        totalSuccess += res.crisisSuccessCount;

        for (let era = 1; era <= 5; era++) {
            if (res.eraReachedTurns[era] > 0) {
                eraTurnSums[era] += res.eraReachedTurns[era];
                eraTurnCounts[era]++;
            }
        }
    });

    const avgEraTurns = eraTurnSums.map((sum, index) => 
        eraTurnCounts[index] > 0 ? Number((sum / eraTurnCounts[index]).toFixed(2)) : 0
    );

    return {
        totalRuns,
        wins,
        losses: totalRuns - wins,
        avgTotalTurns: Number((totalTurnsSum / totalRuns).toFixed(2)),
        avgEraTurns,
        avgCrisisHedge: Number((totalHedge / totalRuns).toFixed(2)),
        avgCrisisStopLoss: Number((totalStopLoss / totalRuns).toFixed(2)),
        avgCrisisSuccess: Number((totalSuccess / totalRuns).toFixed(2)),
        deathReasons
    };
};

const initialState = {
    isRunning: false,
    progress: 0,
    targetRuns: 0,
    results: [],
    globalStats: null,
    simLogs: []
};

export const useSimulationStore = create<SimulationStore>()(
    devtools(
        (set, get) => ({
            ...initialState,

            startSimulation: (runs: number) => {
                set({
                    isRunning: true,
                    progress: 0,
                    targetRuns: runs,
                    results: [],
                    globalStats: null,
                    simLogs: [`🔄 자동 시뮬레이션 ${runs}회 진입을 시작했습니다.`]
                });
            },

            addResult: (result: SimulationResult) => {
                const currentResults = get().results;
                currentResults.push(result);
                
                // 100판 단위 등으로 업데이트 하명 화면이 너무 늦으니, 바로 갱신하거나 청크로 묶을 수 있음
                set({ 
                    results: currentResults,
                    progress: currentResults.length 
                });
            },

            finishSimulation: () => {
                const finalResults = get().results;
                set({
                    isRunning: false,
                    globalStats: calculateStats(finalResults)
                });
            },

            resetSimulation: () => {
                set({ ...initialState });
            },

            addSimLog: (msg: string) => {
                const logs = get().simLogs;
                if (logs.length > 500) logs.shift(); // 너무 많은 로그 방지
                set({ simLogs: [...logs, msg] });
            }
        }),
        { name: 'SimulationStore' }
    )
);
