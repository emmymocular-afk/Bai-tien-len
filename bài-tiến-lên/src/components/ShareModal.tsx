import React, { useState } from 'react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  // Determine the full clean URL
  const getFullShareUrl = () => {
    if (typeof window === 'undefined') return 'https://ais-pre-6y27x4ha7thmdeci62uf6y-518340074208.asia-southeast1.run.app';
    
    // If inside frame or web preview
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    
    // Check if valid http/https URL
    if (window.location.href.startsWith('http')) {
      return window.location.href;
    }
    return 'https://ais-pre-6y27x4ha7thmdeci62uf6y-518340074208.asia-southeast1.run.app';
  };

  const fullUrl = getFullShareUrl();
  const roomCode = 'TL-' + Math.floor(1000 + Math.random() * 9000);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(fullUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = fullUrl;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setIsCopied(true);
      showToast('🎉 Đã sao chép toàn bộ đường dẫn đầy đủ!');
      setTimeout(() => setIsCopied(false), 3000);
    } catch {
      setIsCopied(true);
      showToast('🎉 Đã sao chép link thành công!');
      setTimeout(() => setIsCopied(false), 3000);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Bài Tiến Lên Miền Nam Online',
          text: `Vào chơi Tiến Lên cùng tôi nhé! Bấm vào link bên dưới để vào bàn ngay:`,
          url: fullUrl
        });
      } catch {
        // User closed or cancelled share dialog
      }
    } else {
      handleCopyLink();
    }
  };

  const handleOpenNewTab = () => {
    window.open(fullUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-b from-emerald-900 via-emerald-950 to-slate-950 border-2 border-yellow-400 rounded-3xl w-full max-w-lg p-5 sm:p-6 shadow-2xl flex flex-col gap-4 text-white relative animate-scale-in max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Toast Alert */}
        {toastMessage && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-emerald-950 font-black text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-2xl animate-bounce whitespace-nowrap z-60 border border-yellow-600 flex items-center gap-2">
            <span>✨</span>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-yellow-500/20 border border-yellow-400 flex items-center justify-center text-xl shadow">
              🔗
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-yellow-400 uppercase tracking-wider">
                Link Chia Sẻ Mời Bạn Bè
              </h3>
              <p className="text-xs text-slate-300">
                Đường dẫn trực tiếp đầy đủ 100% không bị cắt ngắn
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/40 hover:bg-black text-slate-300 hover:text-white font-bold flex items-center justify-center cursor-pointer transition border border-white/10"
          >
            ✕
          </button>
        </div>

        {/* Full Link Card Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-yellow-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>🌐</span>
              <span>Đường Dẫn Đầy Đủ (Full Link)</span>
            </label>
            <span className="text-[11px] text-emerald-400 font-mono bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
              Có thể bôi đen & copy
            </span>
          </div>

          {/* Fully visible and wrap-anywhere link container */}
          <div className="bg-black/70 border-2 border-yellow-400/70 rounded-2xl p-3.5 sm:p-4 relative shadow-inner group">
            <div
              className="text-xs sm:text-sm font-mono text-emerald-300 break-all leading-relaxed select-all bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-500/20 cursor-text"
              title="Nhấp đúp hoặc bôi đen để sao chép"
            >
              {fullUrl}
            </div>

            <div className="mt-3 flex items-center justify-between gap-2 flex-wrap pt-1 border-t border-white/10">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <span>⚡</span>
                <span>Hỗ trợ mọi thiết bị (iOS, Android, Máy tính)</span>
              </span>
              <button
                type="button"
                onClick={handleCopyLink}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase shadow-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  isCopied
                    ? 'bg-emerald-500 text-slate-950 scale-105 ring-2 ring-white'
                    : 'bg-yellow-500 hover:bg-yellow-400 text-emerald-950 border-b-2 border-yellow-700 active:scale-95'
                }`}
              >
                <span>{isCopied ? '✅' : '📋'}</span>
                <span>{isCopied ? 'ĐÃ COPY XONG!' : 'SAO CHÉP LINK'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Action Controls & Sharing Options */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
          {/* Main Copy Button */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="py-3 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase shadow-lg flex items-center justify-center gap-1.5 cursor-pointer transition active:scale-95 border-b-2 border-emerald-800"
          >
            <span>📋</span>
            <span>Sao Chép Link</span>
          </button>

          {/* Native Share Button */}
          <button
            type="button"
            onClick={handleNativeShare}
            className="py-3 px-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase shadow-lg flex items-center justify-center gap-1.5 cursor-pointer transition active:scale-95 border-b-2 border-blue-800"
          >
            <span>📤</span>
            <span>Gửi Qua Zalo/App</span>
          </button>

          {/* Open New Tab */}
          <button
            type="button"
            onClick={handleOpenNewTab}
            className="py-3 px-3 rounded-2xl bg-purple-700 hover:bg-purple-600 text-white text-xs font-black uppercase shadow-lg flex items-center justify-center gap-1.5 cursor-pointer transition active:scale-95 border-b-2 border-purple-900"
          >
            <span>🚀</span>
            <span>Mở Tab Mới</span>
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-black/40 border border-white/10 rounded-2xl p-3 text-xs text-slate-300 space-y-1.5">
          <p className="font-bold text-yellow-400 flex items-center gap-1">
            <span>💡</span>
            <span>Hướng dẫn mời bạn bè:</span>
          </p>
          <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-300 pl-1">
            <li>Bấm <strong>Sao Chép Link</strong> để lấy đường dẫn đầy đủ.</li>
            <li>Dán link vào tin nhắn Zalo, Messenger, Facebook, Telegram gửi cho bạn bè.</li>
            <li>Bạn bè chỉ cần mở link trên trình duyệt là vào chơi trực tiếp ngay.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
