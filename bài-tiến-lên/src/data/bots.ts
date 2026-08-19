import { BotInfo, GameRoom, LeaderboardEntry } from '../types/game';

export const ALL_BOTS: BotInfo[] = [
  {
    id: 'bot-nhan',
    name: 'Nhân',
    avatar: '👨‍💼',
    title: 'Cao Thủ Trầm Tĩnh',
    personality: 'Thích nhử bài, giữ heo đến phút chót',
    winRate: '68%',
    bio: 'Luôn đề cao lòng nhân từ nhưng trên chiếu bạc thì không bao giờ nương tay!',
    color: 'from-emerald-600 to-teal-800',
    unlockLevel: 1,
    playStyle: 'Điềm đạm & Giữ heo'
  },
  {
    id: 'bot-nghia',
    name: 'Nghĩa',
    avatar: '🥷',
    title: 'Đại Hiệp Nghĩa Khí',
    personality: 'Đánh dứt khoát, thường xuyên phá sảnh',
    winRate: '72%',
    bio: 'Trượng nghĩa giang hồ, chuyên canh chặt heo của người chơi cóng.',
    color: 'from-blue-600 to-indigo-800',
    unlockLevel: 1,
    playStyle: 'Khí phách & Săn hàng'
  },
  {
    id: 'bot-le',
    name: 'Lễ',
    avatar: '🤵',
    title: 'Công Tử Lịch Thiệp',
    personality: 'Thích xả rác nhỏ, bài bản quy củ',
    winRate: '65%',
    bio: 'Điềm đạm, khiêm nhường nhưng một khi đã ra tay là tới bến.',
    color: 'from-purple-600 to-violet-800',
    unlockLevel: 1,
    playStyle: 'Quy củ & Xả rác'
  },
  {
    id: 'bot-tri',
    name: 'Trí',
    avatar: '🧙‍♂️',
    title: 'Mưu Sĩ Kỳ Tài',
    personality: 'Tính toán từng lá, nhớ bài siêu đẳng',
    winRate: '78%',
    bio: 'Thuộc hết từng cây bài đã ra trên bàn, đọc vị đối thủ tuyệt đỉnh.',
    color: 'from-amber-600 to-yellow-800',
    unlockLevel: 2,
    playStyle: 'Chiến thuật gia & Nhớ bài'
  },
  {
    id: 'bot-tin',
    name: 'Tín',
    avatar: '🤴',
    title: 'Uy Tín Vô Song',
    personality: 'Đánh chắc thắng chắc, giữ thế chủ động',
    winRate: '70%',
    bio: 'Giữ chữ tín hàng đầu, đã đánh là không bao giờ bỏ cuộc.',
    color: 'from-cyan-600 to-blue-900',
    unlockLevel: 3,
    playStyle: 'Chắc chắn & Giữ thế'
  },
  {
    id: 'bot-phuc',
    name: 'Phúc',
    avatar: '👳‍♂️',
    title: 'Phúc Tinh Chiếu Mệnh',
    personality: 'Bài lúc nào cũng son, chuyên sảnh rồng',
    winRate: '74%',
    bio: 'Vận may ngút trời, hay bốc được đôi thông và tứ quý bất ngờ.',
    color: 'from-rose-600 to-red-800',
    unlockLevel: 5,
    playStyle: 'May mắn & Sảnh lớn'
  },
  {
    id: 'bot-loc',
    name: 'Lộc',
    avatar: '🎅',
    title: 'Tài Lộc Dồi Dào',
    personality: 'Đánh lớn, hay ép đối thủ ra heo',
    winRate: '71%',
    bio: 'Có lộc ăn chặt, túi tiền rủng rỉnh lúc nào cũng sẵn sàng cược lớn.',
    color: 'from-green-600 to-emerald-900',
    unlockLevel: 7,
    playStyle: 'Ép heo & Cược lớn'
  },
  {
    id: 'bot-tho',
    name: 'Thọ',
    avatar: '👴',
    title: 'Lão Làng Bất Tử',
    personality: 'Thủ thế kiên cường, thoát cóng cực khéo',
    winRate: '69%',
    bio: 'Gừng càng già càng cay, không dễ gì bị chặt đè.',
    color: 'from-orange-600 to-amber-900',
    unlockLevel: 10,
    playStyle: 'Lão làng & Thoát cóng'
  },
  {
    id: 'bot-tai',
    name: 'Tài',
    avatar: '🤠',
    title: 'Thần Tài Lộ Diện',
    personality: 'Lối đánh phóng khoáng, biến hóa khôn lường',
    winRate: '75%',
    bio: 'Tay bài tài hoa xuất chúng, biến bài rác thành sảnh thần thánh.',
    color: 'from-yellow-500 to-amber-700',
    unlockLevel: 12,
    playStyle: 'Biến hóa & Ảo diệu'
  },
  {
    id: 'bot-loi',
    name: 'Lợi',
    avatar: '🕵️',
    title: 'Thương Gia Tinh Quái',
    personality: 'Chuyên nhử heo để đồng bọn chặt',
    winRate: '66%',
    bio: 'Tính toán lợi ích từng ván, nhạy bén chớp thời cơ về nhất.',
    color: 'from-slate-600 to-zinc-800',
    unlockLevel: 15,
    playStyle: 'Sát phạt & Nhử mồi'
  }
];

