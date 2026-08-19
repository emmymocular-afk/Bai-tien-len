/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ALL_BOTS, BOT_CHAT_MESSAGES, EMOJIS, INITIAL_LEADERBOARD } from './data/bots';
import { BotInfo, Card, ChopEvent, GamePhase, LeaderboardEntry, PlayedCombo, PlayerState } from './types/game';
import { soundManager } from './utils/audio';
import {
  calculateRoundScoreBreakdown,
  canBeatCombo,
  checkIsChop,
  checkToiTrang,
  createDeck,
  getAiMove,
  getAllPossibleCombos,
  hasThreeOfSpades,
  identifyCombo,
  sortCardsByRank,
  sortCardsBySuit
} from './utils/tienlenEngine';

import { CardView } from './components/CardView';
import { PlayerSeat } from './components/PlayerSeat';
import { TableCenter } from './components/TableCenter';
import { PlayerControls } from './components/PlayerControls';
import { RoomLobbyModal } from './components/RoomLobbyModal';
import { GameScoreboardModal } from './components/GameScoreboardModal';
import { RulesGuideModal } from './components/RulesGuideModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { ChatEmojiBar } from './components/ChatEmojiBar';
import { ChopLightningEffect } from './components/ChopLightningEffect';
import { CardDealingAnimation } from './components/CardDealingAnimation';
import { VictoryGoldRain } from './components/VictoryGoldRain';
import { ThrowItemOverlay } from './components/ThrowItemOverlay';
import { ShareModal } from './components/ShareModal';
import { ThrownItemAction, ThrowItemType } from './types/game';

