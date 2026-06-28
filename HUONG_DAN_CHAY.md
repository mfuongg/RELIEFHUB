# 🆘 ReliefHub — Hệ thống Quản lý Cứu trợ Thiên tai

> **Đồ án môn Phân tích và Thiết kế Phần mềm — Nhóm 06**

Hệ thống full-stack quản lý cứu trợ thiên tai, kết nối nhà tài trợ, tình nguyện viên, người dân và ban điều phối.

## 📁 Cấu trúc dự án

```
ReliefHub_Final/
├── backend/          ← Spring Boot REST API (Java 21)
│   ├── pom.xml
│   ├── reliefhub_full.sql       ← Schema database (48 bảng + 4 views)
│   ├── src/main/resources/
│   │   ├── application.yml      ← Cấu hình kết nối MySQL + JWT
│   │   └── seed_data.sql        ← Dữ liệu mẫu (campaigns, disasters, donations...)
│   └── src/main/java/com/reliefhub/
│       ├── entity/              ← 17 JPA entities
│       ├── repository/          ← 14 JpaRepository interfaces
│       ├── service/             ← 15 service classes
│       ├── controller/          ← 14 REST controllers (60+ endpoints)
│       ├── security/            ← JWT + BCrypt + Spring Security
│       ├── dto/                 ← 16 DTO classes
│       ├── common/              ← ApiResponse wrapper
│       ├── exception/           ← GlobalExceptionHandler
│       └── config/              ← OpenAPI, WebConfig, DataInitializer
│
├── frontend/         ← React + Vite + TailwindCSS
│   ├── .env                     ← VITE_API_URL=http://localhost:8080/api
│   ├── package.json
│   ├── tailwind.config.js
│   ├── reliefhub_full.sql       ← Schema database (bản copy)
│   └── src/
│       ├── services/api.js      ← API layer (gọi REST API backend)
│       ├── context/AppContext.jsx  ← State management + API integration
│       ├── pages/               ← 50+ trang cho 6 vai trò
│       └── components/          ← DashboardLayout, Toast, PageTransition
│
└── HUONG_DAN_CHAY.md            ← File này
```

## 🛠️ Công nghệ sử dụng

| Layer | Công nghệ |
|-------|----------|
| Frontend | React 18, Vite, TailwindCSS, Framer Motion, Lucide Icons |
| Backend | Spring Boot 3.2.5, Java 21, Spring Security, JWT (jjwt 0.12.5) |
| Database | MySQL 8 / MariaDB (utf8mb4) |
| ORM | Spring Data JPA + Hibernate 6 |
| Security | BCrypt password hashing, JWT token (24h), RBAC 6 roles |
| API Docs | Springdoc OpenAPI 3 (Swagger UI) |
| Testing | JUnit 5, MockMvc, H2 in-memory (10/10 tests pass) |

## 🚀 Hướng dẫn chạy

### Bước 1: Cài đặt MySQL

```bash
# Cài MySQL 8 hoặc MariaDB
# Tạo database
mysql -u root -p -e "CREATE DATABASE reliefhub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### Bước 2: Import database

```bash
# Import schema (48 bảng + 4 views + stored procedures)
mysql -u root -p reliefhub < reliefhub_full.sql

# Import dữ liệu mẫu (campaigns, disasters, donations, deliveries...)
mysql -u root -p reliefhub < backend/src/main/resources/seed_data.sql
```

### Bước 3: Chạy Backend

```bash
cd backend

# Cấu hình kết nối MySQL (nếu cần đổi password)
# Sửa file: src/main/resources/application.yml
#   spring.datasource.password: your_password

# Build & chạy
mvn clean install
mvn spring-boot:run
```

Backend chạy tại: **http://localhost:8080/api**
Swagger UI: **http://localhost:8080/api/swagger-ui.html**

> ⚠️ Khi khởi động lần đầu, `DataInitializer` tự động hash BCrypt cho mật khẩu mặc định trong database.

### Bước 4: Chạy Frontend

```bash
cd frontend

# Cài dependencies
npm install

