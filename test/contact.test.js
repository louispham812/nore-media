import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { after, test } from 'node:test';

for (const name of [
  'CONTACT_EMAIL_TO',
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_SECURE',
  'SMTP_USER',
  'SMTP_PASS',
  'GOOGLE_SERVICE_ACCOUNT_EMAIL',
  'GOOGLE_PRIVATE_KEY',
  'GOOGLE_SHEETS_SPREADSHEET_ID',
]) {
  process.env[name] = '';
}

const { app, deliverSubmission, withRetry } = await import('../server/index.js');
const server = app.listen(0);
await new Promise((resolve) => server.once('listening', resolve));
const baseUrl = `http://127.0.0.1:${server.address().port}`;

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

test('email-only setup is valid when Google Sheets has not been configured', async () => {
  const { getConfiguration } = await import('../server/index.js');
  const config = getConfiguration({
    CONTACT_EMAIL_TO: '',
    SMTP_HOST: 'smtp.example.com',
    SMTP_PORT: '465',
    SMTP_SECURE: 'true',
    SMTP_USER: 'sender@example.com',
    SMTP_PASS: 'test-password',
    GOOGLE_SERVICE_ACCOUNT_EMAIL: '',
    GOOGLE_PRIVATE_KEY: '',
    GOOGLE_SHEETS_SPREADSHEET_ID: '',
  });
  assert.equal(config.sheetsEnabled, false);
  assert.equal(config.emailTo, 'admin@noreagency.com');
});

test('email-only delivery sends notification and customer confirmation without Sheets', async () => {
  const sentMessages = [];
  const transporter = {
    async sendMail(message) {
      sentMessages.push(message);
    },
  };
  const config = {
    sheetsEnabled: false,
    emailTo: 'admin@noreagency.com',
    smtpUser: 'sender@example.com',
  };
  const data = {
    name: 'Khách thử nghiệm',
    phone: '0900000000',
    email: 'customer@example.com',
    message: 'Tôi cần tư vấn dịch vụ',
  };
  const entry = {
    deliveries: { admin: false, sheet: false, confirmation: false },
  };

  const result = await deliverSubmission(
    config,
    data,
    randomUUID(),
    entry,
    transporter,
  );

  assert.equal(result.status, 200);
  assert.match(result.body.message, /chưa được lưu vào sheet/);
  assert.equal(result.body.sheetsEnabled, false);
  assert.equal(result.body.confirmationWarning, false);
  assert.deepEqual(sentMessages.map((message) => message.to), [
    'admin@noreagency.com',
    'customer@example.com',
  ]);
  assert.deepEqual(entry.deliveries, { admin: true, sheet: false, confirmation: true });
});

test('contact endpoint filters bots, validates idempotency, and rate limits submissions', async () => {
  const payload = {
    name: 'Khách thử nghiệm',
    phone: '0900000000',
    email: 'test@example.com',
    message: 'Yêu cầu tư vấn',
  };
  const send = (body, idempotencyKey) => fetch(`${baseUrl}/api/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}),
    },
    body: JSON.stringify(body),
  });

  const botResponse = await send({ ...payload, website: 'spam.example' }, randomUUID());
  assert.equal(botResponse.status, 200);

  const missingKeyResponse = await send(payload);
  assert.equal(missingKeyResponse.status, 400);
  assert.match((await missingKeyResponse.json()).error, /Mã gửi biểu mẫu/);

  const validRequest = await send(payload, randomUUID());
  assert.equal(validRequest.status, 503);
  assert.match((await validRequest.json()).error, /SMTP/);

  const fourthRequest = await send(payload, randomUUID());
  assert.equal(fourthRequest.status, 503);

  const fifthRequest = await send(payload, randomUUID());
  assert.equal(fifthRequest.status, 503);

  const limitedRequest = await send(payload, randomUUID());
  assert.equal(limitedRequest.status, 429);
});

test('delivery retries transient failures and stops after a successful attempt', async () => {
  let attempts = 0;
  await withRetry('test destination', async () => {
    attempts += 1;
    if (attempts < 3) {
      const error = new Error('temporary failure');
      error.code = 'ETIMEDOUT';
      throw error;
    }
  });
  assert.equal(attempts, 3);
});

test('delivery does not retry permanent provider errors', async () => {
  let attempts = 0;
  await assert.rejects(
    withRetry('test destination', async () => {
      attempts += 1;
      const error = new Error('permanent failure');
      error.response = { status: 403 };
      throw error;
    }),
    /permanent failure/,
  );
  assert.equal(attempts, 1);
});
