import fs from 'node:fs';

// Helper to base64 encode SVG
function svgToBase64(svgStr) {
  return Buffer.from(svgStr.trim()).toString('base64');
}

// 1. React SVG
const reactSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-11.5 -10.23 23 20.46">
  <circle cx="0" cy="0" r="2.05" fill="#00D8FF"/>
  <g stroke="#00D8FF" stroke-width="1" fill="none">
    <ellipse rx="11" ry="4.2"/>
    <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
    <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
  </g>
</svg>`;

// 2. Vite SVG
const viteSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <path fill="#41D1FF" d="M29.5 5.5L16.8 28.7a1 1 0 0 1-1.7 0L2.5 5.5a1 1 0 0 1 .9-1.5h25.2a1 1 0 0 1 .9 1.5z"/>
  <path fill="#BD34FE" d="M23.5 4.5L16 28.5 8.5 4.5z"/>
  <path fill="#FFD025" d="M17.5 3L10 17h5l-2 11 10-14h-5.5z"/>
</svg>`;

// 3. Framer Motion SVG (Official Black)
const framerSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <path fill="#000000" d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z"/>
</svg>`;

// 4. Plyr SVG
const plyrSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <defs>
    <linearGradient id="pGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF5A00"/>
      <stop offset="50%" stop-color="#FF0055"/>
      <stop offset="100%" stop-color="#9900CC"/>
    </linearGradient>
  </defs>
  <rect width="32" height="32" rx="6" fill="url(#pGrad)"/>
  <polygon points="12,9 24,16 12,23" fill="#ffffff"/>
</svg>`;

// 5. Node.js SVG
const nodeSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 36">
  <path fill="#539E43" d="M16 3L3.5 10.2v14.6L16 32l12.5-7.2V10.2L16 3z"/>
  <text x="16" y="21" font-family="-apple-system, BlinkMacSystemFont, Arial, sans-serif" font-weight="900" font-size="9" fill="#ffffff" text-anchor="middle">JS</text>
  <text x="36" y="24" font-family="-apple-system, BlinkMacSystemFont, Arial, sans-serif" font-weight="800" font-size="22" fill="#222222">node</text>
  <circle cx="95" cy="22" r="3.5" fill="#539E43"/>
  <text x="103" y="24" font-family="-apple-system, BlinkMacSystemFont, Arial, sans-serif" font-weight="800" font-size="18" fill="#539E43">js</text>
</svg>`;

// 6. REST API Cloud SVG
const restApiSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 60">
  <path fill="#0284c7" d="M80 36c0-11-9-20-20-20-2.8 0-5.4.6-7.8 1.6C49 9.2 40.1 3 30 3 16.2 3 5 14.2 5 28c0 1.2.1 2.3.3 3.4C2.1 33.2 0 36.8 0 41c0 6.6 5.4 12 12 12h66c6.6 0 12-5.4 12-12 0-2.8-.9-5.3-2.5-7.3.3-1.2.5-2.5.5-3.7z"/>
  <text x="45" y="32" font-family="-apple-system, Arial, sans-serif" font-weight="800" font-size="13" fill="#ffffff" text-anchor="middle">API</text>
  <text x="45" y="45" font-family="-apple-system, Arial, sans-serif" font-size="10" fill="#bae6fd" text-anchor="middle">{REST}</text>
</svg>`;

// 7. Google Sheets SVG
const sheetsSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 40">
  <path fill="#0F9D58" d="M22 0H3a3 3 0 0 0-3 3v34a3 3 0 0 0 3 3h26a3 3 0 0 0 3-3V10L22 0z"/>
  <path fill="#87CEAB" d="M22 0v10h10L22 0z"/>
  <rect x="6" y="15" width="20" height="18" rx="1" fill="#ffffff"/>
  <path fill="#0F9D58" d="M12 17h12v3H12zm0 5h12v3H12zm0 5h12v3H12zM8 17h3v3H8zm0 5h3v3H8zm0 5h3v3H8z"/>
</svg>`;

// 8. Cloudflare Cloud SVG
const cloudSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 60">
  <path fill="#F38020" d="M78 20c-2-10.5-11.5-18-22.5-18-9.8 0-18.3 5.8-21.5 14.5C31.5 15.8 29.5 15.3 28 15.3 16.7 15.3 7.5 24.5 7.5 35.8c0 1.2.2 2.5.5 3.8C3.2 41.5 0 46.2 0 52c0 8 6.5 8 14.5 8h63.5C90 60 100 50 100 38c0-10.8-7.8-19.5-18.3-21.5l-3.7-.5z"/>
  <path fill="#FAAE40" d="M78 20l-2 3.5 4 .5c8.5 1.2 15 8.5 15 17.2 0 9.8-7.8 17.5-17.5 17.5H14.5c-4.5 0-8.2-2-9.2-5 3.5-6.2 10.8-10.5 19.2-10.5 2 0 4 .2 5.8 1l4 1.5 1.5-3.8C38.8 31 46.5 26.5 55 26.5c9 0 16.5 5.2 19.5 13.2l2 5.2 5.5-1c1.8-.2 3.5-.5 5.2-.5 4.5 0 8.8 1.8 11.8 4.8C96 33.5 85 24 78 20z"/>
</svg>`;