# Chạy dev server
npm run dev
```

Frontend chạy tại: **http://localhost:5173**

### Bước 5: Đăng nhập

| Username | Password | Vai trò |
|----------|----------|---------|
| admin | admin123 | Quản trị viên |
| donor01 | donor123 | Nhà tài trợ |
| finance01 | fin123 | Ban tài chính |
| local01 | local123 | Cán bộ địa phương |
| citizen01 | citizen123 | Người dân |
| volunteer01 | vol123 | Tình nguyện viên |

## ✅ Kiểm tra

### Build backend
```bash
cd backend
mvn clean package -DskipTests
# → target/reliefhub-backend-1.0.0.jar (56MB)
```

### Chạy unit tests
```bash
cd backend
mvn test
# → Tests run: 10, Failures: 0, Errors: 0, Skipped: 0
# → BUILD SUCCESS
```

### Build frontend
```bash
cd frontend
npm run build
# → dist/ folder
```

## 📋 Tài khoản mặc định

Sau khi import `reliefhub_full.sql` + `seed_data.sql`:

**6 tài khoản người dùng** (tự động hash BCrypt khi backend khởi động):
- admin / admin123 — Quản trị viên hệ thống
- donor01 / donor123 — Nhà tài trợ (Nguyễn Minh Đức)
- finance01 / fin123 — Ban tài chính (Trần Thị Lan)
- local01 / local123 — Cán bộ địa phương (Lê Văn Hùng)
- citizen01 / citizen123 — Người dân (Phạm Thị Hoa)
- volunteer01 / vol123 — Tình nguyện viên (Hoàng Văn Nam)

**Dữ liệu mẫu**:
- 4 chiến dịch cứu trợ (3 active, 1 completed)
- 4 thiên tai (3 active, 1 resolved)
- 8 mặt hàng kho (3 kho: Hà Nội, TP.HCM, Đà Nẵng)
- 5 đóng góp (4 confirmed, 1 pending)
- 4 yêu cầu hỗ trợ (PENDING → VERIFIED → APPROVED → DELIVERED)
- 3 chuyến giao hàng (SCHEDULED, IN_TRANSIT, DELIVERED)
- 6 bút toán sổ cái (3 income, 3 expense)
- 2 nhóm tình nguyện
- 2 khiếu nại (1 replied, 1 closed)
- 4 thông báo

## 🔑 API Endpoints (60+)

### Public (không cần token)
- `GET /disasters` — Danh sách thiên tai
- `GET /disasters/active` — Thiên tai đang hoạt động
- `GET /campaigns` — Danh sách chiến dịch
- `GET /campaigns/active` — Chiến dịch đang hoạt động
- `POST /auth/login` — Đăng nhập
- `POST /auth/register` — Đăng ký
- `GET /swagger-ui.html` — API documentation

### Authenticated (cần Bearer token)
- `GET/PUT /users/me` — Hồ sơ cá nhân
- `GET/POST/PUT/DELETE /campaigns` — CRUD chiến dịch (Admin)
- `GET/POST/PUT/DELETE /disasters` — CRUD thiên tai (Admin/Local)
- `GET/POST /donations` — Đóng góp
- `PATCH /donations/{id}/status` — Xác minh đóng góp (Finance)
- `GET/POST /support-requests` — Yêu cầu hỗ trợ
- `PATCH /support-requests/{id}/advance` — Chuyển trạng thái (6-step flow)
- `GET/POST /complaints` — Khiếu nại
- `PUT /complaints/{id}/reply` — Trả lời (Admin)
- `GET/PATCH /notifications` — Thông báo
- `GET /dashboard/stats` — Thống kê (Admin/Finance)
- `GET/POST/PUT/DELETE /volunteer-groups` — Nhóm tình nguyện
- `GET/POST/PUT/DELETE /inventory` — Kho hàng
- `PATCH /inventory/{id}/restock` — Nhập thêm hàng
- `GET/POST/PATCH/DELETE /deliveries` — Vận chuyển
- `GET/POST/DELETE /ledger` — Sổ cái
- `GET/POST/DELETE /warehouses` — Kho
- `POST /uploads` — Upload file (multipart, max 10MB)

## 🔐 Phân quyền (RBAC)

| Role | Quyền |
|------|-------|
| ADMIN | Quản lý tất cả: users, campaigns, disasters, dashboard, complaints |
| FINANCE | Xác minh đóng góp, sổ tài chính, dashboard |
| LOCAL | Cập nhật thiên tai, xác minh nhu cầu, trao hàng |
| DONOR | Đóng góp, xem lịch sử, khiếu nại, theo dõi |
| CITIZEN | Gửi yêu cầu hỗ trợ, xem trạng thái, khiếu nại |
| VOLUNTEER | Nhóm tình nguyện, vận chuyển, trao hàng |

## 🔄 Quy trình 6 bước hỗ trợ

```
PENDING → VERIFIED → APPROVED → WAREHOUSE_READY → IN_TRANSIT → DELIVERED
                                                              ↘ REJECTED
```

1. **PENDING**: Citizen gửi yêu cầu
2. **VERIFIED**: Cán bộ địa phương xác minh
3. **APPROVED**: Admin phê duyệt
4. **WAREHOUSE_READY**: Kho chuẩn bị hàng
5. **IN_TRANSIT**: Tình nguyện viên vận chuyển
6. **DELIVERED**: Cán bộ địa phương xác nhận trao hàng

---

© 2026 RELIEFHUB — NHÓM 06 MÔN PHÂN TÍCH VÀ THIẾT KẾ PHẦN MỀM
