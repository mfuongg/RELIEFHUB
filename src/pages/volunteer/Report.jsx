import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import PageTransition from '../../components/PageTransition';
import {
  FileText, Upload, Clock, MapPin, CheckCircle2, AlertCircle,
  Camera, Send, Plus, X, Home, Users
} from 'lucide-react';

export default function VolunteerReport() {
  const { user, missions, missionReports, volunteerGroups, submitMissionReport } = useApp();
  const myGroup = volunteerGroups.find(g => g.memberIds?.includes(user?.id));
  const myMissions = missions.filter(m => myGroup && m.assignedGroupId === myGroup.id);
  const myReports = missionReports.filter(r => r.authorId === user?.id);

  const [showForm, setShowForm] = useState(false);
  const [selectedMission, setSelectedMission] = useState('');
  const [form, setForm] = useState({
    activityType: '', activityDate: '', location: '',
    householdsSupported: '', peopleSupported: '',
    description: '', challenges: '', results: '',
  });
  const [errors, setErrors] = useState({});

  const completableMissions = myMissions.filter(m => ['ASSIGNED', 'IN_PROGRESS', 'COMPLETED'].includes(m.status) && !myReports.find(r => r.missionId === m.id));

  const validate = () => {
    const e = {};
    if (!selectedMission) e.mission = 'Chọn nhiệm vụ';
    if (!form.activityType.trim()) e.activityType = 'Bắt buộc';
    if (!form.activityDate) e.activityDate = 'Bắt buộc';
    if (!form.location.trim()) e.location = 'Bắt buộc';
    if (!form.description.trim()) e.description = 'Bắt buộc';
    if (!form.results.trim()) e.results = 'Bắt buộc';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    submitMissionReport({
      missionId: parseInt(selectedMission), groupId: myGroup?.id,
      authorId: user.id, authorName: user.name,
      activityType: form.activityType, activityDate: form.activityDate, location: form.location,
      householdsSupported: parseInt(form.householdsSupported) || 0,
      peopleSupported: parseInt(form.peopleSupported) || 0,
      description: form.description, challenges: form.challenges, results: form.results,
      evidenceFiles: [],
    });
    setShowForm(false);
    setForm({ activityType: '', activityDate: '', location: '', householdsSupported: '', peopleSupported: '', description: '', challenges: '', results: '' });
    setSelectedMission('');
    setErrors({});
  };

  const inp = "w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-400";

  return (
    <PageTransition>
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Báo cáo Hoạt động</h1>
            <p className="text-sm text-gray-500">Ghi nhận kết quả sau mỗi nhiệm vụ cứu trợ</p>
          </div>
          {completableMissions.length > 0 && (
            <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-xl text-sm font-medium hover:bg-rose-600">
              <Plus className="w-4 h-4" /> Tạo báo cáo
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Tổng báo cáo', value: myReports.length, icon: <FileText className="w-5 h-5 text-rose-600" />, color: 'bg-rose-100' },
            { label: 'Đã duyệt', value: myReports.filter(r => r.reviewStatus === 'reviewed').length, icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />, color: 'bg-emerald-100' },
            { label: 'Chờ duyệt', value: myReports.filter(r => r.reviewStatus === 'pending').length, icon: <Clock className="w-5 h-5 text-amber-600" />, color: 'bg-amber-100' },
          ].map((s, i) => (
            <motion.div key={i} whileHover={{ y: -2 }} className="bg-white rounded-2xl p-4 shadow-card border border-gray-100 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>{s.icon}</div>
              <div><div className="text-xl font-bold text-gray-800">{s.value}</div><div className="text-xs text-gray-500">{s.label}</div></div>
            </motion.div>
          ))}
        </div>

        {/* Form */}
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-800 flex items-center gap-2"><FileText className="w-5 h-5 text-rose-500" />Tạo báo cáo nhiệm vụ</h3>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">Chọn nhiệm vụ *</label>
                <select className={inp} value={selectedMission} onChange={e => setSelectedMission(e.target.value)}>
                  <option value="">-- Chọn nhiệm vụ --</option>
                  {completableMissions.map(m => <option key={m.id} value={m.id}>{m.code} – {m.title}</option>)}
                </select>
                {errors.mission && <p className="text-xs text-red-500 mt-0.5">{errors.mission}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">Loại hoạt động *</label>
                  <input className={inp} value={form.activityType} onChange={e => setForm(p => ({ ...p, activityType: e.target.value }))} placeholder="VD: Vận chuyển & Phát lương thực" />
                  {errors.activityType && <p className="text-xs text-red-500 mt-0.5">{errors.activityType}</p>}
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">Ngày hoạt động *</label>
                  <input type="date" className={inp} value={form.activityDate} onChange={e => setForm(p => ({ ...p, activityDate: e.target.value }))} />
                  {errors.activityDate && <p className="text-xs text-red-500 mt-0.5">{errors.activityDate}</p>}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">Địa điểm *</label>
                <input className={inp} value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="VD: Xã Phúc Trạch, Quảng Bình" />
                {errors.location && <p className="text-xs text-red-500 mt-0.5">{errors.location}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">Số hộ được hỗ trợ</label>
                  <input type="number" className={inp} value={form.householdsSupported} onChange={e => setForm(p => ({ ...p, householdsSupported: e.target.value }))} placeholder="VD: 200" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">Số người được hỗ trợ</label>
                  <input type="number" className={inp} value={form.peopleSupported} onChange={e => setForm(p => ({ ...p, peopleSupported: e.target.value }))} placeholder="VD: 850" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">Mô tả hoạt động *</label>
                <textarea className={inp} rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Mô tả chi tiết hoạt động đã thực hiện..." />
                {errors.description && <p className="text-xs text-red-500 mt-0.5">{errors.description}</p>}
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">Khó khăn gặp phải</label>
                <textarea className={inp} rows={2} value={form.challenges} onChange={e => setForm(p => ({ ...p, challenges: e.target.value }))} placeholder="VD: Đường ngập, thiếu vật tư..." />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">Kết quả đạt được *</label>
                <textarea className={inp} rows={2} value={form.results} onChange={e => setForm(p => ({ ...p, results: e.target.value }))} placeholder="VD: 200 hộ nhận đủ suất ăn, không sự cố..." />
                {errors.results && <p className="text-xs text-red-500 mt-0.5">{errors.results}</p>}
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">Ảnh minh chứng</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-rose-300 cursor-pointer">
                  <Camera className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Click để upload ảnh</p>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm">Huỷ</button>
                <button onClick={handleSubmit} className="px-4 py-2 bg-rose-500 text-white rounded-xl text-sm font-medium hover:bg-rose-600 flex items-center gap-1.5"><Send className="w-4 h-4" /> Gửi báo cáo</button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Reports list */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-4">Lịch sử báo cáo</h3>
          {myReports.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-card">
              <div className="text-4xl mb-3">📋</div>
              <p className="text-gray-400">Chưa có báo cáo nào</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myReports.slice().reverse().map(r => {
                const mission = missions.find(m => m.id === r.missionId);
                return (
                  <motion.div key={r.id} whileHover={{ y: -1 }} className="bg-white rounded-2xl p-5 shadow-card border border-gray-100">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800 text-sm">{mission?.title || `Nhiệm vụ #${r.missionId}`}</div>
                        <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-2">
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{r.location}</span>
                          <span>• {r.activityDate}</span>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.reviewStatus === 'reviewed' ? 'bg-emerald-100 text-emerald-700' : r.reviewStatus === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                        {r.reviewStatus === 'reviewed' ? '✓ Đã duyệt' : r.reviewStatus === 'rejected' ? '✗ Từ chối' : '⏳ Chờ duyệt'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs mb-3">
                      <div className="bg-rose-50 rounded-lg p-2 text-center"><div className="font-bold text-rose-700">{r.activityType}</div><div className="text-rose-500">Loại</div></div>
                      <div className="bg-blue-50 rounded-lg p-2 text-center"><div className="font-bold text-blue-700">{r.householdsSupported}</div><div className="text-blue-500">Hộ</div></div>
                      <div className="bg-emerald-50 rounded-lg p-2 text-center"><div className="font-bold text-emerald-700">{r.peopleSupported}</div><div className="text-emerald-500">Người</div></div>
                      <div className="bg-gray-50 rounded-lg p-2 text-center"><div className="font-bold text-gray-700">{r.submittedAt}</div><div className="text-gray-500">Gửi</div></div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2"><strong>Mô tả:</strong> {r.description}</p>
                    <p className="text-sm text-emerald-700 mb-2"><strong>Kết quả:</strong> {r.results}</p>
                    {r.challenges && <div className="flex items-start gap-2 p-2.5 bg-amber-50 rounded-xl text-xs text-amber-700"><AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" /><span>{r.challenges}</span></div>}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
