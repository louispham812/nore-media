import 'dotenv/config';
import { google } from 'googleapis';
import { getConfiguration } from '../server/index.js';
import { serializeMilestones } from '../server/adminService.js';
import { formatProgressSheet } from './format-progress-sheet.js';

export const PROGRESS_SHEET_HEADERS = [
  'Mã Dự Án',
  'Mã PIN',
  'Tên Dự Án',
  'Khách Hàng / Thương Hiệu',
  'Dịch Vụ',
  'Người Phụ Trách',
  'Giai Đoạn',
  'Tiến Độ (%)',
  'Ngày Bắt Đầu',
  'Hạn Hoàn Thành',
  'Các Mốc Công Việc',
  'Link Demo / Bản Nháp',
  'Link Bàn Giao',
  'Ghi Chú Cập Nhật',
];

export const INITIAL_PROGRESS_ROWS = [
  [
    'NR-001',
    '123456',
    'TVC ACTS Summer Collection',
    'Trân Trân / ACTS',
    'TVC Quảng cáo',
    'Vũ Thành',
    'Tiền kỳ',
    '35%',
    '20/10/2026',
    '15/11/2026',
    serializeMilestones([
      { title: 'Họp Kick-off & Moodboard', status: 'completed' },
      { title: 'Kịch bản phân cảnh & Storyboard', status: 'in_progress' },
      { title: 'Tiền kỳ & Tuyển chọn diễn viên', status: 'pending' },
      { title: 'Ghi hình Production Day', status: 'pending' },
      { title: 'Dựng thô & Chỉnh màu (Color Grading)', status: 'pending' },
      { title: 'Bàn giao Master Final', status: 'pending' },
    ]),
    'https://vimeo.com/demo-nr-001',
    '',
    'Đã chốt concept, đang hoàn thiện storyboard và chuẩn bị casting.',
  ],
  [
    'NR-002',
    '123456',
    'Bộ ảnh Lookbook Nore Brand 2026',
    'Vũ Thành / Nore',
    'Photoshoot',
    'Đức Thuận',
    'Đang sản xuất',
    '60%',
    '22/10/2026',
    '05/11/2026',
    serializeMilestones([
      { title: 'Lên Concept & Thiết kế Set', status: 'completed' },
      { title: 'Chụp hình tại Studio', status: 'completed' },
      { title: 'Retouch & Blend màu bộ ảnh', status: 'in_progress' },
      { title: 'Khách feedback duyệt layout', status: 'pending' },
      { title: 'Xuất file in ấn & Digital HD', status: 'pending' },
    ]),
    'https://drive.google.com/drive/folders/lookbook-draft-002',
    '',
    'Đã hoàn thành buổi shoot, team đang xử lý hậu kỳ màu sắc đợt 1.',
  ],
  [
    'NR-003',
    '123456',
    'TVC Quảng Cáo FPT Tuyển Dụng',
    'Phạm Minh Hoàng / FPT',
    'TVC Quảng cáo',
    'Vũ Thành',
    'Hoàn thành',
    '100%',
    '20/10/2026',
    '21/10/2026',
    serializeMilestones([
      { title: 'Kịch bản & Lịch quay', status: 'completed' },
      { title: 'Quay hình tại văn phòng FPT', status: 'completed' },
      { title: 'Hậu kỳ dựng & mộc âm', status: 'completed' },
      { title: 'Duyệt bản Master Final', status: 'completed' },
      { title: 'Bàn giao sản phẩm & nghiệm thu', status: 'completed' },
    ]),
    'https://vimeo.com/demo-fpt-003',
    'https://drive.google.com/drive/folders/fpt-final-delivery-003',
    'Dự án đã bàn giao đầy đủ file 4K và Clean Master cho khách hàng.',
  ],
];

export async function initProgressSheet(cfg = getConfiguration()) {
  const auth = new google.auth.JWT({
    email: cfg.serviceAccountEmail,
    key: cfg.privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const sheets = google.sheets({ version: 'v4', auth });

  // Check if sheet tab exists, create if not
  const meta = await sheets.spreadsheets.get({ spreadsheetId: cfg.spreadsheetId });
  const tabExists = (meta.data.sheets || []).some(
    (s) => s.properties.title === 'Tiến Độ Dự Án'
  );

  if (!tabExists) {
    console.log('Tạo tab "Tiến Độ Dự Án"...');
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: cfg.spreadsheetId,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: {
                title: 'Tiến Độ Dự Án',
                gridProperties: { rowCount: 100, columnCount: 20, frozenRowCount: 1 },
              },
            },
          },
        ],
      },
    });
  }

  // Write headers and initial rows
  const allRows = [PROGRESS_SHEET_HEADERS, ...INITIAL_PROGRESS_ROWS];

  await sheets.spreadsheets.values.update({
    spreadsheetId: cfg.spreadsheetId,
    range: "'Tiến Độ Dự Án'!A1:N" + allRows.length,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: allRows,
    },
  });

  console.log('✅ Khởi tạo thành công bảng "Tiến Độ Dự Án" với ' + INITIAL_PROGRESS_ROWS.length + ' dòng dữ liệu mẫu dạng văn bản đẹp!');

  // Format styles, column widths, validation rules
  await formatProgressSheet(cfg);
}

if (process.argv[1]?.includes('init-progress-sheet.js')) {
  initProgressSheet()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Lỗi khởi tạo bảng:', err);
      process.exit(1);
    });
}
