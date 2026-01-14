import { Rocket } from '../ui/Icons';

interface VictoryScreenProps {
    onRestart: () => void;
}

export function VictoryScreen({ onRestart }: VictoryScreenProps) {
    return (
        <div className="victory-screen">
            <div className="victory-bg"></div>
            <div className="victory-content animate-fade-in">
                <Rocket size={80} className="victory-icon" />
                <h1 className="victory-title">우주 시대 도달</h1>
                <p className="victory-text">당신의 문명은 지구의 한계를 넘어 별들을 향해 나아갑니다.<br />위대한 여정의 새로운 시작입니다.</p>
                <button onClick={onRestart} className="victory-btn">메인 화면으로</button>
            </div>
        </div>
    );
}
