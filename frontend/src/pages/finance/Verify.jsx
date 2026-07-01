import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import PageTransition from '../../components/PageTransition';
import { CheckCircle, XCircle, Eye, Filter, ImageIcon, RotateCcw } from 'lucide-react';

export default function FinanceVerify() {
  const { contributions, updateContributionStatus, user } = useApp();
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('pending');
  const [imgZoom, setImgZoom] = useState(false);

  const filtered = contributions.filter(c => filter === 'all' || c.status === filter);
  const canOverride = user?.role === 'admin';

  return (
    <PageTransition><div className="page-container">
      <div className="mb-6"><h1 className="section-title">Xác minh đóng góp</h1><p className="section-subtitle">Kiểm tra ảnh biên lai và xác nhận các khoản đóng góp</p></div>

      <AnimatePresence>{selected && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">Chi tiết đóng góp #{selected.id}</h2>
            <div className="space-y-2.5 mb-5">{[['Nhà tài trợ', selected.donor], ['Loại đóng góp', selected.type], ['Giá trị', `${(selected.amount / 1e6).toFixed(1)}M VNĐ`], ['Chiến dịch', selected.campaign], ['Ngày ghi nhận', selected.date], ['Ghi chú', selected.notes || '—']].map(([k, v]) => (<div key={k} className="flex justify-between text-sm py-1.5 border-b border-gray-50"><span className="text-gray-500">{k}:</span><span className="font-medium text-gray-900 text-right">{v}</span></div>))}</div>
            <div className="mb-5"><p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5"><ImageIcon className="w-4 h-4 text-orange-500" /> Ảnh biên lai / chứng từ <span className="text-orange-600 font-bold text-xs">(Bắt buộc xem trước khi duyệt)</span></p>
              {selected.evidence ? (<><div className="rounded-xl overflow-hidden border-2 border-orange-200 cursor-zoom-in" onClick={() => setImgZoom(true)} title="Click để phóng to"><img src={selected.evidence} alt="Biên lai" className="w-full max-h-56 object-contain bg-gray-50" /></div><p className="text-xs text-gray-400 mt-1 text-center">Click vào ảnh để phóng to</p></>) : (<div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600"><ImageIcon className="w-4 h-4" />Không có ảnh biên lai — Cân nhắc kỹ trước khi duyệt!</div>)}
            </div>
            {selected.status === 'pending' && (<div className="grid grid-cols-2 gap-3 mb-2"><button onClick={() => { updateContributionStatus(selected.id, 'rejected'); setSelected(null); }} className="btn-danger flex items-center justify-center gap-2"><XCircle className="w-4 h-4" /> Từ chối</button><button onClick={() => { updateContributionStatus(selected.id, 'verified'); setSelected(null); }} className="btn-success flex items-center justify-center gap-2"><CheckCircle className="w-4 h-4" /> Xác minh</button></div>)}
            {canOverride && selected.status !== 'pending' && (<button onClick={() => { updateContributionStatus(selected.id, 'pending', true); setSelected(null); }} className="w-full mb-2 p-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 text-sm font-medium flex items-center justify-center gap-2 hover:bg-amber-100 transition-colors"><RotateCcw className="w-4 h-4" /> Khôi phục về chờ duyệt (Admin override)</button>)}
            <button onClick={() => setSelected(null)} className="w-full btn-secondary">Đóng</button>
          </motion.div>
        </motion.div>
      )}</AnimatePresence>

      <AnimatePresence>{imgZoom && selected?.evidence && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4 cursor-zoom-out" onClick={() => setImgZoom(false)}>
          <img src={selected.evidence} alt="Phóng to biên lai" className="max-w-full max-h-full object-contain rounded-xl" /><p className="absolute bottom-4 text-white/60 text-sm">Click để đóng</p>
        </motion.div>
      )}</AnimatePresence>

      <div className="card">
        <div className="flex flex-wrap items-center gap-2 mb-5"><Filter className="w-4 h-4 text-gray-400" />{['all', 'pending', 'verified', 'rejected'].map(s => (<button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === s ? 'bg-sky-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{s === 'all' ? 'Tất cả' : s === 'pending' ? '⏳ Chờ duyệt' : s === 'verified' ? '✓ Xác minh' : '✗ Từ chối'}{s !== 'all' && <span className="ml-1.5 text-xs opacity-80">({contributions.filter(c => c.status === s).length})</span>}</button>))}</div>
        <div className="space-y-3">
          {filtered.map((c, i) => (<motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center text-xl flex-shrink-0">{c.type === 'Tiền mặt' || c.type === 'Chuyển khoản' ? '💰' : '📦'}</div>
            <div className="flex-1 min-w-0"><div className="font-medium text-sm text-gray-900">{c.donor}</div><div className="text-xs text-gray-500 truncate">{c.campaign}</div><div className="text-xs text-gray-400">{c.date} • {c.type}</div>{c.evidence ? <div className="text-xs text-emerald-600 mt-0.5 flex items-center gap-1"><ImageIcon className="w-3 h-3" /> Có ảnh biên lai</div> : <div className="text-xs text-red-400 mt-0.5 flex items-center gap-1"><ImageIcon className="w-3 h-3" /> Chưa có ảnh</div>}</div>
            <div className="flex items-center gap-3 flex-shrink-0"><div className="text-right"><div className="font-bold text-gray-900">{(c.amount / 1e6).toFixed(1)}M VNĐ</div><span className={c.status === 'verified' ? 'badge-verified' : c.status === 'pending' ? 'badge-pending' : 'badge-rejected'}>{c.status === 'verified' ? '✓ Xác minh' : c.status === 'pending' ? '⏳ Chờ' : '✗ Từ chối'}</span></div>
              <div className="flex gap-1"><button onClick={() => setSelected(c)} className="p-2 rounded-lg bg-sky-50 text-sky-600 hover:bg-sky-100 transition-colors" title="Xem chi tiết & biên lai"><Eye className="w-4 h-4" /></button>{c.status === 'pending' && (<><button onClick={() => updateContributionStatus(c.id, 'verified')} className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors" title="Xác minh"><CheckCircle className="w-4 h-4" /></button><button onClick={() => updateContributionStatus(c.id, 'rejected')} className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors" title="Từ chối"><XCircle className="w-4 h-4" /></button></>)}</div>
            </div>
          </motion.div>))}
          {filtered.length === 0 && <div className="text-center py-12 text-gray-400"><div className="text-4xl mb-3">📋</div><p>Không có đóng góp nào</p></div>}
        </div>
      </div>
    </div></PageTransition>
  );
}
