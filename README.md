# ReliefHub — Hệ thống Quản lý Cứu trợ Thiên tai

<p align="center">
  <img src="https://img.shields.io/badge/Java-21-orange?logo=openjdk&logoColor=white" alt="Java 21"/>
  <img src="https://img.shields.io/badge/Spring%20Boot-3.2.5-green?logo=springboot&logoColor=white" alt="Spring Boot"/>
  <img src="https://img.shields.io/badge/React-19-blue?logo=react&logoColor=white" alt="React 19"/>
  <img src="https://img.shields.io/badge/Vite-8-purple?logo=vite&logoColor=white" alt="Vite 8"/>
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white" alt="MySQL"/>
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwindcss&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white" alt="Docker"/>
</p>

<p align="center">
  <strong>Nền tảng kết nối Nhà tài trợ — Chính quyền địa phương — Tình nguyện viên</strong>
  <br/>
  <strong>Số hóa toàn bộ quy trình cứu trợ thiên tai: tiếp nhận đóng góp → phân bổ → giao hàng → báo cáo minh bạch</strong>
</p>

---

## Giới thiệu

**ReliefHub** là hệ thống phần mềm quản lý cứu trợ thiên tai, được phát triển trong khuôn khổ học phần Phân tích và Thiết kế Phần mềm tại Đại học Phenikaa. Hệ thống hướng đến việc giải quyết bài toán thiếu minh bạch trong hoạt động cứu trợ tại Việt Nam, kết nối sáu nhóm người dùng trong một quy trình xuyên suốt từ tiếp nhận đóng góp, phân bổ nguồn lực, giao hàng cứu trợ đến báo cáo tài chính.

### Vấn đề giải quyết

| # | Vấn đề thực tế | Giải pháp của ReliefHub |
|---|---|---|
| 1 | Thiếu kênh quyên góp chính thức, được kiểm chứng | Ba hình thức đóng góp: chuyển khoản (QR), hiện vật, tiền mặt — đều có biên nhận điện tử |
| 2 | Khó theo dõi hành trình hàng cứu trợ | Quy trình 6 bước: `PENDING → VERIFIED → APPROVED → WAREHOUSE_READY → IN_TRANSIT → DELIVERED` |
| 3 | Thiếu cơ chế phối hợp tình nguyện viên | Quản lý nhóm tình nguyện, phân công nhiệm vụ cứu trợ, báo cáo thực địa |
| 4 | Không có kênh phản ánh minh bạch | Hệ thống khiếu nại có mã định danh, Admin phản hồi kèm tỷ lệ tiến độ |
| 5 | Sổ cái tài chính không kiểm toán được | Sổ cái (Ledger) append-only kèm số dư running total |

---

## Tính năng chính

### Sáu vai trò người dùng (RBAC)

| Vai trò | Màu theme | Số trang | Chức năng cốt lõi |
|---|---|---|---|
| Quản trị viên | Xanh dương | 9 | Quản lý tài khoản, chiến dịch, kho, phân bổ, nhiệm vụ, báo cáo, khiếu nại |
| Nhà tài trợ | Xanh lá | 8 | Đóng góp ba hình thức, xem lịch sử, biên nhận, theo dõi minh bạch, khiếu nại |
| Ban tài chính | Vàng | 3 | Xác minh đóng góp, cấp biên nhận, sổ cái thu/chi, báo cáo tài chính |
| Cán bộ địa phương | Cam | 5 | Cập nhật thiên tai, xử lý yêu cầu 6 bước, quản lý giao hàng bàn giao |
| Người dân | Tím | 4 | Gửi yêu cầu hỗ trợ, theo dõi tiến trình 6 bước, xem biên nhận hỗ trợ |
| Tình nguyện viên | Hồng | 5 | Tạo/tham gia nhóm, ứng tuyển nhiệm vụ, cập nhật hồ sơ kỹ năng |

### Danh sách use-case (24 use-case)

<details>
<summary><b>Xem đầy đủ danh sách 24 use-case</b></summary>

