// ============================================================
// RenaissanceEraUI.tsx - Renaissance Age UI Elements (Brass/Velvet/Parchment Theme)
// ============================================================

import React from 'react';

interface ComponentProps {
    width?: number;
    height?: number;
    className?: string;
}

// ========================================
// 1. Exploration Map Background
// ========================================

/**
 * 대항해시대 지도 배경 - Exploration Map Background
 * 양피지 지도 + 나침반 방위표 + 항해선
 */
export const ExplorationMapBackground: React.FC<ComponentProps> = ({
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
            <filter id="oldPaper" x="0%" y="0%" width="100%" height="100%">
                <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves={5} result="noise" />
                <feDiffuseLighting in="noise" lightingColor="#f4e4bc" surfaceScale={2}>
                    <feDistantLight azimuth={45} elevation={60} />
                </feDiffuseLighting>
                <feComposite operator="in" in2="SourceGraphic" />
            </filter>
            <linearGradient id="paperColor" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#f8e8c4', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#dabba3', stopOpacity: 1 }} />
            </linearGradient>
        </defs>
        <rect x="0" y="0" width="800" height="600" fill="url(#paperColor)" filter="url(#oldPaper)" />

        {/* Map lines and compass rose */}
        <g stroke="#8b4513" strokeWidth="1" fill="none" opacity="0.2">
            <path d="M0 100 Q 400 50, 800 100 M0 300 Q 400 250, 800 300 M0 500 Q 400 450, 800 500" />
            <path d="M100 0 Q 150 300, 100 600 M400 0 Q 450 300, 400 600 M700 0 Q 750 300, 700 600" />
            <g transform="translate(650, 450) scale(2)">
                <circle cx="0" cy="0" r="30" />
                <path d="M0 -30 L 5 -5 L 30 0 L 5 5 L 0 30 L -5 5 L -30 0 L -5 -5 Z" fill="#8b4513" />
            </g>
        </g>
    </svg>
);

// ========================================
// 2. Brass & Mahogany HUD Bar
// ========================================

/**
 * 황동과 마호가니 HUD 바 - Brass & Mahogany HUD
 * 정교하게 세공된 황동 테두리와 마호가니 목재
 */
export const RenaissanceHudBar: React.FC<ComponentProps> = ({
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
            <linearGradient id="mahoganyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#663300', stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: '#804000', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#663300', stopOpacity: 1 }} />
            </linearGradient>
            <linearGradient id="brassGradHud" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#B8860B', stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: '#FFD700', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#B8860B', stopOpacity: 1 }} />
            </linearGradient>
        </defs>

        {/* Mahogany base */}
        <rect x="10" y="10" width="780" height="60" rx="5" fill="url(#mahoganyGrad)" />

        {/* Brass frame */}
        <g fill="none" stroke="url(#brassGradHud)" strokeWidth="4">
            <rect x="10" y="10" width="780" height="60" rx="5" />
            <path d="M10 30 C 10 10, 30 10, 30 10 M 770 10 C 790 10, 790 30, 790 30 M 790 50 C 790 70, 770 70, 770 70 M 30 70 C 10 70, 10 50, 10 50" />
        </g>

        {/* Corner rivets */}
        <circle cx="20" cy="20" r="3" fill="url(#brassGradHud)" />
        <circle cx="780" cy="20" r="3" fill="url(#brassGradHud)" />
        <circle cx="20" cy="60" r="3" fill="url(#brassGradHud)" />
        <circle cx="780" cy="60" r="3" fill="url(#brassGradHud)" />
    </svg>
);

// ========================================
// 3. Velvet & Gold Frame Zone
// ========================================

/**
 * 벨벳과 액자 구역 프레임 - Velvet Frame Zone
 * 붉은 벨벳 배경 + 황금색 액자 프레임
 */
export const RenaissanceZoneFrame: React.FC<ComponentProps> = ({
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
            <radialGradient id="velvetGrad" cx="50%" cy="50%" r="70%">
                <stop offset="0%" style={{ stopColor: '#8B0000', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#500000', stopOpacity: 1 }} />
            </radialGradient>
            <linearGradient id="brassGradFrame" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#B8860B', stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: '#FFD700', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#B8860B', stopOpacity: 1 }} />
            </linearGradient>
            <filter id="velvetNoise">
                <feTurbulence type="fractalNoise" baseFrequency="0.1" numOctaves={3} result="noise" />
                <feComposite operator="in" in="noise" in2="SourceGraphic" result="monoNoise" />
                <feBlend mode="multiply" in="monoNoise" in2="SourceGraphic" />
            </filter>
        </defs>

        {/* Velvet background */}
        <rect x="15" y="15" width="370" height="90" fill="url(#velvetGrad)" filter="url(#velvetNoise)" />

        {/* Gold frame */}
        <g fill="none" stroke="url(#brassGradFrame)" strokeWidth="8">
            <rect x="5" y="5" width="390" height="110" rx="5" />
        </g>

        {/* Decorative elements */}
        <path d="M20 20 Q 50 50, 80 20 M 320 100 Q 350 70, 380 100" stroke="#B8860B" strokeWidth="1" opacity="0.3" fill="none" />
        <circle cx="200" cy="60" r="30" stroke="#B8860B" strokeWidth="1" opacity="0.2" strokeDasharray="5,5" fill="none" />
    </svg>
);

// ========================================
// 4. Armillary Sphere Card Back
// ========================================

/**
 * 천구의와 나침반 카드 뒷면 - Armillary Card Back
 * 르네상스 과학과 탐험 정신 상징
 */
export const RenaissanceCardBack: React.FC<ComponentProps> = ({
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
        {/* Mahogany base */}
        <rect x="5" y="5" width="90" height="130" rx="8" ry="8" fill="#663300" stroke="#B8860B" strokeWidth="3" />

        {/* Armillary sphere */}
        <g transform="translate(50, 70)" stroke="#FFD700" strokeWidth="2" fill="none">
            <ellipse cx="0" cy="0" rx="35" ry="35" />
            <ellipse cx="0" cy="0" rx="35" ry="15" transform="rotate(20)" />
            <ellipse cx="0" cy="0" rx="15" ry="35" transform="rotate(-20)" />
            <path d="M0 -25 L 5 -5 L 25 0 L 5 5 L 0 25 L -5 5 L -25 0 L -5 -5 Z" fill="#FFD700" />
            <circle cx="0" cy="0" r="3" fill="#B8860B" />
        </g>

        {/* Corner accents */}
        <path d="M15 15 L 30 15 M 15 15 L 15 30" stroke="#B8860B" strokeWidth="2" />
        <path d="M85 15 L 70 15 M 85 15 L 85 30" stroke="#B8860B" strokeWidth="2" />
        <path d="M15 125 L 30 125 M 15 125 L 15 110" stroke="#B8860B" strokeWidth="2" />
        <path d="M85 125 L 70 125 M 85 125 L 85 110" stroke="#B8860B" strokeWidth="2" />
    </svg>
);

// ========================================
// 5. Wax Seal End Turn Button
// ========================================

/**
 * 왁스 실링 인장 턴 종료 버튼 - Wax Seal Button
 * 붉은색 왁스 실링 형태의 권위 있는 버튼
 */
export const RenaissanceEndTurnButton: React.FC<ComponentProps & { text?: string }> = ({
    width = 150,
    height = 80,
    className = '',
    text = '턴 종료'
}) => (
    <svg
        width={width}
        height={height}
        viewBox="0 0 150 80"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ cursor: 'pointer' }}
    >
        <defs>
            <radialGradient id="waxGrad" cx="50%" cy="50%" r="60%">
                <stop offset="0%" style={{ stopColor: '#DC143C', stopOpacity: 1 }} />
                <stop offset="80%" style={{ stopColor: '#8B0000', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#500000', stopOpacity: 1 }} />
            </radialGradient>
            <filter id="waxGlow">
                <feGaussianBlur stdDeviation="1" result="blur" />
                <feSpecularLighting in="blur" surfaceScale={5} specularConstant={0.7} specularExponent={20} lightingColor="#ffcccc" result="specOut">
                    <fePointLight x={-5000} y={-10000} z={10000} />
                </feSpecularLighting>
                <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut" />
                <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1={0} k2={1} k3={1} k4={0} result="litPaint" />
            </filter>
        </defs>

        <g filter="url(#waxGlow)">
            {/* Wax shape */}
            <path d="M20 40 Q 25 10, 75 15 Q 125 10, 130 40 Q 125 70, 75 65 Q 25 70, 20 40 Z" fill="url(#waxGrad)" />
            <circle cx="75" cy="40" r="45" fill="url(#waxGrad)" stroke="#8B0000" strokeWidth="2" opacity="0.8" />

            {/* Seal design */}
            <g transform="translate(75, 40) scale(0.8)" fill="#500000" opacity="0.5">
                <circle cx="0" cy="0" r="30" fill="none" stroke="#500000" strokeWidth="2" />
                <path d="M-15 -10 C -20 -20, 20 -20, 15 -10 C 25 0, 25 20, 0 25 C -25 20, -25 0, -15 -10 Z" />
            </g>

            {/* Text */}
            <text
                x="75"
                y="45"
                fontFamily="serif"
                fontSize="18"
                fontWeight="bold"
                fill="#300000"
                textAnchor="middle"
                dominantBaseline="middle"
            >
                {text}
            </text>
        </g>
    </svg>
);

// ========================================
// Export all Renaissance Era UI Components
// ========================================
export const RenaissanceEraUI = {
    ExplorationMapBackground,
    RenaissanceHudBar,
    RenaissanceZoneFrame,
    RenaissanceCardBack,
    RenaissanceEndTurnButton,
};

export default RenaissanceEraUI;
