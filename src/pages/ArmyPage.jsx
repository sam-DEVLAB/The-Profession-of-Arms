import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard';
import { getAllPosts } from '../posts';

/**
 * ArmyPage — Dedicated page for the Indian Army with army.jpg background.
 * Military olive-green colour theme with custom header font styling and Army stories.
 */
export default function ArmyPage() {
  const basePath = import.meta.env.BASE_URL || '/';
  const allPosts = getAllPosts();
  
  // Filter stories related to the Army
  const armyPosts = allPosts.filter((p) =>
    (p.tags || []).some((t) => {
      const lower = t.toLowerCase();
      return (
        lower.includes('army') ||
        lower.includes('kumaon') ||
        lower.includes('jak rif') ||
        lower.includes('poona horse') ||
        lower.includes('kargil') ||
        lower.includes('basantar') ||
        lower.includes('badgam')
      );
    })
  );

  useEffect(() => {
    const bg = `url("${basePath}army.jpg")`;
    document.documentElement.style.setProperty('--bg-image', bg);
    document.documentElement.style.setProperty(
      '--service-overlay',
      'linear-gradient(180deg, rgba(12,20,8,0.82) 0%, rgba(22,34,14,0.66) 40%, rgba(12,20,8,0.86) 100%)'
    );

    return () => {
      document.documentElement.style.removeProperty('--bg-image');
      document.documentElement.style.removeProperty('--service-overlay');
    };
  }, [basePath]);

  return (
    <div className="service-page service-page--army fade-in">
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
            src={`${basePath}Indian_Army_Circular_Insignia.png`}
            alt="Indian Army Insignia"
            className="service-page__avatar"
          />
        </div>
        <p className="service-page__service-label">भारतीय थल सेना</p>
        <h1 className="service-page__title">The Army</h1>
        <p className="service-page__motto service-page__motto--army">"Service Before Self"</p>
      </div>

      {/* Content */}
      <div className="service-page__content">
        <div className="service-page__glass-card blog-text-box">
          <h2 className="service-page__section-heading">The Guardians of the Land</h2>
          <p className="service-page__body">
            The Indian Army is the land-based branch of the Indian Armed Forces. It is the world's
            second-largest standing army and is responsible for defending India from external aggression
            and internal threats, as well as maintaining peace and security within its borders.
          </p>
          <p className="service-page__body">
            Founded on 1 April 1895 during the British Raj, it became the Indian Army after India's
            independence in 1947. The Army's supreme commander is the President of India, and it is
            commanded by the Chief of Army Staff (COAS), who holds the rank of General.
          </p>
        </div>

        <div className="service-page__stats-grid">
          <div className="service-page__stat-card service-page__stat-card--army">
            <span className="service-page__stat-value">1.4M+</span>
            <span className="service-page__stat-label">Active Personnel</span>
          </div>
          <div className="service-page__stat-card service-page__stat-card--army">
            <span className="service-page__stat-value">1895</span>
            <span className="service-page__stat-label">Founded</span>
          </div>
          <div className="service-page__stat-card service-page__stat-card--army">
            <span className="service-page__stat-value">21</span>
            <span className="service-page__stat-label">Corps</span>
          </div>
          <div className="service-page__stat-card service-page__stat-card--army">
            <span className="service-page__stat-value">6</span>
            <span className="service-page__stat-label">Operational Commands</span>
          </div>
        </div>

        {/* Service Related Stories */}
        <div className="service-page__stories-section">
          <h2 className="service-page__section-heading">Stories of The Army</h2>
          <div className="service-page__posts-grid">
            {armyPosts.map((post) => (
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
            {armyPosts.length === 0 && (
              <p className="service-page__no-posts">No army stories published yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
