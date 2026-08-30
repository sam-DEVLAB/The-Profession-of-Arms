import { Link } from 'react-router-dom';

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function FeatureCard({ post, label, metricLabel, metricValue, className = '' }) {
  return (
    <Link to={`/blog/${post.slug}`} className={`blog-showcase__feature ${className}`}>
      <div className="blog-showcase__thumb">
        {post.icon && <img src={post.icon} alt="" loading="lazy" />}
      </div>
      <div className="blog-showcase__feature-copy">
        <span className="blog-showcase__label">{label}</span>
        <h3>{post.title}</h3>
        {post.excerpt && <p>{post.excerpt}</p>}
        <div className="blog-showcase__byline">
          <span>{formatDate(post.date)}</span>
          <span>{metricValue} {metricLabel}</span>
        </div>
      </div>
    </Link>
  );
}

export default function BlogShowcase({ posts, metrics }) {
  if (posts.length === 0) {
    return <p className="loading">No blogs found.</p>;
  }

  const latest = posts[0];
  const mostLiked = [...posts].sort((a, b) => (metrics[b.slug]?.likes || 0) - (metrics[a.slug]?.likes || 0))[0];
  const mostRead = [...posts].sort((a, b) => (metrics[b.slug]?.reads || 0) - (metrics[a.slug]?.reads || 0))[0];

  return (
    <div className="blog-showcase">
      <div className="blog-showcase__left">
        <FeatureCard
          post={mostLiked}
          label="Most liked"
          metricLabel="likes"
          metricValue={metrics[mostLiked.slug]?.likes || 0}
        />
        <FeatureCard
          post={mostRead}
          label="Most read"
          metricLabel="reads"
          metricValue={metrics[mostRead.slug]?.reads || 0}
        />
      </div>

      <FeatureCard
        post={latest}
        label="Latest blog"
        metricLabel="reads"
        metricValue={metrics[latest.slug]?.reads || 0}
        className="blog-showcase__feature--latest"
      />

      <aside className="blog-showcase__list" aria-label="All blogs">
        <h2>All blogs</h2>
        <div className="blog-showcase__list-items">
          {posts.map((post) => (
            <Link to={`/blog/${post.slug}`} className="blog-showcase__list-item" key={post.slug}>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <span>{formatDate(post.date)}</span>
            </Link>
          ))}
        </div>
      </aside>
    </div>
  );
}
