import React from 'react';
import { Card } from '../types/game';
import { SUIT_SYMBOLS } from '../utils/tienlenEngine';

interface CardViewProps {
  card: Card;
  isSelected?: boolean;
  isPlayable?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  rotation?: number;
  className?: string;
  disabled?: boolean;
}

export const CardView: React.FC<CardViewProps> = ({
  card,
  isSelected = false,
  isPlayable = true,
  onClick,
  size = 'md',
  rotation = 0,
  className = '',
  disabled = false
}) => {
  const isRed = card.color === 'red';
  const suitSymbol = SUIT_SYMBOLS[card.suit];

  const sizeClasses = {
    sm: 'w-7 h-10 text-[9px] rounded shadow',
    md: 'w-10 h-15 sm:w-12 sm:h-18 md:w-14 md:h-21 text-xs sm:text-sm rounded-lg shadow-md',
    lg: 'w-13 h-19 sm:w-15 sm:h-22 md:w-17 md:h-25 text-sm sm:text-base rounded-xl shadow-lg'
  };

  return (
    <button
      type="button"
      id={`card-${card.id}`}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        transform: `rotate(${rotation}deg) translateY(${isSelected ? '-14px' : '0px'})`,
        transition: 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.18s ease'
      }}
      className={`
        relative select-none cursor-pointer flex flex-col justify-between p-1 sm:p-1.5
        bg-white font-black tracking-tight
        ${isRed ? 'text-red-600' : 'text-slate-950'}
        ${isSelected
          ? 'border-2 border-yellow-500 ring-3 ring-yellow-400/70 shadow-xl shadow-yellow-500/40 z-30 brightness-105 scale-105'
          : 'border border-emerald-400/80 hover:border-yellow-400 hover:shadow-lg hover:-translate-y-1.5'}
        ${!isPlayable ? 'opacity-90' : ''}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {/* Top-left rank & suit */}
      <div className="flex flex-col items-center leading-none text-left self-start">
        <span className="font-black tracking-tighter text-[11px] sm:text-xs md:text-sm">
          {card.label}
        </span>
        <span className="text-[10px] sm:text-xs mt-0.5">{suitSymbol}</span>
      </div>

      {/* Center suit watermark / emblem */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-85">
        {card.rank === 15 ? (
          <span className="text-base sm:text-xl md:text-2xl filter drop-shadow">🐷</span>
        ) : (
          <span className="text-base sm:text-xl md:text-2xl filter drop-shadow-sm">{suitSymbol}</span>
        )}
      </div>

      {/* Bottom-right inverted rank & suit */}
      <div className="flex flex-col items-center leading-none self-end rotate-180">
        <span className="font-black tracking-tighter text-[11px] sm:text-xs md:text-sm">
          {card.label}
        </span>
        <span className="text-[10px] sm:text-xs mt-0.5">{suitSymbol}</span>
      </div>

      {/* Special golden indicator for Heo (Rank 15) */}
      {card.rank === 15 && (
        <div className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-yellow-400 ring-1 ring-yellow-200 animate-pulse shadow" />
      )}
    </button>
  );
};

export const CardBack: React.FC<{ size?: 'sm' | 'md' | 'lg'; count?: number; className?: string }> = ({
  size = 'md',
  count,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-7 h-10 rounded text-[9px]',
    md: 'w-9 h-13 sm:w-11 sm:h-16 md:w-13 md:h-19 rounded-lg text-xs',
    lg: 'w-12 h-17 sm:w-14 sm:h-20 rounded-xl text-sm'
  };

  return (
    <div
      className={`
        relative select-none flex items-center justify-center
        bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-950
        border-2 border-emerald-400/80 shadow-lg text-yellow-300 font-bold
        ${sizeClasses[size]}
        ${className}
      `}
    >
      <div className="absolute inset-0.5 border border-dashed border-emerald-400/40 rounded flex items-center justify-center">
        <span className="opacity-80 text-xs sm:text-sm">🂠</span>
      </div>
      {count !== undefined && (
        <span className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-emerald-950 text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow border border-white">
          {count}
        </span>
      )}
    </div>
  );
};
