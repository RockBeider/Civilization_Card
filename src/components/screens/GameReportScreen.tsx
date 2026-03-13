import React from 'react';
import { useGameStore } from '../../store';
import { Rocket } from '../ui/Icons';
import './GameReportScreen.scss'; 

interface Props {
    onRestart: () => void;
}

export const GameReportScreen: React.FC<Props> = ({ onRestart }) => {
    const { status, turn, era, resources, field, playerStats, logs } = useGameStore();
    
    const isVictory = status === 'victory';
    
    // 패배 원인 판독
    const deathReason = !isVictory 
        ? (logs.slice(-5).join(" ").includes("식량 부족") ? "만성적 기아" : "위험 페널티 누적") 
        : "우주 개척(승리)";

    const title = isVictory ? "🏆 우주 시대 도달!" : "💀 문명 멸망";
    const subTitle = isVictory ? "당신의 문명은 지구의 한계를 넘어 별들을 향해 나아갑니다." : "역사 속으로 사라졌습니다...";

    // 클립보드 복사 텍스트
    const handleCopyReport = () => {
        const reportTxt = '[문명결과] ' + title + '\n'
            + '도달 턴: ' + turn + '턴 | 최종 시대: ' + era + '시대\n'
            + '사인/달성: ' + deathReason + '\n'
            + '남은 자원: 🍖 ' + resources.food + ' ⚙️ ' + resources.production + ' 🔬 ' + resources.science + ' ⚡ ' + resources.energy + '\n'
            + '건설된 건물: ' + field.structures.length + '개';
        navigator.clipboard.writeText(reportTxt).then(() => {
            alert("보고서가 복사되었습니다!");
        }).catch(() => {
            alert("복사 실패. 브라우저 권한을 확인해주세요.");
        });
    }

    return (
        <div className={'game-report-screen ' + (isVictory ? 'victory-bg' : 'gameover-bg')}>
            <div className="report-content animate-fade-in">
                {isVictory && <Rocket size={80} className="victory-icon" />}
                <h1 className="report-title">{title}</h1>
                <p className="report-subtitle">{subTitle}</p>
                
                <div className="report-stats">
                    <h3 className="section-title">📊 게임 결과 요약</h3>
                    <div className="stat-grid">
                        <div className="stat-card">
                            <span>최종 생존 턴</span>
                            <strong>{turn} 턴</strong>
                        </div>
                        <div className="stat-card">
                            <span>도달 시대</span>
                            <strong>{era} 시대</strong>
                        </div>
                        <div className="stat-card">
                            <span>{isVictory ? '달성 목표' : '사망 원인'}</span>
                            <strong>{deathReason}</strong>
                        </div>
                        <div className="stat-card">
                            <span>남은 체력</span>
                            <strong>{playerStats.health} / {playerStats.maxHealth}</strong>
                        </div>
                    </div>

                    <h3 className="section-title">🏗️ 제국의 유산 (남은 자원 & 필드)</h3>
                    <div className="stat-grid">
                        <div className="stat-card">
                            <span>잔여 식량 (🍖)</span>
                            <strong>{resources.food}</strong>
                        </div>
                        <div className="stat-card">
                            <span>잔여 생산 (⚙️)</span>
                            <strong>{resources.production}</strong>
                        </div>
                        <div className="stat-card">
                            <span>잔여 과학 (🔬)</span>
                            <strong>{resources.science}</strong>
                        </div>
                        <div className="stat-card">
                            <span>에너지 (⚡)</span>
                            <strong>{resources.energy}</strong>
                        </div>
                        <div className="stat-card" style={{ gridColumn: 'span 2' }}>
                            <span>건립된 건물 수</span>
                            <strong>{field.structures.length} 채</strong>
                        </div>
                        <div className="stat-card" style={{ gridColumn: 'span 2' }}>
                            <span>파견된 유닛 수</span>
                            <strong>{field.units.length} 기</strong>
                        </div>
                    </div>
                </div>

                <div className="report-actions">
                    <button onClick={handleCopyReport} className="btn-copy">📋 결과 복사하기</button>
                    <button onClick={onRestart} className="btn-restart">메인 화면으로 (다시 시작)</button>
                </div>
            </div>
        </div>
    );
};
