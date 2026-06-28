import React, { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

// ─── Dữ liệu ban đầu ────────────────────────────────────────────────────────
const SEED_ADMIN = {
  id: 1, username: 'admin', password: 'admin123', role: 'admin',
  name: 'Nguyễn Văn Admin', email: 'admin@reliefhub.vn',
  phone: '0901000001', avatar: '👨‍💼', status: 'active',
  address: '01 Trần Hưng Đạo, Hà Nội', avatarUrl: '',
  created: '2026-01-01', householdSize: null,
};

const SEED_ACCOUNTS = [
  SEED_ADMIN,
  { id: 2, username: 'donor01', password: 'donor123', role: 'donor', name: 'Trần Thị Hoa', email: 'hoa@gmail.com', phone: '0912345678', avatar: '💼', status: 'active', address: '23 Nguyễn Huệ, TP.HCM', avatarUrl: '', created: '2026-01-05', householdSize: null },
  { id: 3, username: 'donor02', password: 'donor123', role: 'donor', name: 'Nguyễn Văn An', email: 'an@gmail.com', phone: '0901112233', avatar: '💼', status: 'active', address: '05 Lê Lợi, Đà Nẵng', avatarUrl: '', created: '2026-01-08', householdSize: null },
  { id: 4, username: 'finance01', password: 'finance123', role: 'finance', name: 'Lê Minh Tài', email: 'tai@reliefhub.vn', phone: '0934567890', avatar: '💰', status: 'active', address: '15 Đinh Tiên Hoàng, Hà Nội', avatarUrl: '', created: '2026-01-02', householdSize: null },
  { id: 5, username: 'local01', password: 'local123', role: 'local', name: 'Phạm Thị Lan', email: 'lan@quangbinh.gov.vn', phone: '0945678901', avatar: '🏛️', status: 'active', address: 'UBND xã Phúc Trạch, Quảng Bình', avatarUrl: '', created: '2026-01-03', householdSize: null },
  { id: 6, username: 'local02', password: 'local123', role: 'local', name: 'Hoàng Văn Minh', email: 'minh@danang.gov.vn', phone: '0956789012', avatar: '🏛️', status: 'active', address: 'UBND phường Hòa Khánh, Đà Nẵng', avatarUrl: '', created: '2026-01-04', householdSize: null },
  { id: 7, username: 'citizen01', password: 'citizen123', role: 'citizen', name: 'Nguyễn Thị B', email: 'nguyenb@gmail.com', phone: '0967890123', avatar: '👨‍👩‍👧', status: 'active', address: 'Thôn 3, xã Phúc Trạch, Quảng Bình', avatarUrl: '', created: '2026-01-10', householdSize: 3 },
  { id: 8, username: 'citizen02', password: 'citizen123', role: 'citizen', name: 'Lê Văn C', email: 'levanc@gmail.com', phone: '0978901234', avatar: '👨‍👩‍👧', status: 'active', address: '12 Hòa Khánh, Đà Nẵng', avatarUrl: '', created: '2026-02-01', householdSize: 2 },
  { id: 9, username: 'volunteer01', password: 'vol123', role: 'volunteer', name: 'Trần Minh Khoa', email: 'khoa@gmail.com', phone: '0989012345', avatar: '🙋', status: 'active', address: '88 Pasteur, TP.HCM', avatarUrl: '', created: '2026-01-11', householdSize: null },
  { id: 10, username: 'volunteer02', password: 'vol123', role: 'volunteer', name: 'Lê Thị Mai', email: 'mai@gmail.com', phone: '0990123456', avatar: '🙋', status: 'active', address: '45 Trần Phú, Đà Nẵng', avatarUrl: '', created: '2026-02-02', householdSize: null },
  { id: 11, username: 'local03', password: 'local123', role: 'local', name: 'Nguyễn Thị Hằng', email: 'hang@sonla.gov.vn', phone: '0900111222', avatar: '🏛️', status: 'pending_approval', address: 'UBND huyện Cư Mgar, Đắk Lắk', avatarUrl: '', created: '2026-06-20', householdSize: null },
];

const INITIAL_CAMPAIGNS = [
  { id: 1, name: 'Cứu trợ lũ lụt miền Trung', area: 'Quảng Bình', type: 'Lũ lụt', status: 'active', target: 500000000, raised: 380000000, start: '2026-01-10', end: '2026-03-30', image: '🌊', description: 'Hỗ trợ khẩn cấp cho người dân vùng lũ miền Trung', households: 1200, volunteers: 45 },
  { id: 2, name: 'Hỗ trợ bão số 5 Đà Nẵng', area: 'Đà Nẵng', type: 'Bão', status: 'active', target: 300000000, raised: 210000000, start: '2026-02-01', end: '2026-04-15', image: '🌀', description: 'Khắc phục hậu quả bão số 5 tại Đà Nẵng', households: 800, volunteers: 30 },
  { id: 3, name: 'Cứu trợ sạt lở đất Sơn La', area: 'Sơn La', type: 'Sạt lở đất', status: 'completed', target: 200000000, raised: 200000000, start: '2025-11-01', end: '2025-12-31', image: '⛰️', description: 'Hỗ trợ tái thiết sau sạt lở đất nghiêm trọng', households: 400, volunteers: 20 },
  { id: 4, name: 'Hạn hán Tây Nguyên', area: 'Đắk Lắk', type: 'Hạn hán', status: 'active', target: 150000000, raised: 45000000, start: '2026-03-01', end: '2026-05-31', image: '☀️', description: 'Cung cấp nước sạch cho vùng hạn hán', households: 600, volunteers: 15 },
];

const INITIAL_CONTRIBUTIONS = [
  { id: 1, donor: 'Công ty ABC', type: 'Tiền mặt', amount: 50000000, status: 'verified', date: '2026-01-15', campaign: 'Cứu trợ lũ lụt miền Trung', evidence: '', notes: '' },
  { id: 2, donor: 'Trần Thị Hoa', type: 'Hàng hóa', amount: 10000000, status: 'pending', date: '2026-02-08', campaign: 'Hỗ trợ bão số 5 Đà Nẵng', evidence: '', notes: 'Gạo 500kg, mì gói 200 thùng' },
  { id: 3, donor: 'Tập đoàn XYZ', type: 'Tiền mặt', amount: 100000000, status: 'verified', date: '2026-01-20', campaign: 'Cứu trợ lũ lụt miền Trung', evidence: '', notes: '' },
  { id: 4, donor: 'Nguyễn Văn An', type: 'Hàng hóa', amount: 5000000, status: 'rejected', date: '2026-02-12', campaign: 'Cứu trợ sạt lở đất Sơn La', evidence: '', notes: 'Không có hóa đơn', financeNote: 'Thiếu chứng từ hợp lệ' },
];

// ─── CAMPAIGN BANK ACCOUNTS ──────────────────────────────────────────────────
const INITIAL_BANK_ACCOUNTS = [
  { id: 1, campaignId: 1, bankName: 'Vietcombank', accountNumber: '0071001234567', accountHolder: 'Quỹ Cứu trợ miền Trung', branch: 'VCB Chi nhánh Hà Nội', qrImage: '', transferNoteFormat: 'RH-1-{user_id}', active: true },
  { id: 2, campaignId: 1, bankName: 'Techcombank', accountNumber: '190368888888', accountHolder: 'Quỹ Cứu trợ miền Trung', branch: 'TCB Chi nhánh Đà Nẵng', qrImage: '', transferNoteFormat: 'RH-1-{user_id}', active: true },
  { id: 3, campaignId: 2, bankName: 'BIDV', accountNumber: '2121000999988', accountHolder: 'Quỹ Bão số 5 Đà Nẵng', branch: 'BIDV Chi nhánh Đà Nẵng', qrImage: '', transferNoteFormat: 'RH-2-{user_id}', active: true },
  { id: 4, campaignId: 4, bankName: 'Agribank', accountNumber: '1502205008888', accountHolder: 'Quỹ Hạn hán Tây Nguyên', branch: 'AGB Chi nhánh Đắk Lắk', qrImage: '', transferNoteFormat: 'RH-4-{user_id}', active: true },
];

// ─── CAMPAIGN DROP POINTS (in-kind) ──────────────────────────────────────────
const INITIAL_DROP_POINTS = [
  { id: 1, campaignId: 1, name: 'Điểm nhận hàng Kho Đà Nẵng', receiver: 'Anh Phạm Hùng', phone: '0901234567', address: '45 Điện Biên Phủ, quận Thanh Khê, Đà Nẵng', hours: '08:00 - 17:00 hàng ngày', capacity: '5 tấn/ngày', notes: 'Chỉ nhận gạo, mì, nước uống, áo phao. Không nhận quần áo cũ.', active: true },
  { id: 2, campaignId: 1, name: 'Điểm nhận hàng Kho Hà Nội', receiver: 'Chị Nguyễn Lan', phone: '0907654321', address: '123 Giải Phóng, Hai Bà Trưng, Hà Nội', hours: '08:00 - 16:00 T2-T6', capacity: '3 tấn/ngày', notes: 'Chuyên nhận thuốc men và vật tư y tế.', active: true },
  { id: 3, campaignId: 2, name: 'Điểm nhận hàng Đà Nẵng', receiver: 'Anh Lê Quang', phone: '0911222333', address: '78 Lê Duẩn, quận Hải Châu, Đà Nẵng', hours: '07:00 - 18:00 hàng ngày', capacity: '4 tấn/ngày', notes: 'Ưu tiên nhu yếu phẩm khô.', active: true },
  { id: 4, campaignId: 4, name: 'Điểm nhận hàng Đắk Lắk', receiver: 'Chị H\'Loan', phone: '0922333444', address: '15 Nguyễn Tất Thành, Buôn Ma Thuột, Đắk Lắk', hours: '08:00 - 16:00 hàng ngày', capacity: '2 tấn/ngày', notes: 'Cần nước uống và máy lọc nước.', active: true },
];

// ─── CAMPAIGN CASH POINTS ─────────────────────────────────────────────────────
const INITIAL_CASH_POINTS = [
  { id: 1, campaignId: 1, officeName: 'Văn phòng Quỹ Cứu trợ - Hà Nội', address: '01 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội', phone: '02439391234', schedule: '08:00 - 17:00 T2-T6', receiverName: 'Lê Minh Tài', requirement: 'Mang CMND/CCCD, số tiền ≥ 100.000đ có biên nhận chính thức.', active: true },
  { id: 2, campaignId: 1, officeName: 'Văn phòng Quỹ - Đà Nẵng', address: '50 Bạch Đằng, Hải Châu, Đà Nẵng', phone: '02363889900', schedule: '08:00 - 17:00 T2-T7', receiverName: 'Hoàng Văn Minh', requirement: 'Mang CMND/CCCD và xác nhận địa chỉ.', active: true },
  { id: 3, campaignId: 2, officeName: 'Văn phòng UBND quận Liên Chiểu', address: '22 Nguyễn Lương Bằng, Liên Chiểu, Đà Nẵng', phone: '02363776655', schedule: '08:00 - 16:30 T2-T6', receiverName: 'Hoàng Văn Minh', requirement: 'Mang CMND, có thể đóng góp tối thiểu 50.000đ.', active: true },
  { id: 4, campaignId: 4, officeName: 'UBND huyện Cư Mgar', address: 'Km 12 QL27, Cư Mgar, Đắk Lắk', phone: '02623871234', schedule: '07:30 - 16:00 T2-T6', receiverName: 'Nguyễn Thị Hằng', requirement: 'Mang CMND/CCCD, đóng góp tiền mặt.', active: true },
];

// ─── CAMPAIGN NEEDED ITEMS ────────────────────────────────────────────────────
const INITIAL_NEEDED_ITEMS = [
  { id: 1, campaignId: 1, itemName: 'Gạo ST25', unit: 'kg', requiredQty: 5000, receivedQty: 2500, priority: 'high' },
  { id: 2, campaignId: 1, itemName: 'Mì gói', unit: 'thùng', requiredQty: 500, receivedQty: 300, priority: 'high' },
  { id: 3, campaignId: 1, itemName: 'Nước uống 5L', unit: 'thùng', requiredQty: 300, receivedQty: 80, priority: 'critical' },
  { id: 4, campaignId: 1, itemName: 'Áo phao cứu sinh', unit: 'cái', requiredQty: 300, receivedQty: 150, priority: 'medium' },
  { id: 5, campaignId: 1, itemName: 'Chăn bông', unit: 'cái', requiredQty: 500, receivedQty: 400, priority: 'medium' },
  { id: 6, campaignId: 2, itemName: 'Thuốc men sơ cứu', unit: 'hộp', requiredQty: 200, receivedQty: 60, priority: 'high' },
  { id: 7, campaignId: 2, itemName: 'Nước uống 5L', unit: 'thùng', requiredQty: 200, receivedQty: 50, priority: 'critical' },
  { id: 8, campaignId: 4, itemName: 'Nước uống 20L', unit: 'bình', requiredQty: 300, receivedQty: 100, priority: 'critical' },
  { id: 9, campaignId: 4, itemName: 'Máy lọc nước', unit: 'cái', requiredQty: 20, receivedQty: 5, priority: 'high' },
];

// ─── BANK DONATIONS (chuyển khoản) ────────────────────────────────────────────
const INITIAL_BANK_DONATIONS = [
  { id: 1, campaignId: 1, campaign: 'Cứu trợ lũ lụt miền Trung', userId: 2, userName: 'Trần Thị Hoa', amount: 20000000, bankAccountId: 1, transferNote: 'RH-1-2', proofImage: '', status: 'PENDING', createdAt: '2026-02-08', verifiedAt: '', verifiedBy: '', rejectReason: '' },
  { id: 2, campaignId: 1, campaign: 'Cứu trợ lũ lụt miền Trung', userId: 3, userName: 'Nguyễn Văn An', amount: 5000000, bankAccountId: 2, transferNote: 'RH-1-3', proofImage: '', status: 'VERIFIED', createdAt: '2026-01-20', verifiedAt: '2026-01-21', verifiedBy: 'Lê Minh Tài', rejectReason: '' },
];

// ─── ITEM DONATIONS (hiện vật) ────────────────────────────────────────────────
const INITIAL_ITEM_DONATIONS = [
  { id: 1, campaignId: 1, campaign: 'Cứu trợ lũ lụt miền Trung', userId: 2, userName: 'Trần Thị Hoa', neededItemId: 1, itemName: 'Gạo ST25', unit: 'kg', quantity: 200, deliveryMethod: 'self_drop', dropPointId: 1, shippingName: '', shippingPhone: '', shippingAddress: '', status: 'RECEIVED', createdAt: '2026-02-08', timeline: [{ status: 'REGISTERED', time: '2026-02-08 10:00' }, { status: 'RECEIVED', time: '2026-02-09 14:30' }] },
  { id: 2, campaignId: 2, campaign: 'Hỗ trợ bão số 5 Đà Nẵng', userId: 3, userName: 'Nguyễn Văn An', neededItemId: 6, itemName: 'Thuốc men sơ cứu', unit: 'hộp', quantity: 30, deliveryMethod: 'shipping', dropPointId: null, shippingName: 'Nguyễn Văn An', shippingPhone: '0901112233', shippingAddress: '05 Lê Lợi, Đà Nẵng', status: 'SHIPPING', createdAt: '2026-02-12', timeline: [{ status: 'REGISTERED', time: '2026-02-12 09:00' }, { status: 'SHIPPING', time: '2026-02-13 08:00' }] },
];

// ─── CASH APPOINTMENTS (tiền mặt) ─────────────────────────────────────────────
const INITIAL_CASH_APPOINTMENTS = [
  { id: 1, campaignId: 1, campaign: 'Cứu trợ lũ lụt miền Trung', userId: 2, userName: 'Trần Thị Hoa', amount: 10000000, cashPointId: 1, appointmentDate: '2026-02-15', appointmentTime: '09:00', status: 'CONFIRMED', createdAt: '2026-02-13', receiptNo: 'RH-REC-001', confirmedAt: '2026-02-15', timeline: [{ status: 'BOOKED', time: '2026-02-13 16:00' }, { status: 'ARRIVED', time: '2026-02-15 09:15' }, { status: 'CONFIRMED', time: '2026-02-15 09:30' }] },
  { id: 2, campaignId: 2, campaign: 'Hỗ trợ bão số 5 Đà Nẵng', userId: 3, userName: 'Nguyễn Văn An', amount: 5000000, cashPointId: 3, appointmentDate: '2026-02-20', appointmentTime: '10:00', status: 'BOOKED', createdAt: '2026-02-18', receiptNo: '', confirmedAt: '', timeline: [{ status: 'BOOKED', time: '2026-02-18 14:00' }] },
];

// ─── DONATION RECEIPTS (biên nhận) ────────────────────────────────────────────
const INITIAL_DONATION_RECEIPTS = [
  { id: 1, receiptNo: 'RH-REC-001', campaignId: 1, campaign: 'Cứu trợ lũ lụt miền Trung', userId: 2, userName: 'Trần Thị Hoa', type: 'cash', amount: 10000000, itemName: '', quantity: 0, unit: '', issuedAt: '2026-02-15', issuedBy: 'Lê Minh Tài', status: 'issued' },
  { id: 2, receiptNo: 'RH-REC-002', campaignId: 1, campaign: 'Cứu trợ lũ lụt miền Trung', userId: 3, userName: 'Nguyễn Văn An', type: 'bank', amount: 5000000, itemName: '', quantity: 0, unit: '', issuedAt: '2026-01-21', issuedBy: 'Lê Minh Tài', status: 'issued' },
  { id: 3, receiptNo: 'RH-REC-003', campaignId: 1, campaign: 'Cứu trợ lũ lụt miền Trung', userId: 2, userName: 'Trần Thị Hoa', type: 'item', amount: 0, itemName: 'Gạo ST25', quantity: 200, unit: 'kg', issuedAt: '2026-02-09', issuedBy: 'Phạm Hùng', status: 'issued' },
];

// ─── DONATION TRACKING (theo dõi sử dụng) ─────────────────────────────────────
const INITIAL_DONATION_TRACKING = [
  { id: 1, campaignId: 1, type: 'money', label: 'Tiền mặt', totalReceived: 380000000, totalUsed: 320000000, remaining: 60000000, timeline: [
    { date: '2026-01-15', desc: 'Thu từ Công ty ABC', amount: 50000000, photo: '' },
    { date: '2026-01-20', desc: 'Thu từ Tập đoàn XYZ', amount: 100000000, photo: '' },
    { date: '2026-01-19', desc: 'Chi mua gạo ST25 - Kho Đà Nẵng', amount: -15000000, photo: '' },
    { date: '2026-02-08', desc: 'Chi vận chuyển hàng hóa - Quảng Bình', amount: -8000000, photo: '' },
    { date: '2026-03-03', desc: 'Chi mua thuốc men sơ cấp cứu', amount: -5000000, photo: '' },
  ]},
  { id: 2, campaignId: 1, type: 'item', label: 'Gạo ST25', totalReceived: 2500, totalUsed: 1800, remaining: 700, unit: 'kg', timeline: [
    { date: '2026-02-09', desc: 'Nhận 200kg từ Trần Thị Hoa', amount: 200, photo: '' },
    { date: '2026-01-25', desc: 'Phát 800kg cho xã Phúc Trạch', amount: -800, photo: '' },
    { date: '2026-02-05', desc: 'Phát 1000kg cho huyện Hương Khê', amount: -1000, photo: '' },
  ]},
  { id: 3, campaignId: 1, type: 'item', label: 'Nước uống 5L', totalReceived: 80, totalUsed: 60, remaining: 20, unit: 'thùng', timeline: [
    { date: '2026-01-22', desc: 'Phát 60 thùng cho vùng cô lập', amount: -60, photo: '' },
  ]},
  { id: 4, campaignId: 2, type: 'money', label: 'Tiền mặt', totalReceived: 210000000, totalUsed: 180000000, remaining: 30000000, timeline: [
    { date: '2026-02-10', desc: 'Chi sửa mái nhà tạm', amount: -50000000, photo: '' },
    { date: '2026-03-01', desc: 'Chi logistics Đà Nẵng', amount: -12000000, photo: '' },
  ]},
];

const INITIAL_NEEDS = [
  { id: 1, citizen: 'Nguyễn Thị B', area: 'Quảng Bình', items: 'Gạo 50kg, Nước uống', urgency: 'high', status: 'approved', date: '2026-01-16', households: 3, managedBy: 'Phạm Thị Lan', approvedAt: '2026-01-17', warehouseNote: '' },
  { id: 2, citizen: 'Lê Văn C', area: 'Đà Nẵng', items: 'Áo phao, Thuốc men', urgency: 'critical', status: 'pending', date: '2026-02-09', households: 1, managedBy: null, approvedAt: '', warehouseNote: '' },
  { id: 3, citizen: 'Phạm Thị D', area: 'Quảng Bình', items: 'Mì gói 20 thùng, Nến, Pin', urgency: 'medium', status: 'verified', date: '2026-01-17', households: 5, managedBy: 'Phạm Thị Lan', approvedAt: '', warehouseNote: '' },
  { id: 4, citizen: 'Trần Văn E', area: 'Sơn La', items: 'Chăn màn, Quần áo trẻ em', urgency: 'low', status: 'warehouse_ready', date: '2026-02-11', households: 2, managedBy: 'Phạm Thị Lan', approvedAt: '2026-02-12', warehouseNote: 'Đã chuẩn bị đủ hàng tại Kho Hà Nội' },
];

const INITIAL_INVENTORY = [
  { id: 1, name: 'Gạo ST25', category: 'Thực phẩm', unit: 'kg', quantity: 2500, warehouse: 'Kho Đà Nẵng', minQuantity: 500 },
  { id: 2, name: 'Mì gói Hảo Hảo', category: 'Thực phẩm', unit: 'thùng', quantity: 300, warehouse: 'Kho Hà Nội', minQuantity: 100 },
  { id: 3, name: 'Nước uống 5L', category: 'Nước uống', unit: 'thùng', quantity: 80, warehouse: 'Kho Đà Nẵng', minQuantity: 200 },
  { id: 4, name: 'Áo phao cứu sinh', category: 'Dụng cụ cứu nạn', unit: 'cái', quantity: 150, warehouse: 'Kho TP.HCM', minQuantity: 50 },
  { id: 5, name: 'Chăn bông', category: 'Vật dụng thiết yếu', unit: 'cái', quantity: 400, warehouse: 'Kho Hà Nội', minQuantity: 100 },
  { id: 6, name: 'Thuốc men sơ cấp cứu', category: 'Y tế', unit: 'hộp', quantity: 60, warehouse: 'Kho TP.HCM', minQuantity: 100 },
];

const INITIAL_DISASTERS = [
  { id: 1, area: 'Quảng Bình', type: 'Lũ lụt', level: 'Nghiêm trọng', households: 1200, status: 'active', disasterDate: '2026-01-10', createdAt: '2026-01-10', damage: 'Hàng trăm nhà bị ngập, mất điện, đường sá hư hỏng nặng' },
  { id: 2, area: 'Đà Nẵng', type: 'Bão số 5', level: 'Trung bình', households: 800, status: 'recovering', disasterDate: '2026-02-01', createdAt: '2026-02-01', damage: 'Cây cối gãy đổ, mái nhà bị tốc, thiệt hại nông nghiệp' },
  { id: 3, area: 'Sơn La', type: 'Sạt lở đất', level: 'Nghiêm trọng', households: 400, status: 'completed', disasterDate: '2025-11-09', createdAt: '2025-11-10', damage: 'Sạt lở vùi lấp đường, một số nhà dân bị thiệt hại' },
];

const INITIAL_TRANSPORTS = [
  { id: 'VT-001', needId: 1, recipient: 'Nguyễn Thị B', area: 'Quảng Bình, xã Phúc Trạch', items: [{ name: 'Gạo ST25', qty: 50, unit: 'kg' }, { name: 'Mì gói', qty: 5, unit: 'thùng' }], households: 3, status: 'pending', assignedTo: null, deliveredAt: null, notes: '' },
  { id: 'VT-002', needId: null, recipient: 'Lê Văn C', area: 'Đà Nẵng, phường Hòa Khánh', items: [{ name: 'Áo phao', qty: 10, unit: 'cái' }, { name: 'Thuốc men', qty: 2, unit: 'hộp' }], households: 1, status: 'in_transit', assignedTo: null, deliveredAt: null, notes: '' },
  { id: 'VT-003', needId: null, recipient: 'Phạm Văn C', area: 'Đắk Lắk, huyện Cư Mgar', items: [{ name: 'Nước uống', qty: 20, unit: 'thùng' }], households: 1, status: 'pending', assignedTo: null, deliveredAt: null, notes: '' },
];

const INITIAL_LEDGER = [
  { id: 'TX001', date: '2026-01-20', type: 'Thu', desc: 'Tập đoàn XYZ đóng góp - Chiến dịch lũ lụt miền Trung', amount: 100000000, balance: 750000000 },
  { id: 'TX002', date: '2026-01-19', type: 'Chi', desc: 'Mua gạo ST25 - Kho Đà Nẵng', amount: -15000000, balance: 650000000 },
  { id: 'TX003', date: '2026-02-08', type: 'Chi', desc: 'Vận chuyển hàng hóa - Quảng Bình', amount: -8000000, balance: 665000000 },
  { id: 'TX004', date: '2026-01-15', type: 'Thu', desc: 'Công ty ABC đóng góp - Chiến dịch lũ lụt miền Trung', amount: 50000000, balance: 673000000 },
  { id: 'TX005', date: '2026-03-03', type: 'Chi', desc: 'Mua thuốc men sơ cấp cứu', amount: -5000000, balance: 623000000 },
  { id: 'TX006', date: '2026-03-01', type: 'Chi', desc: 'Chi phí logistics - Đà Nẵng', amount: -12000000, balance: 628000000 },
];

// ─── VOLUNTEER GROUPS (simplified: no chat/GPS/points) ────────────────────────
const INITIAL_VOLUNTEER_GROUPS = [
  {
    id: 1, name: 'Nhóm Cứu trợ Quảng Bình', province: 'Quảng Bình',
    campaignId: 1, campaign: 'Cứu trợ lũ lụt miền Trung',
    leader: 'Trần Minh Khoa', leaderId: 9, leaderPhone: '0989012345',
    maxMembers: 20, memberIds: [9, 10],
    area: 'Xã Phúc Trạch, huyện Hương Khê, Quảng Bình',
    status: 'active', approvedByAdmin: true,
    description: 'Nhóm tình nguyện hỗ trợ vùng lũ tại Quảng Bình, ưu tiên khu vực xã Phúc Trạch và Hương Khê. Cần người có xe và sức khỏe tốt.',
    createdAt: '2026-01-12',
  },
  {
    id: 2, name: 'Nhóm Cứu nạn Đà Nẵng', province: 'Đà Nẵng',
    campaignId: 2, campaign: 'Hỗ trợ bão số 5 Đà Nẵng',
    leader: 'Lê Thị Mai', leaderId: 10, leaderPhone: '0990123456',
    maxMembers: 15, memberIds: [10],
    area: 'Phường Hòa Khánh, quận Liên Chiểu, Đà Nẵng',
    status: 'active', approvedByAdmin: true,
    description: 'Nhóm tập trung cứu trợ khẩn cấp và hỗ trợ y tế tại phường Hòa Khánh, Đà Nẵng. Ưu tiên thành viên có kỹ năng sơ cứu.',
    createdAt: '2026-02-03',
  },
  {
    id: 3, name: 'Nhóm Hỗ trợ Tây Nguyên', province: 'Đắk Lắk',
    campaignId: 4, campaign: 'Hạn hán Tây Nguyên',
    leader: 'Phạm Quốc Hùng', leaderId: null, leaderPhone: '0933445566',
    maxMembers: 10, memberIds: [],
    area: 'Các buôn làng huyện Cư Mgar, Đắk Lắk',
    status: 'recruiting', approvedByAdmin: true,
    description: 'Cung cấp nước uống và nhu yếu phẩm cho đồng bào Tây Nguyên vùng hạn hán. Cần người có xe tải hoặc bán tải.',
    createdAt: '2026-03-05',
  },
];

// ─── MISSIONS (admin creates, simplified) ─────────────────────────────────────
const INITIAL_MISSIONS = [
  {
    id: 1, code: 'MV-001',
    title: 'Vận chuyển 500 suất ăn đến xã Phúc Trạch',
    campaignId: 1, campaign: 'Cứu trợ lũ lụt miền Trung',
    location: 'Xã Phúc Trạch, Quảng Bình',
    priority: 'critical',
    startDate: '2026-01-20', endDate: '2026-01-20',
    requiredPeople: 8, requiredEquipment: '2 xe tải nhỏ, Thùng xốp đựng thức ăn, Găng tay',
    description: 'Vận chuyển và phát 500 suất cơm hộp cho 200 hộ dân bị cô lập do lũ tại xã Phúc Trạch. Cần 8 người, 2 xe tải.',
    status: 'COMPLETED',
    assignedGroupId: 1, assignedGroupName: 'Nhóm Cứu trợ Quảng Bình',
    createdAt: '2026-01-18',
  },
  {
    id: 2, code: 'MV-002',
    title: 'Hỗ trợ y tế khẩn cấp phường Hòa Khánh',
    campaignId: 2, campaign: 'Hỗ trợ bão số 5 Đà Nẵng',
    location: 'Phường Hòa Khánh, Đà Nẵng',
    priority: 'critical',
    startDate: '2026-02-10', endDate: '2026-02-12',
    requiredPeople: 5, requiredEquipment: 'Túi sơ cứu, Cáng cứu thương',
    description: 'Phối hợp đội y tế địa phương hỗ trợ sơ cứu, băng bó và chuyển nạn nhân bị thương do bão.',
    status: 'IN_PROGRESS',
    assignedGroupId: 2, assignedGroupName: 'Nhóm Cứu nạn Đà Nẵng',
    createdAt: '2026-02-08',
  },
  {
    id: 3, code: 'MV-003',
    title: 'Phát 200 thùng nước sạch cho 3 buôn làng',
    campaignId: 4, campaign: 'Hạn hán Tây Nguyên',
    location: 'Huyện Cư Mgar, Đắk Lắk',
    priority: 'high',
    startDate: '2026-03-15', endDate: '2026-03-15',
    requiredPeople: 6, requiredEquipment: '2 xe bán tải, Bình nước 20L',
    description: 'Chở 200 thùng nước 5L đến 3 buôn làng xa trung tâm huyện Cư Mgar chưa có nước sạch.',
    status: 'OPEN',
    assignedGroupId: null, assignedGroupName: null,
    createdAt: '2026-03-10',
  },
  {
    id: 4, code: 'MV-004',
    title: 'Dọn dẹp tái thiết nhà dân sau bão',
    campaignId: 2, campaign: 'Hỗ trợ bão số 5 Đà Nẵng',
    location: 'Quận Liên Chiểu, Đà Nẵng',
    priority: 'medium',
    startDate: '2026-02-15', endDate: '2026-02-20',
    requiredPeople: 12, requiredEquipment: 'Cuốc xẻng, Bao tải, Máy cưa, Bảo hộ lao động',
    description: 'Hỗ trợ người dân dọn dẹp bùn đất sau bão, sửa chữa mái nhà tạm thời.',
    status: 'OPEN',
    assignedGroupId: null, assignedGroupName: null,
    createdAt: '2026-02-12',
  },
];

// ─── MISSION REPORTS (simplified) ─────────────────────────────────────────────
const INITIAL_MISSION_REPORTS = [
  {
    id: 1, missionId: 1, groupId: 1,
    authorId: 9, authorName: 'Trần Minh Khoa',
    activityType: 'Vận chuyển & Phát lương thực',
    activityDate: '2026-01-20', location: 'Xã Phúc Trạch, Quảng Bình',
    householdsSupported: 200, peopleSupported: 850,
    description: 'Hoàn thành phát 500 suất ăn, đúng giờ, không có sự cố',
    challenges: 'Đường vào xã bị ngập ~30cm, phải chuyển sang xe máy đoạn cuối',
    results: 'Tất cả 200 hộ dân nhận đủ suất ăn, không ai bị bỏ lại',
    evidenceFiles: [],
    submittedAt: '2026-01-20',
    reviewStatus: 'reviewed',
    reviewedBy: 'Admin',
    reviewedAt: '2026-01-21',
  },
];

// ─── VOLUNTEER PROFILES (simplified - no points) ──────────────────────────────
const INITIAL_VOL_PROFILES = [
  { userId: 9, skills: ['Lái xe tải', 'Sơ cứu cơ bản', 'Vận chuyển hàng nặng'], experience: '2 năm tham gia tình nguyện cứu trợ miền Trung', vehicles: ['Xe tải 1.5T', 'Xe máy'], equipment: ['Bộ dụng cụ sơ cứu'], preferredArea: 'Quảng Bình' },
  { userId: 10, skills: ['Hỗ trợ y tế', 'Nấu ăn số lượng lớn', 'Điều phối logistics'], experience: '1 năm tình nguyện cứu trợ bão lũ', vehicles: ['Xe máy'], equipment: ['Túi sơ cứu', 'Máy đo huyết áp'], preferredArea: 'Đà Nẵng' },
];

// ─── COMPLAINTS ───────────────────────────────────────────────────────────────
const INITIAL_COMPLAINTS = [
  { id: 1, seqNo: 'KN-001', userId: 2, userName: 'Trần Thị Hoa', userRole: 'donor', type: 'Khiếu nại', subject: 'Đóng góp của tôi chưa được xác minh sau 5 ngày', content: 'Tôi đã đóng góp 10 triệu đồng ngày 08/02/2026 nhưng đến nay vẫn chưa thấy cập nhật trạng thái xác minh.', contact: 'tranthi.hoa@email.com', status: 'pending', createdAt: '2026-02-13', adminReply: '', repliedAt: '', closedAt: '', completionPct: 20 },
  { id: 2, seqNo: 'KN-002', userId: 3, userName: 'Nguyễn Văn An', userRole: 'donor', type: 'Góp ý', subject: 'Nên có thông báo khi đóng góp được duyệt', content: 'Đề xuất hệ thống gửi email/thông báo tự động khi đóng góp được xác minh hoặc từ chối.', contact: '0912345678', status: 'replied', createdAt: '2026-02-14', adminReply: 'Cảm ơn góp ý. Chúng tôi sẽ bổ sung tính năng thông báo trong phiên bản tiếp theo.', repliedAt: '2026-02-15', closedAt: '', completionPct: 80 },
];

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState(SEED_ACCOUNTS);
  const [campaigns, setCampaigns] = useState(INITIAL_CAMPAIGNS);
  const [contributions, setContributions] = useState(INITIAL_CONTRIBUTIONS);
  const [needs, setNeeds] = useState(INITIAL_NEEDS);
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [disasters, setDisasters] = useState(INITIAL_DISASTERS);
  const [transports, setTransports] = useState(INITIAL_TRANSPORTS);
  const [ledger, setLedger] = useState(INITIAL_LEDGER);

  // Donor module state
  const [bankAccounts, setBankAccounts] = useState(INITIAL_BANK_ACCOUNTS);
  const [dropPoints, setDropPoints] = useState(INITIAL_DROP_POINTS);
  const [cashPoints, setCashPoints] = useState(INITIAL_CASH_POINTS);
  const [neededItems, setNeededItems] = useState(INITIAL_NEEDED_ITEMS);
  const [bankDonations, setBankDonations] = useState(INITIAL_BANK_DONATIONS);
  const [itemDonations, setItemDonations] = useState(INITIAL_ITEM_DONATIONS);
  const [cashAppointments, setCashAppointments] = useState(INITIAL_CASH_APPOINTMENTS);
  const [donationReceipts, setDonationReceipts] = useState(INITIAL_DONATION_RECEIPTS);
  const [donationTracking, setDonationTracking] = useState(INITIAL_DONATION_TRACKING);

  // Volunteer state (simplified)
  const [volunteerGroups, setVolunteerGroups] = useState(INITIAL_VOLUNTEER_GROUPS);
  const [groupApplications, setGroupApplications] = useState([]);
  const [missions, setMissions] = useState(INITIAL_MISSIONS);
  const [missionApplications, setMissionApplications] = useState([]);
  const [missionReports, setMissionReports] = useState(INITIAL_MISSION_REPORTS);
  const [volProfiles, setVolProfiles] = useState(INITIAL_VOL_PROFILES);

  const [complaints, setComplaints] = useState(INITIAL_COMPLAINTS);
  const [notifications, setNotifications] = useState([
    { id: 1, msg: 'Đóng góp mới cần xác minh', type: 'info', read: false },
    { id: 2, msg: 'Kho gạo sắp hết - Kho Đà Nẵng', type: 'warning', read: false },
    { id: 3, msg: 'Chiến dịch lũ lụt đạt 76% mục tiêu', type: 'success', read: true },
  ]);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // ─── Auth ─────────────────────────────────────────────────────────────────
  const login = useCallback((username, password) => {
    const found = accounts.find(u => u.username === username && u.password === password);
    if (!found) return { success: false, error: 'Tên đăng nhập hoặc mật khẩu không đúng' };
    if (found.status === 'pending_approval') return { success: false, error: 'Tài khoản của bạn đang chờ admin phê duyệt.' };
    if (found.status === 'inactive') return { success: false, error: 'Tài khoản đã bị khóa.' };
    setUser(found);
    showToast(`Chào mừng, ${found.name}! 🎉`, 'success');
    return { success: true, role: found.role };
  }, [accounts, showToast]);

  const register = useCallback((data) => {
    if (accounts.find(u => u.username === data.username)) return { success: false, error: 'Tên đăng nhập đã tồn tại' };
    const needsApproval = ['finance', 'local'].includes(data.role);
    const newUser = {
      id: Date.now(), username: data.username, password: data.password, role: data.role,
      name: data.name, email: data.email, phone: data.phone || '', address: data.address || '',
      avatarUrl: '',
      avatar: data.role === 'donor' ? '💼' : data.role === 'citizen' ? '👨‍👩‍👧' : data.role === 'volunteer' ? '🙋' : data.role === 'local' ? '🏛️' : '💰',
      status: needsApproval ? 'pending_approval' : 'active',
      created: new Date().toISOString().split('T')[0],
      householdSize: data.role === 'citizen' ? (parseInt(data.householdSize) || 1) : null,
    };
    setAccounts(prev => [...prev, newUser]);
    if (needsApproval) { showToast('Đăng ký thành công! Tài khoản đang chờ admin phê duyệt.', 'info'); return { success: true, needsApproval: true }; }
    setUser(newUser);
    showToast(`Đăng ký thành công! Chào mừng, ${newUser.name}! 🎉`, 'success');
    return { success: true, needsApproval: false, role: newUser.role };
  }, [accounts, showToast]);

  const logout = useCallback(() => { setUser(null); showToast('Đã đăng xuất thành công', 'info'); }, [showToast]);

  const updateProfile = useCallback((data) => {
    setAccounts(prev => prev.map(a => a.id === data.id ? { ...a, ...data } : a));
    setUser(prev => prev ? { ...prev, ...data } : prev);
    showToast('Cập nhật thông tin thành công!', 'success');
  }, [showToast]);

  // ─── Admin accounts ───────────────────────────────────────────────────────
  const approveAccount = useCallback((id) => { setAccounts(prev => prev.map(a => a.id === id ? { ...a, status: 'active' } : a)); showToast('Đã phê duyệt tài khoản!', 'success'); }, [showToast]);
  const rejectAccount = useCallback((id) => { setAccounts(prev => prev.map(a => a.id === id ? { ...a, status: 'rejected' } : a)); showToast('Đã từ chối tài khoản', 'error'); }, [showToast]);
  const toggleAccountStatus = useCallback((id) => { setAccounts(prev => prev.map(a => a.id === id ? { ...a, status: a.status === 'active' ? 'inactive' : 'active' } : a)); showToast('Đã cập nhật trạng thái tài khoản', 'success'); }, [showToast]);
  const deleteAccount = useCallback((id) => { setAccounts(prev => prev.filter(a => a.id !== id)); showToast('Đã xóa tài khoản', 'info'); }, [showToast]);
  const createAccountByAdmin = useCallback((data) => {
    if (accounts.find(u => u.username === data.username)) return { success: false, error: 'Tên đăng nhập đã tồn tại' };
    const newUser = { id: Date.now(), ...data, status: 'active', created: new Date().toISOString().split('T')[0], householdSize: null, address: '', avatarUrl: '' };
    setAccounts(prev => [...prev, newUser]);
    showToast('Đã tạo tài khoản mới!', 'success');
    return { success: true };
  }, [accounts, showToast]);

  // ─── Contributions (legacy) ────────────────────────────────────────────────
  const addContribution = useCallback((data) => {
    setContributions(prev => [{ ...data, id: Date.now(), status: 'pending', date: new Date().toISOString().split('T')[0] }, ...prev]);
    showToast('Đóng góp đã được gửi! Chờ xác minh.', 'success');
  }, [showToast]);

  const updateContributionStatus = useCallback((id, status, note = '') => {
    setContributions(prev => prev.map(c => c.id === id ? { ...c, status, financeNote: note } : c));
    showToast(status === 'verified' ? 'Đã xác minh đóng góp!' : 'Đã từ chối đóng góp', status === 'verified' ? 'success' : 'error');
  }, [showToast]);

  // ─── BANK ACCOUNTS (admin CRUD) ────────────────────────────────────────────
  const addBankAccount = useCallback((data) => {
    setBankAccounts(prev => [...prev, { ...data, id: Date.now(), active: true }]);
    showToast('Đã thêm tài khoản ngân hàng!', 'success');
  }, [showToast]);

  const updateBankAccount = useCallback((id, data) => {
    setBankAccounts(prev => prev.map(b => b.id === id ? { ...b, ...data } : b));
    showToast('Đã cập nhật tài khoản ngân hàng!', 'success');
  }, [showToast]);

  const toggleBankAccount = useCallback((id) => {
    setBankAccounts(prev => prev.map(b => b.id === id ? { ...b, active: !b.active } : b));
    showToast('Đã thay đổi trạng thái tài khoản', 'info');
  }, [showToast]);

  const deleteBankAccount = useCallback((id) => {
    setBankAccounts(prev => prev.filter(b => b.id !== id));
    showToast('Đã xóa tài khoản ngân hàng', 'info');
  }, [showToast]);

  // ─── DROP POINTS (admin CRUD) ──────────────────────────────────────────────
  const addDropPoint = useCallback((data) => {
    setDropPoints(prev => [...prev, { ...data, id: Date.now(), active: true }]);
    showToast('Đã thêm điểm nhận hàng!', 'success');
  }, [showToast]);

  const updateDropPoint = useCallback((id, data) => {
    setDropPoints(prev => prev.map(d => d.id === id ? { ...d, ...data } : d));
    showToast('Đã cập nhật điểm nhận hàng!', 'success');
  }, [showToast]);

  const deleteDropPoint = useCallback((id) => {
    setDropPoints(prev => prev.filter(d => d.id !== id));
    showToast('Đã xóa điểm nhận hàng', 'info');
  }, [showToast]);

  // ─── CASH POINTS (admin CRUD) ──────────────────────────────────────────────
  const addCashPoint = useCallback((data) => {
    setCashPoints(prev => [...prev, { ...data, id: Date.now(), active: true }]);
    showToast('Đã thêm điểm nhận tiền mặt!', 'success');
  }, [showToast]);

  const updateCashPoint = useCallback((id, data) => {
    setCashPoints(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
    showToast('Đã cập nhật điểm nhận tiền mặt!', 'success');
  }, [showToast]);

  const deleteCashPoint = useCallback((id) => {
    setCashPoints(prev => prev.filter(c => c.id !== id));
    showToast('Đã xóa điểm nhận tiền mặt', 'info');
  }, [showToast]);

  // ─── NEEDED ITEMS (admin CRUD) ─────────────────────────────────────────────
  const addNeededItem = useCallback((data) => {
    setNeededItems(prev => [...prev, { ...data, id: Date.now(), receivedQty: 0 }]);
    showToast('Đã thêm vật phẩm cần thiết!', 'success');
  }, [showToast]);

  const updateNeededItem = useCallback((id, data) => {
    setNeededItems(prev => prev.map(n => n.id === id ? { ...n, ...data } : n));
    showToast('Đã cập nhật vật phẩm!', 'success');
  }, [showToast]);

  const deleteNeededItem = useCallback((id) => {
    setNeededItems(prev => prev.filter(n => n.id !== id));
    showToast('Đã xóa vật phẩm', 'info');
  }, [showToast]);

  // ─── BANK DONATIONS (donor submits, admin verifies) ────────────────────────
  const submitBankDonation = useCallback((data) => {
    const newId = Date.now();
    setBankDonations(prev => [...prev, { ...data, id: newId, status: 'PENDING', createdAt: new Date().toISOString().split('T')[0], verifiedAt: '', verifiedBy: '', rejectReason: '' }]);
    showToast('Đã gửi minh chứng chuyển khoản! Chờ admin xác minh.', 'success');
    return newId;
  }, [showToast]);

  const verifyBankDonation = useCallback((id, verifierName) => {
    setBankDonations(prev => prev.map(d => d.id === id ? { ...d, status: 'VERIFIED', verifiedAt: new Date().toISOString().split('T')[0], verifiedBy: verifierName } : d));
    // Issue receipt
    const donation = bankDonations.find(d => d.id === id);
    if (donation) {
      const receiptNo = `RH-REC-${String(donationReceipts.length + 1).padStart(3, '0')}`;
      setDonationReceipts(prev => [...prev, { id: Date.now(), receiptNo, campaignId: donation.campaignId, campaign: donation.campaign, userId: donation.userId, userName: donation.userName, type: 'bank', amount: donation.amount, itemName: '', quantity: 0, unit: '', issuedAt: new Date().toISOString().split('T')[0], issuedBy: verifierName, status: 'issued' }]);
      // Update campaign raised
      setCampaigns(prev => prev.map(c => c.id === donation.campaignId ? { ...c, raised: c.raised + donation.amount } : c));
    }
    showToast('Đã xác minh chuyển khoản và cấp biên nhận!', 'success');
  }, [bankDonations, donationReceipts, showToast]);

  const rejectBankDonation = useCallback((id, reason) => {
    setBankDonations(prev => prev.map(d => d.id === id ? { ...d, status: 'REJECTED', rejectReason: reason } : d));
    showToast('Đã từ chối minh chứng chuyển khoản', 'error');
  }, [showToast]);

  // ─── ITEM DONATIONS (donor registers, admin confirms receipt) ──────────────
  const submitItemDonation = useCallback((data) => {
    const newId = Date.now();
    const now = new Date().toLocaleString('vi-VN');
    setItemDonations(prev => [...prev, { ...data, id: newId, status: 'REGISTERED', createdAt: new Date().toISOString().split('T')[0], timeline: [{ status: 'REGISTERED', time: now }] }]);
    showToast('Đã đăng ký đóng góp hiện vật!', 'success');
    return newId;
  }, [showToast]);

  const updateItemDonationStatus = useCallback((id, status) => {
    const now = new Date().toLocaleString('vi-VN');
    setItemDonations(prev => prev.map(d => d.id === id ? { ...d, status, timeline: [...(d.timeline || []), { status, time: now }] } : d));
    if (status === 'RECEIVED') {
      // Update needed item received qty
      const donation = itemDonations.find(d => d.id === id);
      if (donation) {
        setNeededItems(prev => prev.map(n => n.id === donation.neededItemId ? { ...n, receivedQty: n.receivedQty + donation.quantity } : n));
      }
    }
    if (status === 'VERIFIED') {
      // Issue receipt for item donation
      const donation = itemDonations.find(d => d.id === id);
      if (donation) {
        const receiptNo = `RH-REC-${String(donationReceipts.length + 1).padStart(3, '0')}`;
        setDonationReceipts(prev => [...prev, { id: Date.now(), receiptNo, campaignId: donation.campaignId, campaign: donation.campaign, userId: donation.userId, userName: donation.userName, type: 'item', amount: 0, itemName: donation.itemName, quantity: donation.quantity, unit: donation.unit, issuedAt: new Date().toISOString().split('T')[0], issuedBy: 'Admin', status: 'issued' }]);
      }
    }
    const msgs = { SHIPPING: 'Đã đánh dấu đang vận chuyển', RECEIVED: 'Đã nhận hàng vào kho!', VERIFIED: 'Đã xác minh và cấp biên nhận!' };
    showToast(msgs[status] || 'Đã cập nhật', 'success');
  }, [itemDonations, donationReceipts, showToast]);

  // ─── CASH APPOINTMENTS ─────────────────────────────────────────────────────
  const bookCashAppointment = useCallback((data) => {
    const newId = Date.now();
    const now = new Date().toLocaleString('vi-VN');
    setCashAppointments(prev => [...prev, { ...data, id: newId, status: 'BOOKED', createdAt: new Date().toISOString().split('T')[0], receiptNo: '', confirmedAt: '', timeline: [{ status: 'BOOKED', time: now }] }]);
    showToast('Đã đặt lịch hẹn đóng góp tiền mặt!', 'success');
    return newId;
  }, [showToast]);

  const updateCashAppointmentStatus = useCallback((id, status) => {
    const now = new Date().toLocaleString('vi-VN');
    setCashAppointments(prev => prev.map(a => a.id === id ? { ...a, status, timeline: [...(a.timeline || []), { status, time: now }], confirmedAt: status === 'CONFIRMED' ? new Date().toISOString().split('T')[0] : a.confirmedAt } : a));
    if (status === 'CONFIRMED') {
      const appt = cashAppointments.find(a => a.id === id);
      if (appt) {
        const receiptNo = `RH-REC-${String(donationReceipts.length + 1).padStart(3, '0')}`;
        setCashAppointments(prev => prev.map(a => a.id === id ? { ...a, receiptNo } : a));
        setDonationReceipts(prev => [...prev, { id: Date.now(), receiptNo, campaignId: appt.campaignId, campaign: appt.campaign, userId: appt.userId, userName: appt.userName, type: 'cash', amount: appt.amount, itemName: '', quantity: 0, unit: '', issuedAt: new Date().toISOString().split('T')[0], issuedBy: 'Admin', status: 'issued' }]);
        setCampaigns(prev => prev.map(c => c.id === appt.campaignId ? { ...c, raised: c.raised + appt.amount } : c));
      }
    }
    if (status === 'CANCELLED') {
      showToast('Đã huỷ lịch hẹn', 'error');
    } else {
      showToast('Đã cập nhật lịch hẹn!', 'success');
    }
  }, [cashAppointments, donationReceipts, showToast]);

  const cancelCashAppointment = useCallback((id) => {
    const now = new Date().toLocaleString('vi-VN');
    setCashAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'CANCELLED', timeline: [...(a.timeline || []), { status: 'CANCELLED', time: now }] } : a));
    showToast('Đã huỷ lịch hẹn', 'info');
  }, [showToast]);

  // ─── NEEDS ────────────────────────────────────────────────────────────────
  const addNeed = useCallback(async (data) => {
    if (API_ENABLED) {
      const res = await supportRequestService.create({
        itemName: data.items, quantity: data.quantity, unit: '',
        area: data.area, urgency: (data.urgency || 'medium').toUpperCase(),
        reason: data.notes, householdCount: parseInt(data.households) || 1,
      });
      if (res.success) { showToast('Yêu cầu hỗ trợ đã được gửi!', 'success'); return; }
    }
    setNeeds(prev => [{ ...data, id: Date.now(), status: 'pending', date: new Date().toISOString().split('T')[0], managedBy: null, approvedAt: '', warehouseNote: '' }, ...prev]);
    showToast('Yêu cầu hỗ trợ đã được gửi!', 'success');
  }, [showToast]);

  const updateNeedStatus = useCallback((id, status, managedBy = null, extra = {}) => {
    setNeeds(prev => prev.map(n => n.id === id ? { ...n, status, managedBy: managedBy || n.managedBy, approvedAt: status === 'approved' ? new Date().toISOString().split('T')[0] : n.approvedAt, ...extra } : n));
    const msgs = { verified: 'Đã xác minh!', approved: 'Đã phê duyệt!', rejected: 'Đã từ chối', warehouse_ready: 'Kho sẵn sàng!', in_transit: 'Đang vận chuyển!', delivered: 'Đã giao hàng!' };
    showToast(msgs[status] || 'Đã cập nhật!', status === 'rejected' ? 'error' : 'success');
  }, [showToast]);

  // ─── Campaigns ───────────────────────────────────────────────────────────
  const addCampaign = useCallback((data) => {
    const ICON_MAP = { 'Lũ lụt': '🌊', 'Bão': '🌀', 'Sạt lở đất': '⛰️', 'Hạn hán': '☀️', 'Động đất': '🌍', 'Lốc xoáy': '🌪️' };
    const newCampaign = {
      ...data,
      id: Date.now(),
      raised: 0,
      image: ICON_MAP[data.type] || '🆘',
      status: 'active',
      households: parseInt(data.households) || 0,
      volunteers: 0,
      target: parseInt(data.target) || 0,
      description: data.description || '',
    };
    setCampaigns(prev => [newCampaign, ...prev]);
    showToast('Chiến dịch đã được tạo thành công!', 'success');
  }, [showToast]);

  const updateCampaignStatus = useCallback((id, status) => {
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    showToast('Đã cập nhật trạng thái chiến dịch!', 'success');
  }, [showToast]);

  // ─── Disasters ────────────────────────────────────────────────────────────
  const addDisaster = useCallback((data) => { setDisasters(prev => [{ ...data, id: Date.now(), status: 'active', createdAt: new Date().toISOString().split('T')[0] }, ...prev]); showToast('Đã ghi nhận báo cáo thiên tai!', 'success'); }, [showToast]);
  const updateDisaster = useCallback((id, data) => { setDisasters(prev => prev.map(d => d.id === id ? { ...d, ...data } : d)); showToast('Đã cập nhật!', 'success'); }, [showToast]);
  const deleteDisaster = useCallback((id) => { setDisasters(prev => prev.filter(d => d.id !== id)); showToast('Đã xóa', 'info'); }, [showToast]);

  // ─── Inventory ────────────────────────────────────────────────────────────
  const addInventoryItem = useCallback((data) => { setInventory(prev => [...prev, { ...data, id: Date.now() }]); showToast('Đã thêm mặt hàng vào kho!', 'success'); }, [showToast]);
  const restockInventoryItem = useCallback((id, quantity) => { setInventory(prev => prev.map(item => item.id === id ? { ...item, quantity: item.quantity + parseInt(quantity) } : item)); showToast('Đã nhập thêm hàng!', 'success'); }, [showToast]);

  // ─── Transports ───────────────────────────────────────────────────────────
  const updateTransportStatus = useCallback((id, status, notes = '') => {
    setTransports(prev => prev.map(t => t.id === id ? { ...t, status, notes: notes || t.notes, deliveredAt: status === 'delivered' ? new Date().toISOString() : t.deliveredAt } : t));
    showToast(status === 'delivered' ? 'Đã xác nhận trao hàng!' : 'Đã cập nhật!', 'success');
  }, [showToast]);

  // ─── VOLUNTEER GROUPS (simplified) ─────────────────────────────────────────
  const createVolunteerGroup = useCallback((data) => {
    const newGroup = {
      ...data, id: Date.now(),
      memberIds: [data.leaderId].filter(Boolean),
      status: 'pending',
      approvedByAdmin: false,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setVolunteerGroups(prev => [...prev, newGroup]);
    showToast('Đã gửi yêu cầu tạo nhóm! Chờ admin duyệt.', 'success');
    return newGroup;
  }, [showToast]);

  const approveVolunteerGroup = useCallback((id) => {
    setVolunteerGroups(prev => prev.map(g => g.id === id ? { ...g, approvedByAdmin: true, status: 'recruiting' } : g));
    showToast('Đã duyệt nhóm tình nguyện!', 'success');
  }, [showToast]);

  const rejectVolunteerGroup = useCallback((id) => {
    setVolunteerGroups(prev => prev.map(g => g.id === id ? { ...g, approvedByAdmin: false, status: 'rejected' } : g));
    showToast('Đã từ chối nhóm', 'error');
  }, [showToast]);

  const updateGroupStatus = useCallback((id, status) => {
    setVolunteerGroups(prev => prev.map(g => g.id === id ? { ...g, status } : g));
    showToast('Đã cập nhật trạng thái nhóm!', 'success');
  }, [showToast]);

  const applyToGroup = useCallback((groupId, userId, userName) => {
    const group = volunteerGroups.find(g => g.id === groupId);
    if (!group) return false;
    if (group.memberIds && group.memberIds.includes(userId)) { showToast('Bạn đã là thành viên nhóm này!', 'error'); return false; }
    const existing = groupApplications.find(a => a.groupId === groupId && a.userId === userId && a.status === 'pending');
    if (existing) { showToast('Bạn đã nộp đơn rồi! Chờ leader duyệt.', 'error'); return false; }
    if (group.memberIds && group.memberIds.length >= group.maxMembers) { showToast('Nhóm đã đủ thành viên!', 'error'); return false; }
    setGroupApplications(prev => [...prev, { id: Date.now(), groupId, userId, userName, status: 'pending', appliedAt: new Date().toISOString().split('T')[0] }]);
    showToast('Đã gửi đơn tham gia nhóm! Chờ leader xét duyệt.', 'success');
    return true;
  }, [volunteerGroups, groupApplications, showToast]);

  const approveGroupApplication = useCallback((appId) => {
    const app = groupApplications.find(a => a.id === appId);
    if (!app) return;
    const group = volunteerGroups.find(g => g.id === app.groupId);
    if (group && group.memberIds && group.memberIds.length >= group.maxMembers) { showToast('Nhóm đã đủ người!', 'error'); return; }
    setGroupApplications(prev => prev.map(a => a.id === appId ? { ...a, status: 'approved' } : a));
    setVolunteerGroups(prev => prev.map(g => g.id === app.groupId ? { ...g, memberIds: [...(g.memberIds || []), app.userId] } : g));
    showToast('Đã duyệt đơn tham gia nhóm!', 'success');
  }, [groupApplications, volunteerGroups, showToast]);

  const rejectGroupApplication = useCallback((appId) => {
    setGroupApplications(prev => prev.map(a => a.id === appId ? { ...a, status: 'rejected' } : a));
    showToast('Đã từ chối đơn tham gia nhóm', 'error');
  }, [showToast]);

  const leaveGroup = useCallback((groupId, userId) => {
    const group = volunteerGroups.find(g => g.id === groupId);
    if (!group) return;
    if (group.leaderId === userId) { showToast('Leader phải chuyển quyền trước khi rời nhóm!', 'error'); return; }
    setVolunteerGroups(prev => prev.map(g => g.id === groupId ? { ...g, memberIds: (g.memberIds || []).filter(id => id !== userId) } : g));
    showToast('Đã rời nhóm thành công', 'info');
  }, [volunteerGroups, showToast]);

  const transferLeadership = useCallback((groupId, newLeaderId, newLeaderName, newLeaderPhone) => {
    setVolunteerGroups(prev => prev.map(g => g.id === groupId ? { ...g, leaderId: newLeaderId, leader: newLeaderName, leaderPhone: newLeaderPhone } : g));
    showToast('Đã chuyển quyền leader thành công!', 'success');
  }, [showToast]);

  // ─── MISSIONS (simplified) ─────────────────────────────────────────────────
  const createMission = useCallback((data) => {
    const newMission = {
      ...data, id: Date.now(),
      code: `MV-${String(missions.length + 1).padStart(3, '0')}`,
      status: 'OPEN', assignedGroupId: null, assignedGroupName: null,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setMissions(prev => [...prev, newMission]);
    showToast('Đã tạo nhiệm vụ cứu trợ mới!', 'success');
    return newMission;
  }, [missions, showToast]);

  const updateMissionStatus = useCallback((id, status) => {
    setMissions(prev => prev.map(m => m.id === id ? { ...m, status } : m));
    const msgs = { OPEN: 'Mở lại nhiệm vụ', ASSIGNED: 'Đã giao nhiệm vụ!', IN_PROGRESS: 'Đang thực hiện!', COMPLETED: 'Hoàn thành!', CANCELLED: 'Đã huỷ nhiệm vụ' };
    showToast(msgs[status] || 'Đã cập nhật!', status === 'CANCELLED' ? 'error' : 'success');
  }, [showToast]);

  const applyMission = useCallback((missionId, groupId, groupName) => {
    const existing = missionApplications.find(a => a.missionId === missionId && a.groupId === groupId);
    if (existing) { showToast('Nhóm bạn đã ứng tuyển nhiệm vụ này rồi!', 'error'); return false; }
    setMissionApplications(prev => [...prev, { id: Date.now(), missionId, groupId, groupName, status: 'pending', appliedAt: new Date().toISOString().split('T')[0] }]);
    showToast('Đã ứng tuyển nhiệm vụ! Chờ admin phê duyệt.', 'success');
    return true;
  }, [missionApplications, showToast]);

  const assignMission = useCallback((missionId, groupId, groupName) => {
    setMissions(prev => prev.map(m => m.id === missionId ? { ...m, status: 'ASSIGNED', assignedGroupId: groupId, assignedGroupName: groupName } : m));
    setMissionApplications(prev => prev.map(a => a.missionId === missionId ? { ...a, status: a.groupId === groupId ? 'approved' : 'rejected' } : a));
    showToast(`Đã giao nhiệm vụ cho "${groupName}"!`, 'success');
  }, [showToast]);

  const cancelMissionAssignment = useCallback((missionId) => {
    setMissions(prev => prev.map(m => m.id === missionId ? { ...m, status: 'OPEN', assignedGroupId: null, assignedGroupName: null } : m));
    showToast('Đã thu hồi nhiệm vụ', 'info');
  }, [showToast]);

  // ─── MISSION REPORTS (simplified, no scoring) ──────────────────────────────
  const submitMissionReport = useCallback((data) => {
    setMissionReports(prev => [...prev, { ...data, id: Date.now(), submittedAt: new Date().toISOString().split('T')[0], reviewStatus: 'pending', reviewedBy: '', reviewedAt: '' }]);
    showToast('Báo cáo đã được gửi! Chờ admin xem xét.', 'success');
  }, [showToast]);

  const reviewMissionReport = useCallback((id, reviewer, action) => {
    setMissionReports(prev => prev.map(r => r.id === id ? { ...r, reviewStatus: action, reviewedBy: reviewer, reviewedAt: new Date().toISOString().split('T')[0] } : r));
    showToast(action === 'reviewed' ? 'Đã duyệt báo cáo!' : 'Đã từ chối báo cáo', action === 'reviewed' ? 'success' : 'error');
  }, [showToast]);

  // ─── VOL PROFILE (simplified) ──────────────────────────────────────────────
  const updateVolProfile = useCallback((userId, data) => {
    setVolProfiles(prev => {
      const exists = prev.find(p => p.userId === userId);
      if (exists) return prev.map(p => p.userId === userId ? { ...p, ...data } : p);
      return [...prev, { userId, skills: [], experience: '', vehicles: [], equipment: [], preferredArea: '', ...data }];
    });
    showToast('Đã cập nhật hồ sơ tình nguyện viên!', 'success');
  }, [showToast]);

  // ─── COMPLAINTS ───────────────────────────────────────────────────────────
  const addComplaint = useCallback((data) => {
    setComplaints(prev => {
      const nextNum = prev.length + 1;
      return [{ ...data, id: Date.now(), seqNo: `KN-${String(nextNum).padStart(3, '0')}`, status: 'pending', createdAt: new Date().toISOString().split('T')[0], adminReply: '', repliedAt: '', closedAt: '', completionPct: 0 }, ...prev];
    });
    showToast('Phản ánh đã được gửi! Chúng tôi sẽ phản hồi trong 24 giờ.', 'success');
  }, [showToast]);

  const replyComplaint = useCallback((id, reply, completionPct = 80) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: 'replied', adminReply: reply, repliedAt: new Date().toISOString().split('T')[0], completionPct } : c));
    showToast('Đã gửi phản hồi!', 'success');
  }, [showToast]);

  const closeComplaint = useCallback((id) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: 'closed', closedAt: new Date().toISOString().split('T')[0], completionPct: 100 } : c));
    showToast('Đã đóng khiếu nại', 'info');
  }, [showToast]);

  // ─── Misc ─────────────────────────────────────────────────────────────────
  const markNotificationRead = useCallback((id) => { setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n)); }, []);
  const formatCurrency = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

  // Generate transfer note: RH-[campaign_id]-[user_id]
  const generateTransferNote = useCallback((campaignId, userId) => {
    return `RH-${campaignId}-${userId}`;
  }, []);

  // Get donation history for a user (combines all types)
  const getDonationHistory = useCallback((userId) => {
    const bank = bankDonations.filter(d => d.userId === userId).map(d => ({ ...d, category: 'bank' }));
    const items = itemDonations.filter(d => d.userId === userId).map(d => ({ ...d, category: 'item' }));
    const cash = cashAppointments.filter(a => a.userId === userId).map(a => ({ ...a, category: 'cash' }));
    return [...bank, ...items, ...cash].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  }, [bankDonations, itemDonations, cashAppointments]);

  // ─── Restore session on mount ───────────────────────────────────────────
  useEffect(() => {
    if (API_ENABLED) {
      const savedUser = tokenManager.getUser();
      const token = tokenManager.get();
      if (savedUser && token) {
        setUser(savedUser);
      }
    }
  }, []);

  return (
    <AppContext.Provider value={{
      user, setUser, accounts, campaigns, setCampaigns, contributions, needs, inventory, setInventory,
      disasters, transports, setTransports, ledger, setLedger,
      // Donor module
      bankAccounts, dropPoints, cashPoints, neededItems,
      bankDonations, itemDonations, cashAppointments,
      donationReceipts, donationTracking,
      // Volunteer (simplified)
      volunteerGroups, groupApplications, missions, missionApplications, missionReports, volProfiles,
      complaints, notifications, toast, showToast,
      login, register, logout, updateProfile,
      approveAccount, rejectAccount, toggleAccountStatus, deleteAccount, createAccountByAdmin,
      addContribution, updateContributionStatus,
      addBankAccount, updateBankAccount, toggleBankAccount, deleteBankAccount,
      addDropPoint, updateDropPoint, deleteDropPoint,
      addCashPoint, updateCashPoint, deleteCashPoint,
      addNeededItem, updateNeededItem, deleteNeededItem,
      submitBankDonation, verifyBankDonation, rejectBankDonation,
      submitItemDonation, updateItemDonationStatus,
      bookCashAppointment, updateCashAppointmentStatus, cancelCashAppointment,
      addNeed, updateNeedStatus,
      addCampaign, updateCampaignStatus,
      addDisaster, updateDisaster, deleteDisaster,
      addInventoryItem, restockInventoryItem,
      updateTransportStatus,
      createVolunteerGroup, approveVolunteerGroup, rejectVolunteerGroup, updateGroupStatus,
      applyToGroup, approveGroupApplication, rejectGroupApplication,
      leaveGroup, transferLeadership,
      createMission, updateMissionStatus, applyMission, assignMission, cancelMissionAssignment,
      submitMissionReport, reviewMissionReport, updateVolProfile,
      addComplaint, replyComplaint, closeComplaint,
      markNotificationRead, formatCurrency, generateTransferNote, getDonationHistory,
    }}>
      {children}
    </AppContext.Provider>
  );
};
