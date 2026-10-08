const fs = require('fs');
const path = require('path');
const html = fs.readFileSync('assets/cache/index.html', 'utf8');
const entry = Array.from(html.matchAll(/src="\/assets\/([\w.-]+\.js)"/g)).map(m => m[1]);
console.log('Entry files:', entry);

const anchors = [
    { name: 'webpack chunk global', pattern: /webpackChunkdiscord_app/ },
    { name: 'Flux dispatcher interceptors', pattern: /addInterceptor\(\w+\)\{/ },
    { name: 'Flux dispatcher subscribe', pattern: /subscribe\(\w+,\w+\)\{/ },
    { name: 'gateway dispatch handler slot', pattern: /getDispatchHandler=null/ },
    { name: 'gateway preload before flush', pattern: /getDispatchHandler\(\w+\.type\)\?\.preload\(\w+\.data\)/ },
    { name: 'gateway store getSocket', pattern: /getSocket\(\)\{return \w+\}isTryingToConnect\(\)\{/ },
    { name: 'MESSAGE_CREATE preload handler', pattern: /\(\["MESSAGE_CREATE"\],\w+=>/ },
    { name: 'HTTP client methods', pattern: /=\{get:\w+,post:\w+,put:\w+,patch:\w+,del:\w+\}/ },
    { name: 'HTTP callback with response', pattern: /\{hasErr:!1,\.\.\.\w+\}/ },
    { name: 'message queue posts through HTTP client', pattern: /\.Bo\.post\(\{url:\w+\.\w+\.MESSAGES\(\w+\),body:\w+/ },
    { name: 'message queue edits through HTTP client', pattern: /\.Bo\.patch\(\w+,\w+\)/ },
    { name: 'message content element id', pattern: /message-content-/ },
];

for (const a of anchors) {
    let found = null;
    for (const f of entry) {
        const s = fs.readFileSync(path.join('assets/cache', f), 'utf8');
        if (a.pattern.test(s)) { found = f; break; }
    }
    console.log((found ? 'FOUND:   ' : 'MISSING: ') + a.name + (found ? ' in ' + found : ''));
}
