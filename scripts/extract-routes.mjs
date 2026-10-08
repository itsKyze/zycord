import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CACHE_PATH = join(__dirname, '..', 'assets', 'cache');

const html = readFileSync(join(CACHE_PATH, 'index.html'), 'utf8');
const entryMatch = html.match(/src="\/assets\/(web\.[0-9a-f]+\.js)"/);
const entry = entryMatch?.[1];
console.log('Entry file:', entry);
if (!entry) process.exit(1);

const source = readFileSync(join(CACHE_PATH, entry), 'utf8');
const needle = 'Object.freeze({INDEX:"/",';
const start = source.indexOf(needle);
console.log('Routes object start:', start);
if (start === -1) process.exit(1);

let depth = 0, end = start;
for (let i = source.indexOf('{', start); i < source.length; i++) {
    if (source[i] === '{') depth++;
    else if (source[i] === '}' && !--depth) { end = i; break; }
}
const chunk = source.slice(start, end + 1);
console.log('\n--- ROUTES OBJECT ---');
console.log(chunk);
console.log('\n--- PARSED ROUTES ---');

const routes = [];
for (const [, val] of chunk.matchAll(/[`"](\/[^`"]*)[`"]/g)) {
    if (val.startsWith('/') && !routes.includes(val)) routes.push(val);
}
routes.sort();
for (const r of routes) console.log(r);
