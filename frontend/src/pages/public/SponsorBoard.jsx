import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../../components/PageTransition';
import { Trophy, Star, Award, ArrowLeft } from 'lucide-react';

const sponsors = [
  { rank: 1, name: 'Tập đoàn Vingroup', amount: 500000000, campaigns: 8, icon: '🏆', badge: 'Đối tác vàng' },
  { rank: 2, name: 'Ngân hàng VCB', amount: 350000000, campaigns: 6, icon: '🥈', badge: 'Đối tác bạc' },
  { rank: 3, name: 'FPT Corporation', amount: 280000000, campaigns: 5, icon: '🥉', badge: 'Đối tác đồng' },
  { rank: 4, name: 'Masan Group', amount: 150000000, campaigns: 4, icon: '⭐', badge: 'Nhà tài trợ VIP' },
  { rank: 5, name: 'Techcombank', amount: 120000000, campaigns: 3, icon: '⭐', badge: 'Nhà tài trợ' },
  { rank: 6, name: 'Hoàng Anh Gia Lai', amount: 80000000, campaigns: 2, icon: '⭐', badge: 'Nhà tài trợ' },
];

export default function SponsorBoard() {
  const top3 = sponsors.slice(0, 3);
  const rest = sponsors.slice(3);

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 pt-16">
          <div className="max-w-4xl mx-auto px-4 py-12 text-center">
            <Link to="/" className="inline-flex items-center gap-2 text-amber-200 hover:text-white mb-6 text-sm transition-colors">
              <ArrowLeft className="w-4 h-4" /> Về trang chủ
            </Link>
            <div className="text-5xl mb-3">🏆</div>
            <h1 className="text-3xl font-black text-white mb-2">Bảng vinh danh nhà tài trợ</h1>
            <p className="text-amber-100">Tri ân những đóng góp quý báu cho cộng đồng</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-10">
          {/* Top 3 Podium */}
          <div className="flex items-end justify-center gap-4 mb-12">
            {[top3[1], top3[0], top3[2]].map((s, podiumIdx) => {
              const heights = ['h-32', 'h-44', 'h-28'];
              const delays = [0.2, 0, 0.4];
              const colors = ['bg-gray-400', 'bg-amber-400', 'bg-amber-600'];
              return s ? (
                <motion.div
                  key={s.rank}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: delays[podiumIdx], duration: 0.5 }}
                  className="text-center flex-1 max-w-44"
                >
                  <div className="text-4xl mb-2">{s.icon}</div>
                  <div className="text-sm font-bold text-gray-900 mb-1 line-clamp-2">{s.name}</div>
                  <div className="text-xs text-gray-500 mb-2">{(s.amount / 1e6).toFixed(0)}M VNĐ</div>
                  <div className={`${heights[podiumIdx]} ${colors[podiumIdx]} rounded-t-xl flex items-center justify-center`}>
                    <span className="text-white font-black text-2xl">#{s.rank}</span>
                  </div>
                </motion.div>
              ) : <div key={podiumIdx} className="flex-1 max-w-44" />;
            })}
          </div>

          {/* Full list */}
          <div className="card overflow-hidden">
            <h2 className="section-title text-lg p-6 pb-0">Tất cả nhà tài trợ</h2>
            <div className="divide-y divide-gray-50">
              {sponsors.map((s, i) => (
                <motion.div
                  key={s.rank}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                    {s.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900">{s.name}</div>
                    <div className="text-xs text-gray-500">{s.campaigns} chiến dịch tham gia</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-amber-600">{(s.amount / 1e6).toFixed(0)}M VNĐ</div>
                    <span className="badge-pending text-xs">{s.badge}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="text-center mt-8">
            <Link to="/register" className="btn-orange inline-flex items-center gap-2">
              🤝 Trở thành nhà tài trợ
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
