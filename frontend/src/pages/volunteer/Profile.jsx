import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import PageTransition from '../../components/PageTransition';
import { User, MapPin, Truck, Package, Edit3, Save, X, Plus, CheckCircle2 } from 'lucide-react';

const SKILL_OPTIONS = ['Lái xe tải', 'Lái xe máy', 'Sơ cứu cơ bản', 'Y tế', 'Nấu ăn số lượng lớn', 'Vận chuyển hàng nặng', 'Bơi lội', 'Điều phối logistics', 'Ngoại ngữ', 'Kỹ năng xây dựng', 'Kỹ năng IT'];
const VEHICLE_OPTIONS = ['Xe máy', 'Ô tô 4 chỗ', 'Xe tải 1.5T', 'Xe bán tải'];
const EQUIPMENT_OPTIONS = ['Bộ dụng cụ sơ cứu', 'Áo phao cá nhân', 'Máy đo huyết áp', 'Lều bạt', 'Đèn pin công suất cao', 'Máy bơm nước nhỏ'];

export default function VolunteerProfile() {
  const { user, updateProfile, updateVolProfile, volProfiles } = useApp();
  const profile = volProfiles.find(p => p.userId === user?.id) || { skills: [], experience: '', vehicles: [], equipment: [], preferredArea: '' };

  const [editBasic, setEditBasic] = useState(false);
  const [editSkills, setEditSkills] = useState(false);
  const [basicForm, setBasicForm] = useState({ name: user?.name || '', phone: user?.phone || '', address: user?.address || '', email: user?.email || '' });
  const [skillForm, setSkillForm] = useState({ skills: [...(profile.skills || [])], experience: profile.experience || '', vehicles: [...(profile.vehicles || [])], equipment: [...(profile.equipment || [])], preferredArea: profile.preferredArea || '' });

  const toggleItem = (list, item, setter) => {
    setter(prev => ({ ...prev, [list]: prev[list].includes(item) ? prev[list].filter(x => x !== item) : [...prev[list], item] }));
  };

  const saveBasic = () => { updateProfile({ id: user.id, ...basicForm }); setEditBasic(false); };
  const saveSkills = () => { updateVolProfile(user.id, skillForm); setEditSkills(false); };

  const inp = "w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-400";
  const Chip = ({ label, active, onClick }) => (
    <button type="button" onClick={onClick} className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${active ? 'bg-rose-500 text-white border-rose-500' : 'border-gray-200 text-gray-600 hover:border-rose-300'}`}>{label}</button>
  );

  return (
    <PageTransition>
      <div className="p-6 space-y-6 max-w-3xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Thông tin cá nhân</h1>
          <p className="text-sm text-gray-500">Cập nhật hồ sơ tình nguyện viên</p>
        </div>

        {/* Basic info */}
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800 flex items-center gap-2"><User className="w-5 h-5 text-rose-500" />Thông tin cơ bản</h3>
            {!editBasic ? <button onClick={() => setEditBasic(true)} className="text-xs text-rose-500 flex items-center gap-1 px-2 py-1 hover:bg-rose-50 rounded-lg"><Edit3 className="w-3.5 h-3.5" /> Sửa</button> : (
              <div className="flex gap-2">
                <button onClick={() => setEditBasic(false)} className="text-xs text-gray-500 px-2 py-1 hover:bg-gray-100 rounded-lg flex items-center gap-1"><X className="w-3.5 h-3.5" /> Huỷ</button>
                <button onClick={saveBasic} className="text-xs text-emerald-600 px-2 py-1 hover:bg-emerald-50 rounded-lg flex items-center gap-1"><Save className="w-3.5 h-3.5" /> Lưu</button>
              </div>
            )}
          </div>
          {!editBasic ? (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><div className="text-xs text-gray-400 mb-1">Họ tên</div><div className="font-medium text-gray-800">{user?.name}</div></div>
              <div><div className="text-xs text-gray-400 mb-1">Email</div><div className="font-medium text-gray-800">{user?.email}</div></div>
              <div><div className="text-xs text-gray-400 mb-1">SĐT</div><div className="font-medium text-gray-800">{user?.phone}</div></div>
              <div><div className="text-xs text-gray-400 mb-1">Địa chỉ</div><div className="font-medium text-gray-800">{user?.address}</div></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {[['name', 'Họ tên'], ['email', 'Email'], ['phone', 'SĐT'], ['address', 'Địa chỉ']].map(([k, l]) => (
                <div key={k}><label className="text-xs font-medium text-gray-600 block mb-1">{l}</label><input className={inp} value={basicForm[k]} onChange={e => setBasicForm(p => ({ ...p, [k]: e.target.value }))} /></div>
              ))}
            </div>
          )}
        </div>

        {/* Skills & experience */}
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-rose-500" />Kỹ năng & Kinh nghiệm</h3>
            {!editSkills ? <button onClick={() => setEditSkills(true)} className="text-xs text-rose-500 flex items-center gap-1 px-2 py-1 hover:bg-rose-50 rounded-lg"><Edit3 className="w-3.5 h-3.5" /> Sửa</button> : (
              <div className="flex gap-2">
                <button onClick={() => setEditSkills(false)} className="text-xs text-gray-500 px-2 py-1 hover:bg-gray-100 rounded-lg flex items-center gap-1"><X className="w-3.5 h-3.5" /> Huỷ</button>
                <button onClick={saveSkills} className="text-xs text-emerald-600 px-2 py-1 hover:bg-emerald-50 rounded-lg flex items-center gap-1"><Save className="w-3.5 h-3.5" /> Lưu</button>
              </div>
            )}
          </div>
          {!editSkills ? (
            <div className="space-y-4">
              <div><div className="text-xs text-gray-400 mb-2">Kỹ năng</div><div className="flex flex-wrap gap-1.5">{profile.skills?.length > 0 ? profile.skills.map(s => <span key={s} className="text-xs bg-rose-50 text-rose-600 px-2.5 py-1 rounded-full border border-rose-100">{s}</span>) : <span className="text-xs text-gray-400">Chưa có</span>}</div></div>
              <div><div className="text-xs text-gray-400 mb-1">Kinh nghiệm</div><p className="text-sm text-gray-700">{profile.experience || 'Chưa có'}</p></div>
              <div><div className="text-xs text-gray-400 mb-2">Phương tiện</div><div className="flex flex-wrap gap-1.5">{profile.vehicles?.length > 0 ? profile.vehicles.map(v => <span key={v} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{v}</span>) : <span className="text-xs text-gray-400">Chưa có</span>}</div></div>
              <div><div className="text-xs text-gray-400 mb-2">Thiết bị</div><div className="flex flex-wrap gap-1.5">{profile.equipment?.length > 0 ? profile.equipment.map(e => <span key={e} className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">{e}</span>) : <span className="text-xs text-gray-400">Chưa có</span>}</div></div>
              <div><div className="text-xs text-gray-400 mb-1">Khu vực ưu tiên</div><p className="text-sm text-gray-700">{profile.preferredArea || 'Chưa có'}</p></div>
            </div>
          ) : (
            <div className="space-y-4">
              <div><label className="text-xs font-medium text-gray-600 block mb-2">Kỹ năng</label><div className="flex flex-wrap gap-1.5">{SKILL_OPTIONS.map(s => <Chip key={s} label={s} active={skillForm.skills.includes(s)} onClick={() => toggleItem('skills', s, setSkillForm)} />)}</div></div>
              <div><label className="text-xs font-medium text-gray-600 block mb-1">Kinh nghiệm</label><textarea className={inp} rows={2} value={skillForm.experience} onChange={e => setSkillForm(p => ({ ...p, experience: e.target.value }))} placeholder="Mô tả kinh nghiệm tình nguyện..." /></div>
              <div><label className="text-xs font-medium text-gray-600 block mb-2">Phương tiện</label><div className="flex flex-wrap gap-1.5">{VEHICLE_OPTIONS.map(v => <Chip key={v} label={v} active={skillForm.vehicles.includes(v)} onClick={() => toggleItem('vehicles', v, setSkillForm)} />)}</div></div>
              <div><label className="text-xs font-medium text-gray-600 block mb-2">Thiết bị</label><div className="flex flex-wrap gap-1.5">{EQUIPMENT_OPTIONS.map(e => <Chip key={e} label={e} active={skillForm.equipment.includes(e)} onClick={() => toggleItem('equipment', e, setSkillForm)} />)}</div></div>
              <div><label className="text-xs font-medium text-gray-600 block mb-1">Khu vực ưu tiên</label><input className={inp} value={skillForm.preferredArea} onChange={e => setSkillForm(p => ({ ...p, preferredArea: e.target.value }))} placeholder="VD: Quảng Bình" /></div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
