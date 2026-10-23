import { cp, readdir, readFile, writeFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const configured = process.env.SITE_URL || process.env.CF_PAGES_URL;
if (!configured) throw new Error('Set SITE_URL or build inside Cloudflare Pages.');
const site = new URL(configured);
if (site.protocol !== 'https:') throw new Error('SITE_URL must use HTTPS.');
// Cloudflare provides a deployment URL; canonical URLs use the stable project hostname.
if (!process.env.SITE_URL && site.hostname.endsWith('.pages.dev')) {
  site.hostname = site.hostname.split('.').slice(-3).join('.');
}
const origin = site.origin;
await rm(root + 'dist', { recursive: true, force: true });
await cp(root + 'public', root + 'dist', { recursive: true });
for (const name of await readdir(root + 'dist')) {
  if (!/\.(html|xml|txt)$/.test(name)) continue;
  const path = root + 'dist/' + name;
  const text = await readFile(path, 'utf8');
  await writeFile(path, text.replaceAll('https://guileless-mooncake-864279.netlify.app', origin));
}
if (process.env.CF_PAGES_BRANCH && process.env.CF_PAGES_BRANCH !== 'main') {
  await writeFile(root + 'dist/_headers', '/*\n  X-Robots-Tag: noindex\n');
  await writeFile(root + 'dist/robots.txt', 'User-agent: *\nDisallow: /\n');
}
console.log('Built dist with canonical origin: ' + origin);
