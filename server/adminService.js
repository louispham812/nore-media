import crypto from 'node:crypto';
import { google } from 'googleapis';

const TOKEN_EXPIRY_SECONDS = 24 * 60 * 60; // 24 hours
const CACHE_TTL_MS = 60 * 1000; // 1 minute

let sheetsCache = {
  data: null,
  cachedAt: 0,
};

export function invalidateSheetsCache() {
  sheetsCache = {
    data: null,
    cachedAt: 0,
  };
}

export function signAdminToken(payload, secret) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const exp = Math.floor(Date.now() / 1000) + TOKEN_EXPIRY_SECONDS;
  const body = Buffer.from(JSON.stringify({ ...payload, exp })).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

export function verifyAdminToken(token, secret) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [header, body, signature] = parts;
  try {
    const expectedSig = crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url');
    if (signature.length !== expectedSig.length) return null;
    const isValid = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig));
    if (!isValid) return null;

    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (payload.exp && Date.now() >= payload.exp * 1000) return null;
    return payload;
  } catch {
    return null;
  }
}

export function safeCompare(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function parseDashboardSheet(rows = []) {
  const kpis = [];
  const r2 = rows[1] || [];
  const r3 = rows[2] || [];
  const r4 = rows[3] || [];

  const kpiCols = [1, 3, 5, 7];
  const defaultKeys = ['projects', 'pipeline', 'completedRevenue', 'completionRate'];
  const defaultIcons = ['folder', 'dollar', 'checkCircle', 'chart'];

  kpiCols.forEach((colIdx, i) => {
    const title = (r2[colIdx] || '').trim();
    const value = (r3[colIdx] || '').trim();
    const note = (r4[colIdx] || '').trim();
    if (title || value) {
      kpis.push({
        key: defaultKeys[i] || `kpi-${i}`,
        title: title || 'Chỉ số',
        value: value || '0',
        note: note || '',
        icon: defaultIcons[i] || 'chart',
      });
    }
  });

  const revenueByGenre = [];
  const stageDistribution = [];

  for (let i = 7; i < rows.length; i += 1) {
    const row = rows[i] || [];
    const genre = (row[1] || '').trim();
    const genreProjects = (row[2] || '').trim();
    const genreRevenue = (row[3] || '').trim();

    if (genre && genre !== 'Thể loại sản xuất') {
      revenueByGenre.push({
        genre,
        projectCount: genreProjects ? Number(genreProjects) || genreProjects : 0,
        revenue: genreRevenue || '0 ₫',
        isTotal: genre.toLowerCase().includes('tổng cộng'),
      });
    }

    const stage = (row[5] || '').trim();
    const stageProjects = (row[6] || '').trim();
    const stagePercentage = (row[7] || '').trim();

    if (stage && stage !== 'Giai đoạn') {
      stageDistribution.push({
        stage,
        projectCount: stageProjects ? Number(stageProjects) || stageProjects : 0,
        percentage: stagePercentage || '0%',
      });
    }
  }

  return { kpis, revenueByGenre, stageDistribution };
}

function parseProjectsSheet(rows = []) {
  if (!rows || rows.length < 2) return [];

  const dataRows = rows.slice(1);
  const projects = [];

  for (const row of dataRows) {
    const id = (row[0] || '').trim();
    const name = (row[1] || '').trim();
    const brand = (row[2] || '').trim();
    const service = (row[3] || '').trim();
    const assignee = (row[4] || '').trim();
    const stage = (row[5] || '').trim();
    const value = (row[6] || '').trim();
    const paymentStatus = (row[7] || '').trim();
    const startDate = (row[8] || '').trim();
    const dueDate = (row[9] || '').trim();

    if (!id && !name && !brand && !value) continue;

    projects.push({
      id: id || `${projects.length + 1}`,
      name: name || 'Chưa đặt tên',
      brand: brand || '—',
      service: service || '—',
      assignee: assignee || '—',
      stage: stage || 'Chưa cập nhật',
      value: value || '0 ₫',
      paymentStatus: paymentStatus || 'Chưa thanh toán',
      startDate: startDate || '—',
      dueDate: dueDate || '—',
    });
  }

  return projects;
}

function parseFormSubmissionsSheet(rows = []) {
  if (!rows || rows.length < 2) return [];

  const dataRows = rows.slice(1);
  const submissions = [];

  dataRows.forEach((row, idx) => {
    const submittedAt = (row[0] || '').trim();
    const name = (row[1] || '').trim();
    const phone = (row[2] || '').trim();
    const email = (row[3] || '').trim();
    const message = (row[4] || '').trim();
    const source = (row[5] || '').trim() || 'Website';
    const submissionId = (row[6] || '').trim() || `sub-${idx}`;

    if (!name && !phone && !email && !message) return;

    submissions.push({
      id: submissionId,
      submittedAt: submittedAt || new Date().toISOString(),
      name: name || 'Khách liên hệ',
      phone: phone || '',
      email: email || '',
      message: message || '',
      source: source || 'Website',
      submissionId,
    });
  });

  // Sort newest first
  submissions.sort((a, b) => {
    const timeA = new Date(a.submittedAt).getTime() || 0;
    const timeB = new Date(b.submittedAt).getTime() || 0;
    return timeB - timeA;
  });

  return submissions;
}

function createSheetsClient(config) {
  if (!config.serviceAccountEmail || !config.privateKey || !config.spreadsheetId) {
    throw new Error('Cơ sở dữ liệu chưa được cấu hình đầy đủ trong hệ thống.');
  }

  const auth = new google.auth.JWT({
    email: config.serviceAccountEmail,
    key: config.privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return google.sheets({ version: 'v4', auth });
}

function extractValidationValues(sheetDetail, colIndex) {
  try {
    const rowData = sheetDetail?.sheets?.[0]?.data?.[0]?.rowData || [];
    for (const row of rowData) {
      const cell = (row?.values || [])[colIndex];
      const condition = cell?.dataValidation?.condition;
      if (condition?.type === 'ONE_OF_LIST' && Array.isArray(condition.values)) {
        const list = condition.values.map((v) => (v.userEnteredValue || '').trim()).filter(Boolean);
        if (list.length > 0) return list;
      }
    }
  } catch {
    // fallback gracefully if structure is unexpected
  }
  return [];
}

export async function getSheetsAdminData(config, forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && sheetsCache.data && now - sheetsCache.cachedAt < CACHE_TTL_MS) {
    return { ...sheetsCache.data, cached: true };
  }

  const sheets = createSheetsClient(config);

  const [dashRes, projRes, formsRes, validationRes] = await Promise.all([
    sheets.spreadsheets.values.get({
      spreadsheetId: config.spreadsheetId,
      range: "'Dashboard'!A1:I30",
    }),
    sheets.spreadsheets.values.get({
      spreadsheetId: config.spreadsheetId,
      range: "'Khách hàng & Dự án'!A1:J500",
    }),
    sheets.spreadsheets.values.get({
      spreadsheetId: config.spreadsheetId,
      range: "'KhachHang'!A1:G1000",
    }).catch(() => ({ data: { values: [] } })),
    sheets.spreadsheets.get({
      spreadsheetId: config.spreadsheetId,
      ranges: ["'Khách hàng & Dự án'!A2:J2"],
      includeGridData: true,
    }).catch(() => ({ data: { sheets: [] } })),
  ]);

  const dashboard = parseDashboardSheet(dashRes.data.values || []);
  const projects = parseProjectsSheet(projRes.data.values || []);
  const formSubmissions = parseFormSubmissionsSheet(formsRes.data.values || []);

  // Extract Data Validation rules directly from Google Sheet: Col D = 3 (Service), Col F = 5 (Stage), Col H = 7 (Payment)
  const validatedServices = extractValidationValues(validationRes.data, 3);
  const validatedStages = extractValidationValues(validationRes.data, 5);
  const validatedPayments = extractValidationValues(validationRes.data, 7);

  // Extract from Dashboard breakdown tables
  const dashboardGenres = (dashboard.revenueByGenre || [])
    .map((g) => (g.genre || '').trim())
    .filter((g) => g && !g.toLowerCase().includes('tổng cộng') && g !== 'Thể loại sản xuất');
  const dashboardStages = (dashboard.stageDistribution || [])
    .map((s) => (s.stage || '').trim())
    .filter((s) => s && s !== 'Giai đoạn');

  // Extract from existing projects
  const projectServices = projects.map((p) => p.service).filter((s) => s && s !== '—');
  const projectStages = projects.map((p) => p.stage).filter((s) => s && s !== '—');
  const projectPayments = projects.map((p) => p.paymentStatus).filter((s) => s && s !== '—');

  // Default fallbacks only if sheet has no validation configured
  const DEFAULT_SERVICES = [
    'TVC Quảng cáo',
    'Viral Video',
    'MV Ca nhạc',
    'Photoshoot',
  ];
  const DEFAULT_STAGES = [
    'Đề xuất / Pitching',
    'Đang đàm phán',
    'Tiền kỳ',
    'Đang sản xuất',
    'Hậu kỳ',
    'Hoàn thành',
  ];
  const DEFAULT_PAYMENTS = [
    'Chưa thanh toán',
    'Chờ tạm ứng',
    'Đã tạm ứng 50%',
    'Đã tạm ứng 70%',
    'Đã thanh toán 100%',
  ];

  // Prioritize exact Google Sheet Data Validation rules
  const finalServices = validatedServices.length > 0
    ? Array.from(new Set([...validatedServices, ...projectServices])).filter(Boolean)
    : (dashboardGenres.length > 0
        ? Array.from(new Set([...dashboardGenres, ...projectServices])).filter(Boolean)
        : DEFAULT_SERVICES);

  const finalStages = validatedStages.length > 0
    ? Array.from(new Set([...validatedStages, ...projectStages])).filter(Boolean)
    : (dashboardStages.length > 0
        ? Array.from(new Set([...dashboardStages, ...projectStages])).filter(Boolean)
        : DEFAULT_STAGES);

  const finalPayments = validatedPayments.length > 0
    ? Array.from(new Set([...validatedPayments, ...projectPayments])).filter(Boolean)
    : DEFAULT_PAYMENTS;

  const dropdownOptions = {
    services: finalServices,
    stages: finalStages,
    paymentStatuses: finalPayments,
  };

  const result = {
    updatedAt: new Date().toISOString(),
    dashboard,
    projects,
    formSubmissions,
    dropdownOptions,
    cached: false,
  };

  sheetsCache = {
    data: result,
    cachedAt: now,
  };

  return result;
}

export async function addProjectToSheet(config, projectData = {}) {
  const sheets = createSheetsClient(config);

  // Fetch existing IDs to auto-generate next ID if needed
  const existingRes = await sheets.spreadsheets.values.get({
    spreadsheetId: config.spreadsheetId,
    range: "'Khách hàng & Dự án'!A2:A500",
  });

  const existingIds = (existingRes.data.values || [])
    .map(([val]) => parseInt(String(val).trim(), 10))
    .filter((num) => !isNaN(num) && num > 0);

  const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
  const newId = String(projectData.id || maxId + 1).trim();

  const row = [
    newId,
    (projectData.name || '').trim(),
    (projectData.brand || '').trim(),
    (projectData.service || '').trim(),
    (projectData.assignee || '').trim(),
    (projectData.stage || 'Đang đàm phán').trim(),
    (projectData.value || '0 ₫').trim(),
    (projectData.paymentStatus || 'Chưa thanh toán').trim(),
    (projectData.startDate || '').trim(),
    (projectData.dueDate || '').trim(),
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: config.spreadsheetId,
    range: "'Khách hàng & Dự án'!A:J",
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values: [row],
    },
  });

  invalidateSheetsCache();
  return {
    success: true,
    project: {
      id: newId,
      name: row[1],
      brand: row[2],
      service: row[3],
      assignee: row[4],
      stage: row[5],
      value: row[6],
      paymentStatus: row[7],
      startDate: row[8],
      dueDate: row[9],
    },
  };
}

