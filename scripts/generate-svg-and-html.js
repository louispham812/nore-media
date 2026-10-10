import fs from 'node:fs';

function generateSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1320 890" width="100%" height="100%" style="background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <defs>
    <!-- Drop Shadows -->
    <filter id="cardShadow" x="-5%" y="-5%" width="115%" height="115%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.06"/>
    </filter>
    <filter id="softShadow" x="-5%" y="-5%" width="115%" height="115%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#0f172a" flood-opacity="0.04"/>
    </filter>
    
    <!-- Gradients -->
    <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#334155"/>
    </linearGradient>
    <linearGradient id="appsGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#f8fafc"/>
    </linearGradient>
    <linearGradient id="dataGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fffbeb"/>
      <stop offset="100%" stop-color="#fef3c7"/>
    </linearGradient>
    
    <!-- Marker Arrows -->
    <marker id="arrowBlue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#2563eb"/>
    </marker>
    <marker id="arrowGreen" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#16a34a"/>
    </marker>
    <marker id="arrowPurple" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#7c3aed"/>
    </marker>
    <marker id="arrowCyan" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#0284c7"/>
    </marker>
    <marker id="arrowRed" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#dc2626"/>
    </marker>
    <marker id="arrowGray" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#64748b"/>
    </marker>
  </defs>

  <!-- ================= HEADER ================= -->
  <g transform="translate(40, 25)">
    <text x="620" y="28" text-anchor="middle" font-size="28" font-weight="800" fill="#0f172a" letter-spacing="0.5">CORE TECH STACK</text>
    <text x="620" y="52" text-anchor="middle" font-size="14" font-weight="600" fill="#64748b">NORE MEDIA - CREATIVE HOUSE &amp; PRODUCTION MANAGEMENT PLATFORM</text>
  </g>

  <!-- ================= 1. CLIENTS COLUMN ================= -->
  <g transform="translate(40, 95)">
    <!-- Column Title -->
    <text x="105" y="24" text-anchor="middle" font-size="20" font-weight="700" fill="#1e293b">Clients</text>

    <!-- Client 1: Web Client (React 18) -->
    <g transform="translate(0, 45)" filter="url(#cardShadow)">
      <rect width="210" height="70" rx="12" fill="#ffffff" stroke="#bfdbfe" stroke-width="1.5"/>
      <!-- User Icon -->
      <circle cx="36" cy="28" r="10" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>
      <path d="M22 52 C22 42, 50 42, 50 52" fill="none" stroke="#2563eb" stroke-width="2"/>
      <!-- Text -->
      <text x="68" y="28" font-size="14" font-weight="700" fill="#0f172a">Web Client</text>
      <text x="68" y="46" font-size="12" font-weight="600" fill="#2563eb">React 18 + Vite</text>
      <text x="68" y="59" font-size="10" fill="#64748b">Desktop Safari / Chrome</text>
    </g>

    <!-- Client 2: Mobile Client (PWA) -->
    <g transform="translate(0, 135)" filter="url(#cardShadow)">
      <rect width="210" height="70" rx="12" fill="#ffffff" stroke="#bbf7d0" stroke-width="1.5"/>
      <!-- User Icon -->
      <circle cx="36" cy="28" r="10" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
      <path d="M22 52 C22 42, 50 42, 50 52" fill="none" stroke="#16a34a" stroke-width="2"/>
      <!-- Text -->
      <text x="68" y="28" font-size="14" font-weight="700" fill="#0f172a">Mobile Client</text>
      <text x="68" y="46" font-size="12" font-weight="600" fill="#16a34a">Responsive PWA</text>
      <text x="68" y="59" font-size="10" fill="#64748b">iOS / Android Mobile Web</text>
    </g>

    <!-- Client 3: Admin & Staff -->
    <g transform="translate(0, 225)" filter="url(#cardShadow)">
      <rect width="210" height="70" rx="12" fill="#ffffff" stroke="#ddd6fe" stroke-width="1.5"/>
      <!-- User Icon -->
      <circle cx="36" cy="28" r="10" fill="#ede9fe" stroke="#7c3aed" stroke-width="2"/>
      <path d="M22 52 C22 42, 50 42, 50 52" fill="none" stroke="#7c3aed" stroke-width="2"/>
      <!-- Text -->
      <text x="68" y="28" font-size="14" font-weight="700" fill="#0f172a">Internal Team</text>
      <text x="68" y="46" font-size="12" font-weight="600" fill="#7c3aed">Admin Operations</text>
      <text x="68" y="59" font-size="10" fill="#64748b">Google Sheets &amp; Email</text>
    </g>
  </g>

  <!-- Connectors: Clients -> Apps -->
  <path d="M 250 175 L 295 175" fill="none" stroke="#2563eb" stroke-width="2" marker-end="url(#arrowBlue)"/>
  <path d="M 250 265 L 275 265 L 275 200 L 295 200" fill="none" stroke="#16a34a" stroke-width="2" marker-end="url(#arrowGreen)"/>
  <path d="M 250 355 L 285 355 L 285 220 L 295 220" fill="none" stroke="#7c3aed" stroke-width="2" marker-end="url(#arrowPurple)"/>

  <!-- ================= 2. APPS COLUMN ================= -->
  <g transform="translate(300, 95)" filter="url(#cardShadow)">
    <!-- Container Outline -->
    <rect width="570" height="340" rx="16" fill="url(#appsGrad)" stroke="#cbd5e1" stroke-width="2"/>
    <rect width="570" height="42" rx="16" fill="#f1f5f9"/>
    <path d="M 0 42 L 570 42" stroke="#e2e8f0" stroke-width="1.5"/>
    <text x="24" y="28" font-size="18" font-weight="700" fill="#1e293b">Apps (Application Layer)</text>

    <!-- Sub-Box 1: API Gateway -->
    <g transform="translate(20, 60)" filter="url(#softShadow)">
      <rect width="170" height="150" rx="10" fill="#fffbeb" stroke="#f59e0b" stroke-width="1.5"/>
      <text x="85" y="26" text-anchor="middle" font-size="14" font-weight="700" fill="#92400e">API Gateway &amp; CDN</text>
      <text x="85" y="44" text-anchor="middle" font-size="12" font-weight="600" fill="#d97706">Vercel Edge / Proxy</text>
      <line x1="16" y1="54" x2="154" y2="54" stroke="#fde68a" stroke-width="1"/>
      <text x="16" y="74" font-size="11" fill="#475569">• Reverse Proxy Gateway</text>
      <text x="16" y="94" font-size="11" fill="#475569">• SSL / TLS 1.3 Termination</text>
      <text x="16" y="114" font-size="11" fill="#475569">• Edge Static Asset Cache</text>
      <text x="16" y="134" font-size="11" fill="#475569">• Path Rewriting: /api/*</text>
    </g>

    <!-- Sub-Box 2: Backend Core Services -->
    <g transform="translate(225, 60)" filter="url(#softShadow)">
      <rect width="180" height="150" rx="10" fill="#f0f9ff" stroke="#0284c7" stroke-width="2"/>
      <text x="90" y="26" text-anchor="middle" font-size="14" font-weight="700" fill="#0369a1">Backend Services</text>
      <text x="90" y="44" text-anchor="middle" font-size="12" font-weight="600" fill="#0284c7">Node.js + Express.js</text>
      <line x1="16" y1="54" x2="164" y2="54" stroke="#bae6fd" stroke-width="1"/>
      <text x="16" y="72" font-size="11" font-weight="600" fill="#0f172a">• /api/contact Controller</text>
      <text x="16" y="90" font-size="11" fill="#334155">• Honeypot Anti-Spam Trap</text>
      <text x="16" y="108" font-size="11" fill="#334155">• IP Rate Limit (5 req/15m)</text>
      <text x="16" y="126" font-size="11" fill="#334155">• Idempotency Engine</text>
      <text x="16" y="142" font-size="11" fill="#334155">• Exponential Backoff Retry</text>
    </g>

    <!-- Arrow between Gateway & Backend -->
    <path d="M 190 135 L 220 135" fill="none" stroke="#0284c7" stroke-width="2.5" marker-end="url(#arrowCyan)"/>

    <!-- Runtime & Deployment Banner below -->
    <g transform="translate(20, 230)">
      <rect width="385" height="42" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
      <text x="192" y="20" text-anchor="middle" font-size="11" font-weight="700" fill="#334155">Runtime &amp; Deployment Environment:</text>
      <text x="192" y="34" text-anchor="middle" font-size="11" fill="#64748b">
        <tspan font-weight="600" fill="#0284c7">Node.js 20+ LTS</tspan> | 
        <tspan font-weight="600" fill="#0f172a">Vercel Serverless</tspan> | 
        <tspan font-weight="600" fill="#2563eb">Docker Ready</tspan>
      </text>
    </g>

    <!-- Tech Specifications Box (Right Column inside Apps) -->
    <g transform="translate(425, 50)" filter="url(#softShadow)">
      <rect width="130" height="275" rx="8" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>
      <text x="65" y="24" text-anchor="middle" font-size="11" font-weight="800" fill="#0f172a" letter-spacing="0.5">TECH SPECS</text>
      <line x1="12" y1="32" x2="118" y2="32" stroke="#e2e8f0" stroke-width="1"/>
      
      <text x="12" y="50" font-size="10" font-weight="700" fill="#475569">Language:</text>
      <text x="12" y="62" font-size="10" font-weight="600" fill="#0f172a">JavaScript (ES6+)</text>
      
      <text x="12" y="80" font-size="10" font-weight="700" fill="#475569">Frontend:</text>
      <text x="12" y="92" font-size="10" font-weight="600" fill="#2563eb">React 18, Vite 6</text>
      
      <text x="12" y="110" font-size="10" font-weight="700" fill="#475569">Backend:</text>
      <text x="12" y="122" font-size="10" font-weight="600" fill="#0284c7">Express 4.21</text>
      
      <text x="12" y="140" font-size="10" font-weight="700" fill="#475569">API Type:</text>
      <text x="12" y="152" font-size="10" font-weight="600" fill="#0f172a">RESTful JSON</text>
      
      <text x="12" y="170" font-size="10" font-weight="700" fill="#475569">Motion UI:</text>
      <text x="12" y="182" font-size="10" font-weight="600" fill="#ec4899">Framer Motion</text>
      
      <text x="12" y="200" font-size="10" font-weight="700" fill="#475569">Media Engine:</text>
      <text x="12" y="212" font-size="10" font-weight="600" fill="#d97706">Plyr.js HTML5</text>
      
      <text x="12" y="230" font-size="10" font-weight="700" fill="#475569">Localization:</text>
      <text x="12" y="242" font-size="10" font-weight="600" fill="#0891b2">i18next (VI/EN)</text>
      
      <text x="12" y="258" font-size="9" fill="#64748b">Secrets: Dotenv (.env)</text>
    </g>
  </g>

  <!-- Connectors: Apps -> Data -->
  <path d="M 870 175 L 905 175" fill="none" stroke="#dc2626" stroke-width="2" marker-end="url(#arrowRed)"/>
  <path d="M 870 235 L 905 235" fill="none" stroke="#16a34a" stroke-width="2" marker-end="url(#arrowGreen)"/>
  <path d="M 870 315 L 905 315" fill="none" stroke="#7c3aed" stroke-width="2" marker-end="url(#arrowPurple)"/>

  <!-- ================= 3. DATA COLUMN ================= -->
  <g transform="translate(915, 95)" filter="url(#cardShadow)">
    <!-- Database Cylinder Container -->
    <path d="M 0 25 C 0 10, 360 10, 360 25 L 360 325 C 360 340, 0 340, 0 325 Z" fill="url(#dataGrad)" stroke="#d97706" stroke-width="2"/>
    <ellipse cx="180" cy="25" rx="180" ry="20" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
    <text x="180" y="32" text-anchor="middle" font-size="18" font-weight="800" fill="#92400e">Data Layer</text>

    <!-- Layer 1: Caching Layer -->
    <g transform="translate(20, 60)" filter="url(#softShadow)">
      <rect width="320" height="70" rx="8" fill="#ffffff" stroke="#f87171" stroke-width="1.5"/>
      <text x="16" y="24" font-size="13" font-weight="700" fill="#0f172a">Caching &amp; In-Memory Layer</text>
      <text x="16" y="42" font-size="12" font-weight="700" fill="#dc2626">In-Memory Map / Redis Ready</text>
      <text x="16" y="58" font-size="10" fill="#475569">• Idempotency Lock (24h TTL) | IP Window Counter</text>
    </g>

    <!-- Layer 2: Metadata / CRM DB -->
    <g transform="translate(20, 145)" filter="url(#softShadow)">
      <rect width="320" height="78" rx="8" fill="#ffffff" stroke="#4ade80" stroke-width="1.5"/>
      <text x="16" y="24" font-size="13" font-weight="700" fill="#0f172a">Metadata &amp; CRM Database</text>
      <text x="16" y="42" font-size="12" font-weight="700" fill="#16a34a">Google Sheets API v4 (Cloud DB)</text>
      <text x="16" y="58" font-size="10" fill="#475569">• Service Account IAM | Tab: KhachHang (Leads CRM)</text>
      <text x="16" y="70" font-size="10" font-style="italic" fill="#059669">→ Scale Roadmap: PostgreSQL / Supabase</text>
    </g>

    <!-- Layer 3: Media Storage -->
    <g transform="translate(20, 235)" filter="url(#softShadow)">
      <rect width="320" height="75" rx="8" fill="#ffffff" stroke="#c084fc" stroke-width="1.5"/>
      <text x="16" y="24" font-size="13" font-weight="700" fill="#0f172a">Media Storage &amp; Asset CDN</text>
      <text x="16" y="42" font-size="12" font-weight="700" fill="#7c3aed">Public Asset CDN &amp; High-Res Media</text>
      <text x="16" y="58" font-size="10" fill="#475569">• 4K Showreels, Gallery Photos, Fast Local Cache</text>
      <text x="16" y="69" font-size="10" fill="#475569">• Cloudflare R2 / AWS S3 Integration Ready</text>
    </g>
  </g>

  <!-- ================= 4. 3RD PARTY APPS SECTION ================= -->
  <g transform="translate(40, 465)" filter="url(#cardShadow)">
    <rect width="1240" height="395" rx="16" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
    <rect width="1240" height="42" rx="16" fill="#f1f5f9"/>
    <path d="M 0 42 L 1240 42" stroke="#e2e8f0" stroke-width="1.5"/>
    <text x="24" y="28" font-size="18" font-weight="700" fill="#1e293b">3rd Party Apps &amp; External Integrations</text>

    <!-- Row 1: 4 Cards -->
    <!-- Card 1: Email -->
    <g transform="translate(20, 58)" filter="url(#softShadow)">
      <rect width="285" height="150" rx="10" fill="#ffffff" stroke="#0284c7" stroke-width="1.5"/>
      <rect width="36" height="36" rx="8" x="16" y="16" fill="#e0f2fe"/>
      <text x="34" y="40" text-anchor="middle" font-size="20">✉️</text>
      <text x="62" y="32" font-size="14" font-weight="700" fill="#0f172a">Email Service</text>
      <text x="62" y="48" font-size="12" font-weight="600" fill="#0284c7">Nodemailer &amp; SMTP</text>
      <text x="16" y="74" font-size="11" fill="#475569">Tích hợp Google Workspace / Zoho SMTP</text>
      <text x="16" y="92" font-size="11" fill="#64748b">• Gửi thông báo tức thì đến admin</text>
      <text x="16" y="110" font-size="11" fill="#64748b">• Tự động gửi email xác nhận cho khách</text>
      <text x="16" y="128" font-size="11" fill="#64748b">• Chống gửi trùng email qua Message-ID</text>
    </g>

    <!-- Card 2: Google Sheets API -->
    <g transform="translate(325, 58)" filter="url(#softShadow)">
      <rect width="285" height="150" rx="10" fill="#ffffff" stroke="#16a34a" stroke-width="1.5"/>
      <rect width="36" height="36" rx="8" x="16" y="16" fill="#dcfce7"/>
      <text x="34" y="40" text-anchor="middle" font-size="20">📊</text>
      <text x="62" y="32" font-size="14" font-weight="700" fill="#0f172a">Spreadsheet &amp; CRM</text>
      <text x="62" y="48" font-size="12" font-weight="600" fill="#16a34a">Google Sheets API v4</text>
      <text x="16" y="74" font-size="11" fill="#475569">Xác thực Google Cloud Service Account</text>
      <text x="16" y="92" font-size="11" fill="#64748b">• Lưu trữ lead khách hàng theo thời gian thực</text>
      <text x="16" y="110" font-size="11" fill="#64748b">• Tránh trùng lắp bằng Submission ID</text>
      <text x="16" y="128" font-size="11" fill="#64748b">• Bộ phận Sale/CSKH quản lý ngay trên Sheet</text>
    </g>

    <!-- Card 3: Media Player Plyr -->
    <g transform="translate(630, 58)" filter="url(#softShadow)">
      <rect width="285" height="150" rx="10" fill="#ffffff" stroke="#d97706" stroke-width="1.5"/>
      <rect width="36" height="36" rx="8" x="16" y="16" fill="#fef3c7"/>
      <text x="34" y="40" text-anchor="middle" font-size="20">🎬</text>
      <text x="62" y="32" font-size="14" font-weight="700" fill="#0f172a">Media &amp; Video Engine</text>
      <text x="62" y="48" font-size="12" font-weight="600" fill="#d97706">Plyr.js / HTML5 Video</text>
      <text x="16" y="74" font-size="11" fill="#475569">Trình phát video hiện đại, responsive</text>
      <text x="16" y="92" font-size="11" fill="#64748b">• Tối ưu hiển thị showreel phim quảng cáo</text>
      <text x="16" y="110" font-size="11" fill="#64748b">• Hỗ trợ video MP4 cục bộ và YouTube/Vimeo</text>
      <text x="16" y="128" font-size="11" fill="#64748b">• Tự động điều chỉnh bitrate theo thiết bị</text>
    </g>

    <!-- Card 4: Edge CDN & Hosting -->
    <g transform="translate(935, 58)" filter="url(#softShadow)">
      <rect width="285" height="150" rx="10" fill="#ffffff" stroke="#475569" stroke-width="1.5"/>
      <rect width="36" height="36" rx="8" x="16" y="16" fill="#f1f5f9"/>
      <text x="34" y="40" text-anchor="middle" font-size="20">⚡</text>
      <text x="62" y="32" font-size="14" font-weight="700" fill="#0f172a">Edge Network &amp; Host</text>
      <text x="62" y="48" font-size="12" font-weight="600" fill="#0f172a">Vercel &amp; Cloudflare Edge</text>
      <text x="16" y="74" font-size="11" fill="#475569">Mạng phân phối biên toàn cầu</text>
      <text x="16" y="92" font-size="11" fill="#64748b">• Tự động quản lý SSL/TLS và DNS</text>
      <text x="16" y="110" font-size="11" fill="#64748b">• Nén tài nguyên tĩnh Brotli/Gzip siêu tốc</text>
      <text x="16" y="128" font-size="11" fill="#64748b">• Khả năng chống tấn công DDoS tự động</text>
    </g>

    <!-- Row 2: 4 Cards -->
    <!-- Card 5: Direct Chat Support -->
    <g transform="translate(20, 226)" filter="url(#softShadow)">
      <rect width="285" height="150" rx="10" fill="#ffffff" stroke="#2563eb" stroke-width="1.5"/>
      <rect width="36" height="36" rx="8" x="16" y="16" fill="#dbeafe"/>
      <text x="34" y="40" text-anchor="middle" font-size="20">💬</text>
      <text x="62" y="32" font-size="14" font-weight="700" fill="#0f172a">Support &amp; Direct Chat</text>
      <text x="62" y="48" font-size="12" font-weight="600" fill="#2563eb">Zalo OA &amp; Messenger</text>
      <text x="16" y="74" font-size="11" fill="#475569">Kênh tư vấn 1:1 trực tiếp với Agency</text>
      <text x="16" y="92" font-size="11" fill="#64748b">• Nút gọi hotline và chat Zalo/Fanpage</text>
      <text x="16" y="110" font-size="11" fill="#64748b">• Phản hồi nhanh yêu cầu báo giá dự án</text>
      <text x="16" y="128" font-size="11" fill="#64748b">• Tăng tỷ lệ chuyển đổi khách hàng tiềm năng</text>
    </g>

    <!-- Card 6: Bot Protection & Security -->
    <g transform="translate(325, 226)" filter="url(#softShadow)">
      <rect width="285" height="150" rx="10" fill="#ffffff" stroke="#dc2626" stroke-width="1.5"/>
      <rect width="36" height="36" rx="8" x="16" y="16" fill="#fee2e2"/>
      <text x="34" y="40" text-anchor="middle" font-size="20">🛡️</text>
      <text x="62" y="32" font-size="14" font-weight="700" fill="#0f172a">Security Protection</text>
      <text x="62" y="48" font-size="12" font-weight="600" fill="#dc2626">Honeypot &amp; Rate Limit</text>
      <text x="16" y="74" font-size="11" fill="#475569">Bảo vệ hạ tầng trước bot spam</text>
      <text x="16" y="92" font-size="11" fill="#64748b">• Bẫy Honeypot ẩn lọc bot tự động</text>
      <text x="16" y="110" font-size="11" fill="#64748b">• Giới hạn 5 request/15 phút cho mỗi IP</text>
      <text x="16" y="128" font-size="11" fill="#64748b">• Giới hạn kích thước payload (20kb)</text>
    </g>

    <!-- Card 7: Localization Multi-Language -->
    <g transform="translate(630, 226)" filter="url(#softShadow)">
      <rect width="285" height="150" rx="10" fill="#ffffff" stroke="#0891b2" stroke-width="1.5"/>
      <rect width="36" height="36" rx="8" x="16" y="16" fill="#cffafe"/>
      <text x="34" y="40" text-anchor="middle" font-size="20">🌐</text>
      <text x="62" y="32" font-size="14" font-weight="700" fill="#0f172a">Localization Engine</text>
      <text x="62" y="48" font-size="12" font-weight="600" fill="#0891b2">i18next &amp; Detector</text>
      <text x="16" y="74" font-size="11" fill="#475569">Đa ngôn ngữ Tiếng Việt &amp; Tiếng Anh</text>
      <text x="16" y="92" font-size="11" fill="#64748b">• Tự động nhận diện ngôn ngữ trình duyệt</text>
      <text x="16" y="110" font-size="11" fill="#64748b">• Hỗ trợ khách hàng quốc tế xem portfolio</text>
      <text x="16" y="128" font-size="11" fill="#64748b">• Dễ dàng mở rộng thêm ngôn ngữ mới</text>
    </g>

    <!-- Card 8: Online Payment Gateway -->
    <g transform="translate(935, 226)" filter="url(#softShadow)">
      <rect width="285" height="150" rx="10" fill="#ffffff" stroke="#7c3aed" stroke-width="1.5"/>
      <rect width="36" height="36" rx="8" x="16" y="16" fill="#ede9fe"/>
      <text x="34" y="40" text-anchor="middle" font-size="20">💳</text>
      <text x="62" y="32" font-size="14" font-weight="700" fill="#0f172a">Payment Gateway</text>
      <text x="62" y="48" font-size="12" font-weight="600" fill="#7c3aed">PayOS / VNPay / MoMo</text>
      <text x="16" y="74" font-size="11" fill="#475569">Thanh toán đặt cọc trực tuyến (Phase 2)</text>
      <text x="16" y="92" font-size="11" fill="#64748b">• Quét mã VietQR thanh toán tức thì</text>
      <text x="16" y="110" font-size="11" fill="#64748b">• Tự động kích hoạt hợp đồng booking</text>
      <text x="16" y="128" font-size="11" fill="#64748b">• Đối soát dòng tiền dịch vụ sản xuất</text>
    </g>
  </g>

  <!-- Dashed connector from Apps to 3rd Party Apps -->
  <path d="M 585 435 L 585 465" fill="none" stroke="#64748b" stroke-width="2" stroke-dasharray="4,4" marker-end="url(#arrowGray)"/>
</svg>`;
}

function generateHtmlPreview(svgContent) {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NORE MEDIA - Core Tech Stack Architecture</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: #0f172a;
      color: #f8fafc;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    header {
      background: #1e293b;
      padding: 16px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #334155;
    }
    .title-group h1 {
      font-size: 20px;
      font-weight: 700;
      color: #38bdf8;
    }
    .title-group p {
      font-size: 13px;
      color: #94a3b8;
    }
    .actions {
      display: flex;
      gap: 12px;
    }
    .btn {
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border: none;
      transition: all 0.2s;
    }
    .btn-primary {
      background: #38bdf8;
      color: #0f172a;
    }
    .btn-primary:hover {
      background: #7dd3fc;
    }
    .btn-secondary {
      background: #334155;
      color: #f8fafc;
    }
    .btn-secondary:hover {
      background: #475569;
    }
    main {
      flex: 1;
      padding: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: auto;
    }
    .canvas-container {
      background: #ffffff;
      border-radius: 16px;
      padding: 16px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5);
      max-width: 1360px;
      width: 100%;
    }
  </style>
</head>
<body>
  <header>
    <div class="title-group">
      <h1>NORE MEDIA — Sơ đồ Kiến trúc Công nghệ (Core Tech Stack)</h1>
      <p>Báo cáo Outcome 1 (EXE201) — Chuẩn cấu trúc Slide 3.1.1 (Clients, Apps, Data, 3rd Party Apps)</p>
    </div>
    <div class="actions">
      <a href="./architecture-core-tech-stack.drawio" download="architecture-core-tech-stack.drawio" class="btn btn-primary">
        📥 Tải file .drawio
      </a>
      <a href="./architecture-core-tech-stack.svg" download="architecture-core-tech-stack.svg" class="btn btn-secondary">
        🖼️ Tải file .svg (Chèn Slide)
      </a>
    </div>
  </header>
  <main>
    <div class="canvas-container">
      ${svgContent}
    </div>
  </main>
</body>
</html>`;
}

const svg = generateSvg();
fs.writeFileSync('architecture-core-tech-stack.svg', svg, 'utf8');
console.log('Successfully generated architecture-core-tech-stack.svg');

const html = generateHtmlPreview(svg);
fs.writeFileSync('architecture-core-tech-stack.html', html, 'utf8');
console.log('Successfully generated architecture-core-tech-stack.html');
