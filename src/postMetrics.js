export function getPostMetrics(slug) {
  let likes = 0;
  let comments = 0;
  let reads = 0;

  try {
    const storedLikes = JSON.parse(localStorage.getItem(`pe_likes_${slug}`) || '{}');
    const storedComments = JSON.parse(localStorage.getItem(`pe_comments_${slug}`) || '[]');
    likes = Number(storedLikes.count) || 0;
    comments = Array.isArray(storedComments) ? storedComments.length : 0;
    reads = Number(localStorage.getItem(`pe_reads_${slug}`)) || 0;
  } catch {
    // Ignore localStorage errors.
  }

  return { reads, likes, comments };
}

export function recordPostRead(slug) {
  const metrics = getPostMetrics(slug);
  const reads = metrics.reads + 1;

  try {
    localStorage.setItem(`pe_reads_${slug}`, String(reads));
  } catch {
    // Ignore localStorage errors.
  }

  return { ...metrics, reads };
}
