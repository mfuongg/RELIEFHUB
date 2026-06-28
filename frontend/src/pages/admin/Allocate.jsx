import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import PageTransition from '../../components/PageTransition';
import { Send, Package, ArrowRight, Info } from 'lucide-react';

export default function AdminAllocate() {
  const { campaigns, inventory, showToast } = useApp();
  const [form, setForm] = useState({ campaign: '', item: '', quantity: '', destination: '', notes: '' });
  const [allocations, setAllocations] = useState([
    { id: 1, campaign: 'Cứu trợ lũ lụt miền Trung', item: 'Gạo ST25', quantity: 500, unit: 'kg', destination: 'Quảng Bình', status: 'dispatched', date: '2024-10-06' },
    { id: 2, campaign: 'Hỗ trợ bão số 5 Đà Nẵng', item: 'Mì gói Hảo Hảo', quantity: 50, unit: 'thùng', destination: 'Đà Nẵng', status: 'delivered', date: '2024-10-09' },
  ]);

  const handleAllocate = () => {
    if (!form.campaign || !form.item || !form.quantity) return;
    setAllocations(prev => [...prev, {
      id: Date.now(),
      campaign: form.campaign,
      item: form.item,
      quantity: parseInt(form.quantity),
      destination: form.destination,
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    }]);
    setForm({ campaign: '', item: '', quantity: '', destination: '', notes: '' });
    showToast('Đã phân bổ nguồn lực!', 'success');
  };

  return (
    <PageTransition>
      <div className="page-container">
        <div className="mb-6">
          <h1 className="section-title">Phân bổ nguồn lực</h1>
          <p className="section-subtitle">Điều phối hàng hóa từ kho đến các chiến dịch</p>
          {/* Workflow chain banner */}
          <div className="mt-3 p-3 bg-sky-50 border border-sky-200 rounded-xl flex flex-wrap items-center gap-2 text-xs text-sky-800">
            <Info className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="font-semibold">Chuỗi quy trình:</span>
            <span className="px-2 py-0.5 bg-sky-100 rounded-lg font-medium">① Admin Phân bổ nguồn lực</span>
            <ArrowRight className="w-3 h-3" />
            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-lg font-medium">② TNV Vận chuyển</span>
            <ArrowRight className="w-3 h-3" />
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-lg font-medium">③ TNV Trao hàng</span>
            <ArrowRight className="w-3 h-3" />
            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-lg font-medium">④ Cán bộ xác nhận</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Send className="w-4 h-4 text-sky-500" /> Tạo lệnh phân bổ</h2>
            <div className="space-y-4">
              <div><label className="label">Chiến dịch</label>
                <select value={form.campaign} onChange={e => setForm({ ...form, campaign: e.target.value })} className="input-field">
                  <option value="">-- Chọn chiến dịch --</option>
                  {campaigns.filter(c => c.status === 'active').map(c => <option key={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div><label className="label">Mặt hàng</label>
                <select value={form.item} onChange={e => setForm({ ...form, item: e.target.value })} className="input-field">
                  <option value="">-- Chọn mặt hàng --</option>
                  {inventory.map(i => <option key={i.id}>{i.name} (Còn: {i.quantity} {i.unit})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Số lượng</label><input type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} className="input-field" /></div>
                <div><label className="label">Điểm nhận</label><input value={form.destination} onChange={e => setForm({ ...form, destination: e.target.value })} className="input-field" placeholder="Địa điểm..." /></div>
              </div>
              <div><label className="label">Ghi chú</label><textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="input-field" rows={2} /></div>
              <button onClick={handleAllocate} className="w-full btn-primary flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> Phân bổ ngay
              </button>
            </div>
          </div>

          <div className="card">
            <h2 className="font-bold text-gray-900 mb-4">Lịch sử phân bổ</h2>
            <div className="space-y-3">
              {allocations.map((a, i) => (
                <motion.div key={a.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-sm text-gray-900">{a.item} — {a.quantity} {a.unit || ''}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{a.campaign}</div>
                      <div className="text-xs text-gray-400">{a.date} → {a.destination}</div>
                    </div>
                    <span className={a.status === 'delivered' ? 'badge-verified' : a.status === 'dispatched' ? 'badge-info' : 'badge-pending'}>
                      {a.status === 'delivered' ? '✓ Đã giao' : a.status === 'dispatched' ? '🚚 Đang vận chuyển' : '⏳ Chờ xuất kho'}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
