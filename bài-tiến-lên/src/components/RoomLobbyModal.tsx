import React, { useState } from 'react';
import { ALL_BOTS, INITIAL_ROOMS } from '../data/bots';
import { BotInfo, GameRoom } from '../types/game';

interface RoomLobbyModalProps {
  isOpen: boolean;
  onStartGame: (selectedBots: BotInfo[], bet: number) => void;
  initialSelectedBots: BotInfo[];
  initialBet: number;
  playerLevel: number;
  playerExp: number;
  playerCoins: number;
  onClose?: () => void;
  canClose?: boolean;
}

export const RoomLobbyModal: React.FC<RoomLobbyModalProps> = ({
  isOpen,
  onStartGame,
  initialSelectedBots,
  initialBet,
  playerLevel,
  playerExp,
  playerCoins,
  onClose,
  canClose = false
}) => {
  const [activeTab, setActiveTab] = useState<'single' | 'rooms' | 'invite'>('single');
  const [selectedBotIds, setSelectedBotIds] = useState<string[]>(
    initialSelectedBots.map(b => b.id)
  );
  const [selectedBet, setSelectedBet] = useState<number>(initialBet);
  const [roomList, setRoomList] = useState<GameRoom[]>(INITIAL_ROOMS);
  const [copiedToast, setCopiedToast] = useState<string | null>(null);

  // New room modal
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [newRoomTitle, setNewRoomTitle] = useState('Bàn VIP của Chủ phòng');
  const [newRoomBet, setNewRoomBet] = useState(10000);
  const [newRoomCode, setNewRoomCode] = useState('TL-' + Math.floor(1000 + Math.random() * 9000));

  if (!isOpen) return null;

  const currentLevelRequiredExp = playerLevel * 200;
  const expPercentage = Math.min(100, (playerExp / currentLevelRequiredExp) * 100);

  const toggleBot = (bot: BotInfo) => {
    // Check if unlocked
    if (playerLevel < bot.unlockLevel) {
      showToast(`🔒 NPC ${bot.name} yêu cầu Cấp ${bot.unlockLevel} để mở khóa!`);
      return;
    }

    if (selectedBotIds.includes(bot.id)) {
      if (selectedBotIds.length > 1) {
        setSelectedBotIds(selectedBotIds.filter(id => id !== bot.id));
      }
    } else {
      if (selectedBotIds.length < 3) {
        setSelectedBotIds([...selectedBotIds, bot.id]);
      } else {
        // replace the oldest selected
        setSelectedBotIds([...selectedBotIds.slice(1), bot.id]);
      }
    }
  };

  const selectRandomUnlocked3 = () => {
    const unlocked = ALL_BOTS.filter(b => playerLevel >= b.unlockLevel);
    const shuffled = [...unlocked].sort(() => 0.5 - Math.random());
    setSelectedBotIds(shuffled.slice(0, 3).map(b => b.id));
  };

  const handleStart = () => {
    const chosenBots = ALL_BOTS.filter(b => selectedBotIds.includes(b.id));
    // Pad with unlocked if needed
    const unlocked = ALL_BOTS.filter(b => playerLevel >= b.unlockLevel);
    while (chosenBots.length < 3) {
      const remaining = unlocked.find(b => !chosenBots.some(c => c.id === b.id));
      if (remaining) chosenBots.push(remaining);
      else break;
    }
    onStartGame(chosenBots.slice(0, 3), selectedBet);
  };

  const showToast = (msg: string) => {
    setCopiedToast(msg);
    setTimeout(() => setCopiedToast(null), 2500);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`Đã sao chép ${label}!`);
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const created: GameRoom = {
      id: 'room-' + Date.now(),
      roomCode: newRoomCode,
      title: newRoomTitle,
      hostName: 'Chủ phòng',
      bet: newRoomBet,
      playerCount: 1,
      maxPlayers: 4,
      status: 'waiting',
      playersList: ['Chủ phòng']
    };
    setRoomList([created, ...roomList]);
    setIsCreatingRoom(false);
    showToast(`Tạo bàn ${newRoomCode} thành công!`);
  };

  const BET_LEVELS = [1000, 5000, 10000, 50000, 100000];
  const inviteLink = typeof window !== 'undefined' && window.location.href.startsWith('http')
    ? window.location.href
    : 'https://ais-pre-6y27x4ha7thmdeci62uf6y-518340074208.asia-southeast1.run.app';

  return (
    <div
      id="room-lobby-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none"
    >
      {/* Toast Notification */}
      {copiedToast && (
        <div className="fixed top-6 z-60 bg-yellow-400 text-emerald-950 px-5 py-2.5 rounded-2xl font-black text-sm shadow-2xl border-2 border-white animate-bounce">
          {copiedToast}
        </div>
      )}

      <div className="relative w-full max-w-4xl bg-emerald-950 border-2 border-emerald-500/40 rounded-3xl shadow-2xl p-4 sm:p-6 text-white max-h-[92vh] flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-yellow-500 flex items-center justify-center text-emerald-950 font-black text-xl shadow-lg border-2 border-white/20">
              🎴
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-yellow-400 uppercase tracking-wide">
                PHÒNG VIP
              </h2>
              <p className="text-xs text-yellow-400">
                Chủ phòng: <span className="text-white font-bold">Bạn</span> • Tiền: <span className="font-mono text-yellow-300">{playerCoins.toLocaleString('vi-VN')} VNĐ</span>
              </p>
            </div>
          </div>

          {canClose && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-slate-200 flex items-center justify-center text-base font-bold cursor-pointer border border-white/10"
            >
              ✕
            </button>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-3 p-1 bg-black/40 rounded-2xl border border-white/10 shrink-0 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('single')}
            className={`flex-1 min-w-[130px] py-2 px-3 rounded-xl text-xs sm:text-sm font-bold uppercase transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'single'
                ? 'bg-yellow-500 text-emerald-950 font-black shadow-lg'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>🤖</span>
            <span>Chơi Đơn (10 NPC)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rooms')}
            className={`flex-1 min-w-[130px] py-2 px-3 rounded-xl text-xs sm:text-sm font-bold uppercase transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'rooms'
                ? 'bg-yellow-500 text-emerald-950 font-black shadow-lg'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>🏛️</span>
            <span>Danh Sách Bàn</span>
            <span className="bg-emerald-800 text-yellow-300 text-[10px] px-1.5 py-0.2 rounded-full">
              {roomList.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('invite')}
            className={`flex-1 min-w-[130px] py-2 px-3 rounded-xl text-xs sm:text-sm font-bold uppercase transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'invite'
                ? 'bg-yellow-500 text-emerald-950 font-black shadow-lg'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>✉️</span>
            <span>Mời Bạn Bè</span>
          </button>
        </div>

        {/* Tab 1: Single Player vs 10 NPCs with Level Unlocks */}
        {activeTab === 'single' && (
          <div className="flex-1 overflow-y-auto mt-4 pr-1 space-y-4">
            {/* Player Level & Progression Card */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-900/80 via-black/40 to-emerald-900/80 border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="w-12 h-12 rounded-2xl bg-yellow-500 flex items-center justify-center text-3xl shadow">
                  👑
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-white">Chủ phòng</span>
                    <span className="bg-yellow-400 text-emerald-950 font-black text-xs px-2 py-0.5 rounded-full shadow">
                      Cấp {playerLevel}
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-300 mt-0.5">
                    Thắng bài & chặt heo để nhận EXP mở khóa thêm NPC cao cấp!
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full sm:w-56 flex flex-col gap-1">
                <div className="flex justify-between text-[11px] font-bold text-slate-300">
                  <span>Tiến trình cấp</span>
                  <span className="text-yellow-400">{playerExp} / {currentLevelRequiredExp} EXP</span>
                </div>
                <div className="w-full h-3 bg-black/60 rounded-full overflow-hidden border border-white/20 p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-500 to-amber-300 rounded-full transition-all duration-500 shadow"
                    style={{ width: `${expPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Stake Selection */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-yellow-400 mb-1.5 flex items-center gap-1.5">
                <span className="font-bold text-yellow-400">₫</span> Chọn mức cược ván bài (VNĐ)
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-1">
                {BET_LEVELS.map(bet => {
                  const isSelected = selectedBet === bet;
                  return (
                    <button
                      type="button"
                      key={bet}
                      onClick={() => setSelectedBet(bet)}
                      className={`
                        p-2 rounded-xl border text-center font-bold transition-all cursor-pointer flex flex-col items-center justify-center
                        ${isSelected
                          ? 'bg-yellow-500 text-emerald-950 border-white ring-2 ring-yellow-400 shadow-lg scale-102 border-b-4 border-yellow-700'
                          : 'bg-emerald-900/60 hover:bg-emerald-800 text-yellow-300 border-emerald-600/30'}
                      `}
                    >
                      <span className="text-sm sm:text-base font-black">{(bet / 1000).toLocaleString('vi-VN')}K</span>
                      <span className={`text-[10px] ${isSelected ? 'text-emerald-950 font-semibold' : 'text-slate-300'}`}>VNĐ/ván</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 10 NPC Roster with Unlock Indicators */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-yellow-400 flex items-center gap-1.5">
                  <span>🤖</span> Chọn 3 đối thủ máy ({selectedBotIds.length}/3 đã chọn)
                </label>
                <button
                  type="button"
                  onClick={selectRandomUnlocked3}
                  className="text-xs text-yellow-300 hover:text-white bg-black/40 hover:bg-black/60 px-3 py-1 rounded-xl border border-white/10 transition cursor-pointer flex items-center gap-1 font-semibold"
                >
                  <span>🎲</span> Ngẫu nhiên 3 máy mở khóa
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                {ALL_BOTS.map(bot => {
                  const isUnlocked = playerLevel >= bot.unlockLevel;
                  const isSelected = selectedBotIds.includes(bot.id);

                  return (
                    <button
                      type="button"
                      key={bot.id}
                      id={`select-bot-${bot.id}`}
                      onClick={() => toggleBot(bot)}
                      className={`
                        relative p-2.5 rounded-2xl border text-left transition-all flex flex-col items-center text-center
                        ${!isUnlocked
                          ? 'bg-black/50 border-slate-700/50 opacity-60 cursor-not-allowed'
                          : isSelected
                          ? 'bg-emerald-900 border-yellow-400 ring-2 ring-yellow-400/60 shadow-xl cursor-pointer'
                          : 'bg-black/30 hover:bg-black/50 border-white/10 opacity-85 cursor-pointer'}
                      `}
                    >
                      {/* Selection Checkmark */}
                      {isUnlocked && isSelected && (
                        <span className="absolute top-1.5 right-1.5 bg-yellow-400 text-emerald-950 w-4 h-4 rounded-full text-[10px] font-black flex items-center justify-center shadow">
                          ✓
                        </span>
                      )}

                      {/* Lock indicator */}
                      {!isUnlocked && (
                        <span className="absolute top-1.5 right-1.5 bg-red-600/90 text-white px-1.5 py-0.2 rounded-full text-[9px] font-bold flex items-center gap-0.5 border border-red-400 shadow">
                          🔒 Cấp {bot.unlockLevel}
                        </span>
                      )}

                      {/* Avatar */}
                      <div className="w-11 h-11 rounded-xl bg-slate-900 flex items-center justify-center text-2xl border-2 border-emerald-400/60 mb-1 shadow">
                        {bot.avatar}
                      </div>

                      {/* Name & Title */}
                      <span className="font-black text-xs text-white">{bot.name}</span>
                      <span className="text-[10px] text-yellow-400 font-semibold truncate w-full">
                        {isUnlocked ? bot.title : `Mở ở Cấp ${bot.unlockLevel}`}
                      </span>

                      {/* Play style tag */}
                      <span className="text-[9px] text-slate-300 mt-1 bg-black/40 px-1.5 py-0.2 rounded-full line-clamp-1 border border-white/5">
                        {bot.playStyle}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Launch Action */}
            <div className="pt-2 flex justify-center">
              <button
                type="button"
                id="btn-start-single-game"
                onClick={handleStart}
                className="w-full max-w-md py-3.5 px-6 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-emerald-950 font-black uppercase text-base sm:text-lg shadow-xl shadow-yellow-500/30 border-b-4 border-yellow-700 active:translate-y-1 active:border-b-0 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>👑</span>
                <span>VÀO BÀN CHƠI NGAY</span>
                <span>⚡</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Rooms Browser */}
        {activeTab === 'rooms' && (
          <div className="flex-1 overflow-y-auto mt-4 pr-1 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-yellow-400 uppercase">
                Danh sách các bàn chơi trực tuyến ({roomList.length})
              </span>
              <button
                type="button"
                onClick={() => setIsCreatingRoom(true)}
                className="px-3.5 py-1.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-emerald-950 font-black text-xs uppercase shadow border-b-2 border-yellow-700 cursor-pointer flex items-center gap-1"
              >
                <span>➕</span>
                <span>Tạo Bàn Mới</span>
              </button>
            </div>

            {/* Room List Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {roomList.map(room => {
                const isFull = room.playerCount >= room.maxPlayers;
                return (
                  <div
                    key={room.id}
                    className="p-3.5 rounded-2xl bg-black/35 border border-white/15 hover:border-yellow-400/50 transition-all flex flex-col justify-between gap-3 shadow-md"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold bg-emerald-900/80 px-2 py-0.5 rounded text-yellow-300 border border-emerald-500/30">
                          {room.roomCode}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            room.status === 'playing'
                              ? 'bg-red-900/60 text-red-300 border border-red-500/40'
                              : 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/40'
                          }`}
                        >
                          {room.status === 'playing' ? '🔴 Đang Đánh' : '🟢 Đang Chờ'}
                        </span>
                      </div>

                      <h4 className="font-black text-sm text-white mt-1.5 line-clamp-1">
                        {room.title}
                      </h4>

                      <div className="flex items-center justify-between text-xs text-slate-300 mt-2">
                        <span>Chủ: <strong className="text-yellow-400">{room.hostName}</strong></span>
                        <span>Mức cược: <strong className="text-yellow-300 font-mono">{(room.bet / 1000).toLocaleString('vi-VN')}K</strong> VNĐ</span>
                      </div>

                      {/* Players count */}
                      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                        <span>Người chơi: {room.playersList.join(', ')}</span>
                        <span className="font-bold text-white">{room.playerCount}/{room.maxPlayers}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isFull}
                      onClick={() => {
                        setSelectedBet(room.bet);
                        setActiveTab('single');
                        showToast(`Đã tham gia bàn ${room.roomCode}!`);
                      }}
                      className={`w-full py-2 rounded-xl text-xs font-black uppercase transition cursor-pointer border-b-2 ${
                        isFull
                          ? 'bg-slate-800 text-slate-500 border-slate-900 cursor-not-allowed'
                          : 'bg-yellow-500 hover:bg-yellow-400 text-emerald-950 border-yellow-700 active:translate-y-0.5'
                      }`}
                    >
                      {isFull ? 'Bàn Đã Đầy' : 'Tham Gia Bàn'}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Create Room Modal form */}
            {isCreatingRoom && (
              <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <form
                  onSubmit={handleCreateRoom}
                  className="bg-emerald-950 border-2 border-yellow-400 rounded-3xl p-5 w-full max-w-md shadow-2xl text-white space-y-3"
                >
                  <h3 className="text-base font-black text-yellow-400 uppercase">Tạo Bàn Chơi Mới</h3>
                  <div>
                    <label className="text-xs text-slate-300">Tên bàn chơi</label>
                    <input
                      type="text"
                      required
                      value={newRoomTitle}
                      onChange={e => setNewRoomTitle(e.target.value)}
                      className="w-full bg-black/40 border border-white/20 rounded-xl px-3 py-2 text-xs text-white mt-1 focus:outline-none focus:border-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-300">Mã phòng tự sinh</label>
                    <input
                      type="text"
                      readOnly
                      value={newRoomCode}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-yellow-300 mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-300">Mức cược (VNĐ)</label>
                    <select
                      value={newRoomBet}
                      onChange={e => setNewRoomBet(Number(e.target.value))}
                      className="w-full bg-black/40 border border-white/20 rounded-xl px-3 py-2 text-xs text-white mt-1 focus:outline-none"
                    >
                      <option value={1000}>1.000 VNĐ</option>
                      <option value={5000}>5.000 VNĐ</option>
                      <option value={10000}>10.000 VNĐ</option>
                      <option value={50000}>50.000 VNĐ</option>
                      <option value={100000}>100.000 VNĐ</option>
                    </select>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsCreatingRoom(false)}
                      className="flex-1 py-2.5 rounded-xl bg-gray-700 hover:bg-gray-600 text-xs font-bold uppercase cursor-pointer"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-emerald-950 text-xs font-black uppercase shadow-lg border-b-2 border-yellow-700 cursor-pointer"
                    >
                      Xác Nhận Tạo
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Invite Friends (Room Code & Links) */}
        {activeTab === 'invite' && (
          <div className="flex-1 overflow-y-auto mt-4 pr-1 space-y-4">
            <div className="p-5 rounded-3xl bg-black/40 border border-white/15 flex flex-col items-center text-center space-y-4 shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-yellow-500 text-emerald-950 flex items-center justify-center text-3xl shadow-lg">
                ✉️
              </div>
              <div>
                <h3 className="text-lg font-black text-white uppercase">Mời Bạn Bè Cùng Chơi</h3>
                <p className="text-xs text-slate-300 max-w-md mt-1">
                  Chia sẻ Mã phòng hoặc Liên kết trực tiếp để bạn bè vào cùng bàn đấu với bạn!
                </p>
              </div>

              {/* Room Code Card */}
              <div className="w-full max-w-sm p-4 rounded-2xl bg-emerald-900/60 border-2 border-yellow-400/80 shadow-lg flex items-center justify-between">
                <div className="text-left">
                  <span className="text-[10px] text-yellow-400 font-bold uppercase tracking-wider">Mã Phòng Đấu</span>
                  <div className="text-2xl font-black font-mono text-white tracking-widest">{newRoomCode}</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(newRoomCode, 'Mã phòng')}
                  className="px-4 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-emerald-950 text-xs font-black uppercase shadow border-b-2 border-yellow-700 cursor-pointer active:scale-95 transition"
                >
                  Sao Chép Mã
                </button>
              </div>

              {/* Invite Link Card - Fully visible break-all */}
              <div className="w-full max-w-md p-4 rounded-2xl bg-black/60 border border-emerald-500/40 text-left space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-yellow-400 uppercase tracking-wider">
                    🌐 Liên kết chia sẻ đầy đủ:
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    Toàn bộ đường dẫn
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-500/20 text-xs font-mono text-emerald-300 break-all select-all leading-relaxed">
                  {inviteLink}
                </div>
                <div className="flex items-center justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => handleCopy(inviteLink, 'toàn bộ liên kết')}
                    className="px-4 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-emerald-950 text-xs font-black uppercase shadow cursor-pointer transition active:scale-95 border-b-2 border-yellow-700 flex items-center gap-1.5"
                  >
                    <span>📋</span>
                    <span>Sao Chép Link Đầy Đủ</span>
                  </button>
                </div>
              </div>

              {/* Social share mock buttons */}
              <div className="pt-2 flex items-center justify-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleCopy(inviteLink, 'Link Zalo')}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer shadow flex items-center gap-1.5"
                >
                  <span>💬</span>
                  <span>Gửi qua Zalo</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy(inviteLink, 'Link Messenger')}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold cursor-pointer shadow flex items-center gap-1.5"
                >
                  <span>⚡</span>
                  <span>Messenger</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const newCode = 'TL-' + Math.floor(1000 + Math.random() * 9000);
                    setNewRoomCode(newCode);
                    showToast(`Đã đổi mã phòng mới: ${newCode}!`);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-yellow-300 text-xs font-bold cursor-pointer border border-white/10 flex items-center gap-1"
                >
                  <span>🔄</span>
                  <span>Đổi Mã Mới</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
