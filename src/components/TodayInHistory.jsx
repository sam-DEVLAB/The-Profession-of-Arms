import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  MILITARY_HISTORY_EVENTS,
  getEventsForDate,
  getEventsForMonth,
} from '../data/militaryHistoryEvents';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const DAYS_IN_MONTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/**
 * TodayInHistory — Interactive section displaying historical military
 * events, gallantry award actions, and milestones for today (or any chosen date).
 */
export default function TodayInHistory() {
  const now = new Date();
  const todayMonth = now.getMonth() + 1; // 1-12
  const todayDay = now.getDate(); // 1-31

  const [selectedMonth, setSelectedMonth] = useState(todayMonth);
  const [selectedDay, setSelectedDay] = useState(todayDay);
  const [viewMode, setViewMode] = useState('DATE'); // 'DATE' or 'MONTH'

  const isToday = selectedMonth === todayMonth && selectedDay === todayDay;

  const dateEvents = useMemo(() => {
    return getEventsForDate(selectedMonth, selectedDay);
  }, [selectedMonth, selectedDay]);

  const monthEvents = useMemo(() => {
    return getEventsForMonth(selectedMonth);
  }, [selectedMonth]);

  const handlePrevDay = () => {
    let m = selectedMonth;
    let d = selectedDay - 1;
    if (d < 1) {
      m = m === 1 ? 12 : m - 1;
      d = DAYS_IN_MONTH[m - 1];
    }
    setSelectedMonth(m);
    setSelectedDay(d);
  };

  const handleNextDay = () => {
    let m = selectedMonth;
    let d = selectedDay + 1;
    if (d > DAYS_IN_MONTH[m - 1]) {
      d = 1;
      m = m === 12 ? 1 : m + 1;
    }
    setSelectedMonth(m);
    setSelectedDay(d);
  };

  const handleResetToday = () => {
    setSelectedMonth(todayMonth);
    setSelectedDay(todayDay);
    setViewMode('DATE');
  };

  const getServiceBadgeClass = (service) => {
    switch (service) {
      case 'army':
        return 'history-card__service--army';
      case 'navy':
        return 'history-card__service--navy';
      case 'airforce':
        return 'history-card__service--airforce';
      default:
        return 'history-card__service--tri';
    }
  };

  const getServiceLabel = (service) => {
    switch (service) {
      case 'army':
        return '⚔ Indian Army';
      case 'navy':
        return '⚓ Indian Navy';
      case 'airforce':
        return '✈ Indian Air Force';
      default:
        return '🇮🇳 Armed Forces';
    }
  };

  const getCategoryClass = (category) => {
    const lower = category.toLowerCase();
    if (lower.includes('param vir')) return 'history-card__category--pvc';
    if (lower.includes('maha vir')) return 'history-card__category--mvc';
    if (lower.includes('ashoka')) return 'history-card__category--ac';
    if (lower.includes('vir')) return 'history-card__category--vrc';
    if (lower.includes('air')) return 'history-card__category--air';
    if (lower.includes('victory')) return 'history-card__category--victory';
    return 'history-card__category--default';
  };

  const maxDays = DAYS_IN_MONTH[selectedMonth - 1];
  const dayOptions = Array.from({ length: maxDays }, (_, i) => i + 1);

  return (
    <section className="today-history" id="today-in-history">
      <div className="today-history__header">
        <div className="today-history__heading-group">
          <div className="today-history__tag">
            <span className="today-history__tag-pulse"></span>
            THIS DAY IN VALOUR
          </div>
          <h2 className="today-history__title">
            Today in Indian Military History
          </h2>
          <p className="today-history__subtitle">
            Chronicles of valorous battles, tactical masterstrokes, and gallantry award actions on this day across generations.
          </p>
        </div>

        {/* Date Selector Controls */}
        <div className="today-history__controls">
          <div className="today-history__nav-buttons">
            <button
              type="button"
              className="today-history__nav-btn"
              onClick={handlePrevDay}
              title="Previous Day"
              aria-label="Previous day"
            >
              &larr; Prev Day
            </button>

            <button
              type="button"
              className={`today-history__today-btn ${isToday ? 'today-history__today-btn--active' : ''}`}
              onClick={handleResetToday}
            >
              ★ Today ({todayDay} {MONTH_NAMES[todayMonth - 1]})
            </button>

            <button
              type="button"
              className="today-history__nav-btn"
              onClick={handleNextDay}
              title="Next Day"
              aria-label="Next day"
            >
              Next Day &rarr;
            </button>
          </div>

          <div className="today-history__selectors">
            <select
              className="today-history__select"
              value={selectedDay}
              onChange={(e) => setSelectedDay(Number(e.target.value))}
              aria-label="Select day"
            >
              {dayOptions.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <select
              className="today-history__select"
              value={selectedMonth}
              onChange={(e) => {
                const newM = Number(e.target.value);
                setSelectedMonth(newM);
                const maxD = DAYS_IN_MONTH[newM - 1];
                if (selectedDay > maxD) setSelectedDay(maxD);
              }}
              aria-label="Select month"
            >
              {MONTH_NAMES.map((m, idx) => (
                <option key={m} value={idx + 1}>
                  {m}
                </option>
              ))}
            </select>

            <div className="today-history__toggle-group">
              <button
                type="button"
                className={`today-history__toggle-btn ${viewMode === 'DATE' ? 'today-history__toggle-btn--active' : ''}`}
                onClick={() => setViewMode('DATE')}
              >
                On This Day ({dateEvents.length})
              </button>
              <button
                type="button"
                className={`today-history__toggle-btn ${viewMode === 'MONTH' ? 'today-history__toggle-btn--active' : ''}`}
                onClick={() => setViewMode('MONTH')}
              >
                All of {MONTH_NAMES[selectedMonth - 1]} ({monthEvents.length})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="today-history__content">
        {viewMode === 'DATE' ? (
          dateEvents.length > 0 ? (
            <div className="today-history__grid">
              {dateEvents.map((evt, idx) => (
                <article key={`date-evt-${idx}`} className="history-card">
                  <div className="history-card__header">
                    <div className="history-card__date-badge">
                      <span className="history-card__day">{evt.day}</span>
                      <span className="history-card__month">
                        {MONTH_NAMES[evt.month - 1].slice(0, 3)}
                      </span>
                      <span className="history-card__year">{evt.year}</span>
                    </div>

                    <div className="history-card__badges">
                      <span
                        className={`history-card__service ${getServiceBadgeClass(evt.service)}`}
                      >
                        {getServiceLabel(evt.service)}
                      </span>
                      <span
                        className={`history-card__category ${getCategoryClass(evt.category)}`}
                      >
                        {evt.category}
                      </span>
                    </div>
                  </div>

                  <h3 className="history-card__title">{evt.title}</h3>

                  {evt.location && (
                    <div className="history-card__location">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {evt.location}
                    </div>
                  )}

                  <p className="history-card__desc">{evt.description}</p>

                  {evt.slug && (
                    <Link to={`/blog/${evt.slug}`} className="history-card__story-link">
                      Read Dedicated Story &rarr;
                    </Link>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="today-history__empty">
              <div className="today-history__empty-icon">🎖️</div>
              <h4 className="today-history__empty-title">
                Honouring the Eternal Vigilance of our Armed Forces
              </h4>
              <p className="today-history__empty-text">
                Every single day, soldiers, sailors, and air warriors stand on guard along the LOC, LAC, Siachen Glacier, and the high seas.
                Explore other major battles and valorous milestones in{' '}
                <strong>{MONTH_NAMES[selectedMonth - 1]}</strong> below:
              </p>
              <div className="today-history__empty-actions">
                <button
                  type="button"
                  className="today-history__view-month-btn"
                  onClick={() => setViewMode('MONTH')}
                >
                  View All Milestones in {MONTH_NAMES[selectedMonth - 1]} ({monthEvents.length})
                </button>
                <button
                  type="button"
                  className="today-history__view-today-btn"
                  onClick={handleResetToday}
                >
                  Jump to Today ({todayDay} {MONTH_NAMES[todayMonth - 1]})
                </button>
              </div>
            </div>
          )
        ) : (
          <div className="today-history__grid">
            {monthEvents.map((evt, idx) => (
              <article key={`month-evt-${idx}`} className="history-card">
                <div className="history-card__header">
                  <div className="history-card__date-badge">
                    <span className="history-card__day">{evt.day}</span>
                    <span className="history-card__month">
                      {MONTH_NAMES[evt.month - 1].slice(0, 3)}
                    </span>
                    <span className="history-card__year">{evt.year}</span>
                  </div>

                  <div className="history-card__badges">
                    <span
                      className={`history-card__service ${getServiceBadgeClass(evt.service)}`}
                    >
                      {getServiceLabel(evt.service)}
                    </span>
                    <span
                      className={`history-card__category ${getCategoryClass(evt.category)}`}
                    >
                      {evt.category}
                    </span>
                  </div>
                </div>

                <h3 className="history-card__title">{evt.title}</h3>

                {evt.location && (
                  <div className="history-card__location">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {evt.location}
                  </div>
                )}

                <p className="history-card__desc">{evt.description}</p>

                {evt.slug && (
                  <Link to={`/blog/${evt.slug}`} className="history-card__story-link">
                    Read Dedicated Story &rarr;
                  </Link>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
