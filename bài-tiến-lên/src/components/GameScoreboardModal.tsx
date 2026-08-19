import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { PlayerState } from '../types/game';

interface GameScoreboardModalProps {
  isOpen: boolean;
  players: PlayerState[];
  baseBet: number;
  onNextRound: () => void;
  onChangeRoom: () => void;
  onOpenLeaderboard: () => void;
  playerLevel: number;
  playerExp: number;
  expGainedLastRound: number;
  newUnlockedBots: string[];
}

export const GameScoreboardModal: React.FC<GameScoreboardModalProps> = ({
  isOpen,
  players,
  baseBet,
  onNextRound,
  onChangeRoom,
  onOpenLeaderboard,
  playerLevel,
  playerExp,
  expGainedLastRound,
  newUnlockedBots
}) => {
  const [expandedPlayerId, setExpandedPlayerId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const winner = players.find(p => p.rankPosition === 1);
      if (winner && winner.role === 'human') {
        try {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.5 }
          });
        } catch {
          // ignore
        }
      }
    }
  }, [isOpen, players]);

  if (!isOpen) return null;

  const sortedPlayers = [...players].sort((a, b) => {
    const rA = a.rankPosition || 99;
    const rB = b.rankPosition || 99;
    return rA - rB;
  });

  const getRankBadge = (pos?: number, isCong = false) => {
    if (isCong) {
      return <span className="bg-red-600 text-white font-black text-xs px-2.5 py-1 rounded-full border border-red-300 shadow">🔥 Cóng / Cháy</span>;
    }
    switch (pos) {
      case 1:
        return <span className="bg-yellow-400 text-emerald-950 font-black text-xs px-2.5 py-1 rounded-full border border-white shadow animate-bounce">🥇 VỀ NHẤT</span>;
      case 2:
        return <span className="bg-slate-200 text-slate-900 font-bold text-xs px-2.5 py-1 rounded-full border border-slate-300 shadow">🥈 VỀ NHÌ</span>;
      case 3:
        return <span className="bg-amber-700 text-amber-100 font-bold text-xs px-2.5 py-1 rounded-full border border-amber-500 shadow">🥉 VỀ BA</span>;
      case 4:
        return <span className="bg-slate-800 text-slate-300 font-medium text-xs px-2.5 py-1 rounded-full border border-slate-600 shadow">💥 VỀ BÉT</span>;
      default:
        return <span className="text-slate-400 text-xs">Chưa xong</span>;
    }
  };

  const currentLevelRequiredExp = playerLevel * 200;

  return (
    <div
      id="scoreboard-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none"
    >
      <div className="relative w-full max-w-3xl bg-emerald-950 border-2 border-emerald-500/40 rounded-3xl shadow-2xl p-4 sm:p-6 text-white max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex flex-col items-center text-center pb-3 border-b border-white/10 shrink-0">
          <div className="text-4xl mb-1">🏆</div>
          <h2 className="text-xl sm:text-2xl font-black text-yellow-400 uppercase tracking-wide">
            KẾT QUẢ & TÍNH ĐIỂM CHI TIẾT
          </h2>
          <p className="text-xs text-emerald-300 mt-0.5">
            Mức cược: <strong className="text-yellow-300">{baseBet.toLocaleString('vi-VN')} VNĐ</strong>
          </p>
        </div>

        {/* Level Up & Unlocked Bots Alert Banner */}
        {newUnlockedBots.length > 0 && (
          <div className="mt-3 p-3 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-emerald-950 font-black text-xs sm:text-sm border-2 border-white shadow-xl flex items-center justify-between animate-bounce shrink-0">
            <span className="flex items-center gap-2">
              <span className="text-xl">🎉</span>
              <span>CHÚC MỪNG! ĐÃ MỞ KHÓA NPC MỚI: <strong>{newUnlockedBots.join(', ')}</strong>!</span>
            </span>
            <span className="bg-emerald-950 text-yellow-300 px-2 py-0.5 rounded-full text-xs font-bold">
              Cấp {playerLevel}
            </span>
          </div>
        )}

        {/* EXP Progress for Human */}
        <div className="mt-3 p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">👑</span>
            <div>
              <span className="font-bold text-xs text-white">Tiến trình Cấp độ Chủ phòng</span>
              <p className="text-[10px] text-yellow-400">
                + {expGainedLastRound} EXP nhận được ván này!
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <span className="text-xs font-bold text-yellow-400 font-mono">
                {playerExp} / {currentLevelRequiredExp} EXP
              </span>
              <div className="w-28 sm:w-36 h-2 bg-slate-900 rounded-full overflow-hidden border border-white/20 mt-1">
                <div
                  className="h-full bg-yellow-400 rounded-full"
                  style={{ width: `${Math.min(100, (playerExp / currentLevelRequiredExp) * 100)}%` }}
                />
              </div>
            </div>
            <span className="bg-yellow-400 text-emerald-950 font-black text-xs px-2 py-1 rounded-xl shadow">
              Lv.{playerLevel}
            </span>
          </div>
        </div>

        {/* Players Detailed Scoreboard List */}
        <div className="flex-1 overflow-y-auto mt-3 space-y-2.5 pr-1 min-h-[180px]">
          {sortedPlayers.map((player) => {
            const isHuman = player.role === 'human';
            const isWinner = player.rankPosition === 1;
            const b = player.scoreBreakdown;
            const isExpanded = expandedPlayerId === player.id;

            return (
              <div
                key={player.id}
                className={`
                  p-3 rounded-2xl border transition-all
                  ${
                    isWinner
                      ? 'bg-yellow-500/15 border-yellow-400 ring-1 ring-yellow-400/50 shadow-lg'
                      : 'bg-black/35 border-white/10'
                  }
                `}
              >
                {/* Main Row */}
                <div className="flex items-center justify-between">
                  {/* Left info */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border-2 border-emerald-400/50 flex items-center justify-center text-2xl shadow">
                      {player.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className={`font-black text-sm ${isHuman ? 'text-yellow-400' : 'text-white'}`}>
                          {player.name}
                        </span>
                        {isHuman && (
                          <span className="text-[9px] bg-yellow-500/20 text-yellow-300 px-1.5 py-0.2 rounded border border-yellow-500/40">
                            Bạn
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-300">
                        Số dư: <strong className="text-yellow-400 font-mono">{player.coins.toLocaleString('vi-VN')}</strong> VNĐ
                      </div>
                    </div>
                  </div>

                  {/* Right: Points + Rank badge */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      {b && (
                        <div className={`text-sm sm:text-base font-black font-mono ${b.totalRoundPoints >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {b.totalRoundPoints >= 0 ? `+${b.totalRoundPoints}` : b.totalRoundPoints} <span className="text-xs font-normal text-slate-300">điểm</span>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => setExpandedPlayerId(isExpanded ? null : player.id)}
                        className="text-[10px] text-yellow-400 underline hover:text-white cursor-pointer font-semibold"
                      >
                        {isExpanded ? 'Ẩn chi tiết ▲' : 'Xem chi tiết ▼'}
                      </button>
                    </div>

                    <div>{getRankBadge(player.rankPosition, player.isCong)}</div>
                  </div>
                </div>

                {/* Expanded Detailed Breakdown */}
                {isExpanded && b && (
                  <div className="mt-2.5 pt-2.5 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-200 bg-black/30 p-2.5 rounded-xl animate-scale-in">
                    <div className="flex justify-between">
                      <span>Về thứ hạng:</span>
                      <strong className={b.rankPoints >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                        {b.rankPoints >= 0 ? `+${b.rankPoints}` : b.rankPoints}đ
                      </strong>
                    </div>

                    <div className="flex justify-between">
                      <span>Thối Heo đen:</span>
                      <strong className={b.thoi2BlackPoints !== 0 ? 'text-red-400' : 'text-slate-400'}>
                        {b.thoi2BlackPoints}đ
                      </strong>
                    </div>

                    <div className="flex justify-between">
                      <span>Thối Heo đỏ:</span>
                      <strong className={b.thoi2RedPoints !== 0 ? 'text-red-400' : 'text-slate-400'}>
                        {b.thoi2RedPoints}đ
                      </strong>
                    </div>

                    <div className="flex justify-between">
                      <span>Thối Tứ quý/Thông:</span>
                      <strong className={b.thoiTuQuyPoints + b.thoiDoiThongPoints !== 0 ? 'text-red-400' : 'text-slate-400'}>
                        {b.thoiTuQuyPoints + b.thoiDoiThongPoints}đ
                      </strong>
                    </div>

                    <div className="flex justify-between">
                      <span>Điểm chặt bài:</span>
                      <strong className={b.chopBonusPoints > 0 ? 'text-emerald-400' : 'text-slate-400'}>
                        +{b.chopBonusPoints}đ
                      </strong>
                    </div>

                    <div className="flex justify-between">
                      <span>Bị chặt đè:</span>
                      <strong className={b.chopVictimPenalty !== 0 ? 'text-red-400' : 'text-slate-400'}>
                        {b.chopVictimPenalty}đ
                      </strong>
                    </div>

                    <div className="flex justify-between">
                      <span>Tới trắng:</span>
                      <strong className={b.toiTrangBonus > 0 ? 'text-yellow-400' : 'text-slate-400'}>
                        +{b.toiTrangBonus}đ
                      </strong>
                    </div>

                    <div className="flex justify-between">
                      <span>EXP thưởng:</span>
                      <strong className="text-yellow-300">+{b.expGained} EXP</strong>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Action Buttons */}
        <div className="mt-4 pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              id="btn-open-leaderboard"
              onClick={onOpenLeaderboard}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-black/40 hover:bg-black/60 text-yellow-400 text-xs sm:text-sm font-bold border border-white/15 cursor-pointer flex items-center justify-center gap-1.5 shadow"
            >
              <span>🏆</span>
              <span>Bảng Xếp Hạng</span>
            </button>

            <button
              type="button"
              id="btn-change-room"
              onClick={onChangeRoom}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gray-700 hover:bg-gray-600 text-white text-xs sm:text-sm font-bold uppercase border-b-2 border-gray-900 cursor-pointer flex items-center justify-center gap-1"
            >
              <span>⚙️</span>
              <span>Phòng Chờ</span>
            </button>
          </div>

          <button
            type="button"
            id="btn-next-round"
            onClick={onNextRound}
            className="w-full sm:w-auto px-7 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-emerald-950 text-xs sm:text-sm font-black uppercase shadow-lg border-b-4 border-yellow-700 active:translate-y-1 active:border-b-0 transition cursor-pointer flex items-center justify-center gap-2"
          >
            <span>🎴</span>
            <span>CHƠI TIẾP VÁN MỚI</span>
            <span>➡️</span>
          </button>
        </div>
      </div>
    </div>
  );
};
