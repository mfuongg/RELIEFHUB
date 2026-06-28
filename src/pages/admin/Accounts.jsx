import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import PageTransition from '../../components/PageTransition';
import { Search, Plus, Trash2, UserCheck, UserX, CheckCircle, XCircle, Clock } from 'lucide-react';

const ROLE_LABELS = { admin: 'Quản trị viên', donor: 'Nhà tài trợ', finance: 'Ban tài chính', local: 'Cán bộ địa phương', citizen: 'Người dân', volunteer: 'Tình nguyện viên' };
const STATUS_LABELS = { active: '✓ Hoạt động', inactive: '✗ Tạm khóa', pending_approval: '⏳ Chờ duyệt', rejected: '✗ Từ chối' };

export default function AdminAccounts() {
  const { accounts, approveAccount, rejectAccount, toggleAccountStatus, deleteAccount, createAccountByAdmin } = useApp();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [newAcc, setNewAcc] = useState({ name: '', email: '', phone: '', role: 'citizen', username: '', password: 'password123' });
  const [addError, setAddError] = useState('');
  const [tab, setTab] = useState('all');

  const pendingCount = accounts.filter(a => a.status === 'pending_approval').length;

  const filtered = accounts.filter(a => a.role !== 'admin').filter(a => {
    const q = search.toLowerCase();
    const matchSearch = a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q) || a.username.toLowerCase().includes(q);
    const matchRole = roleFilter === 'all' || a.role === roleFilter;
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchTab = tab === 'all' || (tab === 'pending' && a.status === 'pending_approval');
    return matchSearch && matchRole && matchStatus && matchTab;
  });

  const handleAdd = () => {
    setAddError('');
    const result = createAccountByAdmin(newAcc);
    if (result.success) { setNewAcc({ name: '', email: '', phone: '', role: 'citizen', username: '', password: 'password123' }); setShowAdd(false); }
    else setAddError(result.error);
  };

  return (
    <PageTransition><div className="page-container">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="section-title">Quản lý tài khoản</h1><p className="section-subtitle">{accounts.length - 1} tài khoản trong hệ thống</p></div>
        <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Thêm tài khoản</button>
      </div>

      {pendingCount > 0 && (
        <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3"><Clock className="w-5 h-5 text-amber-600" /><span className="text-sm font-medium text-amber-800">Có <strong>{pendingCount}</strong> tài khoản đang chờ phê duyệt</span></div>
          <button onClick={() => setTab('pending')} className="text-sm font-semibold text-amber-700 underline">Xem ngay</button>
        </div>
      )}

      <div className="flex gap-2 mb-4">
        <button onClick={() => setTab('all')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === 'all' ? 'bg-sky-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Tất cả</button>
        <button onClick={() => setTab('pending')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${tab === 'pending' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>⏳ Chờ phê duyệt {pendingCount > 0 && <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{pendingCount}</span>}</button>
      </div>

      <AnimatePresence>{showAdd && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }} className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-lg font-bold mb-4">Thêm tài khoản mới</h2>
            {addError && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 mb-3">⚠️ {addError}</div>}
            <div className="space-y-3">
              <div><label className="label">Họ tên</label><input value={newAcc.name} onChange={e => setNewAcc({ ...newAcc, name: e.target.value })} className="input-field" placeholder="Nguyễn Văn A" /></div>
              <div><label className="label">Tên đăng nhập</label><input value={newAcc.username} onChange={e => setNewAcc({ ...newAcc, username: e.target.value })} className="input-field" placeholder="username" /></div>
              <div><label className="label">Email</label><input value={newAcc.email} onChange={e => setNewAcc({ ...newAcc, email: e.target.value })} className="input-field" placeholder="email@example.com" /></div>
              <div><label className="label">Số điện thoại</label><input value={newAcc.phone} onChange={e => setNewAcc({ ...newAcc, phone: e.target.value })} className="input-field" placeholder="0912345678" /></div>
              <div><label className="label">Mật khẩu mặc định</label><input value={newAcc.password} onChange={e => setNewAcc({ ...newAcc, password: e.target.value })} className="input-field" /></div>
              <div><label className="label">Vai trò</label><select value={newAcc.role} onChange={e => setNewAcc({ ...newAcc, role: e.target.value })} className="input-field">{Object.entries(ROLE_LABELS).filter(([k]) => k !== 'admin').map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
            </div>
            <div className="flex gap-3 mt-5"><button onClick={() => setShowAdd(false)} className="btn-secondary flex-1">Hủy</button><button onClick={handleAdd} className="btn-primary flex-1">Tạo tài khoản</button></div>
          </motion.div>
        </motion.div>
      )}</AnimatePresence>

      <div className="card">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10" placeholder="Tìm tên, email, username..." /></div>
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="input-field w-auto"><option value="all">Tất cả vai trò</option>{Object.entries(ROLE_LABELS).filter(([k]) => k !== 'admin').map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input-field w-auto"><option value="all">Tất cả trạng thái</option><option value="active">Hoạt động</option><option value="inactive">Tạm khóa</option><option value="pending_approval">Chờ duyệt</option><option value="rejected">Từ chối</option></select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full"><thead><tr><th className="table-header">Tên / Username</th><th className="table-header hidden sm:table-cell">Email</th><th className="table-header">Vai trò</th><th className="table-header">Trạng thái</th><th className="table-header">Thao tác</th></tr></thead>
            <tbody>
              {filtered.map((acc, i) => (
                <motion.tr key={acc.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} className="hover:bg-gray-50">
                  <td className="table-cell"><div className="font-medium text-gray-900">{acc.name}</div><div className="text-xs text-gray-400">@{acc.username}</div>{acc.role === 'citizen' && acc.householdSize && <div className="text-xs text-blue-500 mt-0.5">🏠 {acc.householdSize} thành viên</div>}</td>
                  <td className="table-cell hidden sm:table-cell text-gray-500 text-sm">{acc.email}</td>
                  <td className="table-cell"><span className="badge-info">{ROLE_LABELS[acc.role]}</span></td>
                  <td className="table-cell"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1 ${acc.status === 'active' ? 'bg-emerald-100 text-emerald-700' : acc.status === 'pending_approval' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-600'}`}>{STATUS_LABELS[acc.status]}</span></td>
                  <td className="table-cell"><div className="flex items-center gap-1">
                    {acc.status === 'pending_approval' && (<><button onClick={() => approveAccount(acc.id)} className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600 transition-colors" title="Phê duyệt"><CheckCircle className="w-4 h-4" /></button><button onClick={() => rejectAccount(acc.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Từ chối"><XCircle className="w-4 h-4" /></button></>)}
                    {acc.status !== 'pending_approval' && <button onClick={() => toggleAccountStatus(acc.id)} className="p-1.5 rounded-lg hover:bg-sky-50 text-sky-600 transition-colors" title={acc.status === 'active' ? 'Khóa' : 'Mở khóa'}>{acc.status === 'active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}</button>}
                    <button onClick={() => deleteAccount(acc.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Xóa"><Trash2 className="w-4 h-4" /></button>
                  </div></td>
                </motion.tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={5} className="py-12 text-center text-gray-400"><div className="text-4xl mb-2">👥</div><p>Không tìm thấy tài khoản nào</p></td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div></PageTransition>
  );
}
