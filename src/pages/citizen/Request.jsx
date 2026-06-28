import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import PageTransition from '../../components/PageTransition';
import { Send, Home, Info } from 'lucide-react';

const ITEMS_LIST = ['Gạo', 'Mì gói', 'Nước uống', 'Áo phao', 'Thuốc men', 'Chăn màn', 'Quần áo', 'Nến', 'Pin'];

export default function CitizenRequest() {
  const { addNeed, user, disasters } = useApp();
  const [form, setForm] = useState({
    citizen: user?.name || '',
    area: '',
    items: '',
    quantity: '',
    urgency: 'medium',
    households: 1,
    notes: ''
  });
  const [sent, setSent] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const toggleItem = (item) => {
    setSelectedItems(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const itemsStr = selectedItems.length > 0
      ? selectedItems.join(', ') + (form.items ? ', ' + form.items : '')
      : form.items;
    addNeed({ ...form, citizen: user?.name, items: itemsStr });
    setSent(true);
  };

  if (sent) return (
    <PageTransition>
      <div className="page-container">
        <div className="max-w-md mx-auto text-center py-16">
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: 2, duration: 0.5 }} className="text-6xl mb-4">📬</motion.div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Yêu cầu đã gửi!</h2>
          <p className="text-gray-500 mb-6">Cán bộ địa phương sẽ xác minh và phản hồi sớm nhất có thể.</p>
          <button onClick={() => { setSent(false); setSelectedItems([]); }} className="btn-primary">Gửi yêu cầu khác</button>
        </div>
      </div>
    </PageTransition>
  );

  return (
    <PageTransition>
      <div className="page-container">
        <div className="mb-6">
          <h1 className="section-title">Gửi yêu cầu hỗ trợ</h1>
          <p className="section-subtitle">Phiếu hỗ trợ dành cho cá nhân / hộ gia đình</p>
        </div>

        {/* Thông báo phiếu chỉ dành cho hộ gia đình */}
        <div className="max-w-2xl mb-4">
          <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>Phiếu hỗ trợ này <strong>chỉ dành cho cá nhân / hộ gia đình</strong>. Mỗi hộ gia đình chỉ được gửi một yêu cầu cho mỗi đợt thiên tai.</p>
          </div>
        </div>

        <div className="max-w-2xl">
          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Họ tên – read-only, lấy từ tài khoản đăng nhập */}
                <div>
                  <label className="label">
                    Họ tên
                    <span className="ml-1.5 text-xs text-gray-400 font-normal">(không thể thay đổi)</span>
                  </label>
                  <input
                    value={user?.name || form.citizen}
                    readOnly
                    className="input-field bg-gray-50 cursor-not-allowed text-gray-500 select-none"
                    title="Họ tên được lấy từ tài khoản đăng nhập và không thể thay đổi"
                  />
                </div>
                <div>
                  <label className="label">Khu vực</label>
                  <select
                    value={form.area}
                    onChange={e => setForm({ ...form, area: e.target.value })}
                    className="input-field"
                    required
                  >
                    <option value="">-- Chọn khu vực --</option>
                    {disasters.map(d => <option key={d.id} value={d.area}>{d.area}</option>)}
                    <option value="Khác">Khác</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label">Hàng hóa cần hỗ trợ (chọn nhanh)</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {ITEMS_LIST.map(item => (
                    <button key={item} type="button" onClick={() => toggleItem(item)}
                      className={`px-3 py-1.5 rounded-xl text-sm border-2 transition-all ${selectedItems.includes(item) ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                      {item}
                    </button>
                  ))}
                </div>
                <input
                  value={form.items}
                  onChange={e => setForm({ ...form, items: e.target.value })}
                  className="input-field"
                  placeholder="Hoặc nhập thêm mặt hàng khác..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* ĐÃ ĐỔI TÊN: "số lượng hộ gia đình" → "số lượng thành viên trong hộ gia đình" */}
                <div>
                  <label className="label flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5 text-purple-500" />
                    Số lượng thành viên trong hộ gia đình
                  </label>
                  <input
                    type="number"
                    value={form.households}
                    onChange={e => setForm({ ...form, households: e.target.value })}
                    className="input-field"
                    min={1}
                  />
                </div>
                <div>
                  <label className="label">Mức độ khẩn cấp</label>
                  <select
                    value={form.urgency}
                    onChange={e => setForm({ ...form, urgency: e.target.value })}
                    className="input-field"
                  >
                    <option value="low">🟢 Thấp</option>
                    <option value="medium">🟡 Trung bình</option>
                    <option value="high">🟠 Cao</option>
                    <option value="critical">🔴 Khẩn cấp</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label">Ghi chú thêm</label>
                <textarea
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                  className="input-field"
                  rows={3}
                  placeholder="Thông tin bổ sung về hoàn cảnh, địa chỉ cụ thể..."
                />
              </div>

              <button type="submit" className="w-full btn-primary flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> Gửi yêu cầu hỗ trợ
              </button>
            </form>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
