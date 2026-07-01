import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import PageTransition from '../../components/PageTransition';
import { ArrowLeft, ArrowRight, Check, User, Mail, Lock, Phone, Shield, Users } from 'lucide-react';

const ROLES = [
  { value: 'donor', label: 'Nhà tài trợ', icon: '💼', desc: 'Đóng góp tiền/hiện vật cho các chiến dịch cứu trợ', needsApproval: false },
  { value: 'citizen', label: 'Người dân', icon: '👨‍👩‍👧', desc: 'Gửi yêu cầu hỗ trợ khi gặp khó khăn thiên tai', needsApproval: false },
  { value: 'volunteer', label: 'Tình nguyện viên', icon: '🙋', desc: 'Tham gia vận chuyển và trao hàng trực tiếp', needsApproval: false },
  { value: 'local', label: 'Cán bộ địa phương', icon: '🏛️', desc: 'Cần admin phê duyệt — quản lý hộ dân & tình hình thiên tai', needsApproval: true },
  { value: 'finance', label: 'Ban Tài chính', icon: '💰', desc: 'Cần admin phê duyệt — xác minh đóng góp & sổ tài chính', needsApproval: true },
];

const ROLE_HOME = { admin: '/dashboard/admin', donor: '/dashboard/donor', finance: '/dashboard/finance', local: '/dashboard/local', citizen: '/dashboard/citizen', volunteer: '/dashboard/volunteer' };
const steps = [{ title: 'Chọn vai trò', icon: <Shield className="w-4 h-4" /> }, { title: 'Thông tin', icon: <User className="w-4 h-4" /> }, { title: 'Hoàn tất', icon: <Check className="w-4 h-4" /> }];

