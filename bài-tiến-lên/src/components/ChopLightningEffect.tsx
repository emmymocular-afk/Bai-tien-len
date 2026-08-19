import React, { useEffect, useState } from 'react';
import { ChopEvent } from '../types/game';

interface ChopLightningEffectProps {
  chopEvent: ChopEvent | null;
}

export const ChopLightningEffect: React.FC<ChopLightningEffectProps> = ({ chopEvent }) => {
  const [visible, setVisible] = useState(false);
  const [eventData, setEventData] = useState<ChopEvent | null>(null);

  useEffect(() => {
    if (!chopEvent) return;
    setEventData(chopEvent);
    setVisible(true);

    const timer = setTimeout(() => {
      setVisible(false);
    }, 2400);

    return () => clearTimeout(timer);
  }, [chopEvent]);

  if (!visible || !eventData) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden">
      {/* Screen Lightning Flash Overlay */}
      <div className="absolute inset-0 bg-yellow-400/25 animate-ping duration-300" />
      <div className="absolute inset-0 bg-red-600/20 animate-pulse duration-500" />

      {/* SVG Electric Lightning Bolts */}
      <svg className="absolute inset-0 w-full h-full opacity-90" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M 50% 0 L 48% 30% L 54% 45% L 46% 65% L 52% 80% L 50% 100%"
          stroke="#fef08a"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          className="animate-pulse filter drop-shadow-[0_0_15px_#eab308]"
        />
        <path
          d="M 20% 0 L 25% 35% L 45% 50% L 35% 75% L 40% 100%"
          stroke="#f87171"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          className="opacity-70 filter drop-shadow-[0_0_10px_#ef4444]"
        />
        <path
          d="M 80% 0 L 75% 35% L 55% 50% L 65% 75% L 60% 100%"
          stroke="#38bdf8"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          className="opacity-70 filter drop-shadow-[0_0_10px_#0284c7]"
        />
      </svg>

      {/* Flying Gold Coins Streak from Victim to Chopper */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i / 16) * 360;
          const dist = 120 + (i % 4) * 40;
          const rad = (angle * Math.PI) / 180;
          const x = Math.cos(rad) * dist;
          const y = Math.sin(rad) * dist;

          return (
            <div
              key={i}
              className="absolute font-black text-yellow-300 text-lg sm:text-2xl transition-all duration-1000 animate-bounce"
              style={{
                transform: `translate(${x}px, ${y}px)`,
                animationDelay: `${i * 0.05}s`
              }}
            >
              ₫
            </div>
          );
        })}
      </div>

      {/* Center Grand Chop Banner */}
      <div className="relative z-20 flex flex-col items-center justify-center p-6 rounded-3xl bg-gradient-to-r from-red-700 via-amber-600 to-red-700 border-4 border-yellow-300 shadow-[0_0_50px_rgba(234,179,8,0.8)] animate-scale-in text-center max-w-md mx-4">
        <div className="flex items-center gap-2 text-4xl sm:text-5xl animate-bounce mb-1">
          <span>⚡</span>
          <span>💣</span>
          <span>⚡</span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-black text-yellow-200 uppercase tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          {eventData.message}
        </h3>

        <div className="mt-2.5 px-4 py-1.5 rounded-full bg-yellow-400 text-emerald-950 font-black text-sm sm:text-base shadow-xl flex items-center gap-1.5 border-2 border-white animate-pulse">
          <span>THƯỞNG CHẶT:</span>
          <span className="font-mono text-base sm:text-lg text-emerald-950">+{eventData.coins.toLocaleString('vi-VN')} VNĐ</span>
        </div>
      </div>
    </div>
  );
};
