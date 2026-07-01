import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import PageTransition from '../../components/PageTransition';
import { ClipboardList, FileText, CheckSquare, ArrowUpRight } from 'lucide-react';

export default function CitizenDashboard() {
  const { user, needs } = useApp();
  const myNeeds = needs.slice(0, 3);

  return (
    <PageTransition>
      <div className="page-container">
        <div className="mb-6">
          <h1 className="section-title">Xin chào, {user?.name}! 🙏</h1>
          <p className="section-subtitle">Theo dõi tình trạng hỗ trợ của bạn</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Yêu cầu đã gửi', value: needs.length, icon: '📋', color: 'from-purple-400 to-purple-600' },
            { label: 'Đã được duyệt', value: needs.filter(n => n.status === 'approved').length, icon: '✅', color: 'from-emerald-400 to-emerald-600' },
            { label: 'Chờ xét duyệt', value: needs.filter(n => n.status === 'pending').length, icon: '⏳', color: 'from-amber-400 to-amber-600' },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card text-center">
              <div className={`w-12 h-12 bg-gradient-to-br ${s.color} rounded-xl flex items-center justify-center text-2xl mx-auto mb-3`}>{s.icon}</div>
              <div className="text-2xl font-black text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Link to="/dashboard/citizen/request" className="card border-2 border-purple-200 bg-purple-50 flex items-center gap-3 no-underline hover:scale-[1.02] transition-transform">
            <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center text-white"><ClipboardList className="w-5 h-5" /></div>
            <div><div className="font-bold text-sm text-gray-900">Gửi yêu cầu hỗ trợ</div></div>
            <ArrowUpRight className="w-4 h-4 text-gray-400 ml-auto" />
          </Link>
          <Link to="/dashboard/citizen/status" className="card border-2 border-sky-200 bg-sky-50 flex items-center gap-3 no-underline hover:scale-[1.02] transition-transform">
            <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center text-white"><FileText className="w-5 h-5" /></div>
            <div><div className="font-bold text-sm text-gray-900">Tra cứu trạng thái</div></div>
            <ArrowUpRight className="w-4 h-4 text-gray-400 ml-auto" />
          </Link>
          <Link to="/dashboard/citizen/receipt" className="card border-2 border-emerald-200 bg-emerald-50 flex items-center gap-3 no-underline hover:scale-[1.02] transition-transform">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white"><CheckSquare className="w-5 h-5" /></div>
            <div><div className="font-bold text-sm text-gray-900">Xác nhận nhận hàng</div></div>
            <ArrowUpRight className="w-4 h-4 text-gray-400 ml-auto" />
          </Link>
        </div>

        <div className="card">
          <h2 className="font-bold text-gray-900 mb-4">Yêu cầu hỗ trợ gần đây</h2>
          <div className="space-y-3">
            {myNeeds.map((n, i) => (
              <div key={n.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center text-xl">📦</div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{n.items}</div>
                  <div className="text-xs text-gray-400">{n.date} • {n.area}</div>
                </div>
                <span className={n.status === 'approved' ? 'badge-verified' : n.status === 'pending' ? 'badge-pending' : 'badge-info'}>
                  {n.status === 'approved' ? '✓ Duyệt' : n.status === 'pending' ? '⏳ Chờ' : '📋 Xác minh'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
