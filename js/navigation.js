/**
 * Chapter navigation — sticky dot nav, top progress bar, keyboard jumps.
 */
window.HUE = window.HUE || {};

HUE.initNavigation = function initNavigation() {
  const nav = document.getElementById('chapter-nav');
  const progressFill = document.querySelector('.progress-bar__fill');
  if (!nav) return;

  const chapters = SITE_CONFIG.chapters
    .map((c) => ({ ...c, el: document.getElementById(c.id) }))
    .filter((c) => c.el);

  nav.innerHTML = chapters.map((c, i) => `
    <button class="chapter-nav__item" data-target="${c.id}" aria-label="Go to chapter: ${c.label}"
      aria-current="${i === 0 ? 'true' : 'false'}">
      <span class="chapter-nav__label">${c.label}</span>
    </button>
  `).join('');

  const dots = Array.from(nav.querySelectorAll('.chapter-nav__item'));

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const target = document.getElementById(dot.dataset.target);
      if (target) target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        dots.forEach((d) => d.setAttribute('aria-current', String(d.dataset.target === entry.target.id)));
      }
    });
  }, { threshold: 0.5 });

  chapters.forEach((c) => observer.observe(c.el));

  // Progress bar across the whole page.
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressFill) progressFill.style.width = `${pct}%`;
  }, { passive: true });

  // Keyboard: arrow up/down jumps between chapters.
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;

    const activeIndex = Math.max(dots.findIndex((d) => d.getAttribute('aria-current') === 'true'), 0);

    e.preventDefault();
    const delta = e.key === 'ArrowDown' ? 1 : -1;
    const nextIndex = Math.min(Math.max(activeIndex + delta, 0), chapters.length - 1);
    const target = chapters[nextIndex].el;
    target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  });

  HUE.goToChapter = function goToChapter(id) {
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };
};

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
