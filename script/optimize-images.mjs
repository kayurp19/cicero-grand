import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';

// Run with SHARP_MODULE pointing at an installed sharp package if not installed locally.
const require = createRequire(import.meta.url);
const sharp = require(process.env.SHARP_MODULE || 'sharp');
const root = 'client/public';
const files = await fs.readdir(path.join(root, 'photos'), { recursive: true });
const manifest = {};
for (const file of files.filter(f => /\.(?:jpg|jpeg)$/i.test(f))) {
  const relative = `/photos/${file}`;
  const input = path.join(root, relative);
  const { width, height } = await sharp(input).metadata();
  const variants = [];
  for (const w of [640, 960, 1600].filter(w => w <= width)) {
    const output = relative.replace(/\.jpe?g$/i, `-${w}w.webp`);
    await sharp(input).resize({ width: w, withoutEnlargement: true }).webp({ quality: 76, effort: 5 }).toFile(path.join(root, output));
    variants.push({ src: output, width: w });
  }
  manifest[relative] = { width, height, variants };
}
await fs.writeFile('shared/image-manifest.json', JSON.stringify(manifest, null, 2) + '\n');
// A tall mobile hero needs a portrait crop, not a small landscape enlarged to
// cover a phone-height section. Preserve the original photograph and focal center.
await sharp(path.join(root, 'photos/exterior-entrance.jpg'))
  .resize(480, 1080, { fit: 'cover', position: 'centre' })
  .webp({ quality: 82, effort: 5 })
  .toFile(path.join(root, 'photos/exterior-entrance-mobile.webp'));
console.log(`Optimized ${Object.keys(manifest).length} original photos without altering the originals.`);
