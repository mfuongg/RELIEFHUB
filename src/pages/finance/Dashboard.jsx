import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import PageTransition from '../../components/PageTransition';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { CheckSquare, BookOpen, DollarSign, ArrowUpRight, TrendingUp } from 'lucide-react';

const fundData = [
  { day: 'T2', balance: 450 }, { day: 'T3', balance: 520 }, { day: 'T4', balance: 490 },
  { day: 'T5', balance: 640 }, { day: 'T6', balance: 710 }, { day: 'T7', balance: 680 }, { day: 'CN', balance: 750 },
];

export default function FinanceDashboard() {
  const { contributions } = useApp();
  const pending = contributions.filter(c => c.status === 'pending');
  const verified = contributions.filter(c => c.status === 'verified');
  const totalFund = verified.reduce((s, c) => s + c.amount, 0);

  return (
    <PageTransition>
      <div className="page-container">
        <div className="mb-6">
          <h1 className="section-title">Tổng quan Tài chính</h1>
          <p className="section-subtitle">Giám sát dòng tiền và xác minh đóng góp</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Quỹ hiện tại', value: `${(totalFund / 1e6).toFixed(0)}M VNĐ`, icon: <DollarSign className="w-5 h-5" />, color: 'from-emerald-400 to-emerald-600', bg: 'bg-emerald-50 text-emerald-600' },
            { label: 'Chờ xác minh', value: pending.length, icon: <CheckSquare className="w-5 h-5" />, color: 'from-amber-400 to-amber-600', bg: 'bg-amber-50 text-amber-600' },
            { label: 'Đã xác minh', value: verified.length, icon: <TrendingUp className="w-5 h-5" />, color: 'from-sky-400 to-sky-600', bg: 'bg-sky-50 text-sky-600' },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${s.color} rounded-xl flex items-center justify-center text-white`}>{s.icon}</div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${s.bg}`}>{i === 0 ? '+5.2% tháng này' : i === 1 ? 'cần xử lý' : 'giao dịch'}</span>
              </div>
              <div className="text-2xl font-black text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <Link to="/dashboard/finance/verify" className="card border-2 border-amber-200 bg-amber-50 flex items-center gap-4 no-underline hover:scale-[1.02] transition-transform">
            <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-white"><CheckSquare className="w-6 h-6" /></div>
            <div>
              <div className="font-bold text-gray-900">Xác minh đóng góp</div>
              <div className="text-sm text-gray-500">{pending.length} đóng góp chờ xử lý</div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-gray-400 ml-auto" />
          </Link>
          <Link to="/dashboard/finance/ledger" className="card border-2 border-emerald-200 bg-emerald-50 flex items-center gap-4 no-underline hover:scale-[1.02] transition-transform">
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white"><BookOpen className="w-6 h-6" /></div>
            <div>
              <div className="font-bold text-gray-900">Sổ tài chính</div>
              <div className="text-sm text-gray-500">Xem lịch sử giao dịch</div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-gray-400 ml-auto" />
          </Link>
        </div>

        {/* Fund balance chart */}
        <div className="card">
          <h3 className="font-bold text-gray-900 mb-4">Biến động quỹ (7 ngày qua, triệu VNĐ)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={fundData}>
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={v => [`${v}M VNĐ`, 'Số dư']} />
              <Line type="monotone" dataKey="balance" stroke="#10b981" strokeWidth={2.5} dot={{ fill: '#10b981', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </PageTransition>
  );
}
