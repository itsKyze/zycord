const fs = require('fs');
const path = require('path');

// Read the Zycord icon SVG and extract base64 PNG
const iconSvgPath = path.join(__dirname, '..', 'assets', 'public', 'branding', 'zycord_icon.svg');
const iconSvg = fs.readFileSync(iconSvgPath, 'utf8');
const b64match = iconSvg.match(/href="data:image\/png;base64,([^"]+)"/);
if (!b64match) {
    console.error('No base64 PNG found in zycord_icon.svg');
    process.exit(1);
}
const b64 = b64match[1];
console.log('Extracted Zycord icon base64, length:', b64.length);

// Create rendered-head.svg: Zycord icon on Discord dark background #313338
// Square 200x200 with icon centered and padded
const renderedHead = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#313338"/><image x="15" y="30" width="170" height="141" href="data:image/png;base64,${b64}" preserveAspectRatio="xMidYMid meet"/></svg>`;
fs.writeFileSync(path.join(__dirname, 'rendered-head.svg'), renderedHead);
console.log('Saved rendered-head.svg with Zycord branding');

// Create preview-svg.svg: same icon for use in the render pipeline
// (format compatible with existing render-svg.cjs expectations)
// We update preview-svg.svg to embed the Zycord icon directly
const previewSvg = `<svg width="80" height="80" viewBox="0 0 200 200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><image x="15" y="30" width="170" height="141" href="data:image/png;base64,${b64}" preserveAspectRatio="xMidYMid meet"/></svg>`;
fs.writeFileSync(path.join(__dirname, 'preview-svg.svg'), previewSvg);
console.log('Saved preview-svg.svg with Zycord branding');
