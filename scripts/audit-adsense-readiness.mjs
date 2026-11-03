import { readFile, readdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const origin = new URL(process.env.SITE_URL).origin;
const primary = 'https://waraqa-tools-om.pages.dev';
const mirror = 'https://waraqa-3ml.pages.dev';
if (![primary, mirror].includes(origin)) throw new Error('Unexpected SITE_URL: ' + origin);
const read = name => readFile(dist + name, 'utf8');
const homepage = await read('index.html');
const ads = (await read('ads.txt')).trim();
const robots = await read('robots.txt');
const xml = await read('sitemap.xml');
const errors = [];
const check = (condition, message) => { if (!condition) errors.push(message); };
check(ads === 'google.com, pub-5086201923236113, DIRECT, f08c47fec0942fa0', 'Publisher ads.txt is incorrect');
check(homepage.includes('ca-pub-5086201923236113'), 'AdSense publisher verification missing from homepage');
const urls = [...xml.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g)].map(m => m[1]);
check(urls.length === 11, 'Unexpected sitemap URL count: ' + urls.length);
check(new Set(urls).size === urls.length, 'Duplicate sitemap URLs');
for (const value of urls) {
  const url = new URL(value);
  check(url.origin === origin, 'Off-domain sitemap URL: ' + value);
  const name = decodeURIComponent(url.pathname).slice(1) || 'index.html';
  if (name.includes('..')) { errors.push('Unsafe sitemap path: ' + value); continue; }
  try { check((await stat(dist + name)).isFile(), 'Sitemap target missing: ' + value); }
  catch { errors.push('Sitemap target missing: ' + value); }
}
for (const name of (await readdir(dist)).filter(x => /\.(html|xml|txt)$/.test(x))) {
  const text = await read(name);
  check(!text.includes('guileless-mooncake-864279.netlify.app'), 'Old Netlify URL remains in: ' + name);
  for (const m of text.matchAll(/(?:ca-)?pub-(\d{16})/g)) {
    check(m[1] === '5086201923236113', 'Other publisher ID in: ' + name);
  }
}
if (origin === primary) {
  check(homepage.includes('href="' + primary + '/"'), 'Primary canonical homepage URL missing');
  check(robots.includes(primary + '/sitemap.xml'), 'Primary robots.txt sitemap is incorrect');
} else {
  const redirects = await read('_redirects');
  check(redirects.includes('/* ' + primary + '/:splat 301'), 'Missing permanent redirect to primary');
  check(robots.includes('Disallow: /'), 'Secondary project must not be indexed');
}
if (errors.length) {
  for (const e of errors) console.error('FAIL: ' + e);
  process.exitCode = 1;
} else {
  console.log('PASS: ' + origin + ', sitemap routes: ' + urls.length + ', ads.txt and canonical/mirror rules verified');
}
