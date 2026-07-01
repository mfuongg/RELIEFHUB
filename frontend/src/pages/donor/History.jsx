import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import PageTransition from '../../components/PageTransition';
import {
  Search, Filter, Banknote, Package, Wallet, Clock, CheckCircle2,
  XCircle, Truck, Store, Calendar
} from 'lucide-react';

const STATUS_MAP = {
  // Bank
  PENDING: { label: 'Chờ xác minh', color: 'bg-amber-100 text-amber-700', icon: <Clock className="w-3.5 h-3.5" /> },
  VERIFIED: { label: 'Đã xác minh', color: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  REJECTED: { label: 'Bị từ chối', color: 'bg-red-100 text-red-700', icon: <XCircle className="w-3.5 h-3.5" /> },
  // Item
  REGISTERED: { label: 'Đã đăng ký', color: 'bg-sky-100 text-sky-700', icon: <Clock className="w-3.5 h-3.5" /> },
  SHIPPING: { label: 'Đang vận chuyển', color: 'bg-blue-100 text-blue-700', icon: <Truck className="w-3.5 h-3.5" /> },
  RECEIVED: { label: 'Đã nhận hàng', color: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  // Cash
  BOOKED: { label: 'Đã đặt lịch', color: 'bg-sky-100 text-sky-700', icon: <Calendar className="w-3.5 h-3.5" /> },
  ARRIVED: { label: 'Đã đến', color: 'bg-blue-100 text-blue-700', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  CONFIRMED: { label: 'Đã xác nhận', color: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  CANCELLED: { label: 'Đã huỷ', color: 'bg-red-100 text-red-700', icon: <XCircle className="w-3.5 h-3.5" /> },
};

const CATEGORY_CONFIG = {
  bank: { label: 'Chuyển khoản', icon: <Banknote className="w-4 h-4" />, color: 'bg-blue-100 text-blue-600' },
  item: { label: 'Hiện vật', icon: <Package className="w-4 h-4" />, color: 'bg-orange-100 text-orange-600' },
  cash: { label: 'Tiền mặt', icon: <Wallet className="w-4 h-4" />, color: 'bg-emerald-100 text-emerald-600' },
};

export default function DonorHistory() {
  const { getDonationHistory, user } = useApp();
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');

  const allHistory = user ? getDonationHistory(user.id) : [];

  const filtered = allHistory.filter(d => {
    const matchSearch = d.campaign?.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'all' || d.category === filterCat;
    return matchSearch && matchCat;
  });

  return (
    <PageTransition>
      <div className="p-6 space-y-6 max-w-5xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Lịch sử đóng góp</h1>
          <p className="text-sm text-gray-500">Tất cả đóng góp của bạn: chuyển khoản, hiện vật, tiền mặt</p>
        </div>

        {/* Stats summary */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Chuyển khoản', count: allHistory.filter(d => d.category === 'bank').length, icon: <Banknote className="w-5 h-5" />, color: 'bg-blue-100 text-blue-600' },
            { label: 'Hiện vật', count: allHistory.filter(d => d.category === 'item').length, icon: <Package className="w-5 h-5" />, color: 'bg-orange-100 text-orange-600' },
            { label: 'Tiền mặt', count: allHistory.filter(d => d.category === 'cash').length, icon: <Wallet className="w-5 h-5" />, color: 'bg-emerald-100 text-emerald-600' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-card border border-gray-100 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>{s.icon}</div>
              <div><div className="text-xl font-bold text-gray-800">{s.count}</div><div className="text-xs text-gray-500">{s.label}</div></div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30" placeholder="Tìm theo chiến dịch..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm" value={filterCat} onChange={e => setFilterCat(e.target.value)}>
            <option value="all">Tất cả loại</option>
            <option value="bank">Chuyển khoản</option>
            <option value="item">Hiện vật</option>
            <option value="cash">Tiền mặt</option>
          </select>
        </div>

        {/* History list */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-card">
              <div className="text-4xl mb-3">📋</div>
              <p className="text-gray-400">Chưa có đóng góp nào</p>
            </div>
          ) : filtered.map((d, i) => {
            const cat = CATEGORY_CONFIG[d.category];
            const sm = STATUS_MAP[d.status] || STATUS_MAP.PENDING;
            return (
              <motion.div key={d.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl shadow-card border border-gray-100 p-4">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${cat.color}`}>{cat.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-gray-400">{cat.label}</span>
                      <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${sm.color}`}>{sm.icon} {sm.label}</span>
                    </div>
                    <div className="font-medium text-gray-800 text-sm mt-0.5">{d.campaign}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{d.createdAt}</div>
                    {d.category === 'bank' && (
                      <div className="text-sm text-gray-700 mt-1">💰 {new Intl.NumberFormat('vi-VN').format(d.amount)}đ <span className="text-gray-400">– CK: {d.transferNote}</span></div>
                    )}
                    {d.category === 'item' && (
                      <div className="text-sm text-gray-700 mt-1">📦 {d.itemName} – {d.quantity} {d.unit} <span className="text-gray-400">– {d.deliveryMethod === 'self_drop' ? 'Tự mang đến' : 'Gửi vận chuyển'}</span></div>
                    )}
                    {d.category === 'cash' && (
                      <div className="text-sm text-gray-700 mt-1">💵 {new Intl.NumberFormat('vi-VN').format(d.amount)}đ <span className="text-gray-400">– Hẹn: {d.appointmentDate} {d.appointmentTime}</span></div>
                    )}
                    {d.rejectReason && d.status === 'REJECTED' && (
                      <div className="mt-1 text-xs text-red-600">Lý do từ chối: {d.rejectReason}</div>
                    )}
                    {d.timeline && d.timeline.length > 0 && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
                        {d.timeline.map((t, idx) => (
                          <span key={idx} className="flex items-center gap-1">
                            {idx > 0 && <span className="text-gray-300">→</span>}
                            <span>{STATUS_MAP[t.status]?.label || t.status}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </PageTransition>
  );
}
