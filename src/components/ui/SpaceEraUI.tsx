// ============================================================
// SpaceEraUI.tsx - Space/Information Age UI Elements (Digital/Hologram Theme)
// ============================================================

import React from 'react';

interface ComponentProps {
    width?: number;
    height?: number;
    className?: string;
}

// ========================================
// 1. Digital Space Grid Background
// ========================================

/**
 * 디지털 우주 그리드 배경 - Digital Space Background
 * 푸른 지구와 은하수 배경 + 빛나는 디지털 그리드
 */
export const SpaceBackground: React.FC<ComponentProps> = ({
    width = 800,
    height = 600,
    className = ''
}) => (
    <svg
        width={width}
        height={height}
        viewBox="0 0 800 600"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }}
    >
        <defs>
            <radialGradient id="spaceBg" cx="50%" cy="80%" r="100%">
                <stop offset="0%" style={{ stopColor: '#000033', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#000000', stopOpacity: 1 }} />
            </radialGradient>
            <pattern id="stars" patternUnits="userSpaceOnUse" width="100" height="100">
                <circle cx="10" cy="10" r="1" fill="#FFFFFF" opacity="0.8" />
                <circle cx="30" cy="50" r="0.5" fill="#FFFFFF" opacity="0.6" />
                <circle cx="70" cy="30" r="1.5" fill="#FFFFFF" opacity="0.9" />
                <circle cx="90" cy="80" r="0.8" fill="#FFFFFF" opacity="0.7" />
            </pattern>
        </defs>
        {/* Space gradient */}
        <rect x="0" y="0" width="800" height="600" fill="url(#spaceBg)" />
        {/* Stars */}
        <rect x="0" y="0" width="800" height="600" fill="url(#stars)" />

        {/* Earth curve */}
        <path d="M-100 600 Q 400 400, 900 600" fill="#0066CC" opacity="0.3" />
        <path d="M-100 620 Q 400 420, 900 620" fill="#0099FF" opacity="0.2" />

        {/* Digital grid */}
        <g stroke="#00FFFF" strokeWidth="1" opacity="0.4">
            <line x1="0" y1="400" x2="800" y2="400" />
            <line x1="0" y1="450" x2="800" y2="450" />
            <line x1="0" y1="500" x2="800" y2="500" />
            <line x1="0" y1="550" x2="800" y2="550" />
            <line x1="400" y1="400" x2="0" y2="600" />
            <line x1="400" y1="400" x2="800" y2="600" />
        </g>
    </svg>
);

// ========================================
// 2. Hologram Data Stream HUD Bar
// ========================================

/**
 * 홀로그램 데이터 스트림 HUD 바 - Hologram HUD
 * 빛나는 데이터와 홀로그램으로 이루어진 정보 표시줄
 */
export const SpaceHudBar: React.FC<ComponentProps> = ({
    width = 800,
    height = 80,
    className = ''
}) => (
    <svg
        width={width}
        height={height}
        viewBox="0 0 800 80"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <defs>
            <linearGradient id="hologramGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#00FFFF', stopOpacity: 0 }} />
                <stop offset="20%" style={{ stopColor: '#00FFFF', stopOpacity: 0.5 }} />
                <stop offset="80%" style={{ stopColor: '#00FFFF', stopOpacity: 0.5 }} />
                <stop offset="100%" style={{ stopColor: '#00FFFF', stopOpacity: 0 }} />
            </linearGradient>
            <filter id="glowHud">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>

        {/* Main hologram panel */}
        <rect x="50" y="10" width="700" height="60" fill="url(#hologramGrad)" opacity="0.2" filter="url(#glowHud)" />
        <path d="M50 10h700v60h-700z" stroke="#00FFFF" strokeWidth="2" fill="none" opacity="0.6" />

        {/* Data lines */}
        <path d="M60 20h100 M180 20h50 M60 60h80 M160 60h100" stroke="#00FFFF" strokeWidth="1" opacity="0.8" />
        <circle cx="170" cy="20" r="3" fill="#00FFFF" />
        <circle cx="150" cy="60" r="3" fill="#00FFFF" />

        {/* Crosshair icon */}
        <g transform="translate(720, 25)" stroke="#00FFFF" strokeWidth="2" fill="none">
            <circle cx="15" cy="15" r="10" opacity="0.5" />
            <path d="M5 15h20 M15 5v20" />
            <circle cx="15" cy="15" r="3" fill="#00FFFF" />
        </g>
    </svg>
);

// ========================================
// 3. Digital Projection Zone Frame
// ========================================

/**
 * 디지털 프로젝션 구역 프레임 - Digital Zone Frame
 * 홀로그램처럼 빛나는 디지털 경계선
 */
export const SpaceZoneFrame: React.FC<ComponentProps> = ({
    width = 400,
    height = 120,
    className = ''
}) => (
    <svg
        width={width}
        height={height}
        viewBox="0 0 400 120"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <defs>
            <filter id="glowFrame">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>

        <g filter="url(#glowFrame)">
            {/* Main frame */}
            <path
                d="M20 10h360c5 0 10 5 10 10v80c0 5-5 10-10 10h-360c-5 0-10-5-10-10v-80c0-5 5-10 10-10z"
                fill="none"
                stroke="#00BFFF"
                strokeWidth="3"
            />
            {/* Corner highlights */}
            <path d="M10 30v-20h20 M370 10h20v20 M390 90v20h-20 M30 110h-20v-20" stroke="#00FFFF" strokeWidth="4" />
        </g>

        {/* Grid lines */}
        <path d="M20 30h360 M20 60h360 M20 90h360" stroke="#00BFFF" strokeWidth="1" opacity="0.3" />
        <path d="M100 10v100 M200 10v100 M300 10v100" stroke="#00BFFF" strokeWidth="1" opacity="0.3" />
    </svg>
);

// ========================================
// 4. Circuit Board Card Back
// ========================================

/**
 * 회로 기판 카드 뒷면 - Circuit Board Card Back
 * 복잡한 전자 회로 기판(PCB) 디자인
 */
export const SpaceCardBack: React.FC<ComponentProps> = ({
    width = 100,
    height = 140,
    className = ''
}) => (
    <svg
        width={width}
        height={height}
        viewBox="0 0 100 140"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        {/* PCB base */}
        <rect x="5" y="5" width="90" height="130" rx="5" ry="5" fill="#003300" stroke="#00FF00" strokeWidth="2" />

        {/* Circuit traces */}
        <g stroke="#32CD32" strokeWidth="2" fill="none" opacity="0.8">
            <path d="M20 10v20l10 10h20l10-10v-20" />
            <path d="M10 50h20l10 10v20l-10 10h-20" />
            <path d="M90 40h-20l-10 10v30l10 10h20" />
            <path d="M40 130v-20l10-10h20" />
        </g>

        {/* Solder points */}
        <g fill="#00FF00">
            <circle cx="20" cy="30" r="3" />
            <circle cx="50" cy="40" r="3" />
            <circle cx="80" cy="80" r="3" />
            <circle cx="30" cy="90" r="3" />
        </g>

        {/* Central chip */}
        <rect x="35" y="55" width="30" height="30" fill="#000000" stroke="#00FF00" strokeWidth="2" />
        <rect x="40" y="60" width="20" height="20" fill="#32CD32" opacity="0.5" />
    </svg>
);

// ========================================
// 5. Touch Panel End Turn Button
// ========================================

/**
 * 터치 패널 턴 종료 버튼 - Touch Panel Button
 * 터치하면 빛이 활성화되는 반투명 디지털 패널
 */
export const SpaceEndTurnButton: React.FC<ComponentProps & { text?: string }> = ({
    width = 150,
    height = 60,
    className = '',
    text = '턴 종료'
}) => (
    <svg
        width={width}
        height={height}
        viewBox="0 0 150 60"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ cursor: 'pointer' }}
    >
        <defs>
            <linearGradient id="touchPanelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#00BFFF', stopOpacity: 0.6 }} />
                <stop offset="100%" style={{ stopColor: '#1E90FF', stopOpacity: 0.8 }} />
            </linearGradient>
            <filter id="neonGlow">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>

        <g filter="url(#neonGlow)">
            {/* Panel */}
            <rect x="5" y="5" width="140" height="50" rx="10" ry="10" fill="url(#touchPanelGrad)" stroke="#00FFFF" strokeWidth="3" />

            {/* Scan lines */}
            <path d="M10 15h130 M10 30h130 M10 45h130" stroke="#00FFFF" strokeWidth="1" opacity="0.3" />

            {/* Text */}
            <text
                x="75"
                y="35"
                fontFamily="sans-serif"
                fontSize="18"
                fontWeight="bold"
                fill="#FFFFFF"
                textAnchor="middle"
                dominantBaseline="middle"
                stroke="#00FFFF"
                strokeWidth="1"
                opacity="0.9"
            >
                {text}
            </text>
        </g>
    </svg>
);

// ========================================
// Export all Space Era UI Components
// ========================================
export const SpaceEraUI = {
    SpaceBackground,
    SpaceHudBar,
    SpaceZoneFrame,
    SpaceCardBack,
    SpaceEndTurnButton,
};

export default SpaceEraUI;
