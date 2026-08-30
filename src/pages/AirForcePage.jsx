import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard';
import { getAllPosts } from '../posts';
import { getAssetUrl } from '../utils/assets';

/**
 * AirForcePage — Dedicated page for the Indian Air Force with airforce.jpeg background.
 * Sky-blue and cyan theme with custom header font styling and Air Force stories.
 */
export default function AirForcePage() {
  const allPosts = getAllPosts();

  // Filter stories related to the Air Force
  const airForcePosts = allPosts.filter((p) =>
    (p.tags || []).some((t) => {
      const lower = t.toLowerCase();
      return (
        lower.includes('air force') ||
        lower.includes('airforce') ||
        lower.includes('iaf') ||
        lower.includes('sekhon') ||
        lower.includes('gnat') ||
        lower.includes('squadron')
      );
    })
  );

  useEffect(() => {
    const bg = `url("${getAssetUrl('airforce.jpeg')}")`;
    document.documentElement.style.setProperty('--bg-image', bg);
    document.documentElement.style.setProperty(
      '--service-overlay',
      'linear-gradient(180deg, rgba(2,12,28,0.70) 0%, rgba(4,20,44,0.55) 40%, rgba(2,12,28,0.76) 100%)'
    );

    return () => {
      document.documentElement.style.removeProperty('--bg-image');
      document.documentElement.style.removeProperty('--service-overlay');
    };
  }, []);

  return (
    <div className="service-page service-page--airforce fade-in">
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
            src={getAssetUrl('Indian_Air_Force_Crest.png')}
            alt="Indian Air Force Crest"
            className="service-page__avatar"
          />
        </div>
        <p className="service-page__service-label">भारतीय वायु सेना</p>
        <h1 className="service-page__title">The Air Force</h1>
        <p className="service-page__motto service-page__motto--airforce">"नभः स्पृशं दीप्तम् — Touch the Sky with Glory"</p>
      </div>

      {/* Content */}
      <div className="service-page__content">
        <div className="service-page__glass-card blog-text-box">
          <h2 className="service-page__section-heading">Lords of the Skies</h2>
          <p className="service-page__body">
            The Indian Air Force (IAF) is the air arm of the Indian Armed Forces. It is the world's
            fourth-largest air force. Its primary mission is to secure Indian airspace and conduct
            aerial warfare during armed conflict. It also provides close air support to ground and
            naval forces, and humanitarian assistance.
          </p>
          <p className="service-page__body">
            Established on 8 October 1932 as an auxiliary air force of the British Empire, the IAF
            gained independence in 1950. Its motto, derived from the Bhagavad Gita, embodies the
            IAF's aspiration for glory and excellence. The IAF is commanded by the Chief of Air Staff (CAS).
          </p>
        </div>

        <div className="service-page__stats-grid">
          <div className="service-page__stat-card service-page__stat-card--airforce">
            <span className="service-page__stat-value">140K+</span>
            <span className="service-page__stat-label">Active Personnel</span>
          </div>
          <div className="service-page__stat-card service-page__stat-card--airforce">
            <span className="service-page__stat-value">1932</span>
            <span className="service-page__stat-label">Founded</span>
          </div>
          <div className="service-page__stat-card service-page__stat-card--airforce">
            <span className="service-page__stat-value">1,700+</span>
            <span className="service-page__stat-label">Aircraft</span>
          </div>
          <div className="service-page__stat-card service-page__stat-card--airforce">
            <span className="service-page__stat-value">7</span>
            <span className="service-page__stat-label">Air Commands</span>
          </div>
        </div>

        {/* Service Related Stories */}
        <div className="service-page__stories-section">
          <h2 className="service-page__section-heading">Stories of The Air Force</h2>
          <div className="service-page__posts-grid">
            {airForcePosts.map((post) => (
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
            {airForcePosts.length === 0 && (
              <p className="service-page__no-posts">No air force stories published yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
