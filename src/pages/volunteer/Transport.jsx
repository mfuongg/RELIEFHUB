import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import PageTransition from '../../components/PageTransition';
import { MapPin, Truck, Package, Clock, ArrowRight, CheckCircle2, Navigation } from 'lucide-react';

const STATUS_CONFIG = {
  pending:    { label: '⏳ Chờ xuất kho',    cls: 'badge-pending',  dot: 'bg-amber-400' },
  in_transit: { label: '🚚 Đang vận chuyển', cls: 'badge-info',     dot: 'bg-sky-500' },
  delivered:  { label: '✅ Đã trao xong',    cls: 'badge-verified', dot: 'bg-emerald-500' },
};

export default function VolunteerTransport() {
  const { transports, updateTransportStatus } = useApp();
  const [selected, setSelected] = useState(null);

  // Update selected when transports change
  const selectedData = transports.find(t => t.id === selected?.id) || selected;

  const handleStartTransit = (t) => {
    updateTransportStatus(t.id, 'in_transit');
    setSelected({ ...t, status: 'in_transit' });
  };

  return (
    <PageTransition>
      <div className="page-container">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="section-title">Lịch vận chuyển</h1>
            <p className="section-subtitle">Theo dõi và quản lý các chuyến vận chuyển hàng cứu trợ</p>
          </div>
          {/* Link to Delivery tab */}
          <Link to="/dashboard/volunteer/delivery" className="flex items-center gap-1.5 text-sm text-sky-600 font-medium border border-sky-200 px-3 py-2 rounded-xl hover:bg-sky-50 transition-colors">
            <Navigation className="w-4 h-4" />
            Xem trạng thái trao hàng
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Workflow indicator */}
        <div className="mb-5 p-4 bg-sky-50 border border-sky-200 rounded-xl">
          <div className="flex items-center gap-2 flex-wrap text-sm text-sky-800">
            <span className="font-semibold">Quy trình:</span>
            <span className="flex items-center gap-1.5 px-2 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-medium">⏳ Chờ xuất kho</span>
            <ArrowRight className="w-3.5 h-3.5 text-sky-400" />
            <span className="flex items-center gap-1.5 px-2 py-1 bg-sky-100 text-sky-700 rounded-lg text-xs font-medium">🚚 Đang vận chuyển</span>
            <ArrowRight className="w-3.5 h-3.5 text-sky-400" />
            <span className="flex items-center gap-1.5 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-medium">✅ Đã trao xong</span>
            <span className="text-xs text-sky-600 ml-2">— Xác nhận trao hàng do Cán bộ địa phương thực hiện</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Transport list */}
          <div className="space-y-4">
            {transports.length === 0 && (
              <div className="card text-center py-12 text-gray-400">
                <Truck className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Chưa có chuyến vận chuyển nào</p>
              </div>
            )}
            {transports.map((t, i) => {
              const sc = STATUS_CONFIG[t.status] || STATUS_CONFIG.pending;
              return (
                <motion.div key={t.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  onClick={() => setSelected(t)}
                  className={`card cursor-pointer transition-all ${selected?.id === t.id ? 'ring-2 ring-sky-500' : 'hover:shadow-md'}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sky-600 text-sm font-mono">{t.id}</span>
                        <span className={sc.cls}>{sc.label}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700 mt-1.5">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        <span className="font-medium">{t.area}</span>
                      </div>
                      <div className="font-semibold text-gray-800 text-sm mt-0.5">{t.recipient}</div>
                    </div>
                    {t.status === 'pending' && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleStartTransit(t); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-500 text-white text-xs font-medium rounded-lg hover:bg-sky-600"
                      >
                        <Truck className="w-3.5 h-3.5" /> Xuất kho
                      </button>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div className="flex items-start gap-1.5">
                      <Package className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                      <span>{(t.items || []).map(item => `${item.name} ${item.qty}${item.unit}`).join(', ')}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{t.households} hộ gia đình</span>
                    </div>
                  </div>
                  {t.deliveredAt && (
                    <div className="mt-2 text-xs text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Trao xong: {new Date(t.deliveredAt).toLocaleString('vi-VN')}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Detail panel */}
          <div className="card">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-sky-500" />
              Chi tiết chuyến hàng
            </h3>
            {selectedData ? (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-sky-100 to-blue-200 rounded-xl h-40 flex items-center justify-center relative overflow-hidden">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🗺️</div>
                    <div className="text-sm font-semibold text-sky-800">{selectedData.area}</div>
                    <div className="text-xs text-sky-600 mt-1">Điểm giao: {selectedData.recipient}</div>
                  </div>
                  {selectedData.status === 'in_transit' && (
                    <motion.div
                      animate={{ x: [-20, 20, -20] }}
                      transition={{ repeat: Infinity, duration: 3 }}
                      className="absolute text-3xl bottom-3"
                    >🚚</motion.div>
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  {[
                    ['Mã chuyến', selectedData.id],
                    ['Người nhận', selectedData.recipient],
                    ['Khu vực', selectedData.area],
                    ['Số hộ', `${selectedData.households} hộ gia đình`],
                    ['Trạng thái', STATUS_CONFIG[selectedData.status]?.label || selectedData.status],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between py-1.5 border-b border-gray-50">
                      <span className="text-gray-500">{k}:</span>
                      <span className="font-medium text-gray-900">{v}</span>
                    </div>
                  ))}
                </div>

                {/* Items table */}
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="text-xs font-semibold text-gray-600 mb-2">Danh sách hàng hóa</div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th className="text-left py-1 text-xs text-gray-500 font-medium">Mặt hàng</th>
                        <th className="text-right py-1 text-xs text-gray-500 font-medium">Số lượng</th>
                        <th className="text-right py-1 text-xs text-gray-500 font-medium">ĐV</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(selectedData.items || []).map((item, idx) => (
                        <tr key={idx} className="border-t border-gray-200">
                          <td className="py-1.5 text-gray-800">{item.name}</td>
                          <td className="py-1.5 text-right font-bold text-gray-800">{item.qty}</td>
                          <td className="py-1.5 text-right text-gray-500">{item.unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Link to delivery */}
                <Link to="/dashboard/volunteer/delivery"
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-medium hover:bg-emerald-100 transition-colors">
                  <Navigation className="w-4 h-4" />
                  Xem tình trạng trao hàng
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <div className="text-4xl mb-3">👆</div>
                  <p className="text-sm">Chọn một chuyến để xem chi tiết</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
