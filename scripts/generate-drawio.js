import fs from 'node:fs';
import path from 'node:path';

function escapeXml(unsafe) {
  if (typeof unsafe !== 'string') return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function generateDrawioXml() {
  const cells = [];
  let nextId = 2;
  const getId = () => String(nextId++);

  function addCell({ id, parent = '1', value = '', style = '', vertex = 1, edge = 0, source, target, x, y, width, height, relative = 0 }) {
    const cellId = id || getId();
    let geom = '';
    if (vertex) {
      geom = `<mxGeometry x="${x}" y="${y}" width="${width}" height="${height}" as="geometry" />`;
    } else if (edge) {
      geom = `<mxGeometry relative="${relative}" as="geometry" />`;
    }
    const sourceAttr = source ? ` source="${source}"` : '';
    const targetAttr = target ? ` target="${target}"` : '';
    const cellXml = `        <mxCell id="${cellId}" value="${escapeXml(value)}" style="${style}" vertex="${vertex}" edge="${edge}"${sourceAttr}${targetAttr} parent="${parent}">
          ${geom}
        </mxCell>`;
    cells.push(cellXml);
    return cellId;
  }

  // --- Title & Header ---
  addCell({
    value: `<div style="font-family: Arial, sans-serif; text-align: center;">
      <span style="font-size: 26px; font-weight: 800; color: #0f172a; letter-spacing: 0.5px;">CORE TECH STACK</span><br/>
      <span style="font-size: 14px; font-weight: 600; color: #475569;">NORE MEDIA - CREATIVE HOUSE &amp; PRODUCTION PLATFORM</span>
    </div>`,
    style: 'text;html=1;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fillColor=none;strokeColor=none;',
    x: 400, y: 20, width: 550, height: 50
  });

  // ==========================================
  // 1. CLIENTS COLUMN (Left)
  // ==========================================
  const colClientsHeader = addCell({
    value: '<b style="font-size: 18px; color: #1e293b;">Clients</b>',
    style: 'text;html=1;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fillColor=none;strokeColor=none;',
    x: 40, y: 80, width: 200, height: 35
  });

  // Client 1: Web Client
  const clientWebActor = addCell({
    value: '',
    style: 'shape=umlActor;verticalLabelPosition=bottom;verticalAlign=top;html=1;outlineConnect=0;fillColor=#dbeafe;strokeColor=#2563eb;strokeWidth=2;',
    x: 55, y: 130, width: 36, height: 60
  });
  const clientWebBox = addCell({
    value: `<b>Web Client</b><br/><font color="#2563eb"><b>React 18 + Vite</b></font><br/><font color="#64748b" style="font-size: 11px;">Desktop Safari / Chrome</font>`,
    style: 'rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#93c5fd;strokeWidth=1.5;shadow=1;align=center;verticalAlign=middle;arcSize=12;',
    x: 105, y: 130, width: 140, height: 60
  });

  // Client 2: Mobile Client
  const clientMobileActor = addCell({
    value: '',
    style: 'shape=umlActor;verticalLabelPosition=bottom;verticalAlign=top;html=1;outlineConnect=0;fillColor=#dcfce7;strokeColor=#16a34a;strokeWidth=2;',
    x: 55, y: 225, width: 36, height: 60
  });
  const clientMobileBox = addCell({
    value: `<b>Mobile Client</b><br/><font color="#16a34a"><b>Responsive PWA</b></font><br/><font color="#64748b" style="font-size: 11px;">iOS / Android Browser</font>`,
    style: 'rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#86efac;strokeWidth=1.5;shadow=1;align=center;verticalAlign=middle;arcSize=12;',
    x: 105, y: 225, width: 140, height: 60
  });

  // Client 3: Admin / Staff
  const clientAdminActor = addCell({
    value: '',
    style: 'shape=umlActor;verticalLabelPosition=bottom;verticalAlign=top;html=1;outlineConnect=0;fillColor=#ede9fe;strokeColor=#7c3aed;strokeWidth=2;',
    x: 55, y: 320, width: 36, height: 60
  });
  const clientAdminBox = addCell({
    value: `<b>Internal Team</b><br/><font color="#7c3aed"><b>Admin &amp; Operations</b></font><br/><font color="#64748b" style="font-size: 11px;">Google Sheets CRM &amp; Mail</font>`,
    style: 'rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#c4b5fd;strokeWidth=1.5;shadow=1;align=center;verticalAlign=middle;arcSize=12;',
    x: 105, y: 320, width: 140, height: 60
  });

  // ==========================================
  // 2. APPS COLUMN (Middle)
  // ==========================================
  const appsContainer = addCell({
    value: `<div style="text-align: left; padding-left: 8px;"><b style="font-size: 18px; color: #1e293b;">Apps</b></div>`,
    style: 'swimlane;startSize=34;rounded=1;arcSize=6;fillColor=#f8fafc;strokeColor=#94a3b8;strokeWidth=2;shadow=1;collapsible=0;horizontal=1;fontStyle=1;',
    x: 290, y: 80, width: 560, height: 350
  });

  // API Gateway Box
  const apiGatewayBox = addCell({
    parent: appsContainer,
    value: `<b>API Gateway &amp; CDN</b><br/><font color="#d97706"><b>Vercel Edge / Reverse Proxy</b></font><br/><div style="text-align: left; font-size: 11px; color: #475569; margin-top: 4px; line-height: 1.4;">• SSL / TLS 1.3 Termination<br/>• Static Asset CDN Caching<br/>• Path Routing: <i>/api/*</i></div>`,
    style: 'rounded=1;whiteSpace=wrap;html=1;fillColor=#fffbeb;strokeColor=#f59e0b;strokeWidth=1.5;shadow=1;align=center;verticalAlign=middle;arcSize=10;',
    x: 20, y: 55, width: 165, height: 110
  });

  // Microservices / Backend Core Box
  const backendBox = addCell({
    parent: appsContainer,
    value: `<b>Backend Services</b><br/><font color="#0284c7"><b>Node.js &amp; Express.js API</b></font><br/><div style="text-align: left; font-size: 11px; color: #334155; margin-top: 4px; line-height: 1.4;">• <b>/api/contact</b> Controller<br/>• Honeypot Anti-Spam Trap<br/>• IP Rate Limiter (5 req/15m)<br/>• Idempotency Engine (24h TTL)<br/>• Exponential Backoff Retries</div>`,
    style: 'rounded=1;whiteSpace=wrap;html=1;fillColor=#f0f9ff;strokeColor=#0284c7;strokeWidth=2;shadow=1;align=center;verticalAlign=middle;arcSize=10;',
    x: 215, y: 55, width: 180, height: 140
  });

  // Infrastructure / Container Runtime Box
  const infraRuntimeBox = addCell({
    parent: appsContainer,
    value: `<div style="font-size: 11px; color: #334155; text-align: center;"><b>Runtime &amp; Deployment:</b><br/><font color="#0284c7">Node.js 20+ LTS</font> &nbsp;|&nbsp; <font color="#000000">Vercel Serverless</font> &nbsp;|&nbsp; <font color="#2563eb">Docker Ready</font></div>`,
    style: 'rounded=1;whiteSpace=wrap;html=1;fillColor=#f1f5f9;strokeColor=#cbd5e1;strokeWidth=1.5;align=center;verticalAlign=middle;arcSize=8;',
    x: 20, y: 220, width: 375, height: 45
  });

  // Tech Specs Box (Right side inside Apps - like reference slide)
  const techSpecsBox = addCell({
    parent: appsContainer,
    value: `<div style="text-align: left; padding: 4px; font-family: sans-serif;">
      <div style="text-align: center; font-weight: bold; font-size: 12px; color: #0f172a; margin-bottom: 6px; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px;">TECH SPECIFICATIONS</div>
      <table style="width: 100%; font-size: 11px; line-height: 1.5; color: #334155;">
        <tr><td><b>Language:</b></td><td>JS (ES6+ / Node)</td></tr>
        <tr><td><b>Frontend:</b></td><td>React 18, Vite 6</td></tr>
        <tr><td><b>Backend:</b></td><td>Express 4.21</td></tr>
        <tr><td><b>API:</b></td><td>RESTful JSON</td></tr>
        <tr><td><b>Animation:</b></td><td>Framer Motion</td></tr>
        <tr><td><b>Video:</b></td><td>Plyr.js HTML5</td></tr>
        <tr><td><b>i18n:</b></td><td>i18next (VI/EN)</td></tr>
        <tr><td><b>Security:</b></td><td>RateLimit, Honeypot</td></tr>
        <tr><td><b>Secrets:</b></td><td>Dotenv (.env)</td></tr>
        <tr><td><b>CI/CD:</b></td><td>GitHub Actions, Vercel</td></tr>
      </table>
    </div>`,
    style: 'rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#94a3b8;strokeWidth=1.5;shadow=1;align=center;verticalAlign=top;arcSize=8;',
    x: 410, y: 50, width: 135, height: 275
  });

  // ==========================================
  // 3. DATA COLUMN (Right)
  // ==========================================
  const dataContainer = addCell({
    value: `<b style="font-size: 18px; color: #92400e;">Data</b>`,
    style: 'shape=cylinder3;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;size=20;fillColor=#fffbeb;strokeColor=#d97706;strokeWidth=2;shadow=1;verticalAlign=top;spacingTop=24;',
    x: 890, y: 80, width: 390, height: 350
  });

  // Caching layer inside Data
  const cacheLayerBox = addCell({
    value: `<b>Caching &amp; In-Memory Layer</b><br/><font color="#dc2626"><b>In-Memory Key-Value / Redis Ready</b></font><br/><font color="#475569" style="font-size: 11px;">• Idempotency Submission Map (24h TTL)<br/>• In-flight Request Deduplication Lock<br/>• IP Window Rate Limit Counter</font>`,
    style: 'rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#f87171;strokeWidth=1.5;shadow=1;align=center;verticalAlign=middle;arcSize=10;',
    x: 915, y: 135, width: 340, height: 75
  });

  // Metadata / CRM DB inside Data
  const metadataLayerBox = addCell({
    value: `<b>Metadata &amp; CRM Database</b><br/><font color="#16a34a"><b>Google Sheets API v4 (Cloud DB)</b></font><br/><font color="#475569" style="font-size: 11px;">• Google Cloud Service Account IAM Key<br/>• Tab "KhachHang": Time, Lead, Phone, Note, ID<br/>• <i>Scale Roadmap: PostgreSQL / Supabase</i></font>`,
    style: 'rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#4ade80;strokeWidth=1.5;shadow=1;align=center;verticalAlign=middle;arcSize=10;',
    x: 915, y: 225, width: 340, height: 85
  });

  // Media layer inside Data
  const mediaLayerBox = addCell({
    value: `<b>Media Storage &amp; CDN Layer</b><br/><font color="#7c3aed"><b>Public CDN &amp; High-Speed Assets</b></font><br/><font color="#475569" style="font-size: 11px;">• Local Video Cache &amp; Optimized Thumbnails<br/>• 4K Video Showreels &amp; Commercial Photography<br/>• Cloudflare R2 / AWS S3 Integration Ready</font>`,
    style: 'rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#c084fc;strokeWidth=1.5;shadow=1;align=center;verticalAlign=middle;arcSize=10;',
    x: 915, y: 325, width: 340, height: 85
  });

  // ==========================================
  // ARROWS / CONNECTORS (Upper Section)
  // ==========================================
  // Clients -> API Gateway
  addCell({
    edge: 1,
    source: clientWebBox,
    target: apiGatewayBox,
    style: 'edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#2563eb;strokeWidth=2;endArrow=classic;endFill=1;'
  });
  addCell({
    edge: 1,
    source: clientMobileBox,
    target: apiGatewayBox,
    style: 'edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#16a34a;strokeWidth=2;endArrow=classic;endFill=1;'
  });
  addCell({
    edge: 1,
    source: clientAdminBox,
    target: apiGatewayBox,
    style: 'edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#7c3aed;strokeWidth=2;endArrow=classic;endFill=1;'
  });

  // API Gateway -> Backend Services
  addCell({
    edge: 1,
    source: apiGatewayBox,
    target: backendBox,
    style: 'edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#0284c7;strokeWidth=2.5;endArrow=classic;endFill=1;'
  });

  // Backend Services -> Data Layers
  addCell({
    edge: 1,
    source: backendBox,
    target: cacheLayerBox,
    style: 'edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#dc2626;strokeWidth=2;endArrow=classic;endFill=1;'
  });
  addCell({
    edge: 1,
    source: backendBox,
    target: metadataLayerBox,
    style: 'edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#16a34a;strokeWidth=2;endArrow=classic;endFill=1;'
  });
  addCell({
    edge: 1,
    source: backendBox,
    target: mediaLayerBox,
    style: 'edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#7c3aed;strokeWidth=2;endArrow=classic;endFill=1;'
  });

  // ==========================================
  // 4. 3RD PARTY APPS SECTION (Bottom Container)
  // ==========================================
  const thirdPartyContainer = addCell({
    value: `<div style="text-align: left; padding-left: 10px;"><b style="font-size: 18px; color: #1e293b;">3rd Party Apps &amp; External Services</b></div>`,
    style: 'swimlane;startSize=34;rounded=1;arcSize=6;fillColor=#f8fafc;strokeColor=#94a3b8;strokeWidth=2;shadow=1;collapsible=0;horizontal=1;fontStyle=1;',
    x: 40, y: 470, width: 1240, height: 350
  });

  // Row 1 of 3rd Party Apps (Y relative to container: 50)
  // Card 1: Email Service
  const cardEmail = addCell({
    parent: thirdPartyContainer,
    value: `<b>Email Service</b><br/><font color="#0284c7"><b>Nodemailer &amp; SMTP</b></font><br/><font color="#64748b" style="font-size: 11px;">Google Workspace / Zoho SMTP<br/>Tự động gửi thông báo admin &amp; email xác nhận khách hàng</font>`,
    style: 'rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#0284c7;strokeWidth=1.5;shadow=1;align=center;verticalAlign=middle;arcSize=10;',
    x: 20, y: 50, width: 280, height: 115
  });

  // Card 2: CRM & Sheets
  const cardSheets = addCell({
    parent: thirdPartyContainer,
    value: `<b>Database &amp; CRM Sync</b><br/><font color="#16a34a"><b>Google Sheets API v4</b></font><br/><font color="#64748b" style="font-size: 11px;">Google Cloud IAM Service Account<br/>Tự động lưu trữ leads, CRM quản lý tiến độ tư vấn &amp; booking</font>`,
    style: 'rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#16a34a;strokeWidth=1.5;shadow=1;align=center;verticalAlign=middle;arcSize=10;',
    x: 330, y: 50, width: 280, height: 115
  });

  // Card 3: Media Player
  const cardPlayer = addCell({
    parent: thirdPartyContainer,
    value: `<b>Media &amp; Video Engine</b><br/><font color="#d97706"><b>Plyr.js / HTML5 Video</b></font><br/><font color="#64748b" style="font-size: 11px;">Trình phát video thích ứng (Adaptive)<br/>Tối ưu trải nghiệm xem showreel trên Desktop, Tablet &amp; Mobile</font>`,
    style: 'rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#d97706;strokeWidth=1.5;shadow=1;align=center;verticalAlign=middle;arcSize=10;',
    x: 640, y: 50, width: 280, height: 115
  });

  // Card 4: CDN & Hosting
  const cardHosting = addCell({
    parent: thirdPartyContainer,
    value: `<b>Edge Network &amp; Hosting</b><br/><font color="#0f172a"><b>Vercel Edge &amp; Cloudflare</b></font><br/><font color="#64748b" style="font-size: 11px;">Global CDN, Tự động cấp phát SSL/TLS<br/>DDoS protection &amp; nén asset Gzip/Brotli tốc độ cao</font>`,
    style: 'rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#475569;strokeWidth=1.5;shadow=1;align=center;verticalAlign=middle;arcSize=10;',
    x: 950, y: 50, width: 270, height: 115
  });

  // Row 2 of 3rd Party Apps (Y relative to container: 195)
  // Card 5: Customer Support Chat
  const cardChat = addCell({
    parent: thirdPartyContainer,
    value: `<b>Customer Support &amp; Chat</b><br/><font color="#2563eb"><b>Zalo OA &amp; FB Messenger</b></font><br/><font color="#64748b" style="font-size: 11px;">Kênh tư vấn trực tiếp 1:1 thời gian thực<br/>Nút liên hệ nhanh qua hotline, Zalo và fanpage cho khách đặt lịch</font>`,
    style: 'rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#2563eb;strokeWidth=1.5;shadow=1;align=center;verticalAlign=middle;arcSize=10;',
    x: 20, y: 195, width: 280, height: 115
  });

  // Card 6: Bot Protection & Security
  const cardSecurity = addCell({
    parent: thirdPartyContainer,
    value: `<b>Security &amp; Bot Protection</b><br/><font color="#dc2626"><b>Honeypot &amp; Rate Limiter</b></font><br/><font color="#64748b" style="font-size: 11px;">Bảo mật nhiều lớp chống spam form<br/>Lọc bot bằng honeypot ẩn, giới hạn 5 req/15min theo IP, mã hóa key</font>`,
    style: 'rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#dc2626;strokeWidth=1.5;shadow=1;align=center;verticalAlign=middle;arcSize=10;',
    x: 330, y: 195, width: 280, height: 115
  });

  // Card 7: Multi-Language Engine
  const cardI18n = addCell({
    parent: thirdPartyContainer,
    value: `<b>Localization &amp; Multi-Language</b><br/><font color="#0891b2"><b>i18next &amp; Language Detector</b></font><br/><font color="#64748b" style="font-size: 11px;">Đa ngôn ngữ Tiếng Việt &amp; Tiếng Anh<br/>Tự động nhận diện ngôn ngữ trình duyệt, phục vụ khách quốc tế</font>`,
    style: 'rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#0891b2;strokeWidth=1.5;shadow=1;align=center;verticalAlign=middle;arcSize=10;',
    x: 640, y: 195, width: 280, height: 115
  });

  // Card 8: Payment Gateway (Phase 2)
  const cardPayment = addCell({
    parent: thirdPartyContainer,
    value: `<b>Online Payment (Roadmap Phase 2)</b><br/><font color="#7c3aed"><b>PayOS / VNPay / MoMo</b></font><br/><font color="#64748b" style="font-size: 11px;">Cổng thanh toán &amp; Quét mã VietQR<br/>Tự động hóa thanh toán tiền cọc hợp đồng sản xuất truyền thông</font>`,
    style: 'rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#7c3aed;strokeWidth=1.5;shadow=1;align=center;verticalAlign=middle;arcSize=10;',
    x: 950, y: 195, width: 270, height: 115
  });

  // Connector between Apps and 3rd Party Apps
  addCell({
    edge: 1,
    source: backendBox,
    target: thirdPartyContainer,
    style: 'edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#64748b;strokeWidth=2;dashed=1;endArrow=classic;endFill=1;'
  });

  return `<mxfile host="app.diagrams.net" modified="${new Date().toISOString()}" agent="Antigravity" version="24.0.0" type="device">
  <diagram id="nore-media-tech-stack" name="Core Tech Stack">
    <mxGraphModel dx="1422" dy="850" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1350" pageHeight="870" background="#FFFFFF" math="0" shadow="0">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
${cells.join('\n')}
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`;
}

const xml = generateDrawioXml();
fs.writeFileSync('architecture-core-tech-stack.drawio', xml, 'utf8');
console.log('Successfully generated architecture-core-tech-stack.drawio');
