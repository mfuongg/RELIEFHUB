-- ============================================================
--  ReliefHub – Seed Data
--  Chạy SAU khi import reliefhub_full.sql
--  Thêm dữ liệu mẫu cho campaigns, disasters, inventory,
--  donations, support_requests, deliveries, ledger, complaints
-- ============================================================

SET NAMES utf8mb4;

-- ─── Campaigns ─────────────────────────────────────────────
INSERT IGNORE INTO campaigns (id, title, description, target_amount, current_amount, start_date, end_date, status, area) VALUES
  (1, 'Cứu trợ lũ lụt miền Trung 2026', 'Hỗ trợ khẩn cấp cho người dân vùng lũ miền Trung – Quảng Bình, Hà Tĩnh', 500000000, 380000000, '2026-01-10', '2026-03-30', 'ACTIVE', 'Quảng Bình'),
  (2, 'Hỗ trợ bão số 5 Đà Nẵng', 'Khắc phục hậu quả bão số 5 tại Đà Nẵng – sửa chữa nhà cửa, hỗ trợ lương thực', 300000000, 210000000, '2026-02-01', '2026-04-15', 'ACTIVE', 'Đà Nẵng'),
  (3, 'Cứu trợ sạt lở đất Sơn La', 'Hỗ trợ tái thiết sau sạt lở đất nghiêm trọng tại Sơn La', 200000000, 200000000, '2025-11-01', '2025-12-31', 'COMPLETED', 'Sơn La'),
  (4, 'Hạn hán Tây Nguyên', 'Cung cấp nước sạch và lương thực cho vùng hạn hán Đắk Lắk', 150000000, 45000000, '2026-03-01', '2026-05-31', 'ACTIVE', 'Đắk Lắk');

-- ─── Disasters ─────────────────────────────────────────────
INSERT IGNORE INTO disasters (id, name, type, area, severity, description, occurred_at, status) VALUES
  (1, 'Lũ lụt miền Trung', 'Lũ lụt', 'Quảng Bình', 'HIGH', 'Mưa lớn diện rộng gây ngập lụt nghiêm trọng tại Quảng Bình, hàng ngàn hộ bị cô lập', '2026-01-08', 'ACTIVE'),
  (2, 'Bão số 5 Đà Nẵng', 'Bão', 'Đà Nẵng', 'CRITICAL', 'Bão đổ bộ trực tiếp Đà Nẵng, gió giật cấp 14, nhiều nhà tốc mái', '2026-01-28', 'ACTIVE'),
  (3, 'Sạt lở đất Sơn La', 'Sạt lở đất', 'Sơn La', 'HIGH', 'Sạt lở đất lớn tại huyện Mộc Châu, 4 hộ bị chôn vùi', '2025-10-30', 'RESOLVED'),
  (4, 'Hạn hán Tây Nguyên', 'Hạn hán', 'Đắk Lắk', 'MEDIUM', 'Hạn hán kéo dài, nguồn nước sinh hoạt cạn kiệt', '2026-02-20', 'ACTIVE');

-- ─── Inventory ─────────────────────────────────────────────
INSERT IGNORE INTO inventory (id, item_name, category, quantity, unit, min_stock, warehouse_id, description) VALUES
  (1, 'Gạo ST25', 'Lương thực', 2000, 'kg', 500, 1, 'Gạo chất lượng cao cho người dân vùng lũ'),
  (2, 'Mì gói Hảo Hảo', 'Lương thực', 300, 'thùng', 100, 1, 'Mì ăn liền đóng thùng 24 gói'),
  (3, 'Nước khoáng Lavie', 'Nước uống', 500, 'thùng', 200, 1, 'Nước uống đóng chai 500ml, 24 chai/thùng'),
  (4, 'Áo phao cứu sinh', 'Trang bị', 150, 'cái', 50, 2, 'Áo phao cứu sinh người lớn'),
  (5, 'Chăn màn', 'Đồ dùng', 200, 'bộ', 100, 2, 'Chăn màn giữ ấm cho người dân'),
  (6, 'Thuốc men cơ bản', 'Y tế', 50, 'hộp', 30, 3, 'Paracetamol, oresol, cồn sát trùng'),
  (7, 'Gạo ST25', 'Lương thực', 800, 'kg', 200, 3, 'Gạo tại kho Đà Nẵng'),
  (8, 'Mì gói Hảo Hảo', 'Lương thực', 150, 'thùng', 50, 3, 'Mì gói tại kho Đà Nẵng');

