import 'dotenv/config';
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { fileURLToPath } from 'node:url';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const app = express();
const port = Number(process.env.PORT || 3001);
const trustProxyHops = Number(process.env.TRUST_PROXY_HOPS ?? 0);
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(rootDir, 'dist');

if (!Number.isSafeInteger(trustProxyHops) || trustProxyHops < 0) {
  throw new Error('TRUST_PROXY_HOPS phải là số nguyên không âm.');
}

app.disable('x-powered-by');
app.set('trust proxy', trustProxyHops);
app.use(express.json({ limit: '20kb' }));

const contactRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({ error: 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau 15 phút.' });
  },
});

const idempotencyTtlMs = 24 * 60 * 60 * 1000;
const maxIdempotencyEntries = 10_000;
const submissions = new Map();

function pruneSubmissions() {
  const expiration = Date.now() - idempotencyTtlMs;
  for (const [key, entry] of submissions) {
    if (!entry.inFlight && entry.updatedAt < expiration) submissions.delete(key);
  }
  while (submissions.size > maxIdempotencyEntries) {
    const oldest = [...submissions].find(([, entry]) => !entry.inFlight);
    if (!oldest) return;
    submissions.delete(oldest[0]);
  }
}

export function getConfiguration(env = process.env) {
  const requiredSmtp = {
    SMTP_HOST: env.SMTP_HOST,
    SMTP_PORT: env.SMTP_PORT,
    SMTP_USER: env.SMTP_USER,
    SMTP_PASS: env.SMTP_PASS,
  };
  const missing = Object.entries(requiredSmtp)
    .filter(([, value]) => !value?.trim())
    .map(([name]) => name);
  if (missing.length) return { missing };

  const sheetSettings = {
    GOOGLE_SERVICE_ACCOUNT_EMAIL: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    GOOGLE_PRIVATE_KEY: env.GOOGLE_PRIVATE_KEY,
    GOOGLE_SHEETS_SPREADSHEET_ID: env.GOOGLE_SHEETS_SPREADSHEET_ID,
  };
  const configuredSheetSettings = Object.values(sheetSettings).filter((value) => value?.trim()).length;
  const missingSheetSettings = Object.entries(sheetSettings)
    .filter(([, value]) => !value?.trim())
    .map(([name]) => name);
  if (configuredSheetSettings > 0 && missingSheetSettings.length > 0) {
    return { invalid: `Cấu hình Google Sheets chưa đầy đủ: ${missingSheetSettings.join(', ')}.` };
  }

  const smtpPort = Number(env.SMTP_PORT);
  if (!Number.isInteger(smtpPort) || smtpPort < 1 || smtpPort > 65535) {
    return { invalid: 'SMTP_PORT phải là một cổng hợp lệ.' };
  }

  return {
    sheetsEnabled: configuredSheetSettings === Object.keys(sheetSettings).length,
    emailTo: env.CONTACT_EMAIL_TO || 'admin@noreagency.com',
    smtpHost: env.SMTP_HOST,
    smtpPort,
    smtpSecure: env.SMTP_SECURE
      ? env.SMTP_SECURE.toLowerCase() === 'true'
      : smtpPort === 465,
    smtpUser: env.SMTP_USER,
    smtpPass: env.SMTP_PASS,
    serviceAccountEmail: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    privateKey: env.GOOGLE_PRIVATE_KEY?.replace(/^"|"$/g, '').replace(/\\n/g, '\n'),
    spreadsheetId: env.GOOGLE_SHEETS_SPREADSHEET_ID,
    sheetName: env.GOOGLE_SHEETS_SHEET_NAME || 'KhachHang',
  };
}

function validateContact(body) {
  const fields = ['name', 'phone', 'email', 'message'];
  const data = Object.fromEntries(
    fields.map((field) => [field, typeof body?.[field] === 'string' ? body[field].trim() : '']),
  );
  const limits = { name: 100, phone: 30, email: 254, message: 3000 };
  const tooLong = fields.find((field) => data[field].length > limits[field]);

  if (fields.some((field) => !data[field])) {
    return { error: 'Vui lòng điền đầy đủ họ tên, số điện thoại, email và tin nhắn.' };
  }
  if (tooLong) return { error: 'Một hoặc nhiều trường đã vượt quá độ dài cho phép.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return { error: 'Địa chỉ email không hợp lệ.' };
  }
  if (/[\r\n]/.test(data.name) || /[\r\n]/.test(data.email)) {
    return { error: 'Thông tin liên hệ chứa ký tự không hợp lệ.' };
  }
  return { data };
}

