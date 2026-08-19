import React, { useEffect, useState } from 'react';
import { soundManager } from '../utils/audio';

interface CardDealingAnimationProps {
  onComplete: () => void;
}

export const CardDealingAnimation: React.FC<CardDealingAnimationProps> = ({ onComplete }) => {
  const [dealStep, setDealStep] = useState(0);

  useEffect(() => {
    // Sequence of card dealing ticks
    const interval = setInterval(() => {
      setDealStep(prev => {
        if (prev >= 12) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 300);
          return prev;
        }
        soundManager.playCardDeal();
        return prev + 1;
      });
    }, 60);

    return () => clearInterval(interval);
  }, [onComplete]);

  // Target seat directions: [0: Human Bottom, 1: Bot1 Top-Left, 2: Bot2 Top-Center, 3: Bot3 Top-Right]
  const targetOffsets = [
    { x: 0, y: 160 },   // Human bottom
    { x: -140, y: -130 }, // Bot 1 Left
    { x: 0, y: -140 },    // Bot 2 Center
    { x: 140, y: -130 }   // Bot 3 Right
  ];

  return (
    <div className="fixed inset-0 z-40 pointer-events-none flex items-center justify-center">
      {/* Central Deck */}
      <div className="relative w-16 h-24 bg-gradient-to-br from-red-800 to-red-950 rounded-xl border-2 border-yellow-400 shadow-2xl flex items-center justify-center">
        <div className="w-12 h-20 border border-yellow-400/40 rounded-lg flex items-center justify-center">
          <span className="text-yellow-400 font-bold text-xs">TIẾN LÊN</span>
        </div>
      </div>

      {/* Flying Cards */}
      {Array.from({ length: dealStep * 4 }).map((_, i) => {
        const seatIndex = i % 4;
        const target = targetOffsets[seatIndex];
        const delay = (i * 0.02).toFixed(2);

        return (
          <div
            key={i}
            className="absolute w-12 h-18 bg-gradient-to-br from-amber-700 to-red-900 border border-yellow-300 rounded-lg shadow-lg transition-all duration-300 ease-out"
            style={{
              transform: `translate(${target.x}px, ${target.y}px) rotate(${(i % 6) * 10 - 25}deg) scale(0.9)`,
              opacity: 0.9,
              transitionDelay: `${delay}s`
            }}
          />
        );
      })}

      {/* Center dealing indicator */}
      <div className="absolute -bottom-16 bg-black/60 backdrop-blur-md px-4 py-1 rounded-full border border-yellow-400/40 text-yellow-300 text-xs font-bold animate-pulse">
        🎴 Đang chia bài...
      </div>
    </div>
  );
};
