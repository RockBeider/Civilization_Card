// ============================================================
// UIComponents.tsx - UI Element SVG Components (Medieval Theme)
// ============================================================

import React from 'react';

interface ComponentProps {
    width?: number;
    height?: number;
    className?: string;
}

// ========================================
// Card Related Elements
// ========================================

/**
 * 카드 테두리 프레임 - Card Frame
 * 낡은 종이/양피지 위에 나무 테두리를 댄 느낌
 */
export const CardFrame: React.FC<ComponentProps> = ({
    width = 150,
    height = 200,
    className = ''
}) => (
    <svg
        width={width}
        height={height}
        viewBox="0 0 150 200"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <defs>
            <linearGradient id="parchment" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#f8e8c4', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#dabba3', stopOpacity: 1 }} />
            </linearGradient>
            <filter id="wood-texture">
                <feTurbulence type="fractalNoise" baseFrequency="0.1 0.01" numOctaves={2} result="noise" />
                <feDiffuseLighting in="noise" lightingColor="#8b5a2b" surfaceScale={2}>
                    <feDistantLight azimuth={45} elevation={60} />
                </feDiffuseLighting>
                <feComposite operator="in" in2="SourceGraphic" />
            </filter>
        </defs>
        <rect x="5" y="5" width="140" height="190" rx="8" ry="8" fill="url(#parchment)" stroke="#8b4513" strokeWidth="1" />
        <rect x="0" y="0" width="150" height="200" rx="10" ry="10" fill="none" stroke="#654321" strokeWidth="6" filter="url(#wood-texture)" />
        <rect x="8" y="8" width="134" height="184" rx="6" ry="6" fill="none" stroke="#8b4513" strokeWidth="1" strokeDasharray="4 2" />
        <circle cx="25" cy="25" r="15" fill="#8b4513" stroke="#dabba3" strokeWidth="2" />
    </svg>
);

/**
 * 카드 덱 뭉치 - Draw Pile / Card Back
 * 뒤집힌 카드가 쌓여 있는 모습
 */
export const DrawPile: React.FC<ComponentProps> = ({
    width = 100,
    height = 120,
    className = ''
}) => (
    <svg
        width={width}
        height={height}
        viewBox="0 0 100 120"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <defs>
            <pattern id="cardBackPattern" patternUnits="userSpaceOnUse" width="20" height="20">
                <path d="M0 0L20 20M20 0L0 20" stroke="#654321" strokeWidth="1" opacity="0.2" />
                <rect width="20" height="20" fill="#8b4513" opacity="0.8" />
            </pattern>
        </defs>
        <rect x="5" y="0" width="90" height="115" rx="5" fill="#5a3a20" stroke="#3e2714" />
        <rect x="2" y="2" width="90" height="115" rx="5" fill="#6b4423" stroke="#4a2f18" />
        <rect x="0" y="5" width="90" height="115" rx="5" fill="url(#cardBackPattern)" stroke="#654321" strokeWidth="2" />
        <circle cx="45" cy="62.5" r="20" fill="#dabba3" stroke="#654321" strokeWidth="2" />
        <path d="M45 47.5l10 15-10 15-10-15z" fill="#654321" />
    </svg>
);

/**
 * 무덤 아이콘 - Discard Pile Icon
 * 사용한 카드가 들어가는 곳 (소용돌이/열린 상자)
 */
export const DiscardPileIcon: React.FC<ComponentProps & { size?: number }> = ({
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
// Buttons & UI Elements
// ========================================

/**
 * 턴 종료 버튼 - End Turn Button
 * 금속 질감의 눈에 띄는 버튼
 */
export const EndTurnButtonSVG: React.FC<ComponentProps> = ({
    width = 120,
    height = 48,
    className = ''
}) => (
    <svg
        width={width}
        height={height}
        viewBox="0 0 120 48"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <defs>
            <linearGradient id="btnGold" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#ffd700', stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: '#daa520', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#b8860b', stopOpacity: 1 }} />
            </linearGradient>
            <filter id="bevel">
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
        <rect x="2" y="2" width="116" height="44" rx="8" ry="8" fill="url(#btnGold)" stroke="#8b4513" strokeWidth="2" filter="url(#bevel)" />
        <path d="M40 24h40M60 14v20" stroke="#3e2714" strokeWidth="2" opacity="0.3" />
        <rect x="6" y="6" width="108" height="36" rx="6" ry="6" fill="none" stroke="#fff" strokeWidth="1" opacity="0.5" />
    </svg>
);

/**
 * 경고 툴팁 박스 - Warning Tooltip Box
 * 위기 상황을 알릴 때 나타나는 말풍선 상자
 */
export const WarningTooltip: React.FC<ComponentProps> = ({
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
            <filter id="dropShadow" x="-10%" y="-10%" width="120%" height="120%">
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
        <g filter="url(#dropShadow)">
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

// ========================================
// Export all UI Components
// ========================================
export const UIComponents = {
    CardFrame,
    DrawPile,
    DiscardPileIcon,
    EndTurnButtonSVG,
    WarningTooltip,
};

export default UIComponents;