function createTransporter(config) {
  return nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    secure: config.smtpSecure,
    auth: { user: config.smtpUser, pass: config.smtpPass },
    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    socketTimeout: 20_000,
  });
}

async function sendAdminEmail(transporter, config, data, submissionId) {
  await transporter.sendMail({
    from: config.smtpUser,
    to: config.emailTo,
    replyTo: data.email,
    subject: `Khách hàng mới từ website NORE MEDIA: ${data.name}`,
    messageId: `<${submissionId}@noreagency.com>`,
    text: [
      `Họ và tên: ${data.name}`,
      `Số điện thoại: ${data.phone}`,
      `Email: ${data.email}`,
      '',
      'Tin nhắn:',
      data.message,
    ].join('\n'),
  });
}

async function sendCustomerConfirmation(transporter, config, data, submissionId) {
  await transporter.sendMail({
    from: config.smtpUser,
    to: data.email,
    subject: 'NORE MEDIA đã nhận được yêu cầu tư vấn của bạn',
    messageId: `<${submissionId}.confirmation@noreagency.com>`,
    text: [
      `Chào ${data.name},`,
      '',
      'Cảm ơn bạn đã liên hệ NORE MEDIA. Chúng tôi đã nhận được thông tin và sẽ phản hồi bạn sớm nhất có thể.',
      '',
      'NORE MEDIA',
      'admin@noreagency.com',
    ].join('\n'),
  });
}

function isTransientError(error) {
  const status = Number(error.response?.status ?? error.status);
  if (status === 429 || status >= 500) return true;
  if (status >= 400) return false;

  const smtpCode = Number(error.responseCode);
  if (smtpCode >= 400 && smtpCode < 500) return true;
  if (smtpCode >= 500) return false;

  return ['ECONNRESET', 'ECONNREFUSED', 'ETIMEDOUT', 'ESOCKET', 'ECONNECTION', 'EAI_AGAIN']
    .includes(error.code);
}

