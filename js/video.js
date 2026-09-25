/**
 * Video storytelling — lazy-loaded, custom-controlled HTML5 video cards.
 * Videos never autoplay with sound; only one plays at a time.
 * initVideoCards() is called once from main.js after every video section
 * (cinematic, vertical-memory, grid) has rendered its markup.
 */
window.HUE = window.HUE || {};

function escapeHtmlVideo(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}

function videoCardMarkup(item, extraClass) {
  return `
    <video
      preload="none"
      poster="${item.poster || ''}"
      data-src="${item.src}"
      playsinline
      muted
      aria-label="${escapeHtmlVideo(item.caption || 'Video chuyến đi')}"
      onerror="this.closest('${extraClass ? '.' + extraClass : '.video-card'}').classList.add('is-missing')"
    ></video>
    <div class="video-card__glow" aria-hidden="true"><span></span></div>
    <div class="video-card__controls">
      <button class="video-card__play" aria-label="Phát video" data-action="play">▶</button>
      <div class="video-card__progress" aria-hidden="true">
        <div class="video-card__progress-fill"></div>
      </div>
      <button class="video-card__mute" aria-label="Bật tiếng video" data-action="mute">🔇</button>
    </div>
  `;
}

HUE.renderVideos = function renderVideos(movingMemories) {
  const grid = document.getElementById('video-grid');
  if (!grid || !movingMemories || !movingMemories.videos) return;

  grid.innerHTML = movingMemories.videos.map((item) => `
    <div class="video-card" data-orientation="${item.orientation || 'portrait'}">
      ${videoCardMarkup(item)}
      ${item.caption ? `<span class="caption" style="position:absolute;top:var(--space-xs);left:var(--space-xs);color:var(--color-ivory);opacity:.85;">${escapeHtmlVideo(item.caption)}</span>` : ''}
    </div>
  `).join('');
};

/**
 * Section 05 — one large cinematic (landscape) video, presented much bigger
 * than a grid card, with its own editorial label and caption.
 */
HUE.renderCinematicVideo = function renderCinematicVideo(cinematicVideo) {
  const el = document.getElementById('cinematic-video');
  if (!el || !cinematicVideo) return;

  el.innerHTML = `
    <div class="cinematic-video__meta">
      <span class="chapter-marker">${cinematicVideo.index} / ${cinematicVideo.total}</span>
      <h3 class="cinematic-video__label">${escapeHtmlVideo(cinematicVideo.label)}</h3>
    </div>
    <div class="video-card cinematic-video__card" data-orientation="landscape">
      ${videoCardMarkup(cinematicVideo, 'cinematic-video__card')}
    </div>
    <p class="cinematic-video__caption">${escapeHtmlVideo(cinematicVideo.caption)}</p>
  `;
};

/**
 * Section 06 — a real vertical phone video paired with one photograph,
 * framed like a memory tucked into a travel scrapbook.
 */
HUE.renderVerticalMemory = function renderVerticalMemory(verticalMemory) {
  const el = document.getElementById('vertical-memory');
  if (!el || !verticalMemory || !verticalMemory.video) return;

  el.innerHTML = `
    <div class="vertical-memory__video-frame">
      <div class="video-card vertical-memory__card" data-orientation="portrait">
        ${videoCardMarkup(verticalMemory.video, 'vertical-memory__card')}
      </div>
    </div>
    <div class="vertical-memory__photo-frame">
      <img src="${verticalMemory.photo}" alt="" loading="lazy" decoding="async" />
    </div>
    <div class="vertical-memory__meta">
      <span class="chapter-marker">${verticalMemory.index} / ${verticalMemory.total}</span>
      <h3 class="vertical-memory__label">${escapeHtmlVideo(verticalMemory.label)}</h3>
      <p class="vertical-memory__caption">${escapeHtmlVideo(verticalMemory.caption)}</p>
    </div>
  `;
};

HUE.initVideoCards = function initVideoCards() {
  const cards = Array.from(document.querySelectorAll('.video-card'));
  let currentlyPlaying = null;

  const loadObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const video = entry.target.querySelector('video');
      if (video && !video.src && video.dataset.src) {
        video.src = video.dataset.src;
      }
      loadObserver.unobserve(entry.target);
    });
  }, { rootMargin: '200px' });

  const pauseObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        const video = entry.target.querySelector('video');
        if (video && !video.paused) {
          video.pause();
        }
      }
    });
  }, { threshold: 0.25 });

  const canHover = window.matchMedia('(hover: hover)').matches;

  cards.forEach((card) => {
    loadObserver.observe(card);
    pauseObserver.observe(card);

    const video = card.querySelector('video');
    const playBtn = card.querySelector('[data-action="play"]');
    const muteBtn = card.querySelector('[data-action="mute"]');
    const progressFill = card.querySelector('.video-card__progress-fill');
    let userStarted = false;

    if (canHover) {
      card.addEventListener('mouseenter', () => {
        if (userStarted) return;
        if (!video.src && video.dataset.src) video.src = video.dataset.src;
        video.muted = true;
        video.play().catch(() => {});
        card.classList.add('is-previewing');
      });
      card.addEventListener('mouseleave', () => {
        if (userStarted) return;
        video.pause();
        video.currentTime = 0;
        card.classList.remove('is-previewing');
      });
    }

    playBtn.addEventListener('click', () => {
      if (!video.src && video.dataset.src) video.src = video.dataset.src;
      userStarted = true;
      card.classList.remove('is-previewing');

      if (video.paused) {
        if (currentlyPlaying && currentlyPlaying !== video) {
          currentlyPlaying.pause();
        }
        video.muted = false;
        muteBtn.textContent = '🔊';
        muteBtn.setAttribute('aria-label', 'Tắt tiếng video');
        video.play();
        currentlyPlaying = video;
        playBtn.textContent = '❚❚';
        playBtn.setAttribute('aria-label', 'Tạm dừng video');
      } else {
        video.pause();
        playBtn.textContent = '▶';
        playBtn.setAttribute('aria-label', 'Phát video');
      }
    });

    muteBtn.addEventListener('click', () => {
      video.muted = !video.muted;
      muteBtn.textContent = video.muted ? '🔇' : '🔊';
      muteBtn.setAttribute('aria-label', video.muted ? 'Bật tiếng video' : 'Tắt tiếng video');
    });

    video.addEventListener('timeupdate', () => {
      if (!video.duration) return;
      progressFill.style.width = `${(video.currentTime / video.duration) * 100}%`;
    });

    video.addEventListener('ended', () => {
      playBtn.textContent = '▶';
      playBtn.setAttribute('aria-label', 'Phát video');
    });
  });
};
