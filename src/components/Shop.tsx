import React, { useState } from 'react';
import { useGameStore } from '../store';
import GameCard from './ui/Card';
import './Shop.scss'; // We will create this next
import type { Card } from '../types';

interface ShopProps {
    // Props if needed
}

const Shop: React.FC<ShopProps> = () => {
    const { 
        shopCards, 
        resources, 
        buyCard, 
        refreshShop, 
        removeCard, 
        deck 
    } = useGameStore();

    const [isTrashModalOpen, setIsTrashModalOpen] = useState(false);

    const handleBuy = (card: Card) => {
        if (resources.production >= (card.cost.production || 0)) {
            buyCard(card);
        }
    };

    const handleRefresh = () => {
        if (resources.production >= 2) {
            refreshShop();
        }
    };
    
    const handleTrashOpen = () => {
        setIsTrashModalOpen(true);
    };

    const handleTrashCard = (card: Card) => {
        if (resources.production >= 3) {
            if (card.instanceId) {
                removeCard(card.instanceId);
                setIsTrashModalOpen(false);
            }
        }
    };

    return (
        <div className="shop-container primitive">
            <div className="shop-header">
                <h3>건설 & 징집소</h3>
                <div className="shop-actions">
                     <button 
                        className="btn-action btn-refresh" 
                        onClick={handleRefresh}
                        disabled={resources.production < 2}
                        title="생산력 2 소모"
                    >
                        🔄 갱신 (2🔨)
                    </button>
                    <button 
                        className="btn-action btn-trash" 
                        onClick={handleTrashOpen}
                        disabled={resources.production < 3}
                        title="생산력 3 소모 (덱 압축)"
                    >
                        🗑️ 폐기 (3🔨)
                    </button>
                </div>
            </div>
            
            <div className="shop-cards">
                {shopCards.map((card, index) => {
                    const cost = card.cost.production || 0;
                    const canAfford = resources.production >= cost;
                    
                    return (
                        <div key={card.instanceId || index} className="shop-card-wrapper">
                            <GameCard 
                                card={card} 
                                disabled={!canAfford} /* Visual disabled state */
                            />
                            <button 
                                className={`btn-buy ${canAfford ? '' : 'disabled'}`}
                                onClick={() => handleBuy(card)}
                                disabled={!canAfford}
                            >
                                구매 {cost}🔨
                            </button>
                        </div>
                    );
                })}
                {shopCards.length === 0 && (
                    <div className="shop-empty">
                        <p>품절 (Sold Out)</p>
                    </div>
                )}
                {/* Always fill up to 3 slots for visual consistency if needed, 
                    but logic says getShopCards returns 3. 
                    If buyCard removes one, we show empty space or just fewer cards? 
                    Design says "Sold Out" if empty. 
                    Let's stick to list.
                */}
            </div>

            {/* Trash Modal */}
            {isTrashModalOpen && (
                <div className="trash-modal-overlay">
                    <div className="trash-modal">
                        <div className="trash-header">
                            <h3>카드 폐기 (비용: 3🔨)</h3>
                            <button onClick={() => setIsTrashModalOpen(false)}>❌</button>
                        </div>
                        <div className="trash-content">
                            <p>제거할 카드를 선택하세요 (영구 제거)</p>
                            <div className="trash-card-list">
                                {/* Combine all cards for display? Or separates tabs? 
                                    For simplicity, list all. 
                                */}
                                {[...deck.hand, ...deck.drawPile, ...deck.discardPile].sort((a,b) => a.name.localeCompare(b.name)).map((card) => (
                                    <div key={card.instanceId} className="trash-card-item" onClick={() => handleTrashCard(card)}>
                                        <GameCard card={card} disabled={true} /> {/* Disabled style but clickable wrapper */}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Shop;
