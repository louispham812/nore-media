import 'dotenv/config';
import { google } from 'googleapis';
import { getConfiguration } from '../server/index.js';

export const COLUMN_WIDTHS = [
  100, // 0: Mã Dự Án
  90,  // 1: Mã PIN
  260, // 2: Tên Dự Án
  200, // 3: Khách Hàng / Thương Hiệu
  150, // 4: Dịch Vụ
  140, // 5: Người Phụ Trách
  150, // 6: Giai Đoạn
  110, // 7: Tiến Độ (%)
  120, // 8: Ngày Bắt Đầu
  130, // 9: Hạn Hoàn Thành
  340, // 10: Các Mốc Công Việc
  220, // 11: Link Demo / Bản Nháp
  220, // 12: Link Bàn Giao
  280, // 13: Ghi Chú Cập Nhật
];

export const SERVICE_OPTIONS = [
  'TVC Quảng cáo',
  'Viral Video',
  'MV Ca nhạc',
  'Photoshoot',
];

export const STAGE_OPTIONS = [
  'Tiền kỳ',
  'Đang sản xuất',
  'Hậu kỳ',
  'Chỉnh sửa / Feedback',
  'Hoàn thành',
];

export async function formatProgressSheet(cfg = getConfiguration()) {
  const auth = new google.auth.JWT({
    email: cfg.serviceAccountEmail,
    key: cfg.privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const sheets = google.sheets({ version: 'v4', auth });

  // Get sheet metadata
  const meta = await sheets.spreadsheets.get({
    spreadsheetId: cfg.spreadsheetId,
  });

  const progressSheet = (meta.data.sheets || []).find(
    (s) => s.properties.title === 'Tiến Độ Dự Án'
  );

  if (!progressSheet) {
    throw new Error('Sheet "Tiến Độ Dự Án" không tồn tại.');
  }

  const sheetId = progressSheet.properties.sheetId;

  console.log(`Đang định dạng lại sheet "Tiến Độ Dự Án" (sheetId: ${sheetId})...`);

  // Define Colors & Borders
  const headerBg = { red: 0.098, green: 0.137, blue: 0.2 }; // Dark slate/navy
  const headerFg = { red: 0.976, green: 0.8, blue: 0.2 };   // Luxury Gold
  const borderColor = { red: 0.8, green: 0.85, blue: 0.9 }; // Subtle border
  const solidBorder = {
    style: 'SOLID',
    width: 1,
    colorStyle: { rgbColor: borderColor },
  };

  const requests = [
    // 1. CLEAR all existing Data Validations across entire sheet to remove red triangles
    {
      setDataValidation: {
        range: {
          sheetId,
          startRowIndex: 1,
          endRowIndex: 1000,
          startColumnIndex: 0,
          endColumnIndex: 20,
        },
        rule: null,
      },
    },

    // 2. Add correct Data Validation for Col E (index 4 - Dịch Vụ)
    {
      setDataValidation: {
        range: {
          sheetId,
          startRowIndex: 1,
          endRowIndex: 500,
          startColumnIndex: 4,
          endColumnIndex: 5,
        },
        rule: {
          condition: {
            type: 'ONE_OF_LIST',
            values: SERVICE_OPTIONS.map((v) => ({ userEnteredValue: v })),
          },
          showCustomUi: true,
          strict: false,
        },
      },
    },

    // 3. Add correct Data Validation for Col G (index 6 - Giai Đoạn)
    {
      setDataValidation: {
        range: {
          sheetId,
          startRowIndex: 1,
          endRowIndex: 500,
          startColumnIndex: 6,
          endColumnIndex: 7,
        },
        rule: {
          condition: {
            type: 'ONE_OF_LIST',
            values: STAGE_OPTIONS.map((v) => ({ userEnteredValue: v })),
          },
          showCustomUi: true,
          strict: false,
        },
      },
    },

    // 4. Freeze header row
    {
      updateSheetProperties: {
        properties: {
          sheetId,
          gridProperties: {
            frozenRowCount: 1,
          },
        },
        fields: 'gridProperties.frozenRowCount',
      },
    },

    // 5. Header row height: 38px
    {
      updateDimensionProperties: {
        range: {
          sheetId,
          dimension: 'ROWS',
          startIndex: 0,
          endIndex: 1,
        },
        properties: {
          pixelSize: 38,
        },
        fields: 'pixelSize',
      },
    },

    // 6. Format Header Cells A1:N1 (All 14 columns)
    {
      repeatCell: {
        range: {
          sheetId,
          startRowIndex: 0,
          endRowIndex: 1,
          startColumnIndex: 0,
          endColumnIndex: 14,
        },
        cell: {
          userEnteredFormat: {
            backgroundColorStyle: { rgbColor: headerBg },
            horizontalAlignment: 'CENTER',
            verticalAlignment: 'MIDDLE',
            wrapStrategy: 'WRAP',
            textFormat: {
              bold: true,
              fontSize: 10,
              foregroundColorStyle: { rgbColor: headerFg },
            },
            borders: {
              top: solidBorder,
              bottom: solidBorder,
              left: solidBorder,
              right: solidBorder,
            },
          },
        },
        fields: 'userEnteredFormat(backgroundColorStyle,textFormat,horizontalAlignment,verticalAlignment,wrapStrategy,borders)',
      },
    },

    // 7. General Data Row Borders & Vertical Alignment for A2:N100
    {
      repeatCell: {
        range: {
          sheetId,
          startRowIndex: 1,
          endRowIndex: 100,
          startColumnIndex: 0,
          endColumnIndex: 14,
        },
        cell: {
          userEnteredFormat: {
            verticalAlignment: 'MIDDLE',
            borders: {
              top: solidBorder,
              bottom: solidBorder,
              left: solidBorder,
              right: solidBorder,
            },
          },
        },
        fields: 'userEnteredFormat(verticalAlignment,borders)',
      },
    },

    // 8. Plain Text format & Center Alignment for Col B (Mã PIN)
    {
      repeatCell: {
        range: {
          sheetId,
          startRowIndex: 1,
          endRowIndex: 100,
          startColumnIndex: 1,
          endColumnIndex: 2,
        },
        cell: {
          userEnteredFormat: {
            horizontalAlignment: 'CENTER',
            numberFormat: {
              type: 'TEXT',
            },
          },
        },
        fields: 'userEnteredFormat(horizontalAlignment,numberFormat)',
      },
    },

    // 9. Center Alignment for Centered Columns: Col A (0), Col E (4), Col F (5), Col G (6), Col H (7), Col I (8), Col J (9)
    ...[0, 4, 5, 6, 7, 8, 9].map((colIdx) => ({
      repeatCell: {
        range: {
          sheetId,
          startRowIndex: 1,
          endRowIndex: 100,
          startColumnIndex: colIdx,
          endColumnIndex: colIdx + 1,
        },
        cell: {
          userEnteredFormat: {
            horizontalAlignment: 'CENTER',
          },
        },
        fields: 'userEnteredFormat.horizontalAlignment',
      },
    })),

    // 10. Left Alignment for Text Columns: Col C (2), Col D (3), Col K (10), Col L (11), Col M (12), Col N (13)
    ...[2, 3, 10, 11, 12, 13].map((colIdx) => ({
      repeatCell: {
        range: {
          sheetId,
          startRowIndex: 1,
          endRowIndex: 100,
          startColumnIndex: colIdx,
          endColumnIndex: colIdx + 1,
        },
        cell: {
          userEnteredFormat: {
            horizontalAlignment: 'LEFT',
          },
        },
        fields: 'userEnteredFormat.horizontalAlignment',
      },
    })),

    // 11. Wrap text for Col K (10 - Các Mốc Công Việc) and Col N (13 - Ghi Chú Cập Nhật)
    {
      repeatCell: {
        range: {
          sheetId,
          startRowIndex: 1,
          endRowIndex: 100,
          startColumnIndex: 10,
          endColumnIndex: 11,
        },
        cell: {
          userEnteredFormat: {
            wrapStrategy: 'WRAP',
          },
        },
        fields: 'userEnteredFormat.wrapStrategy',
      },
    },
    {
      repeatCell: {
        range: {
          sheetId,
          startRowIndex: 1,
          endRowIndex: 100,
          startColumnIndex: 13,
          endColumnIndex: 14,
        },
        cell: {
          userEnteredFormat: {
            wrapStrategy: 'WRAP',
          },
        },
        fields: 'userEnteredFormat.wrapStrategy',
      },
    },

    // 12. Clip text for Links: Col L (11) and Col M (12)
    {
      repeatCell: {
        range: {
          sheetId,
          startRowIndex: 1,
          endRowIndex: 100,
          startColumnIndex: 11,
          endColumnIndex: 13,
        },
        cell: {
          userEnteredFormat: {
            wrapStrategy: 'CLIP',
          },
        },
        fields: 'userEnteredFormat.wrapStrategy',
      },
    },

    // 13. Column widths for all 14 columns
    ...COLUMN_WIDTHS.map((width, idx) => ({
      updateDimensionProperties: {
        range: {
          sheetId,
          dimension: 'COLUMNS',
          startIndex: idx,
          endIndex: idx + 1,
        },
        properties: {
          pixelSize: width,
        },
        fields: 'pixelSize',
      },
    })),
  ];

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: cfg.spreadsheetId,
    requestBody: {
      requests,
    },
  });

  console.log('✅ Đã cập nhật toàn bộ styles, column widths, validation rules trên Google Sheet thành công!');
}

if (process.argv[1]?.includes('format-progress-sheet.js')) {
  formatProgressSheet()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Lỗi format:', err);
      process.exit(1);
    });
}