export default function Register() {
  const { register } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ role: '', name: '', username: '', email: '', phone: '', password: '', confirm: '', householdSize: '4' });
  const [errors, setErrors] = useState({});
  const [pendingApproval, setPendingApproval] = useState(false);

  const selectedRole = ROLES.find(r => r.value === form.role);

  const validateStep1 = () => { if (!form.role) return { role: 'Vui lòng chọn vai trò' }; return {}; };
  const validateStep2 = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Vui lòng nhập họ tên';
    if (!form.username.trim()) e.username = 'Vui lòng nhập tên đăng nhập';
    else if (form.username.length < 4) e.username = 'Tên đăng nhập tối thiểu 4 ký tự';
    if (!form.email.includes('@')) e.email = 'Email không hợp lệ';
    if (!form.phone.match(/^[0-9]{10,11}$/)) e.phone = 'Số điện thoại không hợp lệ';
    if (form.password.length < 6) e.password = 'Mật khẩu tối thiểu 6 ký tự';
    if (form.password !== form.confirm) e.confirm = 'Mật khẩu không khớp';
    if (form.role === 'citizen') { const hs = parseInt(form.householdSize); if (!hs || hs < 1 || hs > 20) e.householdSize = 'Số thành viên từ 1 đến 20'; }
    return e;
  };

  const nextStep = () => { const e = step === 0 ? validateStep1() : validateStep2(); if (Object.keys(e).length) { setErrors(e); return; } setErrors({}); if (step < 2) setStep(s => s + 1); };

  const handleSubmit = () => {
    const result = register(form);
    if (result.success) { if (result.needsApproval) setPendingApproval(true); else navigate(ROLE_HOME[result.role] || '/'); }
    else setErrors({ general: result.error });
  };

  if (pendingApproval) return (
    <PageTransition><div className="min-h-screen bg-gradient-to-br from-amber-50 to-white flex items-center justify-center p-6">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-md">
        <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: 2, duration: 0.5 }} className="text-7xl mb-6">⏳</motion.div>
        <h2 className="text-3xl font-black text-gray-900 mb-3">Đăng ký thành công!</h2>
        <p className="text-gray-500 mb-4">Tài khoản <strong>{selectedRole?.label}</strong> của bạn đang chờ Admin phê duyệt.</p>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 mb-8 text-left space-y-1">
          <p>• Vai trò <strong>Cán bộ địa phương</strong> và <strong>Ban Tài chính</strong> cần được xác thực để đảm bảo tính chính xác của hệ thống.</p>
          <p>• Sau khi admin phê duyệt, bạn có thể đăng nhập bình thường.</p>
        </div>
        <Link to="/login" className="btn-primary inline-flex items-center gap-2 text-base py-3 px-8">Về trang đăng nhập <ArrowRight className="w-5 h-5" /></Link>
      </motion.div>
    </div></PageTransition>
  );

  return (
    <PageTransition><div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-orange-50 flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"><ArrowLeft className="w-4 h-4" /> Về trang chủ</Link>
        <div className="flex items-center gap-3 mb-6"><div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-sky-700 rounded-xl flex items-center justify-center text-xl">🆘</div><div><h1 className="text-xl font-black text-gray-900">Đăng ký tài khoản</h1><p className="text-sm text-gray-500">ReliefHub — Cứu trợ Thiên tai</p></div></div>
        <div className="flex items-center mb-8">{steps.map((s, i) => (<div key={i} className="flex items-center flex-1"><div className={`flex items-center gap-2 ${i < steps.length - 1 ? 'flex-1' : ''}`}><div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step > i ? 'bg-emerald-500 text-white' : step === i ? 'bg-sky-500 text-white shadow-lg shadow-sky-200' : 'bg-gray-200 text-gray-500'}`}>{step > i ? <Check className="w-4 h-4" /> : i + 1}</div><span className={`text-xs font-medium hidden sm:block ${step === i ? 'text-sky-600' : 'text-gray-400'}`}>{s.title}</span></div>{i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${step > i ? 'bg-emerald-400' : 'bg-gray-200'}`} />}</div>))}</div>
        <div className="card">
          {errors.general && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 mb-4">⚠️ {errors.general}</div>}
          <AnimatePresence mode="wait">
            {step === 0 && (<motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Bạn là ai?</h2><p className="text-sm text-gray-500 mb-5">Chọn vai trò phù hợp</p>
              <div className="grid grid-cols-2 gap-3">{ROLES.map(r => (<button key={r.value} onClick={() => setForm({ ...form, role: r.value })} className={`p-4 rounded-2xl border-2 text-left transition-all ${form.role === r.value ? 'border-sky-500 bg-sky-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}><div className="text-3xl mb-2">{r.icon}</div><div className="font-bold text-sm text-gray-900 mb-1">{r.label}</div><div className="text-xs text-gray-500 leading-relaxed">{r.desc}</div>{r.needsApproval && <div className="mt-2 flex items-center gap-1 text-amber-600"><Shield className="w-3 h-3" /><span className="text-xs font-medium">Cần admin duyệt</span></div>}{form.role === r.value && <div className="mt-2 flex items-center gap-1 text-sky-600"><Check className="w-3.5 h-3.5" /><span className="text-xs font-medium">Đã chọn</span></div>}</button>))}</div>
              {errors.role && <p className="text-red-500 text-xs mt-2">{errors.role}</p>}
            </motion.div>)}
            {step === 1 && (<motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div><h2 className="text-lg font-bold text-gray-900 mb-1">Thông tin cá nhân</h2><p className="text-sm text-gray-500 mb-4">Điền đầy đủ thông tin để hoàn tất đăng ký</p></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><label className="label">Họ và tên *</label><div className="relative"><User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={`input-field pl-10 ${errors.name ? 'border-red-400' : ''}`} placeholder="Nguyễn Văn A" /></div>{errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}</div>
                <div><label className="label">Tên đăng nhập *</label><input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} className={`input-field ${errors.username ? 'border-red-400' : ''}`} placeholder="username" />{errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}</div>
                <div><label className="label">Số điện thoại *</label><div className="relative"><Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className={`input-field pl-10 ${errors.phone ? 'border-red-400' : ''}`} placeholder="0912345678" /></div>{errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}</div>
                <div className="col-span-2"><label className="label">Email *</label><div className="relative"><Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={`input-field pl-10 ${errors.email ? 'border-red-400' : ''}`} placeholder="email@example.com" /></div>{errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}</div>
                {form.role === 'citizen' && (<div className="col-span-2"><label className="label flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Số thành viên trong hộ *</label><input type="number" min={1} max={20} value={form.householdSize} onChange={e => setForm({ ...form, householdSize: e.target.value })} className={`input-field ${errors.householdSize ? 'border-red-400' : ''}`} placeholder="4" /><p className="text-xs text-gray-400 mt-1">Số thành viên hộ không thể thay đổi sau khi đăng ký (1–20 người)</p>{errors.householdSize && <p className="text-red-500 text-xs mt-1">{errors.householdSize}</p>}</div>)}
                <div><label className="label">Mật khẩu *</label><div className="relative"><Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className={`input-field pl-10 ${errors.password ? 'border-red-400' : ''}`} placeholder="••••••" /></div>{errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}</div>
                <div><label className="label">Xác nhận mật khẩu *</label><div className="relative"><Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="password" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} className={`input-field pl-10 ${errors.confirm ? 'border-red-400' : ''}`} placeholder="••••••" /></div>{errors.confirm && <p className="text-red-500 text-xs mt-1">{errors.confirm}</p>}</div>
              </div>
            </motion.div>)}
            {step === 2 && (<motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="text-center">
              <div className="text-6xl mb-4">✅</div><h2 className="text-xl font-bold text-gray-900 mb-2">Xác nhận thông tin</h2><p className="text-gray-500 text-sm mb-6">Kiểm tra lại trước khi hoàn tất</p>
              <div className="bg-gray-50 rounded-xl p-4 text-left space-y-2.5 text-sm">{[['Vai trò', selectedRole?.label + ' ' + selectedRole?.icon], ['Họ tên', form.name], ['Tên đăng nhập', form.username], ['Email', form.email], ['Điện thoại', form.phone], ...(form.role === 'citizen' ? [['Số thành viên hộ', form.householdSize + ' người']] : [])].map(([k, v]) => (<div key={k} className="flex justify-between"><span className="text-gray-500">{k}:</span><span className="font-medium text-gray-900">{v}</span></div>))}</div>
              {selectedRole?.needsApproval && <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 text-left">⚠️ Vai trò này cần được <strong>Admin phê duyệt</strong> trước khi có thể đăng nhập.</div>}
            </motion.div>)}
          </AnimatePresence>
          <div className="flex justify-between mt-6 pt-4 border-t border-gray-100">
            <button onClick={() => step > 0 ? setStep(s => s - 1) : navigate('/login')} className="btn-secondary flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> {step === 0 ? 'Đăng nhập' : 'Quay lại'}</button>
            {step < 2 ? <button onClick={nextStep} className="btn-primary flex items-center gap-2">Tiếp theo <ArrowRight className="w-4 h-4" /></button> : <button onClick={handleSubmit} className="btn-success flex items-center gap-2"><Check className="w-4 h-4" /> Hoàn tất đăng ký</button>}
          </div>
        </div>
        <p className="text-center text-sm text-gray-500 mt-4">Đã có tài khoản? <Link to="/login" className="text-sky-600 hover:text-sky-700 font-semibold">Đăng nhập</Link></p>
      </motion.div>
    </div></PageTransition>
  );
}
