# 🎬 NORE MEDIA — Creative Agency Portfolio & Project Tracker

> **NORE MEDIA** là website giới thiệu dịch vụ truyền thông sáng tạo (Video Production & Commercial Photography) kết hợp trang tra cứu tiến độ dự án dành cho khách hàng, được xây dựng bằng **React**, **Framer Motion** và **Node.js / Express**.

[![Frontend](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB?logo=react&logoColor=black)]()
[![Animation](https://img.shields.io/badge/Animation-Framer%20Motion-0055FF?logo=framer&logoColor=white)]()
[![i18n](https://img.shields.io/badge/i18n-Vietnamese%20%2F%20English-26A69A?logo=i18next&logoColor=white)]()
[![Backend](https://img.shields.io/badge/Backend-Express.js-339933?logo=nodedotjs&logoColor=white)]()

---

## 🌟 1. Giới Thiệu Dự Án

Website **NORE MEDIA** được thiết kế nhằm:
- **Trình diễn Portfolio (Video & Photography):** Hiển thị danh mục các dự án quay dựng thương mại (sử dụng trình phát **Plyr**) và bộ sưu tập hình ảnh chất lượng cao theo từng chủ đề.
- **Trải nghiệm mượt mà & Song ngữ:** Tích hợp hiệu ứng chuyển cảnh bằng **Framer Motion** và hỗ trợ chuyển đổi ngôn ngữ **Tiếng Việt / Tiếng Anh (`react-i18next`)**.
- **Nhận yêu cầu tư vấn (Contact Form):** Khách hàng gửi thông tin liên hệ, hệ thống tự động gửi email thông báo qua **Nodemailer (SMTP)** và lưu thông tin vào **Google Sheets**.
- **Tra cứu tiến độ dự án (Admin & Client Portal):** Trang quản lý và theo dõi trạng thái các giai đoạn sản xuất dự án đồng bộ trực tiếp với dữ liệu trên Google Sheets.

---

## 🛠️ 2. Công Nghệ Sử Dụng

| Thành phần | Công nghệ / Thư viện | Mô tả |
| :--- | :--- | :--- |
| **Frontend** | **React 18**, **Vite**, **React Router** | Xây dựng giao diện SPA và điều hướng giữa các trang |
| **Hiệu ứng & Video** | **Framer Motion**, **Plyr React** | Hiệu ứng chuyển trang, animation tương tác và trình phát video |
| **Đa ngôn ngữ** | **i18next**, **react-i18next** | Chuyển đổi ngôn ngữ Tiếng Việt / Tiếng Anh |
| **Backend API** | **Node.js**, **Express.js** | Xử lý API gửi form liên hệ (`/api/contact`) và đồng bộ dữ liệu tiến độ |
| **Tích hợp ngoài** | **Nodemailer (SMTP)**, **Google Sheets API** | Gửi email tự động và lưu trữ thông tin khách hàng / dự án trên Google Sheets |

---

## 📂 3. Cấu Trúc Thư Mục Chính

```text
nore-media/
├── public/                        # Hình ảnh tĩnh & Logo thương hiệu
├── server/                        # Backend Node.js / Express
│   ├── index.js                   # API xử lý form liên hệ, gửi email & chống spam cơ bản
│   └── adminService.js            # Kết nối Google Sheets API cho trang Admin & Client
├── src/
│   ├── components/admin/          # Các component của trang quản lý (AdminPortal, DatePicker...)
│   ├── data/                      # Dữ liệu danh mục Video & Hình ảnh
│   ├── pages/                     # Các trang AdminPage, ClientProgressPage, LoginPage
│   ├── styles/                    # Các file CSS giao diện
│   ├── App.jsx                    # Giao diện chính, điều hướng và hiệu ứng Framer Motion
│   └── i18n.js                    # Nội dung ngôn ngữ Việt - Anh
├── package.json
└── vite.config.js
```

---

## 🚀 4. Hướng Dẫn Chạy Dự Án (Local)

### Yêu cầu
- **Node.js** (từ bản 20 trở lên) & **npm**

### Các bước cài đặt

1. **Cài đặt thư viện:**
   ```bash
   npm install
   ```

2. **Cấu hình biến môi trường:**
   Sao chép file `.env.example` thành `.env` và điền thông tin SMTP / Google Sheets (nếu muốn test tính năng gửi mail và lưu sheet):
   ```bash
   cp .env.example .env
   ```

3. **Khởi chạy dự án:**
   - **Terminal 1 (Chạy giao diện Frontend):**
     ```bash
     npm run dev
     ```
   - **Terminal 2 (Chạy server API):**
     ```bash
     npm run server:dev
     ```
   > 🌐 Mở trình duyệt tại: `http://localhost:5173`

---

## ⚙️ 5. Cấu Hình Email SMTP & Google Sheets (Tùy chọn)

- **Email SMTP (trong `.env`):** Điền `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` và `CONTACT_EMAIL_TO` để nhận email khi có khách điền form liên hệ.
- **Google Sheets API:**
  1. Tạo Google Cloud Service Account, bật Google Sheets API và tải file JSON key.
  2. Chia sẻ quyền **Editor** trên file Google Sheet cho email của Service Account.
  3. Điền `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY` và `GOOGLE_SHEETS_SPREADSHEET_ID` vào file `.env`.

---
*Phát triển bởi **[Phạm Minh Hoàng (Louis Pham)](https://github.com/louispham812)**.*
