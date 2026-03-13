// ============================================================
// 문명 덱 빌더 - Zustand 게임 스토어
// ============================================================

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Card, GameState, GameStore, DeckState, FieldState, Resources, PhaseType, CrisisCardData } from './types';
import { GAME_CONSTANTS } from './data/constants';
import { getRandomCrisisCard, CARDS_BY_ERA, getEraAdvanceCard } from './data/cards';
import { debugLogger } from './utils/DebugLogger';

// --- 도우미: 고유 인스턴스 ID 생성 ---
const generateInstanceId = (): string => {
    return Math.random().toString(36).substring(2, 11);
};

// --- 도우미: 피셔-예이츠 셔플 ---
const shuffleArray = <T>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

// --- 도우미: 카드 인스턴스화 (고유 instanceId 추가) ---
const instantiateCard = (card: Card): Card => ({
    ...card,
    instanceId: generateInstanceId(),
});

// --- 도우미: 상점 카드 뽑기 (확률 적용) ---
const getShopCards = (currentEra: number, count: number): Card[] => {
    const cards: Card[] = [];

    // 시대별 카드 풀 준비
    const currentEraCards = CARDS_BY_ERA.find(g => g.era === (currentEra === 0 ? 'Primitive' :
        currentEra === 1 ? 'Ancient' :
            currentEra === 2 ? 'Medieval' :
                currentEra === 3 ? 'Renaissance' :
                    currentEra === 4 ? 'Industrial' : 'Space'))?.cards || [];

    const prevEraCards = currentEra > 0 ? CARDS_BY_ERA.find(g => g.era === (currentEra - 1 === 0 ? 'Primitive' :
        currentEra - 1 === 1 ? 'Ancient' :
            currentEra - 1 === 2 ? 'Medieval' :
                currentEra - 1 === 3 ? 'Renaissance' :
                    currentEra - 1 === 4 ? 'Industrial' : 'Space'))?.cards || [] : [];

    // 각 슬롯마다 확률적으로 카드 선택
    for (let i = 0; i < count; i++) {
        let selectedPool = currentEraCards;

        // 원시 시대가 아니고, 이전 시대 카드가 있다면 20% 확률로 이전 시대 카드 등장
        if (currentEra > 0 && prevEraCards.length > 0) {
            if (Math.random() < 0.2) {
                selectedPool = prevEraCards;
            }
        }

        // 풀에서 랜덤 선택
        if (selectedPool.length > 0) {
            const randomCard = selectedPool[Math.floor(Math.random() * selectedPool.length)];
            // @ts-ignore - CardData와 Card 타입 호환성 문제 해결 필요하지만 일단 캐스팅
            cards.push(instantiateCard(randomCard as any));
        }
    }

    // 시대 발전 카드를 4번째 슬롯으로 추가 (우주 시대 미만일 때)
    const eraCard = getEraAdvanceCard(currentEra);
    if (eraCard) {
        cards.push(eraCard);
    }

    return cards;
};

// --- 초기 상태 ---
const initialResources: Resources = {
    food: GAME_CONSTANTS.STARTING_FOOD,
    production: 0,
    science: GAME_CONSTANTS.STARTING_SCIENCE,
    energy: 5,
};

const initialDeck: DeckState = {
    drawPile: [],
    hand: [],
    discardPile: [],
};

const initialField: FieldState = {
    structures: [],
    units: [],
};

const initialState: GameState = {
    resources: initialResources,
    era: 0,
    deck: initialDeck,
    field: initialField,
    shopCards: [],
    turn: 1,
    status: 'title',
    phase: 'start',
    currentCrisis: null,
    nextCrisis: null,
    crisisCooldown: Math.floor(Math.random() * (GAME_CONSTANTS.CRISIS_COOLDOWN_MAX - GAME_CONSTANTS.CRISIS_COOLDOWN_MIN + 1)) + GAME_CONSTANTS.CRISIS_COOLDOWN_MIN,
    playerStats: {
        health: GAME_CONSTANTS.PLAYER_HP,
        maxHealth: GAME_CONSTANTS.PLAYER_MAX_HP,
    },
    playerRace: null,
    logs: [],
    debuffs: [],
};

