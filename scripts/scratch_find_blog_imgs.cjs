const fs = require('fs');

async function run() {
  const url = 'https://discord.com/blog/get-more-from-your-boosts-with-new-server-perks';
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const html = await res.text();
  const imgs = html.match(/https:\/\/[^\s"'<>]+(?:\.png|\.svg|\.webp|\.gif|\.jpg|\.avif)/g) || [];
  console.log('All images:', [...new Set(imgs)]);
}
run();
