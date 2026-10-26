import { chromium } from 'playwright';
import { spawn, execSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const DEMO_PORT = 3333;
const BASE_URL = `http://localhost:${DEMO_PORT}`;
const TEMP_VIDEO_DIR = path.join(rootDir, 'temp_video_records', 'run_' + Date.now());
const OUTPUT_MP4 = path.join(rootDir, 'demo-nore-media.mp4');
const SNAPSHOT_DIR = path.join(rootDir, 'demo_snapshots');

// Clean and prepare output directories
fs.mkdirSync(TEMP_VIDEO_DIR, { recursive: true });

if (!fs.existsSync(SNAPSHOT_DIR)) {
  fs.mkdirSync(SNAPSHOT_DIR, { recursive: true });
}

async function isServerRunning(url = BASE_URL) {
  try {
    const res = await fetch(url);
    return res.status === 200;
  } catch {
    return false;
  }
}

async function ensureServer() {
  const running = await isServerRunning();
  if (running) {
    console.log(`✅ Máy chủ NORE MEDIA đã đang hoạt động trên port ${DEMO_PORT}.`);
    return null;
  }

  console.log(`🚀 Đang khởi động máy chủ NORE MEDIA trên port ${DEMO_PORT}...`);
  const serverProcess = spawn('node', ['server/index.js'], {
    cwd: rootDir,
    stdio: 'inherit',
    env: { ...process.env, PORT: String(DEMO_PORT) },
  });

  const startTime = Date.now();
  while (Date.now() - startTime < 20000) {
    await new Promise((r) => setTimeout(r, 600));
    if (await isServerRunning()) {
      console.log(`✅ Máy chủ NORE MEDIA đã khởi động thành công trên port ${DEMO_PORT}!`);
      return serverProcess;
    }
  }

  throw new Error(`Không thể kết nối đến máy chủ NORE MEDIA trên port ${DEMO_PORT} sau 20 giây.`);
}

// Client-side script injected via page.addInitScript to guarantee overlays exist across page reloads
const INJECTED_OVERLAY_SCRIPT = `
(() => {
  if (window.__demoOverlayInjected) return;
  window.__demoOverlayInjected = true;

  const style = document.createElement('style');
  style.id = '__demo_injected_styles';
  style.textContent = \`
    /* Root zoom transition */
    #root {
      transition: transform 0.65s cubic-bezier(0.22, 1, 0.36, 1), transform-origin 0.65s cubic-bezier(0.22, 1, 0.36, 1) !important;
      transform-origin: 50% 50%;
      will-change: transform, transform-origin;
    }
    html, body {
      overflow-x: hidden !important;
    }

    /* Caption Overlay Glassmorphism */
    #__demo_caption_container {
      position: fixed;
      bottom: 32px;
      left: 50%;
      transform: translateX(-50%) translateY(0);
      z-index: 2147483646;
      background: rgba(15, 23, 42, 0.94);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.16);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.75), 0 0 35px rgba(0, 229, 255, 0.15);
      border-radius: 18px;
      padding: 16px 28px;
      min-width: 660px;
      max-width: 980px;
      display: flex;
      align-items: center;
      gap: 20px;
      font-family: -apple-system, BlinkMacSystemFont, "Space Grotesk", "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
      pointer-events: none;
      transition: opacity 0.35s ease, transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
      opacity: 1;
    }
    #__demo_caption_container.__hidden {
      opacity: 0;
      transform: translateX(-50%) translateY(24px);
    }
    #__demo_caption_badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .__badge_client {
      background: rgba(0, 229, 255, 0.16);
      border: 1.5px solid #00e5ff;
      color: #00e5ff;
      box-shadow: 0 0 14px rgba(0, 229, 255, 0.3);
    }
    .__badge_tracking {
      background: rgba(59, 130, 246, 0.2);
      border: 1.5px solid #60a5fa;
      color: #60a5fa;
      box-shadow: 0 0 14px rgba(96, 165, 250, 0.3);
    }
    .__badge_admin {
      background: rgba(245, 158, 11, 0.2);
      border: 1.5px solid #fbbf24;
      color: #fbbf24;
      box-shadow: 0 0 14px rgba(251, 191, 36, 0.3);
    }
    #__demo_caption_body {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    #__demo_caption_action {
      font-size: 19px;
      font-weight: 700;
      color: #ffffff;
      line-height: 1.3;
      letter-spacing: -0.2px;
    }
    #__demo_caption_desc {
      font-size: 14.5px;
      color: rgba(226, 232, 240, 0.88);
      line-height: 1.4;
    }

    /* Section Intro Card Overlay */
    #__demo_section_overlay {
      position: fixed;
      inset: 0;
      z-index: 2147483647;
      background: radial-gradient(circle at center, rgba(15, 23, 42, 0.98) 0%, rgba(2, 6, 23, 0.99) 100%);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      transition: opacity 0.5s ease;
      opacity: 1;
      font-family: -apple-system, BlinkMacSystemFont, "Space Grotesk", "Segoe UI", Roboto, sans-serif;
    }
    #__demo_section_overlay.__hidden {
      opacity: 0;
    }
    #__demo_section_card {
      text-align: center;
      max-width: 900px;
      padding: 50px 60px;
      border: 1px solid rgba(255, 255, 255, 0.12);
      background: rgba(30, 41, 59, 0.55);
      border-radius: 28px;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8), 0 0 70px rgba(0, 229, 255, 0.12);
    }
    #__demo_section_number {
      display: inline-block;
      font-size: 14px;
      font-weight: 800;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      color: #00e5ff;
      margin-bottom: 18px;
      padding: 6px 20px;
      background: rgba(0, 229, 255, 0.12);
      border: 1px solid rgba(0, 229, 255, 0.35);
      border-radius: 9999px;
    }
    #__demo_section_title {
      font-size: 38px;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 16px;
      letter-spacing: -0.5px;
      line-height: 1.25;
    }
    #__demo_section_desc {
      font-size: 18px;
      color: #94a3b8;
      line-height: 1.6;
      margin-bottom: 26px;
    }
    #__demo_section_features {
      display: flex;
      justify-content: center;
      gap: 14px;
      flex-wrap: wrap;
    }
    .__demo_feature_pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 18px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.14);
      border-radius: 12px;
      color: #e2e8f0;
      font-size: 15px;
      font-weight: 500;
    }

    /* Virtual Mouse Cursor */
    #__demo_virtual_cursor {
      position: fixed;
      top: 0;
      left: 0;
      width: 28px;
      height: 28px;
      z-index: 2147483647;
      pointer-events: none;
      transform: translate(-3px, -3px);
      transition: transform 0.08s ease-out;
      will-change: left, top;
    }
    .__demo_ripple {
      position: fixed;
      border-radius: 50%;
      pointer-events: none;
      z-index: 2147483646;
      border: 2.5px solid #00e5ff;
      background: rgba(0, 229, 255, 0.25);
      transform: translate(-50%, -50%) scale(0);
      animation: __demo_ripple_anim 0.55s cubic-bezier(0, 0.2, 0.8, 1) forwards;
    }
    @keyframes __demo_ripple_anim {
      0% {
        width: 10px;
        height: 10px;
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
      }
      100% {
        width: 70px;
        height: 70px;
        opacity: 0;
        transform: translate(-50%, -50%) scale(2.4);
      }
    }
  \`;
  document.head.appendChild(style);

  function setupDOM() {
    if (!document.getElementById('__demo_caption_container')) {
      const cap = document.createElement('div');
      cap.id = '__demo_caption_container';
      cap.className = '__hidden';
      cap.innerHTML = \`
        <div id="__demo_caption_badge" class="__badge_client">👤 KHÁCH HÀNG</div>
        <div id="__demo_caption_body">
          <div id="__demo_caption_action">Thao tác</div>
          <div id="__demo_caption_desc">Mô tả</div>
        </div>
      \`;
      document.body.appendChild(cap);
    }

    if (!document.getElementById('__demo_section_overlay')) {
      const sec = document.createElement('div');
      sec.id = '__demo_section_overlay';
      sec.className = '__hidden';
      sec.innerHTML = \`
        <div id="__demo_section_card">
          <div id="__demo_section_number"></div>
          <h1 id="__demo_section_title"></h1>
          <p id="__demo_section_desc"></p>
          <div id="__demo_section_features"></div>
        </div>
      \`;
      document.body.appendChild(sec);
    }

    if (!document.getElementById('__demo_virtual_cursor')) {
      const cur = document.createElement('div');
      cur.id = '__demo_virtual_cursor';
      cur.innerHTML = \`
        <svg viewBox="0 0 32 32" width="28" height="28" fill="none">
          <filter id="__cur_shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="1" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.6)" />
          </filter>
          <path d="M6 3L23 16.5L14.5 18L10 27L6 3Z" fill="#ffffff" stroke="#0f172a" stroke-width="2" filter="url(#__cur_shadow)" stroke-linejoin="round"/>
          <circle cx="9" cy="7" r="2.5" fill="#00e5ff"/>
        </svg>
      \`;
      document.body.appendChild(cur);

      window.addEventListener('mousemove', (e) => {
        cur.style.left = e.clientX + 'px';
        cur.style.top = e.clientY + 'px';
      }, { passive: true });

      window.addEventListener('mousedown', (e) => {
        window.__demoRipple(e.clientX, e.clientY);
      }, { passive: true });
    }
  }

  window.__demoRipple = (x, y) => {
    const r = document.createElement('div');
    r.className = '__demo_ripple';
    r.style.left = x + 'px';
    r.style.top = y + 'px';
    document.body.appendChild(r);
    setTimeout(() => {
      if (r.parentNode) r.parentNode.removeChild(r);
    }, 600);
  };

  window.__demoZoom = {
    zoomTo(selectorOrPos, scale = 1.35) {
      let cx = window.innerWidth / 2;
      let cy = window.innerHeight / 2;

      if (typeof selectorOrPos === 'string') {
        const el = document.querySelector(selectorOrPos);
        if (el) {
          const rect = el.getBoundingClientRect();
          cx = rect.left + rect.width / 2;
          cy = rect.top + rect.height / 2;
        }
      } else if (selectorOrPos && typeof selectorOrPos.x === 'number') {
        cx = selectorOrPos.x;
        cy = selectorOrPos.y;
      }

      cx = Math.max(100, Math.min(window.innerWidth - 100, cx));
      cy = Math.max(80, Math.min(window.innerHeight - 80, cy));

      const root = document.getElementById('root');
      if (root) {
        root.style.transformOrigin = \`\${cx}px \${cy}px\`;
        root.style.transform = \`scale(\${scale})\`;
      }
    },
    reset() {
      const root = document.getElementById('root');
      if (root) {
        root.style.transform = 'scale(1)';
      }
    }
  };

  window.__demoCaption = {
    show(badgeType, actionText, descText) {
      setupDOM();
      const cap = document.getElementById('__demo_caption_container');
      const badge = document.getElementById('__demo_caption_badge');
      const action = document.getElementById('__demo_caption_action');
      const desc = document.getElementById('__demo_caption_desc');

      badge.className = '';
      if (badgeType === 'admin') {
        badge.className = '__badge_admin';
        badge.textContent = '🛡️ QUẢN TRỊ VIÊN (ADMIN)';
      } else if (badgeType === 'tracking') {
        badge.className = '__badge_tracking';
        badge.textContent = '📊 KHÁCH HÀNG - TRA CỨU TIẾN ĐỘ';
      } else {
        badge.className = '__badge_client';
        badge.textContent = '👤 KHÁCH HÀNG';
      }

      action.textContent = actionText;
      desc.textContent = descText;
      cap.classList.remove('__hidden');
    },
    hide() {
      const cap = document.getElementById('__demo_caption_container');
      if (cap) cap.classList.add('__hidden');
    }
  };

  window.__demoSection = {
    show(secNum, title, desc, features = []) {
      setupDOM();
      const sec = document.getElementById('__demo_section_overlay');
      document.getElementById('__demo_section_number').textContent = secNum;
      document.getElementById('__demo_section_title').textContent = title;
      document.getElementById('__demo_section_desc').textContent = desc;
      const featContainer = document.getElementById('__demo_section_features');
      featContainer.innerHTML = '';
      features.forEach(f => {
        const p = document.createElement('div');
        p.className = '__demo_feature_pill';
        p.innerHTML = \`<span style="color:#00e5ff; font-weight:700;">✦</span> <span>\${f}</span>\`;
        featContainer.appendChild(p);
      });
      sec.classList.remove('__hidden');
    },
    hide() {
      const sec = document.getElementById('__demo_section_overlay');
      if (sec) sec.classList.add('__hidden');
    },
    showOutro() {
      setupDOM();
      const sec = document.getElementById('__demo_section_overlay');
      const card = document.getElementById('__demo_section_card');
      card.innerHTML = \`
        <div style="display:inline-flex; align-items:center; gap:14px; margin-bottom:22px;">
          <img src="/logo.jpg" alt="NORE MEDIA" style="width:58px; height:58px; border-radius:14px; object-fit:cover; border:2px solid #00e5ff; box-shadow:0 0 24px rgba(0,229,255,0.4);" />
          <span style="font-size:28px; font-weight:800; letter-spacing:1px; color:#ffffff;">NORE MEDIA</span>
        </div>
        <h1 style="font-size:38px; font-weight:800; color:#ffffff; line-height:1.25; margin-bottom:16px;">
          HỆ THỐNG TRUYỀN THÔNG & QUẢN TRỊ TIẾN ĐỘ THỜI GIAN THỰC
        </h1>
        <p style="font-size:18px; color:#94a3b8; max-width:680px; margin:0 auto 30px auto; line-height:1.6;">
          Giải pháp sản xuất hình ảnh cao cấp & quản trị vòng đời dự án tự động hóa từ Tư vấn đến Bàn giao.
        </p>
        <div style="display:flex; justify-content:center; gap:26px; font-size:16px; color:#e2e8f0; font-weight:600;">
          <span>🌐 noremedia.vn</span>
          <span style="color:rgba(255,255,255,0.2)">|</span>
          <span>📞 Hotline: 093 599 71 74</span>
          <span style="color:rgba(255,255,255,0.2)">|</span>
          <span>✉️ contact@noreagency.com</span>
        </div>
      \`;
      sec.classList.remove('__hidden');
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupDOM);
  } else {
    setupDOM();
  }
})();
`;

// Helper functions for page interactions
async function setCaption(page, badgeType, actionText, descText) {
  await page.evaluate(({ badgeType, actionText, descText }) => {
    window.__demoCaption?.show(badgeType, actionText, descText);
  }, { badgeType, actionText, descText });
  await page.waitForTimeout(300);
}

async function hideCaption(page) {
  await page.evaluate(() => {
    window.__demoCaption?.hide();
  });
  await page.waitForTimeout(200);
}

async function zoomTo(page, selectorOrPos, scale = 1.35) {
  await page.evaluate(({ selectorOrPos, scale }) => {
    window.__demoZoom?.zoomTo(selectorOrPos, scale);
  }, { selectorOrPos, scale });
  await page.waitForTimeout(700);
}

async function resetZoom(page) {
  await page.evaluate(() => {
    window.__demoZoom?.reset();
  });
  await page.waitForTimeout(700);
}

async function showSection(page, secNum, title, desc, features = []) {
  await page.evaluate(({ secNum, title, desc, features }) => {
    window.__demoSection?.show(secNum, title, desc, features);
  }, { secNum, title, desc, features });
  await page.waitForTimeout(2300);
  await page.evaluate(() => {
    window.__demoSection?.hide();
  });
  await page.waitForTimeout(600);
}

async function showOutro(page) {
  await page.evaluate(() => {
    window.__demoSection?.showOutro();
  });
  await page.waitForTimeout(3500);
}

async function smartClick(page, selectorOrLocator, options = {}) {
  const locator = typeof selectorOrLocator === 'string'
    ? page.locator(selectorOrLocator).first()
    : selectorOrLocator;

  await locator.waitFor({ state: 'visible', timeout: 10000 });
  await locator.scrollIntoViewIfNeeded().catch(() => {});

  const box = await locator.boundingBox();
  if (!box) {
    await locator.click();
    return;
  }
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;

  await page.mouse.move(x, y, { steps: options.steps || 16 });
  await page.waitForTimeout(100);

  await page.evaluate(({ x, y }) => {
    window.__demoRipple?.(x, y);
  }, { x, y });

  await page.mouse.down();
  await page.waitForTimeout(80);
  await page.mouse.up();
  await page.waitForTimeout(options.waitAfter || 450);
}

async function smartHover(page, selectorOrLocator, options = {}) {
  const locator = typeof selectorOrLocator === 'string'
    ? page.locator(selectorOrLocator).first()
    : selectorOrLocator;

  await locator.waitFor({ state: 'visible', timeout: 10000 });
  await locator.scrollIntoViewIfNeeded().catch(() => {});

  const box = await locator.boundingBox();
  if (box) {
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    await page.mouse.move(x, y, { steps: options.steps || 14 });
  } else {
    await locator.hover();
  }
  await page.waitForTimeout(options.waitAfter || 600);
}

async function smartType(page, selectorOrLocator, text, delay = 45) {
  const locator = typeof selectorOrLocator === 'string'
    ? page.locator(selectorOrLocator).first()
    : selectorOrLocator;

  await locator.waitFor({ state: 'visible', timeout: 10000 });
  await locator.scrollIntoViewIfNeeded().catch(() => {});
  await smartClick(page, locator, { waitAfter: 150 });
  await locator.fill('');
  await locator.pressSequentially(text, { delay });
  await page.waitForTimeout(250);
}

async function smoothScroll(page, targetY, durationMs = 1000) {
  await page.evaluate(async ({ targetY, durationMs }) => {
    const startY = window.scrollY;
    const diff = targetY - startY;
    const startTime = performance.now();
    await new Promise((resolve) => {
      function step(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / durationMs, 1);
        const ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        window.scrollTo(0, startY + diff * ease);
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          resolve();
        }
      }
      requestAnimationFrame(step);
    });
  }, { targetY, durationMs });
  await page.waitForTimeout(300);
}

