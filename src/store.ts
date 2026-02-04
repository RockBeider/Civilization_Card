// ============================================================
// 문명 덱 빌더 - Zustand 게임 스토어
// ============================================================

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Card, GameState, GameStore, DeckState, FieldState, Resources, PhaseType } from './types';
import { GAME_CONSTANTS } from './data/constants';
import { getRandomCrisisCard, getCurseCardById, CARDS_BY_ERA } from './data/cards';

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
            // CardData -> Card 변환 (instanceId는 구매 시점이나 이곳에서 부여, 여기선 미리 부여해둠)
            // @ts-ignore - CardData와 Card 타입 호환성 문제 해결 필요하지만 일단 캐스팅
            cards.push(instantiateCard(randomCard as any));
        }
    }

    return cards;
};

// --- 초기 상태 ---
const initialResources: Resources = {
    food: GAME_CONSTANTS.STARTING_FOOD,
    production: 0,
    science: GAME_CONSTANTS.STARTING_SCIENCE,
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
};

// --- Zustand 스토어 ---
export const useGameStore = create<GameStore>()(
    devtools(
        (set, get) => ({
            // ========== 상태 ==========
            ...initialState,

            // ========== 액션 ==========

            /**
             * 종족 선택 화면 진입
             */
            enterRaceSelection: () => {
                set({ status: 'race_selection' });
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
                const cost = card.cost.production || 0;

                if (state.resources.production < cost) {
                    set((s) => ({
                        logs: [...s.logs, `❌ 생산력이 부족합니다. (필요: ${cost})`],
                    }));
                    return;
                }

                // 상점에서 카드 제거
                const newShopCards = state.shopCards.filter(c => c.instanceId !== card.instanceId);

                // 구매한 카드를 무덤(Discard Pile)에 추가 (새 ID 부여)
                const newCard = instantiateCard(card);

                set({
                    resources: {
                        ...state.resources,
                        production: state.resources.production - cost
                    },
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
                let newProduction = GAME_CONSTANTS.BASE_PRODUCTION;
                let newFood = state.resources.food;
                let newScience = state.resources.science;

                // 2. 구조물 패시브 효과 발동 (턴 시작)
                state.field.structures.forEach((structure) => {
                    if (structure.passive?.trigger === 'turn_start') {
                        const effectResult = structure.passive.effect(state);
                        if (effectResult.resources) {
                            newFood += effectResult.resources.food || 0;
                            newProduction += effectResult.resources.production || 0;
                            newScience += effectResult.resources.science || 0;
                        }
                        newLogs.push(`🏭 ${structure.name}: 효과 발동!`);
                    }
                });

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

                // 행동 단계에서 턴 종료 버튼 클릭 시 → 위기+정산 처리
                if (state.phase === 'action') {
                    set({ phase: 'crisis' });
                    // endTurn()이 위기 판정 + 정산 단계를 모두 처리
                    get().endTurn();
                } else if (state.phase === 'start') {
                    // 준비 단계 완료 후 행동 단계로
                    set({ phase: 'action' });
                }
                // crisis, end 단계는 endTurn() 내부에서 자동 처리됨
            },

            /**
             * 현재 위기 해결 (3단계)
             */
            resolveCrisis: () => {
                const state = get();
                const newLogs = [...state.logs];
                let newHealth = state.playerStats.health;
                let newResources = { ...state.resources };
                let newDeck = { ...state.deck };

                newLogs.push(`--- 위기 단계 ---`);

                if (!state.currentCrisis) {
                    newLogs.push('✨ 이번 턴에는 위기가 없습니다.');
                } else {
                    const crisis = state.currentCrisis;
                    newLogs.push(`⚔️ ${crisis.name} 해결 판정...`);

                    let resolved = false;

                    // --- 전투 위기 ---
                    if (crisis.requirement.type === 'combat') {
                        const totalAttack = state.field.units.reduce(
                            (sum, unit) => sum + (unit.stats?.attack || 0),
                            0
                        );
                        const requiredAttack = crisis.requirement.value;

                        if (totalAttack >= requiredAttack) {
                            newLogs.push(`✅ 방어 성공! (아군 공격력 ${totalAttack} >= 위기 공격력 ${requiredAttack})`);
                            resolved = true;
                        } else {
                            newLogs.push(`❌ 방어 실패! (아군 공격력 ${totalAttack} < 위기 공격력 ${requiredAttack})`);
                        }
                    }
                    // --- 자원 위기 ---
                    else if (crisis.requirement.type === 'resource_check') {
                        const resource = crisis.requirement.resource!;
                        const requiredAmount = crisis.requirement.value;
                        const currentAmount = newResources[resource];

                        if (currentAmount >= requiredAmount) {
                            newResources[resource] -= requiredAmount;
                            newLogs.push(`✅ ${resource} ${requiredAmount} 소모하여 해결!`);
                            resolved = true;
                        } else {
                            newLogs.push(`❌ ${resource} 부족! (보유 ${currentAmount} < 필요 ${requiredAmount})`);
                        }
                    }
                    // --- 기술 위기 ---
                    else if (crisis.requirement.type === 'tech') {
                        const techCards = [...state.deck.hand, ...state.deck.drawPile, ...state.deck.discardPile]
                            .filter(c => c.type === 'tech');
                        const requiredCount = crisis.requirement.value;

                        if (techCards.length >= requiredCount) {
                            newLogs.push(`✅ 기술 카드 ${techCards.length}장 보유로 해결!`);
                            resolved = true;
                        } else {
                            newLogs.push(`❌ 기술 카드 부족! (보유 ${techCards.length} < 필요 ${requiredCount})`);
                        }
                    }

                    // --- 페널티 또는 보상 적용 ---
                    if (!resolved) {
                        // 페널티 적용
                        const penalty = crisis.penalty;
                        switch (penalty.type) {
                            case 'damage_hp':
                                newHealth -= penalty.value;
                                newLogs.push(`💥 피해 ${penalty.value} 입음!`);
                                break;
                            case 'lose_resource':
                                // 식량 비율 감소 (value = 비율)
                                const lostFood = Math.floor(newResources.food * (penalty.value / 100));
                                newResources.food -= lostFood;
                                newLogs.push(`💸 식량 ${lostFood} 손실!`);
                                break;
                            case 'destroy_structure':
                                // 마지막 구조물 제거
                                if (state.field.structures.length > 0) {
                                    newLogs.push(`🔥 건물 파괴!`);
                                }
                                break;
                            case 'add_curse_card':
                                // 저주 카드를 덱에 추가
                                const curseCard = getCurseCardById(penalty.targetId || 'curse_starvation');
                                if (curseCard) {
                                    for (let i = 0; i < penalty.value; i++) {
                                        const instantiated = { ...curseCard, instanceId: Math.random().toString(36).substring(2, 11) };
                                        newDeck.drawPile = [...newDeck.drawPile, instantiated];
                                    }
                                    newDeck.drawPile = shuffleArray(newDeck.drawPile);
                                    newLogs.push(`😱 저주 카드 "${curseCard.name}" ${penalty.value}장이 덱에 추가됨!`);
                                }
                                break;
                        }
                    } else {
                        // 보상 적용 (있는 경우)
                        if (crisis.reward) {
                            const reward = crisis.reward;
                            if (reward.type === 'gain_resource' && reward.resource && reward.value) {
                                newResources[reward.resource] += reward.value;
                                newLogs.push(`🎁 보상: ${reward.resource} +${reward.value}`);
                            }
                        }
                    }
                }

                // 게임 오버 확인
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

                // 종료 단계로 진행
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
                let newDeck = { ...currentState.deck };

                // ========== 1. 위기 판정 (위기 해결) ==========
                newLogs.push(`--- 위기 단계 ---`);

                if (!currentState.currentCrisis) {
                    newLogs.push('✨ 이번 턴에는 위기가 없습니다.');
                } else {
                    const crisis = currentState.currentCrisis;
                    newLogs.push(`⚔️ ${crisis.name} 해결 판정...`);

                    let resolved = false;

                    // --- 전투 위기 ---
                    if (crisis.requirement.type === 'combat') {
                        const totalAttack = currentState.field.units.reduce(
                            (sum, unit) => sum + (unit.stats?.attack || 0),
                            0
                        );
                        const requiredAttack = crisis.requirement.value;

                        if (totalAttack >= requiredAttack) {
                            newLogs.push(`✅ 방어 성공! (아군 공격력 ${totalAttack} >= 위기 공격력 ${requiredAttack})`);
                            resolved = true;
                        } else {
                            newLogs.push(`❌ 방어 실패! (아군 공격력 ${totalAttack} < 위기 공격력 ${requiredAttack})`);
                        }
                    }
                    // --- 자원 위기 ---
                    else if (crisis.requirement.type === 'resource_check') {
                        const resource = crisis.requirement.resource!;
                        const requiredAmount = crisis.requirement.value;
                        const currentAmount = newResources[resource];

                        if (currentAmount >= requiredAmount) {
                            newResources[resource] -= requiredAmount;
                            newLogs.push(`✅ ${resource} ${requiredAmount} 소모하여 해결!`);
                            resolved = true;
                        } else {
                            newLogs.push(`❌ ${resource} 부족! (보유 ${currentAmount} < 필요 ${requiredAmount})`);
                        }
                    }
                    // --- 기술 위기 ---
                    else if (crisis.requirement.type === 'tech') {
                        const techCards = [...currentState.deck.hand, ...currentState.deck.drawPile, ...currentState.deck.discardPile]
                            .filter(c => c.type === 'tech');
                        const requiredCount = crisis.requirement.value;

                        if (techCards.length >= requiredCount) {
                            newLogs.push(`✅ 기술 카드 ${techCards.length}장 보유로 해결!`);
                            resolved = true;
                        } else {
                            newLogs.push(`❌ 기술 카드 부족! (보유 ${techCards.length} < 필요 ${requiredCount})`);
                        }
                    }

                    // --- 페널티 또는 보상 적용 ---
                    if (!resolved) {
                        const penalty = crisis.penalty;
                        switch (penalty.type) {
                            case 'damage_hp':
                                newHealth -= penalty.value;
                                newLogs.push(`💥 피해 ${penalty.value} 입음!`);
                                break;
                            case 'lose_resource':
                                const lostFood = Math.floor(newResources.food * (penalty.value / 100));
                                newResources.food -= lostFood;
                                newLogs.push(`💸 식량 ${lostFood} 손실!`);
                                break;
                            case 'destroy_structure':
                                if (currentState.field.structures.length > 0) {
                                    newLogs.push(`🔥 건물 파괴!`);
                                }
                                break;
                            case 'add_curse_card':
                                const curseCard = getCurseCardById(penalty.targetId || 'curse_starvation');
                                if (curseCard) {
                                    for (let i = 0; i < penalty.value; i++) {
                                        const instantiated = { ...curseCard, instanceId: Math.random().toString(36).substring(2, 11) };
                                        newDeck.drawPile = [...newDeck.drawPile, instantiated];
                                    }
                                    newDeck.drawPile = shuffleArray(newDeck.drawPile);
                                    newLogs.push(`😱 저주 카드 "${curseCard.name}" ${penalty.value}장이 덱에 추가됨!`);
                                }
                                break;
                        }
                    } else {
                        // Apply Reward (if any)
                        if (crisis.reward) {
                            const reward = crisis.reward;
                            if (reward.type === 'gain_resource' && reward.resource && reward.value) {
                                newResources[reward.resource] += reward.value;
                                newLogs.push(`🎁 보상: ${reward.resource} +${reward.value}`);
                            }
                        }
                    }
                }

                // 위기로 인한 게임 오버 확인
                if (newHealth <= 0) {
                    newLogs.push('💀 체력 소진! 게임 오버.');
                    set({
                        status: 'gameover',
                        playerStats: { ...currentState.playerStats, health: 0 },
                        logs: newLogs,
                        currentCrisis: null,
                    });
                    return;
                }

                // ========== 2. 정산 단계 (종료 단계) ==========
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
                    const damage = deficit * GAME_CONSTANTS.STARVATION_DAMAGE;
                    newHealth -= damage;
                    newFood = 0;
                    newLogs.push(`⚠️ 식량 부족! 피해 ${damage} 입음. (부족량: ${deficit})`);
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
                        ...newDeck,
                        hand: [],
                        discardPile: [...newDeck.discardPile, ...discardedHand],
                    },
                    turn: newTurn,
                    phase: 'start' as PhaseType,
                    playerStats: { ...currentState.playerStats, health: newHealth },
                    currentCrisis: null,
                    logs: newLogs,
                });

                // 다음 턴 시작
                get().executeStartPhase();
            },

            /**
             * 다음 시대로 발전
             */
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
                set((state) => ({
                    logs: [...state.logs, message].slice(-50), // 최근 50개 로그 유지
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
