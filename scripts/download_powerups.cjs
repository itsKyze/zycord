const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'assets', 'public', 'powerups');
fs.mkdirSync(targetDir, { recursive: true });

const assets = [
  {
    name: 'tag.png',
    url: 'https://cdn.discordapp.com/assets/content/478ce7fb9a64e4d6c4792c82d93f724c2aa0444ac2dfc3e2dfdf43dd11a39c79.png'
  },
  {
    name: 'tag_animated.png',
    url: 'https://cdn.discordapp.com/assets/content/f15f451050f67dd0fbb25bab5166d0ec9f1c9aa24a14a7f6652041de8c628163.png'
  },
  {
    name: 'roles.png',
    url: 'https://cdn.discordapp.com/assets/content/93c84331a5f11ba05946bce6fb4f85594d98cb52c8452e9b6869291da41cf62c.png'
  },
  {
    name: 'roles_animated.png',
    url: 'https://cdn.discordapp.com/assets/content/07ad706367af930589109e947258105fd0b8e1b97d1fccc4cbf1ec9905ffb4f1.png'
  },
  {
    name: 'flex.png',
    url: 'https://cdn.discordapp.com/assets/content/4e745042a2d8bfd0006d1040fc5a266bfb31ec9bbda28bd1651c2a48fb627642.png'
  },
  {
    name: 'flex_animated.png',
    url: 'https://cdn.discordapp.com/assets/content/20ed9f49e889cf2f2730613ab1a0724d12e8f4b84292c821b792768f0aba0ddc.png'
  },
  {
    name: 'pets.png',
    url: 'https://cdn.discordapp.com/assets/content/a42569e97ea3ec4ce43009ea59cb9514080bc1a7191bd6db2eb4a2076964107d.png'
  },
  {
    name: 'pets_animated.png',
    url: 'https://cdn.discordapp.com/assets/content/63a109888f688821d3b669dc296943149605988d13311777bedf4b260b80612b.png'
  },
  {
    name: 'plants.png',
    url: 'https://cdn.discordapp.com/assets/content/a586e274a51442be7a6088580bf17a03e681120c57830b702c71024535ec3163.png'
  },
  {
    name: 'crawlies.png',
    url: 'https://cdn.discordapp.com/assets/content/c174a191a551f359311ac49f7c3c344e7349ff82dd4f6f64ed5fbd355ff2a04f.png'
  },
  {
    name: 'invite.svg',
    url: 'https://cdn.discordapp.com/assets/content/804d87fc1c1330e6413159eaacc359de89bdfbec7b4602532b1bd074868783c8.svg'
  },
  {
    name: 'uploads.svg',
    url: 'https://cdn.discordapp.com/assets/content/25ad255d2f59df1823aa4ce609aafdb973421d70df2a3755c2a81d27bd608938.svg'
  },
  {
    name: 'theme.svg',
    url: 'https://cdn.discordapp.com/assets/content/c561ce5c9866c0bdb3f8c9dc43164f873414c3d905d1ab4beace8020dc4933fc.svg'
  }
];

async function downloadAll() {
  for (const item of assets) {
    const dest = path.join(targetDir, item.name);
    console.log(`Downloading ${item.name} from ${item.url}...`);
    const res = await fetch(item.url);
    if (!res.ok) {
      console.error(`Failed to download ${item.name}: ${res.status}`);
      continue;
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buffer);
    console.log(`Saved ${item.name} (${(buffer.length / 1024).toFixed(1)} KB)`);
  }

  // Create tag.svg and roles.svg embedding the official Discord PNGs
  const tagB64 = fs.readFileSync(path.join(targetDir, 'tag.png')).toString('base64');
  fs.writeFileSync(
    path.join(targetDir, 'tag.svg'),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 288 162" width="288" height="162"><image href="data:image/png;base64,${tagB64}" width="288" height="162"/></svg>`
  );
  console.log('Saved tag.svg with official Discord artwork');

  const rolesB64 = fs.readFileSync(path.join(targetDir, 'roles.png')).toString('base64');
  fs.writeFileSync(
    path.join(targetDir, 'roles.svg'),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 288 162" width="288" height="162"><image href="data:image/png;base64,${rolesB64}" width="288" height="162"/></svg>`
  );
  console.log('Saved roles.svg with official Discord artwork');
}

downloadAll();

