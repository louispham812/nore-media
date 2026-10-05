# NORE MEDIA

Website NORE MEDIA sử dụng Vite + React cho giao diện và Node.js/Express cho API nhận yêu cầu tư vấn. Các URL trang hiện tại (`index.html`, `about.html`, `services.html`, `gallery.html`, `video.html`, `contact.html`) được giữ nguyên.

## Yêu cầu

- Node.js 20.11 trở lên
- npm

## Chạy local

1. Cài dependency:

   ```sh
   npm install
   ```

2. Sao chép `.env.example` thành `.env`, sau đó cấu hình SMTP và Google Sheets theo hướng dẫn bên dưới.
3. Mở terminal thứ nhất để chạy frontend:

   ```sh
   npm run dev
   ```

4. Mở terminal thứ hai để chạy API:

   ```sh
   npm run server:dev
   ```

Vite chuyển tiếp các yêu cầu `/api` đến Express tại `http://localhost:3001`. Mặc định website chạy tại `http://localhost:5173`.

## Cấu hình gửi yêu cầu

Form liên hệ gửi họ tên, số điện thoại, email, tin nhắn và thời điểm nhận đến email `admin@noreagency.com`; nếu Google Sheets đã được cấu hình thì thông tin cũng được ghi vào sheet. Google Sheets là tùy chọn, vì vậy có thể thử nghiệm luồng gửi email trước. Khi chỉ cấu hình email, thông báo thành công sẽ ghi rõ dữ liệu chưa được lưu vào sheet.

### Chống spam, thử gửi lại và xác nhận

- Giới hạn mỗi địa chỉ IP tối đa 5 yêu cầu trong 15 phút, kèm một trường honeypot ẩn để lọc bot phổ thông. Bộ đếm giới hạn được lưu trong bộ nhớ của tiến trình; nếu chạy nhiều bản sao server, hãy cấu hình kho dùng chung (ví dụ Redis) để giới hạn chính xác giữa các bản sao.
- Các lỗi tạm thời của SMTP/Sheets được thử lại tối đa 3 lần với thời gian chờ tăng dần; lỗi cấu hình/quyền truy cập vĩnh viễn không bị thử lại. Form gửi một `Idempotency-Key` ổn định khi thử lại; backend ghi mã này ở cột G của sheet để tránh thêm trùng khi Sheets đã nhận yêu cầu nhưng kết nối bị ngắt trước khi phản hồi. Hãy dành cột G cho mã gửi này.
- Trạng thái chống gửi trùng cho email được lưu trong bộ nhớ server trong 24 giờ và dùng cùng `Message-ID` khi thử lại. Đây là bảo vệ ở mức ứng dụng/email, không thể đảm bảo mọi nhà cung cấp SMTP loại bỏ email trùng. Nếu server khởi động lại hoặc chạy nhiều bản sao, trạng thái này không được chia sẻ; hệ thống hàng đợi bền vững và kho idempotency dùng chung nên được bổ sung nếu cần bảo đảm cao hơn.
- Sau khi email thông báo nội bộ (và Google Sheets nếu được bật) nhận dữ liệu, khách hàng sẽ được gửi một email xác nhận. Nếu gửi email xác nhận lỗi, form vẫn báo yêu cầu đã được ghi nhận và nêu rõ email xác nhận chưa gửi được.
- Nếu ứng dụng chạy sau reverse proxy, đặt `TRUST_PROXY_HOPS` đúng số proxy đáng tin cậy (ví dụ `1` cho một proxy). Không bật giá trị này nếu nền tảng không kiểm soát header proxy.

### Email SMTP

Điền các giá trị vào `.env`:

- `SMTP_HOST`: máy chủ SMTP của nhà cung cấp email.
- `SMTP_PORT`: cổng SMTP (thường là `465` với TLS hoặc `587` với STARTTLS).
- `SMTP_SECURE`: `true` cho TLS trực tiếp, `false` cho STARTTLS.
- `SMTP_USER` và `SMTP_PASS`: thông tin xác thực SMTP.
- `CONTACT_EMAIL_TO`: email nhận thông tin; mặc định `admin@noreagency.com`.

Tài khoản SMTP có thể cần mật khẩu ứng dụng hoặc bật quyền gửi SMTP tùy nhà cung cấp.

### Google Sheets

1. Tạo Google Sheet, thêm một tab (worksheet) và đặt tên mặc định là `KhachHang` hoặc cấu hình tên khác bằng `GOOGLE_SHEETS_SHEET_NAME`. Có thể bỏ qua cấu hình này khi chỉ muốn kiểm thử gửi email.
2. Tạo Google Cloud service account, bật Google Sheets API và tạo khóa JSON cho tài khoản đó.
3. Chia sẻ Google Sheet cho địa chỉ email service account với quyền Editor.
4. Lấy ID sheet từ URL và cấu hình:
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`: trường `client_email` trong khóa JSON.
   - `GOOGLE_PRIVATE_KEY`: trường `private_key`; lưu trong biến môi trường an toàn và thay các dấu xuống dòng bằng `\n` nếu nền tảng không hỗ trợ giá trị nhiều dòng.
   - `GOOGLE_SHEETS_SPREADSHEET_ID`: phần ID trong URL của Google Sheet.
   - `GOOGLE_SHEETS_SHEET_NAME`: tên tab, mặc định `KhachHang`.

API thêm dữ liệu mới vào cuối sheet theo thứ tự cột: thời điểm nhận (UTC), họ tên, số điện thoại, email, tin nhắn, nguồn, mã gửi form. Nếu đã có header, đặt header cột G là `Submission ID`.

## Build và chạy production

```sh
npm test
npm run build
npm start
```

Express phục vụ các file đã build trong `dist` cùng endpoint `/api/contact`. Khi triển khai, cần chạy ứng dụng Node.js và cấu hình các biến môi trường SMTP/Google Sheets trong nền tảng hosting; không commit `.env` hoặc khóa service account. Đảm bảo nơi triển khai có đủ dung lượng cho video hiện có trong thư mục `public/video`.
