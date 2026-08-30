import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { siteConfig } from '../site.config';

/**
 * Header — Blog title and navigation links from site.config.js
 * Supports dynamic fluid animated title transitions on service badge hover.
 */
export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [customTitle, setCustomTitle] = useState(null);
  const [previewWord, setPreviewWord] = useState(null);

  const pathname = location.pathname;
  const isArmy = pathname === '/army';
  const isNavy = pathname === '/navy';
  const isAirForce = pathname === '/airforce';
  const isServicePage = isArmy || isNavy || isAirForce;

  const serviceWord = customTitle ? customTitle.replace('THE INDIAN ', '') : null;

  useEffect(() => {
    const handleTitleChange = (e) => {
      setCustomTitle(e.detail || null);
    };

    window.addEventListener('header-title-change', handleTitleChange);
    return () => {
      window.removeEventListener('header-title-change', handleTitleChange);
    };
  }, []);

  useEffect(() => {
    setPreviewWord(serviceWord);
  }, [serviceWord]);

  let serviceThemeClass = '';
  const upperCustom = (customTitle || '').toUpperCase();
  if (isArmy || upperCustom.includes('ARMY')) {
    serviceThemeClass = 'header--army';
  } else if (isNavy || upperCustom.includes('NAVY')) {
    serviceThemeClass = 'header--navy';
  } else if (isAirForce || upperCustom.includes('AIR FORCE')) {
    serviceThemeClass = 'header--airforce';
  }

  const activeClass = customTitle ? 'header--service-active' : '';
  const pageClass = isServicePage ? 'header--service-page' : '';

  const handleBlogClick = (event) => {
    event.preventDefault();

    if (location.pathname === '/') {
      document.getElementById('blogs-section')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    navigate('/');
    window.setTimeout(() => {
      document.getElementById('blogs-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  };

  return (
    <header
      className={`header ${serviceThemeClass} ${activeClass} ${pageClass}`}
      id="site-header"
    >
      <div className="header__inner">
        <div className="header__brand">
          <h1 className="header__title">
            <Link to="/" className="header__title-link">
              <span className="header__title-text header__title-text--idle">
                {siteConfig.title}
              </span>
            </Link>
          </h1>
          <div className={`header__service-preview ${previewWord ? 'header__service-preview--visible' : ''}`} aria-live="polite">
            {previewWord && <span key={previewWord}>{previewWord}</span>}
          </div>
        </div>
        <nav className="header__nav" aria-label="Main navigation">
          {siteConfig.nav.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`header__nav-link ${isActive ? 'header__nav-link--active' : ''}`}
                id={`nav-${item.label.toLowerCase()}`}
                onClick={item.label === 'Blog' ? handleBlogClick : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}