export async function withRetry(destination, operation) {
  const maxAttempts = 3;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await operation();
      return;
    } catch (error) {
      if (attempt === maxAttempts || !isTransientError(error)) {
        console.error(`Contact delivery failed for ${destination} after ${attempt} attempt(s).`, {
          code: error.code,
          status: error.response?.status,
        });
        throw error;
      }
      const delay = 250 * (2 ** (attempt - 1)) + Math.floor(Math.random() * 150);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

async function appendToSheet(config, data, submissionId) {
  const auth = new google.auth.JWT({
    email: config.serviceAccountEmail,
    key: config.privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const sheets = google.sheets({ version: 'v4', auth });

  let targetSheet = config.sheetName;
  try {
    const meta = await sheets.spreadsheets.get({ spreadsheetId: config.spreadsheetId });
    const availableSheets = meta.data.sheets?.map((s) => s.properties.title) || [];
    if (!availableSheets.includes(targetSheet) && availableSheets.length > 0) {
      targetSheet = availableSheets[0];
    }
  } catch {
    // Proceed with configured sheet name if meta check fails
  }

  const sheetName = targetSheet.replace(/'/g, "''");
  const range = `'${sheetName}'!G:G`;
  try {
    const existingIds = await sheets.spreadsheets.values.get({
      spreadsheetId: config.spreadsheetId,
      range,
    });
    if (existingIds.data.values?.some(([id]) => id === submissionId)) return;
  } catch {
    // Range might be empty or unformatted, continue to append
  }

  await sheets.spreadsheets.values.append({
    spreadsheetId: config.spreadsheetId,
    range: `'${sheetName}'!A:G`,
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values: [[new Date().toISOString(), data.name, data.phone, data.email, data.message, 'Website', submissionId]],
    },
  });
}

export async function deliverSubmission(
  config,
  data,
  submissionId,
  entry,
  transporter = createTransporter(config),
) {
  const coreResults = await Promise.allSettled([
    entry.deliveries.admin
      ? Promise.resolve()
      : withRetry('email', () => sendAdminEmail(transporter, config, data, submissionId)),
    !config.sheetsEnabled || entry.deliveries.sheet
      ? Promise.resolve()
      : withRetry('Google Sheets', () => appendToSheet(config, data, submissionId)),
  ]);
  if (coreResults[0].status === 'fulfilled') entry.deliveries.admin = true;
  if (config.sheetsEnabled && coreResults[1].status === 'fulfilled') entry.deliveries.sheet = true;

  const failedDestinations = [];
  if (!entry.deliveries.admin) failedDestinations.push('email');
  if (config.sheetsEnabled && !entry.deliveries.sheet) failedDestinations.push('Google Sheets');
  if (failedDestinations.length) {
    return {
      status: 502,
      body: {
        error: `Chưa thể hoàn tất gửi thông tin đến ${failedDestinations.join(' và ')} sau nhiều lần thử. Vui lòng gửi lại sau; yêu cầu này sẽ được thử tiếp mà không gửi lặp đến kênh đã nhận.`,
        errorKey: 'contact.errorDelivery',
        failedDestinations: failedDestinations.join(' & '),
      },
    };
  }

  let confirmationWarning = false;
  if (!entry.deliveries.confirmation) {
    try {
      await withRetry('email xác nhận khách hàng', () =>
        sendCustomerConfirmation(transporter, config, data, submissionId));
      entry.deliveries.confirmation = true;
    } catch {
      confirmationWarning = true;
    }
  }
  return {
    status: 200,
    body: {
      message: config.sheetsEnabled
        ? 'Thông tin đã được gửi thành công. NORE MEDIA sẽ phản hồi bạn sớm nhất có thể.'
        : 'Thông báo đã được gửi qua email. Google Sheets chưa được cấu hình nên thông tin chưa được lưu vào sheet.',
      messageKey: 'contact.success',
      confirmationWarning,
      sheetsEnabled: config.sheetsEnabled,
    },
  };
}

app.post('/api/contact', contactRateLimit, async (req, res) => {
  if (typeof req.body?.website === 'string' && req.body.website.trim()) {
    return res.status(200).json({
      message: 'Thông tin đã được gửi thành công. NORE MEDIA sẽ phản hồi bạn sớm nhất có thể.',
      messageKey: 'contact.success',
    });
  }

  const submissionId = req.get('Idempotency-Key');
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(submissionId || '')) {
    return res.status(400).json({ error: 'Mã gửi biểu mẫu không hợp lệ. Vui lòng tải lại trang và thử lại.' });
  }

  const validation = validateContact(req.body);
  if (validation.error) return res.status(400).json({ error: validation.error });

  pruneSubmissions();
  const fingerprint = JSON.stringify(validation.data);
  let entry = submissions.get(submissionId);
  if (entry && entry.fingerprint !== fingerprint) {
    return res.status(409).json({ error: 'Mã gửi này đã được dùng cho thông tin khác. Vui lòng tải lại trang.' });
  }

  const config = getConfiguration();
  if (config.missing) {
    return res.status(503).json({
      error: 'Máy chủ chưa cấu hình đầy đủ email SMTP.',
      missing: config.missing,
    });
  }
  if (config.invalid) return res.status(500).json({ error: config.invalid });

  if (!entry) {
    entry = {
      fingerprint,
      updatedAt: Date.now(),
      deliveries: { admin: false, sheet: false, confirmation: false },
      inFlight: null,
    };
    submissions.set(submissionId, entry);
  }

  if (!entry.inFlight) {
    entry.inFlight = deliverSubmission(config, validation.data, submissionId, entry)
      .finally(() => {
        entry.updatedAt = Date.now();
        entry.inFlight = null;
      });
  }
  const result = await entry.inFlight;
  return res.status(result.status).json(result.body);
});

app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'Không tìm thấy API được yêu cầu.' });
});

app.use(express.static(distDir));
app.get('*', (_req, res, next) => {
  res.sendFile(path.join(distDir, 'index.html'), (error) => {
    if (error) next(error);
  });
});

app.use((error, _req, res, _next) => {
  console.error('Request failed:', error);
  const status = error.type === 'entity.too.large' ? 413 : 500;
  res.status(status).json({ error: status === 413 ? 'Dữ liệu gửi lên quá lớn.' : 'Đã xảy ra lỗi máy chủ.' });
});

export { app };

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  app.listen(port, () => {
    console.log(`NORE MEDIA server listening on port ${port}`);
  });
}