-- ─── Donations ─────────────────────────────────────────────
INSERT IGNORE INTO donations (id, user_id, campaign_id, amount, message, is_anonymous, status) VALUES
  (1, 2, 1, 50000000, 'Hỗ trợ người dân vùng lũ', 0, 'CONFIRMED'),
  (2, 2, 2, 10000000, 'Gạo 500kg, mì gói 200 thùng', 0, 'CONFIRMED'),
  (3, 3, 1, 100000000, 'Tập đoàn XYZ đồng hành cùng người dân', 0, 'CONFIRMED'),
  (4, 3, 3, 30000000, 'Hỗ trợ tái thiết', 0, 'CONFIRMED'),
  (5, 2, 4, 5000000, 'Hỗ trợ nước sạch', 0, 'PENDING');

-- ─── Support Requests ──────────────────────────────────────
INSERT IGNORE INTO support_requests (id, citizen_id, campaign_id, request_code, item_name, quantity, unit, area, urgency, reason, household_count, status) VALUES
  (1, 5, 1, 'REQ-001', 'Gạo, Nước uống, Thuốc men', 50, 'kg', 'Quảng Bình', 'HIGH', 'Lũ lụt cô lập 5 ngày, cần lương thực khẩn cấp', 5, 'VERIFIED'),
  (2, 5, 1, 'REQ-002', 'Chăn màn, Áo phao', 10, 'bộ', 'Quảng Bình', 'MEDIUM', 'Thiếu đồ giữ ấm và trang bị an toàn', 3, 'PENDING'),
  (3, 6, 2, 'REQ-003', 'Mì gói, Nước uống', 30, 'thùng', 'Đà Nẵng', 'CRITICAL', 'Bão tốc mái nhà, mất toàn bộ lương thực', 2, 'DELIVERED'),
  (4, 6, 4, 'REQ-004', 'Nước sạch', 20, 'thùng', 'Đắk Lắk', 'HIGH', 'Nguồn nước sinh hoạt cạn kiệt', 4, 'APPROVED');

-- ─── Deliveries ────────────────────────────────────────────
INSERT IGNORE INTO deliveries (id, delivery_code, request_id, campaign_id, driver_id, vehicle_type, license_plate, origin, destination, depart_at, status, note) VALUES
  (1, 'DLV-001', 3, 2, 6, 'Xe tải 1.5T', '51C-12345', 'Kho Đà Nẵng', 'Phường Hòa Khánh, Đà Nẵng', '2026-02-05 07:00', 'DELIVERED', 'Đã giao đủ 30 thùng mì và nước'),
  (2, 'DLV-002', 1, 1, 6, 'Xe tải 2.5T', '51C-67890', 'Kho Hà Nội', 'Xã Phúc Trạch, Quảng Bình', '2026-01-12 06:00', 'IN_TRANSIT', 'Đang trên quốc lộ 1A'),
  (3, 'DLV-003', 4, 4, 6, 'Xe tải 1.5T', '51C-11111', 'Kho TP.HCM', 'Huyện Cư Mgar, Đắk Lắk', NULL, 'SCHEDULED', 'Chờ xuất kho');

-- ─── Ledger ────────────────────────────────────────────────
INSERT IGNORE INTO ledger (id, campaign_id, type, amount, description, reference_type, reference_id) VALUES
  (1, 1, 'INCOME', 50000000, 'Đóng góp tiền mặt từ Trần Thị Hoa', 'DONATION', 1),
  (2, 1, 'INCOME', 100000000, 'Đóng góp từ Tập đoàn XYZ', 'DONATION', 3),
  (3, 1, 'EXPENSE', 30000000, 'Mua gạo ST25 – 1000kg', 'PURCHASE', NULL),
  (4, 1, 'EXPENSE', 15000000, 'Chi phí vận chuyển', 'DELIVERY', 2),
  (5, 2, 'INCOME', 10000000, 'Đóng góp hiện vật từ Trần Thị Hoa', 'DONATION', 2),
  (6, 2, 'EXPENSE', 5000000, 'Chi phí xăng dầu vận chuyển', 'DELIVERY', 1);

