import { Card, ComboType, PlayedCombo, Rank, Suit } from '../types/game';

export const SUIT_ORDER: Record<Suit, number> = {
  spades: 0,   // Bích ♠
  clubs: 1,    // Chuồn ♣
  diamonds: 2, // Rô ♦
  hearts: 3    // Cơ ♥
};

export const SUIT_SYMBOLS: Record<Suit, string> = {
  spades: '♠',
  clubs: '♣',
  diamonds: '♦',
  hearts: '♥'
};

export const SUIT_NAMES: Record<Suit, string> = {
  spades: 'Bích',
  clubs: 'Chuồn',
  diamonds: 'Rô',
  hearts: 'Cơ'
};

export const RANK_LABELS: Record<Rank, string> = {
  3: '3',
  4: '4',
  5: '5',
  6: '6',
  7: '7',
  8: '8',
  9: '9',
  10: '10',
  11: 'J',
  12: 'Q',
  13: 'K',
  14: 'A',
  15: '2'
};

// Create a full 52-card standard deck
export function createDeck(): Card[] {
  const suits: Suit[] = ['spades', 'clubs', 'diamonds', 'hearts'];
  const ranks: Rank[] = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  const deck: Card[] = [];

  for (const rank of ranks) {
    for (const suit of suits) {
      const isRed = suit === 'diamonds' || suit === 'hearts';
      deck.push({
        id: `${rank}-${suit}`,
        rank,
        suit,
        label: RANK_LABELS[rank],
        color: isRed ? 'red' : 'black',
        value: rank * 4 + SUIT_ORDER[suit]
      });
    }
  }

  return shuffleDeck(deck);
}

// Fisher-Yates shuffle
export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Sort cards primarily by rank, then suit
export function sortCardsByRank(cards: Card[]): Card[] {
  return [...cards].sort((a, b) => a.value - b.value);
}

// Sort cards primarily by suit, then rank
export function sortCardsBySuit(cards: Card[]): Card[] {
  return [...cards].sort((a, b) => {
    if (SUIT_ORDER[a.suit] !== SUIT_ORDER[b.suit]) {
      return SUIT_ORDER[a.suit] - SUIT_ORDER[b.suit];
    }
    return a.rank - b.rank;
  });
}

