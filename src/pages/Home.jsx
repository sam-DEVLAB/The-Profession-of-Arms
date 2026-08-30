import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard';
import WorldMapGrid from '../components/WorldMapGrid';
import BlogShowcase from '../components/BlogShowcase';
import { getAllPosts } from '../posts';
import { getPostMetrics } from '../postMetrics';
import { siteConfig } from '../site.config';
import { getAssetUrl } from '../utils/assets';

const TYPING_PHRASES = [
  'SACRIFICED THEIR TODAY FOR OUR TOMORROW',
  'SERVED WITH UNFLINCHING VALOUR',
  'FACED DEATH IN THE EYE',
  'LIVED A LIFE LESS ORDINARY',
  'FOUGHT FOR THE MOTHERLAND AGAINST ALL ODDS',
];

/**
 * Home page — Interactive hero with world map grid, flippable avatar
 * that reveals Army/Navy/Air Force badges, and animated typing headline.
 */
export default function Home() {
  const posts = useMemo(() => getAllPosts(), []);
  const [postMetrics, setPostMetrics] = useState({});
  const [isFlipped, setIsFlipped] = useState(false);
  const [homeSearchQuery, setHomeSearchQuery] = useState('');

  useEffect(() => {
    const metrics = {};
    posts.forEach((post) => {
      metrics[post.slug] = getPostMetrics(post.slug);
    });
    setPostMetrics(metrics);
  }, [posts]);

  // Typewriter text animation matching shivenderkanwar.com
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentFullPhrase = TYPING_PHRASES[phraseIndex];
    let timer;

    if (!isDeleting && currentText === currentFullPhrase) {
      // Pause at end of phrase
      timer = setTimeout(() => setIsDeleting(true), 2200);
    } else if (isDeleting && currentText === '') {
      // Move to next phrase
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % TYPING_PHRASES.length);
    } else {
      // Type or delete single character
      const speed = isDeleting ? 38 : 75;
      timer = setTimeout(() => {
        setCurrentText((prev) =>
          isDeleting
            ? currentFullPhrase.substring(0, prev.length - 1)
            : currentFullPhrase.substring(0, prev.length + 1)
        );
      }, speed);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, phraseIndex]);

  useEffect(() => {
    const bgHero = `url("${getAssetUrl('mushishi-bg1.jpg')}")`;
    const bgStories = `url("${getAssetUrl('mushishi-bg.jpg')}")`;

    // Start with mushishi-bg1.jpg
    document.documentElement.style.setProperty('--bg-image', bgHero);

    const blogsEl = document.getElementById('blogs-section');
    if (!blogsEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            document.documentElement.style.setProperty('--bg-image', bgStories);
          } else {
            const rect = blogsEl.getBoundingClientRect();
            if (rect.top > 0) {
              document.documentElement.style.setProperty('--bg-image', bgHero);
            }
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -10% 0px',
      }
    );

    observer.observe(blogsEl);

    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty('--bg-image');
    };
  }, []);

  const avatarSrc = siteConfig.hero.avatar
    ? getAssetUrl(siteConfig.hero.avatar)
    : null;

  useEffect(() => {
    const imagesToPreload = [
      avatarSrc,
      getAssetUrl('Indian_Armed_Forces_Triservices.png'),
      getAssetUrl('Indian_Army_Circular_Insignia.png'),
      getAssetUrl('Indian_Navy_Insignia.png'),
      getAssetUrl('Indian_Air_Force_Crest.png'),
    ].filter(Boolean);

    imagesToPreload.forEach((src) => {
      const img = new Image();
      img.src = src;
      if (img.decode) {
        img.decode().catch(() => {});
      }
    });
  }, [avatarSrc]);

  const handleFlip = () => setIsFlipped((prev) => !prev);

  const filteredHomePosts = useMemo(() => {
    const q = homeSearchQuery.trim().toLowerCase();
    if (!q) return [];
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)))
    );
  }, [posts, homeSearchQuery]);

  const handleBadgeHover = (service) => {
    const titles = {
      army: 'THE INDIAN ARMY',
      navy: 'THE INDIAN NAVY',
      airforce: 'THE INDIAN AIR FORCE',
    };
    window.dispatchEvent(
      new CustomEvent('header-title-change', {
        detail: titles[service] || null,
      })
    );
  };

  return (
    <div className="home fade-in" id="home-page">
      {/* ---- Interactive Hero Section ---- */}
      <section className="home__hero" id="home-hero">
        <WorldMapGrid />

        <div className="home__hero-inner">
          {/* ---- Left Side: Animated Text & Tri-Services Slide-out ---- */}
          <div className="home__hero-left">
            {/* Front: Typing Headline */}
            <div
              className={`hero-content-face ${isFlipped ? 'hero-content-face--hidden' : 'hero-content-face--visible'}`}
            >
              <h2 className="home__hero-title">
                <span className="home__hero-title-prefix">IN HALLOWED MEMORIES OF THOSE WHO</span>
                <span className="home__hero-typed-wrapper">
                  <span className="home__hero-typed-text">{currentText}</span>
                  <span className="home__hero-cursor">|</span>
                </span>
              </h2>
            </div>

            {/* Back: Three armed forces logos sliding out (pure insignias, no text, themed glow) */}
            <div
              className={`hero-services-slideout ${isFlipped ? 'hero-services-slideout--visible' : 'hero-services-slideout--hidden'}`}
              onMouseLeave={() => handleBadgeHover(null)}
            >
              <div className="hero-services-logos">
                {/* Army */}
                <Link
                  to="/army"
                  className="hero-service-logo hero-service-logo--army"
                  title="The Indian Army"
                  onClick={(e) => e.stopPropagation()}
                  onMouseEnter={() => handleBadgeHover('army')}
                  onMouseLeave={() => handleBadgeHover(null)}
                >
                  <img
                    src={getAssetUrl('Indian_Army_Circular_Insignia.png')}
                    alt="Indian Army Insignia"
                    className="hero-service-logo__img"
                  />
                </Link>

                {/* Navy */}
                <Link
                  to="/navy"
                  className="hero-service-logo hero-service-logo--navy"
                  title="The Indian Navy"
                  onClick={(e) => e.stopPropagation()}
                  onMouseEnter={() => handleBadgeHover('navy')}
                  onMouseLeave={() => handleBadgeHover(null)}
                >
                  <img
                    src={getAssetUrl('Indian_Navy_Insignia.png')}
                    alt="Indian Navy Insignia"
                    className="hero-service-logo__img"
                  />
                </Link>

                {/* Air Force */}
                <Link
                  to="/airforce"
                  className="hero-service-logo hero-service-logo--airforce"
                  title="The Indian Air Force"
                  onClick={(e) => e.stopPropagation()}
                  onMouseEnter={() => handleBadgeHover('airforce')}
                  onMouseLeave={() => handleBadgeHover(null)}
                >
                  <img
                    src={getAssetUrl('Indian_Air_Force_Crest.png')}
                    alt="Indian Air Force Crest"
                    className="hero-service-logo__img"
                  />
                </Link>
              </div>
            </div>
          </div>

          {/* ---- Right Side: Flippable Avatar Area ---- */}
          <div className="home__hero-right">
            <div
              className={`hero-flip-container ${isFlipped ? 'hero-flip-container--flipped' : ''}`}
              onClick={handleFlip}
              role="button"
              tabIndex={0}
              aria-label={isFlipped ? 'Click to flip back' : 'Click to reveal armed forces badges'}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleFlip();
                }
              }}
            >
              {/* Front: Single profile photo with pure white glow */}
              <div className="hero-flip-front">
                {avatarSrc && (
                  <div className="home__hero-avatar-wrapper">
                    <img
                      src={avatarSrc}
                      alt={siteConfig.author || 'Avatar'}
                      className="home__hero-avatar"
                    />
                  </div>
                )}
                <p className="hero-flip-hint">Click photo to explore branches</p>
              </div>

              {/* Back: Tri-services emblem */}
              <div className="hero-flip-back">
                <div className="home__hero-avatar-wrapper home__hero-avatar-wrapper--back">
                  <img
                    src={getAssetUrl('Indian_Armed_Forces_Triservices.png')}
                    alt="Indian Armed Forces Triservices Emblem"
                    className="home__hero-avatar home__hero-avatar--back"
                  />
                </div>
                <p className="hero-flip-hint hero-flip-hint--back">Click to flip back ←</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div id="home-search" className="home__service-search">
        <label className="home__service-search-field">
          <span className="home__service-search-icon" aria-hidden="true">⌕</span>
          <input
            type="search"
            value={homeSearchQuery}
            onChange={(event) => setHomeSearchQuery(event.target.value)}
            onClick={() => {
              const el = document.getElementById('home-search');
              if (el) {
                const topOffset = 80;
                const elementPosition = el.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - topOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
              }
            }}
            onFocus={() => {
              const el = document.getElementById('home-search');
              if (el) {
                const topOffset = 80;
                const elementPosition = el.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - topOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
              }
            }}
            placeholder="Search stories by title, subject, or tag"
            aria-label="Search stories"
          />
        </label>

        {homeSearchQuery.trim() && (
          <div className="home__service-search-results" aria-live="polite">
            {filteredHomePosts.length > 0 ? (
              filteredHomePosts.slice(0, 5).map((post) => (
                <Link key={post.slug} to={`/blog/${post.slug}`} className="home__service-search-result">
                  <span>{post.title}</span>
                  <small>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</small>
                </Link>
              ))
            ) : (
              <p className="home__service-search-empty">No stories found for “{homeSearchQuery}”.</p>
            )}
          </div>
        )}
      </div>

      {/* ---- Posts ---- */}
      <section id="blogs-section">
        <h3 className="home__section-title">{siteConfig.hero.sectionTitle}</h3>
        <BlogShowcase posts={posts} metrics={postMetrics} />
      </section>

    </div>
  );
}
