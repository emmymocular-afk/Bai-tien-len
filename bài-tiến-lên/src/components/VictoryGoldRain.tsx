import React, { useEffect } from 'react';
import { soundManager } from '../utils/audio';

interface VictoryGoldRainProps {
  winnerName: string;
  isHumanWinner: boolean;
  bonusCoins?: number;
  onClose?: () => void;
}

export const VictoryGoldRain: React.FC<VictoryGoldRainProps> = ({
  winnerName,
  isHumanWinner,
  bonusCoins = 0
}) => {
  useEffect(() => {
    soundManager.playWin();
    soundManager.playFireworks();

    const timer1 = setTimeout(() => {
      soundManager.playCoins();
    }, 400);

    const timer2 = setTimeout(() => {
      soundManager.playFireworks();
    }, 1200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // Generate confetti and gold coins
  const goldCoins = Array.from({ length: 35 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 1.5,
    duration: 2 + Math.random() * 2,
    size: 16 + Math.random() * 18,
    symbol: i % 3 === 0 ? '₫' : i % 3 === 1 ? '🪙' : '✨'
  }));

  const confettiPieces = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2.5 + Math.random() * 1.5,
    color: ['#fbbf24', '#ef4444', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6'][i % 6]
  }));

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex flex-col items-center justify-center overflow-hidden">
      {/* Background celebration glow */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" />

      {/* Confetti Rain */}
      {confettiPieces.map(c => (
        <div
          key={`confetti-${c.id}`}
          className="absolute top-0 w-2.5 h-4 rounded-xs animate-fall"
          style={{
            left: `${c.left}%`,
            backgroundColor: c.color,
            animationDelay: `${c.delay}s`,
            animationDuration: `${c.duration}s`,
            animationIterationCount: 'infinite'
          }}
        />
      ))}

      {/* Falling Gold Coins */}
      {goldCoins.map(coin => (
        <div
          key={`coin-${coin.id}`}
          className="absolute top-0 font-black text-yellow-300 animate-fall select-none drop-shadow-[0_2px_8px_rgba(234,179,8,0.8)]"
          style={{
            left: `${coin.left}%`,
            fontSize: `${coin.size}px`,
            animationDelay: `${coin.delay}s`,
            animationDuration: `${coin.duration}s`,
            animationIterationCount: 'infinite'
          }}
        >
          {coin.symbol}
        </div>
      ))}

      {/* Victory Celebration Trophy Box */}
      <div className="relative z-20 flex flex-col items-center bg-gradient-to-b from-yellow-500 via-amber-600 to-yellow-700 p-6 sm:p-8 rounded-3xl border-4 border-yellow-200 shadow-[0_0_60px_rgba(234,179,8,0.9)] text-center text-emerald-950 animate-scale-in max-w-sm sm:max-w-md mx-4">
        <div className="text-5xl sm:text-6xl mb-2 animate-bounce">
          {isHumanWinner ? '🏆' : '👑'}
        </div>

        <div className="px-4 py-1 rounded-full bg-white/90 font-black text-xs sm:text-sm uppercase tracking-widest text-emerald-900 shadow">
          {isHumanWinner ? 'BẠN ĐÃ TỚI NHẤT!' : 'NGƯỜI CHIẾN THẮNG'}
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider drop-shadow-md mt-2">
          {winnerName}
        </h2>

        {bonusCoins > 0 && (
          <div className="mt-3 px-4 py-1.5 rounded-2xl bg-emerald-950/90 text-yellow-300 border border-yellow-400 font-mono font-black text-base sm:text-lg flex items-center gap-1.5 shadow-xl animate-pulse">
            <span>+{bonusCoins.toLocaleString('vi-VN')}</span>
            <span className="text-white">VNĐ</span>
          </div>
        )}

        <p className="mt-2 text-xs font-bold text-yellow-100 opacity-90">
          {isHumanWinner ? '🎉 Xuất sắc! Thắng đậm ván này!' : 'Ván bài đã kết thúc!'}
        </p>
      </div>
    </div>
  );
};
