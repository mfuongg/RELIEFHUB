import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import PageTransition from '../../components/PageTransition';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Download } from 'lucide-react';

const monthlyData = [
  { month: 'T6', donations: 120, disbursed: 100 }, { month: 'T7', donations: 180, disbursed: 150 },
  { month: 'T8', donations: 250, disbursed: 220 }, { month: 'T9', donations: 210, disbursed: 190 },
  { month: 'T10', donations: 380, disbursed: 320 },
];

const typeData = [
  { name: 'Lũ lụt', value: 45, color: '#0ea5e9' }, { name: 'Bão', value: 30, color: '#f97316' },
  { name: 'Sạt lở', value: 15, color: '#10b981' }, { name: 'Hạn hán', value: 10, color: '#f59e0b' },
];

export default function AdminReports() {
  const { contributions, campaigns, needs } = useApp();
  const { showToast } = useApp();

  return (
    <PageTransition>
      <div className="page-container">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="section-title">Báo cáo thống kê</h1>
            <p className="section-subtitle">Tổng hợp dữ liệu hoạt động cứu trợ</p>
          </div>
          <button onClick={() => showToast('Đang xuất báo cáo...', 'info')} className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" /> Xuất Excel
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Tổng đóng góp', value: '1.14 tỷ VNĐ', icon: '💰', color: 'bg-sky-50 border-sky-200' },
            { label: 'Đã giải ngân', value: '980M VNĐ', icon: '📤', color: 'bg-emerald-50 border-emerald-200' },
            { label: 'Số chiến dịch', value: campaigns.length, icon: '🚀', color: 'bg-orange-50 border-orange-200' },
            { label: 'Hộ được hỗ trợ', value: '3,000+', icon: '🏠', color: 'bg-purple-50 border-purple-200' },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className={`card border-2 ${s.color}`}>
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="text-xl font-black text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <div className="card">
            <h3 className="font-bold text-gray-900 mb-4">Đóng góp & Giải ngân theo tháng (triệu VNĐ)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={v => [`${v}M VNĐ`]} />
                <Legend />
                <Bar dataKey="donations" name="Đóng góp" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                <Bar dataKey="disbursed" name="Giải ngân" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h3 className="font-bold text-gray-900 mb-4">Phân bổ theo loại thiên tai</h3>
            <div className="flex items-center justify-between">
              <ResponsiveContainer width="55%" height={200}>
                <PieChart>
                  <Pie data={typeData} cx="50%" cy="50%" outerRadius={80} dataKey="value" paddingAngle={3}>
                    {typeData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip formatter={v => [`${v}%`]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {typeData.map(d => (
                  <div key={d.name} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-gray-600">{d.name}</span>
                    <span className="font-bold text-gray-900 ml-auto">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Contribution table */}
        <div className="card">
          <h3 className="font-bold text-gray-900 mb-4">Chi tiết đóng góp</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr>
                <th className="table-header">Nhà tài trợ</th>
                <th className="table-header">Loại</th>
                <th className="table-header">Giá trị</th>
                <th className="table-header">Chiến dịch</th>
                <th className="table-header">Ngày</th>
                <th className="table-header">Trạng thái</th>
              </tr></thead>
              <tbody>
                {contributions.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="table-cell font-medium">{c.donor}</td>
                    <td className="table-cell"><span className="badge-info">{c.type}</span></td>
                    <td className="table-cell font-bold text-emerald-600">{(c.amount / 1e6).toFixed(0)}M VNĐ</td>
                    <td className="table-cell text-gray-500 max-w-xs truncate">{c.campaign}</td>
                    <td className="table-cell text-gray-500">{c.date}</td>
                    <td className="table-cell">
                      <span className={c.status === 'verified' ? 'badge-verified' : c.status === 'pending' ? 'badge-pending' : 'badge-rejected'}>
                        {c.status === 'verified' ? '✓ Xác minh' : c.status === 'pending' ? '⏳ Chờ' : '✗ Từ chối'}
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
