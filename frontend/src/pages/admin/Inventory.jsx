import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import PageTransition from '../../components/PageTransition';
import { Package, AlertTriangle, Plus, Search, X, RefreshCw } from 'lucide-react';

const CATEGORIES = ['Thực phẩm', 'Nước uống', 'Dụng cụ cứu nạn', 'Y tế', 'Vật dụng thiết yếu'];
const WAREHOUSES = ['Kho Hà Nội', 'Kho Đà Nẵng', 'Kho TP.HCM'];

export default function AdminInventory() {
  const { inventory, addInventoryItem, restockInventoryItem, showToast } = useApp();
  const [search, setSearch] = useState('');
  // mode: null | 'new' | 'restock'
  const [mode, setMode] = useState(null);
  const [restockId, setRestockId] = useState('');
  const [restockQty, setRestockQty] = useState('');
  const [restockError, setRestockError] = useState('');
  const [newForm, setNewForm] = useState({
    name: '', category: 'Thực phẩm', unit: 'kg', quantity: '', minQuantity: '', warehouse: 'Kho Hà Nội',
  });
  const [newError, setNewError] = useState('');

  const filtered = inventory.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.category.toLowerCase().includes(search.toLowerCase())
  );
  const alerts = inventory.filter(i => i.quantity < i.minQuantity);

  const handleAddNew = () => {
    if (!newForm.name.trim()) { setNewError('Vui lòng nhập tên mặt hàng'); return; }
    if (!newForm.quantity || parseInt(newForm.quantity) < 0) { setNewError('Số lượng không hợp lệ'); return; }
    if (!newForm.minQuantity || parseInt(newForm.minQuantity) < 0) { setNewError('Mức tối thiểu không hợp lệ'); return; }
    const duplicate = inventory.find(i => i.name.toLowerCase() === newForm.name.toLowerCase() && i.warehouse === newForm.warehouse);
    if (duplicate) { setNewError(`"${newForm.name}" đã tồn tại trong ${newForm.warehouse}. Hãy chọn "Bổ sung hàng cũ" để cập nhật số lượng.`); return; }
    addInventoryItem({
      name: newForm.name.trim(),
      category: newForm.category,
      unit: newForm.unit,
      quantity: parseInt(newForm.quantity),
      minQuantity: parseInt(newForm.minQuantity),
      warehouse: newForm.warehouse,
    });
    setMode(null);
    setNewForm({ name: '', category: 'Thực phẩm', unit: 'kg', quantity: '', minQuantity: '', warehouse: 'Kho Hà Nội' });
    setNewError('');
  };

  const handleRestock = () => {
    if (!restockId) { setRestockError('Vui lòng chọn mặt hàng'); return; }
    if (!restockQty || parseInt(restockQty) <= 0) { setRestockError('Số lượng nhập phải lớn hơn 0'); return; }
    restockInventoryItem(parseInt(restockId), restockQty);
    setMode(null);
    setRestockId('');
    setRestockQty('');
    setRestockError('');
  };

  const selectedItem = inventory.find(i => i.id === parseInt(restockId));

  return (
    <PageTransition>
      <div className="page-container">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="section-title">Quản lý kho hàng</h1>
            <p className="section-subtitle">{inventory.length} mặt hàng trong hệ thống</p>
          </div>
          {/* Two action buttons */}
          <div className="flex gap-2">
            <button onClick={() => { setMode('restock'); setNewError(''); setRestockError(''); }}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-all text-sm">
              <RefreshCw className="w-4 h-4" /> Bổ sung hàng cũ
            </button>
            <button onClick={() => { setMode('new'); setNewError(''); setRestockError(''); }}
              className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" /> Tạo mặt hàng mới
            </button>
          </div>
        </div>

        {/* Low-stock alerts */}
        {alerts.length > 0 && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-red-700 text-sm">Cảnh báo tồn kho thấp</div>
              <div className="text-red-600 text-xs mt-1">{alerts.map(a => a.name).join(', ')} — dưới mức tối thiểu!</div>
            </div>
          </motion.div>
        )}

        {/* ── MODAL: Create new item ── */}
        <AnimatePresence>
          {mode === 'new' && (
            <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">🆕 Tạo mặt hàng mới</h2>
                  <button onClick={() => { setMode(null); setNewError(''); }} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl mb-4 text-sm text-blue-700">
                  💡 Dùng khi muốn <strong>thêm một mặt hàng hoàn toàn mới</strong> chưa có trong hệ thống. Nếu mặt hàng đã tồn tại và cần bổ sung số lượng, hãy dùng <strong>"Bổ sung hàng cũ"</strong>.
                </div>
                {newError && <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">⚠️ {newError}</div>}
                <div className="space-y-3">
                  <div>
                    <label className="label">Tên mặt hàng *</label>
                    <input value={newForm.name} onChange={e => setNewForm({ ...newForm, name: e.target.value })}
                      className="input-field" placeholder="VD: Bánh mì, Áo phao..." />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label">Danh mục</label>
                      <select value={newForm.category} onChange={e => setNewForm({ ...newForm, category: e.target.value })} className="input-field">
                        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label">Đơn vị</label>
                      <input value={newForm.unit} onChange={e => setNewForm({ ...newForm, unit: e.target.value })}
                        className="input-field" placeholder="kg, cái, thùng..." />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label">Số lượng ban đầu</label>
                      <input type="number" min={0} value={newForm.quantity}
                        onChange={e => setNewForm({ ...newForm, quantity: e.target.value })} className="input-field" placeholder="0" />
                    </div>
                    <div>
                      <label className="label">Mức tối thiểu</label>
                      <input type="number" min={0} value={newForm.minQuantity}
                        onChange={e => setNewForm({ ...newForm, minQuantity: e.target.value })} className="input-field" placeholder="0" />
                    </div>
                  </div>
                  <div>
                    <label className="label">Kho lưu trữ</label>
                    <select value={newForm.warehouse} onChange={e => setNewForm({ ...newForm, warehouse: e.target.value })} className="input-field">
                      {WAREHOUSES.map(w => <option key={w}>{w}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 mt-5">
                  <button onClick={() => { setMode(null); setNewError(''); }} className="btn-secondary flex-1">Hủy</button>
                  <button onClick={handleAddNew} className="btn-primary flex-1">Thêm mặt hàng</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ── MODAL: Restock existing item ── */}
        <AnimatePresence>
          {mode === 'restock' && (
            <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">♻️ Bổ sung hàng vào kho</h2>
                  <button onClick={() => { setMode(null); setRestockError(''); }} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
                </div>
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl mb-4 text-sm text-emerald-700">
                  💡 Dùng khi <strong>mặt hàng đã có sẵn trong kho</strong> và cần nhập thêm số lượng. Số lượng mới sẽ được <strong>cộng thêm</strong> vào tồn kho hiện tại.
                </div>
                {restockError && <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">⚠️ {restockError}</div>}
                <div className="space-y-3">
                  <div>
                    <label className="label">Chọn mặt hàng *</label>
                    <select value={restockId} onChange={e => setRestockId(e.target.value)} className="input-field">
                      <option value="">-- Chọn mặt hàng cần nhập thêm --</option>
                      {inventory.map(item => (
                        <option key={item.id} value={item.id}>
                          {item.name} ({item.warehouse}) — Hiện có: {item.quantity} {item.unit}
                        </option>
                      ))}
                    </select>
                  </div>
                  {selectedItem && (
                    <div className="p-3 bg-gray-50 rounded-xl text-sm">
                      <div className="font-medium text-gray-700">{selectedItem.name}</div>
                      <div className="text-gray-500">Kho: {selectedItem.warehouse} • Tồn hiện tại: <span className="font-bold text-gray-900">{selectedItem.quantity} {selectedItem.unit}</span></div>
                      {selectedItem.quantity < selectedItem.minQuantity && (
                        <div className="mt-1 text-red-600 text-xs">⚠️ Đang dưới mức tối thiểu ({selectedItem.minQuantity} {selectedItem.unit})</div>
                      )}
                    </div>
                  )}
                  <div>
                    <label className="label">Số lượng nhập thêm *</label>
                    <input type="number" min={1} value={restockQty}
                      onChange={e => setRestockQty(e.target.value)} className="input-field" placeholder="0" />
                    {selectedItem && restockQty && parseInt(restockQty) > 0 && (
                      <div className="mt-1 text-xs text-emerald-600">
                        → Sau khi nhập: <strong>{selectedItem.quantity + parseInt(restockQty)} {selectedItem.unit}</strong>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-3 mt-5">
                  <button onClick={() => { setMode(null); setRestockError(''); }} className="btn-secondary flex-1">Hủy</button>
                  <button onClick={handleRestock} className="flex-1 py-2.5 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-all">
                    Nhập hàng
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Table */}
        <div className="card">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                className="input-field pl-10" placeholder="Tìm mặt hàng..." />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-header">Mặt hàng</th>
                  <th className="table-header">Danh mục</th>
                  <th className="table-header">Kho</th>
                  <th className="table-header">Tồn kho</th>
                  <th className="table-header">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, i) => {
                  const isLow = item.quantity < item.minQuantity;
                  return (
                    <motion.tr key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                      className="hover:bg-gray-50">
                      <td className="table-cell font-medium">{item.name}</td>
                      <td className="table-cell"><span className="badge-info">{item.category}</span></td>
                      <td className="table-cell text-gray-500 text-sm">{item.warehouse}</td>
                      <td className="table-cell">
                        <div className="font-bold text-gray-900">{item.quantity.toLocaleString()} {item.unit}</div>
                        <div className="text-xs text-gray-400">Tối thiểu: {item.minQuantity}</div>
                        <div className="mt-1.5 h-1.5 bg-gray-100 rounded-full overflow-hidden w-24">
                          <div className={`h-full rounded-full ${isLow ? 'bg-red-500' : 'bg-emerald-500'}`}
                            style={{ width: `${Math.min(100, (item.quantity / (item.minQuantity * 2)) * 100)}%` }} />
                        </div>
                      </td>
                      <td className="table-cell">
                        <span className={isLow ? 'badge-rejected' : 'badge-verified'}>
                          {isLow ? '⚠️ Sắp hết' : '✓ Đủ hàng'}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
