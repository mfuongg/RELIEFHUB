import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import PageTransition from '../../components/PageTransition';
import {
  Banknote, Package, Wallet, Plus, MapPin, Clock, Phone, X, CheckCircle2,
  XCircle, Search, Building2, Store, Edit3, Trash2, ToggleLeft, ToggleRight,
  AlertCircle, ReceiptText, Send, Truck, Calendar
} from 'lucide-react';

const STATUS_CONFIG = {
  PENDING: { label: 'Chờ xác minh', color: 'bg-amber-100 text-amber-700' },
  VERIFIED: { label: 'Đã xác minh', color: 'bg-emerald-100 text-emerald-700' },
  REJECTED: { label: 'Bị từ chối', color: 'bg-red-100 text-red-700' },
  REGISTERED: { label: 'Đã đăng ký', color: 'bg-sky-100 text-sky-700' },
  SHIPPING: { label: 'Đang vận chuyển', color: 'bg-blue-100 text-blue-700' },
  RECEIVED: { label: 'Đã nhận hàng', color: 'bg-emerald-100 text-emerald-700' },
  BOOKED: { label: 'Đã đặt lịch', color: 'bg-sky-100 text-sky-700' },
  ARRIVED: { label: 'Đã đến', color: 'bg-blue-100 text-blue-700' },
  CONFIRMED: { label: 'Đã xác nhận', color: 'bg-emerald-100 text-emerald-700' },
  CANCELLED: { label: 'Đã huỷ', color: 'bg-red-100 text-red-700' },
};

