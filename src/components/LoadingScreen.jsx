import { useEffect, useState } from 'react';
import { siteConfig } from '../site.config';

const LOADING_DURATION = 1500;

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const exitTimer = setTimeout(() => setIsLeaving(true), LOADING_DURATION - 360);
    const removeTimer = setTimeout(() => setIsVisible(false), LOADING_DURATION);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`loading-screen ${isLeaving ? 'loading-screen--leaving' : ''}`} aria-label="Loading">
      <div className="loading-screen__content">
        <h1 className="header__title loading-screen__title">THE PROFESSION OF ARMS</h1>
        <p className="loading-screen__email">{siteConfig.footer.email}</p>
      </div>
    </div>
  );
}
