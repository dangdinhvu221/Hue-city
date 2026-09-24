/**
 * Scroll-triggered motion — GSAP + ScrollTrigger.
 * Falls back to a simple IntersectionObserver reveal when GSAP is unavailable
 * or the visitor prefers reduced motion.
 */
window.HUE = window.HUE || {};

HUE.initAnimations = function initAnimations() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';

  if (reduceMotion || !hasGSAP) {
    initFallbackReveal();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  document.querySelectorAll('[data-reveal]').forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, y: el.dataset.reveal === 'fade' ? 0 : 40, scale: el.dataset.reveal === 'scale' ? 0.96 : 1 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  });

  // Gentle parallax on the Chapter 01 hero media.
  const heroMedia = document.querySelector('.hero-media img, .hero-media video');
  if (heroMedia) {
    gsap.to(heroMedia, {
      yPercent: 15,
      ease: 'none',
      scrollTrigger: {
        trigger: '#chapter-01',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  }

  // Chapter 00 title reveal.
  gsap.from('.invitation__reveal', {
    opacity: 0,
    y: 20,
    duration: 1.4,
    ease: 'power2.out',
    stagger: 0.15,
    delay: 0.3
  });

  // Lazy-loaded media and web fonts change layout after triggers are first
  // measured — recalculate positions whenever that happens so reveals below
  // the fold don't get stuck at opacity 0.
  let refreshQueued = false;
  function queueRefresh() {
    if (refreshQueued) return;
    refreshQueued = true;
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      refreshQueued = false;
    });
  }

  document.addEventListener('load', (e) => {
    if (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO') queueRefresh();
  }, true);
  document.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO') queueRefresh();
  }, true);

  window.addEventListener('load', queueRefresh);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(queueRefresh);
  }
};

function initFallbackReveal() {
  const targets = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  targets.forEach((el) => observer.observe(el));
  document.querySelectorAll('.invitation__reveal').forEach((el) => el.classList.add('fade-in'));
}
