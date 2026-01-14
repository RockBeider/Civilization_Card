// ============================================================
// PrimitiveEraUI.tsx - Primitive Age UI Elements (Stone/Leather Theme)
// ============================================================

import React from 'react';

interface ComponentProps {
    width?: number;
    height?: number;
    className?: string;
}

// ========================================
// 1. Cave Wall Background Texture
// ========================================

/**
 * 동굴 벽면 배경 - Cave Wall Texture
 * 게임 화면 전체에 깔리는 거친 동굴 벽면 질감
 */
export const CaveWallBackground: React.FC<ComponentProps> = ({
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
            <filter id="caveWall">
                <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves={5} result="noise" />
                <feDiffuseLighting in="noise" lightingColor="#a08060" surfaceScale={3}>
                    <feDistantLight azimuth={45} elevation={60} />
                </feDiffuseLighting>
                <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" result="lit" />
                <feComposite operator="in" in2="SourceGraphic" />
            </filter>
            <linearGradient id="caveColor" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#6b5b4b', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#3e342b', stopOpacity: 1 }} />
            </linearGradient>
        </defs>
        <rect x="0" y="0" width="800" height="600" fill="url(#caveColor)" filter="url(#caveWall)" />
        <path d="M100 100 Q 150 50, 200 100 T 300 100" stroke="#8b4513" strokeWidth="5" fill="none" opacity="0.3" />
        <circle cx="600" cy="200" r="50" stroke="#8b4513" strokeWidth="5" fill="none" opacity="0.2" />
    </svg>
);

// ========================================
// 2. Leather & Bone HUD Bar
// ========================================

/**
 * 가죽과 뼈 HUD 바 - Leather & Bone HUD
 * 짐승 가죽을 뼈와 끈으로 고정한 상단 정보 표시줄
 */
export const PrimitiveHudBar: React.FC<ComponentProps> = ({
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
            <pattern id="leatherPattern" patternUnits="userSpaceOnUse" width="20" height="20">
                <path d="M0 0 Q 10 10 20 0" stroke="#6b4423" fill="none" opacity="0.3" />
            </pattern>
        </defs>
        {/* Main leather shape */}
        <path d="M10 10 Q 400 -5, 790 10 L 785 70 Q 400 85, 15 70 Z" fill="#8b5a2b" stroke="#5a3a1a" strokeWidth="3" />
        <path d="M10 10 Q 400 -5, 790 10 L 785 70 Q 400 85, 15 70 Z" fill="url(#leatherPattern)" opacity="0.5" />

        {/* Bone clamps - left */}
        <rect x="20" y="5" width="10" height="70" rx="5" fill="#dcdcdc" stroke="#a9a9a9" />
        <line x1="20" y1="20" x2="30" y2="20" stroke="#4a2f18" strokeWidth="3" />
        <line x1="20" y1="60" x2="30" y2="60" stroke="#4a2f18" strokeWidth="3" />

        {/* Bone clamps - right */}
        <rect x="770" y="5" width="10" height="70" rx="5" fill="#dcdcdc" stroke="#a9a9a9" />
        <line x1="770" y1="20" x2="780" y2="20" stroke="#4a2f18" strokeWidth="3" />
        <line x1="770" y1="60" x2="780" y2="60" stroke="#4a2f18" strokeWidth="3" />
    </svg>
);

// ========================================
// 3. Stone & Wood Zone Frame
// ========================================

/**
 * 돌과 나무 구역 프레임 - Zone Frame
 * 건물/유닛 구역을 나누는 투박한 경계선
 */
export const PrimitiveZoneFrame: React.FC<ComponentProps> = ({
    width = 400,
    height = 100,
    className = ''
}) => (
    <svg
        width={width}
        height={height}
        viewBox="0 0 400 100"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        {/* Main frame */}
        <path d="M10 10 L 390 15 L 385 85 L 15 80 Z" fill="none" stroke="#5a3a1a" strokeWidth="8" strokeLinejoin="round" />
        <path d="M10 10 L 390 15 L 385 85 L 15 80 Z" fill="none" stroke="#8b5a2b" strokeWidth="4" strokeLinejoin="round" strokeDasharray="20,10" />

        {/* Stone corners */}
        <circle cx="15" cy="15" r="12" fill="#808080" stroke="#505050" />
        <circle cx="385" cy="85" r="10" fill="#808080" stroke="#505050" />

        {/* Rope bindings */}
        <line x1="5" y1="5" x2="25" y2="25" stroke="#d2b48c" strokeWidth="3" />
        <line x1="375" y1="75" x2="395" y2="95" stroke="#d2b48c" strokeWidth="3" />
    </svg>
);

// ========================================
// 4. Stone Tablet Card Back
// ========================================

/**
 * 돌판 카드 뒷면 - Stone Card Back
 * 부족의 문양이 새겨진 돌판 느낌의 카드 뒷면
 */
export const PrimitiveCardBack: React.FC<ComponentProps> = ({
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
        {/* Stone base */}
        <rect x="5" y="5" width="90" height="130" rx="10" ry="10" fill="#708090" stroke="#2f4f4f" strokeWidth="3" />

        {/* Crack lines */}
        <path d="M10 20 L 30 10 M 70 130 L 90 110 M 50 50 L 60 70 L 40 90" stroke="#2f4f4f" strokeWidth="2" fill="none" opacity="0.5" />

        {/* Tribal symbol */}
        <g transform="translate(50, 70)" fill="none" stroke="#a9a9a9" strokeWidth="4">
            <path d="M0 0 C 10 10, 20 -10, 30 0 S 50 20, 0 40 S -50 20, -30 0 S -20 -20, 0 0" />
        </g>
        <circle cx="50" cy="70" r="5" fill="#a9a9a9" />
    </svg>
);

// ========================================
// 5. Stone & Rope End Turn Button
// ========================================

/**
 * 돌과 끈 턴 종료 버튼 - Stone Button
 * 투박하지만 묵직한 돌 버튼
 */
export const PrimitiveEndTurnButton: React.FC<ComponentProps & { text?: string }> = ({
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
            <filter id="rockShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                <feOffset dx="4" dy="4" result="offsetblur" />
                <feComponentTransfer>
                    <feFuncA type="linear" slope="0.5" />
                </feComponentTransfer>
                <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>

        <g filter="url(#rockShadow)">
            {/* Stone shape */}
            <path
                d="M10 15 Q 75 5, 140 15 Q 145 30, 140 45 Q 75 55, 10 45 Q 5 30, 10 15 Z"
                fill="#8b4513"
                stroke="#5a3a1a"
                strokeWidth="3"
            />

            {/* Rope bindings */}
            <rect x="25" y="5" width="6" height="50" fill="#d2b48c" />
            <rect x="119" y="5" width="6" height="50" fill="#d2b48c" />

            {/* Text */}
            <text
                x="75"
                y="35"
                fontFamily="sans-serif"
                fontSize="20"
                fontWeight="bold"
                fill="#f0e68c"
                textAnchor="middle"
                dominantBaseline="middle"
                stroke="#3e2714"
                strokeWidth="1"
            >
                {text}
            </text>
        </g>
    </svg>
);

// ========================================
// Export all Primitive Era UI Components
// ========================================
export const PrimitiveEraUI = {
    CaveWallBackground,
    PrimitiveHudBar,
    PrimitiveZoneFrame,
    PrimitiveCardBack,
    PrimitiveEndTurnButton,
};

export default PrimitiveEraUI;
