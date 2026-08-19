import React, { useState } from 'react';
import { LeaderboardEntry } from '../types/game';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  leaderboardData: LeaderboardEntry[];
  currentPlayerScore: number;
  currentPlayerLevel: number;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  leaderboardData,
  currentPlayerScore,
  currentPlayerLevel
}) => {
  const [timeTab, setTimeTab] = useState<'weekly' | 'monthly' | 'allTime'>('weekly');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  // Clone and update the current player with real-time score & level
  const entries: LeaderboardEntry[] = leaderboardData.map(item => {
    if (item.isCurrentPlayer) {
      const baseWeekly = item.weeklyScore;
      const baseMonthly = item.monthlyScore;
      const baseAll = item.allTimeScore;
      return {
        ...item,
        level: currentPlayerLevel,
        weeklyScore: baseWeekly + currentPlayerScore,
        monthlyScore: baseMonthly + currentPlayerScore,
        allTimeScore: baseAll + currentPlayerScore
      };
    }
    return item;
  });

  // Sort based on active tab
  const getScore = (entry: LeaderboardEntry) => {
    if (timeTab === 'weekly') return entry.weeklyScore;
    if (timeTab === 'monthly') return entry.monthlyScore;
    return entry.allTimeScore;
  };

  const sortedEntries = [...entries].sort((a, b) => getScore(b) - getScore(a));

  const filteredEntries = sortedEntries.filter(
    e =>
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const top1 = sortedEntries[0];
  const top2 = sortedEntries[1];
  const top3 = sortedEntries[2];

  const myRankIndex = sortedEntries.findIndex(e => e.isCurrentPlayer) + 1;
  const myData = sortedEntries.find(e => e.isCurrentPlayer);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Thần Bài':
        return 'bg-gradient-to-r from-red-600 to-amber-500 text-white border-amber-300';
      case 'Cao Thủ':
        return 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-300';
      case 'Kim Cương':
        return 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-300';
      case 'Bạch Kim':
        return 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white border-teal-300';
      case 'Vàng':
        return 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 border-yellow-300';
      case 'Bạc':
        return 'bg-slate-300 text-slate-900 border-slate-400';
      default:
        return 'bg-amber-800 text-amber-100 border-amber-600';
    }
  };

  return (
    <div
      id="leaderboard-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none"
    >
      <div className="relative w-full max-w-4xl bg-emerald-950 border-2 border-emerald-500/40 rounded-3xl shadow-2xl p-4 sm:p-6 text-white max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-yellow-500 flex items-center justify-center text-2xl shadow-lg border-2 border-white/20">
              🏆
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-yellow-400 uppercase tracking-wide flex items-center gap-2">
                BẢNG XẾP HẠNG CAO THỦ
              </h2>
              <p className="text-xs text-emerald-300">
                Cập nhật liên tục theo Tuần • Tháng • Tổng kết
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-slate-200 flex items-center justify-center text-base font-bold cursor-pointer border border-white/10"
          >
            ✕
          </button>
        </div>

        {/* Time Tabs & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-3 shrink-0">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-2xl border border-white/10 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setTimeTab('weekly')}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-xl text-xs font-bold uppercase transition cursor-pointer ${
                timeTab === 'weekly'
                  ? 'bg-yellow-500 text-emerald-950 shadow-md font-black'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              📅 Tuần Này
            </button>
            <button
              type="button"
              onClick={() => setTimeTab('monthly')}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-xl text-xs font-bold uppercase transition cursor-pointer ${
                timeTab === 'monthly'
                  ? 'bg-yellow-500 text-emerald-950 shadow-md font-black'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              🗓️ Tháng Này
            </button>
            <button
              type="button"
              onClick={() => setTimeTab('allTime')}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-xl text-xs font-bold uppercase transition cursor-pointer ${
                timeTab === 'allTime'
                  ? 'bg-yellow-500 text-emerald-950 shadow-md font-black'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              👑 Toàn Thời Gian
            </button>
          </div>

          {/* Search Input */}
          <div className="w-full sm:w-56">
            <input
              type="text"
              placeholder="🔍 Tìm người chơi / NPC..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-black/30 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-yellow-400"
            />
          </div>
        </div>

        {/* Top 3 Podium (Visual Showcase) */}
        {!searchQuery && sortedEntries.length >= 3 && (
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4 shrink-0 px-2 sm:px-6">
            {/* Top 2 (Silver) */}
            <div className="flex flex-col items-center justify-end p-2 sm:p-3 rounded-2xl bg-gradient-to-t from-slate-900 to-slate-800/80 border border-slate-400/50 shadow-lg relative">
              <div className="absolute -top-3 w-6 h-6 rounded-full bg-slate-300 text-slate-950 font-black text-xs flex items-center justify-center border border-white shadow">
                2
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-900 border-2 border-slate-300 flex items-center justify-center text-2xl sm:text-3xl shadow">
                {top2.avatar}
              </div>
              <span className="font-extrabold text-xs sm:text-sm mt-1.5 text-white truncate max-w-full">
                {top2.name}
              </span>
              <span className="text-[10px] text-slate-300 font-semibold">Lv.{top2.level}</span>
              <div className="mt-1 bg-slate-700/80 px-2 py-0.5 rounded-full text-xs font-mono font-bold text-slate-200">
                {getScore(top2).toLocaleString('vi-VN')} đ
              </div>
            </div>

            {/* Top 1 (Gold - Center & Elevated) */}
            <div className="flex flex-col items-center justify-end p-2.5 sm:p-4 rounded-2xl bg-gradient-to-t from-yellow-950/80 via-yellow-900/50 to-amber-800/60 border-2 border-yellow-400 shadow-xl shadow-yellow-500/20 relative -translate-y-2">
              <div className="absolute -top-4 w-8 h-8 rounded-full bg-yellow-400 text-emerald-950 font-black text-sm flex items-center justify-center border-2 border-white shadow-lg animate-bounce">
                👑
              </div>
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-900 border-4 border-yellow-400 flex items-center justify-center text-3xl sm:text-4xl shadow-lg">
                {top1.avatar}
              </div>
              <span className="font-black text-xs sm:text-base mt-1.5 text-yellow-300 truncate max-w-full">
                {top1.name}
              </span>
              <span className="text-[10px] text-yellow-400 font-semibold">Lv.{top1.level} • {top1.rankTier}</span>
              <div className="mt-1 bg-yellow-500 text-emerald-950 px-2.5 py-0.5 rounded-full text-xs font-mono font-black shadow">
                {getScore(top1).toLocaleString('vi-VN')} đ
              </div>
            </div>

            {/* Top 3 (Bronze) */}
            <div className="flex flex-col items-center justify-end p-2 sm:p-3 rounded-2xl bg-gradient-to-t from-amber-950/90 to-amber-900/60 border border-amber-600/50 shadow-lg relative">
              <div className="absolute -top-3 w-6 h-6 rounded-full bg-amber-600 text-white font-black text-xs flex items-center justify-center border border-white shadow">
                3
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-900 border-2 border-amber-600 flex items-center justify-center text-2xl sm:text-3xl shadow">
                {top3.avatar}
              </div>
              <span className="font-extrabold text-xs sm:text-sm mt-1.5 text-white truncate max-w-full">
                {top3.name}
              </span>
              <span className="text-[10px] text-amber-200 font-semibold">Lv.{top3.level}</span>
              <div className="mt-1 bg-amber-900/80 px-2 py-0.5 rounded-full text-xs font-mono font-bold text-amber-300">
                {getScore(top3).toLocaleString('vi-VN')} đ
              </div>
            </div>
          </div>
        )}

        {/* Scrollable Leaderboard List */}
        <div className="flex-1 overflow-y-auto mt-4 space-y-2 pr-1 min-h-[160px]">
          {filteredEntries.map((entry) => {
            const rank = sortedEntries.findIndex(e => e.id === entry.id) + 1;
            const isMe = entry.isCurrentPlayer;

            return (
              <div
                key={entry.id}
                className={`
                  flex items-center justify-between p-2.5 sm:p-3 rounded-2xl border transition-all
                  ${
                    isMe
                      ? 'bg-yellow-500/20 border-yellow-400 ring-2 ring-yellow-400/50 shadow-lg'
                      : 'bg-black/30 border-white/10 hover:bg-black/40'
                  }
                `}
              >
                {/* Rank Number + Avatar + Info */}
                <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
                  <div className="w-7 text-center font-black text-sm sm:text-base">
                    {rank === 1 && <span className="text-yellow-400 text-lg">🥇</span>}
                    {rank === 2 && <span className="text-slate-300 text-lg">🥈</span>}
                    {rank === 3 && <span className="text-amber-500 text-lg">🥉</span>}
                    {rank > 3 && <span className="text-slate-400 font-mono">#{rank}</span>}
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/20 flex items-center justify-center text-xl shrink-0">
                    {entry.avatar}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`font-black text-xs sm:text-sm truncate ${
                          isMe ? 'text-yellow-300' : 'text-white'
                        }`}
                      >
                        {entry.name}
                      </span>
                      {isMe && (
                        <span className="text-[9px] bg-yellow-400 text-emerald-950 font-bold px-1.5 py-0.2 rounded">
                          Bạn
                        </span>
                      )}
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold border ${getTierColor(
                          entry.rankTier
                        )}`}
                      >
                        {entry.rankTier}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-300 flex items-center gap-2 mt-0.5">
                      <span>Cấp {entry.level}</span>
                      <span>•</span>
                      <span>Thắng: {entry.winCount}/{entry.totalGames} ({Math.round((entry.winCount / Math.max(1, entry.totalGames)) * 100)}%)</span>
                    </div>
                  </div>
                </div>

                {/* Score badge */}
                <div className="text-right shrink-0">
                  <div className="text-sm sm:text-base font-black font-mono text-yellow-400">
                    {getScore(entry).toLocaleString('vi-VN')} <span className="text-xs font-normal text-emerald-300">điểm</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Current Player Sticky Footer Summary */}
        {myData && (
          <div className="mt-3 p-3 rounded-2xl bg-yellow-500/15 border-2 border-yellow-400 flex items-center justify-between shrink-0 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-yellow-500 text-emerald-950 font-black text-xs flex items-center justify-center shadow">
                #{myRankIndex}
              </div>
              <div>
                <span className="text-xs sm:text-sm font-black text-yellow-400">
                  Vị trí của bạn ({myData.name})
                </span>
                <p className="text-[11px] text-slate-300">
                  Cấp độ: <strong>Lv.{currentPlayerLevel}</strong> • Bậc: <strong>{myData.rankTier}</strong>
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-sm sm:text-base font-black font-mono text-yellow-400">
                {getScore(myData).toLocaleString('vi-VN')} đ
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
