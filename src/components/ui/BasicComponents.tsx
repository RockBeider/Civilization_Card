interface ResourceCardProps {
    icon: React.ReactNode;
    label: string;
    value: number;
    rate?: number;
}

export function ResourceCard({ icon, label, value, rate }: ResourceCardProps) {
    return (
        <div className="resource-card">
            <div className="resource-label">{icon} {label}</div>
            <div className="resource-value">{Math.floor(value).toLocaleString()}</div>
            {rate !== undefined && <div className="resource-rate">+{rate.toFixed(1)}/턴</div>}
        </div>
    );
}

interface ActionButtonProps {
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
    desc: string;
    colorClass: string;
}

export function ActionButton({ onClick, icon, label, desc, colorClass }: ActionButtonProps) {
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

interface SectionTitleProps {
    title: string;
}

export function SectionTitle({ title }: SectionTitleProps) {
    return <h2 className="section-title">{title}</h2>;
}