// 9. Vercel Logo SVG
const vercelSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <polygon points="12,2 24,22 0,22" fill="#000000"/>
</svg>`;

// 10. Gmail SVG
const gmailSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <path fill="#4285F4" d="M1.5 5.25v13.5c0 .97.78 1.75 1.75 1.75h3.5V11.5L1.5 7.6z"/>
  <path fill="#34A853" d="M22.5 5.25v13.5c0 .97-.78 1.75-1.75 1.75h-3.5V11.5l5.25-3.9z"/>
  <path fill="#EA4335" d="M17.25 3.5H6.75C5.78 3.5 5 4.28 5 5.25v3.1l7 5.25 7-5.25v-3.1c0-.97-.78-1.75-1.75-1.75z"/>
  <path fill="#FBBC04" d="M1.5 5.25c0-.97.78-1.75 1.75-1.75h2.15l1.35 1.01L1.5 8.7V5.25z"/>
  <path fill="#C5221F" d="M22.5 5.25c0-.97-.78-1.75-1.75-1.75h-2.15l-1.35 1.01 5.25 4.19V5.25z"/>
</svg>`;

// Base64 map
const b64 = {
  react: svgToBase64(reactSvg),
  vite: svgToBase64(viteSvg),
  framer: svgToBase64(framerSvg),
  plyr: svgToBase64(plyrSvg),
  node: svgToBase64(nodeSvg),
  restApi: svgToBase64(restApiSvg),
  sheets: svgToBase64(sheetsSvg),
  cloud: svgToBase64(cloudSvg),
  vercel: svgToBase64(vercelSvg),
  gmail: svgToBase64(gmailSvg),
};

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

  function addCell({ id, parent = '1', value = '', style = '', vertex = 1, edge = 0, source, target, x, y, width, height, relative = 0, sourcePoint, targetPoint }) {
    const cellId = id || getId();
    let geom = '';
    if (vertex) {
      geom = `<mxGeometry x="${x}" y="${y}" width="${width}" height="${height}" as="geometry" />`;
    } else if (edge) {
      let pts = '';
      if (sourcePoint) {
        pts += `<mxPoint x="${sourcePoint.x}" y="${sourcePoint.y}" as="sourcePoint" />`;
      }
      if (targetPoint) {
        pts += `<mxPoint x="${targetPoint.x}" y="${targetPoint.y}" as="targetPoint" />`;
      }
      geom = `<mxGeometry relative="${relative}" as="geometry">${pts}</mxGeometry>`;
    }
    const sourceAttr = source ? ` source="${source}"` : '';
    const targetAttr = target ? ` target="${target}"` : '';
    const cellXml = `        <mxCell id="${cellId}" value="${escapeXml(value)}" style="${style}" vertex="${vertex}" edge="${edge}"${sourceAttr}${targetAttr} parent="${parent}">
          ${geom}
        </mxCell>`;
    cells.push(cellXml);
    return cellId;
  }

  // Header Titles
  addCell({
    value: 'Clients',
    style: 'text;html=1;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontStyle=1;fontSize=24;fontColor=#000000;',
    x: 75, y: 35, width: 110, height: 40
  });

  addCell({
    value: 'Apps',
    style: 'text;html=1;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontStyle=1;fontSize=24;fontColor=#000000;',
    x: 430, y: 35, width: 110, height: 40
  });

  addCell({
    value: 'Data',
    style: 'text;html=1;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontStyle=1;fontSize=24;fontColor=#000000;',
    x: 775, y: 35, width: 110, height: 40
  });

  // ================= 1. CLIENTS =================
  // Web Browser actor
  addCell({
    value: '',
    style: 'shape=umlActor;verticalLabelPosition=bottom;verticalAlign=top;html=1;outlineConnect=0;fillColor=none;strokeColor=#000000;strokeWidth=1.8;',
    x: 110, y: 135, width: 36, height: 60
  });
  addCell({
    value: 'Web Browser',
    style: 'text;html=1;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=14;fontColor=#000000;',
    x: 70, y: 200, width: 115, height: 25
  });

  // Mobile Browser actor
  addCell({
    value: '',
    style: 'shape=umlActor;verticalLabelPosition=bottom;verticalAlign=top;html=1;outlineConnect=0;fillColor=none;strokeColor=#000000;strokeWidth=1.8;',
    x: 110, y: 245, width: 36, height: 60
  });
  addCell({
    value: 'Mobile Browser',
    style: 'text;html=1;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=14;fontColor=#000000;',
    x: 70, y: 310, width: 115, height: 25
  });

  // ================= 2. APPS =================
  // Main Apps Box Container (Border box)
  addCell({
    value: '',
    style: 'rounded=0;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#333333;strokeWidth=1.8;',
    x: 300, y: 95, width: 320, height: 355
  });

  // Tier 1: Front-end (y: 95, h: 88)
  addCell({
    value: '',
    style: 'rounded=0;whiteSpace=wrap;html=1;fillColor=none;strokeColor=#333333;strokeWidth=1;',
    x: 300, y: 95, width: 320, height: 88
  });
  addCell({
    value: 'Front-end',
    style: 'text;html=1;align=left;verticalAlign=top;whiteSpace=wrap;rounded=0;fontSize=15;fontColor=#000000;spacingLeft=12;spacingTop=10;',
    x: 300, y: 95, width: 95, height: 35
  });
  // React Icon + Text
  addCell({
    value: '',
    style: `shape=image;imageAspect=1;image=data:image/svg+xml;base64,${b64.react};`,
    x: 410, y: 108, width: 44, height: 40
  });
  addCell({
    value: '<font color="#00D8FF" style="font-size:12px;">React</font>',
    style: 'text;html=1;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;',
    x: 405, y: 150, width: 55, height: 20
  });
  // Vite Icon + Text
  addCell({
    value: '',
    style: `shape=image;imageAspect=1;image=data:image/svg+xml;base64,${b64.vite};`,
    x: 510, y: 110, width: 38, height: 40
  });
  addCell({
    value: '<font color="#9333EA" style="font-size:12px;">Vite</font>',
    style: 'text;html=1;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;',
    x: 502, y: 150, width: 55, height: 20
  });

  // Tier 2: UI (y: 183, h: 88)
  addCell({
    value: '',
    style: 'rounded=0;whiteSpace=wrap;html=1;fillColor=none;strokeColor=#333333;strokeWidth=1;',
    x: 300, y: 183, width: 320, height: 88
  });
  addCell({
    value: 'UI',
    style: 'text;html=1;align=left;verticalAlign=top;whiteSpace=wrap;rounded=0;fontSize=15;fontColor=#000000;spacingLeft=12;spacingTop=10;',
    x: 300, y: 183, width: 60, height: 35
  });
  // i18n
  addCell({
    value: '<b>i18n</b>',
    style: 'text;html=1;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=20;fontColor=#000000;fontFamily=Arial,sans-serif;',
    x: 355, y: 205, width: 50, height: 35
  });
  // Framer Motion Icon + Label
  addCell({
    value: '',
    style: `shape=image;imageAspect=1;image=data:image/svg+xml;base64,${b64.framer};`,
    x: 435, y: 198, width: 32, height: 36
  });
  addCell({
    value: '<font color="#000000" style="font-size:10px;">Framer Motion</font>',
    style: 'text;html=1;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;',
    x: 416, y: 236, width: 70, height: 18
  });
  // Plyr Icon + Label
  addCell({
    value: '',
    style: `shape=image;imageAspect=1;image=data:image/svg+xml;base64,${b64.plyr};`,
    x: 520, y: 198, width: 35, height: 35
  });
  addCell({
    value: '<font color="#FF0055" style="font-size:11px;">Plyr</font>',
    style: 'text;html=1;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;',
    x: 512, y: 236, width: 50, height: 18
  });

  // Tier 3: Back-end (y: 271, h: 90)
  addCell({
    value: '',
    style: 'rounded=0;whiteSpace=wrap;html=1;fillColor=none;strokeColor=#333333;strokeWidth=1;',
    x: 300, y: 271, width: 320, height: 90
  });
  addCell({
    value: 'Back-end',
    style: 'text;html=1;align=left;verticalAlign=top;whiteSpace=wrap;rounded=0;fontSize=15;fontColor=#000000;spacingLeft=12;spacingTop=10;',
    x: 300, y: 271, width: 95, height: 35
  });
  // Node.js Icon
  addCell({
    value: '',
    style: `shape=image;imageAspect=1;image=data:image/svg+xml;base64,${b64.node};`,
    x: 425, y: 298, width: 110, height: 36
  });

  // Tier 4: API (y: 361, h: 89)
  addCell({
    value: '',
    style: 'rounded=0;whiteSpace=wrap;html=1;fillColor=none;strokeColor=#333333;strokeWidth=1;',
    x: 300, y: 361, width: 320, height: 89
  });
  addCell({
    value: 'API',
    style: 'text;html=1;align=left;verticalAlign=top;whiteSpace=wrap;rounded=0;fontSize=15;fontColor=#000000;spacingLeft=12;spacingTop=10;',
    x: 300, y: 361, width: 60, height: 35
  });
  // REST API Icon
  addCell({
    value: '',
    style: `shape=image;imageAspect=1;image=data:image/svg+xml;base64,${b64.restApi};`,
    x: 435, y: 378, width: 80, height: 52
  });

  // ================= 3. DATA =================
  // Cylinder Data
  addCell({
    value: '',
    style: 'shape=cylinder3;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;size=22;fillColor=#FFFFFF;strokeColor=#333333;strokeWidth=1.8;',
    x: 720, y: 85, width: 220, height: 375
  });

  // Section 1: Lead / Contact
  addCell({
    value: 'Lead / Contact',
    style: 'text;html=1;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=16;fontColor=#000000;',
    x: 755, y: 140, width: 150, height: 26
  });
  addCell({
    value: '',
    style: `shape=image;imageAspect=1;image=data:image/svg+xml;base64,${b64.sheets};`,
    x: 805, y: 172, width: 48, height: 58
  });

  // Section 2: Media / Videos
  addCell({
    value: 'Media / Videos',
    style: 'text;html=1;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=16;fontColor=#000000;',
    x: 755, y: 268, width: 150, height: 26
  });
  addCell({
    value: '',
    style: `shape=image;imageAspect=1;image=data:image/svg+xml;base64,${b64.cloud};`,
    x: 775, y: 308, width: 105, height: 60
  });

  // ================= CONNECTORS / ARROWS =================
  // Web Browser -> Apps
  addCell({
    edge: 1,
    style: 'edgeStyle=straight;html=1;strokeColor=#000000;strokeWidth=1.2;endArrow=classic;endFill=1;',
    sourcePoint: { x: 146, y: 165 },
    targetPoint: { x: 300, y: 200 }
  });

  // Mobile Browser -> Apps
  addCell({
    edge: 1,
    style: 'edgeStyle=straight;html=1;strokeColor=#000000;strokeWidth=1.2;endArrow=classic;endFill=1;',
    sourcePoint: { x: 146, y: 275 },
    targetPoint: { x: 300, y: 245 }
  });

  // Apps -> Data (Top arrow pointing to Data)
  addCell({
    edge: 1,
    style: 'edgeStyle=straight;html=1;strokeColor=#000000;strokeWidth=1.2;endArrow=classic;endFill=1;',
    sourcePoint: { x: 620, y: 228 },
    targetPoint: { x: 720, y: 228 }
  });

  // Data -> Apps (Bottom arrow pointing from Data back to Apps)
  addCell({
    edge: 1,
    style: 'edgeStyle=straight;html=1;strokeColor=#000000;strokeWidth=1.2;endArrow=classic;endFill=1;',
    sourcePoint: { x: 720, y: 338 },
    targetPoint: { x: 620, y: 338 }
  });

  // ================= 4. 3RD PARTY APPS =================
  addCell({
    value: '3rd Party',
    style: 'text;html=1;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontStyle=1;fontSize=22;fontColor=#000000;',
    x: 70, y: 535, width: 120, height: 40
  });

  // Box 1: Vercel Hosting
  addCell({
    value: '',
    style: 'rounded=0;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#333333;strokeWidth=1.2;',
    x: 215, y: 525, width: 155, height: 60
  });
  addCell({
    value: '',
    style: `shape=image;imageAspect=1;image=data:image/svg+xml;base64,${b64.vercel};`,
    x: 228, y: 541, width: 28, height: 28
  });
  addCell({
    value: '<b>Vercel</b> Hosting',
    style: 'text;html=1;align=left;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=13;fontColor=#000000;',
    x: 262, y: 538, width: 100, height: 32
  });

  // Box 2: Email Service
  addCell({
    value: '',
    style: 'rounded=0;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#333333;strokeWidth=1.2;',
    x: 405, y: 525, width: 155, height: 60
  });
  addCell({
    value: '',
    style: `shape=image;imageAspect=1;image=data:image/svg+xml;base64,${b64.gmail};`,
    x: 420, y: 537, width: 36, height: 36
  });
  addCell({
    value: 'Email<br/>Service',
    style: 'text;html=1;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=13;fontColor=#000000;',
    x: 462, y: 532, width: 90, height: 44
  });

  // Box 3: Data Integration
  addCell({
    value: '',
    style: 'rounded=0;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#333333;strokeWidth=1.2;',
    x: 595, y: 525, width: 155, height: 60
  });
  addCell({
    value: '',
    style: `shape=image;imageAspect=1;image=data:image/svg+xml;base64,${b64.sheets};`,
    x: 610, y: 537, width: 26, height: 35
  });
  addCell({
    value: 'Data<br/>Integration',
    style: 'text;html=1;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=13;fontColor=#000000;',
    x: 645, y: 532, width: 95, height: 44
  });

  // Box 4: Cloud
  addCell({
    value: '',
    style: 'rounded=0;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#333333;strokeWidth=1.2;',
    x: 785, y: 525, width: 155, height: 60
  });
  addCell({
    value: '',
    style: `shape=image;imageAspect=1;image=data:image/svg+xml;base64,${b64.cloud};`,
    x: 795, y: 537, width: 55, height: 35
  });
  addCell({
    value: 'Cloud',
    style: 'text;html=1;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=14;fontColor=#000000;',
    x: 855, y: 538, width: 75, height: 32
  });

  return `<mxfile host="app.diagrams.net" modified="${new Date().toISOString()}" agent="Antigravity" version="24.0.0" type="device">
  <diagram id="nore-media-simple-tech-stack" name="Core Tech Stack">
    <mxGraphModel dx="1200" dy="750" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1050" pageHeight="680" background="#FFFFFF" math="0" shadow="0">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
${cells.join('\n')}
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`;
}

