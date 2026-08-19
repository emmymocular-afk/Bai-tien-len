import React from 'react';
import { ChopEvent, PlayedCombo } from '../types/game';
import { getComboName } from '../utils/tienlenEngine';
import { CardView } from './CardView';

interface TableCenterProps {
  currentCombo: PlayedCombo | null;
  lastChopEvent: ChopEvent | null;
  currentTurnName: string;
  baseBet: number;
  roundNumber: number;
}

export const TableCenter: React.FC<TableCenterProps> = ({
  currentCombo,
  lastChopEvent,
  currentTurnName,
  baseBet,
  roundNumber
}) => {
  return (
    <div className="relative flex flex-col items-center justify-center w-full min-h-[180px] sm:min-h-[220px] pointer-events-none">
      {/* Stadium Shaped Felt Border from Vibrant Palette design */}
      <div className="w-full max-w-[680px] h-[170px] sm:h-[210px] border-[6px] sm:border-[8px] border-emerald-800/50 rounded-[60px] sm:rounded-[80px] relative flex flex-col items-center justify-center bg-emerald-900/30 shadow-inner backdrop-blur-xs px-4">
        
        {/* Table Top Stakes & Round Info */}
        <div className="absolute top-2.5 flex items-center gap-2 bg-black/50 border border-white/15 backdrop-blur-md px-3.5 py-0.5 rounded-full text-[11px] text-white pointer-events-auto shadow-md">
          <span className="font-bold text-yellow-400">Ván #{roundNumber}</span>
          <span className="text-white/30">•</span>
          <span className="text-white font-mono flex items-center gap-1">
            <span className="text-yellow-400 font-bold">₫</span> {baseBet.toLocaleString('vi-VN')} VNĐ
          </span>
        </div>

        {/* Chop Event Toast Animation */}
        {lastChopEvent && (
          <div
            id="chop-alert"
            className="absolute -top-5 z-50 animate-bounce bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 text-white font-black text-xs px-4 py-1.5 rounded-xl shadow-2xl border border-yellow-300 flex items-center gap-1.5"
          >
            <span className="text-base">💣</span>
            <span>{lastChopEvent.message}</span>
            <span className="bg-yellow-400 text-emerald-950 px-1.5 py-0.2 rounded-full text-[10px] font-black">
              +{lastChopEvent.coins.toLocaleString('vi-VN')} VNĐ
            </span>
          </div>
        )}

        {/* Played Cards Area with Card Slam & Motion Trail FX */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full">
          {currentCombo ? (
            <div key={currentCombo.cards.map(c => c.id).join('-')} className="flex flex-col items-center animate-card-slam">
              {/* Combo Name Tag & Player Tag */}
              <div className="mb-2 flex items-center gap-1.5 bg-black/75 border border-yellow-400 text-yellow-300 px-3.5 py-0.5 rounded-full text-[11px] font-black shadow-xl backdrop-blur-md">
                <span className="text-white font-bold">{currentCombo.playerName}:</span>
                <span className="text-yellow-300">{getComboName(currentCombo)}</span>
              </div>

              {/* Overlapping Cards Stack/Fan with glowing aura */}
              <div className="relative flex items-center justify-center -space-x-4 sm:-space-x-6 max-w-full overflow-x-auto py-1">
                {/* Motion glow background aura */}
                <div className="absolute inset-0 bg-yellow-400/20 blur-xl rounded-full pointer-events-none" />

                {currentCombo.cards.map((card, idx) => {
                  const offset = idx - (currentCombo.cards.length - 1) / 2;
                  const rotation = offset * 3.5;
                  return (
                    <CardView
                      key={card.id}
                      card={card}
                      size="md"
                      rotation={rotation}
                      disabled
                      className="shadow-2xl hover:translate-y-0 filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
                    />
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-2 text-emerald-300/80 text-xs sm:text-sm font-medium">
              <span className="text-2xl mb-0.5 opacity-85">🎴</span>
              <span>Đang chờ <strong className="text-yellow-400 font-bold">{currentTurnName}</strong> ra bài</span>
            </div>
          )}
        </div>

        {/* Bottom table watermark */}
        <div className="absolute bottom-2 text-emerald-400/40 uppercase tracking-widest text-[9px] sm:text-[10px] font-bold pointer-events-none">
          Tiến Lên
        </div>
      </div>
    </div>
  );
};
