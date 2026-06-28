import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import PageTransition from '../../components/PageTransition';
import { MapPin, Users, Calendar, ArrowLeft, Heart, CheckCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { day: 'T2', amount: 45 }, { day: 'T3', amount: 82 }, { day: 'T4', amount: 55 },
  { day: 'T5', amount: 120 }, { day: 'T6', amount: 98 }, { day: 'T7', amount: 145 },
  { day: 'CN', amount: 110 },
];

export default function CampaignDetail() {
  const { id } = useParams();
  const { campaigns, formatCurrency } = useApp();
  const campaign = campaigns.find(c => c.id === parseInt(id));

  if (!campaign) return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center"><div className="text-5xl mb-4">😔</div><p>Chiến dịch không tồn tại</p><Link to="/campaigns" className="btn-primary mt-4 inline-block">Quay lại</Link></div>
      </div>
    </PageTransition>
  );

  const pct = Math.round(campaign.raised / campaign.target * 100);
  const statusMap = { active: 'Đang diễn ra', completed: 'Hoàn thành', pending: 'Sắp diễn ra' };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-sky-700 to-blue-800 pt-16">
          <div className="max-w-5xl mx-auto px-4 py-10">
            <Link to="/campaigns" className="inline-flex items-center gap-2 text-sky-300 hover:text-white mb-6 text-sm transition-colors">
              <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
            </Link>
            <div className="flex items-start gap-6">
              <div className="text-7xl bg-white/10 rounded-2xl p-4">{campaign.image}</div>
              <div>
                <span className={campaign.status === 'active' ? 'badge-verified' : campaign.status === 'completed' ? 'badge-info' : 'badge-pending'}>
                  {statusMap[campaign.status]}
                </span>
                <h1 className="text-3xl font-black text-white mt-2 mb-3">{campaign.name}</h1>
                <div className="flex flex-wrap gap-4 text-sky-200 text-sm">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{campaign.area}</span>
                  <span className="flex items-center gap-1"><Users className="w-4 h-4" />{campaign.households} hộ dân</span>
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{campaign.start} — {campaign.end}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div className="card">
                <h2 className="section-title text-lg mb-3">Mô tả chiến dịch</h2>
                <p className="text-gray-600 leading-relaxed">{campaign.description}</p>
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {[['🎯', 'Mục tiêu', `${(campaign.target / 1e6).toFixed(0)}M VNĐ`], ['✅', 'Đã đạt', `${(campaign.raised / 1e6).toFixed(0)}M VNĐ`], ['🙋', 'TNV', `${campaign.volunteers} người`]].map(([icon, label, val], i) => (
                    <div key={i} className="text-center p-3 bg-gray-50 rounded-xl">
                      <div className="text-2xl mb-1">{icon}</div>
                      <div className="text-xs text-gray-500">{label}</div>
                      <div className="font-bold text-gray-900 text-sm">{val}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chart */}
              <div className="card">
                <h2 className="section-title text-lg mb-4">Tiến độ đóng góp (7 ngày qua)</h2>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(v) => [`${v}M VNĐ`, 'Đóng góp']} />
                    <Area type="monotone" dataKey="amount" stroke="#0ea5e9" strokeWidth={2} fill="url(#colorAmt)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <div className="card">
                <div className="text-center mb-4">
                  <div className="text-4xl font-black gradient-text">{pct}%</div>
                  <div className="text-sm text-gray-500">Đã đạt được</div>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-sky-400 to-sky-600 rounded-full"
                  />
                </div>
                <div className="space-y-2 text-sm mb-5">
                  <div className="flex justify-between"><span className="text-gray-500">Đã quyên góp</span><span className="font-bold text-sky-600">{(campaign.raised / 1e6).toFixed(0)}M VNĐ</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Mục tiêu</span><span className="font-bold">{(campaign.target / 1e6).toFixed(0)}M VNĐ</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Còn thiếu</span><span className="font-bold text-orange-500">{((campaign.target - campaign.raised) / 1e6).toFixed(0)}M VNĐ</span></div>
                </div>
                <Link to="/login" className="w-full btn-orange flex items-center justify-center gap-2">
                  <Heart className="w-4 h-4" /> Đóng góp ngay
                </Link>
              </div>

              <div className="card">
                <h3 className="font-bold text-sm text-gray-900 mb-3">Cột mốc đạt được</h3>
                {[25, 50, 75].map(milestone => (
                  <div key={milestone} className={`flex items-center gap-2 py-2 text-sm ${pct >= milestone ? 'text-emerald-600' : 'text-gray-400'}`}>
                    <CheckCircle className={`w-4 h-4 ${pct >= milestone ? 'text-emerald-500' : 'text-gray-300'}`} />
                    Đạt {milestone}% mục tiêu
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
