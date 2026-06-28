import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import PageTransition from '../../components/PageTransition';
import {
  Heart, History, CheckCircle, Clock, XCircle, ArrowUpRight,
  Banknote, Package, Wallet, BookOpen, ReceiptText, TrendingDown, Flag
} from 'lucide-react';

export default function DonorDashboard() {
  const { user, getDonationHistory, campaigns, donationReceipts, formatCurrency } = useApp();
  const myHistory = user ? getDonationHistory(user.id) : [];
  const myReceipts = donationReceipts.filter(r => r.userId === user?.id);
  const totalDonated = myHistory.filter(d => d.status === 'VERIFIED' || d.status === 'CONFIRMED').reduce((s, d) => s + (d.amount || 0), 0);
  const pendingCount = myHistory.filter(d => ['PENDING', 'REGISTERED', 'BOOKED', 'SHIPPING'].includes(d.status)).length;
  const verifiedCount = myHistory.filter(d => ['VERIFIED', 'RECEIVED', 'CONFIRMED'].includes(d.status)).length;

  const quickLinks = [
    { to: '/dashboard/donor/campaigns', icon: <Flag className="w-5 h-5" />, label: 'Chiến dịch đang mở', desc: 'Xem các chiến dịch cần hỗ trợ', color: 'from-orange-400 to-orange-600' },
    { to: '/dashboard/donor/contribute', icon: <Heart className="w-5 h-5" />, label: 'Đóng góp ngay', desc: 'Chuyển khoản, hiện vật, tiền mặt', color: 'from-rose-400 to-rose-600' },
    { to: '/dashboard/donor/guide', icon: <BookOpen className="w-5 h-5" />, label: 'Hướng dẫn đóng góp', desc: 'Tài khoản, điểm nhận, vật phẩm cần', color: 'from-blue-400 to-blue-600' },
    { to: '/dashboard/donor/history', icon: <History className="w-5 h-5" />, label: 'Lịch sử đóng góp', desc: 'Theo dõi tất cả đóng góp', color: 'from-sky-400 to-sky-600' },
    { to: '/dashboard/donor/receipts', icon: <ReceiptText className="w-5 h-5" />, label: 'Biên nhận', desc: 'Biên nhận điện tử đã cấp', color: 'from-emerald-400 to-emerald-600' },
    { to: '/dashboard/donor/tracking', icon: <TrendingDown className="w-5 h-5" />, label: 'Theo dõi sử dụng', desc: 'Minh bạch quỹ và vật phẩm', color: 'from-purple-400 to-purple-600' },
  ];

  return (
    <PageTransition>
      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Chào mừng, {user?.name}! 👋</h1>
          <p className="text-sm text-gray-500">Cảm ơn bạn đã đồng hành cùng ReliefHub</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Tổng đóng góp', value: `${(totalDonated / 1e6).toFixed(1)}Mđ`, icon: '💰', color: 'from-orange-400 to-orange-600' },
            { label: 'Đã xác minh', value: verifiedCount, icon: '✅', color: 'from-emerald-400 to-emerald-600' },
            { label: 'Chờ xử lý', value: pendingCount, icon: '⏳', color: 'from-amber-400 to-amber-600' },
            { label: 'Biên nhận', value: myReceipts.length, icon: '🧾', color: 'from-sky-400 to-sky-600' },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="bg-white rounded-2xl p-4 shadow-card border border-gray-100">
              <div className={`w-10 h-10 bg-gradient-to-br ${s.color} rounded-xl flex items-center justify-center text-xl mb-3`}>{s.icon}</div>
              <div className="text-xl font-black text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Quick links */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((link, i) => (
            <motion.div key={link.to} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link to={link.to} className="block bg-white rounded-2xl shadow-card border border-gray-100 p-5 hover:shadow-card-hover hover:-translate-y-0.5 transition-all no-underline">
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 bg-gradient-to-br ${link.color} rounded-xl flex items-center justify-center text-white flex-shrink-0`}>{link.icon}</div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-800 text-sm">{link.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{link.desc}</div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Active campaigns */}
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-5">
          <h2 className="font-bold text-gray-800 mb-4">Chiến dịch đang cần hỗ trợ</h2>
          <div className="space-y-3">
            {campaigns.filter(c => c.status === 'active').map((c, i) => (
              <motion.div key={c.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <span className="text-3xl">{c.image}</span>
                <div className="flex-1">
                  <div className="font-medium text-sm text-gray-900">{c.name}</div>
                  <div className="h-1.5 bg-gray-200 rounded-full mt-1.5 overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full" style={{ width: `${Math.round(c.raised / c.target * 100)}%` }} />
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{Math.round(c.raised / c.target * 100)}% • {formatCurrency(c.raised)} / {formatCurrency(c.target)}</div>
                </div>
                <Link to="/dashboard/donor/contribute" className="btn-orange text-xs py-1.5 px-3">Đóng góp</Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent donations */}
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-5">
          <h2 className="font-bold text-gray-800 mb-4">Đóng góp gần đây</h2>
          {myHistory.length === 0 ? (
            <div className="text-center py-6 text-gray-400">
              <div className="text-3xl mb-2">📋</div>
              <p className="text-sm">Chưa có đóng góp nào. Bắt đầu đóng góp ngay!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {myHistory.slice(0, 5).map((d, i) => {
                const catIcon = d.category === 'bank' ? <Banknote className="w-4 h-4 text-blue-500" /> : d.category === 'item' ? <Package className="w-4 h-4 text-orange-500" /> : <Wallet className="w-4 h-4 text-emerald-500" />;
                return (
                  <div key={d.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                    <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">{catIcon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-800 truncate">{d.campaign}</div>
                      <div className="text-xs text-gray-400">{d.createdAt} • {d.category === 'bank' ? 'Chuyển khoản' : d.category === 'item' ? 'Hiện vật' : 'Tiền mặt'}</div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${d.status === 'VERIFIED' || d.status === 'CONFIRMED' || d.status === 'RECEIVED' ? 'bg-emerald-100 text-emerald-700' : d.status === 'REJECTED' || d.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                      {d.status === 'VERIFIED' ? '✓ Đã xác minh' : d.status === 'CONFIRMED' ? '✓ Đã xác nhận' : d.status === 'RECEIVED' ? '✓ Đã nhận' : d.status === 'REJECTED' ? '✗ Từ chối' : d.status === 'CANCELLED' ? '✗ Đã huỷ' : '⏳ Chờ'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
