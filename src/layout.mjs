export function layout({ title, description, content, route = '/', policy = false, heroOnly = false }) {
  const current = path => route === path ? ' aria-current="page"' : '';
  const hasHero = route === '/' || heroOnly;
  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title><meta name="description" content="${description}">
<meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="#f9fcf9">
<link rel="icon" type="image/svg+xml" href="/assets/favicon.svg?v=surround">
<link rel="preload" href="/assets/fonts/Cafe24Ssurround-v2.0.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/hero-preview.css"><link rel="stylesheet" href="/assets/site.css">
<script src="/assets/site.js" type="module"></script>${hasHero ? '<script src="/assets/hero-preview.js" type="module"></script>' : ''}
</head>
<body class="${policy ? 'policy-page' : hasHero ? 'home-page' : 'inner-page'}">
<a class="skip-link" href="#main">본문으로 건너뛰기</a>
<header class="site-header"><div class="nav-shell">
<a class="wordmark" href="/" aria-label="BLOW 홈">blow<span>.</span></a>
<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="메뉴 열기"><span></span><span></span></button>
<nav id="site-nav" aria-label="주 메뉴"><a href="/#process">기능 소개</a><a href="/pricing/"${current('/pricing/')}>요금 안내</a><a href="/guide/"${current('/guide/')}>사용 가이드</a><a href="/download/"${current('/download/')}>다운로드</a><a class="nav-contact" href="/#contact">이용 문의 <span aria-hidden="true">↗</span></a></nav>
</div></header>
<main id="main" tabindex="-1">${content}</main>
${heroOnly ? '<footer class="preview-footer"><p>첫 화면 디자인 시안</p><span>© 2026 BLOW</span></footer>' : `<footer class="site-footer">
<div class="footer-top shell"><a class="wordmark" href="/" aria-label="BLOW 홈">blow<span>.</span></a><p>브랜드의 이야기를, 더 간편하게.</p><a class="footer-toplink" href="#main">맨 위로 <span aria-hidden="true">↑</span></a></div>
<div class="footer-bottom shell"><div class="footer-links"><a href="/guide/">사용 가이드</a><a href="/download/">다운로드</a><a href="/terms/">이용약관</a><a href="/privacy/">개인정보처리방침</a><a href="/refund/">결제 및 환불 안내</a></div><div class="footer-contact"><a href="tel:+821057681840">010-5768-1840</a><a href="mailto:mnwlsgus1005@gmail.com">mnwlsgus1005@gmail.com</a><span>© 2026 BLOW</span></div>
<p class="draft-note">BLOW는 이용 문의 후 결제와 운영자 승인을 거쳐 사용할 수 있습니다.</p></div>
</footer>`}
</body></html>`;
}
