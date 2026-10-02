import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

const routes = ['/', '/pricing/', '/guide/', '/download/', '/terms/', '/privacy/', '/refund/'];
const pages = new Map();
for (const route of routes) {
  const html = await readFile(join('dist', route, 'index.html'), 'utf8');
  assert.equal((html.match(/<h1\b/g) || []).length, 1, route + ': exactly one H1');
  assert(html.includes('lang="ko"'), route + ': Korean language');
  assert(html.includes('content="noindex,nofollow"'), route + ': review draft must not be indexed');
  assert(html.includes('Cafe24Ssurround-v2.0.woff2'), route + ': approved font');
  assert(!html.includes('undefined') && !html.includes('{{HERO}}'), route + ': no unresolved values');
  if (route === '/terms/') assert(html.includes('예시 사업자 정보 · 실제 사업자 정보가 아닙니다.'), route + ': sample disclosure');
  else assert(!html.includes('000-00-00000'), route + ': example details belong only in draft terms');
  assert(html.includes('정식 판매는 준비 중이며, 설치파일은 테스트용으로 제공합니다.'), route + ': draft sales status');
  for (const number of html.match(/\b\d{3}-\d{2}-\d{5}\b/g) || []) {
    assert.equal(number,'000-00-00000',route + ': no plausible fabricated registration number');
  }
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
for (const text of ['글 작성부터','이미지 생성까지','BLOW가 도와드립니다.','010-5768-1840','mnwlsgus1005@gmail.com','최종 발행은 사용자가 직접']) {
  assert(home.includes(text),'home: missing '+text);
}
const pricing = pages.get('/pricing/');
for (const text of ['42,900','39,000','3,900','30일','OpenAI API 이용료는 별도']) assert(pricing.includes(text), 'pricing: missing ' + text);
assert(!/id="(?:pricing|start)"/.test(home), 'home: price and onboarding sections belong in dedicated pages');
assert(pricing.includes('href="/#contact"'), 'pricing: inquiry returns to the home contact section');
for (const [route, html] of pages) assert(html.includes('href="/pricing/"'), route + ': dedicated pricing navigation');
assert(!/<h[1-6][^>]*>[^<]*(FAQ|경쟁사)/i.test(home));
const download = pages.get('/download/');
const installerUrl = 'https://github.com/hyun-pixel/Blow/releases/download/desktop-v0.1.11-test.1/BLOW-Setup-0.1.11-x64.exe';
for (const text of ['테스트용 다운로드','BLOW-Setup-0.1.11-x64.exe','117.3MB','게시자 전자 서명 없음']) assert(download.includes(text),'download: missing '+text);
assert(download.includes('href="' + installerUrl + '" aria-describedby="download-notice"'),'download: approved public installer with test notice');
assert(!download.includes('공개 다운로드 준비 중'),'download: no stale availability notice');
for (const [route, html] of pages) {
  const fileLinks = [...html.matchAll(/href="([^"]+\.(?:exe|msi|zip))"/gi)].map(match=>match[1]);
  assert.deepEqual(fileLinks,route === '/download/' ? [installerUrl] : [],route + ': only the approved installer link');
}
for (const route of ['/terms/','/privacy/','/refund/']) {
  const html=pages.get(route);
  assert(html.includes('검토용 초안') && html.includes('현재 시행 중인 정책이 아닙니다.'),route+': draft policy status');
  assert(!html.includes('정책 문서 · 시행 중'),route+': do not claim draft is effective');
}
for (const text of ['블로그 세팅','비밀번호 찾기','관리자 승인','개인 OpenAI API']) assert(pages.get('/guide/').includes(text),'guide: '+text);
assert.equal(await readFile('dist/robots.txt','utf8'),'User-agent: *\nDisallow: /\n');
const hero = await readFile('src/hero-preview.html','utf8');
assert(home.includes(hero.trim()),'home reuses approved hero without duplicating it');
for (const selector of ['hero-footnote','demo-topline','demo-control','demo-caption','demo-status']) {
  assert(!hero.includes(selector), 'hero: removed strip must stay removed: ' + selector);
}
assert(hero.includes('aria-describedby="demo-summary"'), 'hero: animation has an accessible description');
for (const file of ['cursor-arrow.svg','cursor-link.svg']) {
  assert((await stat(join('dist/assets', file))).isFile(), 'cursor: missing ' + file);
}
console.log('PASS: 7 renewal routes, links/assets, pricing, guide, draft policies, example disclosure and public test download.');
