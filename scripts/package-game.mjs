import { readdir, readFile, writeFile, unlink } from 'node:fs/promises';
import { join } from 'node:path';
const base = 'dist/drainmaster-game';
const files = {};
for (const name of await readdir(base)) {
 if (!name.endsWith('.wasm')) continue;
 const data = await readFile(join(base, name));
 if (data.length <= 25 * 1024 * 1024) continue;
 files[name] = [];
 for (let offset = 0, index = 0; offset < data.length; offset += 16 * 1024 * 1024, index++) {
  const part = `${name}.part-${index}`;
  await writeFile(join(base, part), data.subarray(offset, offset + 16 * 1024 * 1024));
  files[name].push(part);
 }
 await unlink(join(base, name));
}
await writeFile(join(base, 'hosting-loader.js'), `(() => {
 const root = new URL('.', document.currentScript.src);
 const parts = ${JSON.stringify(files)};
 const nativeFetch = window.fetch.bind(window);
 window.fetch = async (input, init) => {
  const url = new URL(input instanceof Request ? input.url : input, document.baseURI);
  const name = decodeURIComponent(url.pathname.slice(root.pathname.length));
  if (url.origin !== root.origin || !url.pathname.startsWith(root.pathname) || !parts[name]) return nativeFetch(input, init);
  const buffers = await Promise.all(parts[name].map(async part => {
   const response = await nativeFetch(new URL(part, root), init);
   if (!response.ok) throw new Error('Falha ao carregar o motor do jogo: ' + response.status);
   return response.arrayBuffer();
  }));
  return new Response(new Blob(buffers, { type: 'application/wasm' }), {
   status: 200, headers: { 'Content-Type': 'application/wasm', 'Content-Length': String(buffers.reduce((sum, b) => sum + b.byteLength, 0)) }
  });
 };
})();\n`);
for (const name of await readdir(base)) {
 if (!name.endsWith('.html')) continue;
 const path = join(base, name);
 await writeFile(path, (await readFile(path, 'utf8')).replace('<head>', '<head>\n\t\t<script src="hosting-loader.js"></script>'));
}
