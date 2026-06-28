import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import PageTransition from '../../components/PageTransition';
import { Flag, ClipboardList, AlertTriangle, ArrowUpRight } from 'lucide-react';

export default function LocalDashboard() {
  const { disasters, needs } = useApp();
  const activeDisasters = disasters.filter(d => d.status === 'active');
  const pendingNeeds = needs.filter(n => n.status === 'pending');

  return (
    <PageTransition>
      <div className="page-container">
        <div className="mb-6">
          <h1 className="section-title">Tổng quan địa phương</h1>
          <p className="section-subtitle">Quản lý tình hình thiên tai và nhu cầu hỗ trợ</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Thiên tai đang xử lý', value: activeDisasters.length, icon: '🚨', color: 'from-red-400 to-red-600' },
            { label: 'Nhu cầu chờ xác minh', value: pendingNeeds.length, icon: '📋', color: 'from-amber-400 to-amber-600' },
            { label: 'Hộ dân ảnh hưởng', value: disasters.reduce((s, d) => s + d.households, 0), icon: '🏠', color: 'from-blue-400 to-blue-600' },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card text-center">
              <div className={`w-12 h-12 bg-gradient-to-br ${s.color} rounded-xl flex items-center justify-center text-2xl mx-auto mb-3`}>{s.icon}</div>
              <div className="text-2xl font-black text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <Link to="/dashboard/local/disasters" className="card border-2 border-red-200 bg-red-50 flex items-center gap-4 no-underline hover:scale-[1.02] transition-transform">
            <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center text-white"><Flag className="w-6 h-6" /></div>
            <div>
              <div className="font-bold text-gray-900">Cập nhật thiên tai</div>
              <div className="text-sm text-gray-500">{activeDisasters.length} khu vực đang ảnh hưởng</div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-gray-400 ml-auto" />
          </Link>
          <Link to="/dashboard/local/needs" className="card border-2 border-amber-200 bg-amber-50 flex items-center gap-4 no-underline hover:scale-[1.02] transition-transform">
            <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-white"><ClipboardList className="w-6 h-6" /></div>
            <div>
              <div className="font-bold text-gray-900">Xác minh nhu cầu</div>
              <div className="text-sm text-gray-500">{pendingNeeds.length} nhu cầu chờ xác nhận</div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-gray-400 ml-auto" />
          </Link>
        </div>

        {/* Active disasters */}
        <div className="card">
          <h2 className="font-bold text-gray-900 mb-4">Tình hình thiên tai đang diễn ra</h2>
          <div className="space-y-3">
            {disasters.map((d, i) => (
              <motion.div key={d.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                className={`p-3 rounded-xl border ${d.status === 'active' ? 'bg-red-50 border-red-200' : d.status === 'recovering' ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className={`w-4 h-4 ${d.status === 'active' ? 'text-red-500' : d.status === 'recovering' ? 'text-amber-500' : 'text-emerald-500'}`} />
                      <span className="font-bold text-sm text-gray-900">{d.area} — {d.type}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{d.damage}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{d.households} hộ ảnh hưởng • {d.date}</div>
                  </div>
                  <span className={d.status === 'active' ? 'badge-rejected' : d.status === 'recovering' ? 'badge-pending' : 'badge-verified'}>
                    {d.status === 'active' ? '🔴 Khẩn cấp' : d.status === 'recovering' ? '🟡 Phục hồi' : '🟢 Hoàn tất'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
