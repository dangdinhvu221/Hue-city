/**
 * Data loading — fetches memories.json and exposes it through window.HUE.
 * Keeping content out of the JS files makes photos/captions/dates easy to edit.
 */
window.HUE = window.HUE || {};

HUE.loadData = async function loadData() {
  if (HUE._data) return HUE._data;

  try {
    const res = await fetch(SITE_CONFIG.dataUrl, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    HUE._data = await res.json();
  } catch (err) {
    console.error('[HUE] Could not load data/memories.json.', err);
    console.warn('[HUE] If you opened index.html directly (file://), run a local server instead — see README.md.');
    HUE._data = null;
  }

  return HUE._data;
};
