const contactWidget = `<details class="floating-contact">
  <summary id="contact" class="contact-launcher" aria-controls="contact-picker">
    <svg class="launcher-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M20 11.5a8 8 0 0 1-8 8H5l-3 2v-10a9 9 0 0 1 18 0Z"/><path d="M7 11h10M7 15h6"/></svg>
    <svg class="launcher-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>
    <span class="launcher-label">이용 문의</span><span class="launcher-close-label">문의 닫기</span>
  </summary>
  <section class="contact-picker" id="contact-picker" aria-labelledby="contact-picker-title">
    <div class="contact-picker-heading"><span class="contact-picker-brand" aria-hidden="true">blow<span>.</span></span><h2 id="contact-picker-title">편한 방법으로<br>문의해주세요.</h2><p>365일 오전 10시–오후 6시 · 한국 시간</p></div>
    <div class="contact-channels">
      <a class="contact-channel" href="tel:+821057681840"><span class="contact-channel-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m7 3 3 5-2 2a14 14 0 0 0 6 6l2-2 5 3v2a2 2 0 0 1-2 2C10 21 3 14 3 5a2 2 0 0 1 2-2Z"/></svg></span><span class="contact-channel-text"><strong>전화 문의</strong><span>010-5768-1840</span></span><span class="contact-channel-arrow" aria-hidden="true">↗</span></a>
      <a class="contact-channel" href="mailto:mnwlsgus1005@gmail.com?subject=BLOW%20이용%20문의"><span class="contact-channel-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/></svg></span><span class="contact-channel-text"><strong>이메일 문의</strong><span>mnwlsgus1005@gmail.com</span></span><span class="contact-channel-arrow" aria-hidden="true">↗</span></a>
      <a class="contact-channel contact-channel-kakao" href="https://open.kakao.com/o/smOiIaOi" target="_blank" rel="noopener noreferrer"><span class="contact-channel-icon"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3C6.5 3 2 6.4 2 10.7c0 2.8 1.9 5.3 4.8 6.6l-.9 3.4a.4.4 0 0 0 .6.4l4-2.8 1.5.1c5.5 0 10-3.4 10-7.7S17.5 3 12 3Z"/></svg></span><span class="contact-channel-text"><strong>카카오톡 문의</strong><span>오픈채팅으로 연결<span class="sr-only"> · 새 탭에서 열기</span></span></span><span class="contact-channel-arrow" aria-hidden="true">↗</span></a>
    </div>
    <p class="contact-picker-note">설치와 이용 방법을 안내해드립니다.</p>
  </section>
</details>`;

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
<nav id="site-nav" aria-label="주 메뉴"><a href="/#process">기능 소개</a><a href="/pricing/"${current('/pricing/')}>요금 안내</a><a href="/guide/"${current('/guide/')}>사용 가이드</a><a href="/download/"${current('/download/')}>다운로드</a><a class="nav-contact" href="#contact" data-contact-open aria-controls="contact-picker">이용 문의 <span aria-hidden="true">↗</span></a></nav>
</div></header>
<main id="main" tabindex="-1">${content}</main>
${heroOnly ? '<footer class="preview-footer"><p>첫 화면 디자인 시안</p><span>© 2026 BLOW</span></footer>' : `<footer class="site-footer">
<div class="footer-top shell"><a class="wordmark" href="/" aria-label="BLOW 홈">blow<span>.</span></a><p>브랜드의 이야기를, 더 간편하게.</p><a class="footer-toplink" href="#main">맨 위로 <span aria-hidden="true">↑</span></a></div>
<div class="footer-bottom shell"><div class="footer-links"><a href="/guide/">사용 가이드</a><a href="/download/">다운로드</a><a href="/terms/">이용약관</a><a href="/privacy/">개인정보처리방침</a><a href="/refund/">결제 및 환불 안내</a></div><div class="footer-contact"><a href="tel:+821057681840">010-5768-1840</a><a href="mailto:mnwlsgus1005@gmail.com">mnwlsgus1005@gmail.com</a><span>© 2026 BLOW</span></div>
<p class="draft-note">BLOW는 이용 문의 후 결제와 운영자 승인을 거쳐 사용할 수 있습니다.</p></div>
</footer>`}
${contactWidget}
</body></html>`;
}
