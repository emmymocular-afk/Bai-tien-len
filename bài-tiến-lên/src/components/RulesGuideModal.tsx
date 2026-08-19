import React from 'react';

interface RulesGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesGuideModal: React.FC<RulesGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      id="rules-guide-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none"
    >
      <div className="relative w-full max-w-2xl bg-emerald-950 border-2 border-emerald-500/40 rounded-3xl shadow-2xl p-5 sm:p-7 text-white max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h2 className="text-xl sm:text-2xl font-black text-yellow-400 flex items-center gap-2">
            <span>📜</span> CÁCH CHƠI
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-slate-200 flex items-center justify-center text-base font-bold cursor-pointer border border-white/10"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 space-y-3.5 text-xs sm:text-sm text-slate-200">
          {/* Thứ tự quân bài */}
          <div className="bg-black/30 p-3.5 rounded-2xl border border-white/10">
            <h3 className="font-extrabold text-yellow-400 mb-1.5 flex items-center gap-1.5">
              <span>🃏</span> 1. Thứ Tự Quân Bài & Chất
            </h3>
            <p className="text-slate-300">
              • Độ lớn quân: <strong className="text-white">3 &lt; 4 &lt; 5 &lt; 6 &lt; 7 &lt; 8 &lt; 9 &lt; 10 &lt; J &lt; Q &lt; K &lt; A &lt; 2 (Heo)</strong>.
            </p>
            <p className="text-slate-300 mt-1">
              • Độ lớn chất: <strong className="text-slate-300">Bích (♠)</strong> &lt; <strong className="text-slate-300">Chuồn (♣)</strong> &lt; <strong className="text-rose-400">Rô (♦)</strong> &lt; <strong className="text-rose-500">Cơ (♥)</strong>.
            </p>
            <p className="text-yellow-400/80 text-[11px] mt-1 italic">
              (Lá bài nhỏ nhất: 3♠, lá bài lớn nhất: Heo Cơ 2♥).
            </p>
          </div>

          {/* Các bộ bài hợp lệ */}
          <div className="bg-black/30 p-3.5 rounded-2xl border border-white/10">
            <h3 className="font-extrabold text-yellow-400 mb-1.5 flex items-center gap-1.5">
              <span>🔥</span> 2. Các Bộ Bài Hợp Lệ
            </h3>
            <ul className="space-y-1 text-slate-300 list-disc list-inside">
              <li><strong>Rác (Đơn):</strong> 1 lá bài đơn lẻ.</li>
              <li><strong>Đôi:</strong> 2 lá bài cùng số (ví dụ: đôi 7, đôi Heo).</li>
              <li><strong>Sám cô (Ba lá):</strong> 3 lá bài cùng số (ví dụ: 3 cây K).</li>
              <li><strong>Sảnh:</strong> 3 lá bài liên tiếp trở lên (ví dụ: 5-6-7, J-Q-K-A). <em>Lưu ý: Không được chứa quân 2 trong Sảnh</em>.</li>
              <li><strong>Tứ quý:</strong> 4 lá bài cùng số (ví dụ: 4 cây 9).</li>
              <li><strong>3 đôi thông:</strong> 3 đôi liên tiếp (ví dụ: 66-77-88).</li>
              <li><strong>4 đôi thông:</strong> 4 đôi liên tiếp (ví dụ: 77-88-99-1010).</li>
            </ul>
          </div>

          {/* Quy tắc Chặt Heo & Chặt Hàng */}
          <div className="bg-black/30 p-3.5 rounded-2xl border border-white/10">
            <h3 className="font-extrabold text-yellow-400 mb-1.5 flex items-center gap-1.5">
              <span>💣</span> 3. Luật Chặt Heo & Đôi Thông
            </h3>
            <ul className="space-y-1.5 text-slate-300">
              <li>• <strong>1 Heo (2)</strong> bị chặt bởi: <em>3 đôi thông, Tứ quý, hoặc 4 đôi thông</em>.</li>
              <li>• <strong>Đôi Heo (2 cây 2)</strong> bị chặt bởi: <em>Tứ quý hoặc 4 đôi thông</em>.</li>
              <li>• <strong>3 đôi thông</strong> bị chặt bởi: <em>3 đôi thông lớn hơn, Tứ quý, hoặc 4 đôi thông</em>.</li>
              <li>• <strong>Tứ quý</strong> bị chặt bởi: <em>Tứ quý lớn hơn, hoặc 4 đôi thông</em>.</li>
              <li>• <strong>4 đôi thông</strong> có thể chặt bất cứ lúc nào không cần theo vòng lượt (chặt nhảy lượt)!</li>
            </ul>
          </div>

          {/* Phạt thối & cóng */}
          <div className="bg-black/30 p-3.5 rounded-2xl border border-white/10">
            <h3 className="font-extrabold text-yellow-400 mb-1.5 flex items-center gap-1.5">
              <span>⚠️</span> 4. Thối Heo & Cóng (Cháy Bài)
            </h3>
            <p className="text-slate-300">
              • Khi có người về Nhất, người giữ Heo hoặc Tứ Quý trên tay bị phạt <strong>Thối</strong>:
              Heo đen (1x cược), Heo đỏ (2x cược), Tứ quý (3x cược).
            </p>
            <p className="text-slate-300 mt-1">
              • <strong>Cóng (Cháy bài):</strong> Khi ván kết thúc mà người chơi chưa ra được lá bài nào, sẽ bị xử thua Cóng và phạt 4x cược.
            </p>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-white/10 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-emerald-950 font-black uppercase text-xs sm:text-sm cursor-pointer shadow-lg border-b-4 border-yellow-700 active:translate-y-1 active:border-b-0"
          >
            ĐÃ HIỂU
          </button>
        </div>
      </div>
    </div>
  );
};
