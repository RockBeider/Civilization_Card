// ============================================================
// GameIcons.tsx - Custom SVG Icons for Game Assets
// ============================================================

import React from 'react';

interface IconProps {
    size?: number;
    className?: string;
}

// --- Resource Icons ---

/**
 * 망치 - 생산력 아이콘
 */
export const ProductionIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <g fill="none" fillRule="evenodd">
            <path d="M9 37l24.5-24.5L58 37l-7 7-17-17-25 25z" fill="#8B4513" />
            <path d="M17.5 28.5L10 36l7 7 10-10z" fill="#A0522D" />
            <path d="M46.5 12.5L58 24l-7 7-11.5-11.5z" fill="#A52A2A" />
            <path d="M45 27l14-14" stroke="#696969" strokeWidth="2" />
            <path d="M34 16l14 14" stroke="#696969" strokeWidth="2" />
        </g>
        <rect fill="#A9A9A9" x="32" y="4" width="28" height="28" rx="2" />
        <rect fill="#808080" x="34" y="6" width="24" height="24" rx="1" />
        <rect fill="#C0C0C0" x="36" y="8" width="20" height="20" />
        <path fill="#F4A460" d="M4 42l20-20 16 16-20 20z" />
        <path fill="#D2691E" d="M8 46l12-12 16 16-12 12z" />
    </svg>
);

/**
 * 빵과 고기 - 식량 아이콘
 */
export const FoodIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <path d="M10 38c0-8.8 7.2-16 16-16s16 7.2 16 16H10z" fill="#DAA520" />
        <path d="M12 36c0-6.6 5.4-12 12-12s12 5.4 12 12H12z" fill="#F4A460" />
        <path d="M10 38h32v4H10z" fill="#CD853F" />
        <path
            d="M18 28a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM26 26a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM34 28a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"
            fill="#8B4513"
            opacity=".4"
        />
        <path
            d="M38 22c-3.3 0-6 2.7-6 6 0 2.2 1.2 4.1 3 5.2V44c0 3.3 2.7 6 6 6s6-2.7 6-6V33.2c1.8-1.1 3-3 3-5.2 0-3.3-2.7-6-6-6s-6 2.7-6 6h6c0-1.1-.9-2-2-2s-2 .9-2 2h-6z"
            fill="#DC143C"
        />
        <path d="M42 44c0 1.1-.9 2-2 2s-2-.9-2-2V34h4v10z" fill="#F08080" />
        <circle cx="44" cy="28" r="2" fill="#F08080" />
    </svg>
);

/**
 * 비커 - 과학 아이콘
 */
export const ScienceIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <path d="M22 4h20v4H22z" fill="#C0C0C0" />
        <path d="M24 8h16v16l-8 8-8-8z" fill="#E0E0E0" />
        <path d="M16 56l8-24h16l8 24H16z" fill="#ADD8E6" />
        <path d="M20 56l6-18h12l6 18H20z" fill="#87CEEB" />
        <path d="M18 56h28v4H18z" fill="#C0C0C0" />
        <path d="M26 36h12" stroke="#4682B4" strokeWidth="2" />
        <path d="M28 42h8" stroke="#4682B4" strokeWidth="2" />
        <path d="M30 48h4" stroke="#4682B4" strokeWidth="2" />
        <path d="M24 32l4 12h8l4-12H24z" fill="#1E90FF" />
        <circle cx="30" cy="36" r="2" fill="#FFFFFF" opacity=".6" />
        <circle cx="34" cy="40" r="3" fill="#FFFFFF" opacity=".6" />
    </svg>
);

// --- Card Type Icons ---

/**
 * 해골 방패 - 위기/Crisis 아이콘
 */
export const CrisisIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <path
            d="M32 4L6 16v20c0 14.3 11.7 27.3 26 32 14.3-4.7 26-17.7 26-32V16L32 4z"
            fill="#DC143C"
        />
        <path
            d="M32 8L10 18v18c0 11.9 9.8 22.8 22 26.9 12.2-4.1 22-15 22-26.9V18L32 8z"
            fill="#FF6347"
        />
        <path
            d="M32 20c-6.6 0-12 5.4-12 12 0 4.4 2.4 8.3 6 10.4V46h12v-3.6c3.6-2.1 6-6 6-10.4 0-6.6-5.4-12-12-12zm-4 12c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4z"
            fill="#FFFFFF"
        />
        <circle cx="26" cy="32" r="3" fill="#000000" />
        <circle cx="38" cy="32" r="3" fill="#000000" />
        <path d="M30 40h4v4h-4z" fill="#000000" />
    </svg>
);

/**
 * 밀 - 농장 아이콘
 */
