import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle, Clock, XCircle, Package, Truck, Star,
  Camera, Upload, FileText, AlertCircle
} from 'lucide-react';

const STATUS_STEPS = [
  { key: 'pending',         label: 'Gửi đơn',          icon: FileText,    color: 'text-gray-500',   bg: 'bg-gray-100',   border: 'border-gray-300' },
  { key: 'verified',        label: 'Xác minh',         icon: CheckCircle, color: 'text-blue-600',   bg: 'bg-blue-100',   border: 'border-blue-400' },
  { key: 'approved',        label: 'Phê duyệt',        icon: Star,        color: 'text-purple-600', bg: 'bg-purple-100', border: 'border-purple-400' },
  { key: 'warehouse_ready', label: 'Kho chuẩn bị',     icon: Package,     color: 'text-amber-600',  bg: 'bg-amber-100',  border: 'border-amber-400' },
  { key: 'in_transit',      label: 'Vận chuyển',       icon: Truck,       color: 'text-indigo-600', bg: 'bg-indigo-100', border: 'border-indigo-400' },
  { key: 'delivered',       label: 'Đã nhận hàng',     icon: Star,        color: 'text-green-600',  bg: 'bg-green-100',  border: 'border-green-400' },
];

function StepProgress({ status }) {
  if (status === 'rejected') return (
    <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl border border-red-100 text-red-600 text-sm">
      <XCircle size={16}/> Yêu cầu đã bị từ chối
    </div>
  );
  const idx = STATUS_STEPS.findIndex(s => s.key === status);
  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex items-center min-w-max gap-0">
        {STATUS_STEPS.map((step, i) => {
          const done   = i < idx;
          const active = i === idx;
          const Icon   = step.icon;
          return (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all
                  ${done   ? 'bg-green-500 border-green-500 text-white shadow-md'
                  : active ? 'bg-blue-500 border-blue-500 text-white shadow-md ring-4 ring-blue-100'
                           : 'bg-white border-gray-300 text-gray-400'}`}>
                  <Icon size={15}/>
                </div>
                <span className={`text-[10px] mt-1.5 font-medium w-16 text-center leading-tight
                  ${done ? 'text-green-600' : active ? 'text-blue-700 font-bold' : 'text-gray-400'}`}>
                  {step.label}
                </span>
                {active && <span className="text-[9px] text-blue-500 mt-0.5 animate-pulse">● Hiện tại</span>}
              </div>
              {i < STATUS_STEPS.length - 1 && (
                <div className={`h-0.5 w-8 mb-5 transition-all ${i < idx ? 'bg-green-400' : 'bg-gray-200'}`}/>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const s = STATUS_STEPS.find(x => x.key === status);
  if (status === 'rejected') return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
      <XCircle size={12}/> Từ chối
    </span>
  );
  if (!s) return null;
  const Icon = s.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${s.bg} ${s.color} border ${s.border}`}>
      <Icon size={12}/> {s.label}
    </span>
  );
}

export default function CitizenReceipt() {
  const { needs, user, updateNeedStatus, showToast } = useApp();
  const [confirmModal, setConfirmModal] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [note, setNote]   = useState('');

  const myNeeds = needs.filter(n =>
    n.citizen === user?.name ||
    n.citizenId === user?.id ||
    n.userId === user?.id
  );

  const handleConfirmReceive = (need) => {
    setConfirmModal(need);
    setPhoto(null);
    setNote('');
  };

  const handlePhotoCapture = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => setPhoto(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const submitConfirm = () => {
    if (!confirmModal) return;
    updateNeedStatus(confirmModal.id, 'delivered', user?.name);
    showToast('✅ Xác nhận nhận hàng thành công!', 'success');
    setConfirmModal(null);
  };

  const pending   = myNeeds.filter(n => !['delivered','rejected'].includes(n.status));
  const completed = myNeeds.filter(n => n.status === 'delivered');
  const rejected  = myNeeds.filter(n => n.status === 'rejected');

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Theo dõi & Xác nhận Nhận hàng</h1>
        <p className="text-gray-500 text-sm mt-1">Trạng thái 6 bước và xác nhận khi nhận được hàng cứu trợ</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Đang xử lý', value: pending.length,   color: 'bg-blue-50 border-blue-200 text-blue-700' },
          { label: 'Hoàn thành', value: completed.length, color: 'bg-green-50 border-green-200 text-green-700' },
          { label: 'Từ chối',    value: rejected.length,  color: 'bg-red-50 border-red-200 text-red-700' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border p-4 text-center ${s.color}`}>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-xs font-medium mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {myNeeds.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <FileText size={40} className="mx-auto mb-3 opacity-40"/>
          <p className="font-medium">Bạn chưa có yêu cầu hỗ trợ nào</p>
        </div>
      )}

      {/* Active requests */}
      {pending.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Clock size={16} className="text-blue-500"/> Đang xử lý ({pending.length})
          </h2>
          <div className="space-y-4">
            {pending.map(need => (
              <div key={need.id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{need.items}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">📍 {need.area} • {need.date} • {need.households} hộ</p>
                  </div>
                  <StatusBadge status={need.status}/>
                </div>
                <StepProgress status={need.status}/>
                {need.status === 'in_transit' && (
                  <div className="mt-4 p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                    <div className="flex items-center gap-2 text-indigo-700 text-sm font-medium mb-2">
                      <Truck size={15}/> Hàng đang trên đường giao
                    </div>
                    <p className="text-xs text-indigo-600">Khi nhận được hàng, hãy xác nhận bên dưới.</p>
                    <button onClick={() => handleConfirmReceive(need)}
                      className="mt-3 w-full py-2.5 bg-green-500 text-white rounded-xl font-medium text-sm hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
                      <CheckCircle size={16}/> Xác nhận đã nhận hàng
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <CheckCircle size={16} className="text-green-500"/> Đã hoàn thành ({completed.length})
          </h2>
          <div className="space-y-3">
            {completed.map(need => (
              <div key={need.id} className="bg-green-50 border border-green-200 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-800 text-sm">{need.items}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">📍 {need.area} • {need.date}</p>
                  </div>
                  <StatusBadge status="delivered"/>
                </div>
                {need.confirmedAt && (
                  <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                    <CheckCircle size={11}/> Xác nhận lúc: {need.confirmedAt}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rejected */}
      {rejected.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <XCircle size={16} className="text-red-500"/> Đã từ chối ({rejected.length})
          </h2>
          <div className="space-y-3">
            {rejected.map(need => (
              <div key={need.id} className="bg-red-50 border border-red-200 rounded-2xl p-4">
                <h3 className="font-medium text-gray-800 text-sm">{need.items}</h3>
                <p className="text-xs text-gray-500 mt-0.5">📍 {need.area} • {need.date}</p>
                <StatusBadge status="rejected"/>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {confirmModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Xác nhận nhận hàng</h2>
              <p className="text-sm text-gray-500 mt-1">{confirmModal.items}</p>
            </div>
            <div className="p-6 space-y-4">
              {/* Photo capture */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ảnh xác nhận <span className="text-gray-400 font-normal">(tuỳ chọn)</span>
                </label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center">
                  {photo ? (
                    <img src={photo} alt="confirm" className="max-h-40 mx-auto rounded-lg object-cover"/>
                  ) : (
                    <div className="text-gray-400">
                      <Camera size={28} className="mx-auto mb-2"/>
                      <p className="text-sm">Chụp ảnh hoặc tải lên</p>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handlePhotoCapture}
                    className="mt-3 text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú</label>
                <textarea value={note} onChange={e => setNote(e.target.value)}
                  placeholder="Ví dụ: Nhận đủ 50kg gạo, 5 thùng mì..."
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" rows={3}/>
              </div>
              <div className="flex gap-3 pt-1">
                <button onClick={() => setConfirmModal(null)}
                  className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50">
                  Huỷ
                </button>
                <button onClick={submitConfirm}
                  className="flex-1 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 flex items-center justify-center gap-2">
                  <CheckCircle size={16}/> Xác nhận
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