export default function App() {
  // Game Configuration & Modals
  const [isLobbyOpen, setIsLobbyOpen] = useState(true);
  const [isScoreboardOpen, setIsScoreboardOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [showRosterWidget, setShowRosterWidget] = useState(true);

  // Player Progression State
  const [playerLevel, setPlayerLevel] = useState<number>(1);
  const [playerExp, setPlayerExp] = useState<number>(50);
  const [currentPlayerScore, setCurrentPlayerScore] = useState<number>(0);
  const [expGainedLastRound, setExpGainedLastRound] = useState<number>(0);
  const [newUnlockedBots, setNewUnlockedBots] = useState<string[]>([]);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(INITIAL_LEADERBOARD);

  // Room & Players State
  const [baseBet, setBaseBet] = useState(5000);
  const [roundNumber, setRoundNumber] = useState(1);
  const [selectedBots, setSelectedBots] = useState<BotInfo[]>([
    ALL_BOTS[0], // Nhân (Lv 1)
    ALL_BOTS[1], // Nghĩa (Lv 1)
    ALL_BOTS[2]  // Lễ (Lv 1)
  ]);

  const [players, setPlayers] = useState<PlayerState[]>([
    {
      id: 'human-player',
      name: 'Chủ phòng',
      role: 'human',
      avatar: '👑',
      cards: [],
      coins: 1250000,
      isReady: true,
      hasPassed: false
    },
    {
      id: ALL_BOTS[0].id,
      name: ALL_BOTS[0].name,
      role: 'bot',
      avatar: ALL_BOTS[0].avatar,
      cards: [],
      coins: 500000,
      isReady: true,
      hasPassed: false
    },
    {
      id: ALL_BOTS[1].id,
      name: ALL_BOTS[1].name,
      role: 'bot',
      avatar: ALL_BOTS[1].avatar,
      cards: [],
      coins: 500000,
      isReady: true,
      hasPassed: false
    },
    {
      id: ALL_BOTS[2].id,
      name: ALL_BOTS[2].name,
      role: 'bot',
      avatar: ALL_BOTS[2].avatar,
      cards: [],
      coins: 500000,
      isReady: true,
      hasPassed: false
    }
  ]);

  // Round Gameplay State
  const [gamePhase, setGamePhase] = useState<GamePhase>('lobby');
  const [currentTurnIndex, setCurrentTurnIndex] = useState<number>(0);
  const [currentTableCombo, setCurrentTableCombo] = useState<PlayedCombo | null>(null);
  const [lastTrickWinnerIndex, setLastTrickWinnerIndex] = useState<number>(0);
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);
  const [isFirstTrickOfRound, setIsFirstTrickOfRound] = useState(true);
  const [mustPlayThreeOfSpades, setMustPlayThreeOfSpades] = useState(true);
  const [lastChopEvent, setLastChopEvent] = useState<ChopEvent | null>(null);
  const [turnTimeLeft, setTurnTimeLeft] = useState<number>(10);
  const [roundChopStats, setRoundChopStats] = useState<Record<string, { bonus: number; penalty: number }>>({});
  const [firstFinisherInfo, setFirstFinisherInfo] = useState<{ winnerName: string; isHumanWinner: boolean; bonusCoins: number } | null>(null);
  const [thrownItems, setThrownItems] = useState<ThrownItemAction[]>([]);
  const [selectedTargetSeatIndex, setSelectedTargetSeatIndex] = useState<number | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isExecutingAiTurn = useRef(false);

  // Throw interactive item at target seat
  const handleThrowItem = useCallback((targetSeatIndex: number, itemType: ThrowItemType, fromSeatIndex = 0) => {
    const getSeatCoords = (seatIdx: number) => {
      const w = typeof window !== 'undefined' ? window.innerWidth : 800;
      const h = typeof window !== 'undefined' ? window.innerHeight : 600;
      if (seatIdx === 0) return { x: w / 2 - 20, y: h - 140 };
      if (seatIdx === 1) return { x: w * 0.2, y: 90 };
      if (seatIdx === 2) return { x: w * 0.5, y: 90 };
      if (seatIdx === 3) return { x: w * 0.8, y: 90 };
      return { x: w / 2, y: h / 2 };
    };

    const start = getSeatCoords(fromSeatIndex);
    const target = getSeatCoords(targetSeatIndex);

    const action: ThrownItemAction = {
      id: `${Date.now()}-${Math.random()}`,
      fromIndex: fromSeatIndex,
      toIndex: targetSeatIndex,
      itemType,
      startX: start.x,
      startY: start.y,
      targetX: target.x,
      targetY: target.y,
      createdAt: Date.now()
    };

    soundManager.playThrowItem();
    setThrownItems(prev => [...prev, action]);

    // Projectile hits target after flight duration
    setTimeout(() => {
      soundManager.playSplatItem();
      const hitEmojis: Record<ThrowItemType, string> = {
        tomato: '🍅💦',
        slipper: '🩴💢',
        bomb: '💥💨',
        beer: '🍻✨',
        party: '🎉🥳',
        heart: '💖🥰'
      };
      setPlayers(prev =>
        prev.map((p, idx) =>
          idx === targetSeatIndex
            ? {
                ...p,
                reaction: {
                  emoji: hitEmojis[itemType],
                  expiresAt: Date.now() + 2000
                }
              }
            : p
        )
      );
    }, 650);

    // Remove finished projectile
    setTimeout(() => {
      setThrownItems(prev => prev.filter(item => item.id !== action.id));
    }, 1000);
  }, []);

  // Toggle audio
  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    soundManager.soundEnabled = next;
  };

  // Start new round from lobby or restart
  const startNewRound = useCallback((chosenBots = selectedBots, bet = baseBet) => {
    setIsLobbyOpen(false);
    setIsScoreboardOpen(false);
    setIsLeaderboardOpen(false);
    setGamePhase('dealing');
    setBaseBet(bet);
    setSelectedBots(chosenBots);
    setCurrentTableCombo(null);
    setSelectedCardIds([]);
    setLastChopEvent(null);
    setRoundChopStats({});
    setNewUnlockedBots([]);

    // Deal 52 cards to 4 players (13 cards each)
    const deck = createDeck();
    soundManager.playCardDeal();

    const p0Cards = sortCardsByRank(deck.slice(0, 13));
    const p1Cards = sortCardsByRank(deck.slice(13, 26));
    const p2Cards = sortCardsByRank(deck.slice(26, 39));
    const p3Cards = sortCardsByRank(deck.slice(39, 52));

    const initialPlayers: PlayerState[] = [
      {
        id: 'human-player',
        name: 'Chủ phòng',
        role: 'human',
        avatar: '👑',
        cards: p0Cards,
        coins: players[0]?.coins ?? 1250000,
        isReady: true,
        hasPassed: false
      },
      {
        id: chosenBots[0].id,
        name: chosenBots[0].name,
        role: 'bot',
        avatar: chosenBots[0].avatar,
        cards: p1Cards,
        coins: players[1]?.coins ?? 500000,
        isReady: true,
        hasPassed: false
      },
      {
        id: chosenBots[1].id,
        name: chosenBots[1].name,
        role: 'bot',
        avatar: chosenBots[1].avatar,
        cards: p2Cards,
        coins: players[2]?.coins ?? 500000,
        isReady: true,
        hasPassed: false
      },
      {
        id: chosenBots[2].id,
        name: chosenBots[2].name,
        role: 'bot',
        avatar: chosenBots[2].avatar,
        cards: p3Cards,
        coins: players[3]?.coins ?? 500000,
        isReady: true,
        hasPassed: false
      }
    ];

    setPlayers(initialPlayers);

    // Check Tới Trắng instant win
    for (let i = 0; i < 4; i++) {
      const toiTrang = checkToiTrang(initialPlayers[i].cards);
      if (toiTrang.isToiTrang) {
        soundManager.playWin();
        initialPlayers[i].rankPosition = 1;
        
        // Calculate scores for toi trang
        const scored = initialPlayers.map((p, idx) => {
          const breakdown = calculateRoundScoreBreakdown(
            { rankPosition: idx === i ? 1 : 4, isCong: idx !== i, cards: p.cards },
            true
          );
          return {
            ...p,
            rankPosition: idx === i ? 1 : 4,
            isCong: idx !== i,
            scoreBreakdown: breakdown
          };
        });

        setPlayers(scored);
        setGamePhase('round_end');
        setIsScoreboardOpen(true);
        return;
      }
    }

    // Determine who starts
    let starterIndex = 0;
    if (roundNumber === 1) {
      for (let i = 0; i < 4; i++) {
        if (hasThreeOfSpades(initialPlayers[i].cards)) {
          starterIndex = i;
          break;
        }
      }
      setIsFirstTrickOfRound(true);
      setMustPlayThreeOfSpades(true);
    } else {
      starterIndex = lastTrickWinnerIndex;
      setIsFirstTrickOfRound(false);
      setMustPlayThreeOfSpades(false);
    }

    setCurrentTurnIndex(starterIndex);
    setLastTrickWinnerIndex(starterIndex);
    setTurnTimeLeft(15);
    setGamePhase('playing');
  }, [baseBet, lastTrickWinnerIndex, players, roundNumber, selectedBots]);

  // Card selection toggle
  const handleCardClick = (card: Card) => {
    soundManager.playCardSelect();
    if (selectedCardIds.includes(card.id)) {
      setSelectedCardIds(selectedCardIds.filter(id => id !== card.id));
    } else {
      setSelectedCardIds([...selectedCardIds, card.id]);
    }
  };

  // Sorting
  const handleSortByRank = () => {
    soundManager.playCardDeal();
    setPlayers(prev => {
      const copy = [...prev];
      copy[0].cards = sortCardsByRank(copy[0].cards);
      return copy;
    });
  };

  const handleSortBySuit = () => {
    soundManager.playCardDeal();
    setPlayers(prev => {
      const copy = [...prev];
      copy[0].cards = sortCardsBySuit(copy[0].cards);
      return copy;
    });
  };

  // Advance to next active player
  const advanceTurn = useCallback((prevTurnIdx: number, updatedPlayers: PlayerState[], latestCombo: PlayedCombo | null) => {
    const unfinishedPlayers = updatedPlayers.filter(p => !p.rankPosition);
    if (unfinishedPlayers.length <= 1) {
      endRound(updatedPlayers);
      return;
    }

    const activeNonPassed = updatedPlayers.filter(p => !p.rankPosition && !p.hasPassed);

    if (activeNonPassed.length === 0 || (activeNonPassed.length === 1 && latestCombo && activeNonPassed[0].id === latestCombo.playerId)) {
      const winnerId = latestCombo ? latestCombo.playerId : updatedPlayers[prevTurnIdx].id;
      let nextLeadIdx = updatedPlayers.findIndex(p => p.id === winnerId);

      if (updatedPlayers[nextLeadIdx]?.rankPosition) {
        nextLeadIdx = (nextLeadIdx + 1) % 4;
        while (updatedPlayers[nextLeadIdx]?.rankPosition) {
          nextLeadIdx = (nextLeadIdx + 1) % 4;
        }
      }

      const resetPlayers = updatedPlayers.map(p => ({
        ...p,
        hasPassed: false
      }));

      setPlayers(resetPlayers);
      setCurrentTableCombo(null);
      setCurrentTurnIndex(nextLeadIdx);
      setLastTrickWinnerIndex(nextLeadIdx);
      setTurnTimeLeft(10);
      return;
    }

    let nextIdx = (prevTurnIdx + 1) % 4;
    while (updatedPlayers[nextIdx].rankPosition || updatedPlayers[nextIdx].hasPassed) {
      nextIdx = (nextIdx + 1) % 4;
    }

    setCurrentTurnIndex(nextIdx);
    setTurnTimeLeft(10);
  }, [roundChopStats]);

  // End of Round: Detailed Score & Level Progression Calculation
  const endRound = (finalPlayers: PlayerState[]) => {
    setGamePhase('round_end');
    soundManager.playWin();

    // Assign final ranks for remaining unfinished players
    let nextRank = 2;
    const assigned = finalPlayers.map(p => {
      if (p.rankPosition) return p;
      const isCong = p.cards.length === 13;
      const rank = nextRank++;
      return {
        ...p,
        rankPosition: rank,
        isCong
      };
    });

    // Calculate detailed scores for each player
    const scoredPlayers = assigned.map(p => {
      const chopData = roundChopStats[p.id] || { bonus: 0, penalty: 0 };
      const breakdown = calculateRoundScoreBreakdown(
        { rankPosition: p.rankPosition, isCong: p.isCong, cards: p.cards },
        false,
        chopData.bonus,
        chopData.penalty
      );

      // Coins delta
      let delta = 0;
      if (p.rankPosition === 1) delta = baseBet * 3;
      else if (p.rankPosition === 3) delta = -baseBet * 1;
      else if (p.rankPosition === 4) delta = p.isCong ? -baseBet * 4 : -baseBet * 2;

      return {
        ...p,
        coins: Math.max(0, p.coins + delta),
        scoreBreakdown: breakdown
      };
    });

    setPlayers(scoredPlayers);

    // Human progression calculation
    const humanResult = scoredPlayers.find(p => p.role === 'human');
    if (humanResult && humanResult.scoreBreakdown) {
      const gained = humanResult.scoreBreakdown.expGained;
      const roundPts = humanResult.scoreBreakdown.totalRoundPoints;
      setExpGainedLastRound(gained);
      setCurrentPlayerScore(prev => prev + roundPts);

      // Check level up
      const oldLevel = playerLevel;
      const totalExpNow = playerExp + gained;
      const requiredForCurrent = oldLevel * 200;

      if (totalExpNow >= requiredForCurrent) {
        const newLevel = oldLevel + 1;
        setPlayerLevel(newLevel);
        setPlayerExp(totalExpNow - requiredForCurrent);

        // Find newly unlocked bots
        const unlockedNow = ALL_BOTS.filter(b => b.unlockLevel === newLevel).map(b => b.name);
        if (unlockedNow.length > 0) {
          setNewUnlockedBots(unlockedNow);
        }
      } else {
        setPlayerExp(totalExpNow);
      }
    }

    setIsScoreboardOpen(true);
    setRoundNumber(prev => prev + 1);
  };

  // Human / Bot plays a combo
  const executePlay = useCallback((playerIndex: number, comboToPlay: PlayedCombo) => {
    const player = players[playerIndex];
    if (!player) return;

    // Check chop event (chặt heo / tứ quý)
    const chopInfo = checkIsChop(currentTableCombo, comboToPlay);
    if (chopInfo.isChop && currentTableCombo) {
      soundManager.playLightningChop();
      const bonusCoins = baseBet * chopInfo.multiplier;
      const chopPoints = chopInfo.multiplier * 25; // Points reward for chopping

      setLastChopEvent({
        chopperName: player.name,
        victimName: currentTableCombo.playerName,
        coins: bonusCoins,
        message: `${player.name} ${chopInfo.chopType} của ${currentTableCombo.playerName}!`,
        timestamp: Date.now()
      });

      // Track chop bonus points
      setRoundChopStats(prev => ({
        ...prev,
        [player.id]: {
          bonus: (prev[player.id]?.bonus || 0) + chopPoints,
          penalty: prev[player.id]?.penalty || 0
        },
        [currentTableCombo.playerId]: {
          bonus: prev[currentTableCombo.playerId]?.bonus || 0,
          penalty: (prev[currentTableCombo.playerId]?.penalty || 0) - chopPoints
        }
      }));

      // Transfer chop coins immediately
      setPlayers(prev =>
        prev.map(p => {
          if (p.id === player.id) return { ...p, coins: p.coins + bonusCoins };
          if (p.id === currentTableCombo.playerId) return { ...p, coins: Math.max(0, p.coins - bonusCoins) };
          return p;
        })
      );

      // Victim bot throws funny item back at chopper with 50% chance
      const victimIdx = players.findIndex(p => p.id === currentTableCombo.playerId);
      if (victimIdx !== -1 && players[victimIdx].role === 'bot' && victimIdx !== playerIndex) {
        setTimeout(() => {
          handleThrowItem(playerIndex, Math.random() < 0.5 ? 'slipper' : 'tomato', victimIdx);
        }, 1100);
      }
    } else {
      soundManager.playCardSlam();
    }

    const playedCardIds = new Set(comboToPlay.cards.map(c => c.id));
    const remainingCards = player.cards.filter(c => !playedCardIds.has(c.id));

    let newRankPosition = player.rankPosition;
    if (remainingCards.length === 0 && !newRankPosition) {
      const finishedCount = players.filter(p => p.rankPosition).length;
      newRankPosition = finishedCount + 1;
      
      // Trigger Victory Gold Rain if first player to finish (Tới Nhất)
      if (newRankPosition === 1) {
        setFirstFinisherInfo({
          winnerName: player.name,
          isHumanWinner: player.role === 'human',
          bonusCoins: baseBet * 3
        });
        setTimeout(() => {
          setFirstFinisherInfo(null);
        }, 3200);
      }

      if (player.role === 'human') {
        soundManager.playWin();
      }
    }

    const updatedPlayers = players.map((p, idx) => {
      if (idx === playerIndex) {
        return {
          ...p,
          cards: remainingCards,
          rankPosition: newRankPosition
        };
      }
      return p;
    });

    setPlayers(updatedPlayers);
    setCurrentTableCombo(comboToPlay);
    setLastTrickWinnerIndex(playerIndex);
    setIsFirstTrickOfRound(false);
    setMustPlayThreeOfSpades(false);
    setSelectedCardIds([]);

    advanceTurn(playerIndex, updatedPlayers, comboToPlay);
  }, [advanceTurn, baseBet, currentTableCombo, players]);

  // Player Passes (Bỏ lượt)
  const executePass = useCallback((playerIndex: number) => {
    soundManager.playPass();
    const updatedPlayers = players.map((p, idx) => {
      if (idx === playerIndex) {
        return { ...p, hasPassed: true };
      }
      return p;
    });

    setPlayers(updatedPlayers);
    advanceTurn(playerIndex, updatedPlayers, currentTableCombo);
  }, [advanceTurn, currentTableCombo, players]);

  // Human action: Play selected cards
  const handleHumanPlay = () => {
    const selectedCards = players[0].cards.filter(c => selectedCardIds.includes(c.id));
    const combo = identifyCombo(selectedCards, players[0].id, players[0].name);
    if (!combo) return;

    if (mustPlayThreeOfSpades && isFirstTrickOfRound) {
      const has3S = combo.cards.some(c => c.rank === 3 && c.suit === 'spades');
      if (!has3S) return;
    }

    if (!canBeatCombo(currentTableCombo, combo)) return;

    executePlay(0, combo);
  };

  // Human action: Pass
  const handleHumanPass = () => {
    executePass(0);
  };

  // Human action: Suggest move
  const handleHumanSuggest = () => {
    const combos = getAllPossibleCombos(players[0].cards);
    const valid = combos.filter(c => {
      if (mustPlayThreeOfSpades && isFirstTrickOfRound) {
        if (!c.cards.some(card => card.rank === 3 && card.suit === 'spades')) return false;
      }
      return canBeatCombo(currentTableCombo, c);
    });

    if (valid.length > 0) {
      const chosen = valid[0];
      setSelectedCardIds(chosen.cards.map(c => c.id));
      soundManager.playCardSelect();
    }
  };

  // Human Reaction
  const handleSendReaction = (text?: string, emoji?: string) => {
    setPlayers(prev =>
      prev.map((p, i) =>
        i === 0
          ? {
              ...p,
              reaction: {
                text,
                emoji,
                expiresAt: Date.now() + 3500
              }
            }
          : p
      )
    );
  };

  // Clear reactions timer
  useEffect(() => {
    const interval = setInterval(() => {
      setPlayers(prev =>
        prev.map(p => {
          if (p.reaction && Date.now() > p.reaction.expiresAt) {
            return { ...p, reaction: undefined };
          }
          return p;
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Bot Turn Automation Effect
  useEffect(() => {
    if (gamePhase !== 'playing') return;

    const currentPlayer = players[currentTurnIndex];
    if (!currentPlayer || currentPlayer.role !== 'bot' || currentPlayer.rankPosition || currentPlayer.hasPassed) {
      return;
    }

    if (isExecutingAiTurn.current) return;
    isExecutingAiTurn.current = true;

    // Fast and responsive bot thinking delay (250ms - 400ms)
    const thinkDelay = 250 + Math.random() * 150;

    const timeout = setTimeout(() => {
      if (Math.random() < 0.15) {
        const randomMsg = BOT_CHAT_MESSAGES[Math.floor(Math.random() * BOT_CHAT_MESSAGES.length)];
        const randomEmoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
        setPlayers(prev =>
          prev.map((p, idx) =>
            idx === currentTurnIndex
              ? {
                  ...p,
                  reaction: {
                    text: randomMsg,
                    emoji: randomEmoji,
                    expiresAt: Date.now() + 2500
                  }
                }
              : p
          )
        );
      }

      const move = getAiMove(
        currentPlayer.cards,
        currentTableCombo,
        isFirstTrickOfRound,
        mustPlayThreeOfSpades
      );

      if (move) {
        executePlay(currentTurnIndex, {
          ...move,
          playerId: currentPlayer.id,
          playerName: currentPlayer.name
        });
      } else {
        executePass(currentTurnIndex);
      }

      isExecutingAiTurn.current = false;
    }, thinkDelay);

    return () => {
      clearTimeout(timeout);
      isExecutingAiTurn.current = false;
    };
  }, [currentTurnIndex, gamePhase, currentTableCombo, isFirstTrickOfRound, mustPlayThreeOfSpades, players, executePlay, executePass]);

  // Turn timer countdown (10s max per turn)
  useEffect(() => {
    if (gamePhase !== 'playing') return;

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTurnTimeLeft(prev => {
        if (prev <= 1) {
          if (currentTurnIndex === 0 && !players[0].rankPosition) {
            if (currentTableCombo) {
              executePass(0);
            }
          }
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentTurnIndex, currentTableCombo, gamePhase, players, executePass]);

  const humanPlayer = players[0];
  const isHumanTurn = currentTurnIndex === 0 && !humanPlayer.rankPosition && gamePhase === 'playing';
  const canHumanPass = currentTableCombo !== null;

  return (
    <div
      id="game-root"
      className="relative w-full h-screen min-h-[680px] bg-emerald-950 text-white font-sans overflow-hidden flex flex-col justify-between select-none"
    >
      {/* Vibrant Palette Radial Gradient Background Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-600 via-emerald-800 to-emerald-950 opacity-40 pointer-events-none" />

      {/* Vibrant Palette Header */}
      <header className="relative z-30 h-14 bg-black/30 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-3 sm:px-6">
        {/* Left: Coins Balance & Bet Level */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="bg-emerald-800/50 px-3.5 py-1.5 rounded-full border border-emerald-500/30 flex items-center gap-1.5 shadow-inner">
            <span className="text-yellow-400 font-black text-sm">₫</span>
            <span className="font-mono text-xs sm:text-sm font-bold text-yellow-300">
              {humanPlayer.coins.toLocaleString('vi-VN')} VNĐ
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1 bg-black/20 px-3 py-1 rounded-xl border border-white/5 text-xs text-emerald-300">
            <span>Cược:</span>
            <span className="font-mono text-yellow-400 font-bold">{baseBet.toLocaleString('vi-VN')} VNĐ</span>
          </div>
        </div>

        {/* Right: Leaderboard + Utilities + Lobby Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Leaderboard Button */}
          <button
            type="button"
            id="btn-header-leaderboard"
            onClick={() => setIsLeaderboardOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 border border-yellow-400/50 text-xs font-bold transition cursor-pointer shadow flex items-center gap-1"
            title="Xem Bảng Xếp Hạng"
          >
            <span>🏆</span>
            <span className="hidden sm:inline">BXH</span>
          </button>

          {/* Share / Invite Friends Button */}
          <button
            type="button"
            id="btn-header-share"
            onClick={() => setIsShareOpen(true)}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-400/50 text-xs font-bold transition cursor-pointer shadow flex items-center gap-1"
            title="Mời bạn bè cùng chơi"
          >
            <span>🔗</span>
            <span className="hidden sm:inline">Mời bạn</span>
          </button>

          <ChatEmojiBar
            onSendReaction={handleSendReaction}
            onOpenThrowMenu={() => setSelectedTargetSeatIndex(1)}
          />

          <button
            type="button"
            id="btn-rules"
            onClick={() => setIsRulesOpen(true)}
            className="p-2 sm:px-3 rounded-xl bg-black/30 hover:bg-black/50 text-yellow-400 border border-white/10 text-xs font-bold transition cursor-pointer shadow flex items-center gap-1"
            title="Xem Cách Chơi"
          >
            <span>📜</span> <span className="hidden sm:inline">Cách chơi</span>
          </button>

          <button
            type="button"
            id="btn-sound-toggle"
            onClick={toggleSound}
            className="p-2 rounded-xl bg-black/30 hover:bg-black/50 text-yellow-400 border border-white/10 text-xs font-bold transition cursor-pointer shadow"
            title={soundOn ? 'Tắt âm thanh' : 'Bật âm thanh'}
          >
            {soundOn ? '🔊' : '🔇'}
          </button>

          {/* Roster widget toggle */}
          <button
            type="button"
            id="btn-toggle-roster"
            onClick={() => setShowRosterWidget(!showRosterWidget)}
            className="hidden lg:flex p-2 rounded-xl bg-black/30 hover:bg-black/50 text-emerald-300 border border-white/10 text-xs font-bold transition cursor-pointer shadow"
            title="Ẩn/Hiện danh sách 10 máy"
          >
            👥
          </button>

          {/* Room Lounge button */}
          <button
            type="button"
            id="btn-open-lobby"
            onClick={() => setIsLobbyOpen(true)}
            className="bg-yellow-500 hover:bg-yellow-400 text-emerald-950 px-3.5 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-black uppercase transition-all shadow-lg border-b-2 border-yellow-700 cursor-pointer"
          >
            Phòng VIP
          </button>
        </div>
      </header>

      {/* Waiting Roster Aside Widget from Vibrant Palette design */}
      {showRosterWidget && (
        <aside
          id="waiting-roster-widget"
          className="absolute top-20 right-6 w-48 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 z-20 hidden lg:block shadow-2xl animate-fade-in"
        >
          <div className="flex items-center justify-between mb-3 pb-1 border-b border-white/10">
            <h3 className="text-[10px] font-bold text-yellow-500 uppercase tracking-wider">
              Danh sách 10 máy
            </h3>
            <span className="text-[10px] text-emerald-400 font-mono">
              {ALL_BOTS.filter(b => playerLevel >= b.unlockLevel).length}/10 Mở
            </span>
          </div>
          <div className="space-y-1.5 max-h-[320px] overflow-y-auto pr-1">
            {ALL_BOTS.map(bot => {
              const isPlaying = selectedBots.some(b => b.id === bot.id);
              const isUnlocked = playerLevel >= bot.unlockLevel;

              return (
                <div
                  key={bot.id}
                  className={`flex items-center justify-between text-xs transition-opacity ${
                    !isUnlocked ? 'opacity-40' : isPlaying ? 'opacity-100 font-bold' : 'opacity-75'
                  }`}
                >
                  <span className="flex items-center gap-1.5 text-white">
                    <span>{bot.avatar}</span>
                    <span>{bot.name}</span>
                  </span>
                  {!isUnlocked ? (
                    <span className="text-red-400 text-[10px]">🔒 Lv.{bot.unlockLevel}</span>
                  ) : isPlaying ? (
                    <span className="text-emerald-400 text-[11px]">• Đang chơi</span>
                  ) : (
                    <span className="text-slate-400 text-[11px]">• Chờ</span>
                  )}
                </div>
              );
            })}
          </div>
        </aside>
      )}

      {/* Main Table Gaming Field */}
      <main className="flex-1 relative flex flex-col justify-between items-center px-1 sm:px-4 py-1 overflow-hidden">
        {/* Top Row: All 3 AI Bot Seats aligned horizontally */}
        <div className="relative z-20 flex items-center justify-around w-full max-w-4xl pt-1 px-2 shrink-0">
          {/* Bot 1 (Left) */}
          <div className="flex justify-center flex-1">
            <PlayerSeat
              player={players[1]}
              isCurrentTurn={currentTurnIndex === 1}
              position="top"
              timeLeft={currentTurnIndex === 1 ? turnTimeLeft : 10}
              onAvatarClick={() => setSelectedTargetSeatIndex(1)}
            />
          </div>

          {/* Bot 2 (Center) */}
          <div className="flex justify-center flex-1">
            <PlayerSeat
              player={players[2]}
              isCurrentTurn={currentTurnIndex === 2}
              position="top"
              timeLeft={currentTurnIndex === 2 ? turnTimeLeft : 10}
              onAvatarClick={() => setSelectedTargetSeatIndex(2)}
            />
          </div>

          {/* Bot 3 (Right) */}
          <div className="flex justify-center flex-1">
            <PlayerSeat
              player={players[3]}
              isCurrentTurn={currentTurnIndex === 3}
              position="top"
              timeLeft={currentTurnIndex === 3 ? turnTimeLeft : 10}
              onAvatarClick={() => setSelectedTargetSeatIndex(3)}
            />
          </div>
        </div>

        {/* Center: Open & Spacious Stadium Playing Field */}
        <div className="relative z-10 flex items-center justify-center w-full max-w-5xl px-2 flex-1 my-auto">
          <TableCenter
            currentCombo={currentTableCombo}
            lastChopEvent={lastChopEvent}
            currentTurnName={players[currentTurnIndex]?.name || ''}
            baseBet={baseBet}
            roundNumber={roundNumber}
          />
        </div>

        {/* Bottom Area: Controls & Human Player Hand Fan */}
        <footer className="w-full relative z-20 flex flex-col items-center justify-end pb-1 pt-0.5 bg-gradient-to-t from-black/85 via-black/40 to-transparent shrink-0">
          {/* Game Title "Tiến Lên" & "Chủ phòng đang chơi" Bar */}
          <div className="w-full max-w-4xl px-3 flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2 sm:gap-3 bg-black/50 backdrop-blur-md px-3 py-1 rounded-2xl border border-yellow-400/30 shadow-md">
              <div className="relative">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-yellow-500 rounded-full flex items-center justify-center text-emerald-950 font-black text-xs shadow">
                  CP
                </div>
                <span className="absolute -bottom-1 -right-1 bg-emerald-900 border border-yellow-400 text-yellow-300 font-bold text-[8px] px-1 rounded-full">
                  Lv.{playerLevel}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-black text-yellow-400 uppercase tracking-wider">
                  TIẾN LÊN
                </span>
                <span className="text-white/30 text-xs">•</span>
                <p className="text-[11px] sm:text-xs text-slate-200 font-medium flex items-center gap-1">
                  Chủ phòng <span className="text-emerald-400 font-bold">đang chơi</span>
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
                </p>
              </div>
            </div>

            {/* Quick Hand Stats */}
            <div className="text-[11px] sm:text-xs text-yellow-300 font-bold bg-black/40 px-2.5 py-1 rounded-xl border border-white/10 flex items-center gap-1 shadow">
              <span>🃏 {humanPlayer.cards.length} lá bài</span>
            </div>
          </div>

          {/* Player Interactive Control Buttons */}
          <div className="mb-1.5 w-full">
            <PlayerControls
              selectedCards={humanPlayer.cards.filter(c => selectedCardIds.includes(c.id))}
              currentTableCombo={currentTableCombo}
              isMyTurn={isHumanTurn}
              canPass={canHumanPass}
              onPlayCards={handleHumanPlay}
              onPass={handleHumanPass}
              onSuggest={handleHumanSuggest}
              onSortByRank={handleSortByRank}
              onSortBySuit={handleSortBySuit}
              onClearSelection={() => setSelectedCardIds([])}
              isFirstTrickOfRound={isFirstTrickOfRound}
              mustPlayThreeOfSpades={mustPlayThreeOfSpades}
            />
          </div>

          {/* Human Cards Hand Fan with Overlap */}
          <div
            id="player-hand-container"
            className="flex items-end justify-center w-full max-w-4xl px-2 overflow-x-auto pb-1 -space-x-4 sm:-space-x-5 md:-space-x-6 min-h-[75px] sm:min-h-[92px]"
          >
            {humanPlayer.cards.map((card, idx) => {
              const isSelected = selectedCardIds.includes(card.id);
              const total = humanPlayer.cards.length;
              const angle = total > 1 ? (idx - (total - 1) / 2) * 1.8 : 0;

              return (
                <CardView
                  key={card.id}
                  card={card}
                  isSelected={isSelected}
                  isPlayable={isHumanTurn}
                  onClick={() => handleCardClick(card)}
                  size="md"
                  rotation={angle}
                />
              );
            })}
          </div>
        </footer>
      </main>

      {/* Visual & Audio Game Effects Overlays */}
      {/* 1. Lightning & Fire Chop FX */}
      <ChopLightningEffect chopEvent={lastChopEvent} />

      {/* 2. Card Dealing 52 Cards Animation */}
      {gamePhase === 'dealing' && (
        <CardDealingAnimation onComplete={() => setGamePhase('playing')} />
      )}

      {/* 4. Victory Gold Rain & Fireworks */}
      {firstFinisherInfo && (
        <VictoryGoldRain
          winnerName={firstFinisherInfo.winnerName}
          isHumanWinner={firstFinisherInfo.isHumanWinner}
          bonusCoins={firstFinisherInfo.bonusCoins}
        />
      )}

      {/* 6. Interactive Throwing Items Overlay & Menu */}
      <ThrowItemOverlay
        thrownItems={thrownItems}
        onThrowItem={(targetIdx, type) => handleThrowItem(targetIdx, type, 0)}
        selectedTargetIndex={selectedTargetSeatIndex}
        onCloseMenu={() => setSelectedTargetSeatIndex(null)}
      />

      {/* Modals */}
      <RoomLobbyModal
        isOpen={isLobbyOpen}
        initialSelectedBots={selectedBots}
        initialBet={baseBet}
        playerLevel={playerLevel}
        playerExp={playerExp}
        playerCoins={humanPlayer.coins}
        onStartGame={(chosen, bet) => startNewRound(chosen, bet)}
        onClose={() => setIsLobbyOpen(false)}
        canClose={gamePhase === 'playing'}
      />

      <GameScoreboardModal
        isOpen={isScoreboardOpen}
        players={players}
        baseBet={baseBet}
        playerLevel={playerLevel}
        playerExp={playerExp}
        expGainedLastRound={expGainedLastRound}
        newUnlockedBots={newUnlockedBots}
        onOpenLeaderboard={() => {
          setIsScoreboardOpen(false);
          setIsLeaderboardOpen(true);
        }}
        onNextRound={() => startNewRound()}
        onChangeRoom={() => {
          setIsScoreboardOpen(false);
          setIsLobbyOpen(true);
        }}
      />

      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        leaderboardData={leaderboardData}
        currentPlayerScore={currentPlayerScore}
        currentPlayerLevel={playerLevel}
      />

      <RulesGuideModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />
    </div>
  );
}
