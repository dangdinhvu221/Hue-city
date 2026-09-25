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
    <button class="chapter-nav__item" data-target="${c.id}" aria-label="Đến chương: ${c.label}"
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

  initQuickMenu(chapters);
};

/**
 * A tap-to-open menu listing every chapter so visitors — especially on
 * mobile — can jump straight to what they want instead of scrolling the
 * whole page.
 */
function initQuickMenu(chapters) {
  const toggle = document.getElementById('quick-menu-toggle');
  const menu = document.getElementById('quick-menu');
  const list = document.getElementById('quick-menu-list');
  if (!toggle || !menu || !list) return;

  const entries = chapters.map((c) => ({ id: c.id, label: c.label }));

  list.innerHTML = entries.map((e) => `
    <li><button class="quick-menu__item" data-target="${e.id}">${e.label}</button></li>
  `).join('');

  function open() {
    menu.setAttribute('data-open', 'true');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    menu.setAttribute('data-open', 'false');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    if (menu.getAttribute('data-open') === 'true') close();
    else open();
  });

  menu.addEventListener('click', (e) => {
    if (e.target === menu) close();
  });

  list.querySelectorAll('.quick-menu__item').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.target);
      close();
      if (target) {
        setTimeout(() => {
          target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
        }, 50);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.getAttribute('data-open') === 'true') close();
  });
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
