import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import PageTransition from '../../components/PageTransition';
import { MessageSquare, Send, CheckCircle, Clock, X } from 'lucide-react';

const STATUS_CONFIG = {
  pending: { label: '⏳ Chờ phản hồi', cls: 'bg-amber-100 text-amber-700' },
  replied: { label: '💬 Đã phản hồi', cls: 'bg-sky-100 text-sky-700' },
  closed: { label: '✓ Đã đóng', cls: 'bg-gray-100 text-gray-600' },
};

export default function DonorComplaint() {
  const { user, complaints, addComplaint, showToast } = useApp();
  const [activeTab, setActiveTab] = useState('send');
  const [form, setForm] = useState({ type: 'Khiếu nại', subject: '', content: '', contact: '' });
  const [error, setError] = useState('');
  const [detailItem, setDetailItem] = useState(null);

  // Filter complaints by this user
  const myComplaints = complaints.filter(c => c.userName === user?.name || c.userId === user?.id);

  const handleSend = (e) => {
    e.preventDefault();
    if (!form.subject.trim()) { setError('Vui lòng nhập tiêu đề'); return; }
    if (!form.content.trim() || form.content.length < 20) { setError('Nội dung tối thiểu 20 ký tự'); return; }
    addComplaint({
      userId: user?.id,
      userName: user?.name || 'Khách',
      userRole: user?.role || 'donor',
      type: form.type,
      subject: form.subject,
      content: form.content,
      contact: form.contact || user?.email || user?.phone || '',
    });
    setForm({ type: 'Khiếu nại', subject: '', content: '', contact: '' });
    setError('');
    setActiveTab('history');
  };

  return (
    <PageTransition>
      <div className="page-container">
        <div className="mb-6">
          <h1 className="section-title">Phản ánh / Khiếu nại</h1>
          <p className="section-subtitle">Gửi ý kiến đóng góp hoặc khiếu nại và theo dõi tình trạng xử lý</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5 bg-gray-100 p-1 rounded-xl w-fit">
          {[['send', '📝 Gửi phản ánh'], ['history', `📋 Lịch sử (${myComplaints.length})`]].map(([key, label]) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === key ? 'bg-white shadow text-sky-600' : 'text-gray-500 hover:text-gray-700'}`}>
              {label}
            </button>
          ))}
        </div>

        {/* SEND TAB */}
        {activeTab === 'send' && (
          <div className="max-w-2xl">
            <div className="card">
              <div className="flex items-center gap-3 mb-5 p-4 bg-sky-50 rounded-xl">
                <MessageSquare className="w-5 h-5 text-sky-600 flex-shrink-0" />
                <div className="text-sm text-sky-700">Mọi phản ánh của bạn đều được bảo mật và xử lý nghiêm túc trong vòng 24 giờ làm việc.</div>
              </div>
              <form onSubmit={handleSend} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">⚠️ {error}</div>
                )}
                <div>
                  <label className="label">Loại phản ánh</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Khiếu nại', 'Góp ý', 'Báo cáo vi phạm'].map(t => (
                      <button key={t} type="button" onClick={() => setForm({ ...form, type: t })}
                        className={`py-2.5 px-3 rounded-xl border-2 text-sm font-medium transition-all ${form.type === t ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="label">Tiêu đề *</label>
                  <input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                    className="input-field" placeholder="Mô tả ngắn gọn vấn đề..." required />
                </div>
                <div>
                  <label className="label">Nội dung chi tiết *</label>
                  <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
                    className="input-field" rows={5} placeholder="Mô tả chi tiết vấn đề bạn gặp phải..." required />
                  <div className="text-right text-xs mt-1 text-gray-400">{form.content.length} ký tự</div>
                </div>
                <div>
                  <label className="label">Thông tin liên hệ <span className="text-gray-400 font-normal">(để nhận phản hồi)</span></label>
                  <input value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })}
                    className="input-field" placeholder="Email hoặc số điện thoại..." />
                </div>
                <button type="submit" className="w-full btn-primary flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> Gửi phản ánh
                </button>
              </form>
            </div>
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === 'history' && (
          <div className="space-y-3">
            {myComplaints.length === 0 ? (
              <div className="card text-center py-14">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500 mb-4">Bạn chưa gửi phản ánh nào</p>
                <button onClick={() => setActiveTab('send')} className="btn-primary">Gửi phản ánh ngay</button>
              </div>
            ) : myComplaints.map((c, i) => {
              const st = STATUS_CONFIG[c.status];
              return (
                <motion.div key={c.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="card border-2 border-gray-200 cursor-pointer hover:border-sky-300 hover:shadow-md transition-all"
                  onClick={() => setDetailItem(c)}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{c.type}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${st.cls}`}>{st.label}</span>
                      </div>
                      <div className="font-semibold text-gray-900">{c.subject}</div>
                      <div className="text-xs text-gray-400 mt-0.5">📅 {c.createdAt}</div>
                      <div className="text-sm text-gray-600 mt-1 line-clamp-2">{c.content}</div>
                    </div>
                    {c.status === 'pending' && (
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 flex-shrink-0 mt-1.5 animate-pulse" />
                    )}
                  </div>
                  {c.adminReply && (
                    <div className="mt-3 pt-3 border-t border-sky-100">
                      <div className="text-xs font-semibold text-sky-700 mb-1 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Phản hồi từ Admin ({c.repliedAt})
                      </div>
                      <div className="text-sm text-sky-800 line-clamp-2">{c.adminReply}</div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Detail Modal */}
        <AnimatePresence>
          {detailItem && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{detailItem.type}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_CONFIG[detailItem.status]?.cls}`}>{STATUS_CONFIG[detailItem.status]?.label}</span>
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">{detailItem.subject}</h2>
                    <p className="text-xs text-gray-400">📅 Gửi lúc {detailItem.createdAt}</p>
                  </div>
                  <button onClick={() => setDetailItem(null)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">Nội dung của bạn:</p>
                  <p className="text-sm text-gray-800 whitespace-pre-wrap">{detailItem.content}</p>
                </div>
                {detailItem.adminReply ? (
                  <div className="bg-sky-50 border border-sky-200 rounded-xl p-4">
                    <p className="text-sm font-semibold text-sky-700 mb-1 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Phản hồi từ Admin
                      <span className="text-xs text-sky-500">({detailItem.repliedAt})</span>
                    </p>
                    <p className="text-sm text-sky-800 whitespace-pre-wrap">{detailItem.adminReply}</p>
                  </div>
                ) : (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
                    <Clock className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    <p className="text-sm text-amber-700">Phản ánh của bạn đang được Admin xem xét. Chúng tôi sẽ phản hồi trong vòng 24 giờ.</p>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
