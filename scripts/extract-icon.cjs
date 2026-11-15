const fs = require('fs');
const txt = fs.readFileSync('public/branding/zycord-icon.svg', 'utf8');
const idx = txt.indexOf('base64,');
const end = txt.indexOf('"', idx);
const buf = Buffer.from(txt.substring(idx + 7, end), 'base64');
fs.writeFileSync('scripts/zycord-icon.png', buf);
console.log('Saved', buf.length);
