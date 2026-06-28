import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import PageTransition from '../../components/PageTransition';
import {
  Banknote, Package, Wallet, MapPin, Clock, Phone, Copy, CheckCircle2,
  AlertCircle, Building2, Navigation, Info, Star
} from 'lucide-react';

export default function DonationGuide() {
  const { campaigns, bankAccounts, dropPoints, cashPoints, neededItems, user, generateTransferNote } = useApp();
  const [selectedCampaignId, setSelectedCampaignId] = useState('');
  const [copiedNote, setCopiedNote] = useState(false);
  const [tab, setTab] = useState('bank'); // bank | item | cash

  const activeCampaigns = campaigns.filter(c => c.status === 'active');
  const selectedCampaign = campaigns.find(c => c.id === parseInt(selectedCampaignId));

  const transferNote = selectedCampaign && user ? generateTransferNote(selectedCampaign.id, user.id) : '';

  const campaignBankAccounts = selectedCampaignId ? bankAccounts.filter(b => b.campaignId === parseInt(selectedCampaignId) && b.active) : [];
  const campaignDropPoints = selectedCampaignId ? dropPoints.filter(d => d.campaignId === parseInt(selectedCampaignId) && d.active) : [];
  const campaignCashPoints = selectedCampaignId ? cashPoints.filter(c => c.campaignId === parseInt(selectedCampaignId) && c.active) : [];
  const campaignNeededItems = selectedCampaignId ? neededItems.filter(n => n.campaignId === parseInt(selectedCampaignId)) : [];

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedNote(true);
      setTimeout(() => setCopiedNote(false), 2000);
    });
  };

  const priorityMap = {
    critical: { label: '🔴 Khẩn cấp', color: 'bg-red-100 text-red-700' },
    high: { label: '🟠 Ưu tiên cao', color: 'bg-orange-100 text-orange-700' },
    medium: { label: '🟡 Trung bình', color: 'bg-yellow-100 text-yellow-700' },
    low: { label: '⚪ Thấp', color: 'bg-gray-100 text-gray-600' },
  };

  return (
    <PageTransition>
      <div className="p-6 space-y-6 max-w-5xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Hướng dẫn Đóng góp</h1>
          <p className="text-sm text-gray-500">Chọn chiến dịch và hình thức đóng góp phù hợp</p>
        </div>

        {/* Campaign selector */}
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-5">
          <label className="text-sm font-medium text-gray-700 block mb-2">Chọn chiến dịch đang mở</label>
          <select value={selectedCampaignId} onChange={e => setSelectedCampaignId(e.target.value)} className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400">
            <option value="">-- Chọn chiến dịch --</option>
            {activeCampaigns.map(c => <option key={c.id} value={c.id}>{c.image} {c.name} ({c.area})</option>)}
          </select>
          {!selectedCampaignId && (
            <div className="mt-4 flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700">
              <Info className="w-4 h-4 flex-shrink-0" />
              Vui lòng chọn chiến dịch để xem hướng dẫn đóng góp chi tiết.
            </div>
          )}
        </div>

        {selectedCampaign && (
          <>
            {/* Campaign info banner */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-5 flex items-center gap-4">
              <span className="text-4xl">{selectedCampaign.image}</span>
              <div className="flex-1">
                <h2 className="font-bold text-gray-800">{selectedCampaign.name}</h2>
                <p className="text-sm text-gray-600 mt-0.5">{selectedCampaign.description}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                  <span>📍 {selectedCampaign.area}</span>
                  <span>🏠 {selectedCampaign.households} hộ</span>
                  <span>🎯 Mục tiêu: {new Intl.NumberFormat('vi-VN').format(selectedCampaign.target)}đ</span>
                </div>
              </div>
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

            {/* Bank Transfer Tab */}
            {tab === 'bank' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                {/* Transfer note */}
                <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                    <h3 className="font-bold text-amber-900">Nội dung chuyển khoản</h3>
                  </div>
                  <p className="text-sm text-amber-800 mb-3">Vui lòng ghi chính xác nội dung chuyển khoản để hệ thống tự động đối soát:</p>
                  <div className="flex items-center gap-2 bg-white border-2 border-dashed border-amber-400 rounded-xl p-3">
                    <code className="flex-1 text-lg font-mono font-bold text-amber-700">{transferNote}</code>
                    <button onClick={() => copyToClipboard(transferNote)} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors">
                      {copiedNote ? <><CheckCircle2 className="w-4 h-4" /> Đã copy</> : <><Copy className="w-4 h-4" /> Copy</>}
                    </button>
                  </div>
                </div>

                {/* Bank accounts */}
                <div className="grid md:grid-cols-2 gap-4">
                  {campaignBankAccounts.map(ba => (
                    <div key={ba.id} className="bg-white rounded-2xl shadow-card border border-gray-100 p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-white">
                          <Building2 className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800">{ba.bankName}</h4>
                          <p className="text-xs text-gray-500">{ba.branch}</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-gray-500">Số tài khoản:</span><span className="font-mono font-bold text-gray-800">{ba.accountNumber}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Chủ tài khoản:</span><span className="font-medium text-gray-800">{ba.accountHolder}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Nội dung CK:</span><span className="font-mono text-orange-600 font-medium">{ba.transferNoteFormat.replace('{user_id}', user?.id || 'X')}</span></div>
                      </div>
                      {/* QR placeholder */}
                      <div className="mt-4 flex flex-col items-center">
                        <div className="w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                          <span className="text-xs text-gray-400">QR Code</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">Quét mã để chuyển khoản nhanh</p>
                      </div>
                    </div>
                  ))}
                  {campaignBankAccounts.length === 0 && (
                    <div className="md:col-span-2 text-center py-8 text-gray-400">
                      <Building2 className="w-10 h-10 mx-auto mb-2 opacity-30" />
                      <p>Chiến dịch này chưa có tài khoản ngân hàng.</p>
                    </div>
                  )}
                </div>
                <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 text-sm text-sky-700 flex items-start gap-2">
                  <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p>Sau khi chuyển khoản, vui lòng tải lên ảnh chụp màn hình giao dịch tại mục "Đóng góp ngay" để được xác minh và cấp biên nhận điện tử.</p>
                </div>
              </motion.div>
            )}

            {/* In-Kind Tab */}
            {tab === 'item' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                {/* Needed items */}
                <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-5">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Package className="w-5 h-5 text-orange-500" />Vật phẩm đang cần</h3>
                  <div className="space-y-2">
                    {campaignNeededItems.map(item => {
                      const pct = Math.round((item.receivedQty / item.requiredQty) * 100);
                      const pm = priorityMap[item.priority] || priorityMap.low;
                      return (
                        <div key={item.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm text-gray-800">{item.itemName}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${pm.color}`}>{pm.label}</span>
                            </div>
                            <span className="text-sm font-bold text-gray-700">{item.receivedQty}/{item.requiredQty} {item.unit}</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${pct >= 100 ? 'bg-emerald-500' : pct >= 50 ? 'bg-orange-400' : 'bg-red-400'}`} style={{ width: `${Math.min(100, pct)}%` }} />
                          </div>
                        </div>
                      );
                    })}
                    {campaignNeededItems.length === 0 && <p className="text-center text-gray-400 text-sm py-4">Chưa có danh sách vật phẩm cần thiết.</p>}
                  </div>
                </div>

                {/* Drop points */}
                <div className="grid md:grid-cols-2 gap-4">
                  {campaignDropPoints.map(dp => (
                    <div key={dp.id} className="bg-white rounded-2xl shadow-card border border-gray-100 p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Navigation className="w-5 h-5 text-rose-500" />
                        <h4 className="font-bold text-gray-800 text-sm">{dp.name}</h4>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2"><MapPin className="w-4 h-4 text-gray-400 mt-0.5" /><span className="text-gray-600">{dp.address}</span></div>
                        <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-gray-400" /><span className="text-gray-600">{dp.hours}</span></div>
                        <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /><span className="text-gray-600">{dp.receiver} – {dp.phone}</span></div>
                        <div className="flex items-center gap-2"><Package className="w-4 h-4 text-gray-400" /><span className="text-gray-600">Sức chứa: {dp.capacity}</span></div>
                      </div>
                      {dp.notes && <div className="mt-3 p-2.5 bg-amber-50 rounded-lg text-xs text-amber-700">{dp.notes}</div>}
                    </div>
                  ))}
                  {campaignDropPoints.length === 0 && (
                    <div className="md:col-span-2 text-center py-8 text-gray-400">
                      <MapPin className="w-10 h-10 mx-auto mb-2 opacity-30" />
                      <p>Chiến dịch này chưa có điểm nhận hàng.</p>
                    </div>
                  )}
                </div>
                <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 text-sm text-sky-700 flex items-start gap-2">
                  <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p>Chọn vật phẩm cần đóng góp, điền số lượng và đăng ký tại mục "Đóng góp ngay". Bạn có thể tự mang hàng đến điểm nhận hoặc gửi bằng dịch vụ vận chuyển.</p>
                </div>
              </motion.div>
            )}

            {/* Cash Tab */}
            {tab === 'cash' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {campaignCashPoints.map(cp => (
                    <div key={cp.id} className="bg-white rounded-2xl shadow-card border border-gray-100 p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Building2 className="w-5 h-5 text-emerald-500" />
                        <h4 className="font-bold text-gray-800 text-sm">{cp.officeName}</h4>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2"><MapPin className="w-4 h-4 text-gray-400 mt-0.5" /><span className="text-gray-600">{cp.address}</span></div>
                        <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /><span className="text-gray-600">{cp.phone}</span></div>
                        <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-gray-400" /><span className="text-gray-600">{cp.schedule}</span></div>
                        <div className="flex items-center gap-2"><Star className="w-4 h-4 text-gray-400" /><span className="text-gray-600">Người nhận: {cp.receiverName}</span></div>
                      </div>
                      {cp.requirement && <div className="mt-3 p-2.5 bg-amber-50 rounded-lg text-xs text-amber-700">{cp.requirement}</div>}
                    </div>
                  ))}
                  {campaignCashPoints.length === 0 && (
                    <div className="md:col-span-2 text-center py-8 text-gray-400">
                      <Wallet className="w-10 h-10 mx-auto mb-2 opacity-30" />
                      <p>Chiến dịch này chưa có điểm nhận tiền mặt.</p>
                    </div>
                  )}
                </div>
                <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 text-sm text-sky-700 flex items-start gap-2">
                  <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p>Đặt lịch hẹn trước tại mục "Đóng góp ngay" để đến đóng góp tiền mặt. Bạn sẽ nhận biên nhận điện tử ngay sau khi hoàn tất.</p>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </PageTransition>
  );
}
