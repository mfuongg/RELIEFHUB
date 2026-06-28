import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import PageTransition from '../../components/PageTransition';
import { User, Lock, Eye, EyeOff, Camera, Upload, CheckCircle, X, MapPin, Phone, Mail } from 'lucide-react';

export default function DonorProfile() {
  const { user, updateProfile, showToast } = useApp();
  const [activeTab, setActiveTab] = useState('info');
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    avatarUrl: user?.avatarUrl || '',
  });
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || '');
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false });
  const [pwError, setPwError] = useState('');
  const [infoError, setInfoError] = useState('');
  const [saved, setSaved] = useState(false);
  const fileRef = useRef();

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { showToast('Vui lòng chọn file ảnh', 'error'); return; }
    const reader = new FileReader();
    reader.onload = ev => {
      setAvatarPreview(ev.target.result);
      setForm(f => ({ ...f, avatarUrl: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveInfo = () => {
    if (!form.name.trim()) { setInfoError('Tên không được để trống'); return; }
    if (!form.email.includes('@')) { setInfoError('Email không hợp lệ'); return; }
    updateProfile({ ...user, ...form });
    setSaved(true);
    setInfoError('');
    setTimeout(() => setSaved(false), 2500);
  };

  const handleChangePassword = () => {
    if (!pwForm.current) { setPwError('Nhập mật khẩu hiện tại'); return; }
    if (pwForm.current !== user?.password) { setPwError('Mật khẩu hiện tại không đúng'); return; }
    if (pwForm.next.length < 6) { setPwError('Mật khẩu mới tối thiểu 6 ký tự'); return; }
    if (pwForm.next !== pwForm.confirm) { setPwError('Xác nhận mật khẩu không khớp'); return; }
    updateProfile({ ...user, password: pwForm.next });
    setPwForm({ current: '', next: '', confirm: '' });
    setPwError('');
    showToast('Đổi mật khẩu thành công!', 'success');
  };

  const ROLE_LABEL = { admin: 'Quản trị viên', donor: 'Nhà tài trợ', finance: 'Kế toán', local: 'Cán bộ địa phương', citizen: 'Người dân', volunteer: 'Tình nguyện viên' };

  return (
    <PageTransition>
      <div className="page-container max-w-2xl">
        <div className="mb-6">
          <h1 className="section-title">Thông tin cá nhân</h1>
          <p className="section-subtitle">Cập nhật hồ sơ và bảo mật tài khoản</p>
        </div>

        {/* Avatar card */}
        <div className="card mb-5 flex items-center gap-4">
          <div className="relative">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="w-20 h-20 rounded-2xl object-cover border-2 border-sky-300 shadow" />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-4xl shadow">
                {user?.avatar || '👤'}
              </div>
            )}
            <button onClick={() => fileRef.current?.click()}
              className="absolute -bottom-1.5 -right-1.5 w-8 h-8 bg-sky-500 text-white rounded-lg flex items-center justify-center shadow hover:bg-sky-600 transition-all">
              <Camera className="w-4 h-4" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>
          <div>
            <div className="font-bold text-gray-900 text-lg">{user?.name}</div>
            <div className="text-sm text-gray-500">{ROLE_LABEL[user?.role] || user?.role}</div>
            <div className="text-xs text-gray-400 mt-0.5">@{user?.username}</div>
            <button onClick={() => fileRef.current?.click()}
              className="mt-1.5 text-xs text-sky-600 hover:text-sky-800 flex items-center gap-1">
              <Upload className="w-3 h-3" /> Đổi ảnh đại diện
            </button>
          </div>
          {avatarPreview && avatarPreview !== user?.avatarUrl && (
            <button onClick={() => { setAvatarPreview(user?.avatarUrl || ''); setForm(f => ({ ...f, avatarUrl: user?.avatarUrl || '' })); }}
              className="ml-auto p-2 hover:bg-gray-100 rounded-lg text-gray-400">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5 bg-gray-100 p-1 rounded-xl w-fit">
          {[['info', '👤 Thông tin cơ bản'], ['password', '🔒 Đổi mật khẩu']].map(([key, label]) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === key ? 'bg-white shadow text-sky-600' : 'text-gray-500 hover:text-gray-700'}`}>
              {label}
            </button>
          ))}
        </div>

        {/* INFO TAB */}
        {activeTab === 'info' && (
          <div className="card">
            {infoError && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">⚠️ {infoError}</div>}
            {saved && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Thông tin đã được cập nhật thành công!
              </motion.div>
            )}
            <div className="space-y-4">
              <div>
                <label className="label flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Họ và tên *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="input-field" placeholder="Nguyễn Văn A" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email *</label>
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    className="input-field" placeholder="email@example.com" />
                </div>
                <div>
                  <label className="label flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Số điện thoại</label>
                  <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="input-field" placeholder="0901234567" />
                </div>
              </div>
              <div>
                <label className="label flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Địa chỉ</label>
                <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
                  className="input-field" placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố" />
              </div>
              {user?.role === 'citizen' && user?.householdSize && (
                <div className="p-3 bg-gray-50 rounded-xl text-sm text-gray-600">
                  👨‍👩‍👧 Số nhân khẩu hộ gia đình: <span className="font-bold text-gray-900">{user.householdSize} người</span>
                  <span className="text-gray-400 ml-2">(Không thể thay đổi)</span>
                </div>
              )}
            </div>
            <button onClick={handleSaveInfo}
              className="w-full mt-5 btn-primary flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4" /> Lưu thay đổi
            </button>
          </div>
        )}

        {/* PASSWORD TAB */}
        {activeTab === 'password' && (
          <div className="card">
            {pwError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">⚠️ {pwError}</div>
            )}
            <div className="space-y-4">
              {[['current', 'Mật khẩu hiện tại'], ['next', 'Mật khẩu mới (tối thiểu 6 ký tự)'], ['confirm', 'Xác nhận mật khẩu mới']].map(([key, label]) => (
                <div key={key}>
                  <label className="label flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> {label}</label>
                  <div className="relative">
                    <input type={showPw[key] ? 'text' : 'password'}
                      value={pwForm[key]} onChange={e => setPwForm({ ...pwForm, [key]: e.target.value })}
                      className="input-field pr-11" placeholder="••••••••" />
                    <button type="button" onClick={() => setShowPw(prev => ({ ...prev, [key]: !prev[key] }))}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPw[key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={handleChangePassword} className="w-full mt-5 btn-primary flex items-center justify-center gap-2">
              <Lock className="w-4 h-4" /> Đổi mật khẩu
            </button>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
