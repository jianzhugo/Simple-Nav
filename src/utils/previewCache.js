const CACHE_KEY = 'previewCacheTimestamps';
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000;

function getCacheTimestamps() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveCacheTimestamps(timestamps) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(timestamps));
  } catch {
    const entries = Object.entries(timestamps).sort((a, b) => a[1] - b[1]);
    const half = Math.floor(entries.length / 2);
    for (let i = 0; i < half; i++) {
      delete timestamps[entries[i][0]];
    }
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(timestamps));
    } catch {}
  }
}

export function isPreviewCached(url) {
  const timestamps = getCacheTimestamps();
  const ts = timestamps[url];
  if (!ts) return false;
  if (Date.now() - ts > CACHE_DURATION) {
    delete timestamps[url];
    saveCacheTimestamps(timestamps);
    return false;
  }
  return true;
}

export function markPreviewCached(url) {
  const timestamps = getCacheTimestamps();
  timestamps[url] = Date.now();
  saveCacheTimestamps(timestamps);
}

export function getPreviewUrl(url) {
  return `https://image.thum.io/get/width/300/crop/400/noanimate/${url}`;
}