| Nhóm | Use-case | Mô tả |
|---|---|---|
| **R0 — Dùng chung** | UC1.1 | Đăng ký tài khoản (wizard nhiều bước theo vai trò) |
| | UC1.2 | Đăng nhập (JWT Bearer Token) |
| | UC1.3 | Quản lý hồ sơ người dùng |
| | UC1.4 | Quản trị tài khoản (Admin) |
| | UC6.3 | Theo dõi thông báo hệ thống |
| **R1 — Nhà tài trợ** | UC2.1 | Đóng góp chuyển khoản (QR + nội dung tự sinh) |
| | UC2.2 | Đóng góp hiện vật (chọn vật phẩm + phương thức giao) |
| | UC2.3 | Đặt lịch đóng góp tiền mặt |
| | UC2.4 | Xác minh đóng góp và cấp biên nhận |
| | UC2.5 | Tra cứu lịch sử, biên nhận, theo dõi sử dụng đóng góp |
| | UC2.6 | Gửi khiếu nại hoặc phản hồi |
| **R2 — Người dân** | UC3.1 | Cập nhật thông tin thiên tai |
| | UC3.2 | Gửi yêu cầu hỗ trợ |
| | UC3.3 | Xử lý trạng thái yêu cầu theo quy trình 6 bước |
| | UC3.4 | Theo dõi trạng thái và biên nhận hỗ trợ |
| **R3 — Cán bộ địa phương** | UC4.1 | Quản lý kho và danh mục cứu trợ |
| | UC4.2 | Quản lý chiến dịch cứu trợ |
| | UC4.3 | Phân bổ nguồn cứu trợ |
| | UC4.4 | Quản lý vận chuyển và bàn giao |
| **R4 — Ban tài chính** | UC6.1 | Lập báo cáo thống kê |
| | UC6.2 | Theo dõi sổ cái tài chính |
| **R5 — Tình nguyện viên** | UC5.1 | Quản lý nhóm tình nguyện |
| | UC5.2 | Quản lý nhiệm vụ cứu trợ |
| | UC5.3 | Cập nhật hồ sơ và ứng tuyển nhiệm vụ |

</details>

### Điểm nổi bật

- Ba hình thức đóng góp với mã QR tự sinh và nội dung chuyển khoản đối soát tự động (`RH-{campaign}-{user}`)
- Quy trình 6 bước xử lý yêu cầu hỗ trợ, hiển thị trực quan cho người dân theo dõi
- Biên nhận điện tử có mã duy nhất (`RH-REC-XXX`) cho mỗi khoản đóng góp hợp lệ
- Sổ cái append-only (Ledger) kèm số dư running total, phục vụ kiểm toán
- Donation Tracking — nhà tài trợ xem cách đóng góp được sử dụng thực tế
- Dashboard thống kê với biểu đồ Recharts cho Admin và Finance
- Sponsor Board — bảng xếp hạng nhà tài trợ công khai
- Swagger UI tự động tại `/api/swagger-ui.html`

---

## Kiến trúc hệ thống

