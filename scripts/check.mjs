import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

const routes = ['/', '/guide/', '/download/', '/terms/', '/privacy/', '/refund/'];
const pages = new Map();
for (const route of routes) {
  const html = await readFile(join('dist', route, 'index.html'), 'utf8');
  assert.equal((html.match(/<h1\b/g) || []).length, 1, route + ': exactly one H1');
  assert(html.includes('lang="ko"'), route + ': Korean language');
  assert(html.includes('noindex,nofollow'), route + ': draft preview must not be indexed');
  assert(!html.includes('undefined'), route + ': no missing template values');
  pages.set(route, html);
}
for (const [route, html] of pages) {
  for (const [, attr, raw] of html.matchAll(/\b(href|src)="([^"]+)"/g)) {
    if (/^(https?:|tel:|mailto:|data:)/.test(raw)) continue;
    const url = new URL(raw.replaceAll('&amp;', '&'), 'https://example.test' + route);
    if (pages.has(url.pathname)) {
      if (url.hash) assert(pages.get(url.pathname).includes('id="' + url.hash.slice(1) + '"'), route + ': missing anchor ' + raw);
    } else {
      assert((await stat(join('dist', url.pathname))).isFile(), route + ': missing ' + attr + ' ' + raw);
    }
  }
}
const home = pages.get('/');
for (const text of ['42,900', '39,000', '3,900', '010-5768-1840', 'OpenAI API 이용료는 별도', '최종 발행은 직접']) assert(home.includes(text), text);
assert(!/<h[1-6][^>]*>[^<]*(FAQ|경쟁사)/i.test(home));
assert(pages.get('/download/').includes('disabled>설치파일 준비 중'));
assert(!/href="[^"]+\.(exe|msi|zip)"/.test(pages.get('/download/')));
for (const route of ['/terms/', '/privacy/', '/refund/']) assert(pages.get(route).includes('공개용 최종본 아님'));
assert.equal(39000 * 1.1, 42900);
assert.equal(42900 / 30 * 20, 28600);
console.log('PASS: 6 routes, assets and anchors, Korean metadata, draft status, price math, safe download state.');
