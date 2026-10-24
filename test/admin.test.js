import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { app } from '../server/index.js';
import {
  signAdminToken,
  verifyAdminToken,
  safeCompare,
} from '../server/adminService.js';
import { isJwtValid } from '../src/hooks/useAdminAuth.js';

test('adminService token signing and verification', () => {
  const secret = 'super-secret-key-12345';
  const payload = { email: 'admin@noreagency.com' };

  const token = signAdminToken(payload, secret);
  assert.ok(token, 'Token should be generated');

  const verified = verifyAdminToken(token, secret);
  assert.ok(verified, 'Token should be verified successfully');
  assert.equal(verified.email, 'admin@noreagency.com');

  // Tampered token
  const tampered = token.slice(0, -3) + 'xyz';
  assert.equal(verifyAdminToken(tampered, secret), null, 'Tampered token must fail');

  // Wrong secret
  assert.equal(verifyAdminToken(token, 'wrong-secret'), null, 'Wrong secret must fail');
});

test('adminService safeCompare utility', () => {
  assert.equal(safeCompare('Password123', 'Password123'), true);
  assert.equal(safeCompare('Password123', 'Password124'), false);
  assert.equal(safeCompare('Short', 'MuchLongerPassword'), false);
});

test('useAdminAuth isJwtValid utility', () => {
  const secret = 'super-secret-key-12345';
  const token = signAdminToken({ email: 'admin@noreagency.com' }, secret);
  assert.equal(isJwtValid(token), true, 'Valid token should pass');
  assert.equal(isJwtValid(''), false, 'Empty token should fail');
  assert.equal(isJwtValid('invalid.jwt'), false, 'Invalid format should fail');

  // Expired token check
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const exp = Math.floor(Date.now() / 1000) - 100;
  const expiredBody = Buffer.from(JSON.stringify({ email: 'admin@noreagency.com', exp })).toString('base64url');
  assert.equal(isJwtValid(`${header}.${expiredBody}.sig`), false, 'Expired token should fail');
});

test('admin API endpoints authentication and authorization', async (t) => {
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;

  t.after(() => {
    server.close();
  });

  // 1. Missing credentials
  const resEmpty = await fetch(`${baseUrl}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  assert.equal(resEmpty.status, 400, 'Should reject empty login body');

  // 2. Incorrect credentials
  const resWrong = await fetch(`${baseUrl}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@noreagency.com', password: 'incorrectPassword!' }),
  });
  assert.equal(resWrong.status, 401, 'Should reject wrong password');

  // 3. Successful login
  const validEmail = process.env.ADMIN_EMAIL || 'admin@noreagency.com';
  const validPassword = process.env.ADMIN_PASSWORD || 'NoreAdmin@2026!';
  const resLogin = await fetch(`${baseUrl}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: validEmail, password: validPassword }),
  });
  assert.equal(resLogin.status, 200, 'Should authenticate successfully');
  const loginBody = await resLogin.json();
  assert.ok(loginBody.token, 'Should return jwt token');

  // 4. Access /api/admin/me without token
  const resNoAuth = await fetch(`${baseUrl}/api/admin/me`);
  assert.equal(resNoAuth.status, 401, 'Should reject /api/admin/me without token');

  // 5. Access /api/admin/me with valid token
  const resMe = await fetch(`${baseUrl}/api/admin/me`, {
    headers: { Authorization: `Bearer ${loginBody.token}` },
  });
  assert.equal(resMe.status, 200, 'Should accept /api/admin/me with valid token');
  const meBody = await resMe.json();
  assert.equal(meBody.ok, true);
  assert.equal(meBody.admin.email, validEmail.toLowerCase());

  // 6. Access /api/admin/sheets-data with valid token
  const resSheets = await fetch(`${baseUrl}/api/admin/sheets-data`, {
    headers: { Authorization: `Bearer ${loginBody.token}` },
  });
  assert.equal(resSheets.status, 200, 'Should return sheets data');
  const sheetsBody = await resSheets.json();
  assert.ok(Array.isArray(sheetsBody.dashboard?.kpis), 'KPIs should be an array');
  assert.ok(Array.isArray(sheetsBody.projects), 'Projects should be an array');
  assert.ok(Array.isArray(sheetsBody.formSubmissions), 'Form submissions should be an array');

  // 7. Test POST /api/admin/projects without name (400)
  const resBadAdd = await fetch(`${baseUrl}/api/admin/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${loginBody.token}`,
    },
    body: JSON.stringify({}),
  });
  assert.equal(resBadAdd.status, 400, 'Should reject project without name');

  // 8. Test POST /api/admin/projects (Create)
  const testProjectPayload = {
    name: 'Khách Hàng Test CI/CD',
    brand: 'Test Brand',
    service: 'TVC Quảng cáo',
    assignee: 'CI Bot',
    stage: 'Đang đàm phán',
    value: '1.200.000 ₫',
    paymentStatus: 'Chưa thanh toán',
  };
  const resAdd = await fetch(`${baseUrl}/api/admin/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${loginBody.token}`,
    },
    body: JSON.stringify(testProjectPayload),
  });
  assert.equal(resAdd.status, 201, 'Should create project successfully');
  const addBody = await resAdd.json();
  assert.ok(addBody.project?.id, 'Should return created project id');
  const createdId = addBody.project.id;

  // 9. Test PUT /api/admin/projects/:id (Update)
  const resUpdate = await fetch(`${baseUrl}/api/admin/projects/${encodeURIComponent(createdId)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${loginBody.token}`,
    },
    body: JSON.stringify({
      ...testProjectPayload,
      stage: 'Đang sản xuất',
      paymentStatus: 'Đã thanh toán',
    }),
  });
  assert.equal(resUpdate.status, 200, 'Should update project successfully');
  const updateBody = await resUpdate.json();
  assert.equal(updateBody.project.stage, 'Đang sản xuất');

  // 10. Test DELETE /api/admin/projects/:id (Delete)
  const resDelete = await fetch(`${baseUrl}/api/admin/projects/${encodeURIComponent(createdId)}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${loginBody.token}`,
    },
  });
  assert.equal(resDelete.status, 200, 'Should delete project successfully');
});
