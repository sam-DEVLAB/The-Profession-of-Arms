import { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * GallantrySection — Modern glassmorphism component displaying
 * decorated Gallantry Award Recipients across PVC, MVC, VrC, AC, KC, SC.
 */
export default function GallantrySection({ service, recipients, title = 'Gallantry Award Recipients' }) {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const priorityOrder = ['PVC', 'MVC', 'VrC', 'AC', 'KC', 'SC'];
  const presentAwards = Array.from(new Set(recipients.map((r) => r.awardType)))
    .sort((a, b) => {
      const ia = priorityOrder.indexOf(a);
      const ib = priorityOrder.indexOf(b);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });

  const awardTabs = ['ALL', ...presentAwards];

  const filteredRecipients = recipients.filter((r) => {
    const matchesTab = activeFilter === 'ALL' || r.awardType === activeFilter;
    if (!matchesTab) return false;
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      r.name.toLowerCase().includes(query) ||
      (r.unit && r.unit.toLowerCase().includes(query)) ||
      (r.conflict && r.conflict.toLowerCase().includes(query)) ||
      (r.year && r.year.toString().includes(query)) ||
      (r.award && r.award.toLowerCase().includes(query)) ||
      (r.citation && r.citation.toLowerCase().includes(query))
    );
  });

  const getAwardBadgeClass = (awardType) => {
    switch (awardType) {
      case 'PVC':
        return 'gallantry-card__badge--pvc';
      case 'MVC':
        return 'gallantry-card__badge--mvc';
      case 'VrC':
        return 'gallantry-card__badge--vrc';
      case 'AC':
        return 'gallantry-card__badge--ac';
      case 'KC':
        return 'gallantry-card__badge--kc';
      case 'SC':
        return 'gallantry-card__badge--sc';
      default:
        return 'gallantry-card__badge--default';
    }
  };

  const getAwardLabel = (awardType) => {
    switch (awardType) {
      case 'PVC':
        return 'Param Vir Chakra (PVC)';
      case 'MVC':
        return 'Maha Vir Chakra (MVC)';
      case 'VrC':
        return 'Vir Chakra (VrC)';
      case 'AC':
        return 'Ashoka Chakra (AC)';
      case 'KC':
        return 'Kirti Chakra (KC)';
      case 'SC':
        return 'Shaurya Chakra (SC)';
      default:
        return awardType;
    }
  };

  return (
    <div className={`gallantry-section gallantry-section--${service}`} id="gallantry-section">
      <div className="gallantry-section__header">
        <div className="gallantry-section__title-group">
          <h2 className="service-page__section-heading">{title}</h2>
          <p className="gallantry-section__subtitle">
            Roll of Honour — Dedicated heroes of the{' '}
            {service === 'army' ? 'Indian Army' : service === 'navy' ? 'Indian Navy' : 'Indian Air Force'}{' '}
            decorated with India&apos;s highest wartime and peacetime gallantry honours.
          </p>
        </div>

        {/* Search and Category Filters */}
        <div className="gallantry-section__controls">
          <div className="gallantry-section__search-wrapper">
            <svg
              className="gallantry-section__search-icon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="gallantry-section__search-input"
              placeholder="Search by name, battle, regiment, year..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="gallantry-section__search-clear"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                &times;
              </button>
            )}
          </div>

          <div className="gallantry-section__filters">
            {awardTabs.map((type) => {
              const count =
                type === 'ALL'
                  ? recipients.length
                  : recipients.filter((r) => r.awardType === type).length;
              return (
                <button
                  key={type}
                  type="button"
                  className={`gallantry-section__filter-btn ${activeFilter === type ? 'gallantry-section__filter-btn--active' : ''}`}
                  onClick={() => setActiveFilter(type)}
                >
                  {type === 'ALL' ? 'All Gallantry Honours' : getAwardLabel(type)}
                  <span className="gallantry-section__filter-count">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {filteredRecipients.length > 0 ? (
        <div className="gallantry-grid">
          {filteredRecipients.map((item, idx) => (
            <div key={`${item.name}-${idx}`} className="gallantry-card">
              <div className="gallantry-card__top">
                <span className={`gallantry-card__badge ${getAwardBadgeClass(item.awardType)}`}>
                  ★ {item.awardType}
                </span>
                <span className="gallantry-card__year">{item.year}</span>
              </div>

              <h3 className="gallantry-card__name">{item.name}</h3>
              <p className="gallantry-card__award-title">{item.award}</p>

              <div className="gallantry-card__meta">
                <div className="gallantry-card__meta-item">
                  <span className="gallantry-card__meta-label">Unit</span>
                  <span className="gallantry-card__meta-val">{item.unit}</span>
                </div>
                <div className="gallantry-card__meta-item">
                  <span className="gallantry-card__meta-label">Action</span>
                  <span className="gallantry-card__meta-val">{item.conflict}</span>
                </div>
              </div>

              <p className="gallantry-card__citation">&ldquo;{item.citation}&rdquo;</p>

              {item.slug && (
                <Link to={`/blog/${item.slug}`} className="gallantry-card__link">
                  Read Story &rarr;
                </Link>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="gallantry-section__no-results">
          <p>No gallantry award recipients found matching &ldquo;{searchQuery}&rdquo;.</p>
          <button
            type="button"
            className="gallantry-section__reset-btn"
            onClick={() => {
              setSearchQuery('');
              setActiveFilter('ALL');
            }}
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
