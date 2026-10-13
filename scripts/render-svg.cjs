const fs = require('fs');
const head = fs.readFileSync('scripts/preview-svg.svg', 'utf8').match(/d="([^"]+)"/)[1];
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24"><rect width="24" height="24" fill="#313338"/><path fill="#ffffff" fill-rule="evenodd" d="${head}"/></svg>`;
fs.writeFileSync('scripts/rendered-head.svg', svg);
console.log('Saved rendered-head.svg');
