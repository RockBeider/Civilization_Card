import { useGameStore } from '../store';
import { useSimulationStore } from './SimulationLogger';
import { SimulationResult, GameState } from '../types';

/**
 * 봇이 1턴의 액션을 수행 (수동 호출 및 관전용으로 export)
 */
export const playTurn = (state: GameState) => {
    const store = useGameStore.getState();
    const { phase, turn } = store;

    // 1. 위기 페이즈 처리
    if (phase === 'crisis') {
        const crisis = store.currentCrisis;
        if (crisis) {
            // SUCCESS 판별 로직 복제
            let canSuccess = false;
            
            if (crisis.requirement.type === 'combat') {
                const totalAttack = store.field.units.reduce((sum, unit) => sum + (unit.stats?.attack || 0), 0);
                canSuccess = totalAttack >= crisis.requirement.value;
            } else if (crisis.requirement.type === 'resource_check') {
                const resName = crisis.requirement.resource!;
                const currentAmount = store.resources[resName] || 0;
                canSuccess = currentAmount >= crisis.requirement.value;
            } else if (crisis.requirement.type === 'tech') {
                const techCards = [...store.deck.hand, ...store.deck.drawPile, ...store.deck.discardPile].filter(c => c.type === 'tech');
                canSuccess = techCards.length >= crisis.requirement.value;
            }

            if (canSuccess) {
                store.addLog('[AutoBot] 위기 상황: 요구 조건 충족으로 완벽한 극복(SUCCESS) 선택');
                store.resolveCrisis('SUCCESS');
                return 'CRISIS_SUCCESS';
            } else if (store.field.structures.length > 0) {
                // 건물이 있다면 헤지
                store.addLog('[AutoBot] 위기 상황: 조건 미달, 건물을 희생하여 저주 방어(HEDGE) 선택');
                store.resolveCrisis('HEDGE');
                return 'CRISIS_HEDGE';
            } else {
                // 최후의 수단
                store.addLog('[AutoBot] 위기 상황: 자원/가용 건물 없음, 통과 후 체력 피해 감수(STOP_LOSS) 선택');
                store.resolveCrisis('STOP_LOSS');
                return 'CRISIS_STOP_LOSS';
            }
        }
    }

    // 2. 액션 페이즈 처리
    if (phase === 'action') {
        const era = store.era;
        const res = store.resources;

        // --- 카드 가치 평가 함수 ---
        const evaluateCard = (c: { type?: string; passive?: any; stats?: any; id?: string }) => {
            let score = 0;
            // 시대 발전 카드는 최우선 구매
            if (c.id?.startsWith('era_advance_')) score += 100;
            // 패시브 효과가 있는 건물(동굴 거주지 등)은 최고 우선
            if (c.type === 'structure' && c.passive) score += 50;
            // 일반 건물(나무 방벽 등 패시브 없음)은 낮은 우선
            if (c.type === 'structure' && !c.passive) score += 5;
            // 기술 카드(불의 발견 등)는 위기 대비 + 과학 기여
            if (c.type === 'tech') score += 30;
            // 액션 카드(채집, 사냥, 연구 등)는 즉시 자원 획득
            if (c.type === 'action') score += 20;
            // 유닛: 전투력이 있으면 위기 대비에 유용
            if (c.type === 'unit' && (c.stats?.attack || 0) > 0) score += 15;
            return score;
        };

        // --- 비용 지불 가능 체크 함수 ---
        const canAfford = (cost: { food?: number; production?: number; science?: number; energy?: number }) => {
            if (cost.food && res.food < cost.food) return false;
            if (cost.production && res.production < cost.production) return false;
            if (cost.science && res.science < cost.science) return false;
            if (cost.energy && res.energy < cost.energy) return false;
            return true;
        };

        // [우선순위 1] 핸드 카드 사용 (가치 높은 카드 우선, 필드 포화 체크)
        const structuresFull = store.field.structures.length >= 8;
        const unitsFull = store.field.units.length >= 8;

        const playableHandCards = store.deck.hand
            .filter(c => {
                if (c.unplayable) return false;
                if (!canAfford(c.cost)) return false;
                // 필드 슬롯이 가득 찬 타입의 카드는 스킵
                if (c.type === 'structure' && structuresFull) return false;
                if (c.type === 'unit' && unitsFull) return false;
                return true;
            })
            .sort((a, b) => evaluateCard(b) - evaluateCard(a));

        if (playableHandCards.length > 0 && playableHandCards[0].instanceId) {
            const bestCard = playableHandCards[0];
            store.addLog('[AutoBot] 손패의 ' + bestCard.name + ' 카드 사용');
            store.playCard(bestCard.instanceId);
            return 'ACTION_PLAYED';
        }

        // [우선순위 3] 상점 구매 (가치 기반 필터링, 필드 포화 시 해당 타입 스킵)
        const affordableShopCards = store.shopCards
            .filter(c => {
                if (!canAfford(c.cost)) return false;
                // 필드가 가득 찬 타입은 구매하지 않음
                if (c.type === 'structure' && structuresFull) return false;
                if (c.type === 'unit' && unitsFull) return false;
                return true;
            })
            .sort((a, b) => evaluateCard(b) - evaluateCard(a));

        if (affordableShopCards.length > 0) {
            const bestShopCard = affordableShopCards[0];
            store.addLog('[AutoBot] 잉여 자원으로 상점에서 ' + bestShopCard.name + ' 구매');
            store.buyCard(bestShopCard);
            return 'ACTION_PLAYED';
        }

        // 아무 액션도 할 수 없으면 턴 종료
        store.addLog('[AutoBot] 액션 포인트 및 사용 가능 카드 고갈. 페이즈 종료');
        store.nextPhase();
        return 'TURN_ENDED';
    }

    return 'NONE';
};

