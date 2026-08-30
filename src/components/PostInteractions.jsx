import { useState, useEffect } from 'react';

/**
 * PostInteractions — Like button, comment section, and toggleable
 * GitHub & AllPoetry social link widgets for blog posts.
 */
export default function PostInteractions({ slug, allpoetry, onMetricsChange, showCounts = true }) {
  const likeKey = `pe_likes_${slug}`;
  const commentKey = `pe_comments_${slug}`;

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [showComments, setShowComments] = useState(false);

  // Social cards toggle states
  const [showAllPoetryCard, setShowAllPoetryCard] = useState(false);
  const [allpoetryCopied, setAllpoetryCopied] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedLikes = localStorage.getItem(likeKey);
      if (storedLikes) {
        const parsed = JSON.parse(storedLikes);
        setLiked(parsed.liked || false);
        setLikeCount(parsed.count || 0);
      }

      const storedComments = localStorage.getItem(commentKey);
      if (storedComments) {
        setComments(JSON.parse(storedComments));
      }

      const savedName = localStorage.getItem('pe_author_name');
      if (savedName) {
        setAuthorName(savedName);
      }

      onMetricsChange?.({
        reads: 0,
        likes: storedLikes ? JSON.parse(storedLikes).count || 0 : 0,
        comments: storedComments ? JSON.parse(storedComments).length : 0,
      });
    } catch {
      // Ignore localStorage errors
    }
  }, [likeKey, commentKey]);

  function handleLike() {
    const newLiked = !liked;
    const newCount = newLiked ? likeCount + 1 : Math.max(0, likeCount - 1);
    setLiked(newLiked);
    setLikeCount(newCount);
    try {
      localStorage.setItem(likeKey, JSON.stringify({ liked: newLiked, count: newCount }));
    } catch {
      // Ignore
    }
    onMetricsChange?.({ reads: 0, likes: newCount, comments: comments.length });
  }

  function handleSubmitComment(e) {
    e.preventDefault();
    const trimmed = commentText.trim();
    if (!trimmed) return;

    const name = authorName.trim() || 'Anonymous';
    const newComment = {
      id: Date.now().toString(),
      author: name,
      text: trimmed,
      date: new Date().toISOString(),
    };

    const updated = [newComment, ...comments];
    setComments(updated);
    setCommentText('');

    try {
      localStorage.setItem(commentKey, JSON.stringify(updated));
      if (authorName.trim()) {
        localStorage.setItem('pe_author_name', authorName.trim());
      }
    } catch {
      // Ignore
    }
    onMetricsChange?.({ reads: 0, likes: likeCount, comments: updated.length });
  }

  function handleDeleteComment(commentId) {
    const updated = comments.filter((c) => c.id !== commentId);
    setComments(updated);
    try {
      localStorage.setItem(commentKey, JSON.stringify(updated));
    } catch {
      // Ignore
    }
    onMetricsChange?.({ reads: 0, likes: likeCount, comments: updated.length });
  }

  async function handleCopy(url, type) {
    if (!url) return;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = url;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      if (type === 'allpoetry') {
        setAllpoetryCopied(true);
        setTimeout(() => setAllpoetryCopied(false), 2200);
      }
    } catch {
      // Clipboard fallback error handling
    }
  }

  function formatDate(iso) {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <div className="interactions" id={`interactions-${slug}`}>
      {/* Primary Actions Bar */}
      <div className="interactions__actions">
        {/* Like Button */}
        <button
          className={`interactions__btn interactions__like-btn ${liked ? 'interactions__like-btn--liked' : ''}`}
          onClick={handleLike}
          aria-label={liked ? 'Unlike this post' : 'Like this post'}
          id={`like-btn-${slug}`}
        >
          <span className="interactions__like-icon" aria-hidden="true">
            {liked ? (
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M7 10V20H4.5A1.5 1.5 0 0 1 3 18.5V11.5A1.5 1.5 0 0 1 4.5 10H7ZM10 10L12.5 3.8A2 2 0 0 1 14.3 3c.8 0 1.5.5 1.8 1.2L16.8 8H18.7A2.3 2.3 0 0 1 21 10.3l-1.2 7.1A2.3 2.3 0 0 1 17.5 19H10V10Z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M7 10V20H4.5A1.5 1.5 0 0 1 3 18.5V11.5A1.5 1.5 0 0 1 4.5 10H7Z" />
                <path d="M10 10L12.5 3.8A2 2 0 0 1 14.3 3c.8 0 1.5.5 1.8 1.2L16.8 8H18.7A2.3 2.3 0 0 1 21 10.3l-1.2 7.1A2.3 2.3 0 0 1 17.5 19H10V10Z" />
              </svg>
            )}
          </span>
          {showCounts && <span className="interactions__like-count">{likeCount}</span>}
        </button>

        {/* Comments Toggle */}
        <button
          className={`interactions__btn interactions__comment-toggle ${showComments ? 'interactions__btn--active' : ''}`}
          onClick={() => {
            setShowComments(!showComments);
          }}
          aria-label="Toggle comments"
          aria-expanded={showComments}
          id={`comment-toggle-${slug}`}
        >
          <span className="interactions__comment-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 18.5V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-4l-4 3v-2.5Z" />
            </svg>
          </span>
          {showCounts && <span className="interactions__comment-count">{comments.length}</span>}
        </button>

        {/* AllPoetry Toggle Button (shown if post has allpoetry link) */}
        {allpoetry && (
          <button
            className={`interactions__btn interactions__social-btn interactions__allpoetry-btn ${showAllPoetryCard ? 'interactions__allpoetry-btn--active' : ''}`}
            onClick={() => {
              setShowAllPoetryCard(!showAllPoetryCard);
            }}
            aria-label="Toggle AllPoetry profile details"
            aria-expanded={showAllPoetryCard}
            title="AllPoetry Profile / Poems"
            id={`allpoetry-toggle-${slug}`}
          >
            <svg
              className="interactions__btn-svg"
              viewBox="0 0 24 24"
              width="15"
              height="15"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
              <line x1="16" y1="8" x2="2" y2="22" />
              <line x1="17.5" y1="15" x2="9" y2="15" />
            </svg>
            <span className="interactions__btn-label">AllPoetry</span>
          </button>
        )}
      </div>

      {/* AllPoetry Expandable Preview Card */}
      {showAllPoetryCard && allpoetry && (
        <div className="interactions__drawer interactions__drawer--allpoetry" id={`allpoetry-card-${slug}`}>
          <div className="interactions__drawer-header">
            <div className="interactions__drawer-title-group">
              <svg
                className="interactions__drawer-icon interactions__drawer-icon--allpoetry"
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
                <line x1="16" y1="8" x2="2" y2="22" />
                <line x1="17.5" y1="15" x2="9" y2="15" />
              </svg>
              <div>
                <h4 className="interactions__drawer-heading">AllPoetry</h4>
                <p className="interactions__drawer-sub">Read original poems, stanzas & verses</p>
              </div>
            </div>
            <button
              className="interactions__drawer-close"
              onClick={() => setShowAllPoetryCard(false)}
              aria-label="Close AllPoetry preview"
            >
              ×
            </button>
          </div>

          <div className="interactions__drawer-body">
            <code className="interactions__drawer-url" title={allpoetry}>
              {allpoetry}
            </code>

            <div className="interactions__drawer-actions">
              <a
                href={allpoetry}
                target="_blank"
                rel="noopener noreferrer"
                className="interactions__drawer-link interactions__drawer-link--allpoetry"
                id={`allpoetry-link-${slug}`}
              >
                <span>Read on AllPoetry</span>
                <span className="interactions__drawer-arrow">↗</span>
              </a>

              <button
                type="button"
                className={`interactions__drawer-copy ${allpoetryCopied ? 'interactions__drawer-copy--copied' : ''}`}
                onClick={() => handleCopy(allpoetry, 'allpoetry')}
                id={`allpoetry-copy-${slug}`}
              >
                {allpoetryCopied ? '✓ Copied URL' : '📋 Copy Link'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comments Section */}
      {showComments && (
        <div className="interactions__comments" id={`comments-${slug}`}>
          <h4 className="interactions__comments-title">
            Comments ({comments.length})
          </h4>

          {/* Comment Form */}
          <form className="interactions__form" onSubmit={handleSubmitComment}>
            <input
              type="text"
              className="interactions__input interactions__input--name"
              placeholder="Your name (optional)"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              maxLength={50}
              id={`comment-name-${slug}`}
            />
            <textarea
              className="interactions__input interactions__input--text"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              maxLength={1000}
              rows={3}
              id={`comment-text-${slug}`}
            />
            <button
              type="submit"
              className="interactions__submit"
              disabled={!commentText.trim()}
              id={`comment-submit-${slug}`}
            >
              Post Comment
            </button>
          </form>

          {/* Comment List */}
          {comments.length > 0 && (
            <div className="interactions__comment-list">
              {comments.map((comment) => (
                <div key={comment.id} className="interactions__comment" id={`comment-${comment.id}`}>
                  <div className="interactions__comment-header">
                    <span className="interactions__comment-author">{comment.author}</span>
                    <span className="interactions__comment-date">{formatDate(comment.date)}</span>
                    <button
                      className="interactions__comment-delete"
                      onClick={() => handleDeleteComment(comment.id)}
                      aria-label="Delete comment"
                      title="Delete comment"
                    >
                      ×
                    </button>
                  </div>
                  <p className="interactions__comment-text">{comment.text}</p>
                </div>
              ))}
            </div>
          )}

          {comments.length === 0 && (
            <p className="interactions__no-comments">
              No comments yet. Be the first to share your thoughts.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

