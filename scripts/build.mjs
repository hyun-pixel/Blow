import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { marked } from 'marked';
import { layout } from '../src/layout.mjs';

const root = new URL('../', import.meta.url);
const pages = [
  { route: '/', file: 'home.html', title: 'BLOW — 브랜드 블로그 자동 작성 프로그램', description: '브랜드 정보와 주제를 입력하면 글과 이미지를 생성하고 네이버에 임시저장합니다. 검토 후 직접 발행하는 Windows용 브랜드 블로그 자동 작성 프로그램 BLOW.' },
  { route: '/guide/', file: 'guide.html', title: '사용 가이드 — BLOW', description: '상담, 설치·가입, 결제, 관리자 승인부터 첫 번째 네이버 임시글까지. BLOW 시작 순서를 안내합니다.' },
  { route: '/download/', file: 'download.html', title: '다운로드 — BLOW', description: 'Windows용 BLOW 설치파일과 이용 환경을 안내합니다. 프로그램 사용은 결제 및 관리자 승인 후 가능합니다.' },
];
for (const page of pages) {
  const content = await readFile(new URL('src/' + page.file, root), 'utf8');
  const dir = new URL('dist' + page.route, root);
  await mkdir(dir, { recursive: true });
  await writeFile(new URL('index.html', dir), layout({ ...page, content }));
}
const policies = [
  ['terms', '이용약관', 'BLOW_이용약관_v1.0.md'],
  ['privacy', '개인정보처리방침', 'BLOW_개인정보처리방침_v1.0.md'],
  ['refund', '비공개 베타 운영 안내', 'BLOW_베타운영안내_v1.0.md'],
];
for (const [slug, title, file] of policies) {
  // These documents are trusted project sources, never visitor-provided Markdown.
  const markdown = await readFile(new URL('outputs/' + file, root), 'utf8');
  const content = '<section class="policy-shell"><div class="policy-status"><span>정책 문서 · 시행 중</span><span>시행일 2026년 9월 23일</span></div><article class="policy-prose">' + marked.parse(markdown) + '</article></section>';
  const dir = new URL('dist/' + slug + '/', root);
  await mkdir(dir, { recursive: true });
  await writeFile(new URL('index.html', dir), layout({ title: title + ' — BLOW', description: 'BLOW ' + title + '입니다.', route: '/' + slug + '/', policy: true, content }));
}
await writeFile(new URL('dist/robots.txt', root), 'User-agent: *\nAllow: /\n');
console.log('Built 6 public BLOW pages.');
