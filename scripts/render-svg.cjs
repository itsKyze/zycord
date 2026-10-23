const fs = require('fs');
const path = require('path');

// Read Zycord icon and embed it in rendered-head.svg
const iconSvg = fs.readFileSync(path.join(__dirname, '..', 'assets', 'public', 'branding', 'zycord_icon.svg'), 'utf8');
const b64match = iconSvg.match(/href="data:image\/png;base64,([^"]+)"/);
if (!b64match) { console.error('Zycord icon base64 not found'); process.exit(1); }
const b64 = b64match[1];

// rendered-head.svg: Zycord icon on dark #313338 background (200x200)
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#313338"/><image x="15" y="30" width="170" height="141" href="data:image/png;base64,${b64}" preserveAspectRatio="xMidYMid meet"/></svg>`;
fs.writeFileSync(path.join(__dirname, 'rendered-head.svg'), svg);
console.log('Saved rendered-head.svg with Zycord icon');