// Detect combo type from an array of selected cards
export function identifyCombo(cards: Card[], playerId = '', playerName = ''): PlayedCombo | null {
  if (!cards || cards.length === 0) return null;

  const sorted = sortCardsByRank(cards);
  const len = sorted.length;
  const highestCard = sorted[len - 1];

  // 1. Single (Rác)
  if (len === 1) {
    return {
      type: 'single',
      cards: sorted,
      highestCard,
      length: 1,
      playerId,
      playerName
    };
  }

  // 2. Pair (Đôi)
  if (len === 2 && sorted[0].rank === sorted[1].rank) {
    return {
      type: 'pair',
      cards: sorted,
      highestCard,
      length: 2,
      playerId,
      playerName
    };
  }

  // 3. Triple (Sám cô / 3 lá)
  if (len === 3 && sorted[0].rank === sorted[1].rank && sorted[1].rank === sorted[2].rank) {
    return {
      type: 'triple',
      cards: sorted,
      highestCard,
      length: 3,
      playerId,
      playerName
    };
  }

  // 4. Four of a kind (Tứ quý)
  if (
    len === 4 &&
    sorted[0].rank === sorted[1].rank &&
    sorted[1].rank === sorted[2].rank &&
    sorted[2].rank === sorted[3].rank
  ) {
    return {
      type: 'four_of_a_kind',
      cards: sorted,
      highestCard,
      length: 4,
      playerId,
      playerName
    };
  }

  // 5. Straight (Sảnh: 3 to 12 cards, no 2s allowed in standard TLMN)
  if (len >= 3) {
    let isStraight = true;
    for (let i = 0; i < len - 1; i++) {
      if (sorted[i].rank === 15 || sorted[i + 1].rank === 15) {
        isStraight = false; // 2 cannot be in straight
        break;
      }
      if (sorted[i + 1].rank !== sorted[i].rank + 1) {
        isStraight = false;
        break;
      }
    }
    if (isStraight) {
      return {
        type: 'straight',
        cards: sorted,
        highestCard,
        length: len,
        playerId,
        playerName
      };
    }
  }

  // 6. 3 Pairs Straight (3 đôi thông: 6 cards, 3 consecutive pairs, no 2s)
  if (len === 6) {
    const p1 = sorted[0].rank === sorted[1].rank;
    const p2 = sorted[2].rank === sorted[3].rank;
    const p3 = sorted[4].rank === sorted[5].rank;
    if (
      p1 &&
      p2 &&
      p3 &&
      sorted[0].rank !== 15 &&
      sorted[2].rank === sorted[0].rank + 1 &&
      sorted[4].rank === sorted[2].rank + 1
    ) {
      return {
        type: 'three_pair_straight',
        cards: sorted,
        highestCard,
        length: 6,
        playerId,
        playerName
      };
    }
  }

  // 7. 4 Pairs Straight (4 đôi thông: 8 cards, 4 consecutive pairs, no 2s)
  if (len === 8) {
    const p1 = sorted[0].rank === sorted[1].rank;
    const p2 = sorted[2].rank === sorted[3].rank;
    const p3 = sorted[4].rank === sorted[5].rank;
    const p4 = sorted[6].rank === sorted[7].rank;
    if (
      p1 &&
      p2 &&
      p3 &&
      p4 &&
      sorted[0].rank !== 15 &&
      sorted[2].rank === sorted[0].rank + 1 &&
      sorted[4].rank === sorted[2].rank + 1 &&
      sorted[6].rank === sorted[4].rank + 1
    ) {
      return {
        type: 'four_pair_straight',
        cards: sorted,
        highestCard,
        length: 8,
        playerId,
        playerName
      };
    }
  }

  return null;
}

// Compare if incoming combo can beat current table combo
export function canBeatCombo(current: PlayedCombo | null, incoming: PlayedCombo | null): boolean {
  if (!incoming) return false;
  if (!current) return true; // Leading a new trick/round

  const curType = current.type;
  const incType = incoming.type;

  // Normal same-type comparison
  if (curType === incType) {
    if (curType === 'straight') {
      if (incoming.length !== current.length) return false;
      return incoming.highestCard.value > current.highestCard.value;
    }
    if (curType === 'single' || curType === 'pair' || curType === 'triple' || curType === 'four_of_a_kind') {
      return incoming.highestCard.value > current.highestCard.value;
    }
    if (curType === 'three_pair_straight' || curType === 'four_pair_straight') {
      return incoming.highestCard.value > current.highestCard.value;
    }
  }

  // Special "Chặt" (Bomb / Chop) rules in Tiến Lên Miền Nam:

  // Current is 1 Heo (Single 2)
  if (curType === 'single' && current.highestCard.rank === 15) {
    // 3 Đôi thông chặt được 1 heo
    if (incType === 'three_pair_straight') return true;
    // Tứ quý chặt được 1 heo
    if (incType === 'four_of_a_kind') return true;
    // 4 Đôi thông chặt được 1 heo
    if (incType === 'four_pair_straight') return true;
  }

  // Current is Đôi Heo (Pair of 2s)
  if (curType === 'pair' && current.highestCard.rank === 15) {
    // Tứ quý chặt đôi heo
    if (incType === 'four_of_a_kind') return true;
    // 4 đôi thông chặt đôi heo
    if (incType === 'four_pair_straight') return true;
  }

  // Current is 3 Đôi Thông
  if (curType === 'three_pair_straight') {
    // Tứ quý chặt được 3 đôi thông
    if (incType === 'four_of_a_kind') return true;
    // 4 đôi thông chặt được 3 đôi thông
    if (incType === 'four_pair_straight') return true;
  }

  // Current is Tứ Quý
  if (curType === 'four_of_a_kind') {
    // 4 đôi thông chặt được tứ quý
    if (incType === 'four_pair_straight') return true;
  }

  return false;
}

