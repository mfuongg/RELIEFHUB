import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import PageTransition from '../../components/PageTransition';
import { Search } from 'lucide-react';

// Full 6-step flow matching need_requests status
const FLOW_STEPS = [
  { key: 'pending',         label: 'Đã gửi đơn',    short: 'Gửi đơn' },
  { key: 'verified',        label: 'Xác minh thực tế', short: 'Xác minh' },
  { key: 'approved',        label: 'Phê duyệt',      short: 'Phê duyệt' },
  { key: 'warehouse_ready', label: 'Kho chuẩn bị',   short: 'Kho' },
  { key: 'in_transit',      label: 'Vận chuyển',     short: 'Vận chuyển' },
  { key: 'delivered',       label: 'Đã nhận hàng',   short: 'Nhận hàng' },
];

const STATUS_BADGE = {
  pending:         { label: '⏳ Chờ xét duyệt',     cls: 'badge-pending' },
  verified:        { label: '🔍 Đang xác minh',      cls: 'badge-info' },
  approved:        { label: '✓ Đã phê duyệt',        cls: 'badge-verified' },
  warehouse_ready: { label: '📦 Kho sẵn sàng',       cls: 'bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full text-xs font-semibold' },
  in_transit:      { label: '🚛 Đang vận chuyển',    cls: 'badge-info' },
  delivered:       { label: '✅ Đã giao thành công', cls: 'badge-verified' },
  rejected:        { label: '✗ Đã từ chối',          cls: 'badge-rejected' },
};

const URGENCY_LABEL = { low: '🟢 Thấp', medium: '🟡 Trung bình', high: '🟠 Cao', critical: '🔴 Khẩn cấp' };

export default function CitizenStatus() {
  const { needs } = useApp();
  const [search, setSearch] = useState('');

  const filtered = needs.filter(n =>
    n.citizen.toLowerCase().includes(search.toLowerCase()) ||
    n.area.toLowerCase().includes(search.toLowerCase()) ||
    n.items.toLowerCase().includes(search.toLowerCase())
  );

  const getStepIdx = (status) => {
    if (status === 'rejected') return -1;
    const idx = FLOW_STEPS.findIndex(s => s.key === status);
    return idx >= 0 ? idx : 0;
  };

  return (
    <PageTransition>
      <div className="page-container">
        <div className="mb-6">
          <h1 className="section-title">Tra cứu trạng thái hỗ trợ</h1>
          <p className="section-subtitle">Theo dõi tiến độ xử lý đơn yêu cầu qua 6 bước</p>
        </div>

        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="input-field pl-10" placeholder="Tìm theo tên, khu vực, mặt hàng..." />
        </div>

        <div className="space-y-5">
          {filtered.map((n, i) => {
            const stepIdx = getStepIdx(n.status);
            const badge = STATUS_BADGE[n.status] || STATUS_BADGE.pending;
            const isRejected = n.status === 'rejected';
            const isDone = n.status === 'delivered';

            return (
              <motion.div key={n.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`card border-2 ${isDone ? 'border-emerald-300 bg-emerald-50/40' : isRejected ? 'border-red-200 bg-red-50/30' : 'border-gray-200'}`}>

                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-bold text-gray-900">{n.citizen}</div>
                    <div className="text-sm text-gray-500">{n.area} • {n.date}</div>
                  </div>
                  <span className={badge.cls}>{badge.label}</span>
                </div>

                {/* Items + urgency */}
                <div className="bg-gray-50 rounded-xl p-3 mb-3 text-sm">
                  <span className="font-medium text-gray-700">Yêu cầu:</span> <span className="text-gray-800">{n.items}</span>
                  <div className="flex gap-3 mt-1 text-xs text-gray-500">
                    <span>👥 {n.households} hộ</span>
                    <span>{URGENCY_LABEL[n.urgency] || n.urgency}</span>
                    {n.managedBy && <span>👤 {n.managedBy}</span>}
                  </div>
                  {n.warehouseNote && (
                    <div className="mt-1 text-xs text-purple-700">📦 {n.warehouseNote}</div>
                  )}
                </div>

                {/* 6-step progress */}
                {!isRejected ? (
                  <div className="overflow-x-auto">
                    <div className="flex items-start min-w-max">
                      {FLOW_STEPS.map((step, idx) => {
                        const done = idx <= stepIdx;
                        return (
                          <div key={step.key} className="flex items-center">
                            <div className="flex flex-col items-center w-14">
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all
                                ${isDone && idx === FLOW_STEPS.length - 1 ? 'border-emerald-500 bg-emerald-500 text-white' :
                                  done ? 'border-sky-500 bg-sky-500 text-white' :
                                  'border-gray-200 bg-gray-50 text-gray-400'}`}>
                                {done ? '✓' : idx + 1}
                              </div>
                              <div className={`text-xs mt-0.5 text-center leading-tight ${done ? 'text-sky-600 font-medium' : 'text-gray-400'}`}>
                                {step.short}
                              </div>
                            </div>
                            {idx < FLOW_STEPS.length - 1 && (
                              <div className={`h-0.5 w-4 mb-4 mx-0.5 flex-shrink-0 ${idx < stepIdx ? 'bg-sky-400' : 'bg-gray-200'}`} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                    ❌ Yêu cầu đã bị từ chối. Vui lòng liên hệ cán bộ địa phương để biết thêm chi tiết.
                  </div>
                )}
              </motion.div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-3">🔍</div>
              <p>Không tìm thấy yêu cầu nào</p>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