```
┌─────────────────────────────────────────────────────────────────────┐
│                        TRÌNH DUYỆT NGƯỜI DÙNG                       │
│                                                                     │
│   ReactJS 19 + Vite 8 + Tailwind CSS 3.4 + Framer Motion + Recharts │
│   37 trang JSX | 6 dashboard theo vai trò | Context API state       │
└──────────────────────────────┬──────────────────────────────────────┘
                               │ REST API (JSON)
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       BACKEND (SPRING BOOT)                         │
│                                                                     │
│   Java 21 + Spring Boot 3.2.5 + Spring Security 6 (JWT)             │
│   15 Controller → 15 Service → 17 Entity → Spring Data JPA          │
│   Swagger UI | @PreAuthorize RBAC | BCrypt | GlobalExceptionHandler │
└──────────────────────────────┬──────────────────────────────────────┘
                               │ JDBC / JPA / Hibernate
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        DATABASE (MYSQL 8.0)                         │
│                                                                     │
│   35+ bảng | 3NF | InnoDB (ACID) | ENUM status fields               │
│   H2 in-memory cho test/CI                                          │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Công nghệ sử dụng

### Frontend

| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| ReactJS | 19 | Thư viện UI component-based, hooks, Context API |
| Vite | 8 | Build tool + dev server (HMR) |
| React Router | v7 | Protected routes theo vai trò, nested routes |
| Tailwind CSS | 3.4 | Utility-first CSS, responsive 360px–1920px |
| Framer Motion | 12 | Animation chuyển trang, hover effects |
| Recharts | 3 | Biểu đồ thống kê (bar, pie, line) cho Dashboard |
| Lucide React | — | Bộ icon SVG nhất quán, tree-shaking |

### Backend

| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| Java | 21 | Ngôn ngữ chính, Virtual Threads (Project Loom) |
| Spring Boot | 3.2.5 | Framework enterprise, auto-configuration, Tomcat |
| Spring Security | 6 | Xác thực JWT + phân quyền RBAC (@PreAuthorize) |
| Spring Data JPA | — | Repository pattern, tự động sinh CRUD |
| Hibernate | — | ORM, ánh xạ entity-table, chống SQL Injection |
| JJWT | 0.12.5 | Tạo và xác thực JWT (HMAC-SHA256) |
| Lombok | — | Giảm boilerplate (@Data, @Builder, @RequiredArgsConstructor) |
| SpringDoc OpenAPI | 2.3 | Swagger UI tự động |
| Maven | 3.9 | Build tool + dependency management |

### Database & DevOps

| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| MySQL | 8.0 | CSDL quan hệ production, 35+ bảng, InnoDB (ACID) |
| H2 Database | — | CSDL in-memory cho test/CI |
| Docker Compose | — | Orchestration 3 service: mysql, backend, frontend |
| Nginx | — | Reverse proxy, serve static frontend |

---

## Cấu trúc mã nguồn

```
ReliefHub/
├── backend/                              # Spring Boot REST API
│   ├── src/main/java/com/reliefhub/
│   │   ├── controller/                   # 15 REST Controller
│   │   ├── service/                      # 15 Service (business logic)
│   │   ├── entity/                       # 17 JPA Entity
│   │   ├── repository/                   # Spring Data JPA Repository
│   │   ├── dto/                          # Data Transfer Objects
│   │   ├── common/                       # ApiResponse, Enum, ExceptionHandler
│   │   ├── security/                     # JwtUtil, JwtFilter, SecurityConfig
│   │   └── config/                       # OpenApiConfig, DataInitializer, CorsConfig
│   ├── src/main/resources/
│   │   └── application.yml
│   ├── pom.xml
│   └── Dockerfile
│
├── frontend/                             # React SPA
│   ├── src/
│   │   ├── pages/
│   │   │   ├── admin/                    # 9 trang (Dashboard, Accounts, ...)
│   │   │   ├── donor/                    # 8 trang (Contribute, History, ...)
│   │   │   ├── finance/                  # 3 trang (Verify, Ledger)
│   │   │   ├── local/                    # 5 trang (Disasters, Needs, ...)
│   │   │   ├── citizen/                  # 4 trang (Request, Status, ...)
│   │   │   ├── volunteer/                # 5 trang (Groups, Delivery, ...)
│   │   │   └── public/                   # 5 trang (Home, Login, Register, ...)
│   │   ├── context/
│   │   │   └── AppContext.jsx            # Global state (Context API)
│   │   ├── services/
│   │   │   └── api.js                    # 15 service object (REST API)
│   │   ├── components/                   # DashboardLayout, Sidebar, Toast
│   │   ├── App.jsx                       # Root + Router (ProtectedRoute)
│   │   └── main.jsx                      # Entry point
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── Dockerfile
│
├── database/                             # SQL scripts
│   ├── reliefhub_full.sql                # Full schema + seed data
│   ├── reliefhub_database.sql            # Schema only
│   └── seed_data.sql                     # Seed data only
│
├── docker-compose.yml                    # 3 service orchestration
├── README.md
└── .gitignore
```

---

## Cài đặt và chạy

### Yêu cầu hệ thống

- Java 21 (JDK)
- Maven 3.9+
- Node.js 20+ và npm
- MySQL 8.0 (hoặc dùng Docker)
- Docker + Docker Compose (nếu chạy container)

### Cách 1: Chạy bằng Docker Compose

```bash
git clone https://github.com/reliefhub/reliefhub.git
cd reliefhub

cp .env.example .env
# Chỉnh sửa JWT_SECRET, MySQL password trong .env

docker-compose up --build

