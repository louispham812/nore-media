# HƯỚNG DẪN CẤU HÌNH GOOGLE SHEETS TỰ ĐỘNG LƯU DỮ LIỆU
**NORE MEDIA — TÀI LIỆU KỸ THUẬT & HƯỚNG DẪN TRIỂN KHAI**

---

## 1. MỤC ĐÍCH
Tài liệu này hướng dẫn quý khách hàng các bước thiết lập bảng tính **Google Sheets** và tích hợp **Google Cloud Service Account** để website tự động ghi nhận thông tin khách hàng từ form liên hệ/tư vấn.

---

## 2. CÁC BƯỚC THỰC HIỆN

### BƯỚC 1: TẠO BẢNG TÍNH GOOGLE SHEETS
1. Truy cập [Google Sheets](https://sheets.google.com) và tạo một bảng tính mới.
2. Đặt tên file (ví dụ: `NORE MEDIA - Danh Sách Khách Hàng`).
3. Đổi tên sheet (tab ở góc dưới cùng bên trái) thành: **`KhachHang`** *(viết liền, đúng chữ hoa chữ thường)*.
4. Tại **Dòng 1**, thiết lập tiêu đề các cột như bảng sau:

| Cột | Tên Tiêu Đề | Chú Thích |
| :---: | :--- | :--- |
| **A** | `Thời gian (UTC)` | Thời điểm khách gửi form |
| **B** | `Họ và tên` | Họ tên khách hàng |
| **C** | `Số điện thoại` | Số điện thoại liên hệ |
| **D** | `Email` | Địa chỉ email của khách |
| **E** | `Nội dung tin nhắn` | Lời nhắn / Nhu cầu tư vấn |
| **F** | `Nguồn` | Mặc định: `Website` |
| **G** | `Mã gửi form (Submission ID)` | **Rất quan trọng:** Cột này dùng để chống ghi đè/trùng lặp |

---

### BƯỚC 2: TẠO SERVICE ACCOUNT TRÊN GOOGLE CLOUD
1. Truy cập [Google Cloud Console](https://console.cloud.google.com/) và đăng nhập tài khoản Google.
2. Tạo một **Project mới** (hoặc chọn project sẵn có), đặt tên ví dụ: `Nore Media Contact`.
3. Bật **Google Sheets API**:
   - Gõ `Google Sheets API` vào ô tìm kiếm trên cùng.
   - Nhấp vào kết quả và chọn **Enable (Bật)**.
4. Tạo tài khoản dịch vụ (Service Account):
   - Vào menu bên trái: **APIs & Services** > **Credentials (Thông tin xác thực)**.
   - Nhấp chọn **+ CREATE CREDENTIALS** > chọn **Service account**.
   - Nhập tên cho tài khoản (ví dụ: `nore-sheets-bot`), các bước tiếp theo bấm **Done** để hoàn tất.

---

### BƯỚC 3: XUẤT FILE KHÓA BẢO MẬT (JSON KEY)
1. Trong mục **Service Accounts**, nhấp vào email của tài khoản vừa tạo (định dạng: `...@...iam.gserviceaccount.com`).
2. Chuyển sang thẻ **KEYS (Khóa)** ở thanh menu phía trên.
3. Chọn **ADD KEY** > **Create new key**.
4. Chọn định dạng **JSON** rồi bấm **CREATE**.
5. File cấu hình `.json` sẽ tự động tải về máy. Mở file bằng Notepad để lấy:
   - `client_email`: Email của tài khoản dịch vụ.
   - `private_key`: Chuỗi mã hóa bắt đầu bằng `-----BEGIN PRIVATE KEY-----`.

---

### BƯỚC 4: CHIA SẺ QUYỀN CHỈNH SỬA GOOGLE SHEET (BẮT BUỘC)
> **Lưu ý:** Nếu bỏ qua bước này, hệ thống sẽ báo lỗi không có quyền ghi dữ liệu vào bảng tính.

1. Mở lại file Google Sheet đã tạo ở **Bước 1**.
2. Nhấp nút **Chia sẻ (Share)** ở góc trên bên phải.
3. Dán địa chỉ `client_email` vừa lấy ở Bước 3 vào ô nhập người dùng.
4. Chọn quyền: **Người chỉnh sửa (Editor)**.
5. Bỏ tích ô *"Thông báo cho mọi người"* rồi bấm **Chia sẻ (Share)**.

---

### BƯỚC 5: LẤY SPREADSHEET ID
Từ đường dẫn (URL) của bảng tính trên thanh trình duyệt:
`https://docs.google.com/spreadsheets/d/`**`1a2B3c4D5e6F7g8H9i_xyz`**`/edit#gid=0`

Chuỗi ký tự nằm giữa `/d/` và `/edit` chính là **SPREADSHEET ID** (ví dụ: `1a2B3c4D5e6F7g8H9i_xyz`).

---

## 3. TEMPLATE THÔNG TIN CẤU HÌNH (.ENV) DÀNH CHO KHÁCH HÀNG

Quý khách vui lòng điền các thông số đã lấy được vào mẫu cấu hình dưới đây và gửi lại cho đội ngũ kỹ thuật (hoặc điền trực tiếp vào file `.env` trên máy chủ):

```env
# ==============================================================================
# CẤU HÌNH GOOGLE SHEETS
# ==============================================================================

# 1. Email Service Account (Lấy từ trường client_email trong file JSON)
GOOGLE_SERVICE_ACCOUNT_EMAIL="nore-sheets-bot@project-name.iam.gserviceaccount.com"

# 2. Khóa bảo mật Private Key (Lấy từ trường private_key trong file JSON)
# Lưu ý: Giữ nguyên các ký tự \n xuống dòng và bọc trong dấu ngoặc kép ""
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQD...\n-----END PRIVATE KEY-----\n"

# 3. ID của bảng tính Google Sheet (Lấy từ thanh địa chỉ trình duyệt)
GOOGLE_SHEETS_SPREADSHEET_ID="1a2B3c4D5e6F7g8H9i_xyz"

# 4. Tên tab làm việc trong bảng tính (Mặc định là KhachHang)
GOOGLE_SHEETS_SHEET_NAME="KhachHang"


# ==============================================================================
# CẤU HÌNH GỬI EMAIL THÔNG BÁO (SMTP - NẾU CÓ DÙNG THÊM EMAIL)
# ==============================================================================

# Email nhận thông báo khi có khách đăng ký
CONTACT_EMAIL_TO="admin@noreagency.com"

# Máy chủ SMTP của bên gửi (Ví dụ: smtp.gmail.com hoặc máy chủ riêng)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=465
SMTP_SECURE=true

# Tài khoản email và Mật khẩu ứng dụng (App Password)
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

---
*Nếu có bất kỳ thắc mắc hoặc cần hỗ trợ trực tiếp qua màn hình (UltraViewer / Google Meet), quý khách vui lòng liên hệ đội ngũ NORE MEDIA để được hỗ trợ nhanh nhất.*