/**
 * 게임 한 판(세션)을 끝까지 돌리고 결과를 반환
 */
export const simulateOneGame = async (): Promise<SimulationResult> => {
    const store = useGameStore.getState();
    const simStore = useSimulationStore.getState();
    
    // 게임 초기화
    store.resetGame();
    // 덱은 아무 종족과 스타터(빈 배열 대체)로 시작
    store.startGame([], 'NEANDERTHAL');

    const result: SimulationResult = {
        isWin: false,
        totalTurns: 0,
        eraReachedTurns: [-1, -1, -1, -1, -1, -1],
        crisisHedgeCount: 0,
        crisisStopLossCount: 0,
        crisisSuccessCount: 0,
    };

    let prevEra = 0;
    
    // 타임아웃 방지용 최대 턴
    const MAX_TURNS = 1000;

    while (true) {
        const currentState = useGameStore.getState();
        
        // 상태 확인
        if (currentState.status === 'gameover') {
            result.isWin = false;
            result.totalTurns = currentState.turn;
            
            // 데스 리즌 판별 (체력 0 이면 아사 or 데미지)
            const logs = currentState.logs;
            const lastLogs = logs.slice(-5).join(" ");
            if (lastLogs.includes("식량 부족")) result.deathReason = 'starvation';
            else if (lastLogs.includes("체력 15 감소") || lastLogs.includes("피해")) result.deathReason = 'crisis_damage';
            else result.deathReason = 'unknown';
            
            break;
        }

        if (currentState.status === 'victory') {
            result.isWin = true;
            result.totalTurns = currentState.turn;
            break;
        }

        if (currentState.turn >= MAX_TURNS) {
            result.isWin = false;
            result.totalTurns = MAX_TURNS;
            result.deathReason = 'unknown';
            break; // 락업(Lock-up) 방지
        }

        // 시대 변화 감지
        if (currentState.era > prevEra) {
            result.eraReachedTurns[currentState.era] = currentState.turn;
            prevEra = currentState.era;
        }

        // 봇 행동 실행
        const actionResult = playTurn(currentState);
        
        if (actionResult === 'CRISIS_SUCCESS') result.crisisSuccessCount++;
        if (actionResult === 'CRISIS_HEDGE') result.crisisHedgeCount++;
        if (actionResult === 'CRISIS_STOP_LOSS') result.crisisStopLossCount++;

        // 이벤트 루프 해방 (Web Worker가 아닐 때 메인 스레드 락업 방지)
        // 엄청난 횟수면 약간의 딜레이만 줌
        // if (currentState.turn % 10 === 0) {
        // }
    }
    
    return result;
};

/**
 * 전체 무인 시뮬레이션 시작 핸들러
 */
export const runSimulationBatch = async (runs: number) => {
    const simStore = useSimulationStore.getState();
    simStore.startSimulation(runs);

    for (let i = 0; i < runs; i++) {
        // 현재 시뮬이 취소되었는지 확인
        if (!useSimulationStore.getState().isRunning) break;

        const result = await simulateOneGame();
        useSimulationStore.getState().addResult(result);
        
        // 텍스트 로깅 추가
        const winText = result.isWin ? '✅ 승리' : '💀 패배';
        const reasonText = !result.isWin ? ' (원인: ' + result.deathReason + ')' : '';
        simStore.addSimLog('[Run ' + (i + 1) + '] ' + winText + ' - ' + result.totalTurns + '턴 종료 ' + reasonText);

        // UI 렌더링 프레임 할당
        await new Promise(resolve => setTimeout(resolve, 0));
    }

    useSimulationStore.getState().finishSimulation();
};
