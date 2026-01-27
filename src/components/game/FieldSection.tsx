// ============================================================
// FieldSection.tsx - Field Area Component (Building & Unit Zones)
// ============================================================

import type { Card } from '../../types';
import GameCard from '../ui/Card';

interface FieldSectionProps {
    structures: Card[];
    units: Card[];
    logs: string[];
}

const FieldSection: React.FC<FieldSectionProps> = ({ structures, units, logs }) => {
    return (
        <div className="field-section">
            <div className="field-content">
                {/* Building Zone */}
                <div className="zone-container">
                    <div className="zone-header">
                        <span className="zone-title">Building Zone</span>
                        <span className="zone-count">{structures.length}/5</span>
                    </div>
                    <div className="zone-content">
                        {structures.map((card) => (
                            <GameCard
                                key={card.instanceId}
                                card={card}
                                disabled={true}
                            />
                        ))}
                        {structures.length === 0 && (
                            <div className="zone-empty">No buildings</div>
                        )}
                    </div>
                </div>
                {/* Unit Zone */}
                <div className="zone-container">
                    <div className="zone-header">
                        <span className="zone-title">Unit Zone</span>
                        <span className="zone-count">{units.length}</span>
                    </div>
                    <div className="zone-content">
                        {units.map((card) => (
                            <GameCard
                                key={card.instanceId}
                                card={card}
                                disabled={true}
                            />
                        ))}
                        {units.length === 0 && (
                            <div className="zone-empty">No units</div>
                        )}
                    </div>
                </div>
            </div>
            {/* Log Panel - Next Turn Warning */}
            <div className="log-panel">
                <div className="log-header">💀 Next Turn:</div>
                <div className="log-content">
                    {logs.slice(-3).reverse().map((log, i) => (
                        <div key={i} className="log-entry">{log}</div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FieldSection;
