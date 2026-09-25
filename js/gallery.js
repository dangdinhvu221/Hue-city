/**
 * Photo storytelling — editorial memory sections + masonry grid, all sharing
 * one lightbox. Sections push their photos into a shared list via
 * HUE.pushLightboxItems() so the lightbox can navigate across all of them
 * (Ken Burns zoom, crossfade, counter) regardless of which layout they live in.
 */
window.HUE = window.HUE || {};
HUE._lightboxItems = [];

HUE.pushLightboxItems = function pushLightboxItems(items) {
  const start = HUE._lightboxItems.length;
  HUE._lightboxItems.push(...items);
  return start;
};

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}

HUE.renderGallery = function renderGallery(moments) {
  const collage = document.getElementById('memory-collage');
  const cinematic = document.getElementById('cinematic-photo');
  const photoCollage = document.getElementById('photo-collage');
  const filmStrip = document.getElementById('film-strip');
  const grid = document.getElementById('gallery-grid');
  if (!moments) return;

  // ---- Section 01: opening memory collage (large + 2 small) ----
  const featured = moments.featured || [];
  if (collage && featured.length) {
    const base = HUE.pushLightboxItems(featured);
    collage.innerHTML = featured.map((item, i) => `
      <figure class="memory-card memory-card--${i + 1}" data-index="${base + i}" tabindex="0" role="button"
        aria-label="Xem ảnh: ${escapeHtml(item.label || item.caption || '')}">
        <div class="memory-card__frame">
          <img src="${item.image}" alt="${escapeHtml(item.label || '')}" loading="lazy" decoding="async"
            onerror="this.closest('.memory-card').classList.add('is-missing')" />
        </div>
        <div class="memory-card__meta">
          <span class="memory-card__index">${item.index} / ${item.total}</span>
          <span class="memory-card__label">${escapeHtml(item.label || '')}</span>
          <p class="memory-card__caption">${escapeHtml(item.caption || '')}</p>
        </div>
      </figure>
    `).join('');
  }

  // ---- Section 02: full-width cinematic photo ----
  const cp = moments.cinematicPhoto;
  if (cinematic && cp) {
    const base = HUE.pushLightboxItems([{ image: cp.image, caption: cp.caption }]);
    cinematic.innerHTML = `
      <figure class="cinematic-photo__figure" data-index="${base}" tabindex="0" role="button"
        aria-label="Xem ảnh: ${escapeHtml(cp.label)}">
        <img src="${cp.image}" alt="${escapeHtml(cp.label)}" loading="lazy" decoding="async" />
      </figure>
      <div class="cinematic-photo__meta">
        <span class="chapter-marker">${cp.index} / ${cp.total}</span>
        <h3 class="cinematic-photo__label">${escapeHtml(cp.label)}</h3>
        <p class="cinematic-photo__caption">${escapeHtml(cp.caption)}</p>
      </div>
    `;
  }

  // ---- Section 03: asymmetrical photo collage ----
  const pc = moments.collage;
  if (photoCollage && pc) {
    const items = [
      { image: pc.main, caption: pc.caption },
      { image: pc.vertical, caption: '' },
      { image: pc.night, caption: '' }
    ];
    const base = HUE.pushLightboxItems(items);
    photoCollage.innerHTML = `
      <div class="photo-collage__meta">
        <span class="chapter-marker">${pc.index} / ${pc.total}</span>
        <h3 class="photo-collage__label">${escapeHtml(pc.label)}</h3>
        <p class="photo-collage__caption">${escapeHtml(pc.caption)}</p>
      </div>
      <div class="photo-collage__frame photo-collage__frame--main" data-index="${base}" tabindex="0" role="button" aria-label="Xem ảnh">
        <img src="${pc.main}" alt="" loading="lazy" decoding="async" />
      </div>
      <div class="photo-collage__frame photo-collage__frame--vertical" data-index="${base + 1}" tabindex="0" role="button" aria-label="Xem ảnh">
        <img src="${pc.vertical}" alt="" loading="lazy" decoding="async" />
      </div>
      <div class="photo-collage__frame photo-collage__frame--night" data-index="${base + 2}" tabindex="0" role="button" aria-label="Xem ảnh">
        <img src="${pc.night}" alt="" loading="lazy" decoding="async" />
      </div>
    `;
  }

  // ---- Section 04: film strip / contact sheet ----
  const fs = moments.filmStrip;
  if (filmStrip && fs && fs.images && fs.images.length) {
    const items = fs.images.map((image) => ({ image, caption: '' }));
    const base = HUE.pushLightboxItems(items);
    filmStrip.innerHTML = `
      <div class="film-strip__meta">
        <span class="chapter-marker">${fs.index} / ${fs.total}</span>
        <h3 class="film-strip__label">${escapeHtml(fs.label)}</h3>
        <p class="film-strip__caption">${escapeHtml(fs.caption)}</p>
      </div>
      <div class="film-strip">
        <div class="film-strip__perf film-strip__perf--top" aria-hidden="true"></div>
        <div class="film-strip__frames">
          ${fs.images.map((image, i) => `
            <div class="film-strip__frame" data-index="${base + i}" tabindex="0" role="button" aria-label="Xem ảnh">
              <img src="${image}" alt="" loading="lazy" decoding="async" />
            </div>
          `).join('')}
        </div>
        <div class="film-strip__perf film-strip__perf--bottom" aria-hidden="true"></div>
      </div>
    `;
  }

  // ---- Remaining gallery grid ----
  if (grid && moments.gallery) {
    const base = HUE.pushLightboxItems(moments.gallery);
    grid.innerHTML = moments.gallery.map((item, i) => `
      <figure class="gallery__item" data-index="${base + i}" tabindex="0" role="button"
        aria-label="Xem ảnh: ${escapeHtml(item.caption || '')}">
        <img src="${item.image}" alt="${escapeHtml(item.caption || '')}" loading="lazy" decoding="async"
          onerror="this.closest('.gallery__item').classList.add('is-missing'); this.alt='Không tìm thấy ảnh';" />
        ${item.caption ? `<figcaption class="caption gallery__caption">${escapeHtml(item.caption)}</figcaption>` : ''}
      </figure>
    `).join('');
  }
};

