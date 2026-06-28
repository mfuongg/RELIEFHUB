import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import PageTransition from '../../components/PageTransition';
import { CheckCircle, Clock, Truck, Package, ChevronDown, ArrowLeft } from 'lucide-react';

const STATUS_MAP = {
  pending:    { label: '⏳ Chờ vận chuyển', cls: 'badge-pending' },
  in_transit: { label: '🚛 Đang vận chuyển', cls: 'badge-info' },
  delivered:  { label: '✅ Đã trao xong',   cls: 'badge-verified' },
};

export default function VolunteerDelivery() {
  const { transports } = useApp();
  const [expanded, setExpanded] = useState({});

  const stats = {
    total: transports.length,
    inTransit: transports.filter(t => t.status === 'in_transit').length,
    delivered: transports.filter(t => t.status === 'delivered').length,
    pending: transports.filter(t => t.status === 'pending').length,
  };

  return (
    <PageTransition>
      <div className="page-container">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Link to="/dashboard/volunteer/transport" className="flex items-center gap-1.5 text-sm text-sky-600 hover:text-sky-800 font-medium">
              <ArrowLeft className="w-4 h-4" /> Quay lại Vận chuyển
            </Link>
          </div>
          <h1 className="section-title">Tình trạng trao hàng</h1>
          <p className="section-subtitle">Xem tình trạng các chuyến hàng (xác nhận do Cán bộ địa phương thực hiện)</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          {[
            { label: 'Tổng cộng', value: stats.total, color: 'bg-gray-50 text-gray-700', icon: '📦' },
            { label: 'Chờ xuất kho', value: stats.pending, color: 'bg-amber-50 text-amber-700', icon: '⏳' },
            { label: 'Đang vận chuyển', value: stats.inTransit, color: 'bg-sky-50 text-sky-700', icon: '🚛' },
            { label: 'Đã trao xong', value: stats.delivered, color: 'bg-emerald-50 text-emerald-700', icon: '✅' },
          ].map((s, i) => (
            <div key={i} className={`rounded-xl p-3 text-center ${s.color} border border-current/10`}>
              <div className="text-lg">{s.icon}</div>
              <div className="text-xl font-bold mt-1">{s.value}</div>
              <div className="text-xs mt-0.5 opacity-70">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Permission note */}
        <div className="mb-5 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">ℹ️</span>
          <div>
            <p className="font-semibold mb-1">Phân quyền trao hàng</p>
            <p>Để đảm bảo tính xác thực, việc <strong>xác nhận đã trao hàng</strong> chỉ được thực hiện bởi <strong>Cán bộ địa phương</strong> — người chịu trách nhiệm quản lý các hộ dân. Tình nguyện viên tham gia vận chuyển nhưng không xác nhận độc lập.</p>
          </div>
        </div>

        <div className="space-y-4">
          {transports.map((t, i) => {
            const st = STATUS_MAP[t.status] || STATUS_MAP.pending;
            const isExpanded = expanded[t.id];
            return (
              <motion.div key={t.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className={`card border-2 ${t.status === 'delivered' ? 'border-emerald-200 bg-emerald-50' : t.status === 'in_transit' ? 'border-sky-200' : 'border-gray-200'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sky-600 text-sm font-mono">{t.id}</span>
                      <span className={st.cls}>{st.label}</span>
                    </div>
                    <div className="font-bold text-gray-900">{t.recipient}</div>
                    <div className="text-sm text-gray-500">📍 {t.area}</div>
                  </div>
                  {t.status === 'delivered' && <CheckCircle className="w-8 h-8 text-emerald-500 flex-shrink-0" />}
                </div>

                <button onClick={() => setExpanded(p => ({ ...p, [t.id]: !p[t.id] }))}
                  className="flex items-center gap-1.5 text-sm text-sky-600 hover:text-sky-800 font-medium mb-2">
                  <Package className="w-4 h-4" /> Danh sách hàng hóa
                  <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>

                {isExpanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden">
                    <div className="bg-gray-50 rounded-xl p-3 mb-3">
                      <table className="w-full text-sm">
                        <thead>
                          <tr>
                            <th className="text-left py-1 text-gray-500 font-medium text-xs">Mặt hàng</th>
                            <th className="text-right py-1 text-gray-500 font-medium text-xs">Số lượng</th>
                            <th className="text-right py-1 text-gray-500 font-medium text-xs">ĐV</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(t.items || []).map((item, idx) => (
                            <tr key={idx} className="border-t border-gray-200">
                              <td className="py-1.5 text-gray-800">{item.name || item}</td>
                              <td className="py-1.5 text-right font-bold text-gray-800">{item.qty || '—'}</td>
                              <td className="py-1.5 text-right text-gray-500">{item.unit || ''}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="mt-1.5 text-xs text-gray-400">👥 {t.households} hộ gia đình</div>
                    </div>
                  </motion.div>
                )}

                {t.deliveredAt && (
                  <div className="text-xs text-emerald-700 flex items-center gap-1 mt-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Trao hàng hoàn tất lúc {new Date(t.deliveredAt).toLocaleString('vi-VN')}
                  </div>
                )}
                {t.notes && <div className="mt-1 text-xs text-gray-500 italic">Ghi chú: {t.notes}</div>}
              </motion.div>
            );
          })}

          {transports.length === 0 && (
            <div className="card text-center py-12 text-gray-400">
              <Truck className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Chưa có chuyến vận chuyển nào</p>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
