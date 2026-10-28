import { build } from 'vite';
import { readdir, readFile, writeFile } from 'node:fs/promises';

// Preview-only: production retains clean routes and locally served photo assets.
process.env.VITE_PREVIEW = 'true';
const output = 'preview-dist';
await build({ base: './', build: { outDir: '../preview-dist' } });
const assetDir = `${output}/assets`;
for (const file of await readdir(assetDir)) {
  if (!file.endsWith('.js')) continue;
  const path = `${assetDir}/${file}`;
  const original = await readFile(path, 'utf8');
  const modified = original.replace(/(["'`])\/(photos|brand|menus)\//g, '$1./$2/');
  await writeFile(path, modified);
}
// Preview-only API routing. This sandbox server has no production mail setup
// or guest database. Never inject this bridge into the Railway build.
const htmlPath = `${output}/index.html`;
const html = await readFile(htmlPath, 'utf8');
await writeFile(htmlPath, html.replace('<head>', `<head>
<script>
(() => {
  const fetchOriginal = window.fetch.bind(window);
  const apiBase = "__PORT_5181__";
  window.fetch = (input, options) => {
    const path = typeof input === "string" ? input : null;
    return fetchOriginal(path && path.startsWith("/api/") ? apiBase + path : input, options);
  };
})();
</script>`));
