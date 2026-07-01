import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import PageTransition from '../../components/PageTransition';
import { Eye, EyeOff, User, Lock, ArrowLeft, HelpCircle, X, CheckCircle } from 'lucide-react';

const ROLE_ROUTES = { admin: '/dashboard/admin', donor: '/dashboard/donor', finance: '/dashboard/finance', local: '/dashboard/local', citizen: '/dashboard/citizen', volunteer: '/dashboard/volunteer' };

export default function Login() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1=enter username, 2=enter new pw
  const [forgotUser, setForgotUser] = useState('');
  const [forgotNewPw, setForgotNewPw] = useState('');
  const [forgotConfirm, setForgotConfirm] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotDone, setForgotDone] = useState(false);
  const { accounts, updateProfile } = useApp();

  const handleForgotSubmit = () => {
    if (forgotStep === 1) {
      const found = accounts?.find(a => a.username === forgotUser.trim());
      if (!found) { setForgotError('Không tìm thấy tài khoản với tên đăng nhập này'); return; }
      setForgotError('');
      setForgotStep(2);
    } else {
      if (forgotNewPw.length < 6) { setForgotError('Mật khẩu mới tối thiểu 6 ký tự'); return; }
      if (forgotNewPw !== forgotConfirm) { setForgotError('Mật khẩu xác nhận không khớp'); return; }
      const found = accounts?.find(a => a.username === forgotUser.trim());
      if (found) { updateProfile({ ...found, password: forgotNewPw }); }
      setForgotDone(true);
      setForgotError('');
    }
  };

  const resetForgot = () => { setShowForgot(false); setForgotStep(1); setForgotUser(''); setForgotNewPw(''); setForgotConfirm(''); setForgotError(''); setForgotDone(false); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const result = login(form.username, form.password);
    setLoading(false);
    if (result.success) navigate(ROLE_ROUTES[result.role] || '/');
    else setError(result.error);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex">
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-sky-700 via-sky-800 to-blue-900 relative overflow-hidden flex-col justify-between p-12">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          <div className="relative">
            <Link to="/" className="flex items-center gap-3 text-white mb-12">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl">🆘</div>
              <span className="font-bold text-2xl">ReliefHub</span>
            </Link>
            <h2 className="text-4xl font-black text-white mb-4 leading-tight">Chào mừng trở lại!<br /><span className="text-sky-300">Quản lý cứu trợ</span><br /><span className="text-orange-400">thông minh hơn</span></h2>
            <p className="text-sky-200 text-lg">Đăng nhập để truy cập hệ thống quản lý cứu trợ thiên tai toàn diện.</p>
          </div>
          <div className="relative bg-white/10 rounded-2xl p-5 text-white">
            <p className="text-sky-200 text-sm mb-2 font-medium">ℹ️ Thông tin hệ thống</p>
            <p className="text-sm text-sky-100">Tài khoản mặc định: <code className="bg-white/20 px-1.5 py-0.5 rounded text-xs">admin / admin123</code></p>
            <p className="text-xs text-sky-300 mt-2">Các tài khoản khác cần tự đăng ký. Vai trò Cán bộ địa phương & Ban Tài chính cần Admin phê duyệt.</p>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"><ArrowLeft className="w-4 h-4" /> Về trang chủ</Link>
            <div className="mb-8">
              <div className="text-3xl mb-3">👋</div>
              <h1 className="text-2xl font-black text-gray-900 mb-1">Đăng nhập</h1>
              <p className="text-gray-500 text-sm">Nhập thông tin tài khoản của bạn</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-center gap-2"><span>⚠️</span> {error}</motion.div>}
              <div><label className="label">Tên đăng nhập</label>
                <div className="relative"><User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} className="input-field pl-10" placeholder="Nhập tên đăng nhập..." required />
                </div>
              </div>
              <div><label className="label">Mật khẩu</label>
                <div className="relative"><Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="input-field pl-10 pr-11" placeholder="Nhập mật khẩu..." required />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                </div>
              </div>
              <div className="flex justify-end">
                <button type="button" onClick={() => setShowForgot(true)}
                  className="text-sm text-sky-600 hover:text-sky-800 flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5" /> Quên mật khẩu?
                </button>
              </div>
              <button type="submit" disabled={loading} className="w-full btn-primary py-3 flex items-center justify-center gap-2">{loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Đang đăng nhập...</> : 'Đăng nhập'}</button>
            </form>
            <p className="text-center text-sm text-gray-500 mt-6">Chưa có tài khoản? <Link to="/register" className="text-sky-600 hover:text-sky-700 font-semibold">Đăng ký ngay</Link></p>

            {/* Forgot Password Modal */}
            <AnimatePresence>
              {showForgot && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-bold text-gray-900">🔑 Khôi phục mật khẩu</h2>
                      <button onClick={resetForgot} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
                    </div>
                    {forgotDone ? (
                      <div className="text-center py-4">
                        <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                        <p className="font-bold text-gray-900 mb-1">Đặt lại thành công!</p>
                        <p className="text-sm text-gray-500 mb-4">Bạn có thể đăng nhập bằng mật khẩu mới.</p>
                        <button onClick={resetForgot} className="btn-primary w-full">Đóng</button>
                      </div>
                    ) : (
                      <>
                        {forgotStep === 1 ? (
                          <div>
                            <p className="text-sm text-gray-500 mb-4">Nhập tên đăng nhập của bạn để xác minh tài khoản.</p>
                            <label className="label">Tên đăng nhập</label>
                            <div className="relative mb-3">
                              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input value={forgotUser} onChange={e => setForgotUser(e.target.value)}
                                className="input-field pl-10" placeholder="Nhập tên đăng nhập..." />
                            </div>
                          </div>
                        ) : (
                          <div>
                            <p className="text-sm text-gray-500 mb-4">Tài khoản <strong>{forgotUser}</strong> đã được xác minh. Nhập mật khẩu mới.</p>
                            <div className="space-y-3">
                              <div>
                                <label className="label">Mật khẩu mới</label>
                                <input type="password" value={forgotNewPw} onChange={e => setForgotNewPw(e.target.value)}
                                  className="input-field" placeholder="Tối thiểu 6 ký tự" />
                              </div>
                              <div>
                                <label className="label">Xác nhận mật khẩu</label>
                                <input type="password" value={forgotConfirm} onChange={e => setForgotConfirm(e.target.value)}
                                  className="input-field" placeholder="Nhập lại mật khẩu mới" />
                              </div>
                            </div>
                          </div>
                        )}
                        {forgotError && <p className="text-red-500 text-sm mt-2">⚠️ {forgotError}</p>}
                        <div className="flex gap-3 mt-5">
                          {forgotStep === 2 && <button onClick={() => { setForgotStep(1); setForgotError(''); }} className="btn-secondary flex-1">Quay lại</button>}
                          <button onClick={handleForgotSubmit} className="btn-primary flex-1">
                            {forgotStep === 1 ? 'Xác minh' : 'Đặt lại mật khẩu'}
                          </button>
                        </div>
                      </>
                    )}
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
