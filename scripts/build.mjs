import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { marked } from 'marked';
import { layout } from '../src/layout.mjs';

const root = new URL('../', import.meta.url);
const hero = await readFile(new URL('src/hero-preview.html', root), 'utf8');
const pages = [
  { route: '/', file: 'home.html', title: 'BLOW | 브랜드 블로그 자동 작성 프로그램', description: '글 작성부터 이미지 생성까지 BLOW가 도와드립니다. 브랜드에 맞춘 글과 이미지를 네이버에 임시저장하고, 검토 후 직접 발행하세요.' },
  { route: '/pricing/', file: 'pricing.html', title: '요금 안내 | BLOW', description: 'BLOW 30일 이용권의 가격과 이용 범위, 별도 API 비용 및 이용 문의를 확인하세요.' },
  { route: '/guide/', file: 'guide.html', title: '사용 가이드 | BLOW', description: '이용 문의, 설치·회원가입, 결제·승인부터 블로그 세팅과 첫 글의 임시저장까지. BLOW 사용 순서를 안내합니다.' },
  { route: '/download/', file: 'download.html', title: '다운로드 | BLOW', description: 'Windows 64비트용 BLOW 0.1.11 설치파일을 내려받고 사용 환경과 배포 안내를 확인하세요.' },
];
for (const page of pages) {
  const content = (await readFile(new URL('src/' + page.file, root), 'utf8')).replace('{{HERO}}', hero);
  const dir = new URL('dist' + page.route, root);
  await mkdir(dir, { recursive: true });
  await writeFile(new URL('index.html', dir), layout({ ...page, content }));
}
const policies = [
  ['terms', '이용약관', 'BLOW_이용약관_리뉴얼초안_v0.2.md'],
  ['privacy', '개인정보처리방침', 'BLOW_개인정보처리방침_리뉴얼초안_v0.2.md'],
  ['refund', '결제 및 환불 안내', 'BLOW_결제및환불안내_리뉴얼초안_v0.2.md'],
];
for (const [slug, title, file] of policies) {
  // Only trusted project Markdown is rendered; no visitor input is accepted.
  const markdown = await readFile(new URL('outputs/' + file, root), 'utf8');
  const content = '<div class="policy-shell shell"><a class="back-link" href="/">BLOW 홈 <span aria-hidden="true">↖</span></a><div class="policy-status"><strong>검토용 초안</strong><p>현재 시행 중인 정책이 아닙니다. 실제 운영 정보와 조건을 확정한 뒤 공개합니다.</p></div><article class="policy-prose">' + marked.parse(markdown) + '</article><a class="text-link" href="/#contact">정책 관련 이용 문의 <span aria-hidden="true">↗</span></a></div>';
  const dir = new URL('dist/' + slug + '/', root);
  await mkdir(dir, { recursive: true });
  await writeFile(new URL('index.html', dir), layout({ title: title + ' | BLOW', description: 'BLOW ' + title + ' 검토용 초안입니다.', route: '/' + slug + '/', policy: true, content }));
}
// Renewed pages remain a review draft, with example business details.
await writeFile(new URL('dist/robots.txt', root), 'User-agent: *\nDisallow: /\n');
console.log('Built ' + (pages.length + policies.length) + ' BLOW renewal pages (review draft, indexing disabled).');
if (process.argv.includes('--hero-preview')) {
  const previewDir = new URL('dist/preview/hero/', root);
  await mkdir(previewDir, { recursive: true });
  await writeFile(new URL('index.html', previewDir), layout({title:'BLOW 첫 화면 시안',description:'BLOW 첫 화면 디자인 시안입니다.',content:hero,route:'/preview/hero/',heroOnly:true}));
  console.log('Hero preview: http://127.0.0.1:4173/preview/hero/');
}