# Frontend:  http://localhost
# Backend:   http://localhost:8080
# Swagger:   http://localhost:8080/api/swagger-ui.html
```

### Cách 2: Chạy thủ công (Development)

#### Backend

```bash
cd backend
mvn spring-boot:run
# Backend chạy tại http://localhost:8080
# Swagger UI: http://localhost:8080/api/swagger-ui.html
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
# Frontend chạy tại http://localhost:5173
# Vite proxy /api → http://localhost:8080
```

#### Database

```bash
mysql -u root -p < database/reliefhub_database.sql
mysql -u root -p reliefhub < database/seed_data.sql
```

### Tài khoản demo

| Vai trò | Username | Password | Dashboard |
|---|---|---|---|
| Admin | `admin` | `admin123` | `/admin/dashboard` |
| Donor | `donor01` | `donor123` | `/donor/dashboard` |
| Finance | `finance01` | `finance123` | `/finance/dashboard` |
| Local | `local01` | `local123` | `/local/dashboard` |
| Citizen | `citizen01` | `citizen123` | `/citizen/dashboard` |
| Volunteer | `volunteer01` | `vol123` | `/volunteer/dashboard` |

---

## Tài liệu API

Sau khi khởi động backend, truy cập Swagger UI tại:

```
http://localhost:8080/api/swagger-ui.html
```

### Các API endpoint chính

| Method | Endpoint | Mô tả | Phân quyền |
|---|---|---|---|
| `POST` | `/api/auth/login` | Đăng nhập, nhận JWT | Public |
| `POST` | `/api/auth/register` | Đăng ký tài khoản | Public |
| `GET` | `/api/campaigns` | Danh sách chiến dịch | Public |
| `POST` | `/api/donations` | Gửi đóng góp | Donor |
| `PATCH` | `/api/donations/{id}/status` | Xác minh/từ chối đóng góp | Finance/Admin |
| `GET` | `/api/support-requests` | Danh sách yêu cầu hỗ trợ | Admin/Local |
| `PATCH` | `/api/support-requests/{id}/advance` | Chuyển trạng thái 6 bước | Admin/Local |
| `GET` | `/api/inventory` | Tồn kho | Admin/Local |
| `POST` | `/api/deliveries` | Tạo chuyến giao hàng | Admin/Local |
| `GET` | `/api/ledger` | Sổ cái tài chính | Finance/Admin |
| `GET` | `/api/dashboard/stats` | Thống kê tổng quan | Admin/Finance |

> **Format phản hồi**: `ApiResponse<T> { success, message, data }`

---

## Design Patterns áp dụng

| Pattern | Layer | Áp dụng |
|---|---|---|
| Repository | Backend | Spring Data JPA tự động sinh CRUD cho 17 entity |
| Service Layer | Backend | 15 Service class chứa toàn bộ logic nghiệp vụ |
| DTO | Backend | Tách biệt API contract khỏi Entity |
| Context + Provider | Frontend | AppContext.jsx cung cấp global state qua Context API |
| Strategy | Frontend | ProtectedRoute kiểm tra role → điều hướng dashboard |
| Observer | Frontend | Toast notification: showToast() → Toast component |
| Singleton | Frontend | 15 service object trong api.js |

---

## Cơ sở dữ liệu

### Các bảng chính (35+ bảng, chuẩn 3NF)

| Bảng | Mô tả | Các cột chính |
|---|---|---|
| `users` | Người dùng | id, username, email, password (BCrypt), role_id, status |
| `roles` | Vai trò | id, name (ADMIN/DONOR/FINANCE/LOCAL/CITIZEN/VOLUNTEER) |
| `campaigns` | Chiến dịch | id, title, target_amount, current_amount, status, area |
| `donations` | Đóng góp | id, user_id, campaign_id, amount, type, status |
| `support_requests` | Yêu cầu hỗ trợ | id, citizen_id, items, urgency, status, managed_by |
| `inventory` | Tồn kho | id, name, category, quantity, min_quantity |
| `deliveries` | Giao hàng | id, support_request_id, status, delivered_at |
| `volunteer_groups` | Nhóm TNV | id, name, leader_id, area, status |
| `ledger` | Sổ cái | id, campaign_id, type (THU/CHI), amount, balance |
| `complaints` | Khiếu nại | id, user_id, title, status, admin_reply |
| `notifications` | Thông báo | id, user_id, title, content, is_read |

### Enum trạng thái

```
CampaignStatus:   DRAFT → ACTIVE → PAUSED → COMPLETED | CANCELLED
DonationStatus:   PENDING → VERIFIED | REJECTED
SupportRequest:   PENDING → VERIFIED → APPROVED → WAREHOUSE_READY → IN_TRANSIT → DELIVERED | REJECTED
DeliveryStatus:   PENDING → IN_TRANSIT → DELIVERED
GroupStatus:      PENDING → RECRUITING → ACTIVE → COMPLETED | REJECTED
MissionStatus:    OPEN → ASSIGNED → IN_PROGRESS → COMPLETED | CANCELLED
```

---

## Kiểm thử

```bash
# Backend unit test (H2 in-memory)
cd backend && mvn test

