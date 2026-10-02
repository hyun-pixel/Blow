const demo = document.querySelector('.writing-demo');
if (demo) {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const fields = [...demo.querySelectorAll('[data-type-start]')].map(element => ({
    element, text: element.textContent,
    start: Number(element.dataset.typeStart), end: Number(element.dataset.typeEnd)
  }));
  const steps = [...demo.querySelectorAll('[data-step]')];
  const saveState = demo.querySelector('.editor-save-state');
  const duration = 6800;
  const cycle = duration + 2000;
  let frame = 0;
  let elapsed = 0;
  let startedAt = 0;
  let running = false;
  let visible = false;
  let state = '';

  function render(time) {
    const next = time < 700 ? 'intro' : time < 1400 ? 'compose' : time < 4200 ? 'write' : time < 5500 ? 'media' : time < duration ? 'save' : 'done';
    if (next !== state) {
      state = next;
      demo.dataset.state = next;
      const active = ['intro', 'compose', 'write'].includes(next) ? 'write' : next === 'media' ? 'media' : 'save';
      steps.forEach(step => step.classList.toggle('is-current', step.dataset.step === active));
    }
    for (const field of fields) {
      const progress = Math.max(0, Math.min(1, (time - field.start) / (field.end - field.start)));
      const text = field.text.slice(0, Math.floor(progress * field.text.length));
      if (field.element.textContent !== text) field.element.textContent = text;
      field.element.dataset.typing = String(running && progress > 0 && progress < 1);
    }
    saveState.style.opacity = time >= duration ? '1' : '0';
  }

  function tick(now) {
    elapsed = (now - startedAt) % cycle;
    render(elapsed);
    frame = requestAnimationFrame(tick);
  }
  function pause() {
    if (!running) return;
    elapsed = (performance.now() - startedAt) % cycle;
    running = false;
    cancelAnimationFrame(frame);
    render(elapsed);
  }
  function play() {
    if (running || !visible || document.hidden || reducedMotion.matches) return;
    running = true;
    startedAt = performance.now() - elapsed;
    render(elapsed);
    frame = requestAnimationFrame(tick);
  }
  function finish() {
    pause();
    elapsed = 0;
    render(duration);
  }
  // Repeat the full story, keeping the completed draft on screen for two seconds.
  // Offscreen and background tabs pause; returning resumes without duplicate loops.
  const observer = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (visible) play();
    else pause();
  }, { threshold: .15 });
  observer.observe(demo);
  if (reducedMotion.matches) finish();
  else render(0);
  document.addEventListener('visibilitychange', () => document.hidden ? pause() : play());
  reducedMotion.addEventListener('change', () => reducedMotion.matches ? finish() : play());
  window.addEventListener('pagehide', pause);
  window.addEventListener('pageshow', play);
}
