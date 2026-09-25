/**
 * Background music — embedded via the official YouTube IFrame Player API
 * (no audio files are downloaded or hosted). Starts only after the visitor
 * interacts with the page, and only loads the YouTube API on that first click.
 */
window.HUE = window.HUE || {};

HUE.initMusic = function initMusic() {
  const toggle = document.getElementById('music-toggle');
  const nextBtn = document.getElementById('music-next');
  const frameWrapper = document.getElementById('music-player-frame');
  const target = document.getElementById('music-player-target');
  const ids = (SITE_CONFIG.music && SITE_CONFIG.music.youtubeIds) || [];
  if (!toggle || !frameWrapper || !target || ids.length === 0) return;

  let player = null;
  let trackIndex = 0;
  let apiLoading = null;

  function setPlayingState(isPlaying) {
    toggle.setAttribute('data-playing', String(isPlaying));
    toggle.setAttribute('aria-pressed', String(isPlaying));
    toggle.querySelector('.music-toggle__text').textContent = isPlaying ? 'Đang phát nhạc' : 'Tắt nhạc';
  }

  function loadYouTubeAPI() {
    if (apiLoading) return apiLoading;
    apiLoading = new Promise((resolve) => {
      if (window.YT && window.YT.Player) {
        resolve(window.YT);
        return;
      }
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof prevCallback === 'function') prevCallback();
        resolve(window.YT);
      };
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(script);
    });
    return apiLoading;
  }

  function createPlayer() {
    return new Promise((resolve, reject) => {
      try {
        player = new YT.Player(target, {
          videoId: ids[trackIndex],
          playerVars: { autoplay: 0, controls: 1, rel: 0, modestbranding: 1 },
          events: {
            onReady: (e) => {
              e.target.setVolume(SITE_CONFIG.music.defaultVolume);
              frameWrapper.classList.add('is-active');
              if (ids.length > 1) nextBtn.hidden = false;
              resolve(player);
            },
            onStateChange: (e) => {
              if (e.data === YT.PlayerState.PLAYING) setPlayingState(true);
              if (e.data === YT.PlayerState.PAUSED) setPlayingState(false);
              if (e.data === YT.PlayerState.ENDED) playTrack((trackIndex + 1) % ids.length);
            },
            onError: () => {
              console.warn('[HUE] Could not embed YouTube track:', ids[trackIndex]);
              playTrack((trackIndex + 1) % ids.length);
            }
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  function playTrack(index) {
    trackIndex = index;
    if (player && player.loadVideoById) {
      player.loadVideoById(ids[trackIndex]);
      player.playVideo();
    }
  }

  toggle.addEventListener('click', async () => {
    try {
      if (!player) {
        await loadYouTubeAPI();
        await createPlayer();
        player.playVideo();
        return;
      }
      const state = player.getPlayerState();
      if (state === YT.PlayerState.PLAYING) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
    } catch (err) {
      console.warn('[HUE] Background music unavailable.', err);
    }
  });

  nextBtn.addEventListener('click', () => {
    if (player) playTrack((trackIndex + 1) % ids.length);
  });
};