export const WheatIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <g fill="#DAA520">
            <ellipse cx="32" cy="14" rx="4" ry="6" />
            <ellipse cx="32" cy="24" rx="4" ry="6" />
            <ellipse cx="32" cy="34" rx="4" ry="6" />
            <ellipse cx="24" cy="18" rx="4" ry="6" transform="rotate(-30 24 18)" />
            <ellipse cx="24" cy="28" rx="4" ry="6" transform="rotate(-30 24 28)" />
            <ellipse cx="40" cy="18" rx="4" ry="6" transform="rotate(30 40 18)" />
            <ellipse cx="40" cy="28" rx="4" ry="6" transform="rotate(30 40 28)" />
        </g>
        <path d="M32 40v20" stroke="#DAA520" strokeWidth="4" strokeLinecap="round" />
        <path
            d="M32 44c-8 4-12 12-12 12M32 44c8 4 12 12 12 12"
            stroke="#DAA520"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
        />
    </svg>
);

/**
 * 책 - 도서관 아이콘
 */
export const BookIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <path d="M12 10c0-2.2 1.8-4 4-4h36v48H16c-2.2 0-4-1.8-4-4V10z" fill="#8B4513" />
        <path d="M16 8c-1.1 0-2 .9-2 2v44c0 1.1.9 2 2 2h34V8H16z" fill="#A0522D" />
        <path
            d="M50 8v48H16c-2.2 0-4-1.8-4-4V10c0-2.2 1.8-4 4-4h34z"
            fill="none"
            stroke="#CD853F"
            strokeWidth="2"
        />
        <rect x="20" y="14" width="24" height="4" fill="#CD853F" />
        <rect x="20" y="22" width="24" height="4" fill="#CD853F" />
        <circle cx="32" cy="40" r="8" fill="#CD853F" />
        <path d="M28 38l4-4 4 4-4 4-4-4z" fill="#8B4513" />
        <path d="M14 10v44" stroke="#CD853F" strokeWidth="2" />
    </svg>
);

/**
 * 칼 - 기사/검사 아이콘
 */
export const SwordIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <path d="M32 4l-6 12v30h12V16L32 4z" fill="#C0C0C0" />
        <path d="M32 4v42" stroke="#A9A9A9" strokeWidth="2" />
        <path d="M20 46h24v4H20z" fill="#FFD700" />
        <path d="M28 50h8v10h-8z" fill="#8B4513" />
        <circle cx="32" cy="60" r="3" fill="#FFD700" />
    </svg>
);

/**
 * 활과 화살 - 궁수 아이콘
 */
export const BowIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <path
            d="M16 8c0 24 20 48 32 48"
            stroke="#8B4513"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
        />
        <path d="M16 8l32 48" stroke="#DEB887" strokeWidth="2" />
        <path d="M46 18L12 52" stroke="#CD853F" strokeWidth="3" strokeLinecap="round" />
        <path d="M12 52l-4-4 6-6 2 10z" fill="#C0C0C0" />
        <path d="M42 22l6 6M44 20l6 6M46 18l6 6" stroke="#A52A2A" strokeWidth="2" />
    </svg>
);

// --- Era Icons ---

/**
 * 돌도끼 - 원시 시대 아이콘
 */
export const StoneAxeIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <path d="M20 56L12 48l24-24 8 8z" fill="#8B4513" />
        <path d="M14 50l6 6" stroke="#654321" strokeWidth="2" strokeLinecap="round" />
        <path d="M32 28l4-4c2 2 4 0 6-2l4 4c-2 2-4 0-6 2z" fill="#D2B48C" />
        <path d="M36 32l4-4c2 2 4 0 6-2l4 4c-2 2-4 0-6 2z" fill="#D2B48C" />
        <path d="M54 10l-8 8-4 12-16-4-4-14 12-12 12 2z" fill="#708090" />
        <path d="M44 12l-8 8M50 18l-6 6" stroke="#405060" strokeWidth="2" />
        <path d="M54 10l8 8c-4 8-12 12-18 14l-6-6c4-4 10-8 16-16z" fill="#A9A9A9" />
    </svg>
);

/**
 * 석조 기둥 - 고대 시대 아이콘
 */
export const StoneColumnIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <rect x="8" y="54" width="48" height="6" fill="#CDB891" />
        <rect x="12" y="48" width="40" height="6" fill="#EACD9E" />
        <rect x="18" y="16" width="28" height="32" fill="#F5DEB3" />
        <path d="M22 16v32M27 16v32M32 16v32M37 16v32M42 16v32" stroke="#DEB887" strokeWidth="2" />
        <rect x="14" y="10" width="36" height="6" fill="#EACD9E" />
        <path d="M10 4h44l-4 6H14z" fill="#CDB891" />
        <circle cx="16" cy="13" r="3" fill="#CDB891" />
        <circle cx="48" cy="13" r="3" fill="#CDB891" />
    </svg>
);

