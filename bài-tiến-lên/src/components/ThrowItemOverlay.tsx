import React, { useState } from 'react';
import { ThrownItemAction, ThrowItemType } from '../types/game';
import { soundManager } from '../utils/audio';

interface ThrowItemOverlayProps {
  thrownItems: ThrownItemAction[];
  onThrowItem: (targetSeatIndex: number, itemType: ThrowItemType) => void;
  selectedTargetIndex: number | null;
  onCloseMenu: () => void;
}

const ITEMS_CONFIG: { type: ThrowItemType; emoji: string; name: string }[] = [
  { type: 'tomato', emoji: '🍅', name: 'Cà chua' },
  { type: 'slipper', emoji: '🩴', name: 'Dép tổ ong' },
  { type: 'bomb', emoji: '💣', name: 'Quả bom' },
  { type: 'beer', emoji: '🍻', name: 'Cụng bia' },
  { type: 'party', emoji: '🎉', name: 'Pháo giấy' },
  { type: 'heart', emoji: '❤️', name: 'Thả tim' }
];

export const ThrowItemOverlay: React.FC<ThrowItemOverlayProps> = ({
  thrownItems,
  onThrowItem,
  selectedTargetIndex,
  onCloseMenu
}) => {
  return (
    <>
      {/* Active Projectiles in flight */}
      <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
        {thrownItems.map(item => {
          return (
            <div
              key={item.id}
              className="absolute text-3xl sm:text-4xl animate-throw-projectile"
              style={{
                left: `${item.startX}px`,
                top: `${item.startY}px`,
                // Calculate custom translation to target
                '--target-x': `${item.targetX - item.startX}px`,
                '--target-y': `${item.targetY - item.startY}px`
              } as React.CSSProperties}
            >
              {item.itemType === 'tomato' && <span>🍅</span>}
              {item.itemType === 'slipper' && <span>🩴</span>}
              {item.itemType === 'bomb' && <span>💣</span>}
              {item.itemType === 'beer' && <span>🍻</span>}
              {item.itemType === 'party' && <span>🎉</span>}
              {item.itemType === 'heart' && <span>❤️</span>}
            </div>
          );
        })}
      </div>

      {/* Throw Item Selection Wheel/Menu when target seat is clicked */}
      {selectedTargetIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs"
          onClick={onCloseMenu}
        >
          <div
            className="bg-emerald-950 border-2 border-yellow-400 rounded-3xl p-4 shadow-2xl flex flex-col items-center gap-3 animate-scale-in text-white"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between w-full border-b border-white/10 pb-2">
              <h4 className="text-xs sm:text-sm font-black text-yellow-400 uppercase">
                Tương tác vui nhộn
              </h4>
              <button
                type="button"
                onClick={onCloseMenu}
                className="w-6 h-6 rounded-full bg-black/50 hover:bg-black text-slate-300 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-[11px] text-slate-300">
              Chọn vật phẩm ném vào đối thủ:
            </p>

            <div className="grid grid-cols-3 gap-2.5">
              {ITEMS_CONFIG.map(item => (
                <button
                  type="button"
                  key={item.type}
                  onClick={() => {
                    onThrowItem(selectedTargetIndex, item.type);
                    onCloseMenu();
                  }}
                  className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-black/40 hover:bg-yellow-500/20 border border-white/20 hover:border-yellow-400 transition-all cursor-pointer group active:scale-95"
                >
                  <span className="text-2xl sm:text-3xl group-hover:scale-125 transition-transform">
                    {item.emoji}
                  </span>
                  <span className="text-[10px] font-bold text-slate-200 mt-1">
                    {item.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
