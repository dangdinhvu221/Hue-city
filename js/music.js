/**
 * Background music — starts only after the visitor interacts with the page.
 */
window.HUE = window.HUE || {};

HUE.initMusic = function initMusic() {
  const toggle = document.getElementById('music-toggle');
  const audio = document.getElementById('background-audio');
  if (!toggle || !audio) return;

  audio.volume = SITE_CONFIG.music.defaultVolume;
  let hasStarted = false;

  function setPlayingState(isPlaying) {
    toggle.setAttribute('data-playing', String(isPlaying));
    toggle.setAttribute('aria-pressed', String(isPlaying));
    toggle.querySelector('.music-toggle__text').textContent = isPlaying ? 'Music on' : 'Music off';
  }

  toggle.addEventListener('click', async () => {
    try {
      if (!hasStarted) {
        audio.src = SITE_CONFIG.music.src;
        hasStarted = true;
      }
      if (audio.paused) {
        await audio.play();
        setPlayingState(true);
      } else {
        audio.pause();
        setPlayingState(false);
      }
    } catch (err) {
      console.warn('[HUE] Could not play background music. Add a file at', SITE_CONFIG.music.src, err);
    }
  });

  audio.addEventListener('error', () => {
    toggle.setAttribute('hidden', 'true');
    console.warn('[HUE] No background music file found at', SITE_CONFIG.music.src);
  });
};