// Check if played combo involves a "Chặt" event (for bonus coin transfer & sound effect)
export function checkIsChop(current: PlayedCombo | null, incoming: PlayedCombo): { isChop: boolean; chopType: string; multiplier: number } {
  if (!current) return { isChop: false, chopType: '', multiplier: 0 };

  // Chặt 1 heo
  if (current.type === 'single' && current.highestCard.rank === 15) {
    const isRedHeo = current.highestCard.suit === 'hearts' || current.highestCard.suit === 'diamonds';
    const mult = isRedHeo ? 2 : 1; // Heo đỏ x2, heo đen x1
    return {
      isChop: true,
      chopType: isRedHeo ? 'Chặt Heo Đỏ' : 'Chặt Heo Đen',
      multiplier: mult
    };
  }

  // Chặt đôi heo
  if (current.type === 'pair' && current.highestCard.rank === 15) {
    return {
      isChop: true,
      chopType: 'Chặt Đôi Heo',
      multiplier: 4
    };
  }

  // Chặt 3 đôi thông / tứ quý / 4 đôi thông
  if (current.type === 'three_pair_straight' || current.type === 'four_of_a_kind') {
    return {
      isChop: true,
      chopType: 'Chặt Hàng Đè Hàng',
      multiplier: 4
    };
  }

  return { isChop: false, chopType: '', multiplier: 0 };
}

// Combo readable name in Vietnamese
export function getComboName(combo: PlayedCombo): string {
  switch (combo.type) {
    case 'single':
      if (combo.highestCard.rank === 15) {
        return `Heo ${SUIT_NAMES[combo.highestCard.suit]} (${combo.highestCard.label}${SUIT_SYMBOLS[combo.highestCard.suit]})`;
      }
      return `Lá ${combo.highestCard.label} ${SUIT_NAMES[combo.highestCard.suit]}`;
    case 'pair':
      if (combo.highestCard.rank === 15) {
        return `Đôi Heo (${combo.cards.map(c => c.label + SUIT_SYMBOLS[c.suit]).join(' ')})`;
      }
      return `Đôi ${combo.highestCard.label}`;
    case 'triple':
      return `Sám cô ${combo.highestCard.label}`;
    case 'straight':
      return `Sảnh ${combo.length} lá (${combo.cards[0].label} đến ${combo.highestCard.label})`;
    case 'four_of_a_kind':
      return `Tứ Quý ${combo.highestCard.label}! 💣`;
    case 'three_pair_straight':
      return `3 Đôi Thông (${combo.cards[0].label}-${combo.highestCard.label})! 🔥`;
    case 'four_pair_straight':
      return `4 Đôi Thông Vô Địch! 💥`;
    default:
      return 'Bài không hợp lệ';
  }
}

// Find 3 of Spades (3 Bích) in hand (for first game round)
export function hasThreeOfSpades(cards: Card[]): boolean {
  return cards.some(c => c.rank === 3 && c.suit === 'spades');
}

// Check "Tới Trắng" (Instant Win at deal)
export function checkToiTrang(cards: Card[]): { isToiTrang: boolean; reason: string } {
  if (cards.length !== 13) return { isToiTrang: false, reason: '' };

  const sorted = sortCardsByRank(cards);

  // 1. Sảnh rồng (3 to A or 3 to 2)
  let isSanhRong = true;
  for (let i = 0; i < 12; i++) {
    if (sorted[i + 1].rank !== sorted[i].rank + 1) {
      isSanhRong = false;
      break;
    }
  }
  if (isSanhRong) {
    return { isToiTrang: true, reason: 'Sảnh Rồng Thần Thánh' };
  }

  // 2. Tứ quý 2 (4 con Heo)
  const heos = cards.filter(c => c.rank === 15);
  if (heos.length === 4) {
    return { isToiTrang: true, reason: 'Tứ Quý Heo (4 con 2)' };
  }

  // 3. 6 Đôi bất kỳ
  const rankCounts: Record<number, number> = {};
  for (const c of cards) {
    rankCounts[c.rank] = (rankCounts[c.rank] || 0) + 1;
  }
  let pairCount = 0;
  for (const count of Object.values(rankCounts)) {
    pairCount += Math.floor(count / 2);
  }
  if (pairCount >= 6) {
    return { isToiTrang: true, reason: '6 Đôi Thắng Trắng' };
  }

  // 4. Đồng hoa (13 lá cùng màu đỏ hoặc đen)
  const redCount = cards.filter(c => c.color === 'red').length;
  if (redCount === 13 || redCount === 0) {
    return { isToiTrang: true, reason: 'Đồng Hoa (13 lá cùng màu)' };
  }

  return { isToiTrang: false, reason: '' };
}