export const INITIAL_ROOMS: GameRoom[] = [
  {
    id: 'room-1',
    roomCode: 'TL-8868',
    title: '👑 Bàn VIP Sát Phạt Đại Chiến',
    hostName: 'Chủ phòng',
    bet: 10000,
    playerCount: 1,
    maxPlayers: 4,
    status: 'waiting',
    playersList: ['Chủ phòng']
  },
  {
    id: 'room-2',
    roomCode: 'TL-9912',
    title: '🔥 Săn Heo Vàng - Trí & Tín',
    hostName: 'Trí (Mưu Sĩ)',
    bet: 50000,
    playerCount: 3,
    maxPlayers: 4,
    status: 'waiting',
    playersList: ['Trí', 'Tín', 'Phúc']
  },
  {
    id: 'room-3',
    roomCode: 'TL-3341',
    title: '✨ Bàn Tập Sự Vui Vẻ',
    hostName: 'Nhân (Cao Thủ)',
    bet: 1000,
    playerCount: 2,
    maxPlayers: 4,
    status: 'waiting',
    playersList: ['Nhân', 'Lễ']
  },
  {
    id: 'room-4',
    roomCode: 'TL-7722',
    title: '💎 Đấu Trường Cao Thủ 100K',
    hostName: 'Tài (Thần Bài)',
    bet: 100000,
    playerCount: 4,
    maxPlayers: 4,
    status: 'playing',
    hasPassword: true,
    playersList: ['Tài', 'Lộc', 'Thọ', 'Lợi']
  },
  {
    id: 'room-5',
    roomCode: 'TL-5509',
    title: '🎲 Chặt Đôi Thông Không Khoan Nhượng',
    hostName: 'Nghĩa (Đại Hiệp)',
    bet: 5000,
    playerCount: 2,
    maxPlayers: 4,
    status: 'waiting',
    playersList: ['Nghĩa', 'Lộc']
  },
  {
    id: 'room-6',
    roomCode: 'TL-1288',
    title: '🍀 Phúc Lộc Thọ Chiếu Mệnh',
    hostName: 'Phúc',
    bet: 50000,
    playerCount: 3,
    maxPlayers: 4,
    status: 'waiting',
    playersList: ['Phúc', 'Lộc', 'Thọ']
  }
];

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: 'lb-1',
    name: 'Trí',
    avatar: '🧙‍♂️',
    title: 'Mưu Sĩ Kỳ Tài',
    level: 18,
    weeklyScore: 2840,
    monthlyScore: 11950,
    allTimeScore: 48900,
    winCount: 142,
    totalGames: 180,
    rankTier: 'Thần Bài'
  },
  {
    id: 'lb-2',
    name: 'Tài',
    avatar: '🤠',
    title: 'Thần Tài Lộ Diện',
    level: 16,
    weeklyScore: 2610,
    monthlyScore: 10820,
    allTimeScore: 43200,
    winCount: 128,
    totalGames: 170,
    rankTier: 'Cao Thủ'
  },
  {
    id: 'lb-3',
    name: 'Phúc',
    avatar: '👳‍♂️',
    title: 'Phúc Tinh Chiếu Mệnh',
    level: 14,
    weeklyScore: 2350,
    monthlyScore: 9780,
    allTimeScore: 39500,
    winCount: 115,
    totalGames: 160,
    rankTier: 'Cao Thủ'
  },
  {
    id: 'lb-human',
    name: 'Chủ phòng',
    avatar: '👑',
    title: 'Chủ Phòng Chiến Tướng',
    level: 1,
    weeklyScore: 1250,
    monthlyScore: 4800,
    allTimeScore: 18500,
    winCount: 42,
    totalGames: 60,
    rankTier: 'Vàng',
    isCurrentPlayer: true
  },
  {
    id: 'lb-4',
    name: 'Nghĩa',
    avatar: '🥷',
    title: 'Đại Hiệp Nghĩa Khí',
    level: 13,
    weeklyScore: 1980,
    monthlyScore: 8400,
    allTimeScore: 34100,
    winCount: 98,
    totalGames: 140,
    rankTier: 'Kim Cương'
  },
  {
    id: 'lb-5',
    name: 'Lộc',
    avatar: '🎅',
    title: 'Tài Lộc Dồi Dào',
    level: 12,
    weeklyScore: 1750,
    monthlyScore: 7890,
    allTimeScore: 31200,
    winCount: 89,
    totalGames: 135,
    rankTier: 'Bạch Kim'
  },
  {
    id: 'lb-6',
    name: 'Tín',
    avatar: '🤴',
    title: 'Uy Tín Vô Song',
    level: 11,
    weeklyScore: 1540,
    monthlyScore: 6950,
    allTimeScore: 28400,
    winCount: 78,
    totalGames: 120,
    rankTier: 'Bạch Kim'
  },
  {
    id: 'lb-7',
    name: 'Thọ',
    avatar: '👴',
    title: 'Lão Làng Bất Tử',
    level: 10,
    weeklyScore: 1320,
    monthlyScore: 5900,
    allTimeScore: 24600,
    winCount: 65,
    totalGames: 110,
    rankTier: 'Vàng'
  },
  {
    id: 'lb-8',
    name: 'Nhân',
    avatar: '👨‍💼',
    title: 'Cao Thủ Trầm Tĩnh',
    level: 8,
    weeklyScore: 1100,
    monthlyScore: 4600,
    allTimeScore: 19800,
    winCount: 52,
    totalGames: 95,
    rankTier: 'Vàng'
  },
  {
    id: 'lb-9',
    name: 'Lợi',
    avatar: '🕵️',
    title: 'Thương Gia Tinh Quái',
    level: 9,
    weeklyScore: 980,
    monthlyScore: 4200,
    allTimeScore: 17500,
    winCount: 48,
    totalGames: 90,
    rankTier: 'Bạc'
  },
  {
    id: 'lb-10',
    name: 'Lễ',
    avatar: '🤵',
    title: 'Công Tử Lịch Thiệp',
    level: 6,
    weeklyScore: 820,
    monthlyScore: 3500,
    allTimeScore: 14200,
    winCount: 38,
    totalGames: 75,
    rankTier: 'Đồng'
  }
];

export const BOT_CHAT_MESSAGES = [
  'Đánh hay đấy bạn ơi!',
  'Nhường tôi cây này đi!',
  'Coi chừng heo tôi xuất chuồng đó nha!',
  'Bài này mà không về nhất thì hơi phí!',
  'Bỏ lượt cho lành...',
  'Chặt đẹp luôn nè!',
  'Úi chà, bài cao thế!',
  'Sắp tới nơi rồi!',
  'Thối heo bây giờ đó nha!',
  'Ván này căng đấy!'
];

export const EMOJIS = ['😎', '🔥', '💥', '🤣', '😭', '👏', '🐷', '💣', '🏆', '👀'];
