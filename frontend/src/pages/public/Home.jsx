import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import PageTransition from '../../components/PageTransition';
import {
  Heart, Users, MapPin, TrendingUp, ArrowRight, Star,
  Shield, AlertTriangle, CheckCircle, Zap, Globe, Activity
} from 'lucide-react';

const stats = [
  { label: 'Chiến dịch đang chạy', value: '12', icon: <Activity className="w-6 h-6" />, color: 'from-sky-400 to-sky-600', bg: 'bg-sky-50' },
  { label: 'Tổng đóng góp', value: '8.5 tỷ', icon: <Heart className="w-6 h-6" />, color: 'from-orange-400 to-orange-600', bg: 'bg-orange-50' },
  { label: 'Hộ được hỗ trợ', value: '24,500+', icon: <Users className="w-6 h-6" />, color: 'from-emerald-400 to-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Tình nguyện viên', value: '1,200+', icon: <Shield className="w-6 h-6" />, color: 'from-purple-400 to-purple-600', bg: 'bg-purple-50' },
];

const campaigns = [
  { id: 1, name: 'Cứu trợ lũ lụt miền Trung', area: 'Quảng Bình', raised: 380, target: 500, img: '🌊', tag: 'Đang diễn ra', tagColor: 'badge-verified' },
  { id: 2, name: 'Hỗ trợ bão số 5 Đà Nẵng', area: 'Đà Nẵng', raised: 210, target: 300, img: '🌀', tag: 'Đang diễn ra', tagColor: 'badge-verified' },
  { id: 3, name: 'Hạn hán Tây Nguyên', area: 'Đắk Lắk', raised: 45, target: 150, img: '☀️', tag: 'Cần hỗ trợ', tagColor: 'badge-pending' },
];

const steps = [
  { step: '01', title: 'Đăng ký tài khoản', desc: 'Chọn vai trò phù hợp: nhà tài trợ, tình nguyện viên, người dân...', icon: <Users className="w-6 h-6" />, color: 'bg-sky-500' },
  { step: '02', title: 'Đóng góp / Gửi yêu cầu', desc: 'Nhà tài trợ đóng góp tiền/hiện vật. Người dân gửi yêu cầu hỗ trợ.', icon: <Heart className="w-6 h-6" />, color: 'bg-orange-500' },
  { step: '03', title: 'Xác minh & Phân bổ', desc: 'Ban tài chính xác minh. Admin phân bổ nguồn lực theo nhu cầu.', icon: <CheckCircle className="w-6 h-6" />, color: 'bg-emerald-500' },
  { step: '04', title: 'Trao hàng & Báo cáo', desc: 'Tình nguyện viên vận chuyển. Hệ thống theo dõi và báo cáo minh bạch.', icon: <TrendingUp className="w-6 h-6" />, color: 'bg-purple-500' },
];