// Calculate remaining penalties at round end (Thối heo đen: 1 cược, heo đỏ: 2 cược, tứ quý: 3 cược, cóng: 4 cược)
export function calculatePenalties(cards: Card[], isCong = false, baseBet = 1000): { penalty: number; details: string[] } {
  let penalty = 0;
  const details: string[] = [];

  if (isCong) {
    penalty += baseBet * 4;
    details.push('Cóng/Cháy bài (-4x)');
  }

  for (const c of cards) {
    if (c.rank === 15) {
      if (c.suit === 'hearts' || c.suit === 'diamonds') {
        penalty += baseBet * 2;
        details.push(`Thối Heo Đỏ ${c.label}${SUIT_SYMBOLS[c.suit]} (-2x)`);
      } else {
        penalty += baseBet * 1;
        details.push(`Thối Heo Đen ${c.label}${SUIT_SYMBOLS[c.suit]} (-1x)`);
      }
    }
  }

  // Tứ quý thối
  const rankCounts: Record<number, number> = {};
  for (const c of cards) {
    rankCounts[c.rank] = (rankCounts[c.rank] || 0) + 1;
  }
  for (const [rank, count] of Object.entries(rankCounts)) {
    if (count === 4 && Number(rank) !== 15) {
      penalty += baseBet * 3;
      details.push(`Thối Tứ Quý ${RANK_LABELS[Number(rank) as Rank]} (-3x)`);
    }
  }

  return { penalty, details };
}

