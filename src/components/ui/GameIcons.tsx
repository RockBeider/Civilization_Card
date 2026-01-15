// ============================================================
// GameIcons.tsx - Custom SVG Icons for Game Assets (High-Quality Pixel Art)
// ============================================================

import React from 'react';

// PNG Icons
import iconProduction from '../../assets/icon_production.png';
import iconFood from '../../assets/icon_food.png';
import iconScience from '../../assets/icon_science.png';
import iconCrisis from '../../assets/icon_crisis.png';
import iconWheat from '../../assets/icon_wheat.png';
import iconBook from '../../assets/icon_book.png';

interface IconProps {
    size?: number;
    className?: string;
}

// --- Resource Icons (High-Quality Pixel Art) ---

/**
 * 망치 - 생산력 아이콘 (고품질 픽셀 아트)
 */
export const ProductionIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => {
    return (
        <img
            src={iconProduction}
            alt="Production"
            width={size}
            height={size}
            className={className}
            style={{ imageRendering: 'pixelated' }}
        />
    );
};

/**
 * 빵 - 식량 아이콘 (고품질 픽셀 아트)
 */
export const FoodIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => {
    return (
        <img
            src={iconFood}
            alt="Food"
            width={size}
            height={size}
            className={className}
            style={{ imageRendering: 'pixelated' }}
        />
    );
};

/**
 * 비커 - 과학 아이콘 (고품질 픽셀 아트)
 */
export const ScienceIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => {
    return (
        <img
            src={iconScience}
            alt="Science"
            width={size}
            height={size}
            className={className}
            style={{ imageRendering: 'pixelated' }}
        />
    );
};

// --- Card Type Icons (Pixel Art Style) ---

/**
 * 해골 방패 - 위기/Crisis 아이콘 (픽셀 아트)
 */
export const CrisisIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => {
    return (
        <img
            src={iconCrisis}
            alt="Crisis"
            width={size}
            height={size}
            className={className}
            style={{ imageRendering: 'pixelated' }}
        />
    );
};

/**
 * 밀 - 농장 아이콘 (픽셀 아트)
 */
export const WheatIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => {
    return (
        <img
            src={iconWheat}
            alt="Wheat"
            width={size}
            height={size}
            className={className}
            style={{ imageRendering: 'pixelated' }}
        />
    );
};

/**
 * 책 - 도서관 아이콘 (픽셀 아트)
 */
export const BookIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => {
    return (
        <img
            src={iconBook}
            alt="Book"
            width={size}
            height={size}
            className={className}
            style={{ imageRendering: 'pixelated' }}
        />
    );
};

/**
 * 칼 - 기사/검사 아이콘 (픽셀 아트)
 */
export const SwordIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => {
    const p = 4; // pixel size
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            style={{ imageRendering: 'pixelated' }}
        >
            {/* Blade tip */}
            <rect x={28} y={4} width={p * 2} height={p} fill="#E8E8E8" />
            <rect x={24} y={8} width={p * 4} height={p} fill="#C0C0C0" />
            {/* Blade */}
            <rect x={24} y={12} width={p * 4} height={p} fill="#D3D3D3" />
            <rect x={24} y={16} width={p * 4} height={p} fill="#C0C0C0" />
            <rect x={24} y={20} width={p * 4} height={p} fill="#D3D3D3" />
            <rect x={24} y={24} width={p * 4} height={p} fill="#C0C0C0" />
            <rect x={24} y={28} width={p * 4} height={p} fill="#D3D3D3" />
            <rect x={24} y={32} width={p * 4} height={p} fill="#C0C0C0" />
            {/* Center line */}
            <rect x={28} y={12} width={p} height={p * 6} fill="#A9A9A9" />
            {/* Guard */}
            <rect x={16} y={36} width={p * 8} height={p} fill="#FFD700" />
            <rect x={12} y={40} width={p * 10} height={p} fill="#DAA520" />
            {/* Handle */}
            <rect x={24} y={44} width={p * 4} height={p} fill="#8B4513" />
            <rect x={24} y={48} width={p * 4} height={p} fill="#654321" />
            <rect x={24} y={52} width={p * 4} height={p} fill="#8B4513" />
            {/* Pommel */}
            <rect x={24} y={56} width={p * 4} height={p * 2} fill="#FFD700" />
        </svg>
    );
};

/**
 * 활과 화살 - 궁수 아이콘 (픽셀 아트)
 */
