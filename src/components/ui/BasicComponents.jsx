export function ResourceCard({ icon, label, value, rate }) {
    return (
        <div className="resource-card">
            <div className="resource-label">{icon} {label}</div>
            <div className="resource-value">{Math.floor(value).toLocaleString()}</div>
            {rate !== undefined && <div className="resource-rate">+{rate.toFixed(1)}/턴</div>}
        </div>
    );
}

export function ActionButton({ onClick, icon, label, desc, colorClass }) {
    return (
        <button onClick={onClick} className={`action-btn ${colorClass}`}>
            <div className="btn-icon">{icon}</div>
            <div className="btn-content">
                <div className="btn-label">{label}</div>
                <div className="btn-desc">{desc}</div>
            </div>
        </button>
    );
}

export function SectionTitle({ title }) {
    return <h2 className="section-title">{title}</h2>;
}
