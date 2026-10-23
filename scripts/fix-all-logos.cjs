const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');

// Read Zycord icon PNG (base64 from the SVG wrapper)
const iconSvg = fs.readFileSync(path.join(root, 'assets/public/branding/zycord_icon.svg'), 'utf8');
const b64match = iconSvg.match(/href="data:image\/png;base64,([^"]+)"/);
if (!b64match) { console.error('No base64 PNG found in zycord_icon.svg'); process.exit(1); }
const b64 = b64match[1];
console.log('[OK] Zycord icon base64 extracted, length:', b64.length);

// --- 1. favicon.svg (used as browser tab icon, PWA icon) ---
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512"><image width="512" height="512" href="data:image/png;base64,${b64}"/></svg>`;
fs.writeFileSync(path.join(root, 'assets/public/favicon.svg'), faviconSvg, 'utf8');
console.log('[OK] assets/public/favicon.svg updated (was Wumpus, now Zycord icon)');

// --- 2. scripts/rendered-head.svg (used in render pipeline) ---
const renderedHead = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#313338"/><image x="15" y="30" width="170" height="141" href="data:image/png;base64,${b64}" preserveAspectRatio="xMidYMid meet"/></svg>`;
fs.writeFileSync(path.join(__dirname, 'rendered-head.svg'), renderedHead, 'utf8');
console.log('[OK] scripts/rendered-head.svg updated');

// --- 3. scripts/preview-svg.svg ---
const previewSvg = `<svg width="80" height="80" viewBox="0 0 200 200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><image x="15" y="30" width="170" height="141" href="data:image/png;base64,${b64}" preserveAspectRatio="xMidYMid meet"/></svg>`;
fs.writeFileSync(path.join(__dirname, 'preview-svg.svg'), previewSvg, 'utf8');
console.log('[OK] scripts/preview-svg.svg updated');

// --- 4. branding/preview.html - replace the SVG image element inside the spinner ---
// The preview.html spinner uses: <svg width="80" height="80" viewBox="0 0 769 548" ...><image href="data:..."/>
// We update to use Zycord icon with correct dimensions
let previewHtml = fs.readFileSync(path.join(root, 'branding/preview.html'), 'utf8');
// Replace the SVG element that contains the spinner image
const spinnerSvgRegex = /<svg\s+width="80"\s+height="80"\s+viewBox="[^"]*"[^>]*>[\s\S]*?<\/svg>/;
const newSpinnerSvg = `<svg width="80" height="80" viewBox="0 0 512 512" aria-hidden="true">
      <image
        href="data:image/png;base64,${b64}"
        x="0" y="0" width="512" height="512" />
    </svg>`;
if (spinnerSvgRegex.test(previewHtml)) {
  previewHtml = previewHtml.replace(spinnerSvgRegex, newSpinnerSvg);
  fs.writeFileSync(path.join(root, 'branding/preview.html'), previewHtml, 'utf8');
  console.log('[OK] branding/preview.html spinner SVG updated');
} else {
  console.warn('[WARN] branding/preview.html: spinner SVG pattern not found, skipping');
}

// --- 5. branding/spinner.html - same treatment ---
let spinnerHtml = fs.readFileSync(path.join(root, 'branding/spinner.html'), 'utf8');
if (spinnerSvgRegex.test(spinnerHtml)) {
  spinnerHtml = spinnerHtml.replace(spinnerSvgRegex, newSpinnerSvg);
  fs.writeFileSync(path.join(root, 'branding/spinner.html'), spinnerHtml, 'utf8');
  console.log('[OK] branding/spinner.html spinner SVG updated');
} else {
  console.warn('[WARN] branding/spinner.html: spinner SVG pattern not found, skipping');
}

console.log('\nDone! All logos replaced with Zycord branding.');