// ---------------- SVG GENERATOR ----------------
function generateSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1020 660" width="100%" height="100%" style="background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#000000"/>
    </marker>
  </defs>

  <!-- ================= TITLES ================= -->
  <text x="130" y="60" text-anchor="middle" font-size="24" font-weight="700" fill="#000000">Clients</text>
  <text x="460" y="60" text-anchor="middle" font-size="24" font-weight="700" fill="#000000">Apps</text>
  <text x="830" y="60" text-anchor="middle" font-size="24" font-weight="700" fill="#000000">Data</text>

  <!-- ================= 1. CLIENTS ================= -->
  <!-- Web Browser -->
  <g transform="translate(130, 135)">
    <circle cx="0" cy="-20" r="12" fill="none" stroke="#000000" stroke-width="2"/>
    <line x1="0" y1="-8" x2="0" y2="18" stroke="#000000" stroke-width="2"/>
    <line x1="-18" y1="2" x2="18" y2="2" stroke="#000000" stroke-width="2"/>
    <line x1="0" y1="18" x2="-14" y2="40" stroke="#000000" stroke-width="2"/>
    <line x1="0" y1="18" x2="14" y2="40" stroke="#000000" stroke-width="2"/>
    <text x="0" y="64" text-anchor="middle" font-size="14" fill="#000000">Web Browser</text>
  </g>

  <!-- Mobile Browser -->
  <g transform="translate(130, 245)">
    <circle cx="0" cy="-20" r="12" fill="none" stroke="#000000" stroke-width="2"/>
    <line x1="0" y1="-8" x2="0" y2="18" stroke="#000000" stroke-width="2"/>
    <line x1="-18" y1="2" x2="18" y2="2" stroke="#000000" stroke-width="2"/>
    <line x1="0" y1="18" x2="-14" y2="40" stroke="#000000" stroke-width="2"/>
    <line x1="0" y1="18" x2="14" y2="40" stroke="#000000" stroke-width="2"/>
    <text x="0" y="64" text-anchor="middle" font-size="14" fill="#000000">Mobile Browser</text>
  </g>

  <!-- Arrows: Clients -> Apps -->
  <line x1="150" y1="165" x2="300" y2="200" stroke="#000000" stroke-width="1.3" marker-end="url(#arrow)"/>
  <line x1="150" y1="275" x2="300" y2="245" stroke="#000000" stroke-width="1.3" marker-end="url(#arrow)"/>

  <!-- ================= 2. APPS ================= -->
  <!-- Outer Box -->
  <rect x="300" y="95" width="320" height="355" fill="#ffffff" stroke="#222222" stroke-width="1.8"/>

  <!-- Tier 1: Front-end -->
  <line x1="300" y1="183" x2="620" y2="183" stroke="#222222" stroke-width="1"/>
  <text x="315" y="125" font-size="15" fill="#000000">Front-end</text>
  <!-- React -->
  <g transform="translate(415, 110)">
    <g transform="scale(2)">
      <circle cx="10" cy="9" r="2.05" fill="#00D8FF"/>
      <g stroke="#00D8FF" stroke-width="1" fill="none">
        <ellipse cx="10" cy="9" rx="10" ry="3.8"/>
        <ellipse cx="10" cy="9" rx="10" ry="3.8" transform="rotate(60 10 9)"/>
        <ellipse cx="10" cy="9" rx="10" ry="3.8" transform="rotate(120 10 9)"/>
      </g>
    </g>
    <text x="20" y="46" text-anchor="middle" font-size="12" fill="#00D8FF">React</text>
  </g>
  <!-- Vite -->
  <g transform="translate(510, 110)">
    <g transform="scale(1.2)">
      <path fill="#41D1FF" d="M29.5 5.5L16.8 28.7a1 1 0 0 1-1.7 0L2.5 5.5a1 1 0 0 1 .9-1.5h25.2a1 1 0 0 1 .9 1.5z"/>
      <path fill="#BD34FE" d="M23.5 4.5L16 28.5 8.5 4.5z"/>
      <path fill="#FFD025" d="M17.5 3L10 17h5l-2 11 10-14h-5.5z"/>
    </g>
    <text x="18" y="46" text-anchor="middle" font-size="12" fill="#BD34FE">Vite</text>
  </g>

  <!-- Tier 2: UI -->
  <line x1="300" y1="271" x2="620" y2="271" stroke="#222222" stroke-width="1"/>
  <text x="315" y="213" font-size="15" fill="#000000">UI</text>
  <!-- i18n -->
  <text x="380" y="235" text-anchor="middle" font-size="22" font-weight="700" fill="#000000">i18n</text>
  <!-- Framer Motion -->
  <g transform="translate(432, 198)">
    <g transform="scale(1.5)">
      <path fill="#000000" d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z"/>
    </g>
    <text x="15" y="48" text-anchor="middle" font-size="10" fill="#000000">Framer Motion</text>
  </g>
  <!-- Plyr -->
  <g transform="translate(520, 198)">
    <defs>
      <linearGradient id="pGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FF5A00"/>
        <stop offset="50%" stop-color="#FF0055"/>
        <stop offset="100%" stop-color="#9900CC"/>
      </linearGradient>
    </defs>
    <rect width="28" height="28" rx="6" fill="url(#pGrad2)"/>
    <polygon points="10,7 22,14 10,21" fill="#ffffff"/>
    <text x="14" y="48" text-anchor="middle" font-size="11" fill="#FF0055">Plyr</text>
  </g>

  <!-- Tier 3: Back-end -->
  <line x1="300" y1="361" x2="620" y2="361" stroke="#222222" stroke-width="1"/>
  <text x="315" y="301" font-size="15" fill="#000000">Back-end</text>
  <!-- Node.js -->
  <g transform="translate(425, 298)">
    <path fill="#539E43" d="M16 3L3.5 10.2v14.6L16 32l12.5-7.2V10.2L16 3z"/>
    <text x="16" y="21" font-weight="900" font-size="9" fill="#ffffff" text-anchor="middle">JS</text>
    <text x="36" y="24" font-weight="800" font-size="22" fill="#222222">node</text>
    <circle cx="95" cy="22" r="3.5" fill="#539E43"/>
    <text x="103" y="24" font-weight="800" font-size="18" fill="#539E43">js</text>
  </g>

  <!-- Tier 4: API -->
  <text x="315" y="391" font-size="15" fill="#000000">API</text>
  <!-- REST API -->
  <g transform="translate(435, 378) scale(0.9)">
    <path fill="#0284c7" d="M80 36c0-11-9-20-20-20-2.8 0-5.4.6-7.8 1.6C49 9.2 40.1 3 30 3 16.2 3 5 14.2 5 28c0 1.2.1 2.3.3 3.4C2.1 33.2 0 36.8 0 41c0 6.6 5.4 12 12 12h66c6.6 0 12-5.4 12-12 0-2.8-.9-5.3-2.5-7.3.3-1.2.5-2.5.5-3.7z"/>
    <text x="45" y="32" font-weight="800" font-size="13" fill="#ffffff" text-anchor="middle">API</text>
    <text x="45" y="45" font-size="10" fill="#bae6fd" text-anchor="middle">{REST}</text>
  </g>

  <!-- Arrows: Apps <-> Data -->
  <line x1="620" y1="228" x2="720" y2="228" stroke="#000000" stroke-width="1.3" marker-end="url(#arrow)"/>
  <line x1="720" y1="338" x2="620" y2="338" stroke="#000000" stroke-width="1.3" marker-end="url(#arrow)"/>

  <!-- ================= 3. DATA ================= -->
  <!-- Cylinder -->
  <g transform="translate(720, 85)">
    <path d="M 0 22 C 0 8, 220 8, 220 22 L 220 353 C 220 367, 0 367, 0 353 Z" fill="#ffffff" stroke="#222222" stroke-width="1.8"/>
    <ellipse cx="110" cy="22" rx="110" ry="18" fill="#ffffff" stroke="#222222" stroke-width="1.8"/>

    <!-- Lead / Contact -->
    <text x="110" y="65" text-anchor="middle" font-size="16" fill="#000000">Lead / Contact</text>
    <!-- Google Sheets -->
    <g transform="translate(85, 90) scale(1.5)">
      <path fill="#0F9D58" d="M22 0H3a3 3 0 0 0-3 3v34a3 3 0 0 0 3 3h26a3 3 0 0 0 3-3V10L22 0z"/>
      <path fill="#87CEAB" d="M22 0v10h10L22 0z"/>
      <rect x="6" y="15" width="20" height="18" rx="1" fill="#ffffff"/>
      <path fill="#0F9D58" d="M12 17h12v3H12zm0 5h12v3H12zm0 5h12v3H12zM8 17h3v3H8zm0 5h3v3H8zm0 5h3v3H8z"/>
    </g>

    <!-- Media / Videos -->
    <text x="110" y="195" text-anchor="middle" font-size="16" fill="#000000">Media / Videos</text>
    <!-- Cloudflare Cloud -->
    <g transform="translate(58, 220) scale(1.05)">
      <path fill="#F38020" d="M78 20c-2-10.5-11.5-18-22.5-18-9.8 0-18.3 5.8-21.5 14.5C31.5 15.8 29.5 15.3 28 15.3 16.7 15.3 7.5 24.5 7.5 35.8c0 1.2.2 2.5.5 3.8C3.2 41.5 0 46.2 0 52c0 8 6.5 8 14.5 8h63.5C90 60 100 50 100 38c0-10.8-7.8-19.5-18.3-21.5l-3.7-.5z"/>
      <path fill="#FAAE40" d="M78 20l-2 3.5 4 .5c8.5 1.2 15 8.5 15 17.2 0 9.8-7.8 17.5-17.5 17.5H14.5c-4.5 0-8.2-2-9.2-5 3.5-6.2 10.8-10.5 19.2-10.5 2 0 4 .2 5.8 1l4 1.5 1.5-3.8C38.8 31 46.5 26.5 55 26.5c9 0 16.5 5.2 19.5 13.2l2 5.2 5.5-1c1.8-.2 3.5-.5 5.2-.5 4.5 0 8.8 1.8 11.8 4.8C96 33.5 85 24 78 20z"/>
    </g>
  </g>

  <!-- ================= 4. 3RD PARTY ================= -->
  <text x="135" y="562" text-anchor="middle" font-size="22" font-weight="700" fill="#000000">3rd Party</text>

  <!-- Box 1: Vercel Hosting -->
  <rect x="215" y="525" width="155" height="60" fill="#ffffff" stroke="#222222" stroke-width="1.3"/>
  <g transform="translate(228, 541) scale(1.1)">
    <polygon points="12,2 24,22 0,22" fill="#000000"/>
  </g>
  <text x="264" y="560" font-size="14" fill="#000000"><tspan font-weight="700">Vercel</tspan> Hosting</text>

  <!-- Box 2: Email Service -->
  <rect x="405" y="525" width="155" height="60" fill="#ffffff" stroke="#222222" stroke-width="1.3"/>
  <g transform="translate(422, 537) scale(1.4)">
    <path fill="#4285F4" d="M1.5 5.25v13.5c0 .97.78 1.75 1.75 1.75h3.5V11.5L1.5 7.6z"/>
    <path fill="#34A853" d="M22.5 5.25v13.5c0 .97-.78 1.75-1.75 1.75h-3.5V11.5l5.25-3.9z"/>
    <path fill="#EA4335" d="M17.25 3.5H6.75C5.78 3.5 5 4.28 5 5.25v3.1l7 5.25 7-5.25v-3.1c0-.97-.78-1.75-1.75-1.75z"/>
    <path fill="#FBBC04" d="M1.5 5.25c0-.97.78-1.75 1.75-1.75h2.15l1.35 1.01L1.5 8.7V5.25z"/>
    <path fill="#C5221F" d="M22.5 5.25c0-.97-.78-1.75-1.75-1.75h-2.15l-1.35 1.01 5.25 4.19V5.25z"/>
  </g>
  <text x="495" y="551" text-anchor="middle" font-size="13" fill="#000000">Email</text>
  <text x="495" y="568" text-anchor="middle" font-size="13" fill="#000000">Service</text>

  <!-- Box 3: Data Integration -->
  <rect x="595" y="525" width="155" height="60" fill="#ffffff" stroke="#222222" stroke-width="1.3"/>
  <g transform="translate(614, 537) scale(0.9)">
    <path fill="#0F9D58" d="M22 0H3a3 3 0 0 0-3 3v34a3 3 0 0 0 3 3h26a3 3 0 0 0 3-3V10L22 0z"/>
    <path fill="#87CEAB" d="M22 0v10h10L22 0z"/>
    <rect x="6" y="15" width="20" height="18" rx="1" fill="#ffffff"/>
    <path fill="#0F9D58" d="M12 17h12v3H12zm0 5h12v3H12zm0 5h12v3H12zM8 17h3v3H8zm0 5h3v3H8zm0 5h3v3H8z"/>
  </g>
  <text x="686" y="551" text-anchor="middle" font-size="13" fill="#000000">Data</text>
  <text x="686" y="568" text-anchor="middle" font-size="13" fill="#000000">Integration</text>

  <!-- Box 4: Cloud -->
  <rect x="785" y="525" width="155" height="60" fill="#ffffff" stroke="#222222" stroke-width="1.3"/>
  <g transform="translate(798, 538) scale(0.6)">
    <path fill="#F38020" d="M78 20c-2-10.5-11.5-18-22.5-18-9.8 0-18.3 5.8-21.5 14.5C31.5 15.8 29.5 15.3 28 15.3 16.7 15.3 7.5 24.5 7.5 35.8c0 1.2.2 2.5.5 3.8C3.2 41.5 0 46.2 0 52c0 8 6.5 8 14.5 8h63.5C90 60 100 50 100 38c0-10.8-7.8-19.5-18.3-21.5l-3.7-.5z"/>
    <path fill="#FAAE40" d="M78 20l-2 3.5 4 .5c8.5 1.2 15 8.5 15 17.2 0 9.8-7.8 17.5-17.5 17.5H14.5c-4.5 0-8.2-2-9.2-5 3.5-6.2 10.8-10.5 19.2-10.5 2 0 4 .2 5.8 1l4 1.5 1.5-3.8C38.8 31 46.5 26.5 55 26.5c9 0 16.5 5.2 19.5 13.2l2 5.2 5.5-1c1.8-.2 3.5-.5 5.2-.5 4.5 0 8.8 1.8 11.8 4.8C96 33.5 85 24 78 20z"/>
  </g>
  <text x="890" y="560" text-anchor="middle" font-size="14" fill="#000000">Cloud</text>
