import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard';
import { getAllPosts } from '../posts';

/**
 * NavyPage — Dedicated page for the Indian Navy with navy.jpg background.
 * Oceanic navy-blue and gold theme with custom header font styling and Navy stories.
 */
export default function NavyPage() {
  const basePath = import.meta.env.BASE_URL || '/';
  const allPosts = getAllPosts();

  // Filter stories related to the Navy
  const navyPosts = allPosts.filter((p) =>
    (p.tags || []).some((t) => {
      const lower = t.toLowerCase();
      return (
        lower.includes('navy') ||
        lower.includes('trident') ||
        lower.includes('maritime') ||
        lower.includes('killer squadron')
      );
    })
  );

  useEffect(() => {
    const bg = `url("${basePath}navy.jpg")`;
    document.documentElement.style.setProperty('--bg-image', bg);
    document.documentElement.style.setProperty(
      '--service-overlay',
      'linear-gradient(180deg, rgba(2,8,30,0.75) 0%, rgba(4,14,52,0.60) 40%, rgba(2,8,30,0.80) 100%)'
    );

    return () => {
      document.documentElement.style.removeProperty('--bg-image');
      document.documentElement.style.removeProperty('--service-overlay');
    };
  }, [basePath]);

  return (
    <div className="service-page service-page--navy fade-in">
      {/* Back button */}
      <Link to="/" className="service-page__back" aria-label="Back to Home" title="Back to Home">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="m3 10 9-7 9 7" />
          <path d="M5 9v11h14V9M9 20v-6h6v6" />
        </svg>
      </Link>

      {/* Profile picture & title displayed at the top of the page */}
      <div className="service-page__hero-top">
        <div className="service-page__avatar-wrapper">
          <img
            src={`${basePath}Indian_Navy_Insignia.png`}
            alt="Indian Navy Insignia"
            className="service-page__avatar"
          />
        </div>
        <p className="service-page__service-label">भारतीय नौसेना</p>
        <h1 className="service-page__title">The Navy</h1>
        <p className="service-page__motto service-page__motto--navy">"शं नो वरुणः — May Varuna be auspicious to us"</p>
      </div>

      {/* Content */}
      <div className="service-page__content">
        <div className="service-page__glass-card blog-text-box">
          <h2 className="service-page__section-heading">Masters of the Seas</h2>
          <p className="service-page__body">
            The Indian Navy is the naval branch of the Indian Armed Forces. It is the world's
            seventh-largest navy by fleet size. Its primary objectives are to safeguard India's
            coastline and maritime interests, project force at sea, and conduct humanitarian
            assistance operations across the Indian Ocean Region.
          </p>
          <p className="service-page__body">
            With a heritage tracing back to the Maratha Empire's naval forces in the 17th century,
            the modern Indian Navy was formally constituted after independence in 1947. The Navy is
            headquartered in New Delhi and is commanded by the Chief of Naval Staff (CNS).
          </p>
        </div>

        <div className="service-page__stats-grid">
          <div className="service-page__stat-card service-page__stat-card--navy">
            <span className="service-page__stat-value">67K+</span>
            <span className="service-page__stat-label">Active Personnel</span>
          </div>
          <div className="service-page__stat-card service-page__stat-card--navy">
            <span className="service-page__stat-value">1612</span>
            <span className="service-page__stat-label">Founded (Maratha Navy)</span>
          </div>
          <div className="service-page__stat-card service-page__stat-card--navy">
            <span className="service-page__stat-value">150+</span>
            <span className="service-page__stat-label">Vessels</span>
          </div>
          <div className="service-page__stat-card service-page__stat-card--navy">
            <span className="service-page__stat-value">3</span>
            <span className="service-page__stat-label">Naval Commands</span>
          </div>
        </div>

        {/* Service Related Stories */}
        <div className="service-page__stories-section">
          <h2 className="service-page__section-heading">Stories of The Navy</h2>
          <div className="service-page__posts-grid">
            {navyPosts.map((post) => (
              <PostCard
                key={post.slug}
                slug={post.slug}
                title={post.title}
                date={post.date}
                tags={post.tags}
                excerpt={post.excerpt}
                icon={post.icon}
              />
            ))}
            {navyPosts.length === 0 && (
              <p className="service-page__no-posts">No navy stories published yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
