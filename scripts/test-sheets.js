import 'dotenv/config';
import { google } from 'googleapis';

const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
let privateKey = process.env.GOOGLE_PRIVATE_KEY;
const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
const sheetName = process.env.GOOGLE_SHEETS_SHEET_NAME || 'KhachHang';

console.log('========================================================');
console.log('🔍 KIỂM TRA KẾT NỐI GOOGLE SHEETS — NORE MEDIA');
console.log('========================================================\n');

if (!email || !privateKey || !spreadsheetId) {
  console.error('❌ LỖI: Chưa cấu hình đầy đủ thông tin Google Sheets trong file .env!');
  console.log('Cần có đủ các biến: GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEETS_SPREADSHEET_ID');
  process.exit(1);
}

// Chuẩn hóa privateKey
privateKey = privateKey.replace(/^"|"$/g, '').replace(/\\n/g, '\n');

console.log('1. Thông tin cấu hình:');
console.log('   - Service Account Email:', email);
console.log('   - Spreadsheet ID       :', spreadsheetId);
console.log('   - Sheet Tab Name       :', sheetName);
console.log('');

async function testConnection() {
  try {
    const auth = new google.auth.JWT({
      email,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    console.log('2. Đang kiểm tra quyền truy cập Google Sheet...');
    const meta = await sheets.spreadsheets.get({ spreadsheetId });
    console.log('   ✅ Đã kết nối thành công đến bảng tính: "' + meta.data.properties.title + '"');

    const availableSheets = meta.data.sheets.map((s) => s.properties.title);
    console.log('   - Các tab hiện có trong bảng tính:', availableSheets.join(', '));

    let targetTab = sheetName;
    if (!availableSheets.includes(sheetName)) {
      console.warn(`\n⚠️  CẢNH BÁO: Không tìm thấy tab tên "${sheetName}".`);
      console.log(`   👉 Tự động sử dụng tab đầu tiên: "${availableSheets[0]}"`);
      targetTab = availableSheets[0];
    } else {
      console.log(`   ✅ Đã tìm thấy đúng tab "${sheetName}"!`);
    }

    console.log('\n3. Đang thử ghi 1 dòng dữ liệu mẫu vào Google Sheet...');
    const testId = 'test-' + Date.now();
    const testRow = [
      new Date().toISOString(),
      'NORE MEDIA (Kiểm Tra Kỹ Thuật)',
      '0935997174',
      'admin@noreagency.com',
      'Kiểm tra kết nối hệ thống tự động lưu khách hàng',
      'Script Test',
      testId,
    ];

    const escapedTab = targetTab.replace(/'/g, "''");
    const appendRes = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `'${escapedTab}'!A:G`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [testRow],
      },
    });

    console.log('   ✅ Ghi dữ liệu thành công!');
    console.log('   - Vùng vừa ghi:', appendRes.data.updates.updatedRange);
    console.log('\n🎉 CHÚC MỪNG: GOOGLE SHEETS ĐÃ ĐƯỢC KẾT NỐI HOÀN TOÀN CHÍNH XÁC!\n');
  } catch (error) {
    console.error('\n❌ PHÁT HIỆN LỖI KHI KẾT NỐI GOOGLE SHEETS:\n');
    const msg = error.message || '';

    if (msg.includes('Google Sheets API has not been used') || msg.includes('disabled')) {
      console.error('👉 NGUYÊN NHÂN: Bạn chưa bấm "BẬT" (Enable) Google Sheets API trên Google Cloud Console!');
      const activationUrlMatch = msg.match(/https:\/\/console\.developers\.google\.com[^\s]+/);
      if (activationUrlMatch) {
        console.log('\n🔗 HÃY NHẤP VÀO ĐƯỜNG LINK NÀY VÀ BẤM NÚT "ENABLE" (BẬT):');
        console.log(activationUrlMatch[0]);
      } else {
        console.log('Vui lòng vào Google Cloud Console > Tìm "Google Sheets API" và bấm "Enable".');
      }
    } else if (msg.includes('The caller does not have permission') || msg.includes('PERMISSION_DENIED')) {
      console.error('👉 NGUYÊN NHÂN: Bot chưa được chia sẻ quyền chỉnh sửa Google Sheet!');
      console.log(`Hãy mở Google Sheet (${spreadsheetId}) > Bấm "Chia sẻ" (Share) > Thêm email sau với quyền "Người chỉnh sửa" (Editor):`);
      console.log(`👉 ${email}`);
    } else if (msg.includes('Requested entity was not found')) {
      console.error('👉 NGUYÊN NHÂN: Không tìm thấy Spreadsheet ID! Hãy kiểm tra lại link Google Sheet.');
    } else {
      console.error('Chi tiết lỗi:', msg);
    }
    console.log('\n========================================================\n');
  }
}

testConnection();
