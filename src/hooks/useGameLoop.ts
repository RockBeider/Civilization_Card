import { useState, useCallback, useEffect } from 'react';
import { CARDS, CARD_POOLS } from '../data/cards'; // Updated import path
import { RACES, AGES } from '../data/constants';
import { CardData, Resources, RaceData } from '../types';

// Helper to shuffle array
const shuffle = (array: any[]) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
};

// Helper to instantiate a card (give it unique ID)
const instantiateCard = (cardId: string): CardData | null => {
    const cardData = CARDS.find(c => c.id === cardId);
    if (!cardData) return null;
    return {
        ...cardData,
        uniqueId: Math.random().toString(36).substr(2, 9)
    };
};

export const useGameLoop = () => {
    // Game State
    const [gameState, setGameState] = useState<'selection' | 'playing' | 'victory' | 'gameover'>('selection');
    const [selectedRace, setSelectedRace] = useState<RaceData | null>(null);
    const [resources, setResources] = useState<Resources>({ energy: 3, food: 0, prod: 0, sci: 0 });
    const [currentAge, setCurrentAge] = useState<number>(0);
    const [turn, setTurn] = useState<number>(1);

    // Card State
    const [deck, setDeck] = useState<CardData[]>([]);
    const [hand, setHand] = useState<CardData[]>([]);
    const [discard, setDiscard] = useState<CardData[]>([]);
    const [field, setField] = useState<CardData[]>([]); // Structures in play

    // Messages
    const [logs, setLogs] = useState([]);
    const addLog = (msg) => setLogs(prev => [msg, ...prev].slice(0, 20));

    // --- Actions ---

    const startGame = (raceId: string) => {
        const race = RACES.find(r => r.id === raceId);
        if (!race) return;
        setSelectedRace(race);

        // Init Resources
        // Energy starts at 3 or Race Bonus. Food/Prod/Sci start at 0.
        const startEnergy = 3 + (race.bonus?.energy || 0);
        setResources({ energy: startEnergy, food: 5, prod: 0, sci: 0 });

        // Build Starter Deck
        const starterDeckIds = race.starter_deck;
        const starterCards = starterDeckIds.map(instantiateCard).filter(c => c);

        // Shuffle and Set
        const shuffled = shuffle([...starterCards]);
        setDeck(shuffled);
        setHand([]);
        setDiscard([]);
        setField([]);
        setCurrentAge(0);
        setTurn(1);
        setGameState('playing');
        addLog(`${race.name} 문명으로 시작합니다.`);

        // Draw initial hand
        drawCards(shuffled, [], 5);
    };

    const drawCards = (currentDeck: CardData[], currentDiscard: CardData[], count: number) => {
        let newDeck = [...currentDeck];
        let newDiscard = [...currentDiscard];
        let drawn = [];

        for (let i = 0; i < count; i++) {
            if (newDeck.length === 0) {
                if (newDiscard.length === 0) break; // No cards left
                // Reshuffle
                newDeck = shuffle([...newDiscard]);
                newDiscard = [];
                addLog("덱을 섞었습니다.");
            }
            drawn.push(newDeck.pop());
        }

        setDeck(newDeck);
        setDiscard(newDiscard);
        setHand(prev => [...prev, ...drawn]);
    };

    const playCard = (card: CardData) => {
        // Cost Check
        if (card.cost.energy !== undefined && (resources.energy || 0) < card.cost.energy) return addLog("행동력이 부족합니다.");
        if (card.cost.production && resources.prod < card.cost.production) return addLog("생산력이 부족합니다.");
        if (card.cost.food && resources.food < card.cost.food) return addLog("식량이 부족합니다.");
        if (card.cost.science && resources.sci < card.cost.science) return addLog("과학이 부족합니다.");

        // Pay Cost
        setResources(prev => ({
            energy: (prev.energy || 0) - (card.cost.energy || 0),
            food: prev.food - (card.cost.food || 0),
            prod: prev.prod - (card.cost.production || 0),
            sci: prev.sci - (card.cost.science || 0)
        }));

        // Execute Effect
        if (card.type === 'Action') {
            if (card.effect.type === 'resource') {
                const amount = card.effect.value; // Could apply multipliers here
                setResources(prev => ({
                    ...prev,
                    [card.effect.target]: (prev[card.effect.target] || 0) + amount
                }));
                addLog(`${card.name} 사용: ${card.effect.target} +${amount}`);
            }
            // Move to Discard
            setDiscard(prev => [...prev, card]);
        } else if (card.type === 'Structure' || card.type === 'Unit') {
            // Move to Field (Units can also be deployed now if they have Type Unit)
            // But wait, "Worker" is Unit but we decided it gives Immediate Prod.
            // Actually, if Worker has "passive" it should stay on field.
            // If it has "effect" it acts like action?
            // Let's stick to rule: Type Structure OR Unit -> Field.
            // But Worker 01 has 'effect' AND 'passive' in my update?
            // Oh, I commented out effect in cards.js or changed it?
            // "Worker" 01 in cards.js: type: "Unit", passive: ..., cost: ...
            // So it should go to field.
            if (field.length >= 5) return addLog("배치 공간이 부족합니다!");
            setField(prev => [...prev, card]);
            addLog(`${card.name} 배치 완료.`);
        }



        // Remove from Hand
        setHand(prev => prev.filter(c => c.uniqueId !== card.uniqueId));
    };

    const endTurn = () => {
        // 1. Calculate Upkeep (Food)
        // Upkeep = Sum of all (stats.upkeep) from Field + Hand/Deck/Discard base cost?
        // Proposal:
        // - Unit/Structure Cards on Field: Consume 'stats.upkeep'
        // - Population (Cards in Deck/Hand/Discard): Consume 1 Food per 3 cards (Base population upkeep)

        let fieldUpkeep = 0;
        field.forEach(c => {
            if (c.stats && c.stats.upkeep) fieldUpkeep += c.stats.upkeep;
        });

        const totalCards = deck.length + hand.length + discard.length;
        const popUpkeep = Math.floor(totalCards / 3);

        const totalUpkeep = fieldUpkeep + popUpkeep;

        let newFood = resources.food - totalUpkeep;
        if (newFood < 0) {
            addLog(`⚠️ 식량 부족! (필요: ${totalUpkeep}, 부족분: ${Math.abs(newFood)}) -> 기아 카드 추가`);
            newFood = 0;
            const crisisCard = instantiateCard("crisis_starvation");
            if (crisisCard) setDiscard(prev => [...prev, crisisCard]);
        } else {
            addLog(`턴 종료. 식량 ${totalUpkeep} 소모 (유닛/건물: ${fieldUpkeep}, 인구: ${popUpkeep}).`);
        }

        // 2. Trigger Passive Effects (Field)
        let produced = { food: 0, prod: 0, sci: 0, energy: 0 };
        field.forEach(card => {
            // Check for new 'passive' structure
            if (card.passive && card.passive.trigger === 'turn_start') {
                if (card.passive.type === 'resource_gain') {
                    const target = card.passive.target;
                    const val = card.passive.value;
                    produced[target] = (produced[target] || 0) + val;
                }
            }
            // Fallback for old structure (remove if fully migrated)
            else if (card.passive_effect && card.passive_effect.type === 'resource_start') {
                produced[card.passive_effect.target] = (produced[card.passive_effect.target] || 0) + card.passive_effect.value;
            }
        });

        // 3. Reset Resources
        // Energy: Reset to Base (3) + Produced
        // Prod: Reset to 0 (It's temporary) + Produced
        // Food/Sci: Keep + Produced
        const baseEnergy = 3 + (selectedRace?.bonus?.energy || 0);

        setResources(prev => ({
            food: newFood + produced.food,
            prod: 0 + produced.prod, // Production is reset!
            sci: prev.sci + produced.sci,
            energy: baseEnergy + (produced.energy || 0)
        }));

        if (produced.food > 0 || produced.prod > 0 || produced.sci > 0 || produced.energy > 0) {
            addLog(`건물 생산: 식량+${produced.food}, 생산+${produced.prod}, 과학+${produced.sci}`);
        }

        // 5. Discard Hand
        setDiscard(prev => [...prev, ...hand]);
        setHand([]);

        // 6. Draw New Hand
        // We need to pass current state or use functional updates carefully.
        // Since drawCards uses state, we might need to chain this effect or call it with updated values.
        // For simplicity, let's just call a wrapped version or rely on next render...
        // actually standard way is to do everything in one go or use a ref for deck/discard if synchronous.
        // Let's implement a synchronous draw here with the updated discard pile.

        let currentDeck = [...deck];
        let currentDiscard = [...discard, ...hand]; // Old hand added
        let drawn = [];

        for (let i = 0; i < 5; i++) {
            if (currentDeck.length === 0) {
                if (currentDiscard.length === 0) break;
                currentDeck = shuffle([...currentDiscard]);
                currentDiscard = [];
            }
            drawn.push(currentDeck.pop());
        }

        setDeck(currentDeck);
        setDiscard(currentDiscard);
        setHand(drawn);

        setTurn(prev => prev + 1);
    };

    const quitGame = () => {
        setGameState('selection');
        setDeck([]);
        setHand([]);
        setField([]);
        setDiscard([]);
    };

    // --- Dev Cheats ---
    useEffect(() => {
        (window as any).cheat = {
            gainResources: (amount = 100) => {
                setResources(prev => ({
                    energy: (prev.energy || 0) + amount,
                    food: prev.food + amount,
                    prod: prev.prod + amount,
                    sci: prev.sci + amount
                }));
                addLog(`[Cheat] 자원 +${amount}`);
            },
            nextTurn: () => {
                addLog("[Cheat] 턴 강제 종료");
                endTurn();
            },
            setAge: (ageIndex) => {
                if (ageIndex >= 0 && ageIndex < AGES.length) {
                    setCurrentAge(ageIndex);
                    addLog(`[Cheat] 시대 변경: ${AGES[ageIndex]?.name}`);
                } else {
                    console.warn("Invalid Age Index");
                }
            },
            win: () => {
                addLog("[Cheat] 승리!");
                setGameState('victory');
            },
            // Check state
            logState: () => {
                console.log({
                    gameState, resources, currentAge, turn, deck, hand, field, discard
                });
            }
        };
    }); // Update on every render to keep closures fresh

    return {
        gameState,
        selectedRace,
        resources,
        currentAge,
        turn,
        hand,
        field,
        logs,
        startGame,
        playCard,
        endTurn,
        quitGame
    };
};