# Frontend build check
cd frontend && npm run build && npm run lint
```

### Kịch bản kiểm thử tích hợp (E2E)

| # | Kịch bản | Các bước | Kết quả mong đợi |
|---|---|---|---|
| 1 | Đóng góp chuyển khoản | Donor → chiến dịch → chuyển khoản → minh chứng → Finance xác minh | Biên nhận RH-REC-XXX |
| 2 | Quy trình 6 bước | Citizen → yêu cầu → Local → 6 bước → giao hàng → biên nhận | Trạng thái chuyển đúng 6 bước |
| 3 | Tham gia nhóm TNV | Volunteer → tạo nhóm → Admin duyệt → gửi đơn → leader duyệt | Thành viên được thêm |
| 4 | Khiếu nại | Donor → khiếu nại → Admin phản hồi → đóng | Trạng thái replied → closed |
| 5 | Sổ cái | Finance → bút toán thu → bút toán chi → số dư | Số dư running total đúng |

---

## Docker Deployment

```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: reliefhub
      MYSQL_ROOT_PASSWORD: ${MYSQL_PASSWORD}
    volumes:
      - mysql_data:/var/lib/mysql
      - ./database/reliefhub_database.sql:/docker-entrypoint-initdb.d/01-schema.sql
      - ./database/seed_data.sql:/docker-entrypoint-initdb.d/02-seed.sql
    ports: ["3306:3306"]
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      retries: 5

  backend:
    build: ./backend
    depends_on:
      mysql: { condition: service_healthy }
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/reliefhub
      SPRING_DATASOURCE_PASSWORD: ${MYSQL_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
    ports: ["8080:8080"]

  frontend:
    build: ./frontend
    depends_on: [backend]
    ports: ["80:80"]
    environment:
      VITE_API_URL: http://localhost:8080/api

volumes:
  mysql_data:
```

---

## Nhóm phát triển

### Bảng phân công công việc

| STT | MSSV | Họ và tên | Lập trình | Tài liệu | Đóng góp |
|---|---|---|---|---|---|
| 1 | 23012156 | Ngô Thị Minh Phương | Backend (10 Controller + 10 Service + 12 Entity) + Frontend (AppContext, api.js, 37 trang JSX, components) + Docker Compose. Thiết kế sơ đồ. Kiểm thử tích hợp E2E. | Chương 1 (24 use-case đặc tả, R0–R6) + Chương 3 (thiết kế: class diagram, ERD(35+ bảng)) + Chương 4 (cài đặt: công nghệ, design pattern, deployment). Biên tập và chỉnh sửa toàn bộ báo cáo. README Github. | 34% |
| 2 | 23010871 | Nguyễn Thị Thu Giang | Frontend UI/UX (6 dashboard, Tailwind theme, Framer Motion, Recharts). Thiết kế sơ đồ (use-case, sequence, class, ERD, architecture, deployment). Kiểm thử tích hợp E2E. | Chương 2 (phân tích use-case, kiến trúc BCE) + Chương 3 (thiết kế API (40+ endpoint)) + Chương 5 (kết luận). Danh mục hình ảnh, danh mục bảng biểu. Slide thuyết trình. | 34% |
| 3 | 23010027 | Hoàng Như Quỳnh | Backend (5 Controller + 5 Service + 5 Entity: Auth, User, Campaign, Donation, Complaint). Security: JwtUtil, JwtFilter, SecurityConfig. Unit test. | Lời mở đầu, lời cảm ơn. Thuật ngữ (128 thuật ngữ). Yêu cầu phi chức năng NF1–NF8 (53 yêu cầu). Phạm vi dự án + Chương 2 (phân tích kiến trúc hệ thống). Slide thuyết trình. | 32% |

<details>
<summary><b>Chi tiết phân công theo thành viên</b></summary>

#### Ngô Thị Minh Phương — 34%

**Lập trình:**
- Backend: InventoryController, DeliveryController, VolunteerGroupController, SupportRequestController, LedgerController, NotificationController, DashboardController, DisasterController, WarehouseController, FileUploadController (10 Controller + 10 Service + 12 Entity + DTO + Repository). Config: DataInitializer, OpenApiConfig, CorsConfig.
- Frontend: AppContext.jsx (Context API), api.js (15 service object), App.jsx (React Router + ProtectedRoute), 37 trang JSX (admin 9, donor 8, finance 3, local 5, citizen 4, volunteer 5, public 5), components (DashboardLayout, Sidebar, PageTransition, Toast).
- DevOps: docker-compose.yml, Dockerfile backend (multi-stage), Dockerfile frontend (Nginx).
  
**Lập trình và thiết kế giao diện:**
- Thiết kế sơ đồ: use-case tổng quan, 2 phân rã, deployment, 12 giao diện minh họa.

**Kiểm thử tích hợp:**
- 2 kịch bản E2E: tham gia nhóm TNV, khiếu nại.

**Tài liệu:**
- Chương 1: đặc tả 24 use-case chi tiết, yêu cầu chức năng R0–R6, bảng ánh xạ, sơ đồ use-case.
- Chương 3: class diagram, ERD (35+ bảng).
- Chương 4: lựa chọn công nghệ, cấu trúc mã nguồn, design pattern, deployment.
- Biên tập và chỉnh sửa toàn bộ báo cáo.
- README Github.

---

#### Nguyễn Thị Thu Giang — 34%

**Lập trình và thiết kế giao diện:**
- Thiết kế UI/UX cho 6 dashboard, Tailwind CSS theme 6 vai trò, Framer Motion animation, Recharts biểu đồ.
- Thiết kế sơ đồ: use-case tổng quan, 4 phân rã, sequence, class diagram, ERD, architecture, deployment, 12 giao diện minh họa.

**Kiểm thử tích hợp:**
- 3 kịch bản E2E: đóng góp chuyển khoản, quy trình 6 bước, sổ cái.

**Tài liệu:**
- Chương 2: phân tích use-case, kiến trúc BCE, sequence diagram.
- Chương 3: thiết kế API (40+ endpoint).
- Chương 5: kết luận (kết quả, hạn chế, đề xuất).
- Danh mục hình ảnh, danh mục bảng biểu.
- Slide thuyết trình.

---

#### Hoàng Như Quỳnh — 32%

**Lập trình:**
- Backend: AuthController, UserController, CampaignController, DonationController, ComplaintController (5 Controller + 5 Service + 5 Entity + DTO + Repository).
- Security: JwtUtil, JwtAuthFilter, SecurityConfig.
- Unit test: AuthServiceTest, CampaignServiceTest, DonationServiceTest.

**Tài liệu:**
- Lời mở đầu, lời cảm ơn.
- Thuật ngữ (128 thuật ngữ, 8 nhóm chủ đề).
- Yêu cầu phi chức năng NF1–NF8 (53 yêu cầu chi tiết).
- Phạm vi dự án (6 loại phạm vi).
- Chương 2: phân tích kiến trúc hệ thống.
- Slide thuyết trình.

</details>

---

## Thông tin dự án

| Thông tin | Chi tiết |
|---|---|
| Trường | Đại học Phenikaa |
| Khoa | Trường Công nghệ Thông tin Phenikaa |
| Học phần | Phân tích và Thiết kế Phần mềm |
| Lớp tín chỉ | CSE703048-1-3-25(N02) |
| Giảng viên hướng dẫn | TS. Mai Thúy Nga |
| Nhóm | 06 |
| Niên khóa | 2025–2026 |

---

## Lời cảm ơn

Chúng em xin bày tỏ lòng biết ơn sâu sắc đến cô TS. Mai Thúy Nga — giảng viên môn Phân tích và Thiết kế Phần mềm — đã tận tâm hướng dẫn, định hướng và truyền đạt những kiến thức quý báu trong suốt quá trình thực hiện dự án này.

---

<p align="center">
  <strong>ReliefHub — Minh bạch cứu trợ, kết nối cộng đồng</strong>
  <br/>
  <sub>ReliefHub © 2026 — Nhóm 06 — Đại học Phenikaa</sub>
</p>
