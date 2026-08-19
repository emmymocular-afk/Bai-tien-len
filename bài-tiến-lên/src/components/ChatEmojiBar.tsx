import React, { useState } from 'react';
import { BOT_CHAT_MESSAGES, EMOJIS } from '../data/bots';

interface ChatEmojiBarProps {
  onSendReaction: (text?: string, emoji?: string) => void;
  onOpenThrowMenu?: () => void;
}

export const ChatEmojiBar: React.FC<ChatEmojiBarProps> = ({ onSendReaction, onOpenThrowMenu }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative select-none flex items-center gap-1">
      <button
        type="button"
        id="btn-chat-toggle"
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 rounded-xl bg-black/30 hover:bg-black/50 text-yellow-400 text-xs font-bold border border-white/10 backdrop-blur shadow flex items-center gap-1.5 cursor-pointer"
        title="Biểu cảm / Chat nhanh"
      >
        <span>💬</span>
        <span className="hidden sm:inline">Biểu cảm</span>
      </button>

      {onOpenThrowMenu && (
        <button
          type="button"
          id="btn-throw-item-toggle"
          onClick={onOpenThrowMenu}
          className="px-2.5 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 text-xs font-bold border border-red-500/30 backdrop-blur shadow flex items-center gap-1 cursor-pointer"
          title="Ném đồ chơi (Cà chua, Dép, Bom...)"
        >
          <span>🍅</span>
          <span className="hidden sm:inline">Ném đồ</span>
        </button>
      )}

      {isOpen && (
        <div
          id="chat-popup"
          className="absolute top-12 right-0 sm:left-0 z-50 w-72 bg-emerald-950/95 border-2 border-emerald-500/50 rounded-2xl shadow-2xl p-3 backdrop-blur animate-scale-in text-white"
        >
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
            <span className="text-xs font-bold text-yellow-400">Biểu cảm & Chat nhanh</span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-slate-300 hover:text-white text-xs font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Emojis Grid */}
          <div className="grid grid-cols-5 gap-1.5 mb-3">
            {EMOJIS.map(emoji => (
              <button
                type="button"
                key={emoji}
                onClick={() => {
                  onSendReaction(undefined, emoji);
                  setIsOpen(false);
                }}
                className="p-1.5 text-xl rounded-lg hover:bg-emerald-900 text-center transition cursor-pointer active:scale-125"
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Quick Chat Phrases */}
          <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
            {BOT_CHAT_MESSAGES.map((msg, i) => (
              <button
                type="button"
                key={i}
                onClick={() => {
                  onSendReaction(msg, undefined);
                  setIsOpen(false);
                }}
                className="w-full text-left text-xs p-1.5 rounded-lg hover:bg-emerald-900 hover:text-yellow-400 text-slate-200 transition cursor-pointer truncate"
              >
                {msg}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