// MAIN RECORDING PIPELINE
async function run() {
  console.log('🎬 Bắt đầu quá trình quay video demo tự động cho NORE MEDIA...');

  let serverProcess = null;
  try {
    serverProcess = await ensureServer();

    const browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security'],
    });

    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 1,
      recordVideo: {
        dir: TEMP_VIDEO_DIR,
        size: { width: 1920, height: 1080 },
      },
    });

    const page = await context.newPage();
    await page.addInitScript(INJECTED_OVERLAY_SCRIPT);

    console.log('🌐 Bắt đầu kịch bản quay chi tiết...');

    // ==========================================
    // PHẦN 1: KHÁCH HÀNG KHÁM PHÁ WEBSITE & ĐẶT LỊCH TƯ VẤN
    // ==========================================
    console.log('\n--- PHẦN 1: KHÁCH HÀNG KHÁM PHÁ WEBSITE & ĐẶT LỊCH TƯ VẤN ---');

    console.log('  -> Mở trang chủ...');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);

    console.log('  -> Hiển thị Section Intro Phần 1...');
    await showSection(
      page,
      'PHẦN 1 / 3',
      'KHÁCH HÀNG KHÁM PHÁ WEBSITE & ĐẶT LỊCH TƯ VẤN',
      'Trải nghiệm giao diện cao cấp, tốc độ phản hồi tức thì & quy trình liên hệ chuyên nghiệp',
      ['Showreel & Thư viện dự án', 'Bộ lọc sản phẩm thông minh', 'Song ngữ Việt - Anh tức thì', 'Form tư vấn tự động xác thực']
    );

    // Bước 1.1: Trang chủ
    console.log('  -> Bước 1.1: Trang chủ & Giới thiệu dịch vụ...');
    await setCaption(
      page,
      'client',
      'Khách hàng truy cập Trang chủ Nore Media',
      'Xem tổng quan năng lực truyền thông & sản xuất hình ảnh cao cấp'
    );
    await page.waitForTimeout(1000);
    await smoothScroll(page, 650, 1200);
    await page.waitForTimeout(1000);
    await smoothScroll(page, 1400, 1200);
    await page.waitForTimeout(1200);

    // Bước 1.2: Bộ lọc Dự án tiêu biểu & Lightbox
    console.log('  -> Bước 1.2: Bộ lọc Dự án tiêu biểu & Lightbox...');
    await setCaption(
      page,
      'client',
      'Bộ lọc Dự án tiêu biểu theo Danh mục',
      'Lọc nhanh dự án (Tất cả / Sản phẩm / Thương hiệu) & trải nghiệm xem ảnh Lightbox'
    );
    await zoomTo(page, '.home-gallery-filters', 1.25);
    await page.waitForTimeout(600);

    // Filter "Sản phẩm"
    const productFilterBtn = page.locator('.home-filter-btn', { hasText: 'Sản phẩm' });
    await smartClick(page, productFilterBtn);
    await page.waitForTimeout(1000);

    // Filter "Thương hiệu"
    const brandFilterBtn = page.locator('.home-filter-btn', { hasText: 'Thương hiệu' });
    await smartClick(page, brandFilterBtn);
    await page.waitForTimeout(1000);

    // Filter "Tất cả"
    const allFilterBtn = page.locator('.home-filter-btn', { hasText: 'Tất cả' });
    await smartClick(page, allFilterBtn);
    await page.waitForTimeout(800);
    await resetZoom(page);

    // Click 1 ảnh mở Lightbox
    const firstWorkCard = page.locator('.home-work-card').first();
    await smartClick(page, firstWorkCard);
    await page.waitForSelector('.gallery-lightbox-overlay', { state: 'visible', timeout: 5000 });
    await page.waitForTimeout(1200);

    // Chuyển ảnh tiếp theo
    await smartClick(page, 'button.gallery-lightbox-nav.next');
    await page.waitForTimeout(1400);

    // Đóng Lightbox
    await smartClick(page, 'button.gallery-lightbox-close');
    await page.waitForTimeout(700);

    // Bước 1.3: Chuyển đổi ngôn ngữ VI / EN
    console.log('  -> Bước 1.3: Chuyển đổi ngôn ngữ VI / EN...');
    await setCaption(
      page,
      'client',
      'Hỗ trợ song ngữ Việt - Anh (VI / EN)',
      'Chuyển đổi giao diện toàn trang tức thì, chuẩn hóa cho đối tác quốc tế'
    );
    await smoothScroll(page, 0, 900);
    await zoomTo(page, 'button.lang-switch', 1.45);
    await smartClick(page, 'button.lang-switch');
    await page.waitForTimeout(1600);

    // Chuyển lại tiếng Việt
    await smartClick(page, 'button.lang-switch');
    await page.waitForTimeout(900);
    await resetZoom(page);

    // Bước 1.4: Trang Dịch vụ
    console.log('  -> Bước 1.4: Trang Dịch vụ...');
    await setCaption(
      page,
      'client',
      'Khám phá các gói dịch vụ sáng tạo',
      '3 gói dịch vụ cốt lõi: Marketing trọn gói, Sản xuất Video/Ảnh & Tổ chức sự kiện'
    );
    await smartClick(page, 'header nav a[href="/services"]');
    await page.waitForSelector('.nore-services', { state: 'visible', timeout: 8000 });
    await page.waitForTimeout(800);
    await smartHover(page, '.nore-service-card-marketing', { waitAfter: 900 });
    await smartHover(page, '.nore-service-card-production', { waitAfter: 900 });
    await smartHover(page, '.nore-service-card-event', { waitAfter: 900 });
    await smoothScroll(page, 450, 1000);
    await page.waitForTimeout(1000);

    // Bước 1.5: Trang Dự án
    console.log('  -> Bước 1.5: Trang Dự án...');
    await setCaption(
      page,
      'client',
      'Kho Video & Thư viện hình ảnh thực tế',
      'Xem các sản phẩm TVC, Viral Video & bộ ảnh thương hiệu độ phân giải cao'
    );
    await smartClick(page, 'header nav a[href="/projects"]');
    await page.waitForSelector('.projects-tab-wrap', { state: 'visible', timeout: 8000 });
    await page.waitForTimeout(1200);

    // Chuyển sang tab Thư viện ảnh (Gallery)
    const galleryTabBtn = page.locator('button.projects-tab-btn').nth(1);
    await smartClick(page, galleryTabBtn);
    await page.waitForTimeout(1600);
    await smoothScroll(page, 350, 900);
    await page.waitForTimeout(1000);

    // Bước 1.6: Trang Liên hệ
    console.log('  -> Bước 1.6: Trang Liên hệ...');
    await setCaption(
      page,
      'client',
      'Đăng ký tư vấn & Báo giá sản xuất',
      'Form gửi thông tin tự động xác thực, chống spam & đồng bộ ngay lập tức'
    );
    await smartClick(page, 'header nav a[href="/contact"]');
    await page.waitForSelector('form.contact-form', { state: 'visible', timeout: 8000 });
    await smoothScroll(page, 200, 600);
    await zoomTo(page, 'form.contact-form', 1.2);

    await smartType(page, 'input[name="name"]', 'Nguyễn Minh Hoàng', 40);
    await smartType(page, 'input[name="phone"]', '0909123456', 40);
    await smartType(page, 'input[name="email"]', 'hoang.nguyen@brand.vn', 35);
    await smartType(
      page,
      'textarea[name="message"]',
      'Cần tư vấn gói sản xuất TVC & bộ ảnh sản phẩm mới ra mắt.',
      30
    );

    await smartClick(page, 'form.contact-form button[type="submit"]');
    await page.waitForSelector('.form-feedback', { state: 'visible', timeout: 12000 });
    await page.waitForTimeout(2200);
    await resetZoom(page);
    await hideCaption(page);
    await page.waitForTimeout(500);

    // ==========================================
    // PHẦN 2: KHÁCH HÀNG THEO DÕI TIẾN ĐỘ DỰ ÁN TRỰC TUYẾN
    // ==========================================
    console.log('\n--- PHẦN 2: KHÁCH HÀNG THEO DÕI TIẾN ĐỘ DỰ ÁN TRỰC TUYẾN ---');

    console.log('  -> Hiển thị Section Intro Phần 2...');
    await showSection(
      page,
      'PHẦN 2 / 3',
      'KHÁCH HÀNG TRA CỨU TIẾN ĐỘ DỰ ÁN TRỰC TUYẾN',
      'Cổng thông tin riêng biệt cho khách hàng — Theo dõi tiến độ thời gian thực, xem 5 giai đoạn & nhận file',
      ['Đăng nhập bảo mật theo Mã dự án & PIN', 'Thanh tiến độ & Quy trình 5 bước', 'Checklist mốc công việc chi tiết', 'Kho lưu trữ file Demo & Master Final']
    );

    // Bước 2.1: Cổng đăng nhập
    console.log('  -> Bước 2.1: Đăng nhập Cổng Khách hàng...');
    await setCaption(
      page,
      'tracking',
      'Đăng nhập Cổng Khách Hàng chuyên biệt',
      'Tra cứu bảo mật bằng Mã dự án (NR-001) & Mã PIN cá nhân được cấp'
    );
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.admin-login-card', { state: 'visible', timeout: 8000 });
    await zoomTo(page, '.admin-login-card', 1.25);

    await smartType(page, '#login-identifier', 'NR-001', 50);
    await smartType(page, '#login-password', '123456', 50);
    await smartClick(page, 'button.admin-btn-login[type="submit"]');
    await resetZoom(page);

    // Bước 2.2: Trang Tiến độ trực tuyến
    console.log('  -> Bước 2.2: Trang Tiến độ trực tuyến...');
    await page.waitForURL('**/tien-do', { timeout: 10000 });
    await page.waitForSelector('.client-hero-card', { state: 'visible', timeout: 8000 });

    await setCaption(
      page,
      'tracking',
      'Tổng quan Tiến độ Dự án & Quy trình 5 Giai đoạn',
      'Hiển thị % hoàn thành (35%), thông tin hợp đồng & tiến trình sản xuất trực quan'
    );
    await zoomTo(page, '.client-hero-card', 1.2);
    await smartHover(page, '.client-hero-info', { waitAfter: 1200 });
    await smartHover(page, '.client-hero-progress-side', { waitAfter: 1200 });

    await zoomTo(page, '.client-stepper-list', 1.25);
    await page.waitForTimeout(1800);
    await resetZoom(page);

    // Bước 2.3: Checklist công việc & Nhận file bàn giao
    console.log('  -> Bước 2.3: Checklist công việc & Nhận file bàn giao...');
    await setCaption(
      page,
      'tracking',
      'Checklist Mốc công việc (Milestones) & Kho File bàn giao',
      'Khách hàng theo dõi chi tiết từng đầu việc đã xong / đang làm và nhận bản Demo'
    );
    await smoothScroll(page, 460, 900);
    await zoomTo(page, '.client-milestones-card', 1.2);
    await smartHover(page, '.client-milestone-item', { waitAfter: 1600 });
    await resetZoom(page);

    await zoomTo(page, '.client-deliverables-card', 1.25);
    await smartHover(page, '.client-dl-demo', { waitAfter: 1500 });
    await resetZoom(page);

    // Đăng xuất
    console.log('  -> Đăng xuất khách hàng...');
    await smoothScroll(page, 0, 700);
    await zoomTo(page, 'button.client-btn-logout', 1.35);
    await smartClick(page, 'button.client-btn-logout');
    await page.waitForURL('**/login**', { timeout: 8000 });
    await resetZoom(page);
    await hideCaption(page);
    await page.waitForTimeout(500);

    // ==========================================
    // PHẦN 3: QUẢN TRỊ VIÊN ĐIỀU HÀNH HỆ THỐNG (ADMIN)
    // ==========================================
    console.log('\n--- PHẦN 3: QUẢN TRỊ VIÊN ĐIỀU HÀNH HỆ THỐNG (ADMIN) ---');

    console.log('  -> Hiển thị Section Intro Phần 3...');
    await showSection(
      page,
      'PHẦN 3 / 3',
      'QUẢN TRỊ VIÊN ĐIỀU HÀNH HỆ THỐNG (ADMIN)',
      'Trung tâm kiểm soát toàn diện: CRM Hợp đồng, Lead khách hàng mới, Điều phối tiến độ & Đồng bộ Google Sheets',
      ['Dashboard KPI & Biểu đồ doanh thu', 'Quản lý dự án & Hợp đồng CRM', 'Tiếp nhận Lead khách hàng đa kênh', 'Cấp PIN & Điều hành tiến độ thời gian thực', 'Đồng bộ 2 chiều với Google Sheets']
    );

    // Bước 3.1: Đăng nhập Admin
    console.log('  -> Bước 3.1: Đăng nhập Quản trị viên...');
    await setCaption(
      page,
      'admin',
      'Đăng nhập Hệ thống Quản trị NORE MEDIA',
      'Xác thực tài khoản Admin quản trị cấp cao với JWT token bảo mật'
    );
    await zoomTo(page, '.admin-login-card', 1.25);
    await smartType(page, '#login-identifier', 'admin@noreagency.com', 40);
    await smartType(page, '#login-password', 'NoreAdmin@2026!', 40);
    await smartClick(page, 'button.admin-btn-login[type="submit"]');
    await resetZoom(page);

    // Bước 3.2: Tab Tổng quan (Dashboard)
    console.log('  -> Bước 3.2: Dashboard Thống kê thời gian thực...');
    await page.waitForURL('**/admin', { timeout: 10000 });
    await page.waitForSelector('.admin-kpi-grid', { state: 'visible', timeout: 8000 });

    await setCaption(
      page,
      'admin',
      'Dashboard Thống kê & Phân tích Thời gian thực',
      'Theo dõi 4 chỉ số KPI trọng yếu: Tổng số dự án, Pipeline, Doanh thu thực tế & Tỷ lệ hoàn thành'
    );
    await zoomTo(page, '.admin-kpi-grid', 1.22);
    await smartHover(page, '.admin-kpi-card:nth-child(1)', { waitAfter: 600 });
    await smartHover(page, '.admin-kpi-card:nth-child(2)', { waitAfter: 600 });
    await smartHover(page, '.admin-kpi-card:nth-child(3)', { waitAfter: 600 });
    await smartHover(page, '.admin-kpi-card:nth-child(4)', { waitAfter: 600 });
    await resetZoom(page);

    await smoothScroll(page, 520, 1000);
    await smartHover(page, '.admin-glass-panel', { waitAfter: 1600 });
    await smoothScroll(page, 0, 800);

    // Bước 3.3: Tab Dự án CRM
    console.log('  -> Bước 3.3: Quản lý Dự án CRM...');
    await setCaption(
      page,
      'admin',
      'Quản lý Danh sách Dự án & Hợp đồng CRM',
      'Tìm kiếm thông minh, lọc trạng thái thanh toán & chỉnh sửa thông tin dự án tức thì'
    );
    const projectsTab = page.locator('button.admin-tab-btn').nth(1);
    await smartClick(page, projectsTab);
    await page.waitForSelector('.admin-toolbar-card', { state: 'visible', timeout: 8000 });
    await zoomTo(page, '.admin-toolbar-card', 1.25);
    await smartType(page, '.admin-search-input', 'ACTS', 60);
    await page.waitForTimeout(1200);

    // Xóa tìm kiếm
    const searchInput = page.locator('.admin-search-input');
    await searchInput.fill('');
    await page.waitForTimeout(800);
    await resetZoom(page);

    // Mở modal sửa hợp đồng
    const firstEditBtn = page.locator('button.admin-icon-btn.edit').first();
    await smartClick(page, firstEditBtn);
    await page.waitForSelector('.admin-modal-dialog', { state: 'visible', timeout: 8000 });
    await zoomTo(page, '.admin-modal-dialog', 1.15);
    await smartHover(page, '.admin-modal-grid', { waitAfter: 2000 });

    // Đóng modal
    const closeModalBtn = page.locator('button.admin-modal-close').first();
    await smartClick(page, closeModalBtn);
    await resetZoom(page);
    await page.waitForTimeout(600);

    // Bước 3.4: Tab Khách Hàng mới
    console.log('  -> Bước 3.4: Tab Khách Hàng mới...');
    await setCaption(
      page,
      'admin',
      'Tiếp nhận Yêu cầu Tư vấn & Khách Hàng Tiềm Năng',
      'Dữ liệu form đăng ký được lưu trữ bảo mật với bộ nút liên hệ nhanh: Gọi điện, Zalo, Email'
    );
    const submissionsTab = page.locator('button.admin-tab-btn').nth(2);
    await smartClick(page, submissionsTab);
    await page.waitForSelector('.admin-submission-card', { state: 'visible', timeout: 8000 });
    await zoomTo(page, '.admin-submission-card', 1.22);
    await smartHover(page, '.admin-contact-link.phone', { waitAfter: 700 });
    await smartHover(page, '.admin-contact-link.zalo', { waitAfter: 700 });
    await smartHover(page, '.admin-contact-link.email', { waitAfter: 700 });
    await resetZoom(page);

    // Bước 3.5: Tab Tiến độ dự án
    console.log('  -> Bước 3.5: Tab Tiến độ dự án...');
    await setCaption(
      page,
      'admin',
      'Trung tâm Điều hành Tiến độ Sản xuất (Live Tracking)',
      'Cấp mã PIN bí mật cho khách hàng, sao chép thông tin gửi khách & theo dõi tiến độ từng dự án'
    );
    const progressTab = page.locator('button.admin-tab-btn').nth(3);
    await smartClick(page, progressTab);
    await page.waitForSelector('button.admin-pin-toggle-btn', { state: 'visible', timeout: 8000 });
    await zoomTo(page, 'button.admin-pin-toggle-btn', 1.35);

    // Bật xem PIN
    await smartClick(page, 'button.admin-pin-toggle-btn');
    await page.waitForTimeout(1400);

    // Copy thông tin gửi khách
    await smartClick(page, 'button.admin-copy-creds-btn');
    await page.waitForTimeout(1400);
    await resetZoom(page);

    // Bước 3.6: Cập nhật tiến độ & Milestones
    console.log('  -> Bước 3.6: Cập nhật tiến độ & Milestones...');
    await setCaption(
      page,
      'admin',
      'Cập nhật % Tiến độ & Điều chỉnh Mốc công việc (Milestones)',
      'Kéo thanh trượt % trực quan, chọn mức nhanh (75%) và đánh dấu trạng thái công việc hoàn thành'
    );
    const progressEditBtn = page.locator('.admin-compact-table button.admin-icon-btn.edit').first();
    await smartClick(page, progressEditBtn);
    await page.waitForSelector('.admin-modal-dialog', { state: 'visible', timeout: 8000 });

    // Chọn mức nhanh 75%
    await zoomTo(page, '.admin-preset-pills-row', 1.25);
    const pill75 = page.locator('button.admin-preset-pill', { hasText: '75%' });
    await smartClick(page, pill75);
    await page.waitForTimeout(1200);
    await resetZoom(page);

    // Đánh dấu mốc công việc hoàn thành
    await zoomTo(page, '.admin-milestone-editor', 1.2);
    const completedSegBtn = page.locator('.admin-milestone-row:nth-child(2) button.admin-status-seg-btn.completed');
    if (await completedSegBtn.isVisible()) {
      await smartClick(page, completedSegBtn);
      await page.waitForTimeout(1000);
    }
    await resetZoom(page);

    // Lưu tiến độ
    const saveBtn = page.locator('.admin-modal-footer button[type="submit"]').first();
    await smartClick(page, saveBtn);
    await page.waitForTimeout(1600);

    // Bước 3.7: Đồng bộ dữ liệu Google Sheets
    console.log('  -> Bước 3.7: Đồng bộ Google Sheets...');
    await setCaption(
      page,
      'admin',
      'Đồng bộ Dữ liệu 2 chiều với Google Sheets',
      'Cập nhật trực tiếp lên bảng tính Google Sheets chỉ với 1 cú click chuột'
    );
    await smoothScroll(page, 0, 700);
    await zoomTo(page, 'button.admin-sync-btn', 1.45);
    await smartClick(page, 'button.admin-sync-btn');
    await page.waitForTimeout(2800);
    await resetZoom(page);
    await hideCaption(page);
    await page.waitForTimeout(600);

    // Outro
    console.log('\n--- MÀN HÌNH KẾT THÚC (OUTRO) ---');
    await showOutro(page);

    console.log('🏁 Hoàn tất kịch bản demo!');

    // Close page & context to finalize video writing
    await page.close();
    await context.close();
    await browser.close();

    // Find the recorded webm file
    const files = fs.readdirSync(TEMP_VIDEO_DIR).filter((f) => f.endsWith('.webm'));
    if (!files.length) {
      throw new Error('Không tìm thấy file video webm sau khi quay Playwright.');
    }
    const webmFile = path.join(TEMP_VIDEO_DIR, files[0]);
    console.log(`📹 File video gốc Playwright: ${webmFile} (${(fs.statSync(webmFile).size / (1024 * 1024)).toFixed(2)} MB)`);

    // FFmpeg convert to high-compatibility MP4 (H.264 / AAC)
    console.log(`🎬 Đang chuyển đổi sang định dạng MP4 Full HD tại: ${OUTPUT_MP4}...`);
    const ffmpegCmd = `ffmpeg -y -i "${webmFile}" -c:v libx264 -crf 18 -preset slow -pix_fmt yuv420p "${OUTPUT_MP4}"`;
    execSync(ffmpegCmd, { stdio: 'inherit' });

    const mp4Stat = fs.statSync(OUTPUT_MP4);
    console.log(`✅ Xuất video thành công: ${OUTPUT_MP4}`);
    console.log(`📦 Dung lượng video: ${(mp4Stat.size / (1024 * 1024)).toFixed(2)} MB`);

    // Extract snapshot frames to verify
    console.log('📸 Đang trích xuất snapshot frames để kiểm tra giao diện...');
    const snapshots = [
      { time: '00:00:15', name: 'frame_1_home.jpg' },
      { time: '00:00:45', name: 'frame_2_contact.jpg' },
      { time: '00:01:10', name: 'frame_3_client_progress.jpg' },
      { time: '00:01:40', name: 'frame_4_admin_dashboard.jpg' },
      { time: '00:02:00', name: 'frame_5_admin_progress.jpg' },
    ];

    for (const snap of snapshots) {
      const snapPath = path.join(SNAPSHOT_DIR, snap.name);
      execSync(`ffmpeg -y -ss ${snap.time} -i "${OUTPUT_MP4}" -vframes 1 -q:v 2 "${snapPath}"`, { stdio: 'ignore' });
      if (fs.existsSync(snapPath)) {
        console.log(`   ✓ Đã tạo snapshot: ${snap.name}`);
      }
    }

    console.log('\n🎉 TOÀN BỘ QUÁ TRÌNH QUAY & XUẤT VIDEO DEMO ĐÃ HOÀN THÀNH XUẤT SẮC!');

  } catch (err) {
    console.error('❌ Lỗi trong quá trình quay video demo:', err);
    process.exitCode = 1;
  } finally {
    if (serverProcess) {
      console.log('🛑 Đang đóng server process...');
      serverProcess.kill('SIGTERM');
    }
  }
}

run();