/**
 * 성곽 타워 - 중세 시대 아이콘
 */
export const CastleTowerIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <rect x="16" y="24" width="32" height="36" fill="#808080" />
        <rect x="14" y="12" width="8" height="12" fill="#A9A9A9" />
        <rect x="28" y="12" width="8" height="12" fill="#A9A9A9" />
        <rect x="42" y="12" width="8" height="12" fill="#A9A9A9" />
        <rect x="14" y="20" width="36" height="4" fill="#A9A9A9" />
        <rect x="30" y="36" width="4" height="12" fill="#2F4F4F" />
        <path d="M32 4v8" stroke="#696969" strokeWidth="2" />
        <path d="M32 4l16 6-16 6V4z" fill="#DC143C" />
        <path d="M16 32h32M24 32v10M40 32v10M16 42h32" stroke="#696969" strokeWidth="1" opacity="0.5" />
    </svg>
);

/**
 * 나침반 - 르네상스 시대 아이콘
 */
export const CompassIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <circle cx="32" cy="32" r="28" fill="#DAA520" stroke="#B8860B" strokeWidth="2" />
        <circle cx="32" cy="32" r="22" fill="#F0E68C" stroke="#B8860B" strokeWidth="1" />
        <path d="M32 4l4 6h-8zM60 32l-6 4v-8zM32 60l-4-6h8zM4 32l6-4v8z" fill="#B8860B" />
        <path d="M32 12l6 20-6 20-6-20z" fill="#8B0000" />
        <path d="M32 12l6 20H26z" fill="#FF0000" />
        <circle cx="32" cy="32" r="4" fill="#B8860B" />
        <circle cx="32" cy="32" r="2" fill="#FFD700" />
    </svg>
);

/**
 * 톱니바퀴 - 산업 시대 아이콘
 */
export const GearIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <g fill="#778899" stroke="#2F4F4F" strokeWidth="2">
            <path d="M32 4l4 6 7 2 5-5 7 7-5 5 2 7 6 4v10l-6 4-2 7 5 5-7 7-5-5-7 2-4 6h-10l-4-6-7-2-5 5-7-7 5-5-2-7-6-4v-10l6-4 2-7-5-5 7-7 5 5 7-2 4-6z" />
        </g>
        <circle cx="32" cy="32" r="16" fill="#B0C4DE" stroke="#708090" strokeWidth="2" />
        <circle cx="32" cy="32" r="8" fill="#2F4F4F" />
        <path d="M32 16l2 4M48 32l-4 2M32 48l-2-4M16 32l4-2" stroke="#8B4513" strokeWidth="2" opacity="0.6" />
    </svg>
);

/**
 * 로켓과 네트워크 - 정보/우주 시대 아이콘
 */
export const RocketNetworkIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <path d="M4 48c14 8 42 8 56 0" stroke="#00FFFF" strokeWidth="2" fill="none" opacity="0.6" />
        <path d="M12 54c10 4 30 4 40 0" stroke="#00FFFF" strokeWidth="2" fill="none" opacity="0.4" />
        <path d="M32 40v20M20 44l4 16M44 44l-4 16" stroke="#00FFFF" strokeWidth="1" opacity="0.3" />
        <path d="M32 42l-4 14h8z" fill="#FFD700" opacity="0.8" />
        <path d="M32 44l-2 10h4z" fill="#FF4500" />
        <path d="M32 4l-8 16v16l4 4h8l4-4V20z" fill="#E0FFFF" />
        <path d="M32 4l-8 16h16z" fill="#87CEEB" />
        <path d="M24 32l-6 8v2l10-4z" fill="#4682B4" />
        <path d="M40 32l6 8v2l-10-4z" fill="#4682B4" />
        <circle cx="32" cy="24" r="4" fill="#00BFFF" stroke="#FFFFFF" strokeWidth="1" />
    </svg>
);

// --- Export all icons ---
export const GameIcons = {
    // Resources
    Production: ProductionIcon,
    Food: FoodIcon,
    Science: ScienceIcon,
    // Card Types
    Crisis: CrisisIcon,
    Wheat: WheatIcon,
    Book: BookIcon,
    Sword: SwordIcon,
    Bow: BowIcon,
    // Era Icons
    StoneAxe: StoneAxeIcon,
    StoneColumn: StoneColumnIcon,
    CastleTower: CastleTowerIcon,
    Compass: CompassIcon,
    Gear: GearIcon,
    RocketNetwork: RocketNetworkIcon,
};

export default GameIcons;
