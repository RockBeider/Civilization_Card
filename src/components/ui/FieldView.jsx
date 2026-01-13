import React from 'react';
import Card from './Card';

const FieldView = ({ field }) => {
    return (
        <div className="field-container">
            <h3 className="section-title">건설된 건물 ({field.length}/5)</h3>
            <div className="field-grid">
                {field.map((cardInstance) => (
                    <div key={cardInstance.uniqueId} className="field-card-wrapper">
                        {/* Reusing Card component but maybe smaller or non-clickable */}
                        <Card card={cardInstance} disabled={true} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FieldView;