-- ─── Volunteer Groups ──────────────────────────────────────
INSERT IGNORE INTO volunteer_groups (id, name, leader_id, area, description, status) VALUES
  (1, 'Nhóm cứu trợ miền Trung', 6, 'Quảng Bình', 'Nhóm tình nguyện vận chuyển và phân phát hàng cứu trợ tại Quảng Bình', 'ACTIVE'),
  (2, 'Nhóm bão Đà Nẵng', 6, 'Đà Nẵng', 'Hỗ trợ dọn dẹp và sửa chữa nhà cửa sau bão số 5', 'ACTIVE');

-- ─── Complaints ────────────────────────────────────────────
INSERT IGNORE INTO complaints (id, complaint_code, sender_id, sender_name, sender_role, type, subject, content, contact_info, status, admin_reply, progress) VALUES
  (1, 'CMP-001', 2, 'Trần Thị Hoa', 'donor', 'Khiếu nại', 'Đóng góp của tôi chưa được xác minh sau 5 ngày', 'Tôi đã đóng góp 10 triệu ngày 08/02 nhưng đến nay chưa thấy cập nhật', '0912345678', 'REPLIED', 'Chúng tôi đã kiểm tra và xác minh đóng góp của bạn. Xin lỗi vì sự chậm trễ.', 100),
  (2, 'CMP-002', 3, 'Nguyễn Văn An', 'donor', 'Góp ý', 'Nên có thông báo khi đóng góp được duyệt', 'Đề xuất gửi email/thông báo tự động khi xác minh', '0923456789', 'CLOSED', 'Cảm ơn góp ý, chúng tôi sẽ bổ sung tính năng này.', 100);

-- ─── Notifications ─────────────────────────────────────────
INSERT IGNORE INTO notifications (id, user_id, title, body, type, is_read, link) VALUES
  (1, 1, 'Đóng góp mới', 'Có đóng góp mới cần xác minh từ Trần Thị Hoa', 'info', 0, '/dashboard/finance/verify'),
  (2, 1, 'Kho sắp hết', 'Kho gạo tại Đà Nẵng sắp hết (còn 800kg)', 'warning', 0, '/dashboard/admin/inventory'),
  (3, 2, 'Đóng góp được xác minh', 'Đóng góp 50 triệu của bạn đã được xác minh', 'success', 0, '/dashboard/donor/history'),
  (4, 5, 'Yêu cầu đã xác minh', 'Yêu cầu hỗ trợ REQ-001 đã được xác minh', 'info', 1, '/dashboard/citizen/receipt');

-- ─── Update campaign current_amount from confirmed donations ─
UPDATE campaigns c SET current_amount = (
  SELECT COALESCE(SUM(d.amount), 0) FROM donations d
  WHERE d.campaign_id = c.id AND d.status = 'CONFIRMED'
) WHERE c.id IN (1,2,3,4);

-- ─── Verification ──────────────────────────────────────────
SELECT '=== SEED DATA SUMMARY ===' AS info;
SELECT CONCAT('Campaigns: ', COUNT(*)) AS info FROM campaigns;
SELECT CONCAT('Disasters: ', COUNT(*)) AS info FROM disasters;
SELECT CONCAT('Inventory items: ', COUNT(*)) AS info FROM inventory;
SELECT CONCAT('Donations: ', COUNT(*)) AS info FROM donations;
SELECT CONCAT('Support requests: ', COUNT(*)) AS info FROM support_requests;
SELECT CONCAT('Deliveries: ', COUNT(*)) AS info FROM deliveries;
SELECT CONCAT('Ledger entries: ', COUNT(*)) AS info FROM ledger;
SELECT CONCAT('Volunteer groups: ', COUNT(*)) AS info FROM volunteer_groups;
SELECT CONCAT('Complaints: ', COUNT(*)) AS info FROM complaints;
SELECT CONCAT('Notifications: ', COUNT(*)) AS info FROM notifications;
