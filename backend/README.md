# ReliefHub Backend - Spring Boot REST API

## 📌 Tổng quan
Backend Spring Boot cho hệ thống ReliefHub - Quản lý Cứu trợ Thiên tai.
Kiến trúc 3 lớp: **React → REST API (Spring Boot) → MySQL**

## 🛠 Công nghệ
- **Spring Boot 3.2.5** + Java 17
- **Spring Security** + **JWT** (jjwt 0.12.5)
- **Spring Data JPA** + **MySQL 8**
- **BCrypt** mã hóa mật khẩu
- **Springdoc OpenAPI** (Swagger UI)
- **Lombok**

## 🚀 Cài đặt & Chạy

### 1. Tạo database MySQL
```bash
mysql -u root -p < reliefhub_full.sql
```

### 2. Cấu hình kết nối
Chỉnh sửa `src/main/resources/application.yml`:
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/reliefhub
    username: root
    password: your_password
```

### 3. Build & Run
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
Backend chạy tại: `http://localhost:8080/api`
Swagger UI: `http://localhost:8080/api/swagger-ui.html`

### 4. Kết nối Frontend React
Thêm vào `.env` hoặc `vite.config.js`:
```
VITE_API_URL=http://localhost:8080/api
```

## 📁 Cấu trúc thư mục
```
backend/
├── pom.xml
├── README.md
└── src/main/
    ├── java/com/reliefhub/
    │   ├── ReliefHubApplication.java
    │   ├── config/          # OpenAPI config
    │   ├── security/        # JWT, SecurityConfig, UserDetails
    │   ├── common/          # ApiResponse wrapper
    │   ├── exception/       # GlobalExceptionHandler
    │   ├── entity/          # 16 JPA entities
    │   ├── repository/      # 14 JpaRepository interfaces
    │   ├── service/         # 9 service classes
    │   ├── controller/      # 9 REST controllers
    │   └── dto/             # 10 DTO classes
    └── resources/
        └── application.yml
```

## 🔐 Bảo mật & Phân quyền
| Role | Quyền |
|------|-------|
| ADMIN | Quản lý tất cả: users, campaigns, disasters, dashboard |
| FINANCE | Xác minh đóng góp, sổ tài chính, dashboard |
| LOCAL | Cập nhật thiên tai, xác minh nhu cầu |
| DONOR | Đóng góp, xem lịch sử, khiếu nại |
| CITIZEN | Gửi yêu cầu hỗ trợ, xem trạng thái |
| VOLUNTEER | Nhóm tình nguyện, vận chuyển |

## 📋 API Endpoints

### Auth
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/auth/login` | Đăng nhập, cấp JWT |
| POST | `/auth/register` | Đăng ký tài khoản |

### Users
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/users` | Danh sách người dùng (Admin) |
| GET | `/users/me` | Thông tin cá nhân |
| PUT | `/users/me` | Cập nhật hồ sơ |
| PUT | `/users/me/password` | Đổi mật khẩu |
| POST | `/users` | Tạo tài khoản (Admin) |
| DELETE | `/users/{id}` | Xóa tài khoản (Admin) |

### Campaigns
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/campaigns` | Tất cả chiến dịch |
| GET | `/campaigns/active` | Chiến dịch đang hoạt động |
| GET | `/campaigns/{id}` | Chi tiết chiến dịch |
| POST | `/campaigns` | Tạo mới (Admin) |
| PUT | `/campaigns/{id}` | Cập nhật (Admin) |
| DELETE | `/campaigns/{id}` | Xóa (Admin) |

### Disasters
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/disasters` | Tất cả thiên tai |
| GET | `/disasters/active` | Thiên tai đang hoạt động |
| POST | `/disasters` | Tạo (Admin/Local) |
| PUT | `/disasters/{id}` | Cập nhật (Admin/Local) |
| DELETE | `/disasters/{id}` | Xóa (Admin/Local) |

### Donations
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/donations` | Tất cả đóng góp |
| GET | `/donations/me` | Đóng góp của tôi |
| POST | `/donations` | Tạo đóng góp |
| PATCH | `/donations/{id}/status` | Cập nhật trạng thái |

### Support Requests (Quy trình 6 bước)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/support-requests` | Tất cả yêu cầu |
| GET | `/support-requests/me` | Yêu cầu của tôi |
| POST | `/support-requests` | Gửi yêu cầu (Citizen) |
| PATCH | `/support-requests/{id}/advance` | Thay đổi trạng thái |

### Complaints
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/complaints` | Tất cả khiếu nại |
| POST | `/complaints` | Gửi khiếu nại |
| PUT | `/complaints/{id}/reply` | Trả lời (Admin) |

### Notifications
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/notifications` | Thông báo của tôi |
| PATCH | `/notifications/{id}/read` | Đánh dấu đã đọc |
| PATCH | `/notifications/read-all` | Đọc tất cả |

### Dashboard
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/dashboard/stats` | Thống kê tổng quan |

## 🔑 Tài khoản mặc định (từ SQL)
| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | admin |
| donor01 | donor123 | donor |
| finance01 | fin123 | finance |
| local01 | local123 | local |
| citizen01 | citizen123 | citizen |
| volunteer01 | vol123 | volunteer |

> ⚠️ Mật khẩu trong SQL là plain-text. Khi chạy backend, cần hash lại bằng BCrypt hoặc chạy `DataInitializer` để cập nhật.

## 🔄 Quy trình 6 bước hỗ trợ
```
PENDING → VERIFIED → APPROVED → WAREHOUSE_READY → IN_TRANSIT → DELIVERED
                                                              ↘ REJECTED
```

## 📝 Cách tích hợp với Frontend React
```javascript
// Tạo api.js
const API_URL = 'http://localhost:8080/api';

export async function login(username, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (data.success) {
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data));
  }
  return data;
}

export async function apiGet(path) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return res.json();
}

export async function apiPost(path, body) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  return res.json();
}
```

## ✅ Đã hoàn thành
- [x] Spring Boot project structure (pom.xml, application.yml)
- [x] JWT Authentication + BCrypt password hashing
- [x] Spring Security với phân quyền theo role
- [x] CORS configuration cho React frontend
- [x] 16 JPA Entity classes (khớp với reliefhub_full.sql)
- [x] 14 Repository interfaces
- [x] 9 Service classes (Auth, User, Campaign, Disaster, Donation, SupportRequest, Complaint, Notification, Dashboard)
- [x] 9 REST Controllers với đầy đủ CRUD endpoints
- [x] DTO classes với validation
- [x] GlobalExceptionHandler xử lý lỗi统一
- [x] ApiResponse wrapper chuẩn REST
- [x] Swagger UI / OpenAPI documentation
- [x] README hướng dẫn đầy đủ

## 📌 Cần làm thêm (nếu muốn mở rộng)
- [ ] DataInitializer: tự hash mật khẩu mặc định khi khởi động
- [ ] Volunteer Group & Assignment CRUD controllers
- [ ] Inventory & Warehouse CRUD controllers
- [ ] Delivery CRUD controller
- [ ] Ledger & Finance controller
- [ ] File upload controller (ảnh minh chứng)
- [ ] Email service (thông báo qua email)
- [ ] WebSocket cho real-time notifications
- [ ] Unit tests & Integration tests
- [ ] Frontend React: thay thế mock data bằng API calls
