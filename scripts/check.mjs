import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

const routes = ['/', '/guide/', '/download/', '/terms/', '/privacy/', '/refund/'];
const pages = new Map();
for (const route of routes) {
  const html = await readFile(join('dist', route, 'index.html'), 'utf8');
  assert.equal((html.match(/<h1\b/g) || []).length, 1, route + ': exactly one H1');
  assert(html.includes('lang="ko"'), route + ': Korean language');
  assert(html.includes('index,follow'), route + ': public page must be indexable');
  assert(!html.includes('noindex,nofollow'), route + ': no draft noindex metadata');
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
for (const text of ['비공개 베타', '장현진', 'mnwlsgus1005@gmail.com', '010-5768-1840', '마케팅·뉴스레터 이메일 발송 없음', 'OpenAI API 이용료는 별도', '최종 발행은 직접']) {
  assert(home.includes(text), 'home: missing ' + text);
}
for (const text of ['42,900', '39,000', '3,900', '사업자등록번호']) {
  assert(!home.includes(text), 'home: must not advertise ' + text);
}
assert(!/<h[1-6][^>]*>[^<]*(FAQ|경쟁사)/i.test(home));
assert(pages.get('/download/').includes('disabled>공개 다운로드 준비 중'));
assert(!/href="[^"]+\.(exe|msi|zip)"/.test(pages.get('/download/')));
for (const route of ['/terms/', '/privacy/', '/refund/']) {
  const html = pages.get(route);
  assert(html.includes('정책 문서 · 시행 중'), route + ': active policy status');
  assert(html.includes('장현진'), route + ': operator disclosure');
  for (const marker of ['검토용 초안', '공개용 최종본 아님', '[미정]']) {
    assert(!html.includes(marker), route + ': draft marker ' + marker);
  }
  assert(!/\b\d{3}-\d{2}-\d{5}\b/.test(html), route + ': no invented business registration number');
}
const privacy = pages.get('/privacy/');
for (const provider of ['Supabase', 'Amazon Web Services', 'Vercel', 'OpenAI', 'NAVER']) assert(privacy.includes(provider), 'privacy: missing ' + provider);
const robots = await readFile(join('dist', 'robots.txt'), 'utf8');
assert.equal(robots, 'User-agent: *\nAllow: /\n');
console.log('PASS: 6 public routes, links, assets, policy disclosures, beta sales guardrails and safe download state.');
