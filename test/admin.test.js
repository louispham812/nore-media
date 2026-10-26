import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { app } from '../server/index.js';
import {
  signAdminToken,
  signClientToken,
  verifyAdminToken,
  verifyClientToken,
  matchesProjectCode,
  verifyClientLogin,
  serializeMilestones,
  parseMilestones,
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

test('matchesProjectCode and verifyClientLogin utilities', () => {
  // Test project code matching variants
  assert.equal(matchesProjectCode('NR-001', 'NR-001'), true);
  assert.equal(matchesProjectCode('nr-001', 'NR-001'), true);
  assert.equal(matchesProjectCode('nr001', 'NR-001'), true);
  assert.equal(matchesProjectCode('#1', 'NR-001'), true);
  assert.equal(matchesProjectCode('1', 'NR-001'), true);
  assert.equal(matchesProjectCode('nr-1', 'NR-001'), true);
  assert.equal(matchesProjectCode('NR-1', 'NR-001'), true);
  assert.equal(matchesProjectCode('NR-002', 'NR-001'), false);
  assert.equal(matchesProjectCode('#2', 'NR-001'), false);

  const mockList = [
    { projectCode: 'NR-001', pin: '123456', projectName: 'TVC ACTS' },
    { projectCode: 'NR-002', pin: '654321', projectName: 'Photoshoot Nore' },
  ];

  // Correct login
  const match1 = verifyClientLogin('NR-001', '123456', mockList);
  assert.ok(match1);
  assert.equal(match1.projectName, 'TVC ACTS');

  // Correct login with shorthand
  const matchShorthand = verifyClientLogin('#1', '123456', mockList);
  assert.ok(matchShorthand);
  assert.equal(matchShorthand.projectName, 'TVC ACTS');

  // Wrong PIN
  assert.equal(verifyClientLogin('NR-001', 'wrongpin', mockList), null);

  // Non-existent project
  assert.equal(verifyClientLogin('NR-999', '123456', mockList), null);
});

test('Client and Admin tokens role validation', () => {
  const secret = 'super-secret-key-12345';
  const adminToken = signAdminToken({ email: 'admin@noreagency.com' }, secret);
  const clientToken = signClientToken({ projectCode: 'NR-001' }, secret);

  // Admin token
  assert.ok(verifyAdminToken(adminToken, secret));
  assert.ok(verifyClientToken(adminToken, secret), 'Admin token should also be accepted by verifyClientToken');

  // Client token
  assert.equal(verifyAdminToken(clientToken, secret), null, 'Client token must not be accepted by verifyAdminToken');
  const verifiedClient = verifyClientToken(clientToken, secret);
  assert.ok(verifiedClient);
  assert.equal(verifiedClient.role, 'client');
  assert.equal(verifiedClient.projectCode, 'NR-001');
});

test('Unified Auth Login API & Client Progress API endpoints', async (t) => {
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;

  t.after(() => {
    server.close();
  });

  // 1. Unified login as Admin
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@noreagency.com';
  const adminPass = process.env.ADMIN_PASSWORD || 'NoreAdmin@2026!';
  const resAdminLogin = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: adminEmail, password: adminPass }),
  });
  assert.equal(resAdminLogin.status, 200);
  const adminData = await resAdminLogin.json();
  assert.equal(adminData.role, 'admin');
  assert.ok(adminData.token);

  // 2. Unified login as Client using NR-001
  const resClientLogin = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: 'NR-001', password: '123456' }),
  });
  assert.equal(resClientLogin.status, 200);
  const clientData = await resClientLogin.json();
  assert.equal(clientData.role, 'client');
  assert.equal(clientData.projectCode, 'NR-001');
  assert.ok(clientData.progress);
  assert.equal(clientData.progress.pin, undefined, 'Client progress response must not expose PIN');

  // 3. Unified login with invalid credentials
  const resInvalid = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: 'NR-001', password: 'wrong' }),
  });
  assert.equal(resInvalid.status, 401);

  // 4. Access client progress with client token
  const resProgress = await fetch(`${baseUrl}/api/client/progress`, {
    headers: { Authorization: `Bearer ${clientData.token}` },
  });
  assert.equal(resProgress.status, 200);
  const progressData = await resProgress.json();
  assert.equal(progressData.ok, true);
  assert.equal(progressData.progress.projectCode, 'NR-001');
  assert.ok(Array.isArray(progressData.progress.milestones));

  // 5. Client forbidden from accessing another client's project
  const resForbidden = await fetch(`${baseUrl}/api/client/progress?code=NR-002`, {
    headers: { Authorization: `Bearer ${clientData.token}` },
  });
  assert.equal(resForbidden.status, 403);
});

test('serializeMilestones and parseMilestones bi-directional conversion', () => {
  const original = [
    { title: 'Họp Kick-off & Moodboard', status: 'completed' },
    { title: 'Kịch bản phân cảnh', status: 'in_progress' },
    { title: 'Ghi hình On-set', status: 'pending' },
  ];

  // 1. Serialize to Sheet format
  const serialized = serializeMilestones(original);
  assert.ok(serialized.includes('[x] Họp Kick-off & Moodboard'));
  assert.ok(serialized.includes('[-] Kịch bản phân cảnh'));
  assert.ok(serialized.includes('[ ] Ghi hình On-set'));

  // 2. Parse back from Sheet format
  const parsed = parseMilestones(serialized);
  assert.equal(parsed.length, 3);
  assert.equal(parsed[0].title, 'Họp Kick-off & Moodboard');
  assert.equal(parsed[0].status, 'completed');
  assert.equal(parsed[1].title, 'Kịch bản phân cảnh');
  assert.equal(parsed[1].status, 'in_progress');
  assert.equal(parsed[2].title, 'Ghi hình On-set');
  assert.equal(parsed[2].status, 'pending');

  // 3. Backward compatibility: Parse from legacy JSON
  const jsonStr = JSON.stringify(original);
  const parsedFromJson = parseMilestones(jsonStr);
  assert.equal(parsedFromJson.length, 3);
  assert.equal(parsedFromJson[0].status, 'completed');

  // 4. Emoji / Symbol tolerance: ✓, ⏳, ○
  const emojiStr = '✓ Kịch bản\n⏳ Quay phim\n○ Dựng phim';
  const parsedFromEmoji = parseMilestones(emojiStr);
  assert.equal(parsedFromEmoji[0].status, 'completed');
  assert.equal(parsedFromEmoji[1].status, 'in_progress');
  assert.equal(parsedFromEmoji[2].status, 'pending');
});
