import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import PageTransition from '../../components/PageTransition';
import { CheckCircle, Package, Calendar, Users, FileText } from 'lucide-react';

const STATUS_MAP = { pending: { label: '⏳ Chờ trao', cls: 'badge-pending' }, in_transit: { label: '🚛 Đang vận chuyển', cls: 'badge-info' }, delivered: { label: '✅ Đã trao', cls: 'badge-verified' } };

export default function LocalDelivery() {
  const { transports, updateTransportStatus } = useApp();
  const [notes, setNotes] = useState({});
  const [expandedItems, setExpandedItems] = useState({});

  return (
    <PageTransition><div className="page-container">
      <div className="mb-6"><h1 className="section-title">Quản lý trao hàng</h1><p className="section-subtitle">Cán bộ địa phương quản lý và cập nhật tiến trình trao hàng</p></div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[{ label: 'Chờ trao', count: transports.filter(t => t.status === 'pending').length, cls: 'bg-amber-50 text-amber-700 border-amber-200' }, { label: 'Đang vận chuyển', count: transports.filter(t => t.status === 'in_transit').length, cls: 'bg-sky-50 text-sky-700 border-sky-200' }, { label: 'Đã trao xong', count: transports.filter(t => t.status === 'delivered').length, cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' }].map((s, i) => (
          <div key={i} className={`card border-2 ${s.cls} text-center py-3`}><div className="text-2xl font-black">{s.count}</div><div className="text-xs font-medium mt-0.5">{s.label}</div></div>
        ))}
      </div>
      <div className="space-y-4">
        {transports.map((t, i) => { const st = STATUS_MAP[t.status]; const isDelivered = t.status === 'delivered'; const showItems = expandedItems[t.id]; return (
          <motion.div key={t.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className={`card border-2 ${isDelivered ? 'border-emerald-300 bg-emerald-50' : 'border-gray-200'}`}>
            <div className="flex items-start justify-between mb-3"><div><div className="flex items-center gap-2 mb-1"><span className="font-bold text-sky-600 text-sm">{t.id}</span><span className={st.cls}>{st.label}</span></div><div className="font-bold text-gray-900">{t.recipient}</div><div className="text-sm text-gray-500">{t.area}</div></div>{isDelivered && <CheckCircle className="w-8 h-8 text-emerald-500" />}</div>
            <div className="bg-gray-50 rounded-xl p-3 mb-3">
              <button onClick={() => setExpandedItems(p => ({ ...p, [t.id]: !p[t.id] }))} className="w-full flex items-center justify-between text-sm font-medium text-gray-700 mb-1"><span className="flex items-center gap-1.5"><Package className="w-3.5 h-3.5 text-sky-500" /> Hàng hóa trao</span><span className="text-xs text-sky-600">{showItems ? '▲ Thu gọn' : '▼ Xem chi tiết'}</span></button>
              <AnimatePresence>{showItems && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><table className="w-full text-xs mt-2"><thead><tr><th className="text-left py-1 text-gray-500 font-medium">Mặt hàng</th><th className="text-right py-1 text-gray-500 font-medium">Số lượng</th><th className="text-right py-1 text-gray-500 font-medium">Đơn vị</th></tr></thead><tbody>{(t.items || []).map((item, idx) => (<tr key={idx} className="border-t border-gray-200"><td className="py-1.5 text-gray-800 font-medium">{item.name || item}</td><td className="py-1.5 text-right text-gray-800 font-bold">{item.qty || '—'}</td><td className="py-1.5 text-right text-gray-500">{item.unit || ''}</td></tr>))}</tbody></table></motion.div>)}</AnimatePresence>
              <div className="flex items-center gap-3 text-xs text-gray-400 mt-2"><span className="flex items-center gap-1"><Users className="w-3 h-3" /> {t.households} hộ gia đình</span>{t.deliveredAt && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(t.deliveredAt).toLocaleString('vi-VN')}</span>}</div>
            </div>
            {t.notes && <div className="bg-sky-50 rounded-xl p-3 mb-3 text-sm text-sky-800 flex items-start gap-2"><FileText className="w-4 h-4 flex-shrink-0 mt-0.5" /><span><strong>Ghi chú:</strong> {t.notes}</span></div>}
            {!isDelivered && (<div className="space-y-3"><div><label className="label">Ghi chú trao hàng</label><textarea value={notes[t.id] || ''} onChange={e => setNotes({ ...notes, [t.id]: e.target.value })} className="input-field" rows={2} placeholder="Điều kiện thực tế, vấn đề phát sinh..." /></div>
              <div className="grid grid-cols-2 gap-3">{t.status === 'pending' && <button onClick={() => updateTransportStatus(t.id, 'in_transit', notes[t.id] || '')} className="btn-secondary flex items-center justify-center gap-2">🚛 Bắt đầu vận chuyển</button>}<button onClick={() => updateTransportStatus(t.id, 'delivered', notes[t.id] || '')} className={`${t.status === 'pending' ? '' : 'col-span-2'} btn-success flex items-center justify-center gap-2`}><CheckCircle className="w-4 h-4" /> Xác nhận đã trao</button></div>
            </div>)}
          </motion.div>
        );})}
        {transports.length === 0 && <div className="card text-center py-12 text-gray-400"><div className="text-5xl mb-3">📦</div><p>Chưa có chuyến trao hàng nào</p></div>}
      </div>
    </div></PageTransition>
  );
}
