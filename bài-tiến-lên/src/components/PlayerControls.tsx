import React from 'react';
import { Card, PlayedCombo } from '../types/game';
import { canBeatCombo, getComboName, identifyCombo } from '../utils/tienlenEngine';

interface PlayerControlsProps {
  selectedCards: Card[];
  currentTableCombo: PlayedCombo | null;
  isMyTurn: boolean;
  canPass: boolean;
  onPlayCards: () => void;
  onPass: () => void;
  onSuggest: () => void;
  onSortByRank: () => void;
  onSortBySuit: () => void;
  onClearSelection: () => void;
  isFirstTrickOfRound: boolean;
  mustPlayThreeOfSpades: boolean;
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  selectedCards,
  currentTableCombo,
  isMyTurn,
  canPass,
  onPlayCards,
  onPass,
  onSuggest,
  onSortByRank,
  onSortBySuit,
  onClearSelection,
  isFirstTrickOfRound,
  mustPlayThreeOfSpades
}) => {
  // Validate currently selected cards
  const candidateCombo = identifyCombo(selectedCards, 'human', 'Chủ phòng');
  let isValidMove = false;
  let validationMessage = '';

  if (selectedCards.length > 0) {
    if (!candidateCombo) {
      isValidMove = false;
      validationMessage = 'Bài không đúng bộ (Rác, Đôi, Sám, Sảnh, Tứ quý, Đôi thông)';
    } else {
      if (mustPlayThreeOfSpades && isFirstTrickOfRound) {
        const has3S = candidateCombo.cards.some(c => c.rank === 3 && c.suit === 'spades');
        if (!has3S) {
          isValidMove = false;
          validationMessage = 'Ván đầu tiên phải có lá 3 Bích ♠';
        } else {
          isValidMove = canBeatCombo(currentTableCombo, candidateCombo);
          validationMessage = isValidMove ? `Hợp lệ: ${getComboName(candidateCombo)}` : 'Không chặt được bài trên bàn';
        }
      } else {
        isValidMove = canBeatCombo(currentTableCombo, candidateCombo);
        validationMessage = isValidMove ? `Hợp lệ: ${getComboName(candidateCombo)}` : 'Không chặt được bài trên bàn';
      }
    }
  }

  return (
    <div className="flex flex-col items-center gap-1.5 w-full max-w-3xl mx-auto z-30 select-none">
      {/* Selection Status Bar */}
      {selectedCards.length > 0 && (
        <div
          id="selection-status"
          className={`
            flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold shadow-md transition-all backdrop-blur-md
            ${isValidMove
              ? 'bg-emerald-900/90 text-emerald-200 border border-emerald-400 shadow-emerald-900/40'
              : 'bg-red-950/90 text-red-200 border border-red-500 shadow-red-900/40'}
          `}
        >
          <span>{isValidMove ? '✅' : '⚠️'}</span>
          <span>{validationMessage}</span>
          <button
            type="button"
            onClick={onClearSelection}
            className="ml-1.5 underline text-yellow-300 hover:text-white cursor-pointer font-bold"
          >
            Bỏ chọn
          </button>
        </div>
      )}

      {/* Main Action Buttons */}
      <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3 w-full">
        {/* Sort Group */}
        <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-xl border border-white/10 shadow backdrop-blur-md">
          <button
            type="button"
            id="btn-sort-rank"
            onClick={onSortByRank}
            className="px-2.5 py-1 text-xs font-bold text-white hover:text-yellow-400 bg-emerald-900/50 hover:bg-emerald-800/80 rounded-lg transition-colors cursor-pointer flex items-center gap-1 border border-emerald-500/30 active:scale-95"
            title="Xếp bài theo độ lớn"
          >
            <span>🔢</span>
            <span>Số</span>
          </button>
          <button
            type="button"
            id="btn-sort-suit"
            onClick={onSortBySuit}
            className="px-2.5 py-1 text-xs font-bold text-white hover:text-yellow-400 bg-emerald-900/50 hover:bg-emerald-800/80 rounded-lg transition-colors cursor-pointer flex items-center gap-1 border border-emerald-500/30 active:scale-95"
            title="Xếp bài theo chất"
          >
            <span>♠️</span>
            <span>Chất</span>
          </button>
        </div>

        {/* Suggest Button */}
        <button
          type="button"
          id="btn-suggest"
          disabled={!isMyTurn}
          onClick={onSuggest}
          className={`
            px-3.5 sm:px-5 py-1.5 sm:py-2 text-xs font-bold uppercase rounded-xl shadow border-b-2 sm:border-b-3 transition-all flex items-center gap-1 cursor-pointer
            ${isMyTurn
              ? 'bg-blue-600 hover:bg-blue-500 text-white border-blue-800 active:translate-y-0.5 active:border-b-0 shadow-blue-900/30'
              : 'bg-slate-800 text-slate-500 border-slate-900 cursor-not-allowed opacity-50'}
          `}
        >
          <span>💡</span>
          <span>Gợi ý</span>
        </button>

        {/* Pass Button */}
        <button
          type="button"
          id="btn-pass"
          disabled={!isMyTurn || !canPass}
          onClick={onPass}
          className={`
            px-4 sm:px-6 py-1.5 sm:py-2 text-xs font-bold uppercase rounded-xl shadow border-b-2 sm:border-b-3 transition-all flex items-center gap-1 cursor-pointer
            ${isMyTurn && canPass
              ? 'bg-gray-600 hover:bg-gray-500 text-white border-gray-800 active:translate-y-0.5 active:border-b-0 shadow-gray-900/40'
              : 'bg-slate-800 text-slate-600 border-slate-900 cursor-not-allowed opacity-40'}
          `}
        >
          <span>⛔</span>
          <span>Bỏ lượt</span>
        </button>

        {/* Play Button */}
        <button
          type="button"
          id="btn-play-cards"
          disabled={!isMyTurn || !isValidMove}
          onClick={onPlayCards}
          className={`
            px-6 sm:px-9 py-1.5 sm:py-2 text-xs sm:text-sm font-black uppercase rounded-xl shadow-lg border-b-3 transition-all flex items-center gap-1.5 cursor-pointer
            ${isMyTurn && isValidMove
              ? 'bg-yellow-500 hover:bg-yellow-400 text-emerald-950 border-yellow-700 ring-2 ring-yellow-300 shadow-yellow-500/40 active:translate-y-0.5 active:border-b-0'
              : 'bg-slate-800 text-slate-500 border-slate-900 cursor-not-allowed opacity-50'}
          `}
        >
          <span>⚡</span>
          <span>ĐÁNH</span>
        </button>
      </div>
    </div>
  );
};
