import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import PageTransition from '../../components/PageTransition';
import {
  ReceiptText, Search, Download, Banknote, Package, Wallet, CheckCircle2
} from 'lucide-react';

const TYPE_CONFIG = {
  bank: { label: 'Chuyển khoản', icon: <Banknote className="w-4 h-4" />, color: 'bg-blue-100 text-blue-600' },
  item: { label: 'Hiện vật', icon: <Package className="w-4 h-4" />, color: 'bg-orange-100 text-orange-600' },
  cash: { label: 'Tiền mặt', icon: <Wallet className="w-4 h-4" />, color: 'bg-emerald-100 text-emerald-600' },
};

export default function DonorReceipts() {
  const { donationReceipts, user, campaigns } = useApp();
  const [search, setSearch] = useState('');
  const [filterCampaign, setFilterCampaign] = useState('all');
  const [detailReceipt, setDetailReceipt] = useState(null);

  const myReceipts = donationReceipts.filter(r => r.userId === user?.id);
  const filtered = myReceipts.filter(r => {
    const matchSearch = r.receiptNo.toLowerCase().includes(search.toLowerCase()) || r.campaign.toLowerCase().includes(search.toLowerCase());
    const matchCampaign = filterCampaign === 'all' || r.campaignId === parseInt(filterCampaign);
    return matchSearch && matchCampaign;
  });

  return (
    <PageTransition>
      <div className="p-6 space-y-6 max-w-5xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Biên nhận</h1>
          <p className="text-sm text-gray-500">Biên nhận điện tử cho các đóng góp đã được xác minh</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30" placeholder="Tìm theo mã biên nhận..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm" value={filterCampaign} onChange={e => setFilterCampaign(e.target.value)}>
            <option value="all">Tất cả chiến dịch</option>
            {campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {/* Receipt list */}
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.length === 0 ? (
            <div className="md:col-span-2 text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-card">
              <ReceiptText className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-400">Chưa có biên nhận nào</p>
              <p className="text-xs text-gray-400 mt-1">Biên nhận được cấp tự động sau khi đóng góp được xác minh</p>
            </div>
          ) : filtered.map((r, i) => {
            const tc = TYPE_CONFIG[r.type] || TYPE_CONFIG.cash;
            return (
              <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl shadow-card border border-gray-100 p-5 hover:shadow-card-hover cursor-pointer" onClick={() => setDetailReceipt(r)}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tc.color}`}>{tc.icon}</div>
                    <div>
                      <div className="font-bold text-gray-800 text-sm">{r.receiptNo}</div>
                      <div className="text-xs text-gray-400">{tc.label}</div>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full"><CheckCircle2 className="w-3 h-3" /> Đã cấp</span>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Chiến dịch:</span><span className="font-medium text-gray-800 text-right">{r.campaign}</span></div>
                  {r.type === 'item' ? (
                    <div className="flex justify-between"><span className="text-gray-500">Vật phẩm:</span><span className="font-medium text-gray-800">{r.itemName} – {r.quantity} {r.unit}</span></div>
                  ) : (
                    <div className="flex justify-between"><span className="text-gray-500">Số tiền:</span><span className="font-bold text-emerald-600">{new Intl.NumberFormat('vi-VN').format(r.amount)}đ</span></div>
                  )}
                  <div className="flex justify-between"><span className="text-gray-500">Ngày cấp:</span><span className="text-gray-700">{r.issuedAt}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Người cấp:</span><span className="text-gray-700">{r.issuedBy}</span></div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setDetailReceipt(r); }} className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 border border-gray-200 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-50">
                  <Download className="w-3.5 h-3.5" /> Xem biên nhận
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Receipt detail modal */}
      {detailReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setDetailReceipt(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="text-center mb-5">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-3 shadow-lg">
                  <ReceiptText className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-black text-gray-900">BIÊN NHẬN ĐÓNG GÓP</h2>
                <p className="text-sm text-gray-500">ReliefHub – Hệ thống Cứu trợ Thiên tai</p>
                <div className="mt-2 inline-block bg-gray-50 px-4 py-1 rounded-full">
                  <span className="text-sm font-mono font-bold text-gray-700">{detailReceipt.receiptNo}</span>
                </div>
              </div>
              <div className="space-y-3 border-t border-b border-gray-100 py-4">
                <div className="flex justify-between text-sm"><span className="text-gray-500">Nhà tài trợ:</span><span className="font-medium text-gray-800">{detailReceipt.userName}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Chiến dịch:</span><span className="font-medium text-gray-800 text-right">{detailReceipt.campaign}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Hình thức:</span><span className="font-medium text-gray-800">{TYPE_CONFIG[detailReceipt.type]?.label}</span></div>
                {detailReceipt.type === 'item' ? (
                  <>
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Vật phẩm:</span><span className="font-medium text-gray-800">{detailReceipt.itemName}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Số lượng:</span><span className="font-medium text-gray-800">{detailReceipt.quantity} {detailReceipt.unit}</span></div>
                  </>
                ) : (
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Số tiền:</span><span className="font-bold text-emerald-600 text-lg">{new Intl.NumberFormat('vi-VN').format(detailReceipt.amount)}đ</span></div>
                )}
                <div className="flex justify-between text-sm"><span className="text-gray-500">Ngày cấp:</span><span className="text-gray-700">{detailReceipt.issuedAt}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Người cấp:</span><span className="text-gray-700">{detailReceipt.issuedBy}</span></div>
              </div>
              <div className="mt-4 p-3 bg-emerald-50 rounded-xl text-xs text-emerald-700 text-center">
                ✓ Biên nhận điện tử hợp lệ. Được cấp tự động bởi hệ thống ReliefHub.
              </div>
              <div className="mt-4 flex gap-2">
                <button onClick={() => window.print()} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50">
                  <Download className="w-4 h-4" /> In / Lưu PDF
                </button>
                <button onClick={() => setDetailReceipt(null)} className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200">Đóng</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </PageTransition>
  );
}
