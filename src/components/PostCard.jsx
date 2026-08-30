import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getPostMetrics } from '../postMetrics';

/**
 * PostCard — Preview card for a blog post on the home listing.
 * Includes a right-side container for the post icon/thumbnail if specified in frontmatter.
 */
export default function PostCard({ slug, title, date, tags, excerpt, icon, backgroundImage, className = '' }) {
  const [metrics, setMetrics] = useState({ reads: 0, likes: 0, comments: 0 });

  useEffect(() => {
    setMetrics(getPostMetrics(slug));
  }, [slug]);

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link
      to={`/blog/${slug}`}
      className={`post-card ${icon ? 'post-card--has-cover' : ''} ${className}`}
      id={`post-card-${slug}`}
      style={backgroundImage ? {
        backgroundImage: `linear-gradient(135deg, rgba(8, 14, 38, 0.88), rgba(8, 14, 38, 0.68)), url("${backgroundImage}")`,
      } : undefined}
    >
      {icon && (
        <div className="post-card__cover" aria-hidden="true">
          <img
            src={icon}
            alt=""
            className="post-card__icon"
            loading="lazy"
          />
        </div>
      )}

      <div className="post-card__content">
        <time className="post-card__date" dateTime={date}>
          {formattedDate}
        </time>
        <h2 className="post-card__title">{title}</h2>
        {excerpt && <p className="post-card__excerpt">{excerpt}</p>}
        <div className="post-card__metrics" aria-label="Post activity">
          <span>{metrics.reads} reads</span>
          <span>{metrics.likes} likes</span>
          <span>{metrics.comments} comments</span>
        </div>
      </div>
    </Link>
  );
}
