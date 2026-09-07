import { siteConfig } from '../site.config.js';

/**
 * metricsDatabase.js
 *
 * Provides resilient, zero-crash cloud persistence for blog post metrics (reads & likes).
 * Features:
 *  - Offline-first / zero-delay caching via localStorage.
 *  - Firebase Realtime Database REST API integration (no bulky SDK required).
 *  - Event-driven reactive UI updates via 'poa-metrics-updated' custom event.
 *  - Timeout & error shielding (network failures or ad-blockers never crash the UI).
 */

const STORAGE_KEY_PREFIX = 'poa_cloud_metrics_';
const METRICS_EVENT = 'poa-metrics-updated';

function getDbUrl() {
  const customUrl = siteConfig?.metrics?.firebaseDatabaseUrl;
  if (customUrl && typeof customUrl === 'string' && customUrl.trim()) {
    return customUrl.trim().replace(/\/+$/, '');
  }
  return '';
}

/**
 * Dispatches an event across the window so all components update immediately.
 */
export function dispatchMetricsUpdate(slug) {
  if (typeof window === 'undefined') return;
  try {
    window.dispatchEvent(
      new CustomEvent(METRICS_EVENT, {
        detail: { slug },
      })
    );
  } catch {
    // Ignore event dispatch errors
  }
}

/**
 * Get cached delta metrics from localStorage.
 */
export function getCachedMetricsDelta(slug) {
  if (typeof window === 'undefined') return { readsDelta: 0, likesDelta: 0 };
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${slug}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        readsDelta: Number(parsed.readsDelta) || 0,
        likesDelta: Number(parsed.likesDelta) || 0,
      };
    }
  } catch {
    // Ignore storage parse errors
  }
  return { readsDelta: 0, likesDelta: 0 };
}

/**
 * Save cached delta metrics to localStorage.
 */
export function setCachedMetricsDelta(slug, delta) {
  if (typeof window === 'undefined') return;
  try {
    const current = getCachedMetricsDelta(slug);
    const updated = {
      readsDelta: typeof delta.readsDelta === 'number' ? Math.max(0, delta.readsDelta) : current.readsDelta,
      likesDelta: typeof delta.likesDelta === 'number' ? Math.max(0, delta.likesDelta) : current.likesDelta,
      updatedAt: Date.now(),
    };
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${slug}`, JSON.stringify(updated));
    dispatchMetricsUpdate(slug);
  } catch {
    // Ignore storage write errors
  }
}

/**
 * Fetch remote metrics for a specific post slug.
 */
export async function fetchRemoteMetrics(slug) {
  const dbUrl = getDbUrl();
  if (!dbUrl) {
    return getCachedMetricsDelta(slug);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`${dbUrl}/metrics/${slug}.json`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && typeof data === 'object') {
        const readsDelta = Number(data.readsDelta || data.reads) || 0;
        const likesDelta = Number(data.likesDelta || data.likes) || 0;
        const delta = { readsDelta, likesDelta };
        setCachedMetricsDelta(slug, delta);
        return delta;
      }
    }
  } catch {
    // Network failure or timeout: silently fall back to cached local state
  }

  return getCachedMetricsDelta(slug);
}

/**
 * Batch fetch all remote metrics for all posts.
 */
export async function fetchAllRemoteMetrics() {
  const dbUrl = getDbUrl();
  if (!dbUrl) return;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`${dbUrl}/metrics.json`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const allData = await res.json();
      if (allData && typeof allData === 'object') {
        Object.entries(allData).forEach(([slug, data]) => {
          if (data && typeof data === 'object') {
            const readsDelta = Number(data.readsDelta || data.reads) || 0;
            const likesDelta = Number(data.likesDelta || data.likes) || 0;
            setCachedMetricsDelta(slug, { readsDelta, likesDelta });
          }
        });
        dispatchMetricsUpdate('__all__');
      }
    }
  } catch {
    // Ignore batch fetch errors
  }
}

/**
 * Increment remote read count.
 */
export async function incrementRemoteRead(slug) {
  // 1. Optimistically update local cache immediately
  const cached = getCachedMetricsDelta(slug);
  const nextReads = cached.readsDelta + 1;
  setCachedMetricsDelta(slug, { readsDelta: nextReads });

  const dbUrl = getDbUrl();
  if (!dbUrl) return nextReads;

  // 2. Sync to cloud database in background
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    // Fetch latest cloud value first to prevent overwrite
    const getRes = await fetch(`${dbUrl}/metrics/${slug}/readsDelta.json`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    let remoteValue = nextReads;
    if (getRes.ok) {
      const currentVal = await getRes.json();
      if (typeof currentVal === 'number') {
        remoteValue = Math.max(currentVal + 1, nextReads);
      }
    }

    await fetch(`${dbUrl}/metrics/${slug}/readsDelta.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(remoteValue),
    });

    setCachedMetricsDelta(slug, { readsDelta: remoteValue });
    return remoteValue;
  } catch {
    // If offline or network error, cached local state remains intact
    return nextReads;
  }
}

/**
 * Update remote like count (+1 or -1).
 */
export async function updateRemoteLikeDelta(slug, changeAmount) {
  // 1. Optimistically update local cache immediately
  const cached = getCachedMetricsDelta(slug);
  const nextLikes = Math.max(0, cached.likesDelta + changeAmount);
  setCachedMetricsDelta(slug, { likesDelta: nextLikes });

  const dbUrl = getDbUrl();
  if (!dbUrl) return nextLikes;

  // 2. Sync to cloud database in background
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    const getRes = await fetch(`${dbUrl}/metrics/${slug}/likesDelta.json`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    let remoteValue = nextLikes;
    if (getRes.ok) {
      const currentVal = await getRes.json();
      if (typeof currentVal === 'number') {
        remoteValue = Math.max(0, currentVal + changeAmount);
      }
    }

    await fetch(`${dbUrl}/metrics/${slug}/likesDelta.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(remoteValue),
    });

    setCachedMetricsDelta(slug, { likesDelta: remoteValue });
    return remoteValue;
  } catch {
    return nextLikes;
  }
}
