import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import PageTransition from '../../components/PageTransition';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Package, Flag, DollarSign, TrendingUp, ArrowUpRight } from 'lucide-react';

const barData = [
  { month: 'T7', donations: 180, needs: 120 },
  { month: 'T8', donations: 250, needs: 200 },
  { month: 'T9', donations: 210, needs: 180 },
  { month: 'T10', donations: 380, needs: 260 },
  { month: 'T11', donations: 290, needs: 220 },
];

const pieData = [
  { name: 'Tiền mặt', value: 65, color: '#0ea5e9' },
  { name: 'Hàng hóa', value: 25, color: '#f97316' },
  { name: 'Dịch vụ', value: 10, color: '#10b981' },
];

export default function AdminDashboard() {
  const { accounts, campaigns, contributions, needs, inventory } = useApp();

  const pendingAccounts = accounts.filter(a => a.status === 'pending_approval');
  const stats = [
    { label: 'Tổng người dùng', value: accounts.length - 1, change: pendingAccounts.length > 0 ? `${pendingAccounts.length} chờ duyệt` : 'ổn định', icon: <Users className="w-5 h-5" />, color: 'from-sky-400 to-sky-600', bg: 'bg-sky-50 text-sky-600' },
    { label: 'Đóng góp chờ duyệt', value: contributions.filter(c => c.status === 'pending').length, change: 'cần xử lý', icon: <DollarSign className="w-5 h-5" />, color: 'from-orange-400 to-orange-600', bg: 'bg-orange-50 text-orange-600' },
    { label: 'Chiến dịch đang chạy', value: campaigns.filter(c => c.status === 'active').length, change: 'đang hoạt động', icon: <Flag className="w-5 h-5" />, color: 'from-emerald-400 to-emerald-600', bg: 'bg-emerald-50 text-emerald-600' },
    { label: 'Cảnh báo kho', value: inventory.filter(i => i.quantity < i.minQuantity).length, change: 'sắp hết hàng', icon: <Package className="w-5 h-5" />, color: 'from-red-400 to-red-600', bg: 'bg-red-50 text-red-600' },
  ];

  return (
    <PageTransition>
      <div className="page-container">
        <div className="mb-6">
          <h1 className="section-title">Tổng quan hệ thống</h1>
          <p className="section-subtitle">Giám sát toàn bộ hoạt động cứu trợ</p>
        </div>

        {/* Pending approval alert */}
        {pendingAccounts.length > 0 && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="mb-5 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-amber-600" />
              <span className="text-sm font-medium text-amber-800">Có <strong>{pendingAccounts.length}</strong> tài khoản đang chờ phê duyệt</span>
            </div>
            <Link to="/dashboard/admin/accounts" className="text-sm font-semibold text-amber-700 underline">Xử lý ngay</Link>
          </motion.div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${s.color} rounded-xl flex items-center justify-center text-white`}>
                  {s.icon}
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${s.bg}`}>{s.change}</span>
              </div>
              <div className="text-2xl font-black text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 card">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-sky-500" />
              Đóng góp & Nhu cầu (5 tháng gần nhất)
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v, n) => [v + 'M VNĐ', n === 'donations' ? 'Đóng góp' : 'Nhu cầu']} />
                <Bar dataKey="donations" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                <Bar dataKey="needs" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <h3 className="font-bold text-gray-900 mb-4">Cơ cấu đóng góp</h3>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v) => [`${v}%`]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-3">
              {pieData.map(d => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-gray-600">{d.name}</span>
                  </div>
                  <span className="font-bold text-gray-900">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {[
            { to: '/dashboard/admin/accounts', icon: '👥', label: 'Quản lý tài khoản', desc: `${accounts.length - 1} tài khoản`, color: 'bg-sky-50 border-sky-200' },
            { to: '/dashboard/admin/inventory', icon: '📦', label: 'Kho hàng', desc: `${inventory.filter(i => i.quantity < i.minQuantity).length} mặt hàng sắp hết`, color: 'bg-orange-50 border-orange-200' },
            { to: '/dashboard/admin/campaigns', icon: '🚀', label: 'Chiến dịch', desc: `${campaigns.length} chiến dịch`, color: 'bg-emerald-50 border-emerald-200' },
          ].map(a => (
            <Link key={a.to} to={a.to} className={`card border-2 ${a.color} flex items-center gap-3 no-underline hover:scale-[1.02] transition-transform`}>
              <span className="text-3xl">{a.icon}</span>
              <div>
                <div className="font-bold text-gray-900 text-sm">{a.label}</div>
                <div className="text-xs text-gray-500">{a.desc}</div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400 ml-auto" />
            </Link>
          ))}
        </div>

        {/* Recent contributions */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Đóng góp gần đây</h3>
            <Link to="/dashboard/admin/reports" className="text-sky-600 text-sm hover:underline">Xem tất cả</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr>
                <th className="table-header">Nhà tài trợ</th>
                <th className="table-header">Chiến dịch</th>
                <th className="table-header">Giá trị</th>
                <th className="table-header">Trạng thái</th>
              </tr></thead>
              <tbody>
                {contributions.slice(0, 5).map(c => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="table-cell font-medium">{c.donor}</td>
                    <td className="table-cell text-gray-500">{c.campaign}</td>
                    <td className="table-cell font-bold text-emerald-600">{(c.amount / 1e6).toFixed(0)}M VNĐ</td>
                    <td className="table-cell">
                      <span className={c.status === 'verified' ? 'badge-verified' : c.status === 'pending' ? 'badge-pending' : 'badge-rejected'}>
                        {c.status === 'verified' ? '✓ Xác minh' : c.status === 'pending' ? '⏳ Chờ duyệt' : '✗ Từ chối'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
