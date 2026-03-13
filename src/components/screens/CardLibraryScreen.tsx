import React, { useState, useMemo } from 'react';
import { useGameStore } from '../../store';
import { CARDS, CRISIS_CARDS, CURSE_CARDS, getCurseCardById } from '../../data/cards';
import type { CardData, CardType } from '../../types';
import GameCard from '../ui/Card';
import '../../styles/_screens.scss';

// 통합된 카드 타입 정의
type FilterType = 'all' | CardType;

export function CardLibraryScreen() {
    const { resetGame } = useGameStore();
    const [filter, setFilter] = useState<FilterType>('all');

    // 모든 카드를 하나의 배열로 통합 (일반 + 위기 + 저주)
    // 화면 표시를 위해 런타임 Card 형태와 유사하게 변환하지만 데이터 표시용이므로 CardData를 기반으로 함
    const allCards = useMemo(() => {
        // 일반 카드 (유닛, 구조물, 기술, 액션)
        const normalCards = CARDS.map(card => ({
            ...card,
            isCrisis: false,
            isCurse: false
        }));

        // 위기 카드
        const crisisCards = CRISIS_CARDS.map(card => ({
            ...card,
            isCrisis: true,
            isCurse: false
        }));

        // 저주 카드
        const curseCards = CURSE_CARDS.map(card => ({
            ...card,
            isCrisis: false,
            isCurse: true
        }));

        return [...normalCards, ...crisisCards, ...curseCards];
    }, []);

    // 필터링 적용
    const filteredCards = useMemo(() => {
        if (filter === 'all') return allCards;
        return allCards.filter(card => card.type === filter);
    }, [allCards, filter]);

    // 필터 버튼 정의
    const filterOptions: { type: FilterType; label: string }[] = [
        { type: 'all', label: '모든 카드' },
        { type: 'action', label: '행동 (Action)' },
        { type: 'unit', label: '유닛 (Unit)' },
        { type: 'structure', label: '구조물 (Structure)' },
        { type: 'tech', label: '기술 (Tech)' },
        { type: 'crisis', label: '위기/저주 (Crisis/Curse)' }
    ];

    return (
        <div className="library-screen">
            <div className="library-header">
                <h1>문명 카드 도감</h1>
                <button className="btn-back" onClick={resetGame}>
                    메인으로 돌아가기
                </button>
            </div>

            <div className="library-filters">
                {filterOptions.map((opt) => (
                    <button
                        key={opt.type}
                        className={`filter-btn ${filter === opt.type ? 'active' : ''}`}
                        onClick={() => setFilter(opt.type)}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>

            <div className="library-content">
                <div className="library-grid">
                    {filteredCards.map((card, index) => {
                        // GameCard 렌더링을 위해 Card 런타임 모델 모양으로 변환 (표시용 가상 데이터)
                        const visualCard: any = {
                            id: card.id,
                            name: card.name,
                            type: card.type,
                            era: card.era,
                            cost: card.cost || {},
                            description: card.description || '',
                            stats: card.stats,
                            passive: card.passive,
                            unplayable: card.unplayable
                        };

                        if (card.isCrisis) {
                            // Crisis 카드의 추가 정보
                            const crisisCard = card as any; // 타입 우회
                            if (crisisCard.requirement) {
                                let reqText = '';
                                if (crisisCard.requirement.type === 'resource_check') {
                                    reqText = `${crisisCard.requirement.resource} ${crisisCard.requirement.value} 필요`;
                                } else if (crisisCard.requirement.type === 'combat') {
                                    reqText = `전투력 ${crisisCard.requirement.value} 필요`;
                                } else if (crisisCard.requirement.type === 'tech') {
                                    reqText = `기술 카드 ${crisisCard.requirement.value}장 필요`;
                                }
                                visualCard.description += `\n[해결조건: ${reqText}]`;
                            }
                            if (crisisCard.penalty && crisisCard.penalty.type === 'add_curse_card') {
                                const curse = getCurseCardById(crisisCard.penalty.targetId);
                                visualCard.description += `\n[패널티: ${curse?.name || '저주'} 추가]`;
                            }
                        }

                        return (
                            <div key={`${card.id}-${index}`} className="library-card-wrapper">
                                <GameCard
                                    card={visualCard}
                                    disabled={false}
                                    isPlayable={true}
                                />
                            </div>
                        );
                    })}
                </div>
                {filteredCards.length === 0 && (
                    <div className="library-empty">조건에 맞는 카드가 없습니다.</div>
                )}
            </div>
        </div>
    );
}

export default CardLibraryScreen;
