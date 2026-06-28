import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import PageTransition from '../../components/PageTransition';
import { Search, Eye } from 'lucide-react';

const URGENCY_LABELS = { critical: '🔴 Khẩn cấp', high: '🟠 Cao', medium: '🟡 Trung bình', low: '🟢 Thấp' };
const STATUS_LABELS = { pending: { label: '⏳ Chờ xét duyệt', cls: 'badge-pending' }, verified: { label: '✓ Đã xác minh', cls: 'badge-info' }, approved: { label: '✓ Đã phê duyệt', cls: 'badge-verified' }, rejected: { label: '✗ Từ chối', cls: 'badge-rejected' } };

export default function LocalCitizenStatus() {
  const { needs, accounts } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedNeed, setSelectedNeed] = useState(null);

  const enrichedNeeds = needs.map(n => { const citizenAccount = accounts.find(a => a.name === n.citizen && a.role === 'citizen'); return { ...n, householdSize: citizenAccount?.householdSize || n.households }; });
  const filtered = enrichedNeeds.filter(n => { const q = search.toLowerCase(); const matchSearch = n.citizen.toLowerCase().includes(q) || n.area.toLowerCase().includes(q); const matchStatus = statusFilter === 'all' || n.status === statusFilter; return matchSearch && matchStatus; });

  return (
    <PageTransition><div className="page-container">
      <div className="mb-6"><h1 className="section-title">Tra cứu trạng thái hỗ trợ</h1><p className="section-subtitle">Theo dõi tất cả yêu cầu hỗ trợ của người dân trong khu vực</p></div>
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-3 mb-5"><div className="relative flex-1"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10" placeholder="Tìm tên người dân, khu vực..." /></div><select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input-field w-auto"><option value="all">Tất cả trạng thái</option><option value="pending">Chờ xét duyệt</option><option value="verified">Đã xác minh</option><option value="approved">Đã phê duyệt</option><option value="rejected">Từ chối</option></select></div>
        <div className="space-y-3">
          {filtered.map((n, i) => { const st = STATUS_LABELS[n.status] || { label: n.status, cls: 'badge-info' }; return (
            <motion.div key={n.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-4">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center font-bold text-purple-700 flex-shrink-0">{n.citizen.charAt(0)}</div>
              <div className="flex-1 min-w-0"><div className="flex items-center gap-2 flex-wrap mb-1"><span className="font-bold text-gray-900">{n.citizen}</span><span className="text-gray-400 text-sm">— {n.area}</span><span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">{URGENCY_LABELS[n.urgency]}</span></div><div className="text-sm text-gray-600 mb-1">{n.items}</div><div className="flex flex-wrap gap-3 text-xs text-gray-400"><span>📅 {n.date}</span><span>🏠 {n.householdSize || n.households} hộ/thành viên</span></div></div>
              <div className="flex items-center gap-2 flex-shrink-0"><span className={st.cls}>{st.label}</span><button onClick={() => setSelectedNeed(selectedNeed?.id === n.id ? null : n)} className="p-2 rounded-lg bg-sky-50 text-sky-600 hover:bg-sky-100 transition-colors"><Eye className="w-4 h-4" /></button></div>
            </motion.div>
          );})}
          {filtered.length === 0 && <div className="text-center py-10 text-gray-400"><div className="text-4xl mb-2">🔍</div><p>Không tìm thấy kết quả nào</p></div>}
        </div>
        {selectedNeed && (<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 bg-sky-50 border border-sky-200 rounded-xl"><h3 className="font-bold text-sky-900 mb-3">Chi tiết yêu cầu #{selectedNeed.id}</h3><div className="grid grid-cols-2 gap-3 text-sm">{[['Người dân', selectedNeed.citizen], ['Khu vực', selectedNeed.area], ['Ngày gửi', selectedNeed.date], ['Mức độ ưu tiên', URGENCY_LABELS[selectedNeed.urgency]], ['Số hộ/thành viên', selectedNeed.householdSize || selectedNeed.households], ['Trạng thái', STATUS_LABELS[selectedNeed.status]?.label], ['Nhu cầu', selectedNeed.items]].map(([k, v]) => (<div key={k} className="col-span-1"><div className="text-xs text-gray-500">{k}</div><div className="font-medium text-gray-900">{v}</div></div>))}</div></motion.div>)}
      </div>
    </div></PageTransition>
  );
}