// AI: Helper to generate all candidate valid combos from hand
export function getAllPossibleCombos(hand: Card[]): PlayedCombo[] {
  const sorted = sortCardsByRank(hand);
  const combos: PlayedCombo[] = [];

  // Singles
  for (const card of sorted) {
    const combo = identifyCombo([card]);
    if (combo) combos.push(combo);
  }

  // Pairs
  for (let i = 0; i < sorted.length - 1; i++) {
    for (let j = i + 1; j < sorted.length; j++) {
      if (sorted[i].rank === sorted[j].rank) {
        const combo = identifyCombo([sorted[i], sorted[j]]);
        if (combo) combos.push(combo);
      }
    }
  }

  // Triples
  for (let i = 0; i < sorted.length - 2; i++) {
    for (let j = i + 1; j < sorted.length - 1; j++) {
      for (let k = j + 1; k < sorted.length; k++) {
        if (sorted[i].rank === sorted[j].rank && sorted[j].rank === sorted[k].rank) {
          const combo = identifyCombo([sorted[i], sorted[j], sorted[k]]);
          if (combo) combos.push(combo);
        }
      }
    }
  }

  // Four of a kind
  for (let i = 0; i < sorted.length - 3; i++) {
    if (
      sorted[i].rank === sorted[i + 1].rank &&
      sorted[i + 1].rank === sorted[i + 2].rank &&
      sorted[i + 2].rank === sorted[i + 3].rank
    ) {
      const combo = identifyCombo([sorted[i], sorted[i + 1], sorted[i + 2], sorted[i + 3]]);
      if (combo) combos.push(combo);
    }
  }

  // Straights (lengths 3 to 12)
  // Group cards by rank (no 2s)
  const nonHeos = sorted.filter(c => c.rank < 15);
  const byRank: Record<number, Card[]> = {};
  for (const c of nonHeos) {
    if (!byRank[c.rank]) byRank[c.rank] = [];
    byRank[c.rank].push(c);
  }

  const distinctRanks = Object.keys(byRank).map(Number).sort((a, b) => a - b);
  for (let startIdx = 0; startIdx < distinctRanks.length; startIdx++) {
    let currentStraight: Card[] = [];
    let prevRank = distinctRanks[startIdx] - 1;

    for (let currIdx = startIdx; currIdx < distinctRanks.length; currIdx++) {
      const r = distinctRanks[currIdx];
      if (r === prevRank + 1) {
        // pick lowest card for simplicity or one of suit
        currentStraight.push(byRank[r][0]);
        prevRank = r;
        if (currentStraight.length >= 3) {
          const straightCombo = identifyCombo([...currentStraight]);
          if (straightCombo) combos.push(straightCombo);
        }
      } else {
        break;
      }
    }
  }

  // 3 Đôi thông
  const pairsByRank: Record<number, [Card, Card][]> = {};
  for (let i = 0; i < sorted.length - 1; i++) {
    if (sorted[i].rank < 15 && sorted[i].rank === sorted[i + 1].rank) {
      if (!pairsByRank[sorted[i].rank]) pairsByRank[sorted[i].rank] = [];
      pairsByRank[sorted[i].rank].push([sorted[i], sorted[i + 1]]);
    }
  }

  const pairRanks = Object.keys(pairsByRank).map(Number).sort((a, b) => a - b);
  for (let i = 0; i <= pairRanks.length - 3; i++) {
    if (pairRanks[i + 1] === pairRanks[i] + 1 && pairRanks[i + 2] === pairRanks[i] + 2) {
      const p1 = pairsByRank[pairRanks[i]][0];
      const p2 = pairsByRank[pairRanks[i + 1]][0];
      const p3 = pairsByRank[pairRanks[i + 2]][0];
      const combo = identifyCombo([...p1, ...p2, ...p3]);
      if (combo) combos.push(combo);
    }
  }

  // 4 Đôi thông
  for (let i = 0; i <= pairRanks.length - 4; i++) {
    if (
      pairRanks[i + 1] === pairRanks[i] + 1 &&
      pairRanks[i + 2] === pairRanks[i] + 2 &&
      pairRanks[i + 3] === pairRanks[i] + 3
    ) {
      const p1 = pairsByRank[pairRanks[i]][0];
      const p2 = pairsByRank[pairRanks[i + 1]][0];
      const p3 = pairsByRank[pairRanks[i + 2]][0];
      const p4 = pairsByRank[pairRanks[i + 3]][0];
      const combo = identifyCombo([...p1, ...p2, ...p3, ...p4]);
      if (combo) combos.push(combo);
    }
  }

  return combos;
}

