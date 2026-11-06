# 🎬 NORE MEDIA — Interactive Creative Agency & Client Progress Platform

> **NORE MEDIA** là nền tảng giới thiệu dịch vụ truyền thông sáng tạo (Video Production & Commercial Photography) kết hợp **Hệ thống Quản trị Dự án & Theo dõi Tiến độ Khách hàng (Admin Portal & Client Progress Tracking)** đồng bộ hai chiều với **Google Sheets API**, lưu trữ đa phương tiện trên **Cloudflare R2 CDN**, và bảo mật bằng **JWT HMAC-SHA256 (`timingSafeEqual`)**.

[![Frontend](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite%206-61DAFB?logo=react&logoColor=black)]()
[![Animation](https://img.shields.io/badge/Animation-Framer%20Motion%2014-0055FF?logo=framer&logoColor=white)]()
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express%204-339933?logo=nodedotjs&logoColor=white)]()
[![i18n](https://img.shields.io/badge/i18n-Vietnamese%20%2F%20English-26A69A?logo=i18next&logoColor=white)]()
[![Database](https://img.shields.io/badge/Data%20Sync-Google%20Sheets%20API%20v4-4285F4?logo=googlesheets&logoColor=white)]()
[![CDN](https://img.shields.io/badge/Media%20CDN-Cloudflare%20R2%20(WebP)-F38020?logo=cloudflare&logoColor=white)]()
[![Tests](https://img.shields.io/badge/Tests-Node%20Test%20Runner%20%2B%20Playwright-2EAD33?logo=playwright&logoColor=white)]()

---

## 📑 Mục Lục
1. [Tổng Quan Dự Án](#-1-tổng-quan-dự-án)
2. [Công Nghệ Sử Dụng (Tech Stack)](#-2-công-nghệ-sử-dụng-tech-stack)
3. [Tính Năng & Điểm Nhấn Kỹ Thuật](#-3-tính-năng--điểm-nhấn-kỹ-thuật)
4. [Cấu Trúc Thư Mục](#-4-cấu-trúc-thư-mục)
5. [Hướng Dẫn Cài Đặt & Khởi Chạy](#-5-hướng-dẫn-cài-đặt--khởi-chạy)
6. [Cấu Hình SMTP & Google Sheets API](#-6-cấu-hình-smtp--google-sheets-api)
7. [Kiểm Thử & Triển Khai Production](#-7-kiểm-thử--triển-khai-production)

---

## 🌟 1. Tổng Quan Dự Án

**NORE MEDIA** giải quyết bài toán vận hành thực tế cho một Creative Media Agency hiện đại:
1. **Portfolio Đa Phương Tiện Hiệu Năng Cao:** Trình diễn hàng chục dự án Video thương mại (tích hợp trình phát **Plyr**) và bộ sưu tập Nhiếp ảnh độ phân giải cao được tối ưu hóa tự động sang chuẩn **WebP** và phân phối qua **Cloudflare R2 CDN**.
2. **Trải Nghiệm Chuyển Động Mượt Mà & Đa Ngôn Ngữ:** Chuyển trang và tương tác micro-interactions bằng **Framer Motion**, hỗ trợ chuyển đổi tức thì **Tiếng Việt / Tiếng Anh (`i18next`)**.
3. **Hệ Thống Thu Thập Lead Chống Spam & Chống Trùng Lặp (`Idempotency-Key`):** Form liên hệ tích hợp Rate Limiting, Honeypot chống bot, cơ chế Exponential Backoff Retry và khóa chống ghi trùng dữ liệu vào Google Sheets & SMTP.
4. **Cổng Quản Trị (Admin Portal) & Theo Dõi Tiến Độ Khách Hàng (Client Progress Portal):** Biến Google Sheets thành cơ sở dữ liệu thời gian thực (có lớp đệm In-Memory Cache TTL) giúp Admin quản lý KPI doanh thu, hợp đồng, lịch quay/dựng và giúp Khách hàng đăng nhập tra cứu tiến độ dự án của riêng mình.

---

## 🛠️ 2. Công Nghệ Sử Dụng (Tech Stack)

| Tầng (Layer) | Công Nghệ / Thư Viện | Vai Trò Chi Tiết |
| :--- | :--- | :--- |
| **Frontend Core** | **React 18.3**, **Vite 6**, **React Router v7** | Kiến trúc SPA hỗ trợ cả định tuyến hiện đại (`/projects`, `/admin`) và tương thích ngược URL tĩnh |
| **UI & Motion** | **Framer Motion 14**, **Plyr React**, Custom CSS | Hiệu ứng chuyển cảnh mượt mà, trình phát video chuyên nghiệp, giao diện Dark/Luxury |
| **Đa ngôn ngữ (i18n)** | **i18next**, **react-i18next**, Language Detector | Tự động nhận diện và chuyển đổi song ngữ Việt - Anh toàn trang |
| **Backend & API** | **Node.js (v20+)**, **Express 4.21**, Serverless Ready | Cung cấp RESTful API (`/api/contact`, `/api/admin/*`, `/api/client/*`), tương thích Vercel Serverless |
| **Bảo mật & Xác thực** | **Node `crypto` JWT (HS256)**, `timingSafeEqual`, **express-rate-limit** | Tự triển khai xác thực JWT chuẩn Zero-Dependency cho Admin & Client, chống tấn công Timing Attack & Brute-force |
| **Tích hợp Đám mây** | **Google Sheets API v4 (`googleapis`)**, **Nodemailer (SMTP)** | Đồng bộ dữ liệu khách hàng, bảng điều khiển KPI, tiến độ dự án và gửi email tự động 2 chiều |
| **Media & CDN Pipeline** | **Cloudflare R2**, Script tự động nén **WebP** | Tối ưu hóa dung lượng ảnh/video và đồng bộ cấu trúc thư mục lên đám mây |
| **Testing & Automation**| **Node.js Native Test Runner (`node --test`)**, **Playwright** | Kiểm thử tự động luồng bảo mật Admin, Contact API và tự động quay video Demo giao diện |

---

## ⚡ 3. Tính Năng & Điểm Nhấn Kỹ Thuật

### 🔒 3.1. Cơ Chế Chống Spam, Retry & Idempotency cho Contact Pipeline
- **Rate Limiting & Bot Filtering:** Giới hạn tối đa `5 requests / 15 phút` trên mỗi IP kết hợp trường ẩn **Honeypot** để chặn đứng bot spam tự động.
- **Exponential Backoff Retry:** Tự động thử lại tối đa 3 lần với thời gian chờ tăng dần khi gặp lỗi mạng tạm thời từ máy chủ SMTP hoặc Google Sheets API (không retry với lỗi cấu hình/4xx).
- **Idempotency-Key Chống Ghi Trùng:** Mỗi lần gửi form sinh một mã `Idempotency-Key` duy nhất và đối chiếu tại cột `G` (`Submission ID`) trên Google Sheets, kết hợp bộ nhớ đệm `Message-ID` trong 24 giờ để đảm bảo không bao giờ tạo 2 dòng dữ liệu hoặc gửi 2 email trùng nhau khi mạng chập chờn.

### 📊 3.2. Admin Portal & Client Progress Tracking (Google Sheets CMS)
- **Phân quyền 2 vai trò (`admin` & `client`):** Xác thực bằng chữ ký số HMAC-SHA256 và hàm `crypto.timingSafeEqual` chống dò mật khẩu theo thời gian phản hồi.
- **Admin Dashboard:** Theo dõi trực quan các thẻ KPI (Tổng dự án, Doanh thu Pipeline, Doanh thu hoàn tất, Tỷ lệ hoàn thành), thêm/sửa/xóa dự án và cập nhật trạng thái từng giai đoạn sản xuất trực tiếp lên Google Sheets kèm cơ chế **Cache Invalidation (TTL 60s)** giúp phản hồi API dưới 10ms.
- **Client Progress Page:** Khách hàng đăng nhập bằng mã dự án riêng để theo dõi trực tiếp tiến độ sản xuất (Pre-production, Shooting, Editing, Color Grading, Delivery) và lịch sử thanh toán.

### 🖼️ 3.3. Tự Động Hóa Media & Cloudflare R2
- Bộ công cụ CLI nội bộ trong thư mục `scripts/` (`optimize-and-upload-webp.js`, `sync-new-structure-r2.cjs`, `upload-photography-r2.js`) tự động chuyển đổi ảnh gốc sang định dạng **WebP** và đồng bộ lên **Cloudflare R2**.

---

## 📂 4. Cấu Trúc Thư Mục

```text
nore-media/
├── api/
│   └── index.js                         # Entry point cho Vercel Serverless Functions
├── public/
│   ├── gallery/                         # Tài nguyên hình ảnh tĩnh & logo thương hiệu
│   └── logo.png
├── scripts/                             # Bộ công cụ CLI tự động hóa
│   ├── init-progress-sheet.js           # Khởi tạo cấu trúc bảng tiến độ trên Google Sheets
│   ├── format-progress-sheet.js         # Định dạng màu sắc, cột & công thức Google Sheets
│   ├── optimize-and-upload-webp.js      # Nén ảnh WebP & đẩy lên Cloudflare R2
│   ├── record-demo.mjs                  # Kịch bản Playwright tự động quay video demo
│   └── test-sheets.js                   # Kiểm tra kết nối Google Sheets Service Account
├── server/
│   ├── index.js                         # Express Server, Contact API, Rate Limiter, Retry & Idempotency
│   └── adminService.js                  # JWT Auth (Admin/Client), Google Sheets CRUD & Caching Layer
├── src/
│   ├── components/admin/                # Giao diện Admin Portal, CustomSelect, DatePicker
│   ├── data/                            # Dữ liệu cấu hình danh mục Video & Photography (R2 CDN)
│   ├── hooks/useAdminAuth.js            # Custom Hook quản lý phiên đăng nhập Admin & Client
│   ├── pages/
│   │   ├── AdminPage.jsx                # Trang quản trị KPI & tiến độ dự án
│   │   ├── ClientProgressPage.jsx       # Trang tra cứu tiến độ dành riêng cho khách hàng
│   │   └── LoginPage.jsx                # Trang đăng nhập hợp nhất
│   ├── styles/                          # Hệ thống CSS tùy biến giao diện
│   ├── App.jsx                          # Định tuyến chính, hiệu ứng Framer Motion & trình phát Plyr
│   └── i18n.js                          # Từ điển đa ngôn ngữ Việt - Anh
├── test/
│   ├── admin.test.js                    # Unit & Integration Tests cho luồng Admin/Client Auth & Sheets
│   └── contact.test.js                  # Unit & Integration Tests cho luồng Contact, Rate Limit & Idempotency
├── package.json
└── vite.config.js
```

---

## 🚀 5. Hướng Dẫn Cài Đặt & Khởi Chạy

### Yêu cầu hệ thống
- **Node.js** `>= 20.11.0`
- **npm** `>= 10.0.0`

### Các bước chạy môi trường phát triển (Local Development)

1. **Cài đặt thư viện phụ thuộc:**
   ```bash
   npm install
   ```

2. **Khởi tạo tệp biến môi trường:**
   Sao chép tệp `.env.example` thành `.env` và điền thông tin cấu hình (xem chi tiết tại Mục 6):
   ```bash
   cp .env.example .env
   ```

3. **Khởi chạy đồng thời Frontend (Vite) & Backend (Express):**
   - **Terminal 1 — Chạy Frontend:**
     ```bash
     npm run dev
     ```
   - **Terminal 2 — Chạy API Server:**
     ```bash
     npm run server:dev
     ```
   > 🌐 **Giao diện Web:** `http://localhost:5173` (Vite tự động proxy các request `/api/*` sang Express tại cổng `http://localhost:3001`).

---

## ⚙️ 6. Cấu Hình SMTP & Google Sheets API

### 6.1. Cấu hình Email SMTP (trong `.env`)
- `SMTP_HOST`: Máy chủ SMTP (ví dụ: `smtp.gmail.com`).
- `SMTP_PORT`: Cổng SMTP (`465` với TLS hoặc `587` với STARTTLS).
- `SMTP_SECURE`: `true` cho cổng 465, `false` cho cổng 587.
- `SMTP_USER` & `SMTP_PASS`: Tài khoản và App Password SMTP.
- `CONTACT_EMAIL_TO`: Địa chỉ nhận thông báo lead mới (mặc định: `admin@noreagency.com`).

### 6.2. Cấu hình Google Sheets Service Account
1. Tạo một **Google Cloud Service Account**, bật **Google Sheets API** và tải về khóa JSON.
2. Chia sẻ tệp Google Sheet của bạn cho địa chỉ `client_email` trong khóa JSON với quyền **Editor**.
3. Khai báo vào `.env`:
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`: Trường `client_email` trong tệp JSON.
   - `GOOGLE_PRIVATE_KEY`: Trường `private_key` (giữ nguyên ký tự xuống dòng `\n`).
   - `GOOGLE_SHEETS_SPREADSHEET_ID`: ID lấy từ đường dẫn URL của Google Sheet.
   - `GOOGLE_SHEETS_SHEET_NAME`: Tên tab lưu thông tin liên hệ (mặc định: `KhachHang`).
4. Kiểm tra kết nối hoặc khởi tạo nhanh bảng tiến độ:
   ```bash
   npm run test:sheets
   ```

---

## 🧪 7. Kiểm Thử & Triển Khai Production

Dự án đi kèm bộ kiểm thử tự động sử dụng **Node.js Native Test Runner** (`test/contact.test.js` và `test/admin.test.js`):

```bash
# Chạy toàn bộ bộ kiểm thử tự động (Backend API, Auth, Rate Limit, Idempotency)
npm test

# Build giao diện tối ưu cho Production (xuất ra thư mục dist/)
npm run build

# Khởi chạy máy chủ Production
npm start
```

---
*Phát triển và tối ưu hóa bởi **[Phạm Minh Hoàng (Louis Pham)](https://github.com/louispham812)**.*
