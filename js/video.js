/**
 * Video reel — lazy-loaded, custom-controlled HTML5 video cards.
 * Videos never autoplay with sound; only one plays at a time.
 */
window.HUE = window.HUE || {};

HUE.renderVideos = function renderVideos(movingMemories) {
  const grid = document.getElementById('video-grid');
  if (!grid || !movingMemories || !movingMemories.videos) return;

  grid.innerHTML = movingMemories.videos.map((item, i) => `
    <div class="video-card" data-orientation="${item.orientation || 'portrait'}" data-index="${i}">
      <video
        preload="none"
        poster="${item.poster || ''}"
        data-src="${item.src}"
        playsinline
        muted
        aria-label="${escapeHtmlVideo(item.caption || 'Trip video')}"
        onerror="this.closest('.video-card').classList.add('is-missing')"
      ></video>
      <div class="video-card__controls">
        <button class="video-card__play" aria-label="Play video" data-action="play">▶</button>
        <div class="video-card__progress" aria-hidden="true">
          <div class="video-card__progress-fill"></div>
        </div>
        <button class="video-card__mute" aria-label="Unmute video" data-action="mute">🔇</button>
      </div>
      ${item.caption ? `<span class="caption" style="position:absolute;top:var(--space-xs);left:var(--space-xs);color:var(--color-ivory);opacity:.85;">${escapeHtmlVideo(item.caption)}</span>` : ''}
    </div>
  `).join('');

  initVideoCards();
};

function escapeHtmlVideo(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function initVideoCards() {
  const cards = Array.from(document.querySelectorAll('.video-card'));
  let currentlyPlaying = null;

  // Lazy-load the actual video source only when the card nears the viewport.
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

  // Pause videos that scroll out of view.
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

  cards.forEach((card) => {
    loadObserver.observe(card);
    pauseObserver.observe(card);

    const video = card.querySelector('video');
    const playBtn = card.querySelector('[data-action="play"]');
    const muteBtn = card.querySelector('[data-action="mute"]');
    const progressFill = card.querySelector('.video-card__progress-fill');

    playBtn.addEventListener('click', () => {
      if (!video.src && video.dataset.src) video.src = video.dataset.src;

      if (video.paused) {
        if (currentlyPlaying && currentlyPlaying !== video) {
          currentlyPlaying.pause();
        }
        video.play();
        currentlyPlaying = video;
        playBtn.textContent = '❚❚';
        playBtn.setAttribute('aria-label', 'Pause video');
      } else {
        video.pause();
        playBtn.textContent = '▶';
        playBtn.setAttribute('aria-label', 'Play video');
      }
    });

    muteBtn.addEventListener('click', () => {
      video.muted = !video.muted;
      muteBtn.textContent = video.muted ? '🔇' : '🔊';
      muteBtn.setAttribute('aria-label', video.muted ? 'Unmute video' : 'Mute video');
    });

    video.addEventListener('timeupdate', () => {
      if (!video.duration) return;
      progressFill.style.width = `${(video.currentTime / video.duration) * 100}%`;
    });

    video.addEventListener('ended', () => {
      playBtn.textContent = '▶';
      playBtn.setAttribute('aria-label', 'Play video');
    });
  });
}
