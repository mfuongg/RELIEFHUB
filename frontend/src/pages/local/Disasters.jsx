import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import PageTransition from '../../components/PageTransition';
import { Plus, AlertTriangle, Edit2, Trash2, Calendar, X } from 'lucide-react';

const DISASTER_TYPES = ['Lũ lụt', 'Bão', 'Sạt lở đất', 'Hạn hán', 'Động đất', 'Lốc xoáy'];
const LEVELS = ['Nhẹ', 'Trung bình', 'Nghiêm trọng', 'Rất nghiêm trọng'];
const STATUSES = [{ value: 'active', label: '🔴 Khẩn cấp' }, { value: 'recovering', label: '🟡 Phục hồi' }, { value: 'completed', label: '🟢 Hoàn tất' }];
const EMPTY_FORM = { area: '', type: 'Lũ lụt', level: 'Trung bình', status: 'active', households: '', damage: '', disasterDate: '' };

export default function LocalDisasters() {
  const { disasters, addDisaster, updateDisaster, deleteDisaster } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(null);

  const openAdd = () => { setEditTarget(null); setForm({ ...EMPTY_FORM, disasterDate: new Date().toISOString().split('T')[0] }); setErrors({}); setShowModal(true); };
  const openEdit = (d) => { setEditTarget(d.id); setForm({ area: d.area, type: d.type, level: d.level, status: d.status, households: String(d.households || ''), damage: d.damage, disasterDate: d.disasterDate || d.date || '' }); setErrors({}); setShowModal(true); };
  const validate = () => { const e = {}; if (!form.area.trim()) e.area = 'Vui lòng nhập khu vực'; if (!form.damage.trim()) e.damage = 'Vui lòng mô tả thiệt hại'; if (!form.disasterDate) e.disasterDate = 'Vui lòng chọn ngày xảy ra thiên tai'; return e; };
  const handleSave = () => { const e = validate(); if (Object.keys(e).length) { setErrors(e); return; } const data = { ...form, households: parseInt(form.households) || 0 }; if (editTarget) updateDisaster(editTarget, data); else addDisaster(data); setShowModal(false); setEditTarget(null); setForm(EMPTY_FORM); setErrors({}); };
  const handleDelete = (id) => { deleteDisaster(id); setConfirmDelete(null); };

  const levelColor = (level) => (level === 'Nghiêm trọng' || level === 'Rất nghiêm trọng' ? 'badge-rejected' : level === 'Trung bình' ? 'badge-pending' : 'badge-info');
  const statusConfig = (status) => status === 'active' ? { border: 'border-l-red-500', badge: 'badge-rejected', label: '🔴 Khẩn cấp' } : status === 'recovering' ? { border: 'border-l-amber-500', badge: 'badge-pending', label: '🟡 Phục hồi' } : { border: 'border-l-emerald-500', badge: 'badge-verified', label: '🟢 Hoàn tất' };

  return (
    <PageTransition><div className="page-container">
      <div className="flex items-center justify-between mb-6"><div><h1 className="section-title">Cập nhật tình hình thiên tai</h1><p className="section-subtitle">Ghi nhận và quản lý thông tin thiên tai tại địa phương</p></div><button onClick={openAdd} className="btn-danger flex items-center gap-2"><Plus className="w-4 h-4" /> Cập nhật mới</button></div>

      <AnimatePresence>{showModal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }} className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-bold flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-red-500" />{editTarget ? 'Chỉnh sửa phiếu thiên tai' : 'Cập nhật tình hình thiên tai'}</h2><button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100"><X className="w-5 h-5 text-gray-400" /></button></div>
            <div className="space-y-3">
              <div><label className="label">Khu vực bị ảnh hưởng *</label><input value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} className={`input-field ${errors.area ? 'border-red-400' : ''}`} placeholder="Tên tỉnh/huyện/xã" />{errors.area && <p className="text-red-500 text-xs mt-1">{errors.area}</p>}</div>
              <div><label className="label flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-red-500" />Ngày xảy ra thiên tai *<span className="text-xs text-orange-600 font-semibold">(Khác với ngày tạo phiếu)</span></label><input type="date" value={form.disasterDate} onChange={e => setForm({ ...form, disasterDate: e.target.value })} className={`input-field ${errors.disasterDate ? 'border-red-400' : ''}`} max={new Date().toISOString().split('T')[0]} />{errors.disasterDate && <p className="text-red-500 text-xs mt-1">{errors.disasterDate}</p>}</div>
              <div className="grid grid-cols-2 gap-3"><div><label className="label">Loại thiên tai</label><select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="input-field">{DISASTER_TYPES.map(t => <option key={t}>{t}</option>)}</select></div><div><label className="label">Mức độ</label><select value={form.level} onChange={e => setForm({ ...form, level: e.target.value })} className="input-field">{LEVELS.map(l => <option key={l}>{l}</option>)}</select></div></div>
              <div><label className="label">Trạng thái hiện tại</label><select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="input-field">{STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}</select></div>
              <div><label className="label">Số hộ ảnh hưởng</label><input type="number" value={form.households} onChange={e => setForm({ ...form, households: e.target.value })} className="input-field" placeholder="0" min={0} /></div>
              <div><label className="label">Mô tả thiệt hại *</label><textarea value={form.damage} onChange={e => setForm({ ...form, damage: e.target.value })} className={`input-field ${errors.damage ? 'border-red-400' : ''}`} rows={3} placeholder="Mô tả chi tiết thiệt hại..." />{errors.damage && <p className="text-red-500 text-xs mt-1">{errors.damage}</p>}</div>
            </div>
            <div className="flex gap-3 mt-5"><button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Hủy</button><button onClick={handleSave} className="btn-danger flex-1">{editTarget ? 'Lưu thay đổi' : 'Cập nhật'}</button></div>
          </motion.div>
        </motion.div>
      )}</AnimatePresence>

      <AnimatePresence>{confirmDelete && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center">
            <div className="text-5xl mb-3">🗑️</div><h3 className="text-lg font-bold text-gray-900 mb-2">Xác nhận xóa?</h3><p className="text-sm text-gray-500 mb-5">Hành động này không thể hoàn tác.</p>
            <div className="flex gap-3"><button onClick={() => setConfirmDelete(null)} className="btn-secondary flex-1">Hủy</button><button onClick={() => handleDelete(confirmDelete)} className="btn-danger flex-1">Xóa</button></div>
          </motion.div>
        </motion.div>
      )}</AnimatePresence>

      <div className="space-y-4">
        {disasters.length === 0 && <div className="card text-center py-12 text-gray-400"><div className="text-5xl mb-3">🌏</div><p>Chưa có phiếu thiên tai nào</p></div>}
        {disasters.map((d, i) => { const sc = statusConfig(d.status); return (
          <motion.div key={d.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className={`card border-l-4 ${sc.border}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1"><div className="flex flex-wrap items-center gap-3 mb-2"><h3 className="font-bold text-gray-900">{d.area}</h3><span className="badge-rejected">{d.type}</span><span className={levelColor(d.level)}>{d.level}</span><span className={sc.badge}>{sc.label}</span></div>
                <p className="text-sm text-gray-600 mb-2">{d.damage}</p>
                <div className="flex flex-wrap gap-4 text-xs text-gray-400"><span>🏠 {d.households} hộ ảnh hưởng</span><span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Ngày xảy ra: <strong className="text-gray-600">{d.disasterDate || d.date}</strong></span>{d.createdAt && d.createdAt !== d.disasterDate && <span>Tạo phiếu: {d.createdAt}</span>}</div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0 ml-3"><button onClick={() => openEdit(d)} className="p-2 rounded-lg bg-sky-50 text-sky-600 hover:bg-sky-100 transition-colors" title="Chỉnh sửa"><Edit2 className="w-4 h-4" /></button><button onClick={() => setConfirmDelete(d.id)} className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors" title="Xóa"><Trash2 className="w-4 h-4" /></button></div>
            </div>
          </motion.div>
        );})}
      </div>
    </div></PageTransition>
  );
}