export const BowIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => {
    const p = 4; // pixel size
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            style={{ imageRendering: 'pixelated' }}
        >
            {/* Bow curve left side */}
            <rect x={16} y={8} width={p} height={p} fill="#8B4513" />
            <rect x={12} y={12} width={p} height={p * 2} fill="#A0522D" />
            <rect x={8} y={20} width={p} height={p * 3} fill="#8B4513" />
            <rect x={8} y={32} width={p} height={p * 2} fill="#A0522D" />
            <rect x={12} y={40} width={p} height={p * 2} fill="#8B4513" />
            <rect x={16} y={48} width={p} height={p} fill="#A0522D" />
            {/* Bow string */}
            <rect x={20} y={12} width={p} height={p} fill="#DEB887" />
            <rect x={20} y={16} width={p} height={p * 8} fill="#D2B48C" />
            <rect x={20} y={40} width={p} height={p * 2} fill="#D2B48C" />
            <rect x={20} y={44} width={p} height={p} fill="#DEB887" />
            {/* Arrow shaft */}
            <rect x={24} y={28} width={p * 8} height={p} fill="#CD853F" />
            {/* Arrow head */}
            <rect x={48} y={24} width={p} height={p} fill="#C0C0C0" />
            <rect x={52} y={28} width={p * 2} height={p} fill="#A9A9A9" />
            <rect x={48} y={32} width={p} height={p} fill="#C0C0C0" />
            {/* Arrow fletching */}
            <rect x={24} y={24} width={p} height={p} fill="#DC143C" />
            <rect x={24} y={32} width={p} height={p} fill="#DC143C" />
            <rect x={28} y={24} width={p} height={p} fill="#B22222" />
            <rect x={28} y={32} width={p} height={p} fill="#B22222" />
        </svg>
    );
};

// --- Era Icons (Pixel Art Style) ---

/**
 * 돌도끼 - 원시 시대 아이콘 (픽셀 아트)
 */
export const StoneAxeIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => {
    const p = 4; // pixel size
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            style={{ imageRendering: 'pixelated' }}
        >
            {/* Stone head */}
            <rect x={32} y={8} width={p * 2} height={p} fill="#708090" />
            <rect x={28} y={12} width={p * 4} height={p} fill="#708090" />
            <rect x={24} y={16} width={p * 5} height={p} fill="#778899" />
            <rect x={24} y={20} width={p * 4} height={p} fill="#708090" />
            <rect x={28} y={24} width={p * 2} height={p} fill="#5F6A6A" />
            {/* Handle */}
            <rect x={28} y={28} width={p} height={p} fill="#8B4513" />
            <rect x={24} y={32} width={p} height={p} fill="#A0522D" />
            <rect x={20} y={36} width={p} height={p} fill="#8B4513" />
            <rect x={16} y={40} width={p} height={p} fill="#A0522D" />
            <rect x={12} y={44} width={p} height={p} fill="#8B4513" />
            <rect x={8} y={48} width={p} height={p} fill="#654321" />
            <rect x={8} y={52} width={p} height={p} fill="#5D4037" />
        </svg>
    );
};

/**
 * 석조 기둥 - 고대 시대 아이콘 (픽셀 아트)
 */
export const StoneColumnIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => {
    const p = 4; // pixel size
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            style={{ imageRendering: 'pixelated' }}
        >
            {/* Top decoration */}
            <rect x={16} y={4} width={p * 8} height={p} fill="#DEB887" />
            <rect x={12} y={8} width={p * 10} height={p} fill="#F5DEB3" />
            {/* Column body */}
            <rect x={20} y={12} width={p * 6} height={p} fill="#EACD9E" />
            <rect x={20} y={16} width={p * 6} height={p} fill="#F5DEB3" />
            <rect x={20} y={20} width={p * 6} height={p} fill="#EACD9E" />
            <rect x={20} y={24} width={p * 6} height={p} fill="#F5DEB3" />
            <rect x={20} y={28} width={p * 6} height={p} fill="#EACD9E" />
            <rect x={20} y={32} width={p * 6} height={p} fill="#F5DEB3" />
            <rect x={20} y={36} width={p * 6} height={p} fill="#EACD9E" />
            <rect x={20} y={40} width={p * 6} height={p} fill="#F5DEB3" />
            <rect x={20} y={44} width={p * 6} height={p} fill="#EACD9E" />
            {/* Base */}
            <rect x={12} y={48} width={p * 10} height={p} fill="#DEB887" />
            <rect x={8} y={52} width={p * 12} height={p * 2} fill="#CDB891" />
        </svg>
    );
};

/**
 * 성곽 타워 - 중세 시대 아이콘 (픽셀 아트)
 */
