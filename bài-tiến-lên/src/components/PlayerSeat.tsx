import React from 'react';
import { PlayerState } from '../types/game';

interface PlayerSeatProps {
  player: PlayerState;
  isCurrentTurn: boolean;
  position: 'top' | 'left' | 'right' | 'bottom';
  timeLeft?: number;
  maxTime?: number;
  onAvatarClick?: () => void;
}

export const PlayerSeat: React.FC<PlayerSeatProps> = ({
  player,
  isCurrentTurn,
  position,
  timeLeft = 10,
  maxTime = 10,
  onAvatarClick
}) => {
  const isHuman = player.role === 'human';
  const isOneCardLeft = !isHuman && player.cards.length === 1 && !player.rankPosition;
  const isCong = player.isCong;
  const progressPercent = Math.max(0, Math.min(100, (timeLeft / maxTime) * 100));

  // Vibrant border and tag colors by player/bot name
  const getThemeColor = () => {
    if (isHuman) return { border: 'border-yellow-400', bg: 'bg-yellow-500', text: 'text-yellow-950', ring: 'ring-yellow-400' };
    switch (player.name) {
      case 'Nhân':
        return { border: 'border-emerald-500', bg: 'bg-emerald-500', text: 'text-white', ring: 'ring-emerald-400' };
      case 'Nghĩa':
        return { border: 'border-blue-400', bg: 'bg-blue-400', text: 'text-white', ring: 'ring-blue-400' };
      case 'Lễ':
        return { border: 'border-purple-400', bg: 'bg-purple-400', text: 'text-white', ring: 'ring-purple-400' };
      case 'Trí':
        return { border: 'border-amber-400', bg: 'bg-amber-400', text: 'text-slate-950', ring: 'ring-amber-400' };
      case 'Tín':
        return { border: 'border-cyan-400', bg: 'bg-cyan-400', text: 'text-slate-950', ring: 'ring-cyan-400' };
      case 'Phúc':
        return { border: 'border-rose-400', bg: 'bg-rose-400', text: 'text-white', ring: 'ring-rose-400' };
      case 'Lộc':
        return { border: 'border-teal-400', bg: 'bg-teal-400', text: 'text-white', ring: 'ring-teal-400' };
      case 'Thọ':
        return { border: 'border-orange-400', bg: 'bg-orange-400', text: 'text-white', ring: 'ring-orange-400' };
      case 'Tài':
        return { border: 'border-yellow-300', bg: 'bg-yellow-400', text: 'text-slate-950', ring: 'ring-yellow-300' };
      case 'Lợi':
        return { border: 'border-indigo-400', bg: 'bg-indigo-400', text: 'text-white', ring: 'ring-indigo-400' };
      default:
        return { border: 'border-emerald-500', bg: 'bg-emerald-500', text: 'text-white', ring: 'ring-emerald-400' };
    }
  };

  const theme = getThemeColor();

  // Determine ranking badge
  const getRankBadge = () => {
    if (!player.rankPosition) return null;
    switch (player.rankPosition) {
      case 1:
        return <span className="bg-yellow-400 text-emerald-950 font-black text-[10px] px-2 py-0.2 rounded-full border border-white shadow-md animate-bounce">🥇 Nhất</span>;
      case 2:
        return <span className="bg-slate-200 text-slate-900 font-bold text-[10px] px-2 py-0.2 rounded-full border border-slate-300 shadow">🥈 Nhì</span>;
      case 3:
        return <span className="bg-amber-700 text-amber-100 font-bold text-[10px] px-2 py-0.2 rounded-full border border-amber-500 shadow">🥉 Ba</span>;
      case 4:
        return player.isCong ? (
          <span className="bg-red-600 text-white font-black text-[10px] px-2 py-0.2 rounded-full border border-red-300 shadow animate-pulse">🔥 Cóng</span>
        ) : (
          <span className="bg-slate-800 text-slate-300 font-medium text-[10px] px-2 py-0.2 rounded-full border border-slate-600 shadow">💥 Bét</span>
        );
      default:
        return null;
    }
  };

  return (
    <div
      id={`seat-${player.id}`}
      className={`
        relative flex flex-col items-center select-none z-20 transition-all
        ${position === 'left' ? 'scale-90 sm:scale-95' : ''}
        ${position === 'right' ? 'scale-90 sm:scale-95' : ''}
        ${position === 'top' ? 'scale-90 sm:scale-95' : ''}
      `}
    >
      {/* Speech bubble reaction */}
      {player.reaction && (
        <div
          className={`
            absolute z-50 bg-black/85 backdrop-blur-md text-white px-2.5 py-1 rounded-xl shadow-xl border border-yellow-400 text-[11px] font-bold
            animate-bounce pointer-events-none flex items-center gap-1 whitespace-nowrap
            ${position === 'top' ? 'top-16' : ''}
            ${position === 'bottom' ? '-top-10' : ''}
            ${position === 'left' ? '-top-8 left-2' : ''}
            ${position === 'right' ? '-top-8 right-2' : ''}
          `}
        >
          {player.reaction.emoji && <span className="text-sm">{player.reaction.emoji}</span>}
          {player.reaction.text && <span>{player.reaction.text}</span>}
        </div>
      )}

      {/* Avatar Container with Compact Frame */}
      <div className="relative flex flex-col items-center group">
        {/* Turn Countdown Ring */}
        {isCurrentTurn && (
          <svg className="absolute -inset-1.5 w-[calc(100%+12px)] h-[calc(100%+12px)] -rotate-90 pointer-events-none z-20">
            <circle
              cx="50%"
              cy="50%"
              r="46%"
              className="stroke-yellow-400"
              strokeWidth="3"
              fill="transparent"
              strokeDasharray="240"
              strokeDashoffset={240 - (240 * progressPercent) / 100}
              strokeLinecap="round"
            />
          </svg>
        )}

        {/* Compact avatar box */}
        <div
          onClick={onAvatarClick}
          className={`
            w-11 h-11 sm:w-13 sm:h-13 md:w-15 md:h-15 rounded-xl bg-slate-900 border-3 ${theme.border}
            overflow-hidden shadow-xl relative flex items-center justify-center transition-transform
            ${!isHuman && onAvatarClick ? 'cursor-pointer hover:scale-110 active:scale-95' : ''}
            ${isCurrentTurn ? `scale-105 ring-3 ${theme.ring}/50 shadow-yellow-500/40` : ''}
            ${isOneCardLeft ? 'ring-4 ring-red-500/80 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.7)]' : ''}
            ${isCong ? 'border-sky-300 ring-4 ring-cyan-400/60 bg-blue-950/80' : ''}
          `}
        >
          <span className="text-xl sm:text-2xl md:text-2xl filter drop-shadow">
            {player.avatar || (isHuman ? '👑' : '🤖')}
          </span>

          {/* Sub-label tag across bottom */}
          <div className={`absolute bottom-0 w-full ${theme.bg}/95 ${theme.text} text-[9px] sm:text-[10px] text-center font-black py-0.2 uppercase tracking-tight truncate px-0.5`}>
            {player.name}
          </div>

          {/* Turn timer badge */}
          {isCurrentTurn && (
            <div className="absolute top-0.5 right-0.5 bg-red-600 text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-white shadow">
              {timeLeft}
            </div>
          )}

          {/* Freeze ice icicles overlay if Cóng */}
          {isCong && (
            <div className="absolute inset-0 bg-cyan-500/30 backdrop-blur-xs flex items-center justify-center animate-freeze-glitter pointer-events-none">
              <span className="text-lg">🧊</span>
            </div>
          )}
        </div>

        {/* Cards Left / Status Pills */}
        <div className="mt-1 flex flex-col items-center gap-0.5">
          {/* Danger 1 Card Alert */}
          {isOneCardLeft && (
            <div className="bg-red-600 text-white font-black text-[9px] px-2 py-0.5 rounded-full border border-yellow-300 shadow-lg animate-bounce flex items-center gap-0.5">
              <span>⚠️</span>
              <span>BÁO 1 LÁ!</span>
            </div>
          )}

          {!isHuman && !player.rankPosition && !isOneCardLeft && (
            <div className="bg-black/60 backdrop-blur-xs border border-white/15 px-2 py-0.2 rounded-full text-[10px] font-bold text-emerald-300 shadow">
              {player.cards.length} lá
            </div>
          )}

          {/* Ranking or Passed Pill */}
          {getRankBadge()}
          {player.hasPassed && !player.rankPosition && (
            <span className="bg-gray-700/90 text-gray-200 text-[9px] font-bold px-1.5 py-0.2 rounded-full border border-gray-500 shadow">
              Bỏ lượt
            </span>
          )}

          {/* Coin balance */}
          <div className="bg-emerald-950/80 border border-emerald-500/30 px-1.5 py-0.2 rounded-full text-[9px] sm:text-[10px] font-mono text-yellow-300 flex items-center gap-0.5 shadow">
            <span className="font-bold text-yellow-400">₫</span>
            <span>{player.coins.toLocaleString('vi-VN')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
