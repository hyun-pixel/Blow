const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');
function closeMenu() {
  nav?.classList.remove('is-open');
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', '메뉴 열기');
}
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
  nav.classList.toggle('is-open', open);
});
nav?.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav?.classList.contains('is-open')) { closeMenu(); menuButton.focus(); }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) closeMenu();
});
matchMedia('(min-width: 768px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

const examples = {
  beauty: ['사진으로 전하는 브랜드의 분위기.', '공간의 모습부터 서비스 이야기까지, 우리다운 글을 준비하세요.'],
  expert: ['복잡한 내용도, 차분하고 명확하게.', '주제와 참고자료를 정리해 전하세요. 전문 내용과 광고 표현은 발행 전 직접 검토해주세요.']
};
document.querySelectorAll('[data-example]').forEach(button => button.addEventListener('click', () => {
  const example = button.dataset.example;
  document.querySelectorAll('[data-example]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  document.querySelectorAll('[data-example-panel]').forEach(panel => { panel.hidden = panel.dataset.examplePanel !== example; });
  document.querySelector('#example-title').textContent = examples[example][0];
  document.querySelector('#example-description').textContent = examples[example][1];
}));

const steps = [
  { label: '브랜드 설정', title: '우리다운 문장의 시작.', lines: ['브랜드명, 업종과 서비스 소개.', '원하는 말투와 필수 문구를 설정하세요.'] },
  { label: '주제와 자료', title: '오늘은 어떤 이야기를 할까요?', lines: ['글의 주제와 키워드를 정하고,', '참고할 텍스트, 파일과 URL을 준비하세요.'] },
  { label: '글과 사진', title: '읽고 싶은 흐름으로.', lines: ['제목과 본문에 사진을 배치하고', '강조, 인용구와 구분선으로 정리합니다.'] },
  { label: '네이버 임시저장', title: '이제, 마지막 확인만.', lines: ['네이버에 준비된 임시글을 검토하고', '사실과 표현을 확인한 뒤 직접 발행하세요.'] }
];
const workflow = document.querySelector('.workflow-preview');
document.querySelectorAll('[data-flow]').forEach(button => button.addEventListener('click', () => {
  const step = steps[Number(button.dataset.flow)];
  document.querySelectorAll('[data-flow]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  workflow.querySelector('.workflow-label').textContent = step.label;
  workflow.querySelector('h3').textContent = step.title;
  const description = workflow.querySelector('.workflow-description');
  description.replaceChildren(document.createTextNode(step.lines[0]), document.createElement('br'), document.createTextNode(step.lines[1]));
  workflow.classList.remove('is-changing');
  requestAnimationFrame(() => requestAnimationFrame(() => workflow.classList.add('is-changing')));
}));

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const reveals = [...document.querySelectorAll('.reveal')];
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      entry.target.classList.remove('reveal-pending');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.06 });
if (!reduceMotion.matches) reveals.forEach(element => {
  if (element.getBoundingClientRect().top > innerHeight) element.classList.add('reveal-pending');
  observer.observe(element);
});
reduceMotion.addEventListener('change', event => {
  if (event.matches) { reveals.forEach(element => element.classList.remove('reveal-pending')); observer.disconnect(); }
});