export async function updateProjectInSheet(config, projectId, projectData = {}) {
  const sheets = createSheetsClient(config);

  const idColRes = await sheets.spreadsheets.values.get({
    spreadsheetId: config.spreadsheetId,
    range: "'Khách hàng & Dự án'!A:A",
  });

  const rows = idColRes.data.values || [];
  let targetRowIndex = -1; // 1-based index in sheet

  for (let i = 0; i < rows.length; i += 1) {
    const rowId = String(rows[i]?.[0] || '').trim();
    if (rowId === String(projectId).trim()) {
      targetRowIndex = i + 1; // 1-indexed for Google Sheets
      break;
    }
  }

  if (targetRowIndex <= 0) {
    throw new Error(`Không tìm thấy dự án với Mã KH: ${projectId}`);
  }

  const updatedRow = [
    String(projectData.id || projectId).trim(),
    (projectData.name || '').trim(),
    (projectData.brand || '').trim(),
    (projectData.service || '').trim(),
    (projectData.assignee || '').trim(),
    (projectData.stage || 'Đang đàm phán').trim(),
    (projectData.value || '0 ₫').trim(),
    (projectData.paymentStatus || 'Chưa thanh toán').trim(),
    (projectData.startDate || '').trim(),
    (projectData.dueDate || '').trim(),
  ];

  await sheets.spreadsheets.values.update({
    spreadsheetId: config.spreadsheetId,
    range: `'Khách hàng & Dự án'!A${targetRowIndex}:J${targetRowIndex}`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [updatedRow],
    },
  });

  invalidateSheetsCache();
  return {
    success: true,
    project: {
      id: updatedRow[0],
      name: updatedRow[1],
      brand: updatedRow[2],
      service: updatedRow[3],
      assignee: updatedRow[4],
      stage: updatedRow[5],
      value: updatedRow[6],
      paymentStatus: updatedRow[7],
      startDate: updatedRow[8],
      dueDate: updatedRow[9],
    },
  };
}

