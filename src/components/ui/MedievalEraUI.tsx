// ============================================================
// MedievalEraUI.tsx - Medieval Age UI Elements (Stone/Wood/Parchment Theme)
// ============================================================

import React from 'react';

interface ComponentProps {
    width?: number;
    height?: number;
    className?: string;
}

// ========================================
// 1. Castle Wall Background
// ========================================

/**
 * 성벽 배경 - Castle Wall Background
 * 견고한 석조 성벽과 banner가 걸린 중세 성 내부
 */
export const CastleWallBackground: React.FC<ComponentProps> = ({
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
            <pattern id="stoneBricks" patternUnits="userSpaceOnUse" width="100" height="50">
                <rect width="100" height="50" fill="#696969" />
                <path d="M0 0h100v25h-50v25h-50v-25z" stroke="#505050" strokeWidth="2" fill="none" />
                <path d="M50 25v25" stroke="#505050" strokeWidth="2" />
            </pattern>
            <linearGradient id="castleLight" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#2F4F4F', stopOpacity: 0.3 }} />
                <stop offset="100%" style={{ stopColor: '#1a1a2e', stopOpacity: 0.7 }} />
            </linearGradient>
        </defs>
        <rect x="0" y="0" width="800" height="600" fill="url(#stoneBricks)" />
        <rect x="0" y="0" width="800" height="600" fill="url(#castleLight)" />
        {/* Banner decorations */}
        <path d="M100 0v80l-20-20-20 20V0z" fill="#8B0000" opacity="0.6" />
        <path d="M700 0v80l20-20 20 20V0z" fill="#8B0000" opacity="0.6" />
    </svg>
);

// ========================================
// 2. Carved Stone & Banner HUD Bar
// ========================================

/**
 * 조각된 돌과 배너 HUD 바 - Stone & Banner HUD
 * 견고한 석조 프레임과 왕가의 배너
 */
export const MedievalHudBar: React.FC<ComponentProps> = ({
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
            <linearGradient id="stoneBarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#808080', stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: '#696969', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#505050', stopOpacity: 1 }} />
            </linearGradient>
        </defs>

        {/* Main stone bar */}
        <rect x="0" y="10" width="800" height="60" fill="url(#stoneBarGrad)" stroke="#3e3e3e" strokeWidth="3" />

        {/* Decorative edges */}
        <rect x="0" y="5" width="800" height="8" fill="#505050" />
        <rect x="0" y="67" width="800" height="8" fill="#505050" />

        {/* Shield emblem center */}
        <g transform="translate(400, 40)">
            <path d="M0-25l20 10v20l-20 15-20-15v-20z" fill="#8B0000" stroke="#FFD700" strokeWidth="2" />
            <path d="M0-15l10 5v10l-10 8-10-8v-10z" fill="#DC143C" />
        </g>

        {/* Corner rivets */}
        <circle cx="30" cy="40" r="6" fill="#A9A9A9" stroke="#505050" strokeWidth="2" />
        <circle cx="770" cy="40" r="6" fill="#A9A9A9" stroke="#505050" strokeWidth="2" />
    </svg>
);

// ========================================
// 3. Wooden Frame Zone
// ========================================

/**
 * 나무 프레임 구역 - Wooden Frame Zone
 * 양피지 배경에 나무 테두리와 철 장식
 */
export const MedievalZoneFrame: React.FC<ComponentProps> = ({
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
            <linearGradient id="parchmentBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#f8e8c4', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#dabba3', stopOpacity: 1 }} />
            </linearGradient>
        </defs>

        {/* Parchment background */}
        <rect x="15" y="15" width="370" height="90" fill="url(#parchmentBg)" />

        {/* Wooden frame */}
        <rect x="5" y="5" width="390" height="110" rx="5" fill="none" stroke="#654321" strokeWidth="10" />
        <rect x="10" y="10" width="380" height="100" rx="3" fill="none" stroke="#8b4513" strokeWidth="2" />

        {/* Corner iron fittings */}
        <g fill="#696969" stroke="#3e3e3e" strokeWidth="1">
            <path d="M5 5l20 0l0 5l-15 0l0 15l-5 0z" />
            <path d="M395 5l-20 0l0 5l15 0l0 15l5 0z" />
            <path d="M5 115l20 0l0-5l-15 0l0-15l-5 0z" />
            <path d="M395 115l-20 0l0-5l15 0l0-15l5 0z" />
        </g>
    </svg>
);

// ========================================
// 4. Parchment Card Back
// ========================================

/**
 * 양피지 카드 뒷면 - Parchment Card Back
 * 낡은 종이 위에 나무 테두리를 댄 느낌
 */
export const MedievalCardBack: React.FC<ComponentProps> = ({
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
        <defs>
            <linearGradient id="cardParchment" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#f8e8c4', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#dabba3', stopOpacity: 1 }} />
            </linearGradient>
            <pattern id="cardBackPattern" patternUnits="userSpaceOnUse" width="20" height="20">
                <path d="M0 0L20 20M20 0L0 20" stroke="#654321" strokeWidth="1" opacity="0.2" />
                <rect width="20" height="20" fill="#8b4513" opacity="0.8" />
            </pattern>
        </defs>

        {/* Stacked cards effect */}
        <rect x="8" y="2" width="90" height="130" rx="5" fill="#5a3a20" stroke="#3e2714" />
        <rect x="4" y="6" width="90" height="130" rx="5" fill="#6b4423" stroke="#4a2f18" />

        {/* Main card */}
        <rect x="0" y="10" width="90" height="130" rx="5" fill="url(#cardBackPattern)" stroke="#654321" strokeWidth="2" />

        {/* Central emblem */}
        <circle cx="45" cy="75" r="20" fill="#dabba3" stroke="#654321" strokeWidth="2" />
        <path d="M45 60l10 15-10 15-10-15z" fill="#654321" />
    </svg>
);

// ========================================
// 5. Golden Metal End Turn Button
// ========================================

/**
 * 금속 턴 종료 버튼 - Metal End Turn Button
 * 금속 질감의 눈에 띄는 버튼
 */
export const MedievalEndTurnButton: React.FC<ComponentProps & { text?: string }> = ({
    width = 120,
    height = 48,
    className = '',
    text = '턴 종료'
}) => (
    <svg
        width={width}
        height={height}
        viewBox="0 0 120 48"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ cursor: 'pointer' }}
    >
        <defs>
            <linearGradient id="btnGoldMed" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#ffd700', stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: '#daa520', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#b8860b', stopOpacity: 1 }} />
            </linearGradient>
            <filter id="bevelMed">
                <feGaussianBlur in="SourceAlpha" stdDeviation="1" result="blur" />
                <feOffset in="blur" dx="0" dy="2" result="offsetBlur" />
                <feSpecularLighting in="blur" surfaceScale={5} specularConstant={1} specularExponent={20} lightingColor="#ffffff" result="specOut">
                    <fePointLight x={-5000} y={-10000} z={20000} />
                </feSpecularLighting>
                <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut" />
                <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1={0} k2={1} k3={1} k4={0} result="litPaint" />
                <feMerge>
                    <feMergeNode in="offsetBlur" />
                    <feMergeNode in="litPaint" />
                </feMerge>
            </filter>
        </defs>

        {/* Button body */}
        <rect x="2" y="2" width="116" height="44" rx="8" ry="8" fill="url(#btnGoldMed)" stroke="#8b4513" strokeWidth="2" filter="url(#bevelMed)" />

        {/* Decorative cross */}
        <path d="M40 24h40M60 14v20" stroke="#3e2714" strokeWidth="2" opacity="0.3" />

        {/* Inner highlight */}
        <rect x="6" y="6" width="108" height="36" rx="6" ry="6" fill="none" stroke="#fff" strokeWidth="1" opacity="0.5" />

        {/* Text */}
        <text
            x="60"
            y="28"
            fontFamily="serif"
            fontSize="14"
            fontWeight="bold"
            fill="#3e2714"
            textAnchor="middle"
            dominantBaseline="middle"
        >
            {text}
        </text>
    </svg>
);

// ========================================
// Additional UI Elements
// ========================================

/**
 * 경고 툴팁 박스 - Warning Tooltip Box
 * 위기 상황을 알릴 때 나타나는 말풍선 상자
 */
export const MedievalWarningTooltip: React.FC<ComponentProps> = ({
    width = 160,
    height = 80,
    className = ''
}) => (
    <svg
        width={width}
        height={height}
        viewBox="0 0 160 80"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <defs>
            <filter id="dropShadowMed" x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
                <feOffset dx="1" dy="2" result="offsetblur" />
                <feComponentTransfer>
                    <feFuncA type="linear" slope="0.5" />
                </feComponentTransfer>
                <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>
        <g filter="url(#dropShadowMed)">
            <path
                d="M4 4h152c2.2 0 4 1.8 4 4v56c0 2.2-1.8 4-4 4H84l-8 10-8-10H4c-2.2 0-4-1.8-4-4V8c0-2.2 1.8-4 4-4z"
                fill="#f8f0e0"
                stroke="#8b0000"
                strokeWidth="2"
            />
            <path d="M2 2h156v20H2z" fill="#8b0000" opacity="0.1" />
            <circle cx="16" cy="12" r="6" fill="#8b0000" />
            <path d="M16 8v5M16 15v2" stroke="#fff" strokeWidth="2" />
        </g>
    </svg>
);

/**
 * 버림 더미 아이콘 - Discard Pile Icon
 */
export const MedievalDiscardPileIcon: React.FC<ComponentProps & { size?: number }> = ({
    size = 64,
    className = ''
}) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <path d="M8 48L16 16h32l8 32H8z" fill="#4a3b2a" stroke="#2c1e12" strokeWidth="2" />
        <ellipse cx="32" cy="24" rx="16" ry="8" fill="#1a120b" />
        <path
            d="M32 24c-4 2-8 0-8-4s4-8 8-8 8 4 8 8-2 6-6 6"
            stroke="#dabba3"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            opacity="0.7"
        />
        <path
            d="M32 4v16m-6-6l6 6 6-6"
            stroke="#f0e68c"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

// ========================================
// Export all Medieval Era UI Components
// ========================================
export const MedievalEraUI = {
    CastleWallBackground,
    MedievalHudBar,
    MedievalZoneFrame,
    MedievalCardBack,
    MedievalEndTurnButton,
    MedievalWarningTooltip,
    MedievalDiscardPileIcon,
};

export default MedievalEraUI;
