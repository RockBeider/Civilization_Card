import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useAnimation, PanInfo } from 'framer-motion';
import { useGameStore } from '../../store';
import './CrisisModal.scss';

const SWIPE_THRESHOLD = 150; // 드래그 승인 임계값

const CrisisModal: React.FC = () => {
    const { currentCrisis, resolveCrisis, phase, resources, field, deck } = useGameStore();
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const controls = useAnimation();
    
    // 모션 밸류
    const x = useMotionValue(0);
    
    // 배경색 변화: 좌측(-150px) 빨강, 중앙(0) 어두운회색, 우측(150px) 초록
    const backgroundColor = useTransform(
        x, 
        [-SWIPE_THRESHOLD, 0, SWIPE_THRESHOLD], 
        ['#ff4d4f', '#3a3a4a', '#4CAF50']
    );

    // 회전: 드래그 시 약간 기울어짐
    const rotate = useTransform(x, [-SWIPE_THRESHOLD, SWIPE_THRESHOLD], [-10, 10]);

    // 좌우 투명도(안내 텍스트): 좌측 이동 시 '손절매' 텍스트 뚜렷, 우측 이동 시 '극복' 텍스트 뚜렷
    const stopLossOpacity = useTransform(x, [-SWIPE_THRESHOLD / 2, -SWIPE_THRESHOLD], [0, 1]);
    const successOpacity = useTransform(x, [SWIPE_THRESHOLD / 2, SWIPE_THRESHOLD], [0, 1]);

    if (phase !== 'crisis' || !currentCrisis) return null;

    // SUCCESS 조건 판별 및 텍스트 준비
    let canSuccess = false;
    let successReqText = '';
    
    if (currentCrisis.requirement.type === 'combat') {
        const totalAttack = field.units.reduce((sum, unit) => sum + (unit.stats?.attack || 0), 0);
        canSuccess = totalAttack >= currentCrisis.requirement.value;
        successReqText = `전투력 ${totalAttack} / ${currentCrisis.requirement.value}`;
    } else if (currentCrisis.requirement.type === 'resource_check') {
        const res = currentCrisis.requirement.resource!;
        const currentAmount = resources[res] || 0;
        canSuccess = currentAmount >= currentCrisis.requirement.value;
        successReqText = `${res} ${currentAmount} / ${currentCrisis.requirement.value}`;
    } else if (currentCrisis.requirement.type === 'tech') {
        const techCards = [...deck.hand, ...deck.drawPile, ...deck.discardPile].filter(c => c.type === 'tech');
        canSuccess = techCards.length >= currentCrisis.requirement.value;
        successReqText = `기술 카드 ${techCards.length} / ${currentCrisis.requirement.value}장`;
    }

    const handleDragEnd = async (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        setIsDragging(false);
        const offsetX = info.offset.x;
        
        if (offsetX < -SWIPE_THRESHOLD) {
            // 좌측 스와이프: STOP_LOSS
            await controls.start({ x: -500, opacity: 0, transition: { duration: 0.3 } });
            resolveCrisis('STOP_LOSS');
        } else if (offsetX > SWIPE_THRESHOLD) {
            // 우측 스와이프: SUCCESS
            if (canSuccess) {
                await controls.start({ x: 500, opacity: 0, transition: { duration: 0.3 } });
                resolveCrisis('SUCCESS');
            } else {
                // 조건 미달 시 되돌아가기
                controls.start({ x: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } });
            }
        } else {
            // 임계값 미달 시 되돌아가기
            controls.start({ x: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } });
        }
    };

    return (
        <div className="crisis-modal-overlay">
            <div className="crisis-container" ref={containerRef}>
                {/* 뒷배경 안내 텍스트 */}
                <div className="swipe-indicators">
                    <motion.div className="indicator left" style={{ opacity: stopLossOpacity }}>
                        <h2>💥 긴급 손절매</h2>
                        <p>최대 HP -15 희생</p>
                    </motion.div>
                    
                    <motion.div className="indicator right" style={{ opacity: successOpacity }}>
                        <h2>✨ 완벽한 극복</h2>
                        <p>{successReqText} 지불</p>
                        {!canSuccess && <p className="error">조건 미달</p>}
                    </motion.div>
                </div>

                {/* 메인 드래그 카드 */}
                <motion.div 
                    className={`tinder-card ${isDragging ? 'dragging' : ''}`}
                    style={{ x, backgroundColor, rotate }}
                    drag="x"
                    dragConstraints={containerRef}
                    onDragStart={() => setIsDragging(true)}
                    onDragEnd={handleDragEnd}
                    animate={controls}
                    whileTap={{ scale: 0.98 }}
                >
                    <div className="card-header">
                        <h2>⚠️ 위기 발생: {currentCrisis.name}</h2>
                        <p className="crisis-desc">{currentCrisis.description || "문명에 심각한 위기가 닥쳤습니다!"}</p>
                    </div>

                    <div className="card-content">
                        <div className="requirement-box">
                            <h4>극복 요구 조건</h4>
                            <p className={`req-text ${canSuccess ? 'met' : 'unmet'}`}>
                                {successReqText} ({canSuccess ? '충족' : '부족'})
                            </p>
                            {currentCrisis.reward && (
                                <p className="reward-text">보상: {currentCrisis.reward.resource} +{currentCrisis.reward.value}</p>
                            )}
                        </div>
                    </div>

                    <div className="swipe-hint">
                        <span className="arrow left">← 손절매 (HP -15)</span>
                        <span className="drag-icon">👆 드래그하여 결정</span>
                        <span className="arrow right">완벽한 극복 (SUCCESS) →</span>
                    </div>
                </motion.div>

                {/* 하단 헷지 버튼 */}
                <div className="hedge-action">
                    <button 
                        className="hedge-btn"
                        onClick={() => resolveCrisis('HEDGE')}
                    >
                        <h3>🚧 위험 헷징 (HEDGE)</h3>
                        <p>무작위 건물 1채 소실 대신 저주 방어</p>
                    </button>
                    {!canSuccess && (
                        <p className="notice-text">※ 현재 극복 조건을 만족하지 못하여 우측 스와이프를 할 수 없습니다.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CrisisModal;