export const CastleTowerIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => {
    const p = 4; // pixel size
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            style={{ imageRendering: 'pixelated' }}
        >
            {/* Flag */}
            <rect x={32} y={4} width={p} height={p * 3} fill="#696969" />
            <rect x={36} y={4} width={p * 3} height={p} fill="#DC143C" />
            <rect x={36} y={8} width={p * 2} height={p} fill="#B22222" />
            {/* Battlements */}
            <rect x={12} y={12} width={p * 2} height={p * 2} fill="#A9A9A9" />
            <rect x={24} y={12} width={p * 2} height={p * 2} fill="#A9A9A9" />
            <rect x={36} y={12} width={p * 2} height={p * 2} fill="#A9A9A9" />
            <rect x={48} y={12} width={p * 2} height={p * 2} fill="#A9A9A9" />
            {/* Tower top */}
            <rect x={12} y={20} width={p * 10} height={p} fill="#808080" />
            {/* Tower body */}
            <rect x={16} y={24} width={p * 8} height={p} fill="#696969" />
            <rect x={16} y={28} width={p * 8} height={p} fill="#808080" />
            <rect x={16} y={32} width={p * 8} height={p} fill="#696969" />
            <rect x={16} y={36} width={p * 8} height={p} fill="#808080" />
            <rect x={16} y={40} width={p * 8} height={p} fill="#696969" />
            <rect x={16} y={44} width={p * 8} height={p} fill="#808080" />
            {/* Door */}
            <rect x={28} y={40} width={p * 2} height={p * 3} fill="#2F4F4F" />
            {/* Base */}
            <rect x={12} y={48} width={p * 10} height={p} fill="#696969" />
            <rect x={8} y={52} width={p * 12} height={p * 2} fill="#505050" />
        </svg>
    );
};

/**
 * 나침반 - 르네상스 시대 아이콘 (픽셀 아트)
 */
export const CompassIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => {
    const p = 4; // pixel size
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            style={{ imageRendering: 'pixelated' }}
        >
            {/* Outer ring */}
            <rect x={24} y={4} width={p * 4} height={p} fill="#DAA520" />
            <rect x={16} y={8} width={p * 8} height={p} fill="#B8860B" />
            <rect x={12} y={12} width={p} height={p} fill="#DAA520" />
            <rect x={48} y={12} width={p} height={p} fill="#DAA520" />
            <rect x={8} y={16} width={p} height={p * 8} fill="#B8860B" />
            <rect x={52} y={16} width={p} height={p * 8} fill="#B8860B" />
            <rect x={12} y={48} width={p} height={p} fill="#DAA520" />
            <rect x={48} y={48} width={p} height={p} fill="#DAA520" />
            <rect x={16} y={52} width={p * 8} height={p} fill="#B8860B" />
            <rect x={24} y={56} width={p * 4} height={p} fill="#DAA520" />
            {/* Inner circle */}
            <rect x={20} y={16} width={p * 6} height={p} fill="#F0E68C" />
            <rect x={16} y={20} width={p * 8} height={p} fill="#F0E68C" />
            <rect x={16} y={24} width={p * 8} height={p} fill="#F0E68C" />
            <rect x={16} y={28} width={p * 8} height={p} fill="#F0E68C" />
            <rect x={16} y={32} width={p * 8} height={p} fill="#F0E68C" />
            <rect x={16} y={36} width={p * 8} height={p} fill="#F0E68C" />
            <rect x={16} y={40} width={p * 8} height={p} fill="#F0E68C" />
            <rect x={20} y={44} width={p * 6} height={p} fill="#F0E68C" />
            {/* Compass needle - North (red) */}
            <rect x={28} y={16} width={p * 2} height={p} fill="#FF0000" />
            <rect x={28} y={20} width={p * 2} height={p} fill="#DC143C" />
            <rect x={28} y={24} width={p * 2} height={p} fill="#B22222" />
            {/* Compass needle - South (dark) */}
            <rect x={28} y={36} width={p * 2} height={p} fill="#2F4F4F" />
            <rect x={28} y={40} width={p * 2} height={p} fill="#1C1C1C" />
            {/* Center */}
            <rect x={28} y={28} width={p * 2} height={p * 2} fill="#FFD700" />
        </svg>
    );
};

/**
 * 톱니바퀴 - 산업 시대 아이콘 (픽셀 아트)
 */
