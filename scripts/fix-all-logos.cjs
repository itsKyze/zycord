const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');

// Read Zycord icon PNG base64 from the SVG wrapper
const iconSvg = fs.readFileSync(path.join(root, 'public/branding/zycord_icon.svg'), 'utf8');
const b64match = iconSvg.match(/href="data:image\/png;base64,([^"]+)"/);
if (!b64match) { console.error('No base64 PNG found in zycord_icon.svg'); process.exit(1); }
const b64 = b64match[1];
console.log('[OK] Zycord icon base64 extracted, length:', b64.length);

// ============================================================
// 1. assets/icon.png — The main app icon
//    Currently: Meowcord cat (purple square with cat face)
//    This IS already the correct Zycord icon (confirmed by user)
//    BUT we verify and also update favicon.svg etc.
// ============================================================

// ============================================================
// 2. public/favicon.svg — browser tab icon
// ============================================================
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512"><image width="512" height="512" href="data:image/png;base64,${b64}"/></svg>`;
fs.writeFileSync(path.join(root, 'public/favicon.svg'), faviconSvg, 'utf8');
console.log('[OK] public/favicon.svg updated');

// ============================================================
// 3. public/branding/favicon.svg — branding favicon
// ============================================================
fs.writeFileSync(path.join(root, 'public/branding/favicon.svg'), faviconSvg, 'utf8');
console.log('[OK] public/branding/favicon.svg updated');

// ============================================================
// Helper: Replace spinner SVG in an HTML file
// ============================================================
function fixSpinnerHtml(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  // Match the SVG element with the icon image inside spinner
  const svgRegex = /<svg\s+width="80"\s+height="80"\s+viewBox="[^"]*"[^>]*>[\s\S]*?<\/svg>/;
  const newSvg = `<svg width="80" height="80" viewBox="0 0 512 512" aria-hidden="true">
      <image
        href="data:image/png;base64,${b64}"
        x="0" y="0" width="512" height="512" />
    </svg>`;
  if (svgRegex.test(html)) {
    html = html.replace(svgRegex, newSvg);
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`[OK] ${path.relative(root, filePath)} spinner SVG updated`);
  } else {
    console.warn(`[WARN] ${path.relative(root, filePath)}: pattern not found`);
  }
}

// ============================================================
// 4. public/branding/preview.html — THE one the server uses
// ============================================================
fixSpinnerHtml(path.join(root, 'public/branding/preview.html'));

// ============================================================
// 5. public/branding/spinner.html — THE one the server uses
// ============================================================
fixSpinnerHtml(path.join(root, 'public/branding/spinner.html'));

// ============================================================
// 6. branding/preview.html (root) — also fix
// ============================================================
fixSpinnerHtml(path.join(root, 'branding/preview.html'));

// ============================================================
// 7. branding/spinner.html (root) — also fix
// ============================================================
fixSpinnerHtml(path.join(root, 'branding/spinner.html'));

// ============================================================
// 8. scripts/rendered-head.svg
// ============================================================
const renderedHead = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#313338"/><image x="15" y="30" width="170" height="141" href="data:image/png;base64,${b64}" preserveAspectRatio="xMidYMid meet"/></svg>`;
fs.writeFileSync(path.join(__dirname, 'rendered-head.svg'), renderedHead, 'utf8');
console.log('[OK] scripts/rendered-head.svg updated');

console.log('\n✅ All Zycord branding files updated!');
