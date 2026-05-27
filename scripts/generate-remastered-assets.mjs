import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const outDir = path.join(root, 'public/assets/remastered');
const characterSheet = path.join(root, '릴리스 카인 컨셉아트.png');
const weaponSheet = path.join(root, '무기 패시브 디자인.png');

const characters = [
  { name: 'lilith-player', source: characterSheet, crop: { left: 54, top: 232, width: 132, height: 146 }, size: { width: 214, height: 238 }, matte: true },
  { name: 'cain-player', source: characterSheet, crop: { left: 210, top: 232, width: 128, height: 146 }, size: { width: 208, height: 238 }, matte: true },
  { name: 'lilith-portrait', source: characterSheet, crop: { left: 54, top: 232, width: 132, height: 146 }, size: { width: 174, height: 194 }, matte: true },
  { name: 'cain-portrait', source: characterSheet, crop: { left: 210, top: 232, width: 128, height: 146 }, size: { width: 170, height: 194 }, matte: true },
];

const icons = [
  ['weapon-dark_orb', 350, 314],
  ['weapon-bat_swarm', 42, 314],
  ['weapon-lightning_book', 808, 138],
  ['weapon-death_scythe', 1114, 138],
  ['weapon-cursed_garlic', 500, 138],
  ['weapon-ice_crystal', 806, 314],
  ['weapon-holy_water', 196, 492],
  ['weapon-ghost_candle', 1112, 314],
  ['passive-grimoire', 654, 138],
  ['passive-black_heart', 42, 492],
  ['passive-clock', 654, 666],
  ['passive-candelabra', 500, 314],
  ['passive-bat_wings', 1264, 666],
  ['passive-iron_cross', 502, 492],
  ['passive-blood_chalice', 196, 492],
  ['passive-golden_crown', 1418, 492],
].map(([name, left, top]) => ({
  name,
  source: weaponSheet,
  crop: { left, top, width: 76, height: 76 },
  size: { width: 152, height: 152 },
  matte: false,
}));

await fs.mkdir(outDir, { recursive: true });

for (const asset of [...characters, ...icons]) {
  const output = path.join(outDir, `${asset.name}.png`);
  let image = sharp(asset.source)
    .extract(asset.crop)
    .resize(asset.size.width, asset.size.height, {
      kernel: sharp.kernel.lanczos3,
      fit: 'fill',
    })
    .modulate({ saturation: 1.08, brightness: 1.03 })
    .sharpen({ sigma: 0.9, m1: 0.6, m2: 1.8 });

  if (asset.matte) {
    const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    removeConnectedBackdrop(data, info.width, info.height, info.channels);
    await sharp(data, { raw: info }).png().toFile(output);
  } else {
    await image.png().toFile(output);
  }
}

console.log(`Generated ${characters.length + icons.length} remastered assets in ${outDir}`);

function removeConnectedBackdrop(data, width, height, channels) {
  const visited = new Uint8Array(width * height);
  const queue = [];

  const enqueue = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const index = y * width + x;
    if (visited[index]) return;
    if (!isBackdropPixel(data, index * channels)) return;
    visited[index] = 1;
    queue.push(index);
  };

  for (let x = 0; x < width; x++) {
    enqueue(x, 0);
    enqueue(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    enqueue(0, y);
    enqueue(width - 1, y);
  }

  for (let head = 0; head < queue.length; head++) {
    const index = queue[head];
    const x = index % width;
    const y = Math.floor(index / width);
    enqueue(x + 1, y);
    enqueue(x - 1, y);
    enqueue(x, y + 1);
    enqueue(x, y - 1);
  }

  for (let index = 0; index < visited.length; index++) {
    if (!visited[index]) continue;
    const offset = index * channels;
    data[offset + 3] = 0;
  }
}

function isBackdropPixel(data, offset) {
  const r = data[offset];
  const g = data[offset + 1];
  const b = data[offset + 2];
  const max = Math.max(r, g, b);
  const redBias = r > g * 1.1 && r > b * 0.9;
  return max < 28 || (max < 76 && redBias) || (r < 46 && g < 42 && b < 52);
}
