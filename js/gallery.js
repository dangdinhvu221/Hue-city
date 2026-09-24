/**
 * Gallery — editorial masonry grid + accessible lightbox.
 */
window.HUE = window.HUE || {};

HUE.renderGallery = function renderGallery(moments) {
  const grid = document.getElementById('gallery-grid');
  if (!grid || !moments || !moments.gallery) return;

  grid.innerHTML = moments.gallery.map((item, i) => `
    <figure class="gallery__item" data-reveal="scale" data-index="${i}" tabindex="0" role="button"
      aria-label="Open photo: ${escapeHtml(item.caption || '')}">
      <img src="${item.image}" alt="${escapeHtml(item.caption || '')}" loading="lazy" decoding="async"
        onerror="this.closest('.gallery__item').classList.add('is-missing'); this.alt='Photo not found — add it to assets/images/moments';" />
      ${item.caption ? `<figcaption class="caption gallery__caption">${escapeHtml(item.caption)}</figcaption>` : ''}
    </figure>
  `).join('');

  HUE.initLightbox(moments.gallery);
};

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

HUE.initLightbox = function initLightbox(items) {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const figure = lightbox.querySelector('.lightbox__figure');
  const img = lightbox.querySelector('.lightbox__image');
  const caption = lightbox.querySelector('.lightbox__caption');
  const closeBtn = lightbox.querySelector('.lightbox__close');
  const prevBtn = lightbox.querySelector('.lightbox__prev');
  const nextBtn = lightbox.querySelector('.lightbox__next');

  let currentIndex = 0;
  let lastFocused = null;

  function setImage(item) {
    img.classList.remove('is-missing');
    img.onerror = () => img.classList.add('is-missing');
    img.src = item.image;
    img.alt = item.caption || '';
    caption.textContent = item.caption || '';
  }

  function open(index) {
    currentIndex = index;
    setImage(items[currentIndex]);
    lightbox.setAttribute('data-open', 'true');
    lastFocused = document.activeElement;
    closeBtn.focus();
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.setAttribute('data-open', 'false');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  function show(delta) {
    currentIndex = (currentIndex + delta + items.length) % items.length;
    setImage(items[currentIndex]);
  }

  document.querySelectorAll('.gallery__item').forEach((el) => {
    const activate = () => open(Number(el.dataset.index));
    el.addEventListener('click', activate);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activate();
      }
    });
  });

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', () => show(-1));
  nextBtn.addEventListener('click', () => show(1));
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', (e) => {
    if (lightbox.getAttribute('data-open') !== 'true') return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(-1);
    if (e.key === 'ArrowRight') show(1);
  });
};
