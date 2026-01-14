// ============================================================
// AncientEraUI.tsx - Ancient Age UI Elements (Stone/Bronze/Papyrus Theme)
// ============================================================

import React from 'react';

interface ComponentProps {
    width?: number;
    height?: number;
    className?: string;
}

// ========================================
// 1. Temple Wall Background (Sandstone)
// ========================================

/**
 * 신전 벽면 배경 - Sandstone Temple Wall
 * 사암으로 지어진 고대 신전의 벽면 (상형문자 패턴 + 따뜻한 태양광)
 */
export const TempleWallBackground: React.FC<ComponentProps> = ({
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
            <pattern id="sandstoneBricks" patternUnits="userSpaceOnUse" width="200" height="100">
                <rect x="0" y="0" width="200" height="100" fill="#EACD9E" />
                <path d="M0 50h200 M100 0v50 M0 50v50 M200 50v50" stroke="#CDB891" strokeWidth="2" />
                <path d="M20 20h10v10h-10z M150 70c5-5 10 0 5 5" stroke="#CDB891" fill="none" opacity="0.3" />
            </pattern>
            <filter id="warmLight">
                <feDiffuseLighting in="SourceGraphic" lightingColor="#fffacd" surfaceScale={1}>
                    <feDistantLight azimuth={90} elevation={60} />
                </feDiffuseLighting>
                <feComposite operator="in" in2="SourceGraphic" />
            </filter>
        </defs>
        <rect x="0" y="0" width="800" height="600" fill="url(#sandstoneBricks)" filter="url(#warmLight)" />
    </svg>
);

// ========================================
// 2. Marble & Bronze HUD Bar
// ========================================

/**
 * 대리석과 청동 HUD 바 - Marble & Bronze HUD
 * 정교하게 다듬어진 돌 위에 청동 장식 + 중앙 태양 문양
 */
export const AncientHudBar: React.FC<ComponentProps> = ({
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
            <linearGradient id="marbleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#F5DEB3', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#EACD9E', stopOpacity: 1 }} />
            </linearGradient>
            <linearGradient id="bronzeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#CD7F32', stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: '#B87333', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#CD7F32', stopOpacity: 1 }} />
            </linearGradient>
        </defs>

        {/* Main marble bar */}
        <path d="M0 10h800v60H0z" fill="url(#marbleGrad)" />
        <path d="M0 10h800M0 70h800" stroke="#CDB891" strokeWidth="4" />

        {/* Bronze trim */}
        <rect x="0" y="6" width="800" height="4" fill="url(#bronzeGrad)" />
        <rect x="0" y="70" width="800" height="4" fill="url(#bronzeGrad)" />

        {/* Sun emblem center */}
        <g transform="translate(400, 40)">
            <circle cx="0" cy="0" r="15" fill="#FFD700" stroke="#DAA520" strokeWidth="2" />
            <path d="M20 0c10-5 20-5 30 0-10 5-20 15-30 0z" fill="url(#bronzeGrad)" />
            <path d="M-20 0c-10-5-20-5-30 0 10 5 20 15 30 0z" fill="url(#bronzeGrad)" />
        </g>
    </svg>
);

// ========================================
// 3. Papyrus Scroll Zone Frame
// ========================================

/**
 * 파피루스 두루마리 구역 프레임 - Papyrus Scroll Frame
 * 양끝이 말려있는 파피루스 두루마리 형태
 */
export const AncientZoneFrame: React.FC<ComponentProps> = ({
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
            <linearGradient id="papyrusGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#F8E8C4', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#EAD2A8', stopOpacity: 1 }} />
            </linearGradient>
        </defs>

        {/* Main papyrus body */}
        <rect x="20" y="10" width="360" height="100" fill="url(#papyrusGrad)" />
        <path d="M25 20h350 M25 40h350 M25 60h350 M25 80h350 M25 100h350" stroke="#D2B48C" strokeWidth="1" opacity="0.5" />

        {/* Left scroll curl */}
        <path d="M20 10 Q 0 10, 5 30 Q 15 50, 5 70 Q 0 90, 20 110 L 20 10" fill="#DEBA87" stroke="#CDB891" />
        <path d="M20 10c-5 0-10 5-10 10v80c0 5 5 10 10 10" fill="none" stroke="#8B4513" strokeWidth="2" />

        {/* Right scroll curl */}
        <path d="M380 10 Q 400 10, 395 30 Q 385 50, 395 70 Q 400 90, 380 110 L 380 10" fill="#DEBA87" stroke="#CDB891" />
        <path d="M380 10c5 0 10 5 10 10v80c0 5-5 10-10 10" fill="none" stroke="#8B4513" strokeWidth="2" />
    </svg>
);

// ========================================
// 4. Hieroglyph Stone Tablet Card Back
// ========================================

/**
 * 상형문자 석판 카드 뒷면 - Hieroglyph Card Back
 * 황금색 테두리의 석판에 고대 문양이 음각으로 새겨진 모습
 */
export const AncientCardBack: React.FC<ComponentProps> = ({
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
        <rect x="5" y="5" width="90" height="130" rx="5" ry="5" fill="#EACD9E" stroke="#B8860B" strokeWidth="4" />

        {/* Hieroglyph symbol */}
        <g transform="translate(50, 70)" fill="none" stroke="#CDB891" strokeWidth="3">
            <path d="M0 -30 C 15 -30, 15 -10, 0 -10 C -15 -10, -15 -30, 0 -30 M0 -10 V 30 M -20 10 H 20" />
            <path d="M-30 40 Q -15 30, 0 40 Q 15 50, 30 40" />
        </g>

        {/* Inner border */}
        <rect x="10" y="10" width="80" height="120" rx="2" fill="none" stroke="#B8860B" strokeWidth="1" strokeDasharray="5,5" />
    </svg>
);

// ========================================
// 5. Golden Seal End Turn Button
// ========================================

/**
 * 황금 옥새 턴 종료 버튼 - Golden Seal Button
 * 묵직하고 화려한 황금 인장(옥새) 스타일
 */
export const AncientEndTurnButton: React.FC<ComponentProps & { text?: string }> = ({
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
            <linearGradient id="goldBtnGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#FFD700', stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: '#DAA520', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#B8860B', stopOpacity: 1 }} />
            </linearGradient>
            <filter id="goldBevel">
                <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
                <feOffset in="blur" dx="0" dy="3" result="offsetBlur" />
                <feSpecularLighting in="blur" surfaceScale={5} specularConstant={1} specularExponent={15} lightingColor="#ffffff" result="specOut">
                    <fePointLight x={-5000} y={-10000} z={10000} />
                </feSpecularLighting>
                <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut" />
                <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1={0} k2={1} k3={1} k4={0} result="litPaint" />
                <feMerge>
                    <feMergeNode in="offsetBlur" />
                    <feMergeNode in="litPaint" />
                </feMerge>
            </filter>
        </defs>

        <g filter="url(#goldBevel)">
            {/* Ellipse shape */}
            <ellipse cx="75" cy="30" rx="70" ry="28" fill="url(#goldBtnGrad)" stroke="#B8860B" strokeWidth="2" />

            {/* Decorative line */}
            <path d="M20 30h110" stroke="#B8860B" strokeWidth="2" strokeDasharray="5,3" />

            {/* Text */}
            <text
                x="75"
                y="35"
                fontFamily="serif"
                fontSize="22"
                fontWeight="bold"
                fill="#5c3317"
                textAnchor="middle"
                dominantBaseline="middle"
            >
                {text}
            </text>
        </g>
    </svg>
);

// ========================================
// Export all Ancient Era UI Components
// ========================================
export const AncientEraUI = {
    TempleWallBackground,
    AncientHudBar,
    AncientZoneFrame,
    AncientCardBack,
    AncientEndTurnButton,
};

export default AncientEraUI;
