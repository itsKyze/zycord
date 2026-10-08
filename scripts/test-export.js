const fs = require('fs');
const c = fs.readFileSync('assets/cache/web.d3978f1210c00a8f.js', 'utf8');
const idx = c.indexOf('displayName="GatewayConnectionStore"');
const chunk = c.substring(Math.max(0, idx - 100000), idx);
const matches = [...chunk.matchAll(/[},](\d+)\(e,t,n\)\{/g)];
if (matches.length) {
    const last = matches[matches.length - 1];
    console.log('Module ID:', last[1]);
    console.log('Snippet:', chunk.substring(last.index, last.index + 200));
}