// --- Zustand 스토어 ---
export const useGameStore = create<GameStore>()(
    devtools(
        (set, get) => ({
            // ========== 상태 ==========
            ...initialState,

            // ========== 액션 ==========
            // 도감 화면 진입
            openLibrary: () => {
                set({ status: 'library' });
            },

            /**
             * 종족 선택 화면 진입
             */
            enterRaceSelection: () => {
                set({ status: 'race_selection' });
            },

            /**
             * 시뮬레이터 화면 진입
             */
            enterSimulation: () => {
                set({ status: 'simulation' });
                // 시뮬레이터 전역 보드 리셋
                get().resetGame();
                set({ status: 'simulation' }); // override target
            },

            /**
             * 주어진 시작 덱과 종족으로 새 게임 시작
             */
            startGame: (starterDeck: Card[], race: string) => {
                const instantiatedDeck = starterDeck.map(instantiateCard);
                const shuffledDeck = shuffleArray(instantiatedDeck);

                // 초기 상점 구성
                const initialShop = getShopCards(0, 3); // 원시 시대(0)로 시작

                set({
                    ...initialState,
                    status: 'playing',
                    phase: 'start',
                    playerRace: race,
                    deck: {
                        drawPile: shuffledDeck,
                        hand: [],
                        discardPile: [],
                    },
                    shopCards: initialShop,
                    logs: [`🎮 ${race} 종족으로 게임 시작!`, `🏪 상점이 열렸습니다.`],
                });

                debugLogger.clear();
                debugLogger.add(`--- 🎮 ${race} 종족 게임 시작 ---`);

                // 시작 단계 실행
                get().executeStartPhase();
            },

            /**
             * 게임을 초기 상태로 재설정
             */
            resetGame: () => {
                set(initialState);
            },

            /**
             * 뽑을 덱에서 카드를 손으로 가져옴
             */
            drawCard: (count: number) => {
                set((state) => {
                    let { drawPile, hand, discardPile } = state.deck;
                    const drawnCards: Card[] = [];
                    const newLogs = [...state.logs];

                    for (let i = 0; i < count; i++) {
                        // 뽑을 덱이 비어있으면, 버린 카드 덱을 섞어서 뽑을 덱으로 이동
                        if (drawPile.length === 0) {
                            if (discardPile.length === 0) {
                                newLogs.push('⚠️ 더 이상 뽑을 카드가 없습니다.');
                                break; // 더 이상 뽑을 카드가 없음
                            }
                            drawPile = shuffleArray(discardPile);
                            discardPile = [];
                            newLogs.push('🔄 덱을 섞었습니다.');
                        }

                        const card = drawPile.pop();
                        if (card) {
                            drawnCards.push(card);
                        }
                    }

                    return {
                        deck: {
                            drawPile: [...drawPile],
                            hand: [...hand, ...drawnCards],
                            discardPile: [...discardPile],
                        },
                        logs: newLogs,
                    };
                });
            },

            /**
             * 손패의 카드를 사용
             */
            playCard: (cardInstanceId: string) => {
                const state = get();

                // 행동 단계에서만 카드 사용 가능
                if (state.phase !== 'action') {
                    set((s) => ({
                        logs: [...s.logs, '❌ 행동 단계에서만 카드를 사용할 수 있습니다.'],
                    }));
                    return;
                }

                const cardIndex = state.deck.hand.findIndex(
                    (c) => c.instanceId === cardInstanceId
                );

                if (cardIndex === -1) {
                    set((s) => ({
                        logs: [...s.logs, '❌ 카드를 찾을 수 없습니다.'],
                    }));
                    return;
                }

                const card = state.deck.hand[cardIndex];

                // 카드가 사용 가능한지 확인
                if (card.unplayable) {
                    set((s) => ({
                        logs: [...s.logs, `❌ ${card.name}은(는) 사용할 수 없는 카드입니다.`],
                    }));
                    return;
                }

                // 비용 확인 (주로 생산력 사용)
                const { food = 0, production = 0, science = 0 } = card.cost;
                if (
                    state.resources.food < food ||
                    state.resources.production < production ||
                    state.resources.science < science
                ) {
                    set((s) => ({
                        logs: [...s.logs, `❌ 자원이 부족합니다. (필요: 식량 ${food}, 생산 ${production}, 과학 ${science})`],
                    }));
                    return;
                }

                // 필드 슬롯 제한 확인
                if (card.type === 'structure' && state.field.structures.length >= GAME_CONSTANTS.FIELD_SLOTS.structures) {
                    set((s) => ({
                        logs: [...s.logs, `❌ 건물 슬롯이 가득 찼습니다. (최대 ${GAME_CONSTANTS.FIELD_SLOTS.structures})`],
                    }));
                    return;
                }
                if (card.type === 'unit' && state.field.units.length >= GAME_CONSTANTS.FIELD_SLOTS.units) {
                    set((s) => ({
                        logs: [...s.logs, `❌ 유닛 슬롯이 가득 찼습니다. (최대 ${GAME_CONSTANTS.FIELD_SLOTS.units})`],
                    }));
                    return;
                }

                // 비용 차감
                const newResources: Resources = {
                    food: state.resources.food - food,
                    production: state.resources.production - production,
                    science: state.resources.science - science,
                    energy: state.resources.energy,
                };

                // 손패에서 카드 제거
                const newHand = [...state.deck.hand];
                newHand.splice(cardIndex, 1);

                // 카드 효과 적용
                const effectResult = card.effect(state);

                // 효과 결과를 현재 상태와 병합
                const mergedResources = {
                    ...newResources,
                    ...(effectResult.resources || {}),
                };

                // 사용된 카드가 어디로 갈지 결정
                let newDiscardPile = [...state.deck.discardPile];
                let newStructures = [...state.field.structures];
                let newUnits = [...state.field.units];

                if (card.type === 'structure') {
                    newStructures.push(card);
                } else if (card.type === 'unit') {
                    newUnits.push(card);
                } else {
                    // 행동, 기술, 위기 -> 버림
                    newDiscardPile.push(card);
                }

                set({
                    resources: mergedResources,
                    deck: {
                        ...state.deck,
                        hand: newHand,
                        discardPile: newDiscardPile,
                    },
                    field: {
                        structures: newStructures,
                        units: newUnits,
                    },
                    // 효과로 인한 다른 상태 변경 사항 병합
                    era: effectResult.era ?? state.era,
                    playerStats: effectResult.playerStats ?? state.playerStats,
                    logs: [...state.logs, `✅ ${card.name} 사용!`],
                });
            },

            /**
             * 손패에서 특정 카드를 버림
             */
            discardCard: (cardInstanceId: string) => {
                set((state) => {
                    const cardIndex = state.deck.hand.findIndex(
                        (c) => c.instanceId === cardInstanceId
                    );

                    if (cardIndex === -1) return state;

                    const card = state.deck.hand[cardIndex];
                    const newHand = [...state.deck.hand];
                    newHand.splice(cardIndex, 1);

                    return {
                        deck: {
                            ...state.deck,
                            hand: newHand,
                            discardPile: [...state.deck.discardPile, card],
                        },
                        logs: [...state.logs, `🗑️ ${card.name} 버림.`],
                    };
                });
            },

            // ========== 상점 액션 ==========

            /**
             * 상점 새로고침
             */
            refreshShop: () => {
                const state = get();
                // 비용: 생산력 2 (예외: 턴 시작 시 무료 호출은 비용 로직 밖이어야 함, 여기서 비용 체크하면 됨)
                // 만약 이 함수를 '비용 지불 버전'과 '무료 버전'으로 나눌 필요가 있다면 인자로 처리.
                // 여기서는 UI에서 호출하는 '유료' 새로고침을 기본으로 하고,
                // 턴 시작 시에는 내부 로직으로 처리하거나 별도 함수 사용.
                // -> 턴 시작 시에는 getShopCards만 따로 호출해서 set 하면 됨.
                // -> 따라서 이 함수는 유저 액션용(유료)으로 정의.

                if (state.resources.production < 2) {
                    set((s) => ({
                        logs: [...s.logs, `❌ 생산력이 부족합니다. (필요: 2)`],
                    }));
                    return;
                }

                const newShopCards = getShopCards(state.era, 3);

                set({
                    resources: {
                        ...state.resources,
                        production: state.resources.production - 2
                    },
                    shopCards: newShopCards,
                    logs: [...state.logs, `🔄 상점 목록을 갱신했습니다. (비용: 2 생산)`],
                });
            },

            /**
             * 카드 구매
             */
            buyCard: (card: Card) => {
                const state = get();
                const costFood = card.cost.food || 0;
                const costProd = card.cost.production || 0;
                const costSci = card.cost.science || 0;

                // 다중 자원 비용 체크
                const missingRes: string[] = [];
                if (state.resources.food < costFood) missingRes.push(`식량 ${costFood}`);
                if (state.resources.production < costProd) missingRes.push(`생산 ${costProd}`);
                if (state.resources.science < costSci) missingRes.push(`과학 ${costSci}`);

                if (missingRes.length > 0) {
                    set((s) => ({
                        logs: [...s.logs, `❌ 자원이 부족합니다. (필요: ${missingRes.join(', ')})`],
                    }));
                    return;
                }

                // 상점에서 카드 제거
                const newShopCards = state.shopCards.filter(c => c.instanceId !== card.instanceId);

                // 자원 차감
                const newResources = {
                    ...state.resources,
                    food: state.resources.food - costFood,
                    production: state.resources.production - costProd,
                    science: state.resources.science - costSci,
                };

                // 시대 발전 카드인지 확인
                if (card.id.startsWith('era_advance_')) {
                    // 시대 발전: 덱에 추가하지 않고 즉시 시대 올림
                    const nextEra = state.era + 1;
                    if (nextEra >= 6) {
                        set({
                            status: 'victory',
                            resources: newResources,
                            shopCards: newShopCards,
                            logs: [...state.logs, '🎉 우주 시대에 도달했습니다! 승리!'],
                        });
                        return;
                    }
                    set({
                        era: nextEra,
                        resources: newResources,
                        shopCards: newShopCards,
                        logs: [...state.logs, `🎊 ${card.name} 구매! 시대 ${nextEra}(${['원시','고대','중세','르네상스','산업','우주'][nextEra]})로 진입!`],
                    });
                    return;
                }

                // 일반 카드: 구매한 카드를 버림 더미에 추가
                const newCard = instantiateCard(card);
                set({
                    resources: newResources,
                    shopCards: newShopCards,
                    deck: {
                        ...state.deck,
                        discardPile: [...state.deck.discardPile, newCard]
                    },
                    logs: [...state.logs, `💰 ${card.name} 구매 완료!`],
                });
            },

            /**
             * 카드 폐기 (덱 압축)
             */
            removeCard: (cardInstanceId: string) => {
                const state = get();
                const cost = 3; // 고정 비용 3

                if (state.resources.production < cost) {
                    set((s) => ({
                        logs: [...s.logs, `❌ 생산력이 부족합니다. (필요: ${cost})`],
                    }));
                    return;
                }

                // 모든 덱에서 카드 찾기
                let { drawPile, hand, discardPile } = state.deck;
                let found = false;
                let cardName = "";

                // 1. Hand
                const handIndex = hand.findIndex(c => c.instanceId === cardInstanceId);
                if (handIndex !== -1) {
                    cardName = hand[handIndex].name;
                    hand = [...hand];
                    hand.splice(handIndex, 1);
                    found = true;
                }

                // 2. Draw Pile
                if (!found) {
                    const drawIndex = drawPile.findIndex(c => c.instanceId === cardInstanceId);
                    if (drawIndex !== -1) {
                        cardName = drawPile[drawIndex].name;
                        drawPile = [...drawPile];
                        drawPile.splice(drawIndex, 1);
                        found = true;
                    }
                }

                // 3. Discard Pile
                if (!found) {
                    const discardIndex = discardPile.findIndex(c => c.instanceId === cardInstanceId);
                    if (discardIndex !== -1) {
                        cardName = discardPile[discardIndex].name;
                        discardPile = [...discardPile];
                        discardPile.splice(discardIndex, 1);
                        found = true;
                    }
                }

                if (!found) {
                    set((s) => ({
                        logs: [...s.logs, `❌ 카드를 찾을 수 없습니다.`],
                    }));
                    return;
                }

                set({
                    resources: {
                        ...state.resources,
                        production: state.resources.production - cost
                    },
                    deck: {
                        drawPile,
                        hand,
                        discardPile
                    },
                    logs: [...state.logs, `🗑️ ${cardName} 카드를 영구적으로 제거했습니다.`],
                });
            },

            /**
             * 필드에 배치된 유닛/건물을 철거 (생산력 1 소모)
             */
            removeFieldCard: (cardInstanceId: string, fieldType: 'structure' | 'unit') => {
                const state = get();

                if (state.phase !== 'action') {
                    set((s) => ({
                        logs: [...s.logs, '❌ 행동 단계에서만 필드 카드를 제거할 수 있습니다.'],
                    }));
                    return;
                }

                const cost = 1; // 철거 비용: 생산력 1
                if (state.resources.production < cost) {
                    set((s) => ({
                        logs: [...s.logs, `❌ 생산력이 부족합니다. (필요: ${cost})`],
                    }));
                    return;
                }

                const fieldList = fieldType === 'structure' ? state.field.structures : state.field.units;
                const cardIndex = fieldList.findIndex(c => c.instanceId === cardInstanceId);

                if (cardIndex === -1) {
                    set((s) => ({
                        logs: [...s.logs, '❌ 필드에서 카드를 찾을 수 없습니다.'],
                    }));
                    return;
                }

                const card = fieldList[cardIndex];
                const newList = [...fieldList];
                newList.splice(cardIndex, 1);

                const newField = fieldType === 'structure'
                    ? { ...state.field, structures: newList }
                    : { ...state.field, units: newList };

                set({
                    resources: {
                        ...state.resources,
                        production: state.resources.production - cost,
                    },
                    field: newField,
                    deck: {
                        ...state.deck,
                        discardPile: [...state.deck.discardPile, card],
                    },
                    logs: [...state.logs, `🔧 ${card.name}을(를) 철거했습니다. (생산력 -${cost})`],
                });
            },

            // ========== 단계 관리 ==========

            /**
             * 시작 단계 실행 (1단계)
             * - 생산력을 기본값으로 재설정
             * - 구조물 패시브 효과 발동
             * - **상점 자동 갱신 (무료)**
             * - 카드 드로우
             * - 위기 활성화
             */
            executeStartPhase: () => {
                const state = get();
                const newLogs = [...state.logs];

                newLogs.push(`--- 턴 ${state.turn} 준비 단계 ---`);

                // 1. 생산력을 기본값으로 재설정
                let newProduction: number = GAME_CONSTANTS.BASE_PRODUCTION;
                let newFood = state.resources.food;
                let newScience = state.resources.science;

                // 2. 구조물 패시브 효과 발동 (턴 시작)
                state.field.structures.forEach((structure) => {
                    if (structure.passive?.trigger === 'turn_start' && typeof structure.passive.effect === 'function') {
                        const tempState = {
                            ...state,
                            resources: {
                                food: newFood,
                                production: newProduction,
                                science: newScience,
                                energy: state.resources.energy
                            }
                        };
                        const effectResult = structure.passive.effect(tempState);
                        if (effectResult.resources) {
                            if (typeof effectResult.resources.food === 'number') newFood = effectResult.resources.food;
                            if (typeof effectResult.resources.production === 'number') newProduction = effectResult.resources.production;
                            if (typeof effectResult.resources.science === 'number') newScience = effectResult.resources.science;
                        }
                        newLogs.push(`🏭 ${structure.name}: 효과 발동!`);
                    }
                });

                // 디버프 적용 (YIELD_HALVED 등)
                const isYieldHalved = state.debuffs.some(d => d.type === 'YIELD_HALVED');
                if (isYieldHalved) {
                    newProduction = Math.floor(newProduction / 2);
                    newLogs.push(`📉 디플레이션 위기! 이번 턴 생산량이 절반으로 감소합니다.`);
                }

                newLogs.push(`⚡ 생산력 ${newProduction} 획득`);

                // 3. 상점 자동 갱신 (무료)
                const newShopCards = getShopCards(state.era, 3);
                newLogs.push(`🏪 상점에 새로운 물자가 들어왔습니다.`);

                // 4. 위기 쿨다운 체크 및 활성화
                let currentCrisis: CrisisCardData | null = null;
                let nextCrisis = state.nextCrisis;
                let newCrisisCooldown = state.crisisCooldown;

                if (newCrisisCooldown > 0) {
                    // 쿨다운 중 - 위기 없음
                    newCrisisCooldown--;
                    newLogs.push(`🛡️ 평화로운 턴입니다. (다음 위기까지 ${newCrisisCooldown}턴)`);
                } else {
                    // 쿨다운 종료 - 위기 발생!
                    currentCrisis = nextCrisis || getRandomCrisisCard(state.era);
                    nextCrisis = getRandomCrisisCard(state.era);
                    // 다음 위기까지 쿨다운 재설정 (2-5턴)
                    newCrisisCooldown = Math.floor(Math.random() * (GAME_CONSTANTS.CRISIS_COOLDOWN_MAX - GAME_CONSTANTS.CRISIS_COOLDOWN_MIN + 1)) + GAME_CONSTANTS.CRISIS_COOLDOWN_MIN;

                    if (currentCrisis) {
                        newLogs.push(`⚠️ 위기 발생: ${currentCrisis.name} - ${currentCrisis.description}`);
                    }
                    if (nextCrisis) {
                        newLogs.push(`📢 다음 위기 예고: ${nextCrisis.name}`);
                    }
                }

                set({
                    resources: {
                        food: newFood,
                        production: newProduction,
                        science: newScience,
                        energy: state.resources.energy,
                    },
                    currentCrisis: currentCrisis,
                    nextCrisis: nextCrisis,
                    crisisCooldown: newCrisisCooldown,
                    shopCards: newShopCards, // 상점 갱신 적용
                    phase: 'action',
                    logs: newLogs,
                });

                // 5. Draw cards (생산력 비례 드로우)
                // HandSize = 5(기본) + floor(TurnProduction / 10), 최대 10장
                const baseHandSize = GAME_CONSTANTS.HAND_SIZE; // 5
                const bonusCards = Math.floor(newProduction / 10);
                const maxHandSize = 10;
                const totalHandSize = Math.min(baseHandSize + bonusCards, maxHandSize);

                get().drawCard(totalHandSize);

                set((s) => ({
                    logs: [...s.logs, `🃏 카드 ${totalHandSize}장 드로우 (기본 ${baseHandSize} + 보너스 ${bonusCards}${totalHandSize >= maxHandSize ? ', 최대' : ''}). 행동 단계 시작!`],
                }));
            },

            /**
             * 다음 단계로 이동
             * 행동 단계에서 "턴 종료" 버튼 클릭 시 호출
             */
            nextPhase: () => {
                const state = get();

                if (state.phase === 'action') {
                    if (state.currentCrisis) {
                        set({
                            phase: 'crisis',
                            logs: [...state.logs, `--- 위기 단계 ---`, `⚠️ ${state.currentCrisis.name} 위기가 닥쳤습니다! 대응을 선택해주세요.`]
                        });
                    } else {
                        set({ phase: 'end' });
                        get().endTurn();
                    }
                } else if (state.phase === 'start') {
                    set({ phase: 'action' });
                }
            },

            /**
             * 현재 위기 해결 (3단계 - 다중 상태 변이 지원)
             */
            resolveCrisis: (choice: 'SUCCESS' | 'HEDGE' | 'STOP_LOSS') => {
                const state = get();
                
                // 위기 상태가 아니거나 위기가 존재하지 않으면 동작하지 않음
                if (state.phase !== 'crisis' || !state.currentCrisis) return;

                const newLogs = [...state.logs];
                let newHealth = state.playerStats.health;
                let newResources = { ...state.resources };
                let newDeck = { ...state.deck };
                const crisis = state.currentCrisis;

                newLogs.push(`--- 위기 대응: ${choice} ---`);

                switch(choice) {
                    case 'SUCCESS': {
                        let resolved = false;
                        if (crisis.requirement.type === 'combat') {
                            const totalAttack = state.field.units.reduce((sum, unit) => sum + (unit.stats?.attack || 0), 0);
                            if (totalAttack >= crisis.requirement.value) {
                                newLogs.push(`✅ 방어 성공! (아군 공격력 ${totalAttack} >= 위기 공격력 ${crisis.requirement.value})`);
                                resolved = true;
                            } else {
                                set({ logs: [...newLogs, `❌ 방어 실패! 조건을 만족하지 않아 SUCCESS를 선택할 수 없습니다.`] });
                                return;
                            }
                        } else if (crisis.requirement.type === 'resource_check') {
                            const res = crisis.requirement.resource!;
                            if (newResources[res] >= crisis.requirement.value) {
                                newResources[res] -= crisis.requirement.value;
                                newLogs.push(`✅ ${res} ${crisis.requirement.value} 소모하여 해결!`);
                                resolved = true;
                            } else {
                                set({ logs: [...newLogs, `❌ 자원이 부족하여 SUCCESS를 선택할 수 없습니다.`] });
                                return;
                            }
                        } else if (crisis.requirement.type === 'tech') {
                            const techCards = [...state.deck.hand, ...state.deck.drawPile, ...state.deck.discardPile].filter(c => c.type === 'tech');
                            if (techCards.length >= crisis.requirement.value) {
                                newLogs.push(`✅ 기술 카드 요구치 충족으로 해결!`);
                                resolved = true;
                            } else {
                                set({ logs: [...newLogs, `❌ 기술 카드가 부족하여 SUCCESS를 선택할 수 없습니다.`] });
                                return;
                            }
                        }

                        if (resolved && crisis.reward) {
                            if (crisis.reward.type === 'gain_resource' && crisis.reward.resource && crisis.reward.value) {
                                newResources[crisis.reward.resource] += crisis.reward.value;
                                newLogs.push(`🎁 보상: ${crisis.reward.resource} +${crisis.reward.value}`);
                            }
                        }
                        // 전투 승리 시에도 가장 약한 유닛 1기 전사 (전투 피해)
                        if (resolved && crisis.requirement.type === 'combat' && state.field.units.length > 0) {
                            const sortedUnits = [...state.field.units].sort((a, b) => (a.stats?.attack || 0) - (b.stats?.attack || 0));
                            const casualty = sortedUnits[0];
                            const survivingUnits = state.field.units.filter(u => u.instanceId !== casualty.instanceId);
                            newLogs.push(`⚔️ 전투 피해: 유닛 [${casualty.name}]이(가) 전사했습니다.`);
                            set({ field: { ...state.field, units: survivingUnits } });
                        }
                        break;
                    }

                    case 'HEDGE': {
                        // 부분 상환: 무작위 건조물 파괴
                        const newStructures = [...state.field.structures];
                        if (newStructures.length > 0) {
                            const randomIndex = Math.floor(Math.random() * newStructures.length);
                            const destroyed = newStructures.splice(randomIndex, 1)[0];
                            newLogs.push(`🚧 HEDGE 선택: 무작위 건물 [${destroyed.name}]을(를) 철거하여 위기를 방어합니다.`);
                            set({ field: { ...state.field, structures: newStructures } });
                        } else {
                            newLogs.push(`🚧 HEDGE 선택: 파괴할 건물이 없어 무사히 넘어갑니다.`);
                        }
                        break;
                    }

                    case 'STOP_LOSS': {
                        // 긴급 손절매: 10 HP 희생 + 필드 피해
                        const hpLoss = 10;
                        newHealth = Math.max(0, newHealth - hpLoss);
                        newLogs.push(`💥 STOP_LOSS 선택: 긴급 손절매로 체력 ${hpLoss}을 희생했습니다.`);

                        // 전투형 위기: 유닛 1기 전사 / 그 외: 건물 1동 파괴
                        const newUnits = [...state.field.units];
                        const newStopStructures = [...state.field.structures];
                        
                        if (crisis.requirement.type === 'combat' && newUnits.length > 0) {
                            const idx = Math.floor(Math.random() * newUnits.length);
                            const fallen = newUnits.splice(idx, 1)[0];
                            newLogs.push(`⚔️ 위기 피해: 유닛 [${fallen.name}]이(가) 전사했습니다.`);
                        } else if (newStopStructures.length > 0) {
                            const idx = Math.floor(Math.random() * newStopStructures.length);
                            const destroyed = newStopStructures.splice(idx, 1)[0];
                            newLogs.push(`🔥 위기 피해: 건물 [${destroyed.name}]이(가) 파괴되었습니다.`);
                        }
                        
                        set({ field: { structures: newStopStructures, units: newUnits } });
                        break;
                    }
                }

                // 체력 소진 시 게임 오버 처리
                if (newHealth <= 0) {
                    newLogs.push('💀 체력 소진! 게임 오버.');
                    set({
                        status: 'gameover',
                        playerStats: { ...state.playerStats, health: 0 },
                        logs: newLogs,
                        currentCrisis: null,
                    });
                    return;
                }

                set({
                    resources: newResources,
                    deck: newDeck,
                    playerStats: { ...state.playerStats, health: newHealth },
                    logs: newLogs,
                    currentCrisis: null,
                    phase: 'end',
                });

                // 위기 해결이 완료되면 종료 단계(endTurn)를 호출하여 넘김
                get().endTurn();
            },

            /**
             * 종료 단계 (4단계) - 통합된 턴 종료 처리
             * 1. 위기 판정 (위기 해결)
             * 2. 유지비 지불
             * 3. 기아 판정
             * 4. 핸드 버리기
             * 5. 턴 증가
             */
            endTurn: () => {
                const currentState = get();
                const newLogs = [...currentState.logs];
                let newHealth = currentState.playerStats.health;
                let newResources = { ...currentState.resources };

                // ========== 정산 단계 (종료 단계) ==========
                
                // --- 상태 이상(Debuffs) 턴 감소 ---
                const nextDebuffs = currentState.debuffs
                    .map(d => ({ ...d, duration: d.duration - 1 }))
                    .filter(d => {
                        if (d.duration <= 0) {
                            newLogs.push(`✨ 상태 이상 해제: ${d.type}`);
                            return false;
                        }
                        return true;
                    });

                newLogs.push(`--- 정산 단계 ---`);

                // --- 유지비 계산 ---
                const unitUpkeep = currentState.field.units.reduce(
                    (sum, unit) => sum + (unit.stats?.upkeep || 1),
                    0
                );
                const structureUpkeep = currentState.field.structures.reduce(
                    (sum, struct) => sum + (struct.stats?.upkeep || 0),
                    0
                );
                const totalUpkeep = unitUpkeep + structureUpkeep;

                let newFood = newResources.food - totalUpkeep;

                // --- 기아 판정 ---
                if (newFood < 0) {
                    const deficit = Math.abs(newFood);
                    let damage = deficit * GAME_CONSTANTS.STARVATION_DAMAGE;
                    if (damage > 15) {
                        damage = 15;
                    }
                    newHealth -= damage;
                    newFood = 0;
                    newLogs.push(`⚠️ 식량 부족! 피해 ${damage} 입음. (부족량: ${deficit}, 최대 15 제한 적용)`);
                } else {
                    newLogs.push(`🍖 유지비 ${totalUpkeep} 식량 소모.`);
                }

                // 기아로 인한 게임 오버 확인
                if (newHealth <= 0) {
                    newLogs.push('💀 체력 소진! 게임 오버.');
                    set({
                        status: 'gameover',
                        playerStats: { ...currentState.playerStats, health: 0 },
                        logs: newLogs,
                    });
                    return;
                }

                // --- 핸드 버리기 ---
                const discardedHand = [...currentState.deck.hand];
                newLogs.push(`🗑️ 핸드 ${discardedHand.length}장 버림.`);

                // --- 턴 증가 ---
                const newTurn = currentState.turn + 1;
                newLogs.push(`✨ 턴 ${currentState.turn} 종료. 다음 턴 준비...`);

                // Update state
                set({
                    resources: {
                        ...newResources,
                        food: newFood,
                        production: 0,
                    },
                    deck: {
                        ...currentState.deck,
                        hand: [],
                        discardPile: [...currentState.deck.discardPile, ...discardedHand],
                    },
                    turn: newTurn,
                    phase: 'start' as PhaseType,
                    playerStats: { ...currentState.playerStats, health: newHealth },
                    currentCrisis: null,
                    logs: newLogs,
                    debuffs: nextDebuffs,
                });

                // 다음 턴 시작
                get().executeStartPhase();
            },

            advanceEra: () => {
                const state = get();
                const currentEra = state.era;

                if (currentEra >= 5) {
                    // 승리 조건: 우주 시대 도달
                    set((s) => ({
                        status: 'victory',
                        logs: [...s.logs, '🎉 우주 시대에 도달했습니다! 승리!'],
                    }));
                    return;
                }

                const cost = GAME_CONSTANTS.ERA_COSTS[currentEra];

                if (state.resources.science < cost) {
                    set((s) => ({
                        logs: [...s.logs, `❌ 과학이 부족합니다. (필요: ${cost}, 보유: ${state.resources.science})`],
                    }));
                    return;
                }

                set((s) => ({
                    era: currentEra + 1,
                    resources: {
                        ...s.resources,
                        science: s.resources.science - cost,
                    },
                    logs: [...s.logs, `🎊 시대 발전! 시대 ${currentEra + 1}로 진입!`],
                }));
            },

            /**
             * 종족 고유 능력 발동
             */
            useRaceAbility: (targetCardInstanceId?: string) => {
                const state = get();
                const newLogs = [...state.logs];

                if (state.playerRace !== 'HOMO_SAPIENS') {
                    set({ logs: [...newLogs, '⚠️ 해당 종족 능력을 사용할 수 없습니다.'] });
                    return;
                }
                
                if (state.resources.energy < 2) {
                    set({ logs: [...newLogs, '⚠️ 에너지 파워가 부족합니다. (필요: 2 에너지)'] });
                    return;
                }

                if (!targetCardInstanceId) {
                    set({ logs: [...newLogs, '⚠️ 되돌릴 카드를 선택해주세요.'] });
                    return; // 방어용
                }

                const targetIndex = state.deck.hand.findIndex(c => c.instanceId === targetCardInstanceId);
                if (targetIndex === -1) return;

                const newHand = [...state.deck.hand];
                const [cardToBottom] = newHand.splice(targetIndex, 1);
                
                let newDrawPile = [...state.deck.drawPile];
                let newDiscardPile = [...state.deck.discardPile];
                
                // 덱 맨 밑으로 삽입
                newDrawPile.push(cardToBottom);

                // 덱에서 1장 뽑아오기
                if (newDrawPile.length === 0 && newDiscardPile.length > 0) {
                    newDrawPile = shuffleArray([...newDiscardPile, cardToBottom]); // 버린 카드와 새 카드를 합쳐 셔플
                    newDiscardPile = [];
                }

                const drawnCard = newDrawPile.shift(); // 위에서 뽑기
                if (drawnCard) {
                    newHand.push(drawnCard);
                    newLogs.push(`🧬 호모 사피엔스 특성 발동: [${cardToBottom.name}]을 덱 밑으로 넣고 [${drawnCard.name}]을 뽑았습니다. (에너지 -2)`);
                } else {
                    newLogs.push(`🧬 호모 사피엔스 특성 발동: [${cardToBottom.name}]을 덱 밑으로 넣었습니다. (뽑을 카드가 없습니다) (에너지 -2)`);
                }

                set({
                    resources: { ...state.resources, energy: state.resources.energy - 2 },
                    deck: {
                        drawPile: newDrawPile,
                        hand: newHand,
                        discardPile: newDiscardPile,
                    },
                    logs: newLogs,
                });
            },

            /**
             * 덱(뽑을 덱)을 섞음
             */
            shuffleDeck: () => {
                set((state) => ({
                    deck: {
                        ...state.deck,
                        drawPile: shuffleArray(state.deck.drawPile),
                    },
                    logs: [...state.logs, '🔄 덱을 섞었습니다.'],
                }));
            },

            /**
             * 로그 메시지 추가
             */
            addLog: (message: string) => {
                debugLogger.add(message);
                set((state) => ({
                    logs: [...state.logs, message].slice(-50), // 최근 50개 제한
                }));
            },

            /**
             * 디버깅용 치트 함수
             */
            cheat: {
                addResources: (amount: number) => {
                    set((state) => ({
                        resources: {
                            food: state.resources.food + amount,
                            production: state.resources.production + amount,
                            science: state.resources.science + amount,
                            energy: state.resources.energy + amount,
                        },
                        logs: [...state.logs, `[CHEAT] 자원 +${amount}`],
                    }));
                },
                drawCards: (count: number) => {
                    get().drawCard(count);
                },
            },
        }),
        { name: 'CivDeckBuilder' } // DevTools 이름
    )
);
