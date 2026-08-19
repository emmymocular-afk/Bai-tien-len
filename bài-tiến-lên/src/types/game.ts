export type Suit = 'spades' | 'clubs' | 'diamonds' | 'hearts'; // Bích (♠) < Chuồn (♣) < Rô (♦) < Cơ (♥)

export type Rank = 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;
// 11 = J, 12 = Q, 13 = K, 14 = A, 15 = 2 (Heo)

export interface Card {
  id: string;
  suit: Suit;
  rank: Rank;
  label: string; // "3", "4", ..., "10", "J", "Q", "K", "A", "2"
  color: 'black' | 'red';
  value: number; // calculated for sorting: (rank * 4) + suitValue
}

export type ComboType =
  | 'single' // Rác
  | 'pair' // Đôi
  | 'triple' // Sám cô (3 lá)
  | 'straight' // Sảnh (3+ lá liên tiếp, không chứa 2)
  | 'four_of_a_kind' // Tứ quý (4 lá cùng số)
  | 'three_pair_straight' // 3 đôi thông
  | 'four_pair_straight' // 4 đôi thông
  | 'invalid';

export interface PlayedCombo {
  type: ComboType;
  cards: Card[];
  highestCard: Card;
  length: number;
  playerId: string;
  playerName: string;
}

export type PlayerRole = 'human' | 'bot';

export interface BotInfo {
  id: string;
  name: string;
  avatar: string;
  title: string;
  personality: string;
  winRate: string;
  bio: string;
  color: string;
  unlockLevel: number; // Level required to unlock in single player mode
  playStyle: string; // e.g. "Giữ heo", "Săn hàng", "Xả rác", "Đánh chắc"
}

export interface ScoreBreakdown {
  rankPoints: number; // Nhất +100, Nhì +30, Ba -30, Bét -60, Cóng -100
  thoi2BlackPoints: number; // -15 per black 2
  thoi2RedPoints: number; // -30 per red 2
  thoiTuQuyPoints: number; // -50 per 4-of-a-kind
  thoiDoiThongPoints: number; // -40 for 3-pairs, -60 for 4-pairs
  chopBonusPoints: number; // Points gained from chopping
  chopVictimPenalty: number; // Points lost from being chopped
  toiTrangBonus: number; // +150 for instant win
  totalRoundPoints: number; // Net round points
  expGained: number; // EXP gained this round
}

export interface PlayerState {
  id: string;
  name: string;
  role: PlayerRole;
  avatar: string;
  cards: Card[];
  coins: number;
  isReady: boolean;
  hasPassed: boolean;
  rankPosition?: number; // 1 (Nhất), 2 (Nhì), 3 (Ba), 4 (Bét)
  isCong?: boolean; // Cóng/Cháy bài (chưa đánh lá nào)
  penaltyCoins?: number;
  scoreBreakdown?: ScoreBreakdown;
  reaction?: {
    text?: string;
    emoji?: string;
    expiresAt: number;
  };
}

export type GamePhase = 'lobby' | 'dealing' | 'playing' | 'round_end';

export interface GameLog {
  id: string;
  text: string;
  timestamp: string;
  type: 'play' | 'pass' | 'chop' | 'win' | 'info';
}

export interface ChopEvent {
  chopperName: string;
  victimName: string;
  coins: number;
  message: string;
  timestamp: number;
}

export type RankTier =
  | 'Tập Sự'
  | 'Đồng'
  | 'Bạc'
  | 'Vàng'
  | 'Bạch Kim'
  | 'Kim Cương'
  | 'Cao Thủ'
  | 'Thần Bài';

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  title: string;
  level: number;
  weeklyScore: number;
  monthlyScore: number;
  allTimeScore: number;
  winCount: number;
  totalGames: number;
  rankTier: RankTier;
  isCurrentPlayer?: boolean;
}

export interface GameRoom {
  id: string;
  roomCode: string;
  title: string;
  hostName: string;
  bet: number;
  playerCount: number;
  maxPlayers: number;
  status: 'waiting' | 'playing';
  hasPassword?: boolean;
  playersList: string[];
}

export type ThrowItemType = 'tomato' | 'slipper' | 'bomb' | 'beer' | 'party' | 'heart';

export interface ThrownItemAction {
  id: string;
  fromIndex: number;
  toIndex: number;
  itemType: ThrowItemType;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  createdAt: number;
}