export const GearIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => {
    const p = 4; // pixel size
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            style={{ imageRendering: 'pixelated' }}
        >
            {/* Gear teeth */}
            <rect x={28} y={4} width={p * 2} height={p * 2} fill="#778899" />
            <rect x={48} y={12} width={p * 2} height={p * 2} fill="#778899" />
            <rect x={52} y={28} width={p * 2} height={p * 2} fill="#778899" />
            <rect x={48} y={48} width={p * 2} height={p * 2} fill="#778899" />
            <rect x={28} y={56} width={p * 2} height={p * 2} fill="#778899" />
            <rect x={12} y={48} width={p * 2} height={p * 2} fill="#778899" />
            <rect x={8} y={28} width={p * 2} height={p * 2} fill="#778899" />
            <rect x={12} y={12} width={p * 2} height={p * 2} fill="#778899" />
            {/* Gear body */}
            <rect x={24} y={12} width={p * 4} height={p} fill="#708090" />
            <rect x={20} y={16} width={p * 6} height={p} fill="#708090" />
            <rect x={16} y={20} width={p * 8} height={p} fill="#708090" />
            <rect x={12} y={24} width={p * 10} height={p} fill="#708090" />
            <rect x={12} y={28} width={p * 10} height={p} fill="#708090" />
            <rect x={12} y={32} width={p * 10} height={p} fill="#708090" />
            <rect x={12} y={36} width={p * 10} height={p} fill="#708090" />
            <rect x={16} y={40} width={p * 8} height={p} fill="#708090" />
            <rect x={20} y={44} width={p * 6} height={p} fill="#708090" />
            <rect x={24} y={48} width={p * 4} height={p} fill="#708090" />
            {/* Inner circle */}
            <rect x={24} y={24} width={p * 4} height={p} fill="#B0C4DE" />
            <rect x={20} y={28} width={p * 6} height={p} fill="#B0C4DE" />
            <rect x={20} y={32} width={p * 6} height={p} fill="#B0C4DE" />
            <rect x={24} y={36} width={p * 4} height={p} fill="#B0C4DE" />
            {/* Center hole */}
            <rect x={28} y={28} width={p * 2} height={p * 2} fill="#2F4F4F" />
        </svg>
    );
};

/**
 * 로켓 - 우주 시대 아이콘 (픽셀 아트)
 */
export const RocketNetworkIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => {
    const p = 4; // pixel size
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            style={{ imageRendering: 'pixelated' }}
        >
            {/* Rocket nose */}
            <rect x={28} y={4} width={p * 2} height={p} fill="#E0E0E0" />
            <rect x={24} y={8} width={p * 4} height={p} fill="#C0C0C0" />
            <rect x={24} y={12} width={p * 4} height={p} fill="#E0FFFF" />
            {/* Rocket body */}
            <rect x={20} y={16} width={p * 6} height={p} fill="#E0FFFF" />
            <rect x={20} y={20} width={p * 6} height={p} fill="#B0E0E6" />
            <rect x={20} y={24} width={p * 6} height={p} fill="#E0FFFF" />
            <rect x={20} y={28} width={p * 6} height={p} fill="#B0E0E6" />
            <rect x={20} y={32} width={p * 6} height={p} fill="#E0FFFF" />
            {/* Window */}
            <rect x={28} y={20} width={p * 2} height={p * 2} fill="#00BFFF" />
            {/* Fins */}
            <rect x={12} y={32} width={p * 2} height={p * 2} fill="#4682B4" />
            <rect x={16} y={28} width={p} height={p * 2} fill="#5F9EA0" />
            <rect x={48} y={32} width={p * 2} height={p * 2} fill="#4682B4" />
            <rect x={44} y={28} width={p} height={p * 2} fill="#5F9EA0" />
            {/* Rocket bottom */}
            <rect x={20} y={36} width={p * 6} height={p} fill="#A9A9A9" />
            <rect x={24} y={40} width={p * 4} height={p} fill="#696969" />
            {/* Flames */}
            <rect x={28} y={44} width={p * 2} height={p} fill="#FFD700" />
            <rect x={24} y={48} width={p * 4} height={p} fill="#FFA500" />
            <rect x={28} y={52} width={p * 2} height={p} fill="#FF4500" />
            <rect x={28} y={56} width={p * 2} height={p} fill="#FF6347" />
            {/* Stars */}
            <rect x={8} y={8} width={p} height={p} fill="#FFFFFF" />
            <rect x={52} y={16} width={p} height={p} fill="#FFFFFF" />
            <rect x={8} y={44} width={p} height={p} fill="#87CEEB" />
            <rect x={52} y={48} width={p} height={p} fill="#87CEEB" />
        </svg>
    );
};

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
