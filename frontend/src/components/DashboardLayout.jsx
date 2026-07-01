import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard, Users, Package, Flag, PieChart, BookOpen, Heart, History,
  MessageSquare, CheckSquare, FileText, MapPin, ClipboardList, Send, ReceiptText,
  Truck, Navigation, Bell, LogOut, Menu, X, Home, Shield, DollarSign, User,
  Handshake, Search, UserPlus, FileBarChart, ClipboardCheck, Award,
  TrendingDown, Wallet, Store, Building2
} from 'lucide-react';

const SIDEBAR_CONFIG = {
  admin: {
    label: 'Quản trị viên', color: 'from-slate-800 to-slate-900', icon: <Shield className="w-5 h-5" />,
    links: [
      { to: '/dashboard/admin', icon: <LayoutDashboard className="w-4 h-4" />, label: 'Tổng quan', end: true },
      { to: '/dashboard/admin/accounts', icon: <Users className="w-4 h-4" />, label: 'Quản lý tài khoản' },
      { to: '/dashboard/admin/inventory', icon: <Package className="w-4 h-4" />, label: 'Kho hàng' },
      { to: '/dashboard/admin/campaigns', icon: <Flag className="w-4 h-4" />, label: 'Chiến dịch' },
      { to: '/dashboard/admin/missions', icon: <ClipboardCheck className="w-4 h-4" />, label: 'Nhiệm vụ TNV' },
      { to: '/dashboard/admin/donations', icon: <Wallet className="w-4 h-4" />, label: 'Quản lý đóng góp' },
      { to: '/dashboard/admin/allocate', icon: <Send className="w-4 h-4" />, label: 'Phân bổ nguồn lực' },
      { to: '/dashboard/admin/verify', icon: <CheckSquare className="w-4 h-4" />, label: 'Override xác minh' },
      { to: '/dashboard/admin/reports', icon: <PieChart className="w-4 h-4" />, label: 'Báo cáo thống kê' },
      { to: '/dashboard/admin/complaints', icon: <MessageSquare className="w-4 h-4" />, label: 'Khiếu nại / Phản ảnh' },
      { to: '/dashboard/admin/profile', icon: <User className="w-4 h-4" />, label: 'Thông tin cá nhân' },
    ],
  },
  donor: {
    label: 'Nhà tài trợ', color: 'from-orange-500 to-orange-700', icon: <Heart className="w-5 h-5" />,
    links: [
      { to: '/dashboard/donor', icon: <LayoutDashboard className="w-4 h-4" />, label: 'Tổng quan', end: true },
      { to: '/dashboard/donor/campaigns', icon: <Flag className="w-4 h-4" />, label: 'Chiến dịch đang mở' },
      { to: '/dashboard/donor/contribute', icon: <Heart className="w-4 h-4" />, label: 'Đóng góp ngay' },
      { to: '/dashboard/donor/guide', icon: <BookOpen className="w-4 h-4" />, label: 'Hướng dẫn đóng góp' },
      { to: '/dashboard/donor/history', icon: <History className="w-4 h-4" />, label: 'Lịch sử đóng góp' },
      { to: '/dashboard/donor/receipts', icon: <ReceiptText className="w-4 h-4" />, label: 'Biên nhận' },
      { to: '/dashboard/donor/tracking', icon: <TrendingDown className="w-4 h-4" />, label: 'Theo dõi sử dụng' },
      { to: '/dashboard/donor/complaint', icon: <MessageSquare className="w-4 h-4" />, label: 'Phản ánh / Khiếu nại' },
      { to: '/dashboard/donor/profile', icon: <User className="w-4 h-4" />, label: 'Thông tin cá nhân' },
    ],
  },
  finance: {
    label: 'Ban Tài chính', color: 'from-emerald-600 to-emerald-800', icon: <DollarSign className="w-5 h-5" />,
    links: [
      { to: '/dashboard/finance', icon: <LayoutDashboard className="w-4 h-4" />, label: 'Tổng quan', end: true },
      { to: '/dashboard/finance/verify', icon: <CheckSquare className="w-4 h-4" />, label: 'Xác minh đóng góp' },
      { to: '/dashboard/finance/ledger', icon: <BookOpen className="w-4 h-4" />, label: 'Sổ tài chính' },
      { to: '/dashboard/finance/profile', icon: <User className="w-4 h-4" />, label: 'Thông tin cá nhân' },
    ],
  },
  local: {
    label: 'Cán bộ địa phương', color: 'from-blue-600 to-blue-800', icon: <MapPin className="w-5 h-5" />,
    links: [
      { to: '/dashboard/local', icon: <LayoutDashboard className="w-4 h-4" />, label: 'Tổng quan', end: true },
      { to: '/dashboard/local/disasters', icon: <Flag className="w-4 h-4" />, label: 'Cập nhật thiên tai' },
      { to: '/dashboard/local/needs', icon: <ClipboardList className="w-4 h-4" />, label: 'Xác minh nhu cầu' },
      { to: '/dashboard/local/delivery', icon: <Handshake className="w-4 h-4" />, label: 'Quản lý trao hàng' },
      { to: '/dashboard/local/citizen-status', icon: <Search className="w-4 h-4" />, label: 'Tra cứu hỗ trợ' },
      { to: '/dashboard/local/profile', icon: <User className="w-4 h-4" />, label: 'Thông tin cá nhân' },
    ],
  },
  citizen: {
    label: 'Người dân', color: 'from-purple-600 to-purple-800', icon: <Users className="w-5 h-5" />,
    links: [
      { to: '/dashboard/citizen', icon: <LayoutDashboard className="w-4 h-4" />, label: 'Tổng quan', end: true },
      { to: '/dashboard/citizen/request', icon: <ClipboardList className="w-4 h-4" />, label: 'Gửi yêu cầu hỗ trợ' },
      { to: '/dashboard/citizen/receipt', icon: <ReceiptText className="w-4 h-4" />, label: 'Trạng thái đơn hỗ trợ' },
      { to: '/dashboard/citizen/profile', icon: <User className="w-4 h-4" />, label: 'Thông tin cá nhân' },
    ],
  },
  volunteer: {
    label: 'Tình nguyện viên', color: 'from-rose-500 to-rose-700', icon: <Navigation className="w-5 h-5" />,
    links: [
      { to: '/dashboard/volunteer', icon: <LayoutDashboard className="w-4 h-4" />, label: 'Tổng quan', end: true },
      { to: '/dashboard/volunteer/groups', icon: <UserPlus className="w-4 h-4" />, label: 'Nhóm tình nguyện' },
      { to: '/dashboard/volunteer/transport', icon: <Truck className="w-4 h-4" />, label: 'Vận chuyển' },
      { to: '/dashboard/volunteer/delivery', icon: <Navigation className="w-4 h-4" />, label: 'Trao hàng' },
      // Đã xóa: Báo cáo hoạt động (theo yêu cầu)
      { to: '/dashboard/volunteer/profile', icon: <User className="w-4 h-4" />, label: 'Thông tin cá nhân' },
    ],
  },
};

