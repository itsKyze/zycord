const fs = require('fs');

async function run() {
  const t = await fetch('https://discord.com/assets/web.2ae8383b003d87ae.js').then(r=>r.text());
  const regex = /([a-f0-9]{16,64}\.(?:png|svg|webp|gif))/g;
  const matches = [...new Set(t.match(regex) || [])];
  
  const keywords = ['vanity', 'invite', 'theme', 'upload', 'file', 'perk', 'powerup', 'boost', 'role', 'badge'];
  const relevant = [];

  for (const m of matches) {
    let idx = 0;
    while ((idx = t.indexOf(m, idx)) !== -1) {
      const surrounding = t.substring(Math.max(0, idx - 150), Math.min(t.length, idx + 150)).toLowerCase();
      for (const kw of keywords) {
        if (surrounding.includes(kw)) {
          relevant.push({ asset: m, keyword: kw, snippet: surrounding.replace(/\s+/g, ' ') });
          break;
        }
      }
      idx += m.length;
    }
  }

  console.log('Found relevant assets:', relevant.length);
  for (const r of relevant) {
    console.log(`[${r.keyword}] ${r.asset} -> ${r.snippet.slice(0, 100)}...`);
  }
}
run();
