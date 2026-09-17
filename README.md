<div align="center">

# 🆘 ReliefHub — Hệ thống Quản lý Cứu trợ Thiên tai

**Nền tảng kết nối Nhà tài trợ — Chính quyền địa phương — Tình nguyện viên**

![Java](https://img.shields.io/badge/Java-21-ED8B00?logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.5-6DB33F?logo=springboot&logoColor=white)
![Spring Security](https://img.shields.io/badge/Spring_Security-6_(JWT)-6DB33F?logo=springsecurity&logoColor=white)
![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8.1-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)
![Swagger](https://img.shields.io/badge/OpenAPI-Swagger_UI-85EA2D?logo=swagger&logoColor=black)

Số hóa toàn bộ quy trình cứu trợ thiên tai:
**tiếp nhận đóng góp → phân bổ → giao hàng → báo cáo minh bạch**


</div>

---
## 👨‍💻 Author / Creator
**Ngô Thị Minh Phương** 
* GitHub: https://github.com/mfuongg
* Email: fuongm06@example.com

---

## 📖 Giới thiệu

**ReliefHub** là hệ thống quản lý cứu trợ thiên tai được phát triển trong khuôn khổ học phần *Phân tích và Thiết kế Phần mềm*. Hệ thống hướng đến việc giải quyết bài toán thiếu minh bạch trong hoạt động cứu trợ, kết nối **sáu nhóm người dùng** trong một quy trình xuyên suốt: từ tiếp nhận đóng góp, phân bổ nguồn lực, giao hàng cứu trợ đến báo cáo tài chính.

Về mặt kỹ thuật, đây là ứng dụng **full-stack** theo kiến trúc 3 tầng:

- **Backend** — Spring Boot 3.2.5 trên Java 21, REST API gồm **15 controller / 67 endpoint**, xác thực bằng **JWT** và phân quyền **RBAC** theo 6 vai trò.
- **Frontend** — React 19 + Vite 8, **43 trang JSX** chia thành 6 dashboard theo vai trò, điều hướng bảo vệ bằng `ProtectedRoute`.
- **Database** — MySQL 8, **45 bảng** (`InnoDB`, chuẩn hóa 3NF), kèm **4 view** và **2 stored procedure**.

---

## 🎯 Vấn đề giải quyết

| # | Vấn đề thực tế | Giải pháp của ReliefHub |
|---|---|---|
| 1 | Thiếu kênh quyên góp chính thức, được kiểm chứng | Ba hình thức đóng góp: **chuyển khoản ngân hàng**, **hiện vật**, **tiền mặt** — mỗi hình thức có điểm nhận riêng và đều sinh **biên nhận điện tử** |
| 2 | Khó theo dõi hành trình hàng cứu trợ | Quy trình **6 bước**: `PENDING → VERIFIED → APPROVED → WAREHOUSE_READY → IN_TRANSIT → DELIVERED` |
| 3 | Thiếu cơ chế phối hợp tình nguyện viên | Quản lý **nhóm tình nguyện**, phân công vận chuyển và bàn giao hàng cứu trợ |
| 4 | Không có kênh phản ánh minh bạch | Hệ thống **khiếu nại** có mã định danh (`CMP-xxx`), Admin phản hồi kèm **tỷ lệ tiến độ xử lý** |
| 5 | Sổ cái tài chính không kiểm toán được | Bảng **`ledger`** ghi từng bút toán `INCOME`/`EXPENSE` kèm `reference_type` + `reference_id` (truy vết về đúng đóng góp/chuyến giao) |

---

## ✨ Tính năng chính

### Sáu vai trò người dùng (RBAC)

Số trang là số file JSX thực tế trong `frontend/src/pages/<role>/`; màu theme lấy từ `frontend/src/components/DashboardLayout.jsx`.

| Vai trò | Màu theme | Số trang | Chức năng cốt lõi |
|---|---|---|---|
| **Quản trị viên** (admin) | `slate-800 → slate-900` | 9 | Quản lý tài khoản, chiến dịch, kho hàng, phân bổ nguồn lực, nhiệm vụ TNV, báo cáo, khiếu nại |
| **Nhà tài trợ** (donor) | `orange-500 → orange-700` | 9 | Đóng góp 3 hình thức, hướng dẫn đóng góp, lịch sử, biên nhận, theo dõi sử dụng, khiếu nại |
| **Ban Tài chính** (finance) | `emerald-600 → emerald-800` | 3 | Xác minh đóng góp, sổ tài chính, dashboard tài chính |
| **Cán bộ địa phương** (local) | `blue-600 → blue-800` | 5 | Cập nhật thiên tai, xác minh nhu cầu, quản lý trao hàng, tra cứu hỗ trợ |
| **Người dân** (citizen) | `purple-600 → purple-800` | 4 | Gửi yêu cầu hỗ trợ, theo dõi trạng thái đơn, xem biên nhận hỗ trợ |
| **Tình nguyện viên** (volunteer) | `rose-500 → rose-700` | 6 | Nhóm tình nguyện, vận chuyển, trao hàng, hồ sơ kỹ năng |
| *(Công khai)* | — | 7 | Trang chủ, đăng nhập, đăng ký, danh sách & chi tiết chiến dịch, bảng xếp hạng tài trợ, tra cứu vận chuyển |

> Tổng cộng **43 trang JSX**. Lưu ý `frontend/src/pages/volunteer/Report.jsx` hiện **không được khai báo route** trong `App.jsx` (5 route của dashboard tình nguyện viên: Tổng quan, Nhóm, Vận chuyển, Trao hàng, Thông tin cá nhân).

### Điểm nổi bật

- **Ba hình thức đóng góp** với nội dung chuyển khoản đối soát tự động theo mẫu `RH-{campaign}-{user_id}`, kèm danh sách tài khoản ngân hàng theo từng chiến dịch.
- **Quy trình 6 bước** xử lý yêu cầu hỗ trợ, mỗi yêu cầu có `request_code` duy nhất (`REQ-xxx`) để người dân tra cứu.
- **Biên nhận điện tử** (`RH-REC-xxx`) cho cả ba hình thức đóng góp — tiền mặt, chuyển khoản và hiện vật.
- **Theo dõi sử dụng đóng góp** — nhà tài trợ xem lại dòng tiền đã đóng góp theo chiến dịch.
- **Dashboard thống kê** với biểu đồ Recharts cho Admin và Ban tài chính (`BarChart`, `PieChart`, `LineChart`, `AreaChart`).
- **Bảng xếp hạng tài trợ công khai** (Sponsor Board).
- **Swagger UI** tự động tại `/api/swagger-ui.html`.
- **Bộ dữ liệu mẫu** sẵn sàng demo: 4 chiến dịch, 4 thiên tai, 8 mặt hàng kho, 5 đóng góp, 4 yêu cầu hỗ trợ, 3 chuyến giao hàng, 6 bút toán sổ cái, 2 nhóm TNV, 2 khiếu nại, 4 thông báo.

### Chức năng theo vai trò (trích từ bảng route thực tế)

```text
/dashboard/admin     → Tổng quan · Tài khoản · Kho hàng · Chiến dịch · Nhiệm vụ TNV
                       · Quản lý đóng góp · Phân bổ nguồn lực · Override xác minh
                       · Báo cáo thống kê · Khiếu nại · Thông tin cá nhân
/dashboard/donor     → Tổng quan · Chiến dịch đang mở · Đóng góp ngay · Hướng dẫn
                       · Lịch sử · Biên nhận · Theo dõi sử dụng · Phản ánh · Cá nhân
/dashboard/finance   → Tổng quan · Xác minh đóng góp · Sổ tài chính · Cá nhân
/dashboard/local     → Tổng quan · Cập nhật thiên tai · Xác minh nhu cầu · Trao hàng
                       · Tra cứu hỗ trợ · Cá nhân
/dashboard/citizen   → Tổng quan · Gửi yêu cầu hỗ trợ · Trạng thái đơn · Biên nhận · Cá nhân
/dashboard/volunteer → Tổng quan · Nhóm tình nguyện · Vận chuyển · Trao hàng · Cá nhân
```

---

## 🏗️ Kiến trúc hệ thống

```text
┌─────────────────────────────────────────────────────────────────────┐
│                        TRÌNH DUYỆT NGƯỜI DÙNG                       │
│                                                                     │
│   React 19 + Vite 8 + Tailwind CSS 3.4 + Framer Motion + Recharts   │
│   43 trang JSX | 6 dashboard theo vai trò | AppContext (Context API)│
│   api.js: 15 service object + tokenManager (localStorage JWT)        │
└──────────────────────────────┬──────────────────────────────────────┘
                               │ REST API (JSON) + Bearer JWT
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       BACKEND (SPRING BOOT)                         │
│                                                                     │
│   Java 21 + Spring Boot 3.2.5 + Spring Security 6 (JWT/BCrypt)      │
│   15 Controller (67 endpoint) → 15 Service → 17 Entity              │
│   → 14 Repository (Spring Data JPA) + 15 DTO                        │
│   Swagger UI | @PreAuthorize RBAC | GlobalExceptionHandler          │
│   ApiResponse<T> { success, message, data, error, timestamp }        │
└──────────────────────────────┬──────────────────────────────────────┘
                               │ JDBC / JPA / Hibernate 6
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        DATABASE (MYSQL 8.0)                         │
│                                                                     │
│   45 bảng | InnoDB (ACID) | utf8mb4 | 4 view | 2 stored procedure   │
│   ENUM status fields | FK ON DELETE CASCADE / SET NULL              │
│   Hibernate ddl-auto: none (schema do SQL script quản lý)           │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🧰 Công nghệ sử dụng

### Frontend

| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| ReactJS | `^19.2.7` | Thư viện UI component-based, hooks, Context API |
| Vite | `^8.1.0` | Build tool + dev server (HMR), cổng 5173 |
| React Router DOM | `^7.18.0` | Protected route theo vai trò, nested route qua `DashboardLayout` |
| Tailwind CSS | `^3.4.19` | Utility-first CSS, responsive; font `Be Vietnam Pro` |
| Framer Motion | `^12.42.0` | Animation chuyển trang (`AnimatePresence`), hover/sidebar (dùng ở 44 file) |
| Recharts | `^3.9.0` | Biểu đồ: `BarChart`, `PieChart`, `LineChart`, `AreaChart` (4 trang) |
| Lucide React | `^1.21.0` | Bộ icon SVG (dùng ở 45 file) |
| PostCSS + Autoprefixer | `^8.5.15` / `^10.5.2` | Pipeline CSS cho Tailwind |
| oxlint | `^1.69.0` | Linter (`npm run lint`) |

### Backend

| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| Java | **21** | Ngôn ngữ chính (`<java.version>21</java.version>`) |
| Spring Boot | `3.2.5` | Framework enterprise, auto-configuration, Tomcat nhúng |
| Spring Security | 6 (trong Boot 3.2.5) | Xác thực JWT + phân quyền RBAC (`@PreAuthorize`, `@EnableMethodSecurity`) |
| Spring Data JPA + Hibernate 6 | — | Repository pattern, ORM, `MySQL8Dialect` |
| JJWT | `0.12.5` | Tạo/xác thực JWT (`jjwt-api`, `jjwt-impl`, `jjwt-jackson`) |
| BCrypt (`BCryptPasswordEncoder`) | — | Băm mật khẩu |
| Lombok | — | Giảm boilerplate (`@Data`, `@Builder`, `@RequiredArgsConstructor`) |
| SpringDoc OpenAPI | `2.3.0` | Swagger UI tự động |
| Maven | 3.9+ | Build tool (repo **không kèm** `mvnw` — cần Maven cài sẵn) |
| H2 Database | test scope | CSDL in-memory cho unit test |
| JUnit 5 + MockMvc + Spring Security Test | — | Kiểm thử (`spring-boot-starter-test`) |

### Cơ sở dữ liệu & vận hành

| Công nghệ | Mục đích |
|---|---|
| MySQL 8 / MariaDB (utf8mb4) | CSDL quan hệ, 45 bảng, `InnoDB` (ACID) |
| H2 in-memory | CSDL cho test/CI |
| 4 view + 2 stored procedure | `active_users`, `v_campaign_summary`, `v_need_status`, `v_complaint_history`; `restock_inventory()`, `advance_need_status()` |

> ⚠️ **Về Docker:** mẫu README trước đây có mục Docker Compose/Nginx, nhưng **gói source hiện tại không chứa** `Dockerfile`, `docker-compose.yml` hay cấu hình Nginx (đã kiểm tra bằng `find` trên toàn bộ repository). Vì vậy phần triển khai bằng container được ghi là *đề xuất bổ sung* ở mục 11, không phải tính năng đã có.

---

## 📂 Cấu trúc mã nguồn

```text
ReliefHub/
├── backend/                                   # Spring Boot REST API (89 file Java)
│   ├── pom.xml                                # Java 21 · Spring Boot 3.2.5 · JJWT 0.12.5
│   ├── reliefhub_database.sql                 # Schema + seed (45 bảng, 4 view, 2 procedure)
│   ├── reliefhub_full.sql                     # Bản schema rút gọn (796 dòng)
│   └── src/
│       ├── main/java/com/reliefhub/
│       │   ├── ReliefHubApplication.java
│       │   ├── controller/      (15)   # Auth, User, Campaign, Disaster, Donation,
│       │   │                           # SupportRequest, Complaint, Notification, Dashboard,
│       │   │                           # VolunteerGroup, Inventory, Warehouse, Delivery,
│       │   │                           # Ledger, FileUpload
│       │   ├── service/         (15)   # Toàn bộ logic nghiệp vụ
│       │   ├── entity/          (17)   # User, Role, Permission, Campaign, CampaignCategory,
│       │   │                           # Disaster, Donation, DonationItem, SupportRequest,
│       │   │                           # Inventory, Warehouse, Delivery, Volunteer,
│       │   │                           # VolunteerGroup, Ledger, Notification, Complaint
│       │   ├── repository/      (14)   # Spring Data JPA Repository
│       │   ├── dto/             (15)   # Request/Response DTO + Bean Validation
│       │   ├── security/        (5)    # JwtTokenProvider, JwtAuthenticationFilter,
│       │   │                           # SecurityConfig, CustomUserDetails(+Service)
│       │   ├── config/          (3)    # OpenApiConfig, WebConfig, DataInitializer
│       │   ├── common/          (1)    # ApiResponse<T>
│       │   └── exception/       (3)    # GlobalExceptionHandler, BadRequest,
│       │                               # ResourceNotFound
│       ├── main/resources/
│       │   ├── application.yml          # datasource, JWT, CORS, upload, springdoc
│       │   └── seed_data.sql            # Dữ liệu mẫu (99 dòng)
│       └── test/java/com/reliefhub/     (3 file, 13 @Test)
│           ├── AuthControllerTest.java          (6 test)
│           ├── CampaignControllerTest.java      (5 test)
│           └── ReliefHubApplicationTests.java   (2 test)
│
└── frontend/                                  # React SPA
    ├── .env                                   # VITE_API_URL=http://localhost:8080/api
    ├── package.json · vite.config.js · tailwind.config.js · index.html
    └── src/
        ├── main.jsx                           # Entry point
        ├── App.jsx                 (179 dòng) # Router + ProtectedRoute + ROLE_HOME
        ├── index.css (165) · App.css (184)
        ├── context/
        │   └── AppContext.jsx      (826 dòng) # Global state + dữ liệu seed
        ├── services/
        │   └── api.js              (218 dòng) # 15 service object + tokenManager
        ├── components/                        # DashboardLayout (192), Toast (31),
        │                                      # PageTransition (21)
        ├── assets/                            # hero.png, react.svg, vite.svg
        └── pages/
            ├── admin/      (9)  ├── donor/     (9)  ├── finance/   (3)
            ├── local/      (5)  ├── citizen/   (4)  ├── volunteer/ (6)
            └── public/     (7)                    # 43 trang JSX
```

**Quy mô mã nguồn (số liệu đo trực tiếp trên repository):**

| Tầng | Số file | Số dòng |
|---|---|---|
| Java — controller | 15 | 679 |
| Java — service | 15 | 1.312 |
| Java — entity | 17 | 687 |
| Java — dto | 15 | 592 |
| Java — security | 5 | 352 |
| Java — repository | 14 | 172 |
| Java — config / common / exception | 7 | 242 |
| **Tổng Java (main)** | **89** | **≈ 4.036** |
| Java — test | 3 | — (13 `@Test`) |
| React — trang JSX | 43 | — |
| React — context + service + component | 6 | 1.467 |
| SQL — schema & seed | 5 file (3 bản trùng nội dung) | 4.391 |

---

## ⚙️ Yêu cầu hệ thống

| Phần mềm | Phiên bản |
|---|---|
| JDK | **21** |
| Maven | 3.9+ (bắt buộc — repo không có Maven Wrapper) |
| Node.js & npm | Node 20+ |
| MySQL / MariaDB | MySQL 8.0 hoặc MariaDB 10.4+ (utf8mb4) |

---

## 🚀 Cài đặt và chạy

### Bước 1 — Tạo database

```bash
mysql -u root -p -e "CREATE DATABASE reliefhub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### Bước 2 — Import schema và dữ liệu mẫu

```bash
# Schema: 45 bảng + 4 view + 2 stored procedure
mysql -u root -p reliefhub < backend/reliefhub_database.sql

# Dữ liệu mẫu: chiến dịch, thiên tai, kho, đóng góp, yêu cầu hỗ trợ,
# chuyến giao hàng, sổ cái, nhóm TNV, khiếu nại, thông báo
mysql -u root -p reliefhub < backend/src/main/resources/seed_data.sql
```

> `reliefhub_database.sql` đã bao gồm cả phần seed cơ bản (6 vai trò, 6 tài khoản, 6 danh mục chiến dịch, 3 kho, 4 cấu hình hệ thống). File `seed_data.sql` bổ sung dữ liệu nghiệp vụ.

### Bước 3 — Chạy Backend

```bash
cd backend

# Kiểm tra/đổi kết nối trong src/main/resources/application.yml
#   spring.datasource.url      jdbc:mysql://localhost:3306/reliefhub
#   spring.datasource.username root
#   spring.datasource.password root

mvn clean install
mvn spring-boot:run
```

- Backend: **http://localhost:8080/api** (context-path `/api`)
- Swagger UI: **http://localhost:8080/api/swagger-ui.html**

> Lần khởi động đầu tiên, `DataInitializer` tự động băm **BCrypt** cho mọi mật khẩu còn ở dạng plain-text trong bảng `users`.

### Bước 4 — Chạy Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend: **http://localhost:5173** — biến `VITE_API_URL` trong `.env` trỏ tới backend. Nếu gặp CORS, bật `server.proxy` trong `vite.config.js` (khối proxy đã được chú thích sẵn).

### Bước 5 — Đăng nhập

Xem bảng tài khoản ở mục 6.

### Build production

```bash
cd backend  && mvn clean package -DskipTests   # → target/reliefhub-backend-1.0.0.jar
cd frontend && npm run build                   # → dist/
cd frontend && npm run lint                    # oxlint
```

---

## 🔑 Tài khoản demo

Sáu tài khoản được seed trong `backend/reliefhub_database.sql` (cột `password` là plain-text, được `DataInitializer` băm BCrypt khi backend khởi động):

| Vai trò | Username | Password (trong SQL) | Dashboard |
|---|---|---|---|
| Quản trị viên | `admin` | `admin123` | `/dashboard/admin` |
| Nhà tài trợ | `donor01` | `donor123` | `/dashboard/donor` |
| Ban tài chính | `finance01` | **`fin123`** | `/dashboard/finance` |
| Cán bộ địa phương | `local01` | `local123` | `/dashboard/local` |
| Người dân | `citizen01` | `citizen123` | `/dashboard/citizen` |
| Tình nguyện viên | `volunteer01` | `vol123` | `/dashboard/volunteer` |

> ⚠️ **Hai nguồn tài khoản đang không khớp nhau** — cần đồng bộ trước khi nộp/demo:
> - **SQL seed:** `finance01` dùng mật khẩu **`fin123`**.
> - **Dữ liệu seed ở frontend** (`AppContext.jsx`): `finance01` dùng **`finance123`**, và có thêm `donor02`, `local02`, `citizen02`, `volunteer02` (tổng **11 tài khoản**), trong đó `local03` ở trạng thái `pending_approval` để minh họa luồng chờ Admin phê duyệt.
>
> Trang đăng nhập hiện đối chiếu với dữ liệu seed trong `AppContext.jsx`, **không** gọi `/auth/login` của backend (xem mục 12 — Ghi chú kiểm chứng).

---

## 📘 Tài liệu API

Sau khi chạy backend, mở Swagger UI tại **`http://localhost:8080/api/swagger-ui.html`**.

**Định dạng phản hồi thống nhất** (`common/ApiResponse.java`):

```json
{
  "success": true,
  "message": "Thành công",
  "data": { },
  "timestamp": "2026-09-17T10:00:00"
}
```

Khi lỗi, `GlobalExceptionHandler` trả `{ "success": false, "error": "..." }` với mã tương ứng: `400` (validation → kèm map `field → message`), `401` (Unauthorized — *"Vui lòng đăng nhập"*), `403` (Forbidden — *"Không có quyền truy cập"*), `404` (`ResourceNotFoundException`), `500` (lỗi hệ thống).

### Danh sách endpoint theo controller (67 endpoint)

| Controller | Endpoint | Quyền |
|---|---|---|
| **Auth** (2) | `POST /auth/login` · `POST /auth/register` | Public |
| **Campaign** (6) | `GET /campaigns` · `GET /campaigns/active` · `GET /campaigns/{id}` | Public |
| | `POST /campaigns` · `PUT /campaigns/{id}` · `DELETE /campaigns/{id}` | `ADMIN` |
| **Disaster** (6) | `GET /disasters` · `GET /disasters/active` · `GET /disasters/{id}` | Public |
| | `POST` · `PUT /disasters/{id}` · `DELETE /disasters/{id}` | `ADMIN`, `LOCAL` |
| **Donation** (5) | `GET /donations` · `GET /donations/me` · `GET /donations/campaign/{campaignId}` · `POST /donations` | Đã đăng nhập |
| | `PATCH /donations/{id}/status` (xác minh / từ chối) | `finance` / `admin` (theo mô tả Swagger) |
| **SupportRequest** (5) | `GET /support-requests` · `GET /support-requests/status/{status}` | Đã đăng nhập |
| | `GET /support-requests/me` · `POST /support-requests` | Citizen |
| | `PATCH /support-requests/{id}/advance` (chuyển trạng thái 6 bước) | `ADMIN`, `LOCAL` |
| **Complaint** (5) | `GET /complaints` · `GET /complaints/me` · `POST /complaints` | Đã đăng nhập |
| | `PUT /complaints/{id}/reply` · `PATCH /complaints/{id}/close` | `ADMIN` |
| **Notification** (4) | `GET /notifications` · `GET /notifications/unread-count` · `PATCH /notifications/{id}/read` · `PATCH /notifications/read-all` | Đã đăng nhập |
| **Dashboard** (1) | `GET /dashboard/stats` | `ADMIN`, `FINANCE` |
| **User** (8) | `GET /users/me` · `PUT /users/me` · `PUT /users/me/password` | Đã đăng nhập |
| | `GET /users` · `GET /users/{id}` · `POST /users` · `PATCH /users/{id}/toggle-status` · `DELETE /users/{id}` | `ADMIN` |
| **VolunteerGroup** (6) | `GET /volunteer-groups` · `GET /volunteer-groups/active` · `GET /volunteer-groups/{id}` · `POST` · `PUT /{id}` · `DELETE /{id}` | Đã đăng nhập |
| **Inventory** (6) | `GET /inventory` · `GET /inventory/{id}` · `POST` · `PUT /{id}` · `PATCH /{id}/restock` · `DELETE /{id}` | Đã đăng nhập |
| **Warehouse** (3) | `GET /warehouses` · `POST /warehouses` · `DELETE /warehouses/{id}` | Đã đăng nhập |
| **Delivery** (5) | `GET /deliveries` · `GET /deliveries/status/{status}` · `POST` · `PATCH /{id}/status` · `DELETE /{id}` | Đã đăng nhập |
| **Ledger** (4) | `GET /ledger` · `GET /ledger/campaign/{campaignId}` · `POST /ledger` · `DELETE /{id}` | Đã đăng nhập |
| **FileUpload** (1) | `POST /uploads` (multipart, tối đa 10 MB) | Đã đăng nhập |

`GET /dashboard/stats` trả về `DashboardStats`: `totalUsers`, `totalCampaigns`, `activeCampaigns`, `totalDonations`, `totalDonationCount`, `activeDisasters`, `totalVolunteers`, `pendingSupportRequests`, `totalSupportRequests`, `totalDelivered`.

---

## 🧩 Design Patterns áp dụng

| Pattern | Tầng | Áp dụng trong mã nguồn |
|---|---|---|
| **Repository** | Backend | 14 interface `JpaRepository` — tự động sinh CRUD cho entity |
| **Service Layer** | Backend | 15 class `@Service` chứa toàn bộ logic nghiệp vụ, controller chỉ điều phối |
| **DTO** | Backend | 15 class DTO tách API contract khỏi entity, validate bằng `@Valid` |
| **Dependency Injection** | Backend | Constructor injection qua Lombok `@RequiredArgsConstructor` |
| **Global Exception Handler** | Backend | `@RestControllerAdvice` chuẩn hóa mọi lỗi về `ApiResponse` |
| **Context + Provider** | Frontend | `AppContext.jsx` cung cấp global state qua Context API |
| **Strategy (route guard)** | Frontend | `ProtectedRoute({ roles })` kiểm tra vai trò → điều hướng về `ROLE_HOME` |
| **Observer** | Frontend | `showToast()` → component `Toast` |
| **Singleton (module)** | Frontend | 15 service object trong `api.js` + `tokenManager` quản lý JWT tập trung |

---

## 🗄️ Cơ sở dữ liệu

### 45 bảng theo nhóm nghiệp vụ

| Nhóm | Bảng |
|---|---|
| **Người dùng & phân quyền** (8) | `users`, `roles`, `permissions`, `role_permissions`, `profiles`, `addresses`, `login_history`, `password_reset_tokens` |
| **Xác thực** (1) | `refresh_tokens` |
| **Chiến dịch** (5) | `campaigns`, `campaign_categories`, `campaign_images`, `campaign_updates`, `approvals` |
| **Thiên tai & nhu cầu** (5) | `disasters`, `support_requests`, `support_request_files`, `support_approvals`, `beneficiaries` |
| **Đóng góp & tài chính** (7) | `donations`, `donation_items`, `payments`, `payment_transactions`, `receipts`, `expense_records`, `financial_reports` |
| **Kho & vận chuyển** (6) | `warehouses`, `inventory`, `inventory_transactions`, `deliveries`, `delivery_items`, `attachments` |
| **Tình nguyện** (4) | `volunteers`, `volunteer_groups`, `volunteer_assignments`, `volunteer_checkin` |
| **Sổ cái & tương tác** (5) | `ledger`, `complaints`, `notifications`, `messages`, `comments` |
| **Hệ thống** (4) | `activity_logs`, `audit_logs`, `email_logs`, `system_settings` |

### Các bảng cốt lõi

| Bảng | Cột chính |
|---|---|
| `users` | `id`, `full_name`, `username` (UNIQUE), `email` (UNIQUE), `password` (`COMMENT 'BCrypt hash in production'`), `phone`, `avatar_url`, `status` ENUM(`ACTIVE`,`INACTIVE`,`BANNED`), `role_id` FK → `roles` `ON DELETE SET NULL` |
| `roles` | `id`, `name` (UNIQUE), `description` |
| `campaigns` | `id`, `title`, `description`, `category_id`, `target_amount` `DECIMAL(18,2)`, `current_amount`, `start_date`, `end_date`, `status`, `area`, `manager_id` FK → `users` |
| `donations` | `id`, `user_id`, `campaign_id`, `amount`, `message`, `is_anonymous`, `status` ENUM(`PENDING`,`CONFIRMED`,`REFUNDED`,`CANCELLED`), `donated_at` |
| `support_requests` | `id`, `citizen_id`, `campaign_id`, `request_code` (UNIQUE), `item_name`, `quantity`, `unit`, `area`, `urgency`, `reason`, `household_count`, `status` (**7 giá trị, 6 bước + `REJECTED`**), `notes`, `confirmed_at` |
| `inventory` | `id`, `item_name`, `category`, `quantity`, `unit`, `min_stock`, `warehouse_id` |
| `deliveries` | `id`, `delivery_code`, `request_id`, `campaign_id`, `driver_id`, `vehicle_type`, `license_plate`, `origin`, `destination`, `depart_at`, `status` |
| `ledger` | `id`, `campaign_id`, `type` ENUM(`INCOME`,`EXPENSE`), `amount` `DECIMAL(18,2)`, `description`, `reference_type`, `reference_id`, `recorded_by`, `recorded_at` |
| `complaints` | `id`, `complaint_code`, `sender_id`, `sender_name`, `sender_role`, `type`, `subject`, `content`, `contact_info`, `status`, `admin_reply`, `progress` |
| `notifications` | `id`, `user_id`, `title`, `body`, `type`, `is_read`, `link` |
| `volunteer_groups` | `id`, `name`, `leader_id`, `area`, `description`, `status` |

### Enum trạng thái (đối chiếu giữa entity Java và schema SQL)

```text
CampaignStatus   : DRAFT → ACTIVE → PAUSED → COMPLETED | CANCELLED
DonationStatus   : PENDING → CONFIRMED | REFUNDED | CANCELLED
RequestStatus    : PENDING → VERIFIED → APPROVED → WAREHOUSE_READY
                   → IN_TRANSIT → DELIVERED | REJECTED
DeliveryStatus   : SCHEDULED → IN_TRANSIT → DELIVERED | FAILED
DisasterStatus   : ACTIVE | RESOLVED | MONITORING
Severity/Urgency : LOW | MEDIUM | HIGH | CRITICAL
ComplaintStatus  : PENDING → IN_REVIEW → REPLIED → CLOSED
GroupStatus      : ACTIVE | INACTIVE
VolunteerStatus  : ACTIVE | INACTIVE | SUSPENDED
UserStatus       : ACTIVE | INACTIVE | BANNED
LedgerType       : INCOME | EXPENSE
```

### View & stored procedure

| Đối tượng | Loại | Mục đích |
|---|---|---|
| `active_users` | View | Danh sách người dùng đang hoạt động kèm vai trò |
| `v_campaign_summary` | View | Tổng hợp tiến độ từng chiến dịch (mục tiêu / đã nhận) |
| `v_need_status` | View | Trạng thái các yêu cầu hỗ trợ |
| `v_complaint_history` | View | Lịch sử khiếu nại kèm thông tin người gửi |
| `restock_inventory(p_inventory_id, ...)` | Procedure | Nhập thêm hàng vào kho, ghi log biến động |
| `advance_need_status(...)` | Procedure | Chuyển trạng thái yêu cầu hỗ trợ theo quy trình 6 bước |

### Dữ liệu mẫu (`seed_data.sql`)

| Thực thể | Số lượng | Ghi chú |
|---|---|---|
| Chiến dịch | 4 | 3 `ACTIVE`, 1 `COMPLETED` (Sơn La) |
| Thiên tai | 4 | 3 `ACTIVE`, 1 `RESOLVED` |
| Mặt hàng kho | 8 | Trải trên 3 kho: Hà Nội, TP.HCM, Đà Nẵng |
| Đóng góp | 5 | 4 `CONFIRMED`, 1 `PENDING` |
| Yêu cầu hỗ trợ | 4 | `VERIFIED`, `PENDING`, `DELIVERED`, `APPROVED` |
| Chuyến giao hàng | 3 | `SCHEDULED`, `IN_TRANSIT`, `DELIVERED` |
| Bút toán sổ cái | 6 | 3 `INCOME`, 3 `EXPENSE` |
| Nhóm tình nguyện | 2 | miền Trung, Đà Nẵng |
| Khiếu nại | 2 | 1 `REPLIED`, 1 `CLOSED` |
| Thông báo | 4 | `info`, `warning`, `success` |

---

## 🧪 Kiểm thử

```bash
# Backend — 13 test trên H2 in-memory
cd backend && mvn test

# Frontend — build + lint
cd frontend && npm run build && npm run lint
```

| File test | Số `@Test` | Nội dung |
|---|---|---|
| `AuthControllerTest` | 6 | Login thành công / sai mật khẩu, Register thành công / trùng username, sinh & xác thực JWT |
| `CampaignControllerTest` | 5 | Admin tạo campaign, Donor bị từ chối (403), `GET /campaigns` public, truy cập không token → 401 |
| `ReliefHubApplicationTests` | 2 | Load application context |

### Kịch bản kiểm thử tích hợp (E2E)

| # | Kịch bản | Các bước | Kết quả mong đợi |
|---|---|---|---|
| 1 | Đóng góp chuyển khoản | Donor → chọn chiến dịch → chuyển khoản → gửi minh chứng → Finance xác minh | Biên nhận `RH-REC-xxx`, đóng góp chuyển `PENDING → CONFIRMED` |
| 2 | Quy trình 6 bước | Citizen → gửi yêu cầu → Local xác minh → duyệt → kho chuẩn bị → vận chuyển → bàn giao | Trạng thái đi đúng 6 bước tới `DELIVERED` |
| 3 | Tham gia nhóm TNV | Volunteer → tạo/tham gia nhóm → Admin duyệt → nhận chuyến vận chuyển → cập nhật trao hàng | Thành viên được ghi nhận, chuyến giao cập nhật trạng thái |
| 4 | Khiếu nại | Donor → gửi khiếu nại → Admin phản hồi kèm tiến độ → đóng | `PENDING → REPLIED → CLOSED` |
| 5 | Sổ cái | Finance → ghi bút toán `INCOME` → ghi bút toán `EXPENSE` theo chiến dịch | Bút toán truy vết được về đóng góp/chuyến giao qua `reference_type` + `reference_id` |

---

## 🐳 Triển khai (Deployment)

Gói source **chưa có cấu hình container** — không tìm thấy `Dockerfile`, `docker-compose.yml` hay cấu hình Nginx. Để triển khai, hiện có hai cách đã được kiểm chứng trong hướng dẫn:

```bash
# Cách 1 — Backend đóng gói JAR, chạy trực tiếp
cd backend && mvn clean package -DskipTests
java -jar target/reliefhub-backend-1.0.0.jar

# Cách 2 — Frontend build tĩnh, phục vụ qua web server
cd frontend && npm run build     # → dist/ (có thể deploy lên Nginx/Hosting tĩnh)
```

**Đề xuất bổ sung:** nếu muốn chuẩn hóa triển khai bằng container, có thể thêm `docker-compose.yml` gồm 3 service `mysql` (mount sẵn `reliefhub_database.sql` + `seed_data.sql` vào `/docker-entrypoint-initdb.d`), `backend` (build từ `backend/Dockerfile`, phụ thuộc `mysql` healthy) và `frontend` (build từ `frontend/Dockerfile`, phục vụ qua Nginx). Các biến `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_PASSWORD`, `JWT_SECRET` nên đưa ra `.env` ngoài repository.

---

## 🔐 Bảo mật

| Vấn đề (đã kiểm chứng trong source) | Rủi ro | Khuyến nghị |
|---|---|---|
| `application.yml` **hardcode** `app.jwt.secret` (`"ReliefHubSecretKey2026..."`) | Lộ khoá ký JWT → giả mạo token | Đưa ra biến môi trường `${JWT_SECRET}`, dùng chuỗi ngẫu nhiên ≥ 64 ký tự, xoay khoá |
| `application.yml` ghi `username: root` / `password: root` | Lộ thông tin CSDL | Dùng `.env` + biến môi trường |
| `reliefhub_database.sql` seed **mật khẩu plain-text** cho 6 tài khoản | Bất kỳ ai có file đều biết mật khẩu | Giữ nguyên cho môi trường demo, nhưng **không dùng cho production**; ghi rõ trong README |
| Repository **không có `.gitignore`** | Rác IDE/OS (`.DS_Store`, `target/`, `node_modules/`, `dist/`) bị commit | Bổ sung `.gitignore` cho Java + Node + IDE |
| Không có `.env.example` mặc dù có `.env` | Người clone thiếu mẫu cấu hình | Thêm `.env.example` với giá trị rỗng |
| Không có file `LICENSE` | Không rõ quyền sử dụng | Thêm `LICENSE` (MIT) nếu muốn công khai |

---

## 🧹 Ghi chú kiểm chứng — mẫu README cũ vs. mã nguồn thực tế


| Mục | README mẫu ghi | Mã nguồn thực tế |
|---|---|---|
| Số bảng CSDL | "35+ bảng" | **45 bảng** (`grep -c "CREATE TABLE"`) + 4 view + 2 procedure |
| Số trang frontend | "37 trang JSX" | **43 file** trong `src/pages/` (1 file `volunteer/Report.jsx` chưa gán route) |
| Số endpoint | "60+" / "60+ endpoints" | **67** annotation `@GetMapping`/`@PostMapping`/… |
| Số DTO | "16 DTO" (trong `HUONG_DAN_CHAY.md`) | **15 file** trong `dto/` |
| Số test | "10/10 tests pass" | **13 `@Test`** (6 + 5 + 2) trong 3 file |
| `Ledger` | "append-only kèm số dư running total" | Bảng `ledger` **không có cột `balance`**; service chỉ ghi/đọc bút toán `INCOME`/`EXPENSE` — chưa có tính số dư luỹ kế ở backend |
| Enum tài chính | "THU/CHI" | Thực tế là **`INCOME`/`EXPENSE`** |
| `GroupStatus` | "PENDING → RECRUITING → ACTIVE → COMPLETED \| REJECTED" | Thực tế chỉ có **`ACTIVE`, `INACTIVE`** |
| `MissionStatus` | "OPEN → ASSIGNED → IN_PROGRESS → …" | **Không tồn tại enum này**; liên quan là `VolunteerStatus` (`ACTIVE/INACTIVE/SUSPENDED`) và `DeliveryStatus` |
| `DeliveryStatus` | Không nêu | `SCHEDULED → IN_TRANSIT → DELIVERED \| FAILED` |
| Tài khoản finance | `finance01 / finance123` | SQL seed là **`fin123`**; dữ liệu seed frontend là `finance123` → **cần đồng bộ** |
| Số tài khoản demo | 6 | SQL seed 6 tài khoản; seed frontend **11 tài khoản** |
| Docker | Có `docker-compose.yml` + Nginx | **Không có** file Docker/Nginx nào trong repo |
| `backend/README.md` | — | Vẫn ghi *"Java 17"*, *"16 entities"*, *"9 services"*, *"9 controllers"*, *"10 DTO"* → **đã lỗi thời** so với thực tế (Java 21, 17/15/15/15) |
| `HUONG_DAN_CHAY.md` | — | Ghi *"48 bảng"*, *"50+ trang"*, *"10/10 tests"* → **không khớp** số đo thực tế |
| File SQL trùng lặp | — | `reliefhub_database.sql` xuất hiện **3 bản y hệt** (gốc, `backend/`, `frontend/`) và `reliefhub_full.sql` **2 bản** (md5 giống nhau) → nên giữ 1 bản trong `database/` |
| Rác hệ điều hành | — | Có `.DS_Store` ở thư mục gốc và thư mục lồng `ReliefHub.zip/` |
| Maven Wrapper | — | `backend/` **không có** `mvnw` ⇒ bắt buộc cài Maven |

**Một điểm kỹ thuật đáng lưu ý ở frontend:** `AppContext.jsx` (826 dòng) chứa **toàn bộ dữ liệu seed** (tài khoản, chiến dịch, đóng góp, kho, thiên tai, nhóm TNV…) và hàm `login()` so khớp trực tiếp với mảng `accounts`, nên ứng dụng **chạy được độc lập không cần backend**. Trong file có 2 chỗ tham chiếu biến `API_ENABLED` (dòng 558 và 780) nhưng **không tìm thấy dòng khai báo hay import nào** cho biến này; `frontend/src/services/api.js` cũng chưa được import vào `AppContext.jsx`. Nếu gặp lỗi `API_ENABLED is not defined`, cần bổ sung `const API_ENABLED = import.meta.env.VITE_API_ENABLED === 'true';` (biến `VITE_API_ENABLED=true` đã có sẵn trong `frontend/.env`) rồi nối `api.js` vào context để dùng dữ liệu thật từ backend.

---

## 🗺️ Hướng phát triển

- [ ] Nối toàn bộ `AppContext` với REST API (hiện mới có 2 nhánh gọi API) và loại bỏ dữ liệu seed khỏi frontend
- [ ] Bổ sung CRUD cho `volunteer_assignments` và luồng nhiệm vụ tình nguyện viên
- [ ] Sinh QR chuyển khoản động (VietQR) thay cho trường `qrImage` đang để trống
- [ ] Bổ sung cột `balance` / báo cáo số dư luỹ kế cho `ledger` và `financial_reports`
- [ ] Áp `@PreAuthorize` chi tiết cho từng endpoint hiện mới ở mức "đã đăng nhập" (`donations`, `inventory`, `deliveries`, `ledger`)
- [ ] Gửi email/notification tự động khi đóng góp được xác minh (bảng `email_logs` đã có sẵn)
- [ ] Bổ sung Docker Compose + Nginx như mục 11 (đề xuất)
- [ ] Viết thêm test cho các service nghiệp vụ (hiện test tập trung ở Auth và Campaign)
- [ ] Thêm `.gitignore`, `.env.example`, `LICENSE` và gộp các file SQL trùng lặp

---

## 🤝 Đóng góp

1. Fork repository
2. Tạo nhánh tính năng: `git checkout -b feature/ten-tinh-nang`
3. Commit theo chuẩn: `git commit -m "feat: thêm chức năng X"`
4. Push: `git push origin feature/ten-tinh-nang`
5. Mở **Pull Request** kèm mô tả chi tiết

---


<div align="center">

**© 2026 ReliefHub — Nhóm 06, học phần Phân tích và Thiết kế Phần mềm**

Nếu dự án hữu ích, hãy để lại một ⭐ trên GitHub!

</div>

