import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import PageTransition from '../../components/PageTransition';
import {
  ClipboardList, Plus, MapPin, Calendar, Users, Zap, CheckCircle2,
  Clock, X, Send, Filter, Search, Eye, AlertCircle, Package,
  ChevronDown, Flag, DollarSign, Truck, Crown, Star, ShieldCheck
} from 'lucide-react';

const STATUS_CONFIG = {
  OPEN:        { label: 'Đang mở',        color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  ASSIGNED:    { label: 'Đã giao',         color: 'bg-blue-100 text-blue-700',      dot: 'bg-blue-500' },
  IN_PROGRESS: { label: 'Đang thực hiện', color: 'bg-amber-100 text-amber-700',    dot: 'bg-amber-500' },
  COMPLETED:   { label: 'Hoàn thành',     color: 'bg-gray-100 text-gray-600',      dot: 'bg-gray-400' },
  CANCELLED:   { label: 'Đã huỷ',         color: 'bg-red-100 text-red-600',        dot: 'bg-red-400' },
};

const PRIORITY_CONFIG = {
  critical: { label: '🔴 Khẩn cấp',     color: 'bg-red-100 text-red-700 border-red-200' },
  high:     { label: '🟠 Ưu tiên cao',  color: 'bg-orange-100 text-orange-700 border-orange-200' },
  medium:   { label: '🟡 Trung bình',   color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  low:      { label: '⚪ Thấp',          color: 'bg-gray-100 text-gray-600 border-gray-200' },
};

// ─── Create Mission Modal ─────────────────────────────────────────────────────
function CreateMissionModal({ campaigns, onClose, onSubmit }) {
  const [form, setForm] = useState({
    title: '', description: '', campaignId: '', area: '', gps: '',
    priority: 'medium', startDate: '', deadline: '',
    requiredVolunteers: 5, estimatedHours: 4,
    equipment: '', budget: '', campaign: '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Bắt buộc';
    if (!form.campaignId) e.campaignId = 'Chọn chiến dịch';
    if (!form.area.trim()) e.area = 'Bắt buộc';
    if (!form.deadline) e.deadline = 'Bắt buộc';
    if (!form.description.trim()) e.description = 'Bắt buộc';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const camp = campaigns.find(c => c.id === parseInt(form.campaignId));
    onSubmit({ ...form, campaignId: parseInt(form.campaignId), campaign: camp?.name || '', requiredVolunteers: parseInt(form.requiredVolunteers), estimatedHours: parseFloat(form.estimatedHours), budget: parseFloat(form.budget) || 0, equipment: form.equipment.split(',').map(s => s.trim()).filter(Boolean) });
    onClose();
  };

  const inp = "w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500/30 focus:border-slate-400";
  const F = ({ label, error, children }) => (
    <div><label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>{children}{error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}</div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl">
        <div className="p-5 border-b flex items-center justify-between">
          <div><h2 className="text-lg font-bold text-gray-800">Tạo nhiệm vụ cứu trợ</h2><p className="text-xs text-gray-400 mt-0.5">Admin phân phát nhiệm vụ cho nhóm tình nguyện</p></div>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <F label="Tên nhiệm vụ *" error={errors.title}>
            <input className={inp} value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="VD: Vận chuyển 500 suất ăn đến xã Phúc Trạch" />
          </F>
          <div className="grid grid-cols-2 gap-3">
            <F label="Chiến dịch *" error={errors.campaignId}>
              <select className={inp} value={form.campaignId} onChange={e => setForm(p => ({ ...p, campaignId: e.target.value }))}>
                <option value="">-- Chọn chiến dịch --</option>
                {campaigns.filter(c => c.status === 'active').map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </F>
            <F label="Mức độ ưu tiên">
              <select className={inp} value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}>
                <option value="critical">🔴 Khẩn cấp</option>
                <option value="high">🟠 Ưu tiên cao</option>
                <option value="medium">🟡 Trung bình</option>
                <option value="low">⚪ Thấp</option>
              </select>
            </F>
          </div>
          <F label="Địa điểm *" error={errors.area}>
            <input className={inp} value={form.area} onChange={e => setForm(p => ({ ...p, area: e.target.value }))} placeholder="VD: Xã Phúc Trạch, huyện Hương Khê, Quảng Bình" />
          </F>
          <F label="Tọa độ GPS">
            <input className={inp} value={form.gps} onChange={e => setForm(p => ({ ...p, gps: e.target.value }))} placeholder="VD: 17.6614° N, 105.9839° E" />
          </F>
          <div className="grid grid-cols-2 gap-3">
            <F label="Ngày bắt đầu">
              <input type="date" className={inp} value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))} />
            </F>
            <F label="Deadline *" error={errors.deadline}>
              <input type="date" className={inp} value={form.deadline} onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))} />
            </F>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <F label="Số tình nguyện viên cần">
              <input type="number" min={1} className={inp} value={form.requiredVolunteers} onChange={e => setForm(p => ({ ...p, requiredVolunteers: e.target.value }))} />
            </F>
            <F label="Ước tính thời gian (giờ)">
              <input type="number" step="0.5" min={0.5} className={inp} value={form.estimatedHours} onChange={e => setForm(p => ({ ...p, estimatedHours: e.target.value }))} />
            </F>
          </div>
          <F label="Dụng cụ yêu cầu (phân cách bằng dấu phẩy)">
            <input className={inp} value={form.equipment} onChange={e => setForm(p => ({ ...p, equipment: e.target.value }))} placeholder="VD: 2 xe tải nhỏ, Găng tay, Thùng xốp" />
          </F>
          <F label="Ngân sách (VNĐ)">
            <input type="number" className={inp} value={form.budget} onChange={e => setForm(p => ({ ...p, budget: e.target.value }))} placeholder="VD: 5000000" />
          </F>
          <F label="Mô tả chi tiết *" error={errors.description}>
            <textarea className={inp} rows={4} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Mô tả đầy đủ: cần bao nhiêu người, làm gì, yêu cầu đặc biệt..." />
          </F>
        </div>
        <div className="p-4 border-t flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm">Huỷ</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-slate-700 text-white rounded-xl text-sm font-medium hover:bg-slate-800 flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> Tạo nhiệm vụ
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Assign Modal ─────────────────────────────────────────────────────────────
function AssignModal({ mission, groups, missionApplications, onClose, onAssign }) {
  const apps = missionApplications.filter(a => a.missionId === mission.id && a.status === 'pending');
  const [selected, setSelected] = useState('');
  const eligibleGroups = groups.filter(g => g.approvedByAdmin && g.status !== 'completed');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="p-5 border-b flex items-center justify-between">
          <div><h3 className="font-bold text-gray-800">Giao nhiệm vụ</h3><p className="text-xs text-gray-400 mt-0.5">{mission.code} – {mission.title}</p></div>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="p-5 space-y-4">
          {apps.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Nhóm đã ứng tuyển ({apps.length})</h4>
              <div className="space-y-2">
                {apps.map(app => {
                  const grp = groups.find(g => g.id === app.groupId);
                  return (
                    <label key={app.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${selected === String(app.groupId) ? 'border-slate-500 bg-slate-50' : 'border-gray-100 hover:border-gray-200'}`}>
                      <input type="radio" name="assign" value={app.groupId} checked={selected === String(app.groupId)} onChange={e => setSelected(e.target.value)} className="accent-slate-700" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-800">{app.groupName}</div>
                        {grp && (
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                            <span>{grp.memberIds?.length || 0} thành viên</span>
                            <span>•</span>
                            <Star className="w-3 h-3 text-amber-400 inline" /><span>{grp.reputationPoints} điểm uy tín</span>
                          </div>
                        )}
                      </div>
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Đã ứng</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
          <div>
            <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Tất cả nhóm đủ điều kiện</h4>
            <select className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-slate-500/30" value={selected} onChange={e => setSelected(e.target.value)}>
              <option value="">-- Chọn nhóm --</option>
              {eligibleGroups.map(g => (
                <option key={g.id} value={g.id}>{g.name} ({g.memberIds?.length || 0} người, {g.reputationPoints} điểm)</option>
              ))}
            </select>
          </div>
        </div>
        <div className="p-4 border-t flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm">Huỷ</button>
          <button disabled={!selected} onClick={() => { const g = groups.find(x => x.id === parseInt(selected)); if (g) { onAssign(mission.id, g.id, g.name); onClose(); } }}
            className="px-4 py-2 bg-slate-700 text-white rounded-xl text-sm font-medium hover:bg-slate-800 disabled:opacity-50 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Xác nhận giao
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function AdminMissions() {
  const { campaigns, missions, missionApplications, volunteerGroups, createMission, updateMissionStatus, assignMission, cancelMissionAssignment } = useApp();
  const [showCreate, setShowCreate] = useState(false);
  const [assignMissionData, setAssignMissionData] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const filtered = missions.filter(m => {
    const q = search.toLowerCase();
    return (!q || m.title.toLowerCase().includes(q) || m.area.toLowerCase().includes(q) || m.code.toLowerCase().includes(q)) &&
           (!filterStatus || m.status === filterStatus) &&
           (!filterPriority || m.priority === filterPriority);
  });

  const stats = { total: missions.length, open: missions.filter(m => m.status === 'OPEN').length, inProgress: missions.filter(m => ['ASSIGNED', 'IN_PROGRESS'].includes(m.status)).length, done: missions.filter(m => m.status === 'COMPLETED').length };

  return (
    <PageTransition>
      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-gray-800">Quản lý Nhiệm vụ Cứu trợ</h1><p className="text-sm text-gray-500">Tạo và phân công nhiệm vụ cho các nhóm tình nguyện</p></div>
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> Tạo nhiệm vụ
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[['Tổng', stats.total, 'bg-slate-100 text-slate-600'], ['Đang mở', stats.open, 'bg-emerald-100 text-emerald-600'], ['Đang thực hiện', stats.inProgress, 'bg-amber-100 text-amber-600'], ['Hoàn thành', stats.done, 'bg-gray-100 text-gray-600']].map(([label, val, cls], i) => (
            <div key={i} className={`rounded-2xl p-4 ${cls} text-center`}><div className="text-2xl font-bold">{val}</div><div className="text-xs mt-0.5">{label}</div></div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/30 focus:border-slate-400" placeholder="Tìm nhiệm vụ, địa điểm..." value={search} onChange={e => setSearch(e.target.value)} /></div>
          <select className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/30" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">Tất cả trạng thái</option>
            {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <select className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/30" value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
            <option value="">Tất cả mức độ</option>
            {Object.entries(PRIORITY_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>

        {/* Mission List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-card"><div className="text-4xl mb-2">📋</div><p className="text-gray-400">Không tìm thấy nhiệm vụ nào</p></div>
          ) : filtered.map(m => {
            const sc = STATUS_CONFIG[m.status] || STATUS_CONFIG.OPEN;
            const pc = PRIORITY_CONFIG[m.priority] || PRIORITY_CONFIG.low;
            const pendingApps = missionApplications.filter(a => a.missionId === m.id && a.status === 'pending').length;
            const isExpanded = expandedId === m.id;

            return (
              <motion.div key={m.id} layout className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-0.5 rounded">{m.code}</span>
                        <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${sc.color}`}><div className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />{sc.label}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${pc.color}`}>{pc.label}</span>
                        {pendingApps > 0 && <span className="text-xs bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full">{pendingApps} nhóm đã ứng</span>}
                      </div>
                      <h3 className="font-bold text-gray-800 leading-snug">{m.title}</h3>
                      <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{m.area}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Deadline: {m.deadline}</span>
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" />{m.requiredVolunteers} người</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />~{m.estimatedHours}h</span>
                        {m.budget > 0 && <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{new Intl.NumberFormat('vi-VN').format(m.budget)}đ</span>}
                      </div>
                      {m.assignedGroupName && (
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-blue-700">
                          <Crown className="w-3 h-3" /> Giao cho: <strong>{m.assignedGroupName}</strong>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-1.5 flex-shrink-0">
                      {m.status === 'OPEN' && (
                        <button onClick={() => setAssignMissionData(m)} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 text-white rounded-lg text-xs font-medium hover:bg-slate-800 transition-colors">
                          <ShieldCheck className="w-3.5 h-3.5" /> Giao nhóm
                        </button>
                      )}
                      {m.status === 'ASSIGNED' && (
                        <button onClick={() => updateMissionStatus(m.id, 'IN_PROGRESS')} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 text-white rounded-lg text-xs font-medium hover:bg-amber-600 transition-colors">
                          <Zap className="w-3.5 h-3.5" /> Bắt đầu
                        </button>
                      )}
                      {m.status === 'IN_PROGRESS' && (
                        <button onClick={() => updateMissionStatus(m.id, 'COMPLETED')} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-medium hover:bg-emerald-600 transition-colors">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Hoàn thành
                        </button>
                      )}
                      {['ASSIGNED', 'IN_PROGRESS'].includes(m.status) && (
                        <button onClick={() => cancelMissionAssignment(m.id)} className="flex items-center gap-1.5 px-3 py-1.5 border border-red-200 text-red-600 rounded-lg text-xs font-medium hover:bg-red-50 transition-colors">
                          <X className="w-3.5 h-3.5" /> Thu hồi
                        </button>
                      )}
                      {m.status !== 'COMPLETED' && m.status !== 'CANCELLED' && (
                        <button onClick={() => updateMissionStatus(m.id, 'CANCELLED')} className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-500 rounded-lg text-xs hover:bg-gray-50 transition-colors">
                          <X className="w-3 h-3" /> Huỷ
                        </button>
                      )}
                      <button onClick={() => setExpandedId(isExpanded ? null : m.id)} className="flex items-center gap-1 px-3 py-1.5 text-gray-400 rounded-lg text-xs hover:text-gray-600 hover:bg-gray-50 transition-colors">
                        <Eye className="w-3.5 h-3.5" />{isExpanded ? 'Ẩn' : 'Chi tiết'}
                        <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="pt-4 mt-4 border-t border-gray-100 space-y-3">
                          <p className="text-sm text-gray-600">{m.description}</p>
                          {m.equipment?.length > 0 && (
                            <div>
                              <div className="text-xs font-medium text-gray-500 mb-1.5">Dụng cụ yêu cầu:</div>
                              <div className="flex flex-wrap gap-1">{m.equipment.map(e => <span key={e} className="text-xs bg-gray-50 text-gray-600 px-2.5 py-1 rounded-full border border-gray-200">{e}</span>)}</div>
                            </div>
                          )}
                          {m.gps && <div className="text-xs text-gray-500 flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-rose-400" />GPS: {m.gps}</div>}
                          {pendingApps > 0 && (
                            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl">
                              <div className="text-xs font-medium text-rose-700 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" />{pendingApps} nhóm đang chờ được giao nhiệm vụ này</div>
                            </div>
                          )}
                          <div className="text-xs text-gray-400">Tạo ngày {m.createdAt}</div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {showCreate && <CreateMissionModal campaigns={campaigns} onClose={() => setShowCreate(false)} onSubmit={createMission} />}
        {assignMissionData && <AssignModal mission={assignMissionData} groups={volunteerGroups} missionApplications={missionApplications} onClose={() => setAssignMissionData(null)} onAssign={assignMission} />}
      </AnimatePresence>
    </PageTransition>
  );
}
