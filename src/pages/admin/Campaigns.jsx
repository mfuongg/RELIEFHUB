import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import PageTransition from '../../components/PageTransition';
import { Plus, MapPin, Users, Calendar, Flag, X } from 'lucide-react';

export default function AdminCampaigns() {
  const { campaigns, addCampaign, showToast } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    name: '', area: '', type: 'Lũ lụt', target: '',
    start: '', end: '', description: '', households: ''
  });

  const statusLabel = { active: 'Đang diễn ra', completed: 'Hoàn thành', pending: 'Sắp diễn ra' };
  const statusColor = { active: 'badge-verified', completed: 'badge-info', pending: 'badge-pending' };
  const imgMap = { 'Lũ lụt': '🌊', 'Bão': '🌀', 'Sạt lở đất': '⛰️', 'Hạn hán': '☀️', 'Động đất': '🌍', 'Lốc xoáy': '🌪️' };

  const handleAdd = () => {
    if (!form.name.trim() || !form.area.trim() || !form.target) {
      showToast('Vui lòng điền đầy đủ thông tin bắt buộc!', 'error');
      return;
    }
    addCampaign({
      name: form.name.trim(),
      area: form.area.trim(),
      type: form.type,
      target: parseInt(form.target) || 0,
      start: form.start,
      end: form.end,
      description: form.description.trim(),
      households: parseInt(form.households) || 0,
    });
    setForm({ name: '', area: '', type: 'Lũ lụt', target: '', start: '', end: '', description: '', households: '' });
    setShowAdd(false);
  };

  return (
    <PageTransition>
      <div className="page-container">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="section-title">Quản lý chiến dịch</h1>
            <p className="section-subtitle">{campaigns.length} chiến dịch tổng cộng</p>
          </div>
          <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Tạo chiến dịch
          </button>
        </div>

        {showAdd && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-screen overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Tạo chiến dịch mới</h2>
                <button onClick={() => setShowAdd(false)} className="p-2 hover:bg-gray-100 rounded-xl">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="label">Tên chiến dịch <span className="text-red-500">*</span></label>
                  <input
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="input-field"
                    placeholder="VD: Cứu trợ lũ lụt..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Khu vực <span className="text-red-500">*</span></label>
                    <input
                      value={form.area}
                      onChange={e => setForm({ ...form, area: e.target.value })}
                      className="input-field"
                      placeholder="Tỉnh/Thành phố"
                    />
                  </div>
                  <div>
                    <label className="label">Loại thiên tai</label>
                    <select
                      value={form.type}
                      onChange={e => setForm({ ...form, type: e.target.value })}
                      className="input-field"
                    >
                      {Object.keys(imgMap).map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Mục tiêu (VNĐ) <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      value={form.target}
                      onChange={e => setForm({ ...form, target: e.target.value })}
                      className="input-field"
                      placeholder="500000000"
                    />
                  </div>
                  <div>
                    <label className="label">Số hộ ảnh hưởng</label>
                    <input
                      type="number"
                      value={form.households}
                      onChange={e => setForm({ ...form, households: e.target.value })}
                      className="input-field"
                      placeholder="1000"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Ngày bắt đầu</label>
                    <input
                      type="date"
                      value={form.start}
                      onChange={e => setForm({ ...form, start: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="label">Ngày kết thúc</label>
                    <input
                      type="date"
                      value={form.end}
                      onChange={e => setForm({ ...form, end: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>
                <div>
                  <label className="label">Mô tả</label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    className="input-field"
                    rows={3}
                    placeholder="Mô tả chiến dịch..."
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setShowAdd(false)} className="btn-secondary flex-1">Hủy</button>
                <button onClick={handleAdd} className="btn-primary flex-1">Tạo chiến dịch</button>
              </div>
            </motion.div>
          </div>
        )}

        {campaigns.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-3">📋</div>
            <p>Chưa có chiến dịch nào. Hãy tạo chiến dịch đầu tiên!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {campaigns.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="card"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-sky-50 to-blue-100 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
                    {c.image || '🆘'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-gray-900 text-sm leading-tight">{c.name}</h3>
                      <span className={statusColor[c.status] || 'badge-pending'}>
                        {statusLabel[c.status] || c.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{c.area}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{c.households || 0} hộ</span>
                      {c.start && (
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{c.start}</span>
                      )}
                    </div>
                    {c.description && (
                      <p className="text-xs text-gray-400 mt-1.5 line-clamp-2">{c.description}</p>
                    )}
                    <div className="mt-3 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Tiến độ</span>
                        <span className="font-bold text-sky-600">
                          {c.target > 0 ? Math.round((c.raised / c.target) * 100) : 0}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: c.target > 0 ? `${Math.min(100, Math.round((c.raised / c.target) * 100))}%` : '0%' }}
                          transition={{ duration: 1, delay: i * 0.07 }}
                          className="h-full bg-gradient-to-r from-sky-400 to-sky-600 rounded-full"
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>{((c.raised || 0) / 1e6).toFixed(0)}M VNĐ</span>
                        <span>{((c.target || 0) / 1e6).toFixed(0)}M VNĐ</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