export async function deleteProjectFromSheet(config, projectId) {
  const sheets = createSheetsClient(config);

  const [metaRes, idColRes] = await Promise.all([
    sheets.spreadsheets.get({ spreadsheetId: config.spreadsheetId }),
    sheets.spreadsheets.values.get({
      spreadsheetId: config.spreadsheetId,
      range: "'Khách hàng & Dự án'!A:A",
    }),
  ]);

  const targetSheet = (metaRes.data.sheets || []).find(
    (s) => s.properties.title === 'Khách hàng & Dự án',
  );
  if (!targetSheet) {
    throw new Error('Không tìm thấy danh mục dữ liệu "Khách hàng & Dự án" trong hệ thống.');
  }
  const sheetId = targetSheet.properties.sheetId;

  const rows = idColRes.data.values || [];
  let targetRowIndex = -1; // 0-based index for deleteDimension

  for (let i = 0; i < rows.length; i += 1) {
    const rowId = String(rows[i]?.[0] || '').trim();
    if (rowId === String(projectId).trim()) {
      targetRowIndex = i; // 0-based row index
      break;
    }
  }

  if (targetRowIndex <= 0) {
    // 0 is header row, cannot delete header
    throw new Error(`Không tìm thấy dự án với Mã KH: ${projectId}`);
  }

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: config.spreadsheetId,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId,
              dimension: 'ROWS',
              startIndex: targetRowIndex,
              endIndex: targetRowIndex + 1,
            },
          },
        },
      ],
    },
  });

  invalidateSheetsCache();
  return { success: true, deletedId: projectId };
}
