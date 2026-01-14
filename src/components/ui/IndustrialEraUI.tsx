// ============================================================
// IndustrialEraUI.tsx - Industrial Age UI Elements (Steel/Gear/Steam Theme)
// ============================================================

import React from 'react';

interface ComponentProps {
    width?: number;
    height?: number;
    className?: string;
}

// ========================================
// 1. Factory Interior Background
// ========================================

/**
 * 공장 내부 배경 - Factory Interior Texture
 * 그을음 묻은 강철판과 철망으로 이루어진 공장 벽면
 */
export const FactoryBackground: React.FC<ComponentProps> = ({
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
            <pattern id="metalFloor" patternUnits="userSpaceOnUse" width="100" height="100">
                <rect width="100" height="100" fill="#2F4F4F" />
                <path d="M0 0h100v100h-100z" stroke="#1C2F2F" strokeWidth="2" fill="none" />
                <circle cx="5" cy="5" r="2" fill="#1C2F2F" />
                <circle cx="95" cy="5" r="2" fill="#1C2F2F" />
                <circle cx="5" cy="95" r="2" fill="#1C2F2F" />
                <circle cx="95" cy="95" r="2" fill="#1C2F2F" />
                <path d="M25 25l25 25-25 25-25-25zM75 25l25 25-25 25-25-25z" fill="#3C5F5F" />
            </pattern>
            <radialGradient id="factoryLight" cx="50%" cy="50%" r="70%">
                <stop offset="0%" style={{ stopColor: '#000000', stopOpacity: 0 }} />
                <stop offset="100%" style={{ stopColor: '#000000', stopOpacity: 0.7 }} />
            </radialGradient>
        </defs>
        <rect x="0" y="0" width="800" height="600" fill="url(#metalFloor)" />
        <rect x="0" y="0" width="800" height="600" fill="url(#factoryLight)" />
    </svg>
);

// ========================================
// 2. Pipe & Gauge HUD Bar
// ========================================

/**
 * 파이프와 계기판 HUD 바 - Pipe & Gauge HUD
 * 파이프와 압력 게이지가 연결된 기계 장치 + 증기 효과
 */
export const IndustrialHudBar: React.FC<ComponentProps> = ({
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
            <linearGradient id="pipeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#708090', stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: '#A9A9A9', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#708090', stopOpacity: 1 }} />
            </linearGradient>
        </defs>

        {/* Main pipe */}
        <rect x="0" y="20" width="800" height="40" fill="url(#pipeGrad)" stroke="#2F4F4F" strokeWidth="2" />
        <rect x="100" y="15" width="20" height="50" fill="#696969" stroke="#2F4F4F" />
        <rect x="680" y="15" width="20" height="50" fill="#696969" stroke="#2F4F4F" />

        {/* Pressure gauge center */}
        <circle cx="400" cy="40" r="35" fill="#F0F8FF" stroke="#2F4F4F" strokeWidth="4" />
        <circle cx="400" cy="40" r="30" fill="none" stroke="#A9A9A9" strokeWidth="1" strokeDasharray="5,5" />
        <line x1="400" y1="40" x2="420" y2="25" stroke="#DC143C" strokeWidth="3" strokeLinecap="round" />
        <circle cx="400" cy="40" r="4" fill="#2F4F4F" />

        {/* Steam effect */}
        <path d="M720 30 Q 730 10, 750 20 T 780 15" stroke="#FFFFFF" strokeWidth="3" fill="none" opacity="0.6" strokeLinecap="round" />
        <path d="M730 35 Q 740 15, 760 25 T 790 20" stroke="#FFFFFF" strokeWidth="2" fill="none" opacity="0.4" strokeLinecap="round" />
    </svg>
);

// ========================================
// 3. Steel Plate & Bolt Zone Frame
// ========================================

/**
 * 철판과 볼트 구역 프레임 - Steel Plate Frame
 * 두꺼운 철판을 볼트로 고정한 구획
 */
export const IndustrialZoneFrame: React.FC<ComponentProps> = ({
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
        {/* Main steel plate */}
        <rect x="10" y="10" width="380" height="100" fill="#778899" stroke="#2F4F4F" strokeWidth="3" />

        {/* Top and bottom rails */}
        <rect x="5" y="5" width="390" height="15" fill="#696969" stroke="#2F4F4F" />
        <rect x="5" y="100" width="390" height="15" fill="#696969" stroke="#2F4F4F" />

        {/* Bolts */}
        <g fill="#A9A9A9" stroke="#2F4F4F">
            <circle cx="20" cy="12" r="4" />
            <circle cx="380" cy="12" r="4" />
            <circle cx="20" cy="108" r="4" />
            <circle cx="380" cy="108" r="4" />
            <circle cx="200" cy="12" r="4" />
            <circle cx="200" cy="108" r="4" />
        </g>
    </svg>
);

// ========================================
// 4. Gear Mechanism Card Back
// ========================================

/**
 * 톱니바퀴 매커니즘 카드 뒷면 - Gear Card Back
 * 복잡한 톱니바퀴와 기계 장치가 맞물린 디자인
 */
export const IndustrialCardBack: React.FC<ComponentProps> = ({
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
        {/* Metal base */}
        <rect x="5" y="5" width="90" height="130" rx="5" ry="5" fill="#708090" stroke="#2F4F4F" strokeWidth="3" />

        {/* Gear mechanism */}
        <g opacity="0.6">
            <circle cx="50" cy="70" r="30" fill="none" stroke="#2F4F4F" strokeWidth="4" strokeDasharray="8,4" />
            <circle cx="50" cy="70" r="10" fill="#2F4F4F" />
            <circle cx="25" cy="40" r="15" fill="none" stroke="#2F4F4F" strokeWidth="3" strokeDasharray="6,3" />
            <circle cx="75" cy="100" r="15" fill="none" stroke="#2F4F4F" strokeWidth="3" strokeDasharray="6,3" />
            <path d="M25 40 L 50 70 L 75 100" stroke="#2F4F4F" strokeWidth="2" strokeDasharray="2,2" />
        </g>

        {/* Inner border */}
        <rect x="10" y="10" width="80" height="120" rx="2" fill="none" stroke="#A9A9A9" strokeWidth="1" strokeDasharray="10,10" />
    </svg>
);

// ========================================
// 5. Lever Switch End Turn Button
// ========================================

/**
 * 대형 레버 스위치 턴 종료 버튼 - Lever Button
 * 공장 기계를 작동시키는 투박한 레버 스위치
 */
export const IndustrialEndTurnButton: React.FC<ComponentProps & { text?: string }> = ({
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
            <linearGradient id="leverHandle" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#8B0000', stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: '#FF0000', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#8B0000', stopOpacity: 1 }} />
            </linearGradient>
            <linearGradient id="metalBase" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#A9A9A9', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#696969', stopOpacity: 1 }} />
            </linearGradient>
        </defs>

        {/* Base plate */}
        <rect x="10" y="40" width="130" height="30" rx="5" fill="url(#metalBase)" stroke="#2F4F4F" strokeWidth="2" />
        <rect x="20" y="45" width="110" height="20" fill="#2F4F4F" opacity="0.3" />

        {/* Lever */}
        <g transform="rotate(-20 75 55)">
            <rect x="70" y="10" width="10" height="45" fill="#696969" stroke="#2F4F4F" />
            <circle cx="75" cy="10" r="15" fill="url(#leverHandle)" stroke="#8B0000" strokeWidth="2" />
        </g>

        {/* Pivot point */}
        <circle cx="75" cy="55" r="8" fill="#A9A9A9" stroke="#2F4F4F" strokeWidth="2" />

        {/* Text */}
        <text
            x="75"
            y="75"
            fontFamily="sans-serif"
            fontSize="16"
            fontWeight="bold"
            fill="#F0F8FF"
            textAnchor="middle"
        >
            {text}
        </text>
    </svg>
);

// ========================================
// Export all Industrial Era UI Components
// ========================================
export const IndustrialEraUI = {
    FactoryBackground,
    IndustrialHudBar,
    IndustrialZoneFrame,
    IndustrialCardBack,
    IndustrialEndTurnButton,
};

export default IndustrialEraUI;
