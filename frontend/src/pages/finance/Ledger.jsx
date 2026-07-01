import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import PageTransition from '../../components/PageTransition';
import { Lock, Download } from 'lucide-react';

function exportPDF(data, totalIn, totalOut) {
  const rows = data.map(t => `<tr><td style="padding:6px 10px;border-bottom:1px solid #eee;font-family:monospace;font-size:12px">${t.id}</td><td style="padding:6px 10px;border-bottom:1px solid #eee;font-size:13px">${t.date}</td><td style="padding:6px 10px;border-bottom:1px solid #eee"><span style="background:${t.type==='Thu'?'#dcfce7':'#fee2e2'};color:${t.type==='Thu'?'#166534':'#991b1b'};padding:2px 8px;border-radius:20px;font-size:12px;font-weight:600">${t.type}</span></td><td style="padding:6px 10px;border-bottom:1px solid #eee;font-size:13px;max-width:250px">${t.desc}</td><td style="padding:6px 10px;border-bottom:1px solid #eee;text-align:right;font-weight:700;color:${t.amount>0?'#16a34a':'#dc2626'};font-size:13px">${t.amount>0?'+':''} ${t.amount.toLocaleString('vi-VN')} ₫</td><td style="padding:6px 10px;border-bottom:1px solid #eee;text-align:right;font-weight:700;font-size:13px">${t.balance.toLocaleString('vi-VN')} ₫</td></tr>`).join('');
  const html = `<!DOCTYPE html><html lang="vi"><head><meta charset="UTF-8"><title>Sổ Tài Chính - ReliefHub</title><style>body{font-family:Arial,sans-serif;margin:0;padding:20px;color:#111}table{width:100%;border-collapse:collapse}th{background:#0f172a;color:#fff;padding:8px 10px;text-align:left;font-size:13px}@page{margin:15mm}</style></head><body><div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px"><div><div style="font-size:22px;font-weight:900;color:#0f172a">🆘 ReliefHub</div><div style="font-size:18px;font-weight:700;margin-top:4px">Sổ Tài Chính</div><div style="font-size:13px;color:#666;margin-top:2px">Xuất lúc: ${new Date().toLocaleString('vi-VN')}</div></div><div style="display:flex;gap:15px"><div style="text-align:center;padding:12px 18px;background:#f0fdf4;border:1px solid #86efac;border-radius:10px"><div style="font-size:11px;color:#16a34a;font-weight:600">TỔNG THU</div><div style="font-size:16px;font-weight:900;color:#16a34a">${(totalIn/1e6).toFixed(0)}M ₫</div></div><div style="text-align:center;padding:12px 18px;background:#fef2f2;border:1px solid #fca5a5;border-radius:10px"><div style="font-size:11px;color:#dc2626;font-weight:600">TỔNG CHI</div><div style="font-size:16px;font-weight:900;color:#dc2626">${(totalOut/1e6).toFixed(0)}M ₫</div></div><div style="text-align:center;padding:12px 18px;background:#eff6ff;border:1px solid #93c5fd;border-radius:10px"><div style="font-size:11px;color:#1d4ed8;font-weight:600">SỐ DƯ</div><div style="font-size:16px;font-weight:900;color:#1d4ed8">${((totalIn-totalOut)/1e6).toFixed(0)}M ₫</div></div></div></div><table><thead><tr><th>Mã GD</th><th>Ngày</th><th>Loại</th><th>Mô tả</th><th style="text-align:right">Số tiền</th><th style="text-align:right">Số dư</th></tr></thead><tbody>${rows}</tbody></table><p style="margin-top:20px;font-size:11px;color:#999;border-top:1px solid #eee;padding-top:10px">Tài liệu này được tạo tự động bởi hệ thống ReliefHub. Append-only Ledger — không thể chỉnh sửa sau khi ghi nhận.</p></body></html>`;
  const win = window.open('', '_blank');
  if (!win) { alert('Vui lòng cho phép popup để xuất PDF.'); return; }
  win.document.write(html); win.document.close(); win.onload = () => { win.focus(); win.print(); };
}

