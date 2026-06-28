import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import PageTransition from '../../components/PageTransition';
import {
  TrendingDown, TrendingUp, Wallet, Package, Calendar, ArrowUpRight, ArrowDownRight, Camera
} from 'lucide-react';

export default function DonorTracking() {
  const { donationTracking, campaigns } = useApp();
  const [selectedCampaignId, setSelectedCampaignId] = useState('');
  const [detailTrack, setDetailTrack] = useState(null);

  const activeCampaigns = campaigns.filter(c => c.status === 'active' || c.status === 'completed');
  const campaignTracks = selectedCampaignId ? donationTracking.filter(t => t.campaignId === parseInt(selectedCampaignId)) : donationTracking;

  return (
    <PageTransition>
      <div className="p-6 space-y-6 max-w-5xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Theo dõi sử dụng</h1>
          <p className="text-sm text-gray-500">Minh bạch: tổng nhận, đã sử dụng, còn lại cho từng chiến dịch</p>
        </div>

        {/* Campaign selector */}
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-5">
          <label className="text-sm font-medium text-gray-700 block mb-2">Chọn chiến dịch</label>
          <select value={selectedCampaignId} onChange={e => setSelectedCampaignId(e.target.value)} className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500/30">
            <option value="">-- Tất cả chiến dịch --</option>
            {activeCampaigns.map(c => <option key={c.id} value={c.id}>{c.image} {c.name}</option>)}
          </select>
        </div>

        {/* Tracking cards */}
        <div className="space-y-4">
          {campaignTracks.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-card">
              <TrendingDown className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-400">Chưa có dữ liệu theo dõi</p>
            </div>
          ) : campaignTracks.map((track, i) => {
            const isMoney = track.type === 'money';
            const pctUsed = track.totalReceived > 0 ? Math.round((track.totalUsed / track.totalReceived) * 100) : 0;
            return (
              <motion.div key={track.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl shadow-card border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isMoney ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
                      {isMoney ? <Wallet className="w-5 h-5" /> : <Package className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm">{track.label}</h3>
                      <p className="text-xs text-gray-400">{campaigns.find(c => c.id === track.campaignId)?.name}</p>
                    </div>
                  </div>
                  <button onClick={() => setDetailTrack(track)} className="text-xs text-orange-500 border border-orange-200 px-3 py-1.5 rounded-lg hover:bg-orange-50">Xem chi tiết</button>
                </div>

                {/* Summary stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="p-3 bg-emerald-50 rounded-xl text-center">
                    <div className="text-lg font-bold text-emerald-700">{isMoney ? `${(track.totalReceived / 1e6).toFixed(0)}M` : track.totalReceived}</div>
                    <div className="text-xs text-emerald-500">Tổng nhận {isMoney ? 'đ' : track.unit}</div>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-xl text-center">
                    <div className="text-lg font-bold text-orange-700">{isMoney ? `${(track.totalUsed / 1e6).toFixed(0)}M` : track.totalUsed}</div>
                    <div className="text-xs text-orange-500">Đã dùng {isMoney ? 'đ' : track.unit}</div>
                  </div>
                  <div className="p-3 bg-sky-50 rounded-xl text-center">
                    <div className="text-lg font-bold text-sky-700">{isMoney ? `${(track.remaining / 1e6).toFixed(0)}M` : track.remaining}</div>
                    <div className="text-xs text-sky-500">Còn lại {isMoney ? 'đ' : track.unit}</div>
                  </div>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Tỷ lệ đã sử dụng</span>
                    <span>{pctUsed}%</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${pctUsed >= 90 ? 'bg-red-400' : pctUsed >= 60 ? 'bg-orange-400' : 'bg-emerald-400'}`} style={{ width: `${pctUsed}%` }} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Timeline detail modal */}
      {detailTrack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setDetailTrack(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-gray-100">
              <h3 className="font-bold text-gray-800">Chi tiết: {detailTrack.label}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{campaigns.find(c => c.id === detailTrack.campaignId)?.name}</p>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <div className="space-y-3">
                {detailTrack.timeline?.map((event, idx) => {
                  const isIncome = event.amount > 0;
                  return (
                    <div key={idx} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isIncome ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
                          {isIncome ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        </div>
                        {idx < detailTrack.timeline.length - 1 && <div className="w-0.5 h-8 bg-gray-200" />}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{event.date}</span>
                        </div>
                        <p className="text-sm text-gray-700 mt-0.5">{event.desc}</p>
                        <span className={`text-sm font-bold ${isIncome ? 'text-emerald-600' : 'text-orange-600'}`}>
                          {isIncome ? '+' : ''}{detailTrack.type === 'money' ? new Intl.NumberFormat('vi-VN').format(event.amount) + 'đ' : `${event.amount} ${detailTrack.unit}`}
                        </span>
                        {event.photo && <div className="mt-2"><img src={event.photo} alt="evidence" className="rounded-lg max-h-32 object-cover" /></div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="p-4 border-t border-gray-100">
              <button onClick={() => setDetailTrack(null)} className="w-full py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200">Đóng</button>
            </div>
          </motion.div>
        </div>
      )}
    </PageTransition>
  );
}