export default function DashboardLayout({ role }) {
  const { user, logout, notifications } = useApp();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const config = SIDEBAR_CONFIG[role];
  const unreadCount = notifications.filter(n => !n.read).length;
  const handleLogout = () => { logout(); navigate('/'); };

  const SidebarContent = () => (
    <div className={`h-full flex flex-col bg-gradient-to-b ${config.color} text-white`}>
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl shadow">🆘</div>
          {sidebarOpen && <div><div className="font-bold text-lg leading-tight">ReliefHub</div><div className="text-xs text-white/60">Cứu trợ thiên tai</div></div>}
        </div>
      </div>
      {sidebarOpen && (
        <div className="px-4 py-3">
          <div className="bg-white/10 rounded-xl p-3 flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center text-base">{user?.avatar}</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">{user?.name}</div>
              <div className="text-xs text-white/60 truncate">{config.label}</div>
            </div>
          </div>
        </div>
      )}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {config.links.map((link) => (
          <NavLink key={link.to} to={link.to} end={link.end} onClick={() => setMobileSidebar(false)}
            className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${isActive ? 'bg-white/25 text-white shadow-sm' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>
            <span className="flex-shrink-0">{link.icon}</span>
            {sidebarOpen && <span className="truncate">{link.label}</span>}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-white/10 space-y-1">
        <NavLink to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-all text-sm">
          <Home className="w-4 h-4 flex-shrink-0" />{sidebarOpen && <span>Trang chủ</span>}
        </NavLink>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/70 hover:bg-red-500/30 hover:text-white transition-all text-sm">
          <LogOut className="w-4 h-4 flex-shrink-0" />{sidebarOpen && <span>Đăng xuất</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <motion.aside animate={{ width: sidebarOpen ? 240 : 72 }} transition={{ duration: 0.25, ease: 'easeInOut' }} className="hidden lg:flex flex-col flex-shrink-0 overflow-hidden z-20">
        <SidebarContent />
      </motion.aside>
      <AnimatePresence>
        {mobileSidebar && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setMobileSidebar(false)} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: 'spring', stiffness: 400, damping: 40 }} className="fixed left-0 top-0 bottom-0 w-64 z-40 lg:hidden">
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileSidebar(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"><Menu className="w-5 h-5 text-gray-600" /></button>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100 transition-colors"><Menu className="w-5 h-5 text-gray-600" /></button>
            <div>
              <h1 className="text-base font-semibold text-gray-800">{config.label}</h1>
              <p className="text-xs text-gray-400 hidden sm:block">ReliefHub - Quản lý Cứu trợ Thiên tai</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button onClick={() => setShowNotif(!showNotif)} className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                {unreadCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">{unreadCount}</span>}
              </button>
              <AnimatePresence>
                {showNotif && (
                  <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }} className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                    <div className="p-3 border-b border-gray-50 flex items-center justify-between"><span className="font-semibold text-sm text-gray-800">Thông báo</span><button onClick={() => setShowNotif(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4 text-gray-400" /></button></div>
                    <div className="max-h-56 overflow-y-auto">
                      {notifications.map(n => (
                        <div key={n.id} className={`p-3 border-b border-gray-50 flex items-start gap-2 ${!n.read ? 'bg-sky-50' : ''}`}>
                          <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.read ? 'bg-gray-300' : 'bg-sky-500'}`} />
                          <span className="text-xs text-gray-700">{n.msg}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="flex items-center gap-2 pl-2 border-l border-gray-100">
              <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-sky-600 rounded-full flex items-center justify-center text-sm shadow">{user?.avatar}</div>
              <div className="hidden sm:block"><div className="text-sm font-semibold text-gray-800">{user?.name}</div><div className="text-xs text-gray-400">@{user?.username}</div></div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto"><AnimatePresence mode="wait"><Outlet /></AnimatePresence></main>
      </div>
    </div>
  );
}
