export function layout({ title, description, content, route = '/', policy = false }) {
  const current = path => route === path ? ' aria-current="page"' : '';
  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title><meta name="description" content="${description}">
<meta name="robots" content="index,follow"><meta name="theme-color" content="#121212">
<link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
<link rel="preload" href="/assets/fonts/Cafe24Simplehae-v2.0.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/site.css"><script src="/assets/site.js" type="module"></script>
</head>
<body class="${policy ? 'policy-page' : route === '/' ? 'home-page' : 'inner-page'}">
<a class="skip-link" href="#main">본문으로 건너뛰기</a>
<header class="site-header"><div class="nav-shell">
<a class="wordmark" href="/" aria-label="BLOW 홈">blow<span>.</span></a>
<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="메뉴 열기"><span></span><span></span></button>
<nav id="site-nav" aria-label="주 메뉴"><a href="/" ${current('/')}>홈</a><a href="/#process">기능 소개</a><a href="/#pricing">비공개 베타</a><a href="/guide/"${current('/guide/')}>사용 가이드</a><a href="/download/"${current('/download/')}>다운로드</a><a class="nav-contact" href="/#contact">이용 문의</a></nav>
</div></header>
<main id="main" tabindex="-1">${content}</main>
<footer class="site-footer shell"><div class="footer-links"><span>© 2026 BLOW</span><a href="/guide/">사용 가이드</a><a href="/download/">다운로드</a><a href="/terms/">이용약관</a><a href="/privacy/">개인정보처리방침</a><a href="/refund/">비공개 베타 안내</a></div><p>개인 운영자 장현진 · <a href="mailto:mnwlsgus1005@gmail.com">mnwlsgus1005@gmail.com</a> · <a href="tel:+821057681840">010-5768-1840</a></p></footer>
</body></html>`;
}
