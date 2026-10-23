const fs = require('fs');

async function run() {
  const t = await fetch('https://discord.com/assets/web.2ae8383b003d87ae.js').then(r=>r.text());
  const regex = /["'`](\/assets\/[a-f0-9]{16,64}\.(?:png|svg|webp|gif))["'`]/g;
  const found = new Set();
  let m;
  while ((m = regex.exec(t)) !== null) {
    found.add(m[1]);
  }
  console.log('Found assets:', found.size);
  const arr = Array.from(found);
  console.log(arr.slice(0, 50));
}
run();