// AI strategic decision engine
export function getAiMove(
  hand: Card[],
  tableCombo: PlayedCombo | null,
  isFirstTrickOfRound: boolean,
  mustPlayThreeOfSpades: boolean
): PlayedCombo | null {
  const allCombos = getAllPossibleCombos(hand);

  // Filter valid combos that beat tableCombo
  const validCombos = allCombos.filter(combo => {
    if (mustPlayThreeOfSpades && isFirstTrickOfRound) {
      // Must contain 3 of Spades
      if (!combo.cards.some(c => c.rank === 3 && c.suit === 'spades')) {
        return false;
      }
    }
    return canBeatCombo(tableCombo, combo);
  });

  if (validCombos.length === 0) {
    return null; // Must pass
  }

  // If table is free (leading the round):
  if (!tableCombo) {
    // Prefer playing longest straights first, then triples, then pairs, then smallest single
    const straights = validCombos.filter(c => c.type === 'straight').sort((a, b) => b.length - a.length || a.highestCard.value - b.highestCard.value);
    if (straights.length > 0) return straights[0];

    const pairs = validCombos.filter(c => c.type === 'pair' && c.highestCard.rank < 15).sort((a, b) => a.highestCard.value - b.highestCard.value);
    if (pairs.length > 0) return pairs[0];

    const triples = validCombos.filter(c => c.type === 'triple').sort((a, b) => a.highestCard.value - b.highestCard.value);
    if (triples.length > 0) return triples[0];

    const smallSingles = validCombos.filter(c => c.type === 'single' && c.highestCard.rank < 15).sort((a, b) => a.highestCard.value - b.highestCard.value);
    if (smallSingles.length > 0) return smallSingles[0];

    return validCombos[0];
  }

  // If responding to an existing table play:
  // 1. If opponent played Heo and we have a chop bomb, check if smart to chop
  if (tableCombo.highestCard.rank === 15) {
    const chops = validCombos.filter(c =>
      c.type === 'four_of_a_kind' || c.type === 'three_pair_straight' || c.type === 'four_pair_straight'
    );
    if (chops.length > 0) {
      return chops[0]; // Chặt luôn!
    }
  }

  // 2. Otherwise, play the smallest valid combo to beat the table (preserve big cards)
  const sameTypeCandidates = validCombos.filter(c => c.type === tableCombo.type);
  if (sameTypeCandidates.length > 0) {
    sameTypeCandidates.sort((a, b) => a.highestCard.value - b.highestCard.value);
    // Don't waste Heo on very small cards if AI wants to save it, unless hand has <= 3 cards
    if (sameTypeCandidates[0].highestCard.rank === 15 && hand.length > 4 && tableCombo.highestCard.rank <= 10) {
      // 50% chance pass to keep heo for later
      if (Math.random() < 0.5) return null;
    }
    return sameTypeCandidates[0];
  }

  // Fallback to any valid combo (e.g., chop)
  validCombos.sort((a, b) => a.highestCard.value - b.highestCard.value);
  return validCombos[0];
}

/**
 * Calculates comprehensive scoring breakdown for Tiến Lên round
 */
export function calculateRoundScoreBreakdown(
  player: { rankPosition?: number; isCong?: boolean; cards: Card[] },
  isToiTrang = false,
  chopBonus = 0,
  chopVictimPenalty = 0
) {
  let rankPoints = 0;
  if (player.rankPosition === 1) rankPoints = 100;
  else if (player.rankPosition === 2) rankPoints = 30;
  else if (player.rankPosition === 3) rankPoints = -30;
  else if (player.rankPosition === 4) rankPoints = player.isCong ? -100 : -60;

  // Thối penalties (applies to players who did not win 1st)
  let thoi2BlackPoints = 0;
  let thoi2RedPoints = 0;
  let thoiTuQuyPoints = 0;
  let thoiDoiThongPoints = 0;

  if (player.rankPosition && player.rankPosition > 1) {
    player.cards.forEach(card => {
      if (card.rank === 15) {
        if (card.suit === 'spades' || card.suit === 'clubs') {
          thoi2BlackPoints -= 15;
        } else {
          thoi2RedPoints -= 30;
        }
      }
    });

    // Check for thối tứ quý in hand
    const rankCounts: Record<number, number> = {};
    player.cards.forEach(c => {
      rankCounts[c.rank] = (rankCounts[c.rank] || 0) + 1;
    });
    Object.values(rankCounts).forEach(cnt => {
      if (cnt === 4) thoiTuQuyPoints -= 50;
    });
  }

  const toiTrangBonus = isToiTrang && player.rankPosition === 1 ? 150 : 0;

  const totalRoundPoints =
    rankPoints +
    thoi2BlackPoints +
    thoi2RedPoints +
    thoiTuQuyPoints +
    thoiDoiThongPoints +
    chopBonus +
    chopVictimPenalty +
    toiTrangBonus;

  const expGained = Math.max(35, totalRoundPoints + (player.rankPosition === 1 ? 90 : 45));

  return {
    rankPoints,
    thoi2BlackPoints,
    thoi2RedPoints,
    thoiTuQuyPoints,
    thoiDoiThongPoints,
    chopBonusPoints: chopBonus,
    chopVictimPenalty,
    toiTrangBonus,
    totalRoundPoints,
    expGained
  };
}

