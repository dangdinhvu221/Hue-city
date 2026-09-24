/**
 * Entry point — loads data, renders dynamic content, wires up every module.
 */
(async function main() {
  const loader = document.getElementById('loader');
  const startTime = Date.now();

  const data = await HUE.loadData();

  if (data) {
    renderStaticContent(data);
    renderJourney(data.journey);
    HUE.renderGallery(data.moments);
    HUE.renderVideos(data.movingMemories);
  } else {
    showDataErrorNotice();
  }

  HUE.initNavigation();
  HUE.initMusic();
  HUE.initAnimations();
  wireFinalActions(data);
  wireInvitation();

  const elapsed = Date.now() - startTime;
  const remaining = Math.max(SITE_CONFIG.loaderMinDuration - elapsed, 0);
  setTimeout(() => {
    if (loader) loader.setAttribute('data-hidden', 'true');
  }, remaining);
})();

function renderStaticContent(data) {
  setText('#invitation-eyebrow', data.invitation.eyebrow);
  setText('#invitation-title', data.invitation.title);
  setText('#invitation-subtitle', data.invitation.subtitle);
  setText('#invitation-intro', data.invitation.intro);
  setText('#invitation-cta', data.invitation.cta);

  setText('#before-eyebrow', data.beforeWeLeft.eyebrow);
  setText('#before-heading', data.beforeWeLeft.heading);
  setText('#before-heading-highlight', data.beforeWeLeft.headingHighlight);
  setText('#before-body', data.beforeWeLeft.body);
  const heroImg = document.getElementById('hero-media-img');
  if (heroImg && data.beforeWeLeft.heroImage) {
    heroImg.addEventListener('error', () => {
      heroImg.closest('.hero-media').classList.add('is-missing');
    }, { once: true });
    heroImg.src = data.beforeWeLeft.heroImage;
  }

  setText('#journey-eyebrow', data.journey.eyebrow);
  setText('#journey-heading', data.journey.heading);
  setText('#journey-intro', data.journey.intro);

  setText('#moments-eyebrow', data.moments.eyebrow);
  setText('#moments-heading', data.moments.heading);
  setText('#moments-intro', data.moments.intro);

  setText('#video-eyebrow', data.movingMemories.eyebrow);
  setText('#video-heading', data.movingMemories.heading);
  setText('#video-heading-highlight', data.movingMemories.headingHighlight);

  setText('#letter-eyebrow', data.letter.eyebrow);
  setText('#letter-heading', data.letter.heading);
  setText('#letter-opening', data.letter.opening);
  const letterBody = document.getElementById('letter-body');
  if (letterBody) {
    letterBody.innerHTML = data.letter.body.map((p) => `<p>${escapeHtmlMain(p)}</p>`).join('');
  }
  setText('#letter-closing', data.letter.closing);
  setText('#letter-signature', data.letter.signature);

  setText('#final-heading', data.toBeContinued.heading);
  setText('#final-body', data.toBeContinued.body);
  const finalList = document.getElementById('final-list');
  if (finalList) {
    finalList.innerHTML = data.toBeContinued.list.map((li) => `<li>${escapeHtmlMain(li)}</li>`).join('');
  }
  setText('#replay-btn', data.toBeContinued.replayLabel);
  setText('#restart-btn', data.toBeContinued.restartLabel);
}

function renderJourney(journey) {
  const container = document.getElementById('journey-stops');
  if (!container || !journey) return;

  container.innerHTML = journey.stops.map((stop) => `
    <div class="journey-stop" data-reveal="fade">
      <div class="journey-stop__media${stop.image ? '' : ' is-missing'}">
        ${stop.image ? `<img src="${stop.image}" alt="${escapeHtmlMain(stop.title)}" loading="lazy" decoding="async"
          onerror="this.closest('.journey-stop__media').classList.add('is-missing')" />` : ''}
      </div>
      <div class="journey-stop__text">
        <span class="journey-stop__index">${stop.index}</span>
        <h3 class="display-h3" style="margin-top: var(--space-2xs);">${escapeHtmlMain(stop.title)}</h3>
        ${stop.date ? `<p class="caption" style="margin-top: var(--space-3xs);">${escapeHtmlMain(stop.date)}</p>` : ''}
        <p class="body-text" style="margin-top: var(--space-sm);">${escapeHtmlMain(stop.caption)}</p>
      </div>
    </div>
  `).join('');
}

function wireFinalActions(data) {
  const replayBtn = document.getElementById('replay-btn');
  const restartBtn = document.getElementById('restart-btn');

  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      window.location.reload();
    });
  }
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      HUE.goToChapter && HUE.goToChapter('chapter-00');
    });
  }
}

function wireInvitation() {
  const openBtn = document.getElementById('invitation-cta');
  if (openBtn) {
    openBtn.addEventListener('click', () => {
      HUE.goToChapter && HUE.goToChapter('chapter-01');
    });
  }
}

function showDataErrorNotice() {
  const notice = document.createElement('div');
  notice.setAttribute('role', 'alert');
  notice.style.cssText = 'position:fixed;bottom:1rem;right:1rem;max-width:320px;background:#262321;color:#F4EFE7;padding:1rem 1.25rem;border-radius:8px;font-size:0.85rem;z-index:200;';
  notice.textContent = 'Could not load data/memories.json. If you opened this file directly in the browser, run a local server (see README.md) instead.';
  document.body.appendChild(notice);
}

function setText(selector, text) {
  const el = document.querySelector(selector);
  if (el && text !== undefined) el.textContent = text;
}

function escapeHtmlMain(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}
