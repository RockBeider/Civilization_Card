import { useState, useCallback, useEffect } from 'react';
import { CARDS, CARD_POOLS } from '../data/cards'; // Updated import path
import { RACES, AGES } from '../data/constants';

// Helper to shuffle array
const shuffle = (array) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
};

// Helper to instantiate a card (give it unique ID)
const instantiateCard = (cardId) => {
    const cardData = CARDS.find(c => c.id === cardId);
    if (!cardData) return null;
    return {
        ...cardData,
        uniqueId: Math.random().toString(36).substr(2, 9)
    };
};

export const useGameLoop = () => {
    // Game State
    const [gameState, setGameState] = useState('selection'); // selection, playing, victory, gameover
    const [selectedRace, setSelectedRace] = useState(null);
    const [resources, setResources] = useState({ food: 0, prod: 0, sci: 0 });
    const [currentAge, setCurrentAge] = useState(0);
    const [turn, setTurn] = useState(1);

    // Card State
    const [deck, setDeck] = useState([]);
    const [hand, setHand] = useState([]);
    const [discard, setDiscard] = useState([]);
    const [field, setField] = useState([]); // Structures in play

    // Messages
    const [logs, setLogs] = useState([]);
    const addLog = (msg) => setLogs(prev => [msg, ...prev].slice(0, 20));

    // --- Actions ---

    const startGame = (raceId) => {
        const race = RACES.find(r => r.id === raceId);
        setSelectedRace(race);

        // Init Resources using race bonus (optional starting logic)
        setResources({ food: 5, prod: 3, sci: 0 });

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

    const drawCards = (currentDeck, currentDiscard, count) => {
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

    const playCard = (card) => {
        // Cost Check
        if (card.cost.production > resources.prod) return addLog("생산력이 부족합니다.");
        if (card.cost.food > resources.food) return addLog("식량이 부족합니다.");
        if (card.cost.science > resources.sci) return addLog("과학이 부족합니다.");

        // Pay Cost
        setResources(prev => ({
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
        } else if (card.type === 'Structure') {
            // Move to Field
            if (field.length >= 5) return addLog("건설 공간이 부족합니다!");
            setField(prev => [...prev, card]);
            addLog(`${card.name} 건설 완료.`);
        }

        // Remove from Hand
        setHand(prev => prev.filter(c => c.uniqueId !== card.uniqueId));
    };

    const endTurn = () => {
        // 1. Production Reset (to 3 or 5)
        // 2. Upkeep (Food cost check)
        const population = deck.length + hand.length + discard.length + field.length; // Simplified pop metric
        // Or maybe just Deck Size? Let's use Deck + Hand + Discard as "Population" (Cards in cycle)
        const totalCards = deck.length + hand.length + discard.length;
        const foodCost = Math.floor(totalCards / 2); // Simple upkeep rule

        let newFood = resources.food - foodCost;
        if (newFood < 0) {
            addLog(`식량 부족! (필요: ${foodCost}) - HP 감소(미구현)`);
            newFood = 0;
            // TODO: Apply penalty (Crisis card?)
        } else {
            addLog(`턴 종료. 식량 ${foodCost} 소모.`);
        }

        // 3. Trigger Structure Effects
        let produced = { food: 0, prod: 0, sci: 0 };
        field.forEach(structure => {
            if (structure.passive_effect && structure.passive_effect.type === 'resource_start') {
                produced[structure.passive_effect.target] += structure.passive_effect.value;
            }
        });

        // 4. Reset Production (Base + Structure Output)
        const baseProd = 3 + produced.prod;

        setResources(prev => ({
            food: newFood + produced.food,
            prod: baseProd,
            sci: prev.sci + produced.sci
        }));

        if (produced.food > 0 || produced.prod > 0 || produced.sci > 0) {
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

