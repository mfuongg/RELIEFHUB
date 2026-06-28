import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import PageTransition from '../../components/PageTransition';
import { Search, Heart, MapPin, Users, Target, Calendar } from 'lucide-react';

export default function DonorCampaigns() {
  const { campaigns, neededItems, bankAccounts, dropPoints, formatCurrency } = useApp();
  const [search, setSearch] = useState('');
  const [filterArea, setFilterArea] = useState('all');

  const areas = [...new Set(campaigns.filter(c => c.status === 'active').map(c => c.area))];

  const filtered = campaigns.filter(c => {
    if (c.status !== 'active') return false;
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase());
    const matchArea = filterArea === 'all' || c.area === filterArea;
    return matchSearch && matchArea;
  });

  return (
    <PageTransition>
      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Chiến dịch đang mở</h1>
          <p className="text-sm text-gray-500">Các chiến dịch cứu trợ đang cần sự hỗ trợ của bạn</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30" placeholder="Tìm chiến dịch..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm" value={filterArea} onChange={e => setFilterArea(e.target.value)}>
            <option value="all">Tất cả khu vực</option>
            {areas.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>

        {/* Campaign cards */}
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.length === 0 ? (
            <div className="md:col-span-2 text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-card">
              <div className="text-4xl mb-3">🔍</div>
              <p className="text-gray-400">Không tìm thấy chiến dịch nào</p>
            </div>
          ) : filtered.map((c, i) => {
            const pct = Math.round((c.raised / c.target) * 100);
            const itemCount = neededItems.filter(n => n.campaignId === c.id).length;
            const bankCount = bankAccounts.filter(b => b.campaignId === c.id && b.active).length;
            const dropCount = dropPoints.filter(d => d.campaignId === c.id && d.active).length;
            return (
              <motion.div key={c.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-4xl">{c.image}</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800">{c.name}</h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{c.area}</span>
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" />{c.households} hộ</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{c.description}</p>

                  {/* Progress */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span className="flex items-center gap-1"><Target className="w-3 h-3" /> {formatCurrency(c.raised)}</span>
                      <span>{pct}% của {formatCurrency(c.target)}</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>

                  {/* Quick info */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs mb-4">
                    <div className="p-2 bg-blue-50 rounded-lg"><div className="font-bold text-blue-700">{bankCount}</div><div className="text-blue-500">Tài khoản</div></div>
                    <div className="p-2 bg-orange-50 rounded-lg"><div className="font-bold text-orange-700">{itemCount}</div><div className="text-orange-500">Vật phẩm</div></div>
                    <div className="p-2 bg-emerald-50 rounded-lg"><div className="font-bold text-emerald-700">{dropCount}</div><div className="text-emerald-500">Điểm nhận</div></div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link to="/dashboard/donor/guide" className="flex-1 text-center py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50">Hướng dẫn</Link>
                    <Link to="/dashboard/donor/contribute" className="flex-1 text-center py-2.5 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 flex items-center justify-center gap-1.5">
                      <Heart className="w-4 h-4" /> Đóng góp
                    </Link>
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
