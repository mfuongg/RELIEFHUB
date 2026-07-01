import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import PageTransition from '../../components/PageTransition';
import { Package, CheckCircle, Truck, Clock, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const STATUS_MAP = { pending: { label: 'Chờ vận chuyển', badge: 'bg-amber-100 text-amber-700', icon: <Clock className="w-4 h-4" /> }, in_transit: { label: 'Đang vận chuyển', badge: 'bg-sky-100 text-sky-700', icon: <Truck className="w-4 h-4" /> }, delivered: { label: 'Đã trao xong', badge: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle className="w-4 h-4" /> } };

export default function PublicTransport() {
  const { transports } = useApp();
  const [expanded, setExpanded] = useState({});
  const stats = { pending: transports.filter(t => t.status === 'pending').length, in_transit: transports.filter(t => t.status === 'in_transit').length, delivered: transports.filter(t => t.status === 'delivered').length };

  return (
    <PageTransition><div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-slate-50">
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40"><div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between"><Link to="/" className="flex items-center gap-2.5"><div className="w-9 h-9 bg-gradient-to-br from-sky-500 to-sky-700 rounded-xl flex items-center justify-center text-lg">🆘</div><span className="font-black text-gray-900 text-lg">ReliefHub</span></Link><div className="flex items-center gap-4 text-sm font-medium"><Link to="/campaigns" className="text-gray-500 hover:text-gray-900 transition-colors">Chiến dịch</Link><Link to="/transport" className="text-sky-600 font-bold">Vận chuyển</Link><Link to="/login" className="btn-primary text-sm py-1.5 px-4">Đăng nhập</Link></div></div></nav>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-8"><h1 className="text-3xl font-black text-gray-900 mb-2">Theo dõi vận chuyển hàng hóa</h1><p className="text-gray-500">Cập nhật theo thời gian thực — minh bạch cho cộng đồng</p></div>
        <div className="grid grid-cols-3 gap-4 mb-8">{[{ key: 'pending', label: 'Chờ vận chuyển', icon: '⏳', cls: 'border-amber-200 bg-amber-50 text-amber-800' }, { key: 'in_transit', label: 'Đang vận chuyển', icon: '🚛', cls: 'border-sky-200 bg-sky-50 text-sky-800' }, { key: 'delivered', label: 'Đã trao xong', icon: '✅', cls: 'border-emerald-200 bg-emerald-50 text-emerald-800' }].map(s => (<div key={s.key} className={`card border-2 ${s.cls} text-center`}><div className="text-3xl mb-1">{s.icon}</div><div className="text-2xl font-black">{stats[s.key]}</div><div className="text-xs font-medium mt-0.5">{s.label}</div></div>))}</div>
        <div className="space-y-4">
          {transports.map((t, i) => { const st = STATUS_MAP[t.status]; const isExpanded = expanded[t.id]; return (
            <motion.div key={t.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-5"><div className="flex items-start justify-between mb-3"><div><div className="flex items-center gap-2 mb-1"><span className="font-bold text-sky-600 text-sm font-mono">{t.id}</span><span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${st.badge}`}>{st.icon} {st.label}</span></div><div className="font-bold text-gray-900">{t.recipient}</div><div className="text-sm text-gray-500 mt-0.5">📍 {t.area}</div></div>{t.status === 'delivered' && <CheckCircle className="w-8 h-8 text-emerald-500" />}</div>
                <button onClick={() => setExpanded(p => ({ ...p, [t.id]: !p[t.id] }))} className="flex items-center gap-1.5 text-sm text-sky-600 hover:text-sky-800 font-medium"><Package className="w-4 h-4" /> Danh sách hàng hóa<ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} /></button>
                {isExpanded && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden mt-3"><div className="bg-gray-50 rounded-xl p-3"><table className="w-full text-sm"><thead><tr><th className="text-left py-1 text-gray-500 font-medium text-xs">Mặt hàng</th><th className="text-right py-1 text-gray-500 font-medium text-xs">Số lượng</th><th className="text-right py-1 text-gray-500 font-medium text-xs">ĐV</th></tr></thead><tbody>{(t.items || []).map((item, idx) => (<tr key={idx} className="border-t border-gray-200"><td className="py-1.5 text-gray-800">{item.name || item}</td><td className="py-1.5 text-right font-bold text-gray-800">{item.qty || '—'}</td><td className="py-1.5 text-right text-gray-500">{item.unit || ''}</td></tr>))}</tbody></table><div className="mt-2 text-xs text-gray-400">👥 {t.households} hộ gia đình</div></div></motion.div>)}
                {t.deliveredAt && <div className="mt-3 text-xs text-emerald-700 flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" />Đã trao lúc {new Date(t.deliveredAt).toLocaleString('vi-VN')}</div>}
                {t.notes && <div className="mt-2 text-xs text-gray-500 italic">Ghi chú: {t.notes}</div>}
              </div>
            </motion.div>
          );})}
        </div>
      </div>
    </div></PageTransition>
  );
}
