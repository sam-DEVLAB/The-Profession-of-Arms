import { siteConfig } from './site.config.js';
import {
  getCachedMetricsDelta,
  incrementRemoteRead,
  updateRemoteLikeDelta,
  fetchRemoteMetrics,
  fetchAllRemoteMetrics,
} from './services/metricsDatabase.js';

/**
 * postMetrics.js
 *
 * Centralized Metrics Controller for The Profession of Arms.
 * Combines configurable baseline offsets (e.g. 1000 reads, 600 likes)
 * with persistent cloud database increments across all visitors and devices.
 */

const USER_LIKED_PREFIX = 'pe_user_liked_';
const SESSION_READ_PREFIX = 'pe_session_read_';

/**
 * Resolves baseline numbers for a post (frontmatter overrides or global defaults).
 */
export function getBaselineReads(meta = {}) {
  const custom = Number(meta.baselineReads ?? meta.reads_offset ?? meta.initialReads);
  if (Number.isFinite(custom) && custom >= 0) return custom;
  return Number(siteConfig?.metrics?.defaultBaselineReads) || 0;
}

export function getBaselineLikes(meta = {}) {
  const custom = Number(meta.baselineLikes ?? meta.likes_offset ?? meta.initialLikes);
  if (Number.isFinite(custom) && custom >= 0) return custom;
  return Number(siteConfig?.metrics?.defaultBaselineLikes) || 0;
}

/**
 * Get current metrics (reads, likes, comments) for a post.
 */
export function getPostMetrics(slug, meta = {}) {
  const baseReads = getBaselineReads(meta);
  const baseLikes = getBaselineLikes(meta);
  const delta = getCachedMetricsDelta(slug);

  let commentsCount = 0;
  try {
    const storedComments = JSON.parse(localStorage.getItem(`pe_comments_${slug}`) || '[]');
    commentsCount = Array.isArray(storedComments) ? storedComments.length : 0;
  } catch {
    // Ignore storage parse errors
  }

  const reads = baseReads + (delta.readsDelta || 0);
  const likes = baseLikes + (delta.likesDelta || 0);

  return { reads, likes, comments: commentsCount };
}

/**
 * Record a read event for a post (increment cloud & local count).
 */
export function recordPostRead(slug, meta = {}) {
  let alreadyReadThisSession = false;
  try {
    alreadyReadThisSession = sessionStorage.getItem(`${SESSION_READ_PREFIX}${slug}`) === '1';
    if (!alreadyReadThisSession) {
      sessionStorage.setItem(`${SESSION_READ_PREFIX}${slug}`, '1');
    }
  } catch {
    // Ignore sessionStorage errors
  }

  // Only increment if newly read in this session (avoids spam on page refreshes)
  if (!alreadyReadThisSession) {
    incrementRemoteRead(slug);
  }

  return getPostMetrics(slug, meta);
}

/**
 * Check if the current device/visitor has liked this post.
 */
export function getUserLikeStatus(slug) {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(`${USER_LIKED_PREFIX}${slug}`) === 'true';
  } catch {
    return false;
  }
}

/**
 * Toggle like for the current visitor on this device (+1 or -1 globally).
 */
export function togglePostLike(slug, meta = {}) {
  const currentlyLiked = getUserLikeStatus(slug);
  const nextLiked = !currentlyLiked;

  try {
    localStorage.setItem(`${USER_LIKED_PREFIX}${slug}`, String(nextLiked));
  } catch {
    // Ignore localStorage write error
  }

  const changeAmount = nextLiked ? 1 : -1;
  updateRemoteLikeDelta(slug, changeAmount);

  const updatedMetrics = getPostMetrics(slug, meta);
  return { liked: nextLiked, metrics: updatedMetrics };
}

/**
 * Background synchronizer: fetch metrics for all posts from cloud database.
 */
export function syncAllPostMetrics() {
  fetchAllRemoteMetrics();
}

/**
 * Background synchronizer: fetch metrics for a single post from cloud database.
 */
export function syncSinglePostMetrics(slug) {
  fetchRemoteMetrics(slug);
}