function downloadCSV(data) {
  const header = ['Mã GD', 'Ngày', 'Loại', 'Mô tả', 'Số tiền (VNĐ)', 'Số dư (VNĐ)'];
  const rows = data.map(t => [t.id, t.date, t.type, `"${t.desc}"`, t.amount, t.balance]);
  const csv = [header, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = `so-tai-chinh-${new Date().toISOString().split('T')[0]}.csv`; a.click(); URL.revokeObjectURL(url);
}

export default function FinanceLedger() {
  const { ledger, showToast } = useApp();
  const totalIn = ledger.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalOut = ledger.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

  return (
    <PageTransition><div className="page-container">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="section-title">Sổ tài chính</h1><p className="section-subtitle flex items-center gap-2 text-gray-500"><Lock className="w-3.5 h-3.5 text-emerald-500" />Sổ cái chỉ đọc — Append-only Ledger</p></div>
        <div className="flex gap-2"><button onClick={() => { downloadCSV(ledger); showToast('Đã tải file CSV thành công!', 'success'); }} className="btn-secondary flex items-center gap-2"><Download className="w-4 h-4" /> Xuất CSV</button><button onClick={() => { exportPDF(ledger, totalIn, totalOut); showToast('Đang mở hộp thoại in PDF...', 'info'); }} className="btn-primary flex items-center gap-2"><Download className="w-4 h-4" /> Xuất PDF</button></div>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6">{[{ label: 'Tổng thu', value: `${(totalIn / 1e6).toFixed(0)}M VNĐ`, color: 'border-emerald-200 bg-emerald-50', textColor: 'text-emerald-700', icon: '📥' }, { label: 'Tổng chi', value: `${(totalOut / 1e6).toFixed(0)}M VNĐ`, color: 'border-red-200 bg-red-50', textColor: 'text-red-700', icon: '📤' }, { label: 'Số dư hiện tại', value: `${((totalIn - totalOut) / 1e6).toFixed(0)}M VNĐ`, color: 'border-sky-200 bg-sky-50', textColor: 'text-sky-700', icon: '💰' }].map((s, i) => (<motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className={`card border-2 ${s.color}`}><div className="text-2xl mb-1">{s.icon}</div><div className={`text-xl font-black ${s.textColor}`}>{s.value}</div><div className="text-xs text-gray-500 mt-1">{s.label}</div></motion.div>))}</div>
      <div className="card overflow-hidden"><div className="flex items-center gap-2 p-4 bg-gray-50 border-b border-gray-100"><Lock className="w-4 h-4 text-gray-500" /><span className="text-sm font-medium text-gray-600">Sổ tài chính — mọi giao dịch đều lưu vĩnh viễn ({ledger.length} giao dịch)</span></div>
        <div className="overflow-x-auto"><table className="w-full"><thead><tr><th className="table-header">Mã GD</th><th className="table-header">Ngày</th><th className="table-header">Loại</th><th className="table-header">Mô tả</th><th className="table-header text-right">Số tiền</th><th className="table-header text-right">Số dư</th></tr></thead>
          <tbody>{ledger.map((t, i) => (<motion.tr key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="hover:bg-gray-50"><td className="table-cell font-mono text-xs text-gray-500">{t.id}</td><td className="table-cell text-gray-500 text-sm">{t.date}</td><td className="table-cell"><span className={t.type === 'Thu' ? 'badge-verified' : 'badge-rejected'}>{t.type}</span></td><td className="table-cell text-gray-700 text-sm max-w-xs">{t.desc}</td><td className={`table-cell text-right font-bold ${t.amount > 0 ? 'text-emerald-600' : 'text-red-500'}`}>{t.amount > 0 ? '+' : ''}{(t.amount / 1e6).toFixed(1)}M VNĐ</td><td className="table-cell text-right font-bold text-gray-900">{(t.balance / 1e6).toFixed(1)}M VNĐ</td></motion.tr>))}</tbody>
        </table></div>
      </div>
    </div></PageTransition>
  );
}
