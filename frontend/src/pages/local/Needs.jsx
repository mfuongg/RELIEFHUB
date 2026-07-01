import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle, XCircle, Clock, Package, Truck, Star,
  Search, Filter, ChevronDown, AlertTriangle, User, MapPin,
  Home, FileText, ArrowRight, Eye, RefreshCw
} from 'lucide-react';

const URGENCY_CONFIG = {
  critical: { label: 'Khẩn cấp', color: 'bg-red-100 text-red-700 border border-red-200', dot: 'bg-red-500' },
  high:     { label: 'Cao',      color: 'bg-orange-100 text-orange-700 border border-orange-200', dot: 'bg-orange-500' },
  medium:   { label: 'Trung bình', color: 'bg-yellow-100 text-yellow-700 border border-yellow-200', dot: 'bg-yellow-500' },
  low:      { label: 'Thấp',     color: 'bg-green-100 text-green-700 border border-green-200', dot: 'bg-green-500' },
};

// 6-step flow
const STATUS_STEPS = [
  { key: 'pending',         label: 'Chờ duyệt',       icon: Clock,       color: 'text-gray-500',   bg: 'bg-gray-100' },
  { key: 'verified',        label: 'Đã xác minh',     icon: CheckCircle, color: 'text-blue-600',   bg: 'bg-blue-100' },
  { key: 'approved',        label: 'Đã phê duyệt',    icon: Star,        color: 'text-purple-600', bg: 'bg-purple-100' },
  { key: 'warehouse_ready', label: 'Kho chuẩn bị',    icon: Package,     color: 'text-amber-600',  bg: 'bg-amber-100' },
  { key: 'in_transit',      label: 'Đang vận chuyển', icon: Truck,       color: 'text-indigo-600', bg: 'bg-indigo-100' },
  { key: 'delivered',       label: 'Đã nhận hàng',    icon: Star,        color: 'text-green-600',  bg: 'bg-green-100' },
];
const REJECTED = { key: 'rejected', label: 'Từ chối', icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' };

const NEXT_STATUS = {
  pending:         'verified',
  verified:        'approved',
  approved:        'warehouse_ready',
  warehouse_ready: 'in_transit',
  in_transit:      'delivered',
};

function StatusBadge({ status }) {
  const s = STATUS_STEPS.find(x => x.key === status) || REJECTED;
  const Icon = s.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${s.bg} ${s.color}`}>
      <Icon size={12} /> {s.label}
    </span>
  );
}

function StepProgress({ status }) {
  const idx = STATUS_STEPS.findIndex(s => s.key === status);
  if (status === 'rejected') return (
    <div className="flex items-center gap-2 text-red-500 text-xs"><XCircle size={14}/> Đã từ chối</div>
  );
  return (
    <div className="flex items-center gap-0">
      {STATUS_STEPS.map((step, i) => {
        const done = i < idx;
        const active = i === idx;
        const Icon = step.icon;
        return (
          <React.Fragment key={step.key}>
            <div className="flex flex-col items-center">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all
                ${done ? 'bg-green-500 border-green-500 text-white' : active ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
                <Icon size={13}/>
              </div>
              <span className={`text-[9px] mt-1 font-medium w-14 text-center leading-tight
                ${done ? 'text-green-600' : active ? 'text-blue-600' : 'text-gray-400'}`}>
                {step.label}
              </span>
            </div>
            {i < STATUS_STEPS.length - 1 && (
              <div className={`h-0.5 w-6 mb-4 ${i < idx ? 'bg-green-400' : 'bg-gray-200'}`}/>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function LocalNeeds() {
  const { needs, updateNeedStatus, user, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [filterUrgency, setFilterUrgency] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selected, setSelected] = useState(null);
  const [rejectNote, setRejectNote] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(null);

  const filtered = needs.filter(n => {
    const matchSearch = n.citizen?.toLowerCase().includes(search.toLowerCase()) ||
      n.area?.toLowerCase().includes(search.toLowerCase()) ||
      n.items?.toLowerCase().includes(search.toLowerCase());
    const matchUrgency = filterUrgency === 'all' || n.urgency === filterUrgency;
    const matchStatus = filterStatus === 'all' || n.status === filterStatus;
    return matchSearch && matchUrgency && matchStatus;
  });

  const handleAdvance = (need) => {
    const next = NEXT_STATUS[need.status];
    if (!next) return;
    updateNeedStatus(need.id, next, user?.name);
    setSelected(prev => prev?.id === need.id ? { ...prev, status: next } : prev);
  };

  const handleReject = (need) => {
    setShowRejectModal(need);
    setRejectNote('');
  };

  const confirmReject = () => {
    if (!showRejectModal) return;
    updateNeedStatus(showRejectModal.id, 'rejected', user?.name);
    if (selected?.id === showRejectModal.id) setSelected(prev => ({ ...prev, status: 'rejected' }));
    setShowRejectModal(null);
    showToast('Đã từ chối yêu cầu', 'error');
  };

  const stats = {
    total: needs.length,
    pending: needs.filter(n => n.status === 'pending').length,
    verified: needs.filter(n => n.status === 'verified').length,
    approved: needs.filter(n => n.status === 'approved').length,
    inTransit: needs.filter(n => n.status === 'in_transit').length,
    delivered: needs.filter(n => n.status === 'delivered').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Yêu cầu Hỗ trợ</h1>
          <p className="text-gray-500 text-sm mt-1">Theo dõi và cập nhật trạng thái 6 bước</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {[
          { label: 'Tổng', value: stats.total, color: 'bg-gray-50 border-gray-200 text-gray-700' },
          { label: 'Chờ duyệt', value: stats.pending, color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
          { label: 'Xác minh', value: stats.verified, color: 'bg-blue-50 border-blue-200 text-blue-700' },
          { label: 'Phê duyệt', value: stats.approved, color: 'bg-purple-50 border-purple-200 text-purple-700' },
          { label: 'Vận chuyển', value: stats.inTransit, color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
          { label: 'Hoàn tất', value: stats.delivered, color: 'bg-green-50 border-green-200 text-green-700' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border p-3 text-center ${s.color}`}>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-xs font-medium mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Tìm kiếm..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select value={filterUrgency} onChange={e => setFilterUrgency(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="all">Tất cả mức độ</option>
          {Object.entries(URGENCY_CONFIG).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="all">Tất cả trạng thái</option>
          {[...STATUS_STEPS, REJECTED].map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Người dân</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Nhu cầu</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Mức độ</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Trạng thái</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Tiến trình</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400">Không có yêu cầu nào</td></tr>
              )}
              {filtered.map(need => {
                const urg = URGENCY_CONFIG[need.urgency] || URGENCY_CONFIG.medium;
                const hasNext = !!NEXT_STATUS[need.status];
                return (
                  <tr key={need.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User size={14} className="text-blue-600"/>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{need.citizen}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <MapPin size={10}/>{need.area}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-700 max-w-[180px] truncate">{need.items}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <Home size={10}/>{need.households} hộ • {need.date}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${urg.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${urg.dot}`}/>
                        {urg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={need.status}/></td>
                    <td className="px-4 py-3">
                      <StepProgress status={need.status}/>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => setSelected(need)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors" title="Chi tiết">
                          <Eye size={15}/>
                        </button>
                        {hasNext && (
                          <button onClick={() => handleAdvance(need)}
                            className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-500 text-white rounded-lg text-xs font-medium hover:bg-blue-600 transition-colors">
                            <ArrowRight size={12}/> Tiếp theo
                          </button>
                        )}
                        {need.status !== 'rejected' && need.status !== 'delivered' && (
                          <button onClick={() => handleReject(need)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Từ chối">
                            <XCircle size={15}/>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Chi tiết Yêu cầu</h2>
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-500">Người dân:</span> <span className="font-medium ml-1">{selected.citizen}</span></div>
                <div><span className="text-gray-500">Khu vực:</span> <span className="font-medium ml-1">{selected.area}</span></div>
                <div><span className="text-gray-500">Số hộ:</span> <span className="font-medium ml-1">{selected.households}</span></div>
                <div><span className="text-gray-500">Ngày gửi:</span> <span className="font-medium ml-1">{selected.date}</span></div>
                <div className="col-span-2"><span className="text-gray-500">Nhu cầu:</span> <span className="font-medium ml-1">{selected.items}</span></div>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-700 mb-3">Tiến trình 6 bước:</div>
                <StepProgress status={selected.status}/>
              </div>
              <div className="flex items-center gap-3 pt-2">
                {NEXT_STATUS[selected.status] && (
                  <button onClick={() => { handleAdvance(selected); }}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors">
                    <ArrowRight size={16}/>
                    Chuyển sang: {STATUS_STEPS.find(s => s.key === NEXT_STATUS[selected.status])?.label}
                  </button>
                )}
                {selected.status !== 'rejected' && selected.status !== 'delivered' && (
                  <button onClick={() => { handleReject(selected); setSelected(null); }}
                    className="px-4 py-2.5 border border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50 transition-colors">
                    Từ chối
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Confirm Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle size={20} className="text-red-600"/>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Xác nhận từ chối</h3>
                <p className="text-sm text-gray-500">Yêu cầu của {showRejectModal.citizen}</p>
              </div>
            </div>
            <textarea value={rejectNote} onChange={e => setRejectNote(e.target.value)}
              placeholder="Lý do từ chối (tuỳ chọn)..."
              className="w-full border border-gray-200 rounded-xl p-3 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none" rows={3}/>
            <div className="flex gap-3">
              <button onClick={() => setShowRejectModal(null)}
                className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50">
                Huỷ
              </button>
              <button onClick={confirmReject}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600">
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
