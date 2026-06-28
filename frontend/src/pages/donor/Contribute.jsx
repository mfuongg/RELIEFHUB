import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import PageTransition from '../../components/PageTransition';
import {
  Banknote, Package, Wallet, Upload, Heart, CheckCircle, AlertCircle, X,
  ImageIcon, Copy, MapPin, Clock, Calendar, Send, Truck, Store
} from 'lucide-react';

export default function DonorContribute() {
  const {
    campaigns, bankAccounts, dropPoints, cashPoints, neededItems, user,
    submitBankDonation, submitItemDonation, bookCashAppointment, generateTransferNote,
  } = useApp();

  const [tab, setTab] = useState('bank'); // bank | item | cash
  const [submitted, setSubmitted] = useState(false);
  const [submitData, setSubmitData] = useState(null);

  // Bank donation form
  const [bankForm, setBankForm] = useState({ campaignId: '', bankAccountId: '', amount: '' });
  const [bankProof, setBankProof] = useState(null);
  const [bankProofPreview, setBankProofPreview] = useState('');
  const bankFileRef = useRef(null);
  const [copiedNote, setCopiedNote] = useState(false);

  // Item donation form
  const [itemForm, setItemForm] = useState({ campaignId: '', neededItemId: '', quantity: '', deliveryMethod: 'self_drop', dropPointId: '', shippingName: '', shippingPhone: '', shippingAddress: '' });

  // Cash appointment form
  const [cashForm, setCashForm] = useState({ campaignId: '', cashPointId: '', amount: '', appointmentDate: '', appointmentTime: '' });

  const activeCampaigns = campaigns.filter(c => c.status === 'active');
  const selectedCampaignId = bankForm.campaignId || itemForm.campaignId || cashForm.campaignId;
  const transferNote = selectedCampaignId && user ? generateTransferNote(parseInt(selectedCampaignId), user.id) : '';

  const availableBankAccounts = bankForm.campaignId ? bankAccounts.filter(b => b.campaignId === parseInt(bankForm.campaignId) && b.active) : [];
  const availableNeededItems = itemForm.campaignId ? neededItems.filter(n => n.campaignId === parseInt(itemForm.campaignId)) : [];
  const availableDropPoints = itemForm.campaignId ? dropPoints.filter(d => d.campaignId === parseInt(itemForm.campaignId) && d.active) : [];
  const availableCashPoints = cashForm.campaignId ? cashPoints.filter(c => c.campaignId === parseInt(cashForm.campaignId) && c.active) : [];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    setBankProof(file);
    const reader = new FileReader();
    reader.onload = (ev) => setBankProofPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => { setCopiedNote(true); setTimeout(() => setCopiedNote(false), 2000); });
  };

  const handleBankSubmit = () => {
    if (!bankForm.campaignId || !bankForm.bankAccountId || !bankForm.amount) return;
    const campaign = campaigns.find(c => c.id === parseInt(bankForm.campaignId));
    submitBankDonation({
      campaignId: parseInt(bankForm.campaignId), campaign: campaign.name,
      userId: user.id, userName: user.name,
      amount: parseInt(bankForm.amount),
      bankAccountId: parseInt(bankForm.bankAccountId),
      transferNote, proofImage: bankProofPreview,
    });
    setSubmitData({ type: 'bank', amount: parseInt(bankForm.amount), campaign: campaign.name, transferNote });
    setSubmitted(true);
  };

  const handleItemSubmit = () => {
    if (!itemForm.campaignId || !itemForm.neededItemId || !itemForm.quantity) return;
    const campaign = campaigns.find(c => c.id === parseInt(itemForm.campaignId));
    const item = neededItems.find(n => n.id === parseInt(itemForm.neededItemId));
    const data = {
      campaignId: parseInt(itemForm.campaignId), campaign: campaign.name,
      userId: user.id, userName: user.name,
      neededItemId: parseInt(itemForm.neededItemId), itemName: item.itemName, unit: item.unit,
      quantity: parseInt(itemForm.quantity),
      deliveryMethod: itemForm.deliveryMethod,
      dropPointId: itemForm.deliveryMethod === 'self_drop' ? parseInt(itemForm.dropPointId) : null,
      shippingName: itemForm.deliveryMethod === 'shipping' ? itemForm.shippingName : '',
      shippingPhone: itemForm.deliveryMethod === 'shipping' ? itemForm.shippingPhone : '',
      shippingAddress: itemForm.deliveryMethod === 'shipping' ? itemForm.shippingAddress : '',
    };
    submitItemDonation(data);
    setSubmitData({ type: 'item', itemName: item.itemName, quantity: itemForm.quantity, unit: item.unit, campaign: campaign.name });
    setSubmitted(true);
  };

  const handleCashSubmit = () => {
    if (!cashForm.campaignId || !cashForm.cashPointId || !cashForm.amount || !cashForm.appointmentDate) return;
    const campaign = campaigns.find(c => c.id === parseInt(cashForm.campaignId));
    const cp = cashPoints.find(c => c.id === parseInt(cashForm.cashPointId));
    bookCashAppointment({
      campaignId: parseInt(cashForm.campaignId), campaign: campaign.name,
      userId: user.id, userName: user.name,
      amount: parseInt(cashForm.amount),
      cashPointId: parseInt(cashForm.cashPointId),
      appointmentDate: cashForm.appointmentDate, appointmentTime: cashForm.appointmentTime,
    });
    setSubmitData({ type: 'cash', amount: parseInt(cashForm.amount), campaign: campaign.name, officeName: cp.officeName, date: cashForm.appointmentDate, time: cashForm.appointmentTime });
    setSubmitted(true);
  };

  const resetAll = () => {
    setSubmitted(false); setSubmitData(null);
    setBankForm({ campaignId: '', bankAccountId: '', amount: '' });
    setBankProof(null); setBankProofPreview('');
    setItemForm({ campaignId: '', neededItemId: '', quantity: '', deliveryMethod: 'self_drop', dropPointId: '', shippingName: '', shippingPhone: '', shippingAddress: '' });
    setCashForm({ campaignId: '', cashPointId: '', amount: '', appointmentDate: '', appointmentTime: '' });
  };

  if (submitted && submitData) {
    return (
      <PageTransition><div className="p-6 max-w-md mx-auto text-center py-16">
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.5 }} className="text-7xl mb-6">🎉</motion.div>
        <h2 className="text-2xl font-black text-gray-900 mb-3">Đóng góp đã ghi nhận!</h2>
        {submitData.type === 'bank' && (
          <div className="text-gray-600 mb-4 space-y-1">
            <p>Chiến dịch: <strong>{submitData.campaign}</strong></p>
            <p>Số tiền: <strong className="text-emerald-600">{new Intl.NumberFormat('vi-VN').format(submitData.amount)}đ</strong></p>
            <p>Nội dung CK: <code className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-mono">{submitData.transferNote}</code></p>
            <p className="text-sm text-gray-500 mt-2">Chờ admin xác minh minh chứng chuyển khoản.</p>
          </div>
        )}
        {submitData.type === 'item' && (
          <div className="text-gray-600 mb-4 space-y-1">
            <p>Chiến dịch: <strong>{submitData.campaign}</strong></p>
            <p>Vật phẩm: <strong>{submitData.itemName} – {submitData.quantity} {submitData.unit}</strong></p>
            <p className="text-sm text-gray-500 mt-2">Trạng thái: Đã đăng ký. Chờ nhận hàng hoặc vận chuyển.</p>
          </div>
        )}
        {submitData.type === 'cash' && (
          <div className="text-gray-600 mb-4 space-y-1">
            <p>Chiến dịch: <strong>{submitData.campaign}</strong></p>
            <p>Số tiền: <strong className="text-emerald-600">{new Intl.NumberFormat('vi-VN').format(submitData.amount)}đ</strong></p>
            <p>Địa điểm: <strong>{submitData.officeName}</strong></p>
            <p>Lịch hẹn: <strong>{submitData.date} lúc {submitData.time}</strong></p>
            <p className="text-sm text-gray-500 mt-2">Vui lòng đến đúng giờ. Bạn sẽ nhận biên nhận sau khi hoàn tất.</p>
          </div>
        )}
        <button onClick={resetAll} className="btn-orange">Đóng góp tiếp</button>
      </div></PageTransition>
    );
  }

  const inp = "w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400";

  return (
    <PageTransition>
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Đóng góp ngay</h1>
          <p className="text-sm text-gray-500">Chọn hình thức đóng góp và điền thông tin</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-100">
          {[
            { id: 'bank', label: '🏦 Chuyển khoản', icon: <Banknote className="w-4 h-4" /> },
            { id: 'item', label: '📦 Hiện vật', icon: <Package className="w-4 h-4" /> },
            { id: 'cash', label: '💵 Tiền mặt', icon: <Wallet className="w-4 h-4" /> },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${tab === t.id ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Bank donation form */}
        {tab === 'bank' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-card border border-gray-100 p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Chiến dịch *</label>
              <select className={inp} value={bankForm.campaignId} onChange={e => setBankForm(p => ({ ...p, campaignId: e.target.value, bankAccountId: '' }))}>
                <option value="">-- Chọn chiến dịch --</option>
                {activeCampaigns.map(c => <option key={c.id} value={c.id}>{c.image} {c.name}</option>)}
              </select>
            </div>
            {bankForm.campaignId && (
              <>
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-300 rounded-xl p-3">
                  <span className="text-sm text-amber-800">Nội dung chuyển khoản:</span>
                  <code className="text-lg font-mono font-bold text-amber-700">{transferNote}</code>
                  <button onClick={() => copyToClipboard(transferNote)} className="ml-auto flex items-center gap-1 px-2 py-1 bg-amber-500 text-white rounded-lg text-xs hover:bg-amber-600">
                    {copiedNote ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />} {copiedNote ? 'Đã copy' : 'Copy'}
                  </button>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Tài khoản ngân hàng *</label>
                  <select className={inp} value={bankForm.bankAccountId} onChange={e => setBankForm(p => ({ ...p, bankAccountId: e.target.value }))}>
                    <option value="">-- Chọn tài khoản --</option>
                    {availableBankAccounts.map(ba => <option key={ba.id} value={ba.id}>{ba.bankName} – {ba.accountNumber} ({ba.accountHolder})</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Số tiền (VNĐ) *</label>
                  <input type="number" min={1} className={inp} value={bankForm.amount} onChange={e => setBankForm(p => ({ ...p, amount: e.target.value }))} placeholder="VD: 5000000" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5 flex items-center gap-1.5"><ImageIcon className="w-4 h-4 text-orange-500" />Ảnh minh chứng chuyển khoản *</label>
                  {!bankProofPreview ? (
                    <div onClick={() => bankFileRef.current?.click()} className="border-2 border-dashed border-orange-300 rounded-xl p-6 text-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-all">
                      <Upload className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Click để chọn ảnh chụp màn hình giao dịch</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG – tối đa 10MB</p>
                      <input ref={bankFileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </div>
                  ) : (
                    <div className="relative rounded-xl overflow-hidden border-2 border-emerald-400">
                      <img src={bankProofPreview} alt="Proof" className="w-full max-h-48 object-contain bg-gray-50" />
                      <button onClick={() => { setBankProof(null); setBankProofPreview(''); }} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg"><X className="w-4 h-4" /></button>
                    </div>
                  )}
                </div>
                <button onClick={handleBankSubmit} disabled={!bankForm.campaignId || !bankForm.bankAccountId || !bankForm.amount}
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${bankForm.campaignId && bankForm.bankAccountId && bankForm.amount ? 'btn-orange' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                  <Heart className="w-4 h-4 inline mr-1" /> Gửi đóng góp
                </button>
              </>
            )}
          </motion.div>
        )}

        {/* Item donation form */}
        {tab === 'item' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-card border border-gray-100 p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Chiến dịch *</label>
              <select className={inp} value={itemForm.campaignId} onChange={e => setItemForm(p => ({ ...p, campaignId: e.target.value, neededItemId: '', dropPointId: '' }))}>
                <option value="">-- Chọn chiến dịch --</option>
                {activeCampaigns.map(c => <option key={c.id} value={c.id}>{c.image} {c.name}</option>)}
              </select>
            </div>
            {itemForm.campaignId && (
              <>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Vật phẩm đóng góp *</label>
                  <select className={inp} value={itemForm.neededItemId} onChange={e => setItemForm(p => ({ ...p, neededItemId: e.target.value }))}>
                    <option value="">-- Chọn vật phẩm --</option>
                    {availableNeededItems.map(n => <option key={n.id} value={n.id}>{n.itemName} (cần {n.requiredQty} {n.unit}, đã nhận {n.receivedQty})</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Số lượng *</label>
                  <input type="number" min={1} className={inp} value={itemForm.quantity} onChange={e => setItemForm(p => ({ ...p, quantity: e.target.value }))} placeholder="VD: 50" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Hình thức giao hàng *</label>
                  <div className="flex gap-3">
                    <button onClick={() => setItemForm(p => ({ ...p, deliveryMethod: 'self_drop' }))} className={`flex-1 flex items-center gap-2 justify-center px-4 py-3 rounded-xl border-2 transition-all ${itemForm.deliveryMethod === 'self_drop' ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-200 text-gray-500'}`}>
                      <Store className="w-4 h-4" /> Tự mang đến
                    </button>
                    <button onClick={() => setItemForm(p => ({ ...p, deliveryMethod: 'shipping' }))} className={`flex-1 flex items-center gap-2 justify-center px-4 py-3 rounded-xl border-2 transition-all ${itemForm.deliveryMethod === 'shipping' ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-200 text-gray-500'}`}>
                      <Truck className="w-4 h-4" /> Gửi vận chuyển
                    </button>
                  </div>
                </div>
                {itemForm.deliveryMethod === 'self_drop' && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">Điểm nhận hàng *</label>
                    <select className={inp} value={itemForm.dropPointId} onChange={e => setItemForm(p => ({ ...p, dropPointId: e.target.value }))}>
                      <option value="">-- Chọn điểm nhận --</option>
                      {availableDropPoints.map(dp => <option key={dp.id} value={dp.id}>{dp.name} – {dp.address}</option>)}
                    </select>
                  </div>
                )}
                {itemForm.deliveryMethod === 'shipping' && (
                  <div className="space-y-3 p-4 bg-orange-50 rounded-xl border border-orange-200">
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className="text-xs font-medium text-gray-600 block mb-1">Tên người gửi</label><input className={inp} value={itemForm.shippingName} onChange={e => setItemForm(p => ({ ...p, shippingName: e.target.value }))} placeholder={user?.name || ''} /></div>
                      <div><label className="text-xs font-medium text-gray-600 block mb-1">SĐT</label><input className={inp} value={itemForm.shippingPhone} onChange={e => setItemForm(p => ({ ...p, shippingPhone: e.target.value }))} placeholder={user?.phone || ''} /></div>
                    </div>
                    <div><label className="text-xs font-medium text-gray-600 block mb-1">Địa chỉ lấy hàng</label><input className={inp} value={itemForm.shippingAddress} onChange={e => setItemForm(p => ({ ...p, shippingAddress: e.target.value }))} placeholder="VD: 23 Nguyễn Huệ, TP.HCM" /></div>
                  </div>
                )}
                <button onClick={handleItemSubmit} disabled={!itemForm.campaignId || !itemForm.neededItemId || !itemForm.quantity}
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${itemForm.campaignId && itemForm.neededItemId && itemForm.quantity ? 'btn-orange' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                  <Package className="w-4 h-4 inline mr-1" /> Đăng ký đóng góp
                </button>
              </>
            )}
          </motion.div>
        )}

        {/* Cash appointment form */}
        {tab === 'cash' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-card border border-gray-100 p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Chiến dịch *</label>
              <select className={inp} value={cashForm.campaignId} onChange={e => setCashForm(p => ({ ...p, campaignId: e.target.value, cashPointId: '' }))}>
                <option value="">-- Chọn chiến dịch --</option>
                {activeCampaigns.map(c => <option key={c.id} value={c.id}>{c.image} {c.name}</option>)}
              </select>
            </div>
            {cashForm.campaignId && (
              <>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Điểm nhận tiền mặt *</label>
                  <select className={inp} value={cashForm.cashPointId} onChange={e => setCashForm(p => ({ ...p, cashPointId: e.target.value }))}>
                    <option value="">-- Chọn điểm nhận --</option>
                    {availableCashPoints.map(cp => <option key={cp.id} value={cp.id}>{cp.officeName} – {cp.address}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Số tiền (VNĐ) *</label>
                  <input type="number" min={50000} className={inp} value={cashForm.amount} onChange={e => setCashForm(p => ({ ...p, amount: e.target.value }))} placeholder="VD: 1000000" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">Ngày hẹn *</label>
                    <input type="date" className={inp} value={cashForm.appointmentDate} onChange={e => setCashForm(p => ({ ...p, appointmentDate: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">Giờ hẹn</label>
                    <input type="time" className={inp} value={cashForm.appointmentTime} onChange={e => setCashForm(p => ({ ...p, appointmentTime: e.target.value }))} />
                  </div>
                </div>
                <button onClick={handleCashSubmit} disabled={!cashForm.campaignId || !cashForm.cashPointId || !cashForm.amount || !cashForm.appointmentDate}
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${cashForm.campaignId && cashForm.cashPointId && cashForm.amount && cashForm.appointmentDate ? 'btn-orange' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                  <Calendar className="w-4 h-4 inline mr-1" /> Đặt lịch hẹn
                </button>
              </>
            )}
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
