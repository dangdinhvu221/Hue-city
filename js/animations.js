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

  // Gallery photos and video cards get a choreographed batch-stagger instead
  // of each triggering independently — reads as a wave rather than a blink.
  gsap.set('.gallery__item, .video-card', { opacity: 0, y: 40, scale: 0.96 });

  ScrollTrigger.batch('.gallery__item', {
    start: 'top 92%',
    interval: 0.08,
    batchMax: 6,
    onEnter: (batch) => gsap.to(batch, {
      opacity: 1, y: 0, scale: 1,
      duration: 0.9, ease: 'power3.out', stagger: 0.08
    })
  });

  ScrollTrigger.batch('.video-card', {
    start: 'top 92%',
    interval: 0.08,
    batchMax: 4,
    onEnter: (batch) => gsap.to(batch, {
      opacity: 1, y: 0, scale: 1,
      duration: 0.9, ease: 'power3.out', stagger: 0.1
    })
  });

  // Featured memory collage — main photo rises, the two side photos slide in
  // from their own direction, then labels and captions settle in after.
  const collage = document.getElementById('memory-collage');
  if (collage) {
    const main = collage.querySelector('.memory-card--1');
    const upper = collage.querySelector('.memory-card--2');
    const lower = collage.querySelector('.memory-card--3');
    const metas = collage.querySelectorAll('.memory-card__index, .memory-card__label');
    const captions = collage.querySelectorAll('.memory-card__caption');

    gsap.set(metas, { opacity: 0 });
    gsap.set(captions, { opacity: 0, y: 10 });
    if (main) gsap.set(main, { opacity: 0, y: 50 });
    if (upper) gsap.set(upper, { opacity: 0, x: 40, y: -10 });
    if (lower) gsap.set(lower, { opacity: 0, y: 50 });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: collage, start: 'top 80%', toggleActions: 'play none none reverse' }
    });
    if (main) tl.to(main, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' });
    if (upper) tl.to(upper, { opacity: 1, x: 0, y: 0, duration: 0.9, ease: 'power3.out' }, '-=0.7');
    if (lower) tl.to(lower, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '-=0.6');
    tl.to(metas, { opacity: 1, duration: 0.6, stagger: 0.08 }, '-=0.3');
    tl.to(captions, { opacity: 0.85, y: 0, duration: 0.6, stagger: 0.08 }, '-=0.3');
  }

  // Section 02 — cinematic photo rises, meta card follows.
  const cinematicPhoto = document.getElementById('cinematic-photo');
  if (cinematicPhoto) {
    const figure = cinematicPhoto.querySelector('.cinematic-photo__figure');
    const meta = cinematicPhoto.querySelector('.cinematic-photo__meta');
    gsap.set(figure, { opacity: 0, y: 40 });
    gsap.set(meta, { opacity: 0, y: 20 });
    const tl = gsap.timeline({ scrollTrigger: { trigger: cinematicPhoto, start: 'top 78%', toggleActions: 'play none none reverse' } });
    tl.to(figure, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' });
    tl.to(meta, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5');
  }

  // Section 03 — asymmetrical collage, each frame enters from its own side.
  const photoCollage = document.getElementById('photo-collage');
  if (photoCollage) {
    const meta = photoCollage.querySelector('.photo-collage__meta');
    const main = photoCollage.querySelector('.photo-collage__frame--main');
    const vertical = photoCollage.querySelector('.photo-collage__frame--vertical');
    const night = photoCollage.querySelector('.photo-collage__frame--night');
    gsap.set(meta, { opacity: 0, y: 15 });
    gsap.set(main, { opacity: 0, y: 40 });
    gsap.set(vertical, { opacity: 0, x: 30 });
    gsap.set(night, { opacity: 0, y: 30 });
    const tl = gsap.timeline({ scrollTrigger: { trigger: photoCollage, start: 'top 78%', toggleActions: 'play none none reverse' } });
    tl.to(meta, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' });
    tl.to(main, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.3');
    tl.to(vertical, { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out' }, '-=0.7');
    tl.to(night, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '-=0.6');
  }

  // Section 04 — film strip slides in horizontally as it enters.
  const filmStripEl = document.getElementById('film-strip');
  if (filmStripEl) {
    const strip = filmStripEl.querySelector('.film-strip');
    const meta = filmStripEl.querySelector('.film-strip__meta');
    gsap.set(meta, { opacity: 0, y: 15 });
    gsap.set(strip, { opacity: 0, x: -50 });
    const tl = gsap.timeline({ scrollTrigger: { trigger: filmStripEl, start: 'top 80%', toggleActions: 'play none none reverse' } });
    tl.to(meta, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' });
    tl.to(strip, { opacity: 1, x: 0, duration: 1.1, ease: 'power3.out' }, '-=0.3');
  }

  // Section 05 — cinematic video fades and scales in.
  const cinematicVideoEl = document.getElementById('cinematic-video');
  if (cinematicVideoEl) {
    gsap.set(cinematicVideoEl, { opacity: 0, scale: 0.97 });
    gsap.to(cinematicVideoEl, {
      opacity: 1, scale: 1, duration: 1.1, ease: 'power3.out',
      scrollTrigger: { trigger: cinematicVideoEl, start: 'top 80%', toggleActions: 'play none none reverse' }
    });
  }

  // Section 06 — vertical video and photo enter from opposite directions.
  const verticalMemoryEl = document.getElementById('vertical-memory');
  if (verticalMemoryEl) {
    const videoFrame = verticalMemoryEl.querySelector('.vertical-memory__video-frame');
    const photoFrame = verticalMemoryEl.querySelector('.vertical-memory__photo-frame');
    const meta = verticalMemoryEl.querySelector('.vertical-memory__meta');
    gsap.set(videoFrame, { opacity: 0, y: 40 });
    gsap.set(photoFrame, { opacity: 0, x: 30 });
    gsap.set(meta, { opacity: 0 });
    const tl = gsap.timeline({ scrollTrigger: { trigger: verticalMemoryEl, start: 'top 80%', toggleActions: 'play none none reverse' } });
    tl.to(videoFrame, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' });
    tl.to(photoFrame, { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out' }, '-=0.6');
    tl.to(meta, { opacity: 1, duration: 0.6 }, '-=0.3');
  }

  // Section 07 — final collage, four frames settle in with a gentle stagger.
  const finalCollageEl = document.getElementById('final-collage');
  if (finalCollageEl) {
    const meta = finalCollageEl.querySelector('.final-collage__meta');
    const frames = finalCollageEl.querySelectorAll('.final-collage__frame');
    gsap.set(meta, { opacity: 0, y: 15 });
    gsap.set(frames, { opacity: 0, y: 35 });
    const tl = gsap.timeline({ scrollTrigger: { trigger: finalCollageEl, start: 'top 80%', toggleActions: 'play none none reverse' } });
    tl.to(meta, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' });
    tl.to(frames, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12 }, '-=0.3');
  }

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