export default function Home() {
  const { user, disasters, campaigns: ctxCampaigns } = useApp();
  const navigate = useNavigate();
  const activeCampaigns = ctxCampaigns.filter(c => c.status === 'active').slice(0, 3);
  const activeDisasters = disasters.filter(d => d.status === 'active' || d.status === 'recovering');

  return (
    <PageTransition>
      <div className="min-h-screen bg-white">
        {/* Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-gradient-to-br from-sky-500 to-sky-700 rounded-xl flex items-center justify-center text-lg shadow">🆘</div>
                <span className="font-bold text-xl gradient-text">ReliefHub</span>
              </Link>
              <div className="hidden md:flex items-center gap-6">
                <Link to="/campaigns" className="text-sm font-medium text-gray-600 hover:text-sky-600 transition-colors">Chiến dịch</Link>
                <Link to="/sponsors" className="text-sm font-medium text-gray-600 hover:text-sky-600 transition-colors">Nhà tài trợ</Link>
              </div>
              <div className="flex items-center gap-3">
                {user ? (
                  <Link to={`/dashboard/${user.role}`} className="btn-primary text-sm py-2 px-4">
                    Vào hệ thống
                  </Link>
                ) : (
                  <>
                    <Link to="/login" className="btn-secondary text-sm py-2 px-4">Đăng nhập</Link>
                    <Link to="/register" className="btn-primary text-sm py-2 px-4">Đăng ký</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-sky-900 via-sky-800 to-blue-900 pt-16">
          <div className="absolute inset-0 hero-pattern opacity-20" />
          {/* Floating shapes */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-float" />
          <div className="absolute top-40 right-20 w-32 h-32 bg-orange-400/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-10 left-1/3 w-24 h-24 bg-sky-400/20 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }} />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
              >
                <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Zap className="w-4 h-4" />
                  Hệ thống cứu trợ thiên tai toàn quốc
                </div>
                <h1 className="text-4xl lg:text-6xl font-black text-white leading-tight mb-6">
                  Kết nối yêu thương<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">
                    Vượt thiên tai
                  </span>
                </h1>
                <p className="text-lg text-sky-100 mb-8 leading-relaxed">
                  ReliefHub giúp kết nối nhà tài trợ với người dân cần hỗ trợ, quản lý
                  nguồn lực minh bạch và điều phối cứu trợ thiên tai hiệu quả trên toàn quốc.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/register" className="btn-orange inline-flex items-center gap-2 text-base py-3 px-6">
                    Tham gia ngay <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link to="/campaigns" className="inline-flex items-center gap-2 text-white border border-white/30 hover:bg-white/10 font-semibold py-3 px-6 rounded-xl transition-all text-base">
                    Xem chiến dịch
                  </Link>
                </div>

                {/* Live alert */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="mt-8 flex items-center gap-3 bg-red-500/20 border border-red-400/30 rounded-xl px-4 py-3"
                >
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <span className="text-sm text-red-200">
                    <span className="font-bold text-red-300">Khẩn cấp:</span> Lũ lụt tại Quảng Bình — 1,200 hộ cần hỗ trợ ngay
                  </span>
                  <span className="flex-shrink-0 w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                </motion.div>
              </motion.div>

              {/* Hero visual */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative hidden lg:block"
              >
                <div className="relative bg-white/10 backdrop-blur rounded-3xl p-6 border border-white/20">
                  <div className="text-center mb-6">
                    <div className="text-6xl mb-3 animate-float">🆘</div>
                    <div className="text-white font-bold text-xl">Hệ thống đang hoạt động</div>
                    <div className="text-sky-300 text-sm">Cập nhật theo thời gian thực</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Chiến dịch', value: '12', icon: '🚀', color: 'bg-sky-500/30' },
                      { label: 'Tài trợ hôm nay', value: '45M', icon: '💰', color: 'bg-orange-500/30' },
                      { label: 'Tình nguyện viên', value: '1.2K', icon: '🙋', color: 'bg-emerald-500/30' },
                      { label: 'Khu vực', value: '63 tỉnh', icon: '🗺️', color: 'bg-purple-500/30' },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                        className={`${item.color} rounded-2xl p-4 text-center`}
                      >
                        <div className="text-2xl mb-1">{item.icon}</div>
                        <div className="text-white font-bold text-lg">{item.value}</div>
                        <div className="text-white/70 text-xs">{item.label}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,30 C360,60 720,0 1080,30 C1260,45 1380,15 1440,30 L1440,60 L0,60 Z" fill="white" />
            </svg>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="card text-center group cursor-default"
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${s.color} rounded-2xl flex items-center justify-center text-white mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                    {s.icon}
                  </div>
                  <div className="text-2xl font-black text-gray-900 mb-1">{s.value}</div>
                  <div className="text-sm text-gray-500">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Active Campaigns */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-gray-900 mb-2">Chiến dịch đang diễn ra</h2>
              <p className="text-gray-500">Hãy chung tay hỗ trợ cộng đồng vượt qua khó khăn</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {(activeCampaigns.length > 0 ? activeCampaigns : campaigns).map((c, i) => {
                const raisedM = c.raised !== undefined ? c.raised : c.raised;
                const targetM = c.target !== undefined ? c.target : c.target;
                const pct = targetM > 0 ? Math.round(raisedM / targetM * 100) : 0;
                const img = c.image || c.img;
                const tag = c.status === 'active' ? 'Đang diễn ra' : 'Cần hỗ trợ';
                const tagColor = c.status === 'active' ? 'badge-verified' : 'badge-pending';
                return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="card group cursor-pointer"
                  onClick={() => navigate(`/campaigns/${c.id}`)}
                >
                  <div className="bg-gradient-to-br from-sky-50 to-blue-100 rounded-xl h-32 flex items-center justify-center text-6xl mb-4 group-hover:scale-105 transition-transform">
                    {img}
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-900 flex-1 mr-2 leading-tight">{c.name}</h3>
                    <span className={tagColor}>{tag}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
                    <MapPin className="w-3.5 h-3.5 text-sky-500" />
                    {c.area}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Đã đạt được</span>
                      <span className="font-bold text-sky-600">{pct}%</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: 'easeOut', delay: i * 0.1 }}
                        className="h-full bg-gradient-to-r from-sky-400 to-sky-600 rounded-full"
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>{(raisedM / 1e6).toFixed(0)}M VNĐ</span>
                      <span>Mục tiêu: {(targetM / 1e6).toFixed(0)}M VNĐ</span>
                    </div>
                  </div>
                </motion.div>
              );
              })}
            </div>
            <div className="text-center mt-8">
              <Link to="/campaigns" className="btn-primary inline-flex items-center gap-2">
                Xem tất cả chiến dịch <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-gray-900 mb-2">Tình hình thiên tai hiện tại</h2>
              <p className="text-gray-500">Cập nhật từ các cán bộ địa phương — thông tin thời gian thực</p>
            </div>
            {activeDisasters.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <div className="text-5xl mb-3">🌏</div>
                <p>Hiện không có thiên tai đáng chú ý</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {activeDisasters.map((d, i) => {
                  const borderColor = d.status === 'active' ? 'border-l-red-500' : 'border-l-amber-500';
                  const badgeClass = d.status === 'active' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700';
                  const badgeLabel = d.status === 'active' ? '🔴 Khẩn cấp' : '🟡 Phục hồi';
                  const levelColor = (d.level === 'Nghiêm trọng' || d.level === 'Rất nghiêm trọng') ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600';
                  return (
                    <motion.div key={d.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                      className={`card border-l-4 ${borderColor}`}>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-gray-900">{d.area}</h3>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{d.type}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${levelColor}`}>{d.level}</span>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${badgeClass}`}>{badgeLabel}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{d.damage}</p>
                      <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                        <span>🏠 {d.households} hộ ảnh hưởng</span>
                        {d.disasterDate && <span>📅 {d.disasterDate}</span>}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* How it works */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-gray-900 mb-2">Cách thức hoạt động</h2>
              <p className="text-gray-500">Quy trình minh bạch từ đóng góp đến trao tay</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="relative"
                >
                  <div className="card text-center">
                    <div className={`w-14 h-14 ${s.color} rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg`}>
                      {s.icon}
                    </div>
                    <div className="text-4xl font-black text-gray-100 mb-2">{s.step}</div>
                    <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 z-10">
                      <ArrowRight className="w-6 h-6 text-gray-300" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-sky-600 to-blue-800 relative overflow-hidden">
          <div className="absolute inset-0 hero-pattern opacity-10" />
          <div className="relative max-w-3xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-5xl mb-4">🤝</div>
              <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">
                Cùng nhau tạo nên sự khác biệt
              </h2>
              <p className="text-sky-100 text-lg mb-8">
                Mỗi đóng góp của bạn đều có giá trị. Hãy tham gia ReliefHub ngay hôm nay.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/register" className="btn-orange inline-flex items-center gap-2 text-base py-3 px-8">
                  Đăng ký miễn phí <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/login" className="inline-flex items-center gap-2 text-white border border-white/40 hover:bg-white/10 font-semibold py-3 px-8 rounded-xl transition-all text-base">
                  Đăng nhập
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">🆘</span>
                  <span className="font-bold text-xl">ReliefHub</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Hệ thống quản lý cứu trợ thiên tai minh bạch, hiệu quả cho toàn quốc Việt Nam.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-3 text-sm">Liên kết nhanh</h4>
                <div className="space-y-2">
                  {[['/', 'Trang chủ'], ['/campaigns', 'Chiến dịch'], ['/sponsors', 'Nhà tài trợ'], ['/login', 'Đăng nhập']].map(([to, label]) => (
                    <Link key={to} to={to} className="block text-gray-400 hover:text-white text-sm transition-colors">{label}</Link>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-bold mb-3 text-sm">Liên hệ</h4>
                <div className="space-y-2 text-gray-400 text-sm">
                  <p>📧 info@reliefhub.vn</p>
                  <p>📞 1800-RELIEF</p>
                  <p>🌐 reliefhub.vn</p>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-6 text-center text-gray-500 text-sm">
              © 2026 RELIEFHUB - NHÓM 06 MÔN PHÂN TÍCH VÀ THIẾT KẾ PHẦN MỀM
            </div>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
}