/**
 * Renders the final photo collage (Chapter 04, section 07) — shares the
 * same lightbox item pool even though it's rendered from a different chapter.
 */
HUE.renderFinalCollage = function renderFinalCollage(finalCollage) {
  const el = document.getElementById('final-collage');
  if (!el || !finalCollage) return;

  const items = [
    { image: finalCollage.landscape, caption: '' },
    { image: finalCollage.vertical, caption: '' },
    { image: finalCollage.architecture, caption: '' },
    { image: finalCollage.night, caption: finalCollage.caption }
  ];
  const base = HUE.pushLightboxItems(items);

  el.innerHTML = `
    <div class="final-collage__meta">
      <span class="chapter-marker">${finalCollage.index} / ${finalCollage.total}</span>
      <h3 class="final-collage__label">${escapeHtml(finalCollage.label)}</h3>
      <p class="final-collage__caption">${escapeHtml(finalCollage.caption)}</p>
    </div>
    <div class="final-collage__frame final-collage__frame--landscape" data-index="${base}" tabindex="0" role="button" aria-label="Xem ảnh">
      <img src="${finalCollage.landscape}" alt="" loading="lazy" decoding="async" />
    </div>
    <div class="final-collage__frame final-collage__frame--vertical" data-index="${base + 1}" tabindex="0" role="button" aria-label="Xem ảnh">
      <img src="${finalCollage.vertical}" alt="" loading="lazy" decoding="async" />
    </div>
    <div class="final-collage__frame final-collage__frame--architecture" data-index="${base + 2}" tabindex="0" role="button" aria-label="Xem ảnh">
      <img src="${finalCollage.architecture}" alt="" loading="lazy" decoding="async" />
    </div>
    <div class="final-collage__frame final-collage__frame--night" data-index="${base + 3}" tabindex="0" role="button" aria-label="Xem ảnh">
      <img src="${finalCollage.night}" alt="" loading="lazy" decoding="async" />
    </div>
  `;
};

/**
 * Call once, after every photo section (chapters 03 and 04) has rendered and
 * pushed its items into HUE._lightboxItems.
 */
HUE.initLightbox = function initLightbox(loveLines) {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const items = HUE._lightboxItems;
  const lines = loveLines || [];
  let lastLineIndex = -1;

  function randomLine() {
    if (!lines.length) return '';
    if (lines.length === 1) return lines[0].text;
    let i;
    do { i = Math.floor(Math.random() * lines.length); } while (i === lastLineIndex);
    lastLineIndex = i;
    return lines[i].text;
  }

  const img = lightbox.querySelector('.lightbox__image');
  const caption = lightbox.querySelector('.lightbox__caption');
  const counter = document.getElementById('lightbox-counter');
  const closeBtn = lightbox.querySelector('.lightbox__close');
  const prevBtn = lightbox.querySelector('.lightbox__prev');
  const nextBtn = lightbox.querySelector('.lightbox__next');

  let currentIndex = 0;
  let lastFocused = null;

  function applyImage(item) {
    img.classList.remove('is-missing', 'is-animating');
    img.onerror = () => img.classList.add('is-missing');
    img.src = item.image;
    img.alt = item.caption || '';
    caption.textContent = item.caption || randomLine();
    caption.classList.toggle('lightbox__caption--love-note', !item.caption);
    if (counter) counter.textContent = `${currentIndex + 1} / ${items.length}`;
    void img.offsetWidth;
    requestAnimationFrame(() => img.classList.add('is-animating'));
  }

  function setImage(item, { crossfade } = {}) {
    if (!crossfade) {
      applyImage(item);
      return;
    }
    img.classList.add('is-transitioning');
    setTimeout(() => {
      applyImage(item);
      img.classList.remove('is-transitioning');
    }, 180);
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
    setImage(items[currentIndex], { crossfade: true });
  }

  document.querySelectorAll('[data-index]').forEach((el) => {
    const idx = Number(el.dataset.index);
    if (Number.isNaN(idx) || idx >= items.length) return;
    const activate = () => open(idx);
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
