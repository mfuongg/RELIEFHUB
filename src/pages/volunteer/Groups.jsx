import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import PageTransition from '../../components/PageTransition';
import {
  Users, MapPin, Phone, Plus, Search, X, CheckCircle2, Clock,
  UserPlus, Eye, LogOut, Crown, Send, ClipboardList, Info,
  AlertCircle, Calendar, Package
} from 'lucide-react';

const STATUS_CONFIG = {
  active:    { label: 'Đang hoạt động', color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  recruiting:{ label: 'Đang tuyển',     color: 'bg-blue-100 text-blue-700',      dot: 'bg-blue-500' },
  completed: { label: 'Hoàn thành',     color: 'bg-gray-100 text-gray-600',      dot: 'bg-gray-400' },
  pending:   { label: 'Chờ duyệt',      color: 'bg-amber-100 text-amber-700',    dot: 'bg-amber-500' },
  rejected:  { label: 'Từ chối',        color: 'bg-red-100 text-red-600',        dot: 'bg-red-400' },
};

function GroupCard({ group, onJoin, onViewDetail, isMyGroup, hasPending, isMember }) {
  const sc = STATUS_CONFIG[group.status] || STATUS_CONFIG.recruiting;
  const fillPct = group.memberIds ? Math.round((group.memberIds.length / group.maxMembers) * 100) : 0;
  const isFull = group.memberIds?.length >= group.maxMembers;

  return (
    <motion.div whileHover={{ y: -2 }} className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-gray-800 text-sm">{group.name}</h3>
              {isMyGroup && <span className="text-xs bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full font-medium">Nhóm tôi</span>}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">{group.campaign}</div>
          </div>
          <div className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${sc.color}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />{sc.label}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
          <div className="flex items-center gap-1.5"><Crown className="w-3.5 h-3.5 text-gray-400" /><span className="truncate">{group.leader}</span></div>
          <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-gray-400" /><span>{group.leaderPhone}</span></div>
          <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-gray-400" /><span className="truncate">{group.province}</span></div>
          <div className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-gray-400" /><span>{group.memberIds?.length || 0}/{group.maxMembers} người</span></div>
        </div>

        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{group.description}</p>

        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Thành viên: {group.memberIds?.length || 0}/{group.maxMembers}</span>
            <span>{isFull ? '🔒 Đủ người' : `Còn ${group.maxMembers - (group.memberIds?.length || 0)} chỗ`}</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-rose-400 to-rose-600 rounded-full" style={{ width: `${fillPct}%` }} />
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={() => onViewDetail(group)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border border-gray-200 text-gray-600 rounded-xl text-xs font-medium hover:bg-gray-50">
            <Eye className="w-3.5 h-3.5" /> Chi tiết
          </button>
          {!isMember && !hasPending && !isFull && group.approvedByAdmin && group.status !== 'completed' && (
            <button onClick={() => onJoin(group)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-rose-500 text-white rounded-xl text-xs font-medium hover:bg-rose-600">
              <UserPlus className="w-3.5 h-3.5" /> Tham gia
            </button>
          )}
          {hasPending && <span className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-amber-50 text-amber-600 rounded-xl text-xs font-medium border border-amber-200"><Clock className="w-3.5 h-3.5" /> Đang chờ</span>}
          {isFull && !isMember && <span className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-50 text-gray-400 rounded-xl text-xs">🔒 Đủ người</span>}
        </div>
      </div>
    </motion.div>
  );
}

function CreateGroupModal({ campaigns, missions, onClose, onSubmit, user }) {
  const [form, setForm] = useState({
    name: '', description: '', campaignId: '', campaign: '',
    province: '', area: '', maxMembers: 15,
    leader: user?.name || '', leaderId: user?.id, leaderPhone: '',
    requestedMissionIds: [],
  });

  // Filter OPEN missions that no group has been assigned to yet
  const openMissions = missions.filter(m => m.status === 'OPEN');

  const toggleMission = (id) => {
    setForm(p => ({
      ...p,
      requestedMissionIds: p.requestedMissionIds.includes(id)
        ? p.requestedMissionIds.filter(x => x !== id)
        : [...p.requestedMissionIds, id],
    }));
  };

  const handleSubmit = () => {
    if (!form.name.trim() || !form.campaignId || !form.province.trim()) return;
    const camp = campaigns.find(c => c.id === parseInt(form.campaignId));
    onSubmit({ ...form, campaignId: parseInt(form.campaignId), campaign: camp?.name || '' });
    onClose();
  };

  const inp = "w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-400";

  const PRIORITY_COLORS = { critical: 'bg-red-100 text-red-700', high: 'bg-orange-100 text-orange-700', medium: 'bg-yellow-100 text-yellow-700', low: 'bg-gray-100 text-gray-600' };
  const PRIORITY_LABELS = { critical: '🔴 Khẩn cấp', high: '🟠 Cao', medium: '🟡 Trung bình', low: '🟢 Thấp' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl">
        <div className="p-5 border-b flex items-center justify-between">
          <div><h2 className="text-lg font-bold text-gray-800">Tạo nhóm tình nguyện</h2><p className="text-xs text-gray-400 mt-0.5">Admin sẽ duyệt trước khi nhóm hoạt động</p></div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Tên nhóm *</label><input className={inp} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="VD: Nhóm cứu trợ miền Trung" /></div>
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Chiến dịch *</label>
            <select className={inp} value={form.campaignId} onChange={e => setForm(p => ({ ...p, campaignId: e.target.value }))}>
              <option value="">-- Chọn chiến dịch --</option>
              {campaigns.filter(c => c.status === 'active').map(c => <option key={c.id} value={c.id}>{c.name} ({c.area})</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs font-medium text-gray-700 mb-1">Tỉnh/Thành *</label><input className={inp} value={form.province} onChange={e => setForm(p => ({ ...p, province: e.target.value }))} placeholder="VD: Quảng Bình" /></div>
            <div><label className="block text-xs font-medium text-gray-700 mb-1">Số người tối đa</label><input type="number" min={3} max={50} className={inp} value={form.maxMembers} onChange={e => setForm(p => ({ ...p, maxMembers: e.target.value }))} /></div>
          </div>
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Địa bàn hoạt động</label><input className={inp} value={form.area} onChange={e => setForm(p => ({ ...p, area: e.target.value }))} placeholder="VD: Xã Phúc Trạch, huyện Hương Khê" /></div>
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Mô tả nhóm</label><textarea className={inp} rows={2} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Mô tả mục tiêu, hoạt động..." /></div>
          <div><label className="block text-xs font-medium text-gray-700 mb-1">SĐT leader</label><input className={inp} value={form.leaderPhone} onChange={e => setForm(p => ({ ...p, leaderPhone: e.target.value }))} placeholder="0912345678" /></div>

          {/* Missions selection – admin-created missions */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2 flex items-center gap-1.5">
              <ClipboardList className="w-3.5 h-3.5 text-rose-500" />
              Nhận nhiệm vụ ({openMissions.length} nhiệm vụ đang mở) — chọn các nhiệm vụ nhóm muốn đảm nhận
            </label>
            {openMissions.length === 0 ? (
              <div className="text-xs text-gray-400 bg-gray-50 rounded-xl p-3">Hiện chưa có nhiệm vụ nào mở. Admin sẽ tạo nhiệm vụ sau.</div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {openMissions.map(m => {
                  const selected = form.requestedMissionIds.includes(m.id);
                  return (
                    <div key={m.id} onClick={() => toggleMission(m.id)}
                      className={`p-3 rounded-xl border-2 cursor-pointer transition-all text-sm ${
                        selected ? 'border-rose-500 bg-rose-50' : 'border-gray-200 hover:border-gray-300'
                      }`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-800 flex items-center gap-2">
                            {selected && <CheckCircle2 className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />}
                            <span>{m.title}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{m.location}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${PRIORITY_COLORS[m.priority] || 'bg-gray-100 text-gray-600'}`}>
                            {PRIORITY_LABELS[m.priority] || m.priority}
                          </span>
                          <span className="text-xs text-gray-400">{m.startDate}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {form.requestedMissionIds.length > 0 && (
              <p className="text-xs text-rose-600 mt-1">Đã chọn {form.requestedMissionIds.length} nhiệm vụ</p>
            )}
          </div>
        </div>
        <div className="p-4 border-t flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm">Huỷ</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-rose-500 text-white rounded-xl text-sm font-medium hover:bg-rose-600 flex items-center gap-1.5"><Send className="w-4 h-4" /> Gửi yêu cầu</button>
        </div>
      </motion.div>
    </div>
  );
}

function GroupDetailModal({ group, onClose, user, onJoin, hasPending, isMember, missions, groupApplications, approveGroupApplication, rejectGroupApplication, leaveGroup, transferLeadership, accounts }) {
  const [tab, setTab] = useState('info');
  const groupMissions = missions.filter(m => m.assignedGroupId === group.id);
  const pendingApps = groupApplications.filter(a => a.groupId === group.id && a.status === 'pending');
  const isLeader = group.leaderId === user?.id;
  const memberAccounts = accounts.filter(a => group.memberIds?.includes(a.id));

  const TABS = [
    { id: 'info', label: 'Thông tin', icon: <Info className="w-3.5 h-3.5" /> },
    { id: 'missions', label: 'Nhiệm vụ', icon: <ClipboardList className="w-3.5 h-3.5" />, count: groupMissions.length },
    { id: 'members', label: 'Thành viên', icon: <Users className="w-3.5 h-3.5" />, count: group.memberIds?.length },
    ...(isLeader ? [{ id: 'manage', label: 'Quản lý', icon: <Crown className="w-3.5 h-3.5" />, count: pendingApps.length }] : []),
  ];

  const sc = STATUS_CONFIG[group.status] || STATUS_CONFIG.recruiting;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
        <div className="p-5 border-b border-gray-100 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-gray-800">{group.name}</h2>
              <span className={`text-xs px-2 py-0.5 rounded-full ${sc.color}`}>{sc.label}</span>
              {!group.approvedByAdmin && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Chờ admin duyệt</span>}
            </div>
            <p className="text-sm text-gray-500 mt-0.5">{group.campaign}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5 text-gray-400" /></button>
        </div>

        <div className="flex gap-1 px-4 pt-3 overflow-x-auto">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${tab === t.id ? 'bg-rose-100 text-rose-700' : 'text-gray-500 hover:bg-gray-100'}`}>
              {t.icon} {t.label}{t.count > 0 && <span className="bg-current/20 px-1.5 rounded-full">{t.count}</span>}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {tab === 'info' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 leading-relaxed">{group.description}</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><div className="text-xs text-gray-400 mb-1">Leader</div><div className="font-medium text-gray-800 flex items-center gap-1"><Crown className="w-3.5 h-3.5 text-amber-500" />{group.leader}</div></div>
                <div><div className="text-xs text-gray-400 mb-1">SĐT</div><div className="font-medium text-gray-800 flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-gray-400" />{group.leaderPhone}</div></div>
                <div><div className="text-xs text-gray-400 mb-1">Địa bàn</div><div className="font-medium text-gray-800">{group.area || group.province}</div></div>
                <div><div className="text-xs text-gray-400 mb-1">Thành viên</div><div className="font-medium text-gray-800">{group.memberIds?.length || 0} / {group.maxMembers}</div></div>
              </div>
            </div>
          )}
          {tab === 'missions' && (
            <div className="space-y-3">
              {groupMissions.length === 0 ? <p className="text-center text-gray-400 text-sm py-8">Nhóm chưa có nhiệm vụ nào</p> : groupMissions.map(m => (
                <div key={m.id} className="p-3 border border-gray-100 rounded-xl">
                  <div className="text-xs text-gray-400">{m.code}</div>
                  <div className="font-medium text-sm text-gray-800">{m.title}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" />{m.location}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><Calendar className="w-3 h-3" />{m.startDate} → {m.endDate}</div>
                  <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${m.status === 'COMPLETED' ? 'bg-gray-100 text-gray-600' : m.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-700' : m.status === 'OPEN' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>{m.status}</span>
                </div>
              ))}
            </div>
          )}
          {tab === 'members' && (
            <div className="space-y-2">
              {memberAccounts.map(a => (
                <div key={a.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-9 h-9 bg-rose-100 rounded-full flex items-center justify-center text-lg">{a.avatar}</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-800 flex items-center gap-1.5">{a.name}{a.id === group.leaderId && <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full flex items-center gap-0.5"><Crown className="w-3 h-3" />Leader</span>}</div>
                    <div className="text-xs text-gray-500">{a.phone}</div>
                  </div>
                  {isLeader && a.id !== user.id && a.id !== group.leaderId && (
                    <button onClick={() => { if (window.confirm(`Chuyển quyền leader cho ${a.name}?`)) { transferLeadership(group.id, a.id, a.name, a.phone); onClose(); } }} className="text-xs text-amber-600 hover:bg-amber-50 px-2 py-1 rounded-lg"><Crown className="w-3.5 h-3.5" /></button>
                  )}
                </div>
              ))}
            </div>
          )}
          {tab === 'manage' && isLeader && (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800 flex items-center gap-2"><UserPlus className="w-4 h-4 text-rose-500" />Đơn xin tham gia ({pendingApps.length})</h4>
              {pendingApps.length === 0 ? <p className="text-center text-gray-400 text-sm py-6">Không có đơn nào</p> : pendingApps.map(app => (
                <div key={app.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-sm">🙋</div>
                  <div className="flex-1"><div className="text-sm font-medium text-gray-800">{app.userName}</div><div className="text-xs text-gray-400">Nộp đơn: {app.appliedAt}</div></div>
                  <div className="flex gap-1.5">
                    <button onClick={() => approveGroupApplication(app.id)} className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200"><CheckCircle2 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => rejectGroupApplication(app.id)} className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"><X className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-100 flex justify-between items-center">
          {isMember && !isLeader && <button onClick={() => { if (window.confirm('Rời nhóm?')) { leaveGroup(group.id, user.id); onClose(); } }} className="flex items-center gap-1.5 text-xs text-red-500 px-3 py-2 hover:bg-red-50 rounded-lg"><LogOut className="w-3.5 h-3.5" /> Rời nhóm</button>}
          {!isMember && !hasPending && group.approvedByAdmin && group.status !== 'completed' && <button onClick={() => { onJoin(group); onClose(); }} className="flex items-center gap-1.5 px-4 py-2 bg-rose-500 text-white rounded-xl text-sm font-medium hover:bg-rose-600"><UserPlus className="w-4 h-4" /> Tham gia</button>}
          <button onClick={onClose} className="ml-auto px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50">Đóng</button>
        </div>
      </motion.div>
    </div>
  );
}

export default function VolunteerGroups() {
  const {
    user, volunteerGroups, groupApplications, campaigns, missions, accounts,
    applyToGroup, approveGroupApplication, rejectGroupApplication,
    createVolunteerGroup, leaveGroup, transferLeadership, applyMission,
  } = useApp();

  const [tab, setTab] = useState('groups');
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [detailGroup, setDetailGroup] = useState(null);

  const myGroup = volunteerGroups.find(g => g.memberIds?.includes(user?.id));
  const pendingAppsForMe = groupApplications.filter(a => a.userId === user?.id && a.status === 'pending');
  const approvedGroups = volunteerGroups.filter(g => g.approvedByAdmin);
  const myMissions = missions.filter(m => myGroup && m.assignedGroupId === myGroup.id);
  const openMissions = missions.filter(m => m.status === 'OPEN');

  const filtered = approvedGroups.filter(g => {
    const q = search.toLowerCase();
    return !q || g.name.toLowerCase().includes(q) || g.province.toLowerCase().includes(q) || g.campaign?.toLowerCase().includes(q);
  });

  const TAB_LIST = [
    { id: 'groups', label: 'Danh sách nhóm', count: filtered.length },
    { id: 'mygroup', label: 'Nhóm của tôi' },
    { id: 'missions', label: 'Nhiệm vụ', count: openMissions.length },
  ];

  return (
    <PageTransition>
      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div><h1 className="text-2xl font-bold text-gray-800">Nhóm Tình nguyện</h1><p className="text-sm text-gray-500">Tham gia hoặc tạo nhóm cứu trợ</p></div>
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-xl font-medium hover:bg-rose-600"><Plus className="w-4 h-4" /> Tạo nhóm mới</button>
        </div>

        <div className="flex gap-1 border-b border-gray-100">
          {TAB_LIST.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === t.id ? 'border-rose-500 text-rose-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {t.label}{t.count !== undefined && <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === t.id ? 'bg-rose-100 text-rose-600' : 'bg-gray-100 text-gray-500'}`}>{t.count}</span>}
            </button>
          ))}
        </div>

        {tab === 'groups' && (
          <>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30" placeholder="Tìm nhóm..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            {filtered.length === 0 ? <div className="text-center py-16"><div className="text-5xl mb-3">🔍</div><p className="text-gray-400">Không tìm thấy nhóm</p></div> : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map(g => {
                  const hasPending = pendingAppsForMe.some(a => a.groupId === g.id);
                  const isMember = g.memberIds?.includes(user?.id);
                  return <GroupCard key={g.id} group={g} onJoin={(gr) => applyToGroup(gr.id, user.id, user.name)} onViewDetail={setDetailGroup} isMyGroup={myGroup?.id === g.id} hasPending={hasPending} isMember={isMember} />;
                })}
              </div>
            )}
          </>
        )}

        {tab === 'mygroup' && (
          <div className="space-y-6">
            {!myGroup ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-card">
                <div className="text-5xl mb-4">👥</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Bạn chưa tham gia nhóm nào</h3>
                <div className="flex gap-3 justify-center mt-4">
                  <button onClick={() => setTab('groups')} className="px-4 py-2 border border-rose-500 text-rose-500 rounded-xl text-sm font-medium hover:bg-rose-50">Tìm nhóm</button>
                  <button onClick={() => setShowCreate(true)} className="px-4 py-2 bg-rose-500 text-white rounded-xl text-sm font-medium hover:bg-rose-600 flex items-center gap-1.5"><Plus className="w-4 h-4" /> Tạo nhóm</button>
                </div>
                {pendingAppsForMe.length > 0 && <div className="mt-6 max-w-sm mx-auto p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700 flex items-center gap-2"><Clock className="w-4 h-4" /> Bạn có {pendingAppsForMe.length} đơn đang chờ duyệt</div>}
              </div>
            ) : (
              <>
                <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-xl font-bold text-gray-800">{myGroup.name}</h2>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_CONFIG[myGroup.status]?.color}`}>{STATUS_CONFIG[myGroup.status]?.label}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{myGroup.campaign} • {myGroup.province}</p>
                    </div>
                    <button onClick={() => setDetailGroup(myGroup)} className="text-xs text-rose-500 border border-rose-200 px-3 py-1.5 rounded-lg hover:bg-rose-50">Chi tiết</button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-gray-50 rounded-xl"><div className="text-lg font-bold text-gray-800">{myGroup.memberIds?.length || 0}/{myGroup.maxMembers}</div><div className="text-xs text-gray-500">Thành viên</div></div>
                    <div className="p-3 bg-gray-50 rounded-xl"><div className="text-lg font-bold text-gray-800">{myMissions.length}</div><div className="text-xs text-gray-500">Nhiệm vụ</div></div>
                    <div className="p-3 bg-gray-50 rounded-xl"><div className="text-lg font-bold text-emerald-600">{myMissions.filter(m => m.status === 'COMPLETED').length}</div><div className="text-xs text-gray-500">Hoàn thành</div></div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><ClipboardList className="w-5 h-5 text-rose-500" />Nhiệm vụ của nhóm</h3>
                  {myMissions.length === 0 ? <div className="text-center py-8 bg-white rounded-2xl border border-gray-100 shadow-card"><div className="text-3xl mb-2">📋</div><p className="text-gray-400 text-sm">Nhóm chưa được giao nhiệm vụ</p></div> : (
                    <div className="space-y-3">
                      {myMissions.map(m => (
                        <div key={m.id} className="bg-white rounded-2xl shadow-card border border-gray-100 p-4">
                          <div className="flex items-start justify-between gap-2">
                            <div><div className="text-xs font-mono text-gray-400">{m.code}</div><div className="font-medium text-gray-800 text-sm">{m.title}</div></div>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${m.status === 'COMPLETED' ? 'bg-gray-100 text-gray-600' : m.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-700' : m.status === 'ASSIGNED' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>{m.status}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" />{m.location}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {tab === 'missions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">Nhiệm vụ đang mở ({openMissions.length})</h3>
              {!myGroup && <div className="text-xs text-amber-600 flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200"><AlertCircle className="w-3.5 h-3.5" />Tham gia nhóm để ứng tuyển</div>}
            </div>
            {openMissions.length === 0 ? <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-card"><div className="text-4xl mb-2">✅</div><p className="text-gray-400">Không có nhiệm vụ mở</p></div> : (
              <div className="grid md:grid-cols-2 gap-4">
                {openMissions.map(m => {
                  const hasApplied = myGroup && m.applicants?.find(a => a.groupId === myGroup?.id);
                  return (
                    <div key={m.id} className={`rounded-2xl border p-4 ${m.priority === 'critical' ? 'bg-red-50 border-red-200' : m.priority === 'high' ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-gray-200'}`}>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div><div className="text-xs font-mono text-gray-400">{m.code}</div><div className="font-medium text-gray-800 text-sm">{m.title}</div></div>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">OPEN</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 text-xs text-gray-600 mb-2">
                        <div className="flex items-center gap-1"><MapPin className="w-3 h-3" />{m.location}</div>
                        <div className="flex items-center gap-1"><Calendar className="w-3 h-3" />{m.endDate}</div>
                        <div className="flex items-center gap-1"><Users className="w-3 h-3" />{m.requiredPeople} người</div>
                      </div>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">{m.description}</p>
                      <div className="flex gap-2">
                        {myGroup && !hasApplied && <button onClick={() => applyMission(m.id, myGroup.id, myGroup.name)} className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500 text-white rounded-lg text-xs font-medium hover:bg-rose-600"><Send className="w-3 h-3" /> Ứng tuyển</button>}
                        {hasApplied && <span className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-xs border border-amber-200"><Clock className="w-3 h-3" /> Đã ứng tuyển</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showCreate && <CreateGroupModal campaigns={campaigns} missions={missions} user={user} onClose={() => setShowCreate(false)} onSubmit={(data) => createVolunteerGroup(data)} />}
        {detailGroup && <GroupDetailModal group={detailGroup} user={user} onClose={() => setDetailGroup(null)} onJoin={(g) => applyToGroup(g.id, user.id, user.name)} hasPending={pendingAppsForMe.some(a => a.groupId === detailGroup.id)} isMember={detailGroup.memberIds?.includes(user?.id)} missions={missions} groupApplications={groupApplications} approveGroupApplication={approveGroupApplication} rejectGroupApplication={rejectGroupApplication} leaveGroup={leaveGroup} transferLeadership={transferLeadership} accounts={accounts} />}
      </AnimatePresence>
    </PageTransition>
  );
}
