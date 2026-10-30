import { readdir, mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { gunzipSync } from 'node:zlib';
async function restore(dir = 'game-packed', prefix = '') {
 for (const entry of await readdir(dir, { withFileTypes: true })) {
  const relative = join(prefix, entry.name);
  if (entry.isDirectory()) await restore(join(dir, entry.name), relative);
  else {
   const target = join('public/drainmaster-game', relative.slice(0, -3));
   await mkdir(dirname(target), { recursive: true });
   await writeFile(target, gunzipSync(await readFile(join(dir, entry.name))));
  }
 }
}
await restore();