export default function AdminDonations() {
  const {
    user, campaigns, bankAccounts, dropPoints, cashPoints, neededItems,
    bankDonations, itemDonations, cashAppointments, donationReceipts,
    addBankAccount, updateBankAccount, toggleBankAccount, deleteBankAccount,
    addDropPoint, updateDropPoint, deleteDropPoint,
    addCashPoint, updateCashPoint, deleteCashPoint,
    addNeededItem, updateNeededItem, deleteNeededItem,
    verifyBankDonation, rejectBankDonation,
    updateItemDonationStatus,
    updateCashAppointmentStatus,
  } = useApp();

  const [tab, setTab] = useState('overview');
  const [showModal, setShowModal] = useState(null);
  const [search, setSearch] = useState('');

  const TABS = [
    { id: 'overview', label: 'Tổng quan', icon: <ReceiptText className="w-4 h-4" /> },
    { id: 'bank', label: 'Tài khoản NH', icon: <Building2 className="w-4 h-4" /> },
    { id: 'drop', label: 'Điểm nhận hàng', icon: <Store className="w-4 h-4" /> },
    { id: 'cash', label: 'Điểm nhận tiền', icon: <Wallet className="w-4 h-4" /> },
    { id: 'items', label: 'Vật phẩm cần', icon: <Package className="w-4 h-4" /> },
    { id: 'verify', label: 'Duyệt giao dịch', icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: 'receipts', label: 'Biên nhận', icon: <ReceiptText className="w-4 h-4" /> },
  ];

  const pendingBank = bankDonations.filter(d => d.status === 'PENDING');
  const pendingItem = itemDonations.filter(d => ['REGISTERED', 'SHIPPING'].includes(d.status));
  const pendingCash = cashAppointments.filter(a => ['BOOKED', 'ARRIVED'].includes(a.status));

  const inp = "w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500/30 focus:border-slate-400";
  const F = ({ label, error, children }) => (
    <div><label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>{children}{error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}</div>
  );

  return (
    <PageTransition>
      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Quản lý Đóng góp</h1>
            <p className="text-sm text-gray-500">Cấu hình điểm nhận, duyệt giao dịch, cấp biên nhận</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-100 overflow-x-auto">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${tab === t.id ? 'border-slate-700 text-slate-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {t.icon} {t.label}
              {t.id === 'verify' && (pendingBank.length + pendingItem.length + pendingCash.length) > 0 && (
                <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">{pendingBank.length + pendingItem.length + pendingCash.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* Overview tab */}
        {tab === 'overview' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Tài khoản NH', value: bankAccounts.length, icon: <Building2 className="w-5 h-5" />, color: 'bg-blue-100 text-blue-600' },
                { label: 'Điểm nhận hàng', value: dropPoints.length, icon: <Store className="w-5 h-5" />, color: 'bg-orange-100 text-orange-600' },
                { label: 'Điểm nhận tiền', value: cashPoints.length, icon: <Wallet className="w-5 h-5" />, color: 'bg-emerald-100 text-emerald-600' },
                { label: 'Vật phẩm cần', value: neededItems.length, icon: <Package className="w-5 h-5" />, color: 'bg-purple-100 text-purple-600' },
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 shadow-card border border-gray-100 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>{s.icon}</div>
                  <div><div className="text-xl font-bold text-gray-800">{s.value}</div><div className="text-xs text-gray-500">{s.label}</div></div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center"><div className="text-2xl font-bold text-amber-700">{pendingBank.length}</div><div className="text-xs text-amber-600">CK chờ duyệt</div></div>
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 text-center"><div className="text-2xl font-bold text-orange-700">{pendingItem.length}</div><div className="text-xs text-orange-600">Hiện vật chờ xử lý</div></div>
              <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 text-center"><div className="text-2xl font-bold text-sky-700">{pendingCash.length}</div><div className="text-xs text-sky-600">Lịch hẹn chờ xử lý</div></div>
            </div>
            <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-5">
              <h3 className="font-bold text-gray-800 mb-3">Biên nhận đã cấp ({donationReceipts.length})</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {donationReceipts.map(r => (
                  <div key={r.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <ReceiptText className="w-4 h-4 text-slate-500" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-800">{r.receiptNo} – {r.userName}</div>
                      <div className="text-xs text-gray-400">{r.campaign} • {r.type === 'item' ? `${r.itemName} ${r.quantity}${r.unit}` : new Intl.NumberFormat('vi-VN').format(r.amount) + 'đ'}</div>
                    </div>
                    <span className="text-xs text-gray-400">{r.issuedAt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bank accounts tab */}
        {tab === 'bank' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button onClick={() => setShowModal('bank')} className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-xl text-sm font-medium hover:bg-slate-800"><Plus className="w-4 h-4" /> Thêm tài khoản</button>
            </div>
            <div className="space-y-2">
              {bankAccounts.map(ba => (
                <div key={ba.id} className="bg-white rounded-2xl shadow-card border border-gray-100 p-4 flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center"><Building2 className="w-5 h-5" /></div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800 text-sm">{ba.bankName} – {ba.accountNumber}</div>
                    <div className="text-xs text-gray-400">{ba.accountHolder} • {ba.branch}</div>
                    <div className="text-xs text-gray-500 mt-0.5">Chiến dịch: {campaigns.find(c => c.id === ba.campaignId)?.name}</div>
                  </div>
                  <button onClick={() => toggleBankAccount(ba.id)} className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${ba.active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                    {ba.active ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />} {ba.active ? 'Hoạt động' : 'Tắt'}
                  </button>
                  <button onClick={() => deleteBankAccount(ba.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Drop points tab */}
        {tab === 'drop' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button onClick={() => setShowModal('drop')} className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-xl text-sm font-medium hover:bg-slate-800"><Plus className="w-4 h-4" /> Thêm điểm nhận</button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {dropPoints.map(dp => (
                <div key={dp.id} className="bg-white rounded-2xl shadow-card border border-gray-100 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2"><Store className="w-4 h-4 text-orange-500" /><h4 className="font-medium text-gray-800 text-sm">{dp.name}</h4></div>
                    <button onClick={() => deleteDropPoint(dp.id)} className="p-1 text-red-400 hover:bg-red-50 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div className="flex items-center gap-1"><MapPin className="w-3 h-3" />{dp.address}</div>
                    <div className="flex items-center gap-1"><Clock className="w-3 h-3" />{dp.hours}</div>
                    <div className="flex items-center gap-1"><Phone className="w-3 h-3" />{dp.receiver} – {dp.phone}</div>
                    <div>Chiến dịch: {campaigns.find(c => c.id === dp.campaignId)?.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cash points tab */}
        {tab === 'cash' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button onClick={() => setShowModal('cash')} className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-xl text-sm font-medium hover:bg-slate-800"><Plus className="w-4 h-4" /> Thêm điểm nhận tiền</button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {cashPoints.map(cp => (
                <div key={cp.id} className="bg-white rounded-2xl shadow-card border border-gray-100 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2"><Wallet className="w-4 h-4 text-emerald-500" /><h4 className="font-medium text-gray-800 text-sm">{cp.officeName}</h4></div>
                    <button onClick={() => deleteCashPoint(cp.id)} className="p-1 text-red-400 hover:bg-red-50 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div className="flex items-center gap-1"><MapPin className="w-3 h-3" />{cp.address}</div>
                    <div className="flex items-center gap-1"><Clock className="w-3 h-3" />{cp.schedule}</div>
                    <div className="flex items-center gap-1"><Phone className="w-3 h-3" />{cp.phone}</div>
                    <div>Người nhận: {cp.receiverName}</div>
                    <div>Chiến dịch: {campaigns.find(c => c.id === cp.campaignId)?.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Needed items tab */}
        {tab === 'items' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button onClick={() => setShowModal('item')} className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-xl text-sm font-medium hover:bg-slate-800"><Plus className="w-4 h-4" /> Thêm vật phẩm</button>
            </div>
            <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                  <th className="text-left px-4 py-3">Chiến dịch</th><th className="text-left px-4 py-3">Vật phẩm</th>
                  <th className="text-center px-4 py-3">Cần</th><th className="text-center px-4 py-3">Đã nhận</th>
                  <th className="text-center px-4 py-3">Ưu tiên</th><th className="text-center px-4 py-3"></th>
                </tr></thead>
                <tbody>
                  {neededItems.map(n => (
                    <tr key={n.id} className="border-b border-gray-50">
                      <td className="px-4 py-3 text-gray-600">{campaigns.find(c => c.id === n.campaignId)?.name}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">{n.itemName} ({n.unit})</td>
                      <td className="px-4 py-3 text-center">{n.requiredQty}</td>
                      <td className="px-4 py-3 text-center">{n.receivedQty}</td>
                      <td className="px-4 py-3 text-center"><span className={`text-xs px-2 py-0.5 rounded-full ${n.priority === 'critical' ? 'bg-red-100 text-red-700' : n.priority === 'high' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'}`}>{n.priority}</span></td>
                      <td className="px-4 py-3 text-center"><button onClick={() => deleteNeededItem(n.id)} className="p-1 text-red-400 hover:bg-red-50 rounded"><Trash2 className="w-3.5 h-3.5" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Verify tab */}
        {tab === 'verify' && (
          <div className="space-y-4">
            {/* Bank donations pending */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2"><Banknote className="w-4 h-4 text-blue-500" /> Chuyển khoản chờ duyệt ({pendingBank.length})</h3>
              <div className="space-y-2">
                {pendingBank.map(d => (
                  <div key={d.id} className="bg-white rounded-2xl shadow-card border border-gray-100 p-4 flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center"><Banknote className="w-5 h-5" /></div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800 text-sm">{d.userName} – {new Intl.NumberFormat('vi-VN').format(d.amount)}đ</div>
                      <div className="text-xs text-gray-400">{d.campaign} • CK: {d.transferNote} • {d.createdAt}</div>
                      {d.proofImage && <img src={d.proofImage} alt="proof" className="mt-1 max-h-20 rounded-lg" />}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => verifyBankDonation(d.id, user?.name || 'Admin')} className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-medium hover:bg-emerald-600"><CheckCircle2 className="w-3.5 h-3.5" /> Duyệt</button>
                      <button onClick={() => rejectBankDonation(d.id, 'Minh chứng không hợp lệ')} className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600"><XCircle className="w-3.5 h-3.5" /> Từ chối</button>
                    </div>
                  </div>
                ))}
                {pendingBank.length === 0 && <p className="text-center text-gray-400 text-sm py-4">Không có chuyển khoản nào chờ duyệt</p>}
              </div>
            </div>

            {/* Item donations */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2"><Package className="w-4 h-4 text-orange-500" /> Hiện vật ({pendingItem.length})</h3>
              <div className="space-y-2">
                {itemDonations.filter(d => d.status !== 'VERIFIED').map(d => (
                  <div key={d.id} className="bg-white rounded-2xl shadow-card border border-gray-100 p-4 flex items-center gap-4">
                    <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center"><Package className="w-5 h-5" /></div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800 text-sm">{d.userName} – {d.itemName} ({d.quantity} {d.unit})</div>
                      <div className="text-xs text-gray-400">{d.campaign} • {d.deliveryMethod === 'self_drop' ? 'Tự mang đến' : 'Gửi vận chuyển'} • {d.createdAt}</div>
                      <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${STATUS_CONFIG[d.status]?.color}`}>{STATUS_CONFIG[d.status]?.label}</span>
                    </div>
                    <div className="flex gap-1">
                      {d.status === 'REGISTERED' && d.deliveryMethod === 'shipping' && <button onClick={() => updateItemDonationStatus(d.id, 'SHIPPING')} className="px-2 py-1 bg-blue-500 text-white rounded-lg text-xs"><Truck className="w-3 h-3" /></button>}
                      {d.status === 'REGISTERED' && <button onClick={() => updateItemDonationStatus(d.id, 'RECEIVED')} className="px-2 py-1 bg-emerald-500 text-white rounded-lg text-xs"><CheckCircle2 className="w-3 h-3" /></button>}
                      {d.status === 'SHIPPING' && <button onClick={() => updateItemDonationStatus(d.id, 'RECEIVED')} className="px-2 py-1 bg-emerald-500 text-white rounded-lg text-xs">Nhận</button>}
                      {d.status === 'RECEIVED' && <button onClick={() => updateItemDonationStatus(d.id, 'VERIFIED')} className="px-2 py-1 bg-slate-700 text-white rounded-lg text-xs">Xác minh</button>}
                    </div>
                  </div>
                ))}
                {itemDonations.filter(d => d.status !== 'VERIFIED').length === 0 && <p className="text-center text-gray-400 text-sm py-4">Không có hiện vật nào cần xử lý</p>}
              </div>
            </div>

            {/* Cash appointments */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2"><Wallet className="w-4 h-4 text-emerald-500" /> Lịch hẹn tiền mặt ({pendingCash.length})</h3>
              <div className="space-y-2">
                {pendingCash.map(a => (
                  <div key={a.id} className="bg-white rounded-2xl shadow-card border border-gray-100 p-4 flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center"><Wallet className="w-5 h-5" /></div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800 text-sm">{a.userName} – {new Intl.NumberFormat('vi-VN').format(a.amount)}đ</div>
                      <div className="text-xs text-gray-400">{a.campaign} • Hẹn: {a.appointmentDate} {a.appointmentTime}</div>
                      <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${STATUS_CONFIG[a.status]?.color}`}>{STATUS_CONFIG[a.status]?.label}</span>
                    </div>
                    <div className="flex gap-1">
                      {a.status === 'BOOKED' && <button onClick={() => updateCashAppointmentStatus(a.id, 'ARRIVED')} className="px-2 py-1 bg-blue-500 text-white rounded-lg text-xs">Đã đến</button>}
                      {a.status === 'ARRIVED' && <button onClick={() => updateCashAppointmentStatus(a.id, 'CONFIRMED')} className="px-2 py-1 bg-emerald-500 text-white rounded-lg text-xs">Xác nhận</button>}
                    </div>
                  </div>
                ))}
                {pendingCash.length === 0 && <p className="text-center text-gray-400 text-sm py-4">Không có lịch hẹn nào cần xử lý</p>}
              </div>
            </div>
          </div>
        )}

        {/* Receipts tab */}
        {tab === 'receipts' && (
          <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                <th className="text-left px-4 py-3">Mã BR</th><th className="text-left px-4 py-3">Nhà tài trợ</th>
                <th className="text-left px-4 py-3">Chiến dịch</th><th className="text-left px-4 py-3">Loại</th>
                <th className="text-right px-4 py-3">Giá trị</th><th className="text-left px-4 py-3">Ngày cấp</th>
              </tr></thead>
              <tbody>
                {donationReceipts.map(r => (
                  <tr key={r.id} className="border-b border-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-700">{r.receiptNo}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{r.userName}</td>
                    <td className="px-4 py-3 text-gray-600">{r.campaign}</td>
                    <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{r.type}</span></td>
                    <td className="px-4 py-3 text-right font-medium">{r.type === 'item' ? `${r.quantity} ${r.unit}` : new Intl.NumberFormat('vi-VN').format(r.amount) + 'đ'}</td>
                    <td className="px-4 py-3 text-gray-400">{r.issuedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add modals */}
      <AnimatePresence>
        {showModal === 'bank' && <AddBankModal campaigns={campaigns} onClose={() => setShowModal(null)} onSubmit={addBankAccount} />}
        {showModal === 'drop' && <AddDropModal campaigns={campaigns} onClose={() => setShowModal(null)} onSubmit={addDropPoint} />}
        {showModal === 'cash' && <AddCashModal campaigns={campaigns} onClose={() => setShowModal(null)} onSubmit={addCashPoint} />}
        {showModal === 'item' && <AddItemModal campaigns={campaigns} onClose={() => setShowModal(null)} onSubmit={addNeededItem} />}
      </AnimatePresence>
    </PageTransition>
  );
}

function ModalShell({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl">
        <div className="p-5 border-b flex items-center justify-between">
          <h3 className="font-bold text-gray-800">{title}</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </motion.div>
    </div>
  );
}

function AddBankModal({ campaigns, onClose, onSubmit }) {
  const [form, setForm] = useState({ campaignId: '', bankName: '', accountNumber: '', accountHolder: '', branch: '', transferNoteFormat: 'RH-{campaign_id}-{user_id}' });
  const inp = "w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500/30";
  return (
    <ModalShell title="Thêm tài khoản ngân hàng" onClose={onClose}>
      <div className="space-y-3">
        <div><label className="text-xs font-medium text-gray-700 block mb-1">Chiến dịch</label>
          <select className={inp} value={form.campaignId} onChange={e => setForm(p => ({ ...p, campaignId: e.target.value }))}>
            <option value="">-- Chọn --</option>{campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        {[['bankName', 'Tên ngân hàng'], ['accountNumber', 'Số tài khoản'], ['accountHolder', 'Chủ tài khoản'], ['branch', 'Chi nhánh']].map(([k, l]) => (
          <div key={k}><label className="text-xs font-medium text-gray-700 block mb-1">{l}</label>
            <input className={inp} value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} />
          </div>
        ))}
        <button onClick={() => { if (form.campaignId && form.bankName && form.accountNumber) { onSubmit({ ...form, campaignId: parseInt(form.campaignId) }); onClose(); } }}
          className="w-full py-2.5 bg-slate-700 text-white rounded-xl text-sm font-medium hover:bg-slate-800">Thêm</button>
      </div>
    </ModalShell>
  );
}

function AddDropModal({ campaigns, onClose, onSubmit }) {
  const [form, setForm] = useState({ campaignId: '', name: '', receiver: '', phone: '', address: '', hours: '', capacity: '', notes: '' });
  const inp = "w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500/30";
  return (
    <ModalShell title="Thêm điểm nhận hàng" onClose={onClose}>
      <div className="space-y-3">
        <div><label className="text-xs font-medium text-gray-700 block mb-1">Chiến dịch</label>
          <select className={inp} value={form.campaignId} onChange={e => setForm(p => ({ ...p, campaignId: e.target.value }))}>
            <option value="">-- Chọn --</option>{campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        {[['name', 'Tên điểm nhận'], ['receiver', 'Người nhận'], ['phone', 'SĐT'], ['address', 'Địa chỉ'], ['hours', 'Giờ hoạt động'], ['capacity', 'Sức chứa']].map(([k, l]) => (
          <div key={k}><label className="text-xs font-medium text-gray-700 block mb-1">{l}</label>
            <input className={inp} value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} />
          </div>
        ))}
        <button onClick={() => { if (form.campaignId && form.name && form.address) { onSubmit({ ...form, campaignId: parseInt(form.campaignId) }); onClose(); } }}
          className="w-full py-2.5 bg-slate-700 text-white rounded-xl text-sm font-medium hover:bg-slate-800">Thêm</button>
      </div>
    </ModalShell>
  );
}

function AddCashModal({ campaigns, onClose, onSubmit }) {
  const [form, setForm] = useState({ campaignId: '', officeName: '', address: '', phone: '', schedule: '', receiverName: '', requirement: '' });
  const inp = "w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500/30";
  return (
    <ModalShell title="Thêm điểm nhận tiền mặt" onClose={onClose}>
      <div className="space-y-3">
        <div><label className="text-xs font-medium text-gray-700 block mb-1">Chiến dịch</label>
          <select className={inp} value={form.campaignId} onChange={e => setForm(p => ({ ...p, campaignId: e.target.value }))}>
            <option value="">-- Chọn --</option>{campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        {[['officeName', 'Tên văn phòng'], ['address', 'Địa chỉ'], ['phone', 'SĐT'], ['schedule', 'Lịch làm việc'], ['receiverName', 'Người nhận'], ['requirement', 'Yêu cầu']].map(([k, l]) => (
          <div key={k}><label className="text-xs font-medium text-gray-700 block mb-1">{l}</label>
            <input className={inp} value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} />
          </div>
        ))}
        <button onClick={() => { if (form.campaignId && form.officeName && form.address) { onSubmit({ ...form, campaignId: parseInt(form.campaignId) }); onClose(); } }}
          className="w-full py-2.5 bg-slate-700 text-white rounded-xl text-sm font-medium hover:bg-slate-800">Thêm</button>
      </div>
    </ModalShell>
  );
}

function AddItemModal({ campaigns, onClose, onSubmit }) {
  const [form, setForm] = useState({ campaignId: '', itemName: '', unit: '', requiredQty: '', priority: 'medium' });
  const inp = "w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500/30";
  return (
    <ModalShell title="Thêm vật phẩm cần thiết" onClose={onClose}>
      <div className="space-y-3">
        <div><label className="text-xs font-medium text-gray-700 block mb-1">Chiến dịch</label>
          <select className={inp} value={form.campaignId} onChange={e => setForm(p => ({ ...p, campaignId: e.target.value }))}>
            <option value="">-- Chọn --</option>{campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div><label className="text-xs font-medium text-gray-700 block mb-1">Tên vật phẩm</label>
          <input className={inp} value={form.itemName} onChange={e => setForm(p => ({ ...p, itemName: e.target.value }))} placeholder="VD: Gạo ST25" /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-xs font-medium text-gray-700 block mb-1">Đơn vị</label><input className={inp} value={form.unit} onChange={e => setForm(p => ({ ...p, unit: e.target.value }))} placeholder="kg, thùng..." /></div>
          <div><label className="text-xs font-medium text-gray-700 block mb-1">Số lượng cần</label><input type="number" className={inp} value={form.requiredQty} onChange={e => setForm(p => ({ ...p, requiredQty: e.target.value }))} /></div>
        </div>
        <div><label className="text-xs font-medium text-gray-700 block mb-1">Mức ưu tiên</label>
          <select className={inp} value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}>
            <option value="critical">🔴 Khẩn cấp</option><option value="high">🟠 Cao</option><option value="medium">🟡 Trung bình</option><option value="low">⚪ Thấp</option>
          </select>
        </div>
        <button onClick={() => { if (form.campaignId && form.itemName) { onSubmit({ ...form, campaignId: parseInt(form.campaignId), requiredQty: parseInt(form.requiredQty) || 0 }); onClose(); } }}
          className="w-full py-2.5 bg-slate-700 text-white rounded-xl text-sm font-medium hover:bg-slate-800">Thêm</button>
      </div>
    </ModalShell>
  );
}
