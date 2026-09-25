import { build } from 'vite';
import { readdir, readFile, writeFile } from 'node:fs/promises';

// Preview-only: production retains clean routes and locally served photo assets.
process.env.VITE_PREVIEW = 'true';
await build({ base: './' });
const assetDir = 'dist/public/assets';
for (const file of await readdir(assetDir)) {
  if (!file.endsWith('.js')) continue;
  const path = `${assetDir}/${file}`;
  const original = await readFile(path, 'utf8');
  const modified = original.replace(/(["'`])\/(photos|brand|menus)\//g, '$1https://www.cicerogrand.com/$2/');
  await writeFile(path, modified);
}