</svg>`;
}

function generateHtml(svgContent) {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Architecture - Core Tech Stack (NORE MEDIA)</title>
  <style>
    body {
      margin: 0;
      padding: 20px;
      background: #f1f5f9;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .toolbar {
      width: 100%;
      max-width: 1040px;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .title {
      font-size: 18px;
      font-weight: 700;
      color: #0f172a;
    }
    .btn {
      background: #2563eb;
      color: #ffffff;
      padding: 8px 16px;
      border-radius: 6px;
      text-decoration: none;
      font-size: 14px;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .btn:hover { background: #1d4ed8; }
    .card {
      background: #ffffff;
      border-radius: 8px;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1);
      padding: 20px;
      max-width: 1040px;
      width: 100%;
      box-sizing: border-box;
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <div class="title">NORE MEDIA — Architecture Core Tech Stack</div>
    <div>
      <a href="./architecture-core-tech-stack.drawio" download="architecture-core-tech-stack.drawio" class="btn">📥 Tải file .drawio</a>
      <a href="./architecture-core-tech-stack.svg" download="architecture-core-tech-stack.svg" class="btn" style="background:#475569; margin-left:8px;">🖼️ Tải file .svg</a>
    </div>
  </div>
  <div class="card">
    ${svgContent}
  </div>
</body>
</html>`;
}

// 1. Draw.io
const drawioXml = generateDrawioXml();
fs.writeFileSync('architecture-core-tech-stack.drawio', drawioXml, 'utf8');
console.log('Generated architecture-core-tech-stack.drawio');

// 2. SVG
const svg = generateSvg();
fs.writeFileSync('architecture-core-tech-stack.svg', svg, 'utf8');
console.log('Generated architecture-core-tech-stack.svg');

// 3. HTML
const html = generateHtml(svg);
fs.writeFileSync('architecture-core-tech-stack.html', html, 'utf8');
console.log('Generated architecture-core-tech-stack.html');
