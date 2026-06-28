import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageSquare, Send, Clock, CheckCircle, XCircle,
  Search, Eye, ChevronDown, Hash, User, Calendar, BarChart2
} from 'lucide-react';

const STATUS_CONFIG = {
  pending:   { label: 'Chờ xử lý',  color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock },
  in_review: { label: 'Đang xem xét', color: 'bg-blue-100 text-blue-700 border-blue-200',   icon: Eye },
  replied:   { label: 'Đã phản hồi', color: 'bg-green-100 text-green-700 border-green-200',  icon: CheckCircle },
  closed:    { label: 'Đã đóng',     color: 'bg-gray-100 text-gray-600 border-gray-200',     icon: XCircle },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.color}`}>
      <Icon size={11}/> {cfg.label}
    </span>
  );
}

function ProgressBar({ pct }) {
  const color = pct >= 80 ? 'bg-green-500' : pct >= 50 ? 'bg-blue-500' : pct >= 20 ? 'bg-yellow-500' : 'bg-gray-300';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }}/>
      </div>
      <span className="text-xs font-medium text-gray-600 w-8 text-right">{pct}%</span>
    </div>
  );
}

export default function AdminComplaints() {
  const { complaints, replyComplaint, closeComplaint, showToast } = useApp();
  const [search, setSearch]       = useState('');
  const [filterStatus, setFilter] = useState('all');
  const [selected, setSelected]   = useState(null);
  const [replyText, setReplyText] = useState('');
  const [progressVal, setProgress]= useState(50);

  // Auto-generate code KN-001
  const enriched = useMemo(() => {
    return [...complaints].reverse().map((c, i) => ({
      ...c,
      code: c.code || `KN-${String(complaints.length - i).padStart(3,'0')}`,
      progress: typeof c.progress === 'number' ? c.progress
        : c.status === 'closed' ? 100 : c.status === 'replied' ? 75
        : c.status === 'in_review' ? 40 : 0,
    }));
  }, [complaints]);

  const filtered = enriched.filter(c => {
    const matchSearch =
      c.userName?.toLowerCase().includes(search.toLowerCase()) ||
      c.subject?.toLowerCase().includes(search.toLowerCase()) ||
      c.code?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = useMemo(() => ({
    total:     enriched.length,
    pending:   enriched.filter(c => c.status === 'pending').length,
    in_review: enriched.filter(c => c.status === 'in_review').length,
    replied:   enriched.filter(c => c.status === 'replied').length,
    closed:    enriched.filter(c => c.status === 'closed').length,
  }), [enriched]);

  const openDetail = (c) => {
    setSelected(c);
    setReplyText(c.adminReply || '');
    setProgress(c.progress ?? 0);
  };

  const handleReply = () => {
    if (!replyText.trim()) { showToast('Vui lòng nhập nội dung phản hồi', 'error'); return; }
    replyComplaint(selected.id, replyText, progressVal);
    showToast('Đã gửi phản hồi!', 'success');
    setSelected(null);
  };

  const handleClose = (id) => {
    closeComplaint(id);
    setSelected(null);
    showToast('Đã đóng khiếu nại', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quản lý Phản ánh & Khiếu nại</h1>
        <p className="text-gray-500 text-sm mt-1">Theo dõi lịch sử, phân công và phản hồi</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Tổng cộng',    value: stats.total,     color: 'bg-gray-50 border-gray-200 text-gray-700' },
          { label: 'Chờ xử lý',   value: stats.pending,   color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
          { label: 'Đang xem xét',value: stats.in_review, color: 'bg-blue-50 border-blue-200 text-blue-700' },
          { label: 'Đã phản hồi', value: stats.replied,   color: 'bg-green-50 border-green-200 text-green-700' },
          { label: 'Đã đóng',     value: stats.closed,    color: 'bg-gray-50 border-gray-200 text-gray-500' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border p-3 text-center ${s.color}`}>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-xs font-medium mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Tìm theo mã KN, người gửi, tiêu đề..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
        <select value={filterStatus} onChange={e => setFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="all">Tất cả trạng thái</option>
          {Object.entries(STATUS_CONFIG).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Mã</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Người gửi</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Tiêu đề</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Loại</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Tiến độ</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Trạng thái</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Ngày gửi</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="text-center py-12 text-gray-400">Không có khiếu nại nào</td></tr>
              )}
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                      <Hash size={10}/>{c.code}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-purple-100 rounded-full flex items-center justify-center">
                        <User size={12} className="text-purple-600"/>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{c.userName}</div>
                        <div className="text-xs text-gray-400">{c.userRole || 'user'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-700 max-w-[200px] truncate">{c.subject}</div>
                    <div className="text-xs text-gray-400 truncate max-w-[200px]">{c.content?.slice(0,60)}…</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">{c.type || 'Khác'}</span>
                  </td>
                  <td className="px-4 py-3 min-w-[120px]">
                    <ProgressBar pct={c.progress}/>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={c.status}/></td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar size={11}/>{c.createdAt}
                    </span>
                    {c.repliedAt && (
                      <span className="text-xs text-green-500 flex items-center gap-1 mt-0.5">
                        <CheckCircle size={10}/> Đã PH: {c.repliedAt}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => openDetail(c)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors">
                      <Eye size={12}/> Xem
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                    #{selected.code}
                  </span>
                  <StatusBadge status={selected.status}/>
                </div>
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
              </div>
              <h2 className="text-base font-bold text-gray-900 mt-3">{selected.subject}</h2>
            </div>

            <div className="p-6 space-y-5">
              {/* Meta info */}
              <div className="grid grid-cols-2 gap-3 text-sm bg-gray-50 rounded-xl p-4">
                <div><span className="text-gray-500">Người gửi:</span> <span className="font-medium ml-1">{selected.userName}</span></div>
                <div><span className="text-gray-500">Vai trò:</span> <span className="font-medium ml-1">{selected.userRole || 'user'}</span></div>
                <div><span className="text-gray-500">Loại:</span> <span className="font-medium ml-1">{selected.type}</span></div>
                <div><span className="text-gray-500">Ngày gửi:</span> <span className="font-medium ml-1">{selected.createdAt}</span></div>
                {selected.contact && <div className="col-span-2"><span className="text-gray-500">Liên hệ:</span> <span className="font-medium ml-1">{selected.contact}</span></div>}
              </div>

              {/* Content */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Nội dung phản ánh:</p>
                <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed border border-gray-100">
                  {selected.content}
                </div>
              </div>

              {/* Progress slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-700">Tiến độ xử lý:</p>
                  <span className="text-sm font-bold text-blue-600">{progressVal}%</span>
                </div>
                <input type="range" min={0} max={100} step={5}
                  value={progressVal} onChange={e => setProgress(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-500"/>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0%</span><span>Đang xử lý</span><span>100%</span>
                </div>
              </div>

              {/* Admin reply */}
              {selected.adminReply && (
                <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                  <p className="text-xs font-semibold text-green-700 mb-1 flex items-center gap-1">
                    <CheckCircle size={12}/> Phản hồi trước ({selected.repliedAt})
                  </p>
                  <p className="text-sm text-green-800">{selected.adminReply}</p>
                </div>
              )}

              {/* Reply box */}
              {selected.status !== 'closed' && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Phản hồi của Admin:</p>
                  <textarea value={replyText} onChange={e => setReplyText(e.target.value)}
                    placeholder="Nhập nội dung phản hồi cho người dùng..."
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" rows={4}/>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                {selected.status !== 'closed' && (
                  <>
                    <button onClick={handleReply}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors">
                      <Send size={15}/> Gửi phản hồi
                    </button>
                    <button onClick={() => handleClose(selected.id)}
                      className="px-4 py-3 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50">
                      Đóng lại
                    </button>
                  </>
                )}
                {selected.status === 'closed' && (
                  <div className="flex-1 text-center py-3 bg-gray-50 text-gray-500 rounded-xl text-sm font-medium">
                    Khiếu nại đã được đóng
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
