// ============================================================
// DebugLogger.ts - 전역 인메모리 디버그 로거 (AI 분석용 추출 파이프라인)
// React의 렌더링 사이클에 묶이지 않고 게임의 처음부터 끝까지의 모든 로그를 보존합니다.
// ============================================================

class GameDebugLogger {
    private logs: string[] = [];

    /**
     * 로그를 1줄 추가합니다.
     */
    add(msg: string) {
        this.logs.push(msg);
    }

    /**
     * 지금까지 쌓인 모든 로그를 배열 형태로 반환합니다.
     */
    getAllLogs(): string[] {
        return [...this.logs];
    }

    /**
     * 게임 시작/재시작 시 전체 로그를 초기화합니다.
     */
    clear() {
        this.logs = [];
    }
}

// 싱글톤 인스턴스로 내보내기
export const debugLogger = new GameDebugLogger();
