// ============================================================
// FieldView.tsx - Field Display Component (Zustand Version)
// ============================================================

import React from 'react';
import Card from './Card';
import type { Card as CardType } from '../../types';

interface FieldViewProps {
    field: CardType[];
}

const FieldView: React.FC<FieldViewProps> = ({ field }) => {
    const structures = field.filter(c => c.type === 'structure');
    const units = field.filter(c => c.type === 'unit');

    return (
        <div className="field-container">
            {/* Structures Section */}
            <div className="field-section">
                <h3 className="section-title">🏗️ 건물 ({structures.length}/5)</h3>
                <div className="field-grid">
                    {structures.map((cardInstance) => (
                        <div key={cardInstance.instanceId} className="field-card-wrapper">
                            <Card card={cardInstance} disabled={true} />
                        </div>
                    ))}
                    {structures.length === 0 && (
                        <div className="field-empty">건물 없음</div>
                    )}
                </div>
            </div>

            {/* Units Section */}
            <div className="field-section">
                <h3 className="section-title">⚔️ 유닛 ({units.length})</h3>
                <div className="field-grid">
                    {units.map((cardInstance) => (
                        <div key={cardInstance.instanceId} className="field-card-wrapper">
                            <Card card={cardInstance} disabled={true} />
                        </div>
                    ))}
                    {units.length === 0 && (
                        <div className="field-empty">유닛 없음</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FieldView;
