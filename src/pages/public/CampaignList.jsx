import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import PageTransition from '../../components/PageTransition';
import { MapPin, Search, Filter, ArrowRight, Users, Calendar, TrendingUp } from 'lucide-react';

const FILTER_TYPES = ['Tất cả', 'Lũ lụt', 'Bão', 'Sạt lở đất', 'Hạn hán'];
const FILTER_STATUS = ['Tất cả', 'Đang diễn ra', 'Hoàn thành', 'Sắp diễn ra'];

export default function CampaignList() {
  const { campaigns, formatCurrency } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('Tất cả');
  const [statusFilter, setStatusFilter] = useState('Tất cả');

  const statusMap = { active: 'Đang diễn ra', completed: 'Hoàn thành', pending: 'Sắp diễn ra' };
  const statusColorMap = { active: 'badge-verified', completed: 'badge-info', pending: 'badge-pending' };

  const filtered = campaigns.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.area.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'Tất cả' || c.type === typeFilter;
    const matchStatus = statusFilter === 'Tất cả' || statusMap[c.status] === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-700 to-blue-800 pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <nav className="flex items-center gap-2 text-sky-300 text-sm mb-4">
              <Link to="/" className="hover:text-white transition-colors">Trang chủ</Link>
              <span>/</span><span className="text-white">Chiến dịch</span>
            </nav>
            <h1 className="text-3xl font-black text-white mb-2">Tất cả chiến dịch</h1>
            <p className="text-sky-200">Khám phá và hỗ trợ các chiến dịch cứu trợ đang diễn ra</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search & Filter */}
          <div className="card mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Tìm kiếm chiến dịch, địa điểm..."
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="input-field w-auto">
                  {FILTER_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input-field w-auto">
                  {FILTER_STATUS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">Tìm thấy <span className="font-bold text-gray-900">{filtered.length}</span> chiến dịch</p>
          </div>

          {/* Campaign Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="card group cursor-pointer"
                onClick={() => navigate(`/campaigns/${c.id}`)}
              >
                <div className="bg-gradient-to-br from-sky-50 to-blue-100 rounded-xl h-36 flex items-center justify-center text-6xl mb-4 group-hover:scale-105 transition-transform relative">
                  {c.image}
                  <span className={`absolute top-3 right-3 ${statusColorMap[c.status]}`}>{statusMap[c.status]}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 leading-tight">{c.name}</h3>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{c.description}</p>
                <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-sky-500" />{c.area}</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3 text-orange-500" />{c.households} hộ</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-purple-500" />{c.start}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tiến độ</span>
                    <span className="font-bold text-sky-600">{Math.round(c.raised / c.target * 100)}%</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.round(c.raised / c.target * 100)}%` }}
                      transition={{ duration: 1, ease: 'easeOut', delay: i * 0.07 + 0.3 }}
                      className={`h-full rounded-full ${c.status === 'completed' ? 'bg-emerald-500' : 'bg-gradient-to-r from-sky-400 to-sky-600'}`}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{(c.raised / 1e6).toFixed(0)}M VNĐ</span>
                    <span>/{(c.target / 1e6).toFixed(0)}M VNĐ</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-4">🔍</div>
              <p className="font-medium">Không tìm thấy chiến dịch phù hợp</p>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
