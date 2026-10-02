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
  if (event.key === 'Escape' && nav?.classList.contains('is-open')) {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
matchMedia('(min-width: 768px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

const guideLinks = [...document.querySelectorAll('.guide-nav a')];
if (guideLinks.length) {
  const visibleSections = new Set();
  const guideObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.isIntersecting ? visibleSections.add(entry.target) : visibleSections.delete(entry.target));
    const visible = [...visibleSections].sort((a,b) => Math.abs(a.getBoundingClientRect().top) - Math.abs(b.getBoundingClientRect().top))[0];
    if (!visible) return;
    guideLinks.forEach(link => {
      if (link.hash === '#' + visible.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-5% 0px -65% 0px', threshold: 0 });
  guideLinks.forEach(link => {
    const section = document.querySelector(link.hash);
    if (section) guideObserver.observe(section);
  });
}

// Native motion keeps the document readable before JavaScript and without animation support.
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
const entranceAnimations = new Set();
const entranceTargets = [...document.querySelectorAll([
  '.hero-eyebrow', '.hero h1>span', '.hero-description', '.hero-actions',
  '.section-heading', '.feature', '.flow-list>li', '.flow-bottom',
  '.pricing-intro', '.price-plan',
  '.page-heading', '.guide-section-heading', '.guide-steps>li', '.account-help>article',
  '.download-card', '.download-requirements', '.download-next'
].join(','))];
const entranceDelays = new Map();
for (const group of document.querySelectorAll('.hero-copy,.feature-grid,.flow-list')) {
  entranceTargets.filter(el => group.contains(el)).forEach((el, index) => entranceDelays.set(el, Math.min(index * 90, 360)));
}
const entranceObserver = new IntersectionObserver(entries => {
  for (const { target, isIntersecting } of entries) {
    if (!isIntersecting) continue;
    entranceObserver.unobserve(target);
    target.classList.add('motion-seen');
    if (reducedMotion.matches || target.contains(document.activeElement)) continue;
    const compact = matchMedia('(max-width: 767px)').matches;
    const animation = target.animate([
      { opacity: 0, translate: compact ? '0 18px' : '0 32px' },
      { opacity: 1, translate: '0 0' }
    ], { duration: compact ? 520 : 760, delay: compact ? 0 : entranceDelays.get(target) || 0, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' });
    entranceAnimations.add(animation);
    animation.onfinish = animation.oncancel = () => entranceAnimations.delete(animation);
  }
}, { threshold: .08, rootMargin: '0px 0px -24px 0px' });
for (const target of entranceTargets) {
  if (reducedMotion.matches || target.getBoundingClientRect().bottom < 0) target.classList.add('motion-seen');
  else entranceObserver.observe(target);
}

const cursor = document.createElement('div');
cursor.className = 'cursor-ring';
cursor.setAttribute('aria-hidden', 'true');
document.body.append(cursor);
let pointerFrame = 0;
let pointerX = 0;
let pointerY = 0;
let pointerTarget = null;
let activeCard = null;
let activeButton = null;
function clearSurface(element) {
  if (!element) return;
  element.classList.remove('pointer-active');
  for (const property of ['--pointer-x', '--pointer-y', '--tilt-x', '--tilt-y', '--magnet-x', '--magnet-y']) element.style.removeProperty(property);
}
function resetPointer() {
  cancelAnimationFrame(pointerFrame);
  pointerFrame = 0;
  cursor.classList.remove('is-visible', 'is-link', 'is-pressed');
  clearSurface(activeCard);
  clearSurface(activeButton);
  activeCard = activeButton = pointerTarget = null;
}
function paintPointer() {
  pointerFrame = 0;
  cursor.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`;
  cursor.classList.add('is-visible');
  cursor.classList.toggle('is-link', !!pointerTarget.closest('a,button,summary'));
  const card = pointerTarget.closest('.feature,.price-plan,.download-card');
  const button = pointerTarget.closest('.button');
  if (card !== activeCard) clearSurface(activeCard);
  if (button !== activeButton) clearSurface(activeButton);
  activeCard = card;
  activeButton = button;
  for (const element of [card, button]) {
    if (!element) continue;
    const rect = element.getBoundingClientRect();
    const x = (pointerX - rect.left) / rect.width - .5;
    const y = (pointerY - rect.top) / rect.height - .5;
    element.classList.add('pointer-active');
    element.style.setProperty('--pointer-x', `${pointerX - rect.left}px`);
    element.style.setProperty('--pointer-y', `${pointerY - rect.top}px`);
    if (element === card) {
      element.style.setProperty('--tilt-x', `${-y * 4}deg`);
      element.style.setProperty('--tilt-y', `${x * 5}deg`);
    } else {
      element.style.setProperty('--magnet-x', `${x * 7}px`);
      element.style.setProperty('--magnet-y', `${y * 5}px`);
    }
  }
}
document.addEventListener('pointermove', event => {
  if (event.pointerType === 'touch') { resetPointer(); return; }
  if (!finePointer.matches || reducedMotion.matches) return;
  pointerX = event.clientX;
  pointerY = event.clientY;
  pointerTarget = event.target;
  if (!pointerFrame) pointerFrame = requestAnimationFrame(paintPointer);
}, { passive: true });
document.addEventListener('pointerdown', event => {
  if (event.pointerType === 'touch') { resetPointer(); return; }
  if (finePointer.matches && !reducedMotion.matches) cursor.classList.add('is-pressed');
}, { passive: true });
document.addEventListener('pointerup', () => cursor.classList.remove('is-pressed'), { passive: true });
document.documentElement.addEventListener('pointerleave', resetPointer);
window.addEventListener('blur', resetPointer);
window.addEventListener('pagehide', resetPointer);
finePointer.addEventListener('change', resetPointer);
// Keyboard focus never waits for an entrance animation or a decorative pointer.
document.addEventListener('keydown', event => { if (event.key === 'Tab') resetPointer(); });
document.addEventListener('focusin', event => {
  for (const animation of entranceAnimations) {
    if (animation.effect.target.contains(event.target)) animation.cancel();
  }
});
function finishEntrances() {
  for (const animation of entranceAnimations) animation.cancel();
}
reducedMotion.addEventListener('change', () => {
  resetPointer();
  if (reducedMotion.matches) {
    entranceObserver.disconnect();
    finishEntrances();
    entranceTargets.forEach(target => target.classList.add('motion-seen'));
  }
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { resetPointer(); finishEntrances(); }
});


// Share one inquiry picker across page actions and the native disclosure.
const contactWidget = document.querySelector('.floating-contact');
const contactLauncher = contactWidget?.querySelector('summary');
let contactReturnFocus = contactLauncher;
function closeContact(returnFocus = false) {
  if (!contactWidget?.open) return;
  contactWidget.open = false;
  if (returnFocus) contactReturnFocus?.focus({ preventScroll: true });
}
document.addEventListener('click', event => {
  const trigger = event.target.closest('[data-contact-open]');
  if (trigger && contactWidget) {
    event.preventDefault();
    closeMenu();
    contactReturnFocus = trigger.getClientRects().length ? trigger : menuButton;
    contactWidget.open = true;
    contactWidget.querySelector('.contact-channel').focus({ preventScroll: true });
    return;
  }
  if (!contactWidget?.contains(event.target)) closeContact();
});
contactLauncher?.addEventListener('click', () => { contactReturnFocus = contactLauncher; });
// Keep previously shared /#contact links useful after removing the large section.
function openContactFromHash() {
  if (location.hash === '#contact' && contactWidget) contactWidget.open = true;
}
window.addEventListener('hashchange', openContactFromHash);
openContactFromHash();
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && contactWidget?.open) {
    event.preventDefault();
    closeContact(true);
  }
});
contactWidget?.addEventListener('click', event => {
  if (event.target.closest('a')) closeContact(true);
});
contactWidget?.addEventListener('focusout', event => {
  if (event.relatedTarget && !contactWidget.contains(event.relatedTarget)) closeContact();
});
