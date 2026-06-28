-- ============================================================
--  ReliefHub – Complete MySQL Schema  v6
--  Generated : 2026-06-28
--  Encoding  : utf8mb4
--  NOTE: Import via: source /path/to/reliefhub_full.sql
--  or paste entire file into MySQL Workbench Query tab → Execute All
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';

-- ============================================================
-- 1. ROLES & PERMISSIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS roles (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(50)  NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO roles (name, description) VALUES
  ('admin',     'Quản trị viên hệ thống'),
  ('donor',     'Nhà tài trợ / Người quyên góp'),
  ('finance',   'Nhân viên tài chính'),
  ('local',     'Cán bộ địa phương'),
  ('citizen',   'Người dân / Hộ gia đình'),
  ('volunteer', 'Tình nguyện viên');

CREATE TABLE IF NOT EXISTS permissions (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS role_permissions (
    role_id       INT NOT NULL,
    permission_id INT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id)       REFERENCES roles(id)       ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 2. USERS
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
    id          BIGINT       AUTO_INCREMENT PRIMARY KEY,
    full_name   VARCHAR(255),
    username    VARCHAR(100) NOT NULL UNIQUE,
    email       VARCHAR(255) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL COMMENT 'BCrypt hash in production',
    phone       VARCHAR(20),
    avatar_url  TEXT,
    status      ENUM('ACTIVE','INACTIVE','BANNED') NOT NULL DEFAULT 'ACTIVE',
    role_id     INT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL,
    INDEX idx_username (username),
    INDEX idx_email    (email),
    INDEX idx_role_id  (role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Default accounts (plain-text passwords – hash with BCrypt in production)
INSERT IGNORE INTO users (full_name, username, email, password, status, role_id) VALUES
  ('Administrator',    'admin',      'admin@reliefhub.com',      'admin123',   'ACTIVE', (SELECT id FROM roles WHERE name='admin')),
  ('Nguyễn Minh Đức', 'donor01',    'donor01@reliefhub.com',    'donor123',   'ACTIVE', (SELECT id FROM roles WHERE name='donor')),
  ('Trần Thị Lan',    'finance01',  'finance01@reliefhub.com',  'fin123',     'ACTIVE', (SELECT id FROM roles WHERE name='finance')),
  ('Lê Văn Hùng',     'local01',    'local01@reliefhub.com',    'local123',   'ACTIVE', (SELECT id FROM roles WHERE name='local')),
  ('Phạm Thị Hoa',    'citizen01',  'citizen01@reliefhub.com',  'citizen123', 'ACTIVE', (SELECT id FROM roles WHERE name='citizen')),
  ('Hoàng Văn Nam',   'volunteer01','volunteer01@reliefhub.com','vol123',     'ACTIVE', (SELECT id FROM roles WHERE name='volunteer'));

-- ============================================================
-- 3. AUTH SUPPORT
-- ============================================================

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id    BIGINT       NOT NULL,
    token      TEXT         NOT NULL,
    expires_at DATETIME     NOT NULL,
    revoked    TINYINT(1)   NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_rt_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS login_history (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id    BIGINT     NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    status     ENUM('SUCCESS','FAILED') DEFAULT 'SUCCESS',
    logged_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_lh_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id    BIGINT       NOT NULL,
    token      VARCHAR(255) NOT NULL UNIQUE,
    expires_at DATETIME     NOT NULL,
    used       TINYINT(1)   DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 4. PROFILES & ADDRESSES
-- ============================================================

CREATE TABLE IF NOT EXISTS profiles (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id    BIGINT NOT NULL UNIQUE,
    dob        DATE,
    gender     ENUM('MALE','FEMALE','OTHER'),
    bio        TEXT,
    occupation VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS addresses (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id    BIGINT NOT NULL,
    province   VARCHAR(100),
    district   VARCHAR(100),
    ward       VARCHAR(100),
    detail     VARCHAR(500),
    is_default TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_addr_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 5. CAMPAIGNS
-- ============================================================

CREATE TABLE IF NOT EXISTS campaign_categories (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    description TEXT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO campaign_categories (name) VALUES
  ('Thiên tai'),('Lũ lụt'),('Hỏa hoạn'),('Y tế'),('Giáo dục'),('Khác');

CREATE TABLE IF NOT EXISTS campaigns (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    title          VARCHAR(500) NOT NULL,
    description    TEXT,
    category_id    INT,
    target_amount  DECIMAL(18,2) DEFAULT 0,
    current_amount DECIMAL(18,2) DEFAULT 0,
    start_date     DATE,
    end_date       DATE,
    status         ENUM('DRAFT','ACTIVE','PAUSED','COMPLETED','CANCELLED') DEFAULT 'DRAFT',
    created_by     BIGINT,
    approved_by    BIGINT,
    thumbnail_url  TEXT,
    area           VARCHAR(255),
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES campaign_categories(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by)  REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_camp_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS campaign_images (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    campaign_id BIGINT NOT NULL,
    url         TEXT   NOT NULL,
    caption     VARCHAR(255),
    sort_order  INT DEFAULT 0,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS campaign_updates (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    campaign_id BIGINT NOT NULL,
    title       VARCHAR(500),
    content     TEXT,
    posted_by   BIGINT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
    FOREIGN KEY (posted_by)   REFERENCES users(id)     ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 6. DONATIONS & PAYMENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS donations (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id      BIGINT,
    campaign_id  BIGINT,
    amount       DECIMAL(18,2) NOT NULL DEFAULT 0,
    message      TEXT,
    is_anonymous TINYINT(1) DEFAULT 0,
    status       ENUM('PENDING','CONFIRMED','REFUNDED','CANCELLED') DEFAULT 'PENDING',
    donated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)     REFERENCES users(id)     ON DELETE SET NULL,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE SET NULL,
    INDEX idx_don_campaign (campaign_id),
    INDEX idx_don_user     (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS donation_items (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    donation_id BIGINT NOT NULL,
    item_name   VARCHAR(255),
    quantity    INT,
    unit        VARCHAR(50),
    note        TEXT,
    FOREIGN KEY (donation_id) REFERENCES donations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS payments (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    donation_id     BIGINT NOT NULL,
    method          ENUM('BANK_TRANSFER','MOMO','VNPAY','CASH','OTHER') DEFAULT 'BANK_TRANSFER',
    amount          DECIMAL(18,2) NOT NULL,
    status          ENUM('PENDING','SUCCESS','FAILED','REFUNDED') DEFAULT 'PENDING',
    transaction_ref VARCHAR(255),
    paid_at         DATETIME,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (donation_id) REFERENCES donations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS payment_transactions (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    payment_id    BIGINT NOT NULL,
    gateway_ref   VARCHAR(255),
    amount        DECIMAL(18,2),
    status        VARCHAR(50),
    response_data JSON,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS receipts (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    donation_id  BIGINT NOT NULL UNIQUE,
    receipt_code VARCHAR(100) NOT NULL UNIQUE,
    issued_at    DATETIME,
    pdf_url      TEXT,
    FOREIGN KEY (donation_id) REFERENCES donations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 7. BENEFICIARIES & SUPPORT REQUESTS (6-step flow)
-- ============================================================

CREATE TABLE IF NOT EXISTS beneficiaries (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id        BIGINT,
    household_size INT DEFAULT 1,
    vulnerability  VARCHAR(255),
    verified       TINYINT(1) DEFAULT 0,
    verified_by    BIGINT,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)     REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS support_requests (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    citizen_id      BIGINT,
    campaign_id     BIGINT,
    request_code    VARCHAR(50) UNIQUE,
    item_name       VARCHAR(255),
    quantity        INT,
    unit            VARCHAR(50),
    area            VARCHAR(255),
    urgency         ENUM('LOW','MEDIUM','HIGH','CRITICAL') DEFAULT 'MEDIUM',
    reason          TEXT,
    household_count INT DEFAULT 1,
    -- 6-step status flow
    status          ENUM(
                      'PENDING',
                      'VERIFIED',
                      'APPROVED',
                      'WAREHOUSE_READY',
                      'IN_TRANSIT',
                      'DELIVERED',
                      'REJECTED'
                    ) DEFAULT 'PENDING',
    notes           TEXT,
    confirmed_at    DATETIME COMMENT 'Citizen receipt confirmation timestamp',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (citizen_id)  REFERENCES users(id)     ON DELETE SET NULL,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE SET NULL,
    INDEX idx_sr_citizen (citizen_id),
    INDEX idx_sr_status  (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS support_request_files (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    request_id  BIGINT NOT NULL,
    url         TEXT NOT NULL,
    file_type   VARCHAR(50),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES support_requests(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS support_approvals (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    request_id      BIGINT NOT NULL,
    approved_by     BIGINT,
    action          ENUM('VERIFY','APPROVE','REJECT','ADVANCE') NOT NULL,
    previous_status VARCHAR(50),
    new_status      VARCHAR(50),
    note            TEXT,
    actioned_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id)  REFERENCES support_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_sa_request (request_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 8. VOLUNTEERS
-- ============================================================

CREATE TABLE IF NOT EXISTS volunteers (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id      BIGINT NOT NULL UNIQUE,
    skills       TEXT,
    availability VARCHAR(100),
    status       ENUM('ACTIVE','INACTIVE','SUSPENDED') DEFAULT 'ACTIVE',
    joined_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS volunteer_groups (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    leader_id   BIGINT,
    area        VARCHAR(255),
    description TEXT,
    status      ENUM('ACTIVE','INACTIVE') DEFAULT 'ACTIVE',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (leader_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS volunteer_assignments (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    volunteer_id     BIGINT NOT NULL,
    campaign_id      BIGINT,
    group_id         BIGINT,
    task_description TEXT,
    start_date       DATE,
    end_date         DATE,
    status           ENUM('ASSIGNED','IN_PROGRESS','COMPLETED','CANCELLED') DEFAULT 'ASSIGNED',
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (volunteer_id) REFERENCES volunteers(id)      ON DELETE CASCADE,
    FOREIGN KEY (campaign_id)  REFERENCES campaigns(id)       ON DELETE SET NULL,
    FOREIGN KEY (group_id)     REFERENCES volunteer_groups(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS volunteer_checkin (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    assignment_id BIGINT NOT NULL,
    checkin_time  DATETIME,
    checkout_time DATETIME,
    location      VARCHAR(255),
    note          TEXT,
    FOREIGN KEY (assignment_id) REFERENCES volunteer_assignments(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 9. WAREHOUSES & INVENTORY
-- ============================================================

CREATE TABLE IF NOT EXISTS warehouses (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    address    VARCHAR(500),
    province   VARCHAR(100),
    manager_id BIGINT,
    status     ENUM('ACTIVE','INACTIVE') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO warehouses (name, address, province) VALUES
  ('Kho Hà Nội',  '12 Lê Thánh Tông, Hoàn Kiếm', 'Hà Nội'),
  ('Kho TP.HCM',  '45 Nguyễn Huệ, Q.1',          'TP. Hồ Chí Minh'),
  ('Kho Đà Nẵng', '7 Hùng Vương, Hải Châu',       'Đà Nẵng');

CREATE TABLE IF NOT EXISTS inventory (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    item_name    VARCHAR(255) NOT NULL,
    category     VARCHAR(100),
    quantity     INT NOT NULL DEFAULT 0,
    unit         VARCHAR(50),
    min_stock    INT DEFAULT 0,
    warehouse_id INT,
    description  TEXT,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE SET NULL,
    INDEX idx_inv_warehouse (warehouse_id),
    UNIQUE KEY uk_item_warehouse (item_name, warehouse_id) COMMENT 'Prevent duplicate item in same warehouse'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS inventory_transactions (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    inventory_id BIGINT NOT NULL,
    type         ENUM('IN','OUT','ADJUST','TRANSFER') NOT NULL,
    quantity     INT NOT NULL,
    before_qty   INT,
    after_qty    INT,
    note         TEXT,
    performed_by BIGINT,
    performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (inventory_id) REFERENCES inventory(id) ON DELETE CASCADE,
    FOREIGN KEY (performed_by) REFERENCES users(id)     ON DELETE SET NULL,
    INDEX idx_it_inventory (inventory_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 10. DELIVERIES
-- ============================================================

CREATE TABLE IF NOT EXISTS deliveries (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    delivery_code VARCHAR(50) UNIQUE,
    request_id    BIGINT,
    campaign_id   BIGINT,
    driver_id     BIGINT,
    vehicle_type  VARCHAR(100),
    license_plate VARCHAR(20),
    origin        VARCHAR(255),
    destination   VARCHAR(255),
    depart_at     DATETIME,
    arrive_at     DATETIME,
    status        ENUM('SCHEDULED','IN_TRANSIT','DELIVERED','FAILED') DEFAULT 'SCHEDULED',
    note          TEXT,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id)  REFERENCES support_requests(id) ON DELETE SET NULL,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id)        ON DELETE SET NULL,
    FOREIGN KEY (driver_id)   REFERENCES users(id)            ON DELETE SET NULL,
    INDEX idx_del_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS delivery_items (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    delivery_id  BIGINT NOT NULL,
    inventory_id BIGINT,
    item_name    VARCHAR(255),
    quantity     INT,
    unit         VARCHAR(50),
    FOREIGN KEY (delivery_id)  REFERENCES deliveries(id) ON DELETE CASCADE,
    FOREIGN KEY (inventory_id) REFERENCES inventory(id)  ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 11. APPROVALS (generic)
-- ============================================================

CREATE TABLE IF NOT EXISTS approvals (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,
    entity_id   BIGINT      NOT NULL,
    action      VARCHAR(50) NOT NULL,
    approved_by BIGINT,
    status      ENUM('PENDING','APPROVED','REJECTED') DEFAULT 'PENDING',
    note        TEXT,
    actioned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_appr_entity (entity_type, entity_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 12. FINANCE
-- ============================================================

CREATE TABLE IF NOT EXISTS expense_records (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    campaign_id BIGINT,
    category    VARCHAR(100),
    amount      DECIMAL(18,2) NOT NULL,
    description TEXT,
    receipt_url TEXT,
    recorded_by BIGINT,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE SET NULL,
    FOREIGN KEY (recorded_by) REFERENCES users(id)     ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS financial_reports (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    campaign_id   BIGINT,
    period_start  DATE,
    period_end    DATE,
    total_income  DECIMAL(18,2) DEFAULT 0,
    total_expense DECIMAL(18,2) DEFAULT 0,
    balance       DECIMAL(18,2) DEFAULT 0,
    generated_by  BIGINT,
    generated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    pdf_url       TEXT,
    FOREIGN KEY (campaign_id)  REFERENCES campaigns(id) ON DELETE SET NULL,
    FOREIGN KEY (generated_by) REFERENCES users(id)     ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS ledger (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    campaign_id    BIGINT,
    type           ENUM('INCOME','EXPENSE') NOT NULL,
    amount         DECIMAL(18,2) NOT NULL,
    description    TEXT,
    reference_type VARCHAR(50),
    reference_id   BIGINT,
    recorded_by    BIGINT,
    recorded_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE SET NULL,
    FOREIGN KEY (recorded_by) REFERENCES users(id)     ON DELETE SET NULL,
    INDEX idx_ledger_campaign (campaign_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 13. COMPLAINTS (full history + progress %)
-- ============================================================

CREATE TABLE IF NOT EXISTS complaints (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    complaint_code VARCHAR(20) UNIQUE,
    sender_id      BIGINT,
    sender_name    VARCHAR(255),
    sender_role    VARCHAR(50),
    type           VARCHAR(100),
    subject        VARCHAR(500),
    content        TEXT,
    contact_info   VARCHAR(255),
    status         ENUM('PENDING','IN_REVIEW','REPLIED','CLOSED') DEFAULT 'PENDING',
    admin_reply    TEXT,
    replied_by     BIGINT,
    replied_at     DATETIME,
    progress       TINYINT DEFAULT 0 COMMENT '0-100 percent',
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id)  REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (replied_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_comp_sender (sender_id),
    INDEX idx_comp_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 14. NOTIFICATIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS notifications (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id    BIGINT NOT NULL,
    title      VARCHAR(500),
    body       TEXT,
    type       VARCHAR(50),
    is_read    TINYINT(1) DEFAULT 0,
    link       VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_notif_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 15. MESSAGES & COMMENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS messages (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    sender_id   BIGINT,
    receiver_id BIGINT,
    content     TEXT,
    is_read     TINYINT(1) DEFAULT 0,
    sent_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id)   REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_msg_sender   (sender_id),
    INDEX idx_msg_receiver (receiver_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS comments (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT,
    entity_type VARCHAR(50),
    entity_id   BIGINT,
    content     TEXT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_comment_entity (entity_type, entity_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 16. LOGS & SYSTEM
-- ============================================================

CREATE TABLE IF NOT EXISTS audit_logs (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT,
    action      VARCHAR(255),
    entity_type VARCHAR(50),
    entity_id   BIGINT,
    old_data    JSON,
    new_data    JSON,
    ip_address  VARCHAR(45),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_al_user   (user_id),
    INDEX idx_al_entity (entity_type, entity_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS activity_logs (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT,
    action      VARCHAR(255),
    description TEXT,
    ip_address  VARCHAR(45),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_actlog_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS email_logs (
    id        BIGINT AUTO_INCREMENT PRIMARY KEY,
    recipient VARCHAR(255),
    subject   VARCHAR(500),
    body      TEXT,
    status    ENUM('SENT','FAILED','PENDING') DEFAULT 'PENDING',
    sent_at   DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS system_settings (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    `key`       VARCHAR(100) NOT NULL UNIQUE,
    `value`     TEXT,
    description VARCHAR(255),
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO system_settings (`key`, `value`, description) VALUES
  ('site_name',      'ReliefHub',           'Tên hệ thống'),
  ('admin_email',    'admin@reliefhub.com', 'Email quản trị'),
  ('max_upload_mb',  '10',                  'Dung lượng upload tối đa (MB)'),
  ('allow_register', 'true',                'Cho phép đăng ký mới');

-- ============================================================
-- 17. ATTACHMENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS attachments (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    entity_type VARCHAR(50),
    entity_id   BIGINT,
    file_name   VARCHAR(255),
    url         TEXT,
    mime_type   VARCHAR(100),
    size_bytes  BIGINT,
    uploaded_by BIGINT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_attach_entity (entity_type, entity_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 18. DISASTERS
-- ============================================================

CREATE TABLE IF NOT EXISTS disasters (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    type        VARCHAR(100),
    area        VARCHAR(255),
    severity    ENUM('LOW','MEDIUM','HIGH','CRITICAL') DEFAULT 'MEDIUM',
    description TEXT,
    occurred_at DATE,
    status      ENUM('ACTIVE','RESOLVED','MONITORING') DEFAULT 'ACTIVE',
    created_by  BIGINT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- VIEWS
-- ============================================================

CREATE OR REPLACE VIEW active_users AS
SELECT
    u.id, u.full_name, u.username, u.email, u.phone,
    u.avatar_url, u.status,
    r.name AS role_name,
    u.created_at, u.updated_at
FROM users u
LEFT JOIN roles r ON u.role_id = r.id
WHERE u.status = 'ACTIVE';

CREATE OR REPLACE VIEW v_campaign_summary AS
SELECT
    c.id, c.title,
    cc.name AS category,
    c.target_amount, c.current_amount,
    ROUND((c.current_amount / NULLIF(c.target_amount,0)) * 100, 1) AS progress_pct,
    c.status, c.start_date, c.end_date,
    u.full_name AS created_by_name
FROM campaigns c
LEFT JOIN campaign_categories cc ON c.category_id = cc.id
LEFT JOIN users u ON c.created_by = u.id;

CREATE OR REPLACE VIEW v_need_status AS
SELECT
    sr.id, sr.request_code,
    u.username AS citizen,
    sr.item_name, sr.quantity, sr.unit,
    sr.area, sr.urgency, sr.status,
    sr.created_at
FROM support_requests sr
LEFT JOIN users u ON sr.citizen_id = u.id;

CREATE OR REPLACE VIEW v_complaint_history AS
SELECT
    c.id, c.complaint_code,
    u.username AS sender,
    c.sender_role,
    c.type, c.subject,
    c.status, c.progress,
    c.created_at, c.replied_at,
    c.admin_reply
FROM complaints c
LEFT JOIN users u ON c.sender_id = u.id;

-- ============================================================
-- STORED PROCEDURES
-- (Run individually in Workbench if auto-delimiter causes issues)
-- ============================================================

DROP PROCEDURE IF EXISTS restock_inventory;
CREATE PROCEDURE restock_inventory(
    IN p_inventory_id BIGINT,
    IN p_quantity      INT,
    IN p_note          TEXT,
    IN p_user_id       BIGINT
)
BEGIN
    DECLARE v_before INT DEFAULT 0;
    SELECT quantity INTO v_before FROM inventory WHERE id = p_inventory_id;
    UPDATE inventory SET quantity = quantity + p_quantity WHERE id = p_inventory_id;
    INSERT INTO inventory_transactions(inventory_id, type, quantity, before_qty, after_qty, note, performed_by)
    VALUES(p_inventory_id, 'IN', p_quantity, v_before, v_before + p_quantity, p_note, p_user_id);
END;

DROP PROCEDURE IF EXISTS advance_need_status;
CREATE PROCEDURE advance_need_status(
    IN p_request_id BIGINT,
    IN p_new_status VARCHAR(50),
    IN p_user_id    BIGINT,
    IN p_note       TEXT
)
BEGIN
    DECLARE v_old VARCHAR(50) DEFAULT 'PENDING';
    SELECT status INTO v_old FROM support_requests WHERE id = p_request_id;
    UPDATE support_requests
        SET status = p_new_status,
            confirmed_at = IF(p_new_status = 'DELIVERED', NOW(), confirmed_at),
            updated_at   = NOW()
    WHERE id = p_request_id;
    INSERT INTO support_approvals(request_id, approved_by, action, previous_status, new_status, note)
    VALUES(p_request_id, p_user_id, 'ADVANCE', v_old, p_new_status, p_note);
END;

-- ============================================================
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- VERIFICATION (runs automatically after import)
-- ============================================================
SHOW TABLES;
SELECT
    u.id,
    u.full_name,
    u.username,
    u.email,
    u.status,
    r.name AS role
FROM users u
LEFT JOIN roles r ON u.role_id = r.id
ORDER BY u.id;
