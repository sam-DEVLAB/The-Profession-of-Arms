import { useMemo, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import PostInteractions from './PostInteractions';
import PostCard from './PostCard';
import { getAllPosts, getPostBySlug } from '../posts';
import { getPostMetrics, recordPostRead } from '../postMetrics';
import { getAssetUrl } from '../utils/assets';

/**
 * BlogPost — Full blog post renderer.
 * Automatically resolves markdown from indexed posts in /public/posts/<slug>/...,
 * resolves relative images to the post's asset folder,
 * dynamically sets custom page background if specified in frontmatter,
 * sanitizes HTML output with DOMPurify, and renders with prose styling.
 */
export default function BlogPost({ slug }) {
  const navigate = useNavigate();
  const post = useMemo(() => getPostBySlug(slug), [slug]);

  const meta = post?.meta || {};
  const body = post?.body || '';
  const [metrics, setMetrics] = useState(() => getPostMetrics(slug, meta));
  const [readerTheme, setReaderTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('pe_reader_theme');
      return saved === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });
  const [fontScale, setFontScale] = useState(() => {
    try {
      const saved = Number(localStorage.getItem('pe_reader_font_scale'));
      return Number.isFinite(saved) ? saved : 1;
    } catch {
      return 1;
    }
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    setMetrics(recordPostRead(slug, meta));

    const handleMetricsUpdate = (e) => {
      const targetSlug = e?.detail?.slug;
      if (!targetSlug || targetSlug === slug || targetSlug === '__all__') {
        setMetrics(getPostMetrics(slug, meta));
      }
    };

    window.addEventListener('poa-metrics-updated', handleMetricsUpdate);
    return () => {
      window.removeEventListener('poa-metrics-updated', handleMetricsUpdate);
    };
  }, [slug, post]);

  useEffect(() => {
    try {
      localStorage.setItem('pe_reader_theme', readerTheme);
    } catch {
      // Ignore localStorage errors.
    }
  }, [readerTheme]);

  useEffect(() => {
    try {
      localStorage.setItem('pe_reader_font_scale', String(fontScale));
    } catch {
      // Ignore localStorage errors.
    }
    document.documentElement.style.setProperty('--blog-reader-font-scale', String(fontScale));
  }, [fontScale]);

  // Detect which armed force service this blog post belongs to
  const service = useMemo(() => {
    const tags = (meta.tags || []).map((t) => t.toLowerCase());
    const title = (meta.title || '').toLowerCase();

    const isArmy =
      tags.some(
        (t) =>
          t.includes('army') ||
          t.includes('kumaon') ||
          t.includes('jak rif') ||
          t.includes('poona horse') ||
          t.includes('kargil') ||
          t.includes('basantar') ||
          t.includes('badgam') ||
          t.includes('batra') ||
          t.includes('sharma') ||
          t.includes('khetarpal')
      ) ||
      title.includes('kargil') ||
      title.includes('batra') ||
      title.includes('badgam') ||
      title.includes('basantar') ||
      title.includes('army') ||
      title.includes('sharma') ||
      title.includes('khetarpal');

    const isNavy =
      tags.some(
        (t) =>
          t.includes('navy') ||
          t.includes('trident') ||
          t.includes('maritime') ||
          t.includes('killer squadron') ||
          t.includes('western naval')
      ) ||
      title.includes('trident') ||
      title.includes('navy') ||
      title.includes('karachi') ||
      title.includes('maritime');

    const isAirForce =
      tags.some(
        (t) =>
          t.includes('air force') ||
          t.includes('airforce') ||
          t.includes('iaf') ||
          t.includes('sekhon') ||
          t.includes('gnat') ||
          t.includes('squadron') ||
          t.includes('flying')
      ) ||
      title.includes('sekhon') ||
      title.includes('air force') ||
      title.includes('iaf') ||
      title.includes('srinagar');

    if (isArmy) return 'army';
    if (isNavy) return 'navy';
    if (isAirForce) return 'airforce';
    return null;
  }, [meta]);

  // Dynamic top bar gradient & shadow based on service
  useEffect(() => {
    if (service === 'army') {
      document.documentElement.style.setProperty(
        '--header-gradient',
        'linear-gradient(180deg, #e4f5a3 0%, #9cb852 28%, #5d7522 58%, #334412 85%, #182207 100%)'
      );
      document.documentElement.style.setProperty(
        '--header-shadow',
        'drop-shadow(0 2px 4px rgba(65, 85, 20, 0.9)) drop-shadow(0 8px 20px rgba(45, 65, 12, 0.85)) drop-shadow(0 20px 50px rgba(15, 25, 5, 0.95))'
      );
    } else if (service === 'navy') {
      document.documentElement.style.setProperty(
        '--header-gradient',
        'linear-gradient(180deg, #ffffff 0%, #b0d8ff 25%, #4a8df8 55%, #103a8f 85%, #04123b 100%)'
      );
      document.documentElement.style.setProperty(
        '--header-shadow',
        'drop-shadow(0 2px 4px rgba(20, 70, 180, 0.9)) drop-shadow(0 8px 20px rgba(10, 40, 130, 0.85)) drop-shadow(0 20px 50px rgba(2, 12, 50, 0.95))'
      );
    } else if (service === 'airforce') {
      document.documentElement.style.setProperty(
        '--header-gradient',
        'linear-gradient(180deg, #e0f2fe 0%, #38bdf8 30%, #0284c7 60%, #075985 85%, #082f49 100%)'
      );
      document.documentElement.style.setProperty(
        '--header-shadow',
        'drop-shadow(0 2px 4px rgba(14, 116, 144, 0.9)) drop-shadow(0 8px 20px rgba(3, 105, 161, 0.85)) drop-shadow(0 20px 50px rgba(2, 44, 75, 0.95))'
      );
    }

    return () => {
      document.documentElement.style.removeProperty('--header-gradient');
      document.documentElement.style.removeProperty('--header-shadow');
    };
  }, [service]);

  // Dynamic custom background support (reverts to default when unmounting)
  useEffect(() => {
    if (meta.background) {
      document.documentElement.style.setProperty('--bg-image', `url("${getAssetUrl(meta.background)}")`);
    }
    return () => {
      document.documentElement.style.removeProperty('--bg-image');
    };
  }, [meta.background]);

  // Custom marked renderer to resolve relative image paths
  const safeHtml = useMemo(() => {
    if (!body) return '';
    try {
      const renderer = new marked.Renderer();
      renderer.image = (token, titleArg, textArg) => {
        const href = typeof token === 'object' && token !== null ? token.href : token;
        const title = typeof token === 'object' && token !== null ? token.title : titleArg;
        const text = typeof token === 'object' && token !== null ? token.text : textArg;
        let src = href || '';
        if (
          src &&
          !src.startsWith('http://') &&
          !src.startsWith('https://') &&
          !src.startsWith('data:') &&
          !src.startsWith('/') &&
          !src.startsWith('#')
        ) {
          const cleanSrc = src.replace(/^\.\//, '');
          src = getAssetUrl(`posts/${cleanSrc}`);
        }
        const titleAttr = title ? ` title="${title}"` : '';
        const altAttr = text ? ` alt="${text}"` : '';
        return `<img src="${src}"${altAttr}${titleAttr} loading="lazy" />`;
      };

      const rawHtml = marked.parse(body, {
        breaks: false,
        gfm: true,
        renderer,
      });

      return DOMPurify.sanitize(rawHtml, {
        ADD_TAGS: [
          'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img', 'iframe', 'span',
          'details', 'summary', 'svg', 'path', 'g', 'circle', 'rect', 'line', 'polygon', 'polyline',
          'p', 'strong', 'em', 'blockquote', 'ul', 'ol', 'li', 'hr', 'a', 'code', 'pre'
        ],
        ADD_ATTR: [
          'id', 'src', 'alt', 'title', 'width', 'height', 'loading', 'style',
          'class', 'className', 'viewBox', 'fill', 'stroke', 'stroke-width',
          'stroke-linecap', 'stroke-linejoin', 'xmlns', 'target', 'rel', 'd', 'href'
        ],
      });
    } catch (err) {
      console.error('Error rendering markdown:', err);
      return `<p>${body}</p>`;
    }
  }, [body, slug]);

  if (!post) {
    return (
      <div className="blog-post fade-in">
        <Link to="/" className="blog-post__back" id="back-link">
          &larr; Back to blog
        </Link>
        <p className="loading">Post not found: {slug}</p>
      </div>
    );
  }

  const formattedDate = meta.date
    ? new Date(meta.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  const relatedPosts = getAllPosts().filter((item) => item.slug !== slug).slice(0, 3);

  return (
    <article className={`blog-post blog-post--reader-${readerTheme} ${service ? `blog-post--${service}` : ''} fade-in`} id={`post-${slug}`}>
      <Link to="/" className="blog-post__back" id="back-link">
        &larr; Back to blog
      </Link>

      <div className="reader-controls" aria-label="Reader appearance controls">
        <button
          type="button"
          className="reader-font-toggle reader-font-toggle--decrease"
          onClick={() => setFontScale((current) => Number(Math.max(0.9, Number((current - 0.1).toFixed(1))))) }
          aria-label="Decrease font size"
          title="Decrease font size"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
            <path d="M5 12h14" />
          </svg>
        </button>

        <button
          type="button"
          className="reader-font-toggle reader-font-toggle--increase"
          onClick={() => setFontScale((current) => Number(Math.min(1.5, Number((current + 0.1).toFixed(1))))) }
          aria-label="Increase font size"
          title="Increase font size"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>

        <button
          type="button"
          className="reader-theme-toggle"
          onClick={() => setReaderTheme((current) => current === 'light' ? 'dark' : 'light')}
          aria-label={`Switch to ${readerTheme === 'light' ? 'dark' : 'light'} reading mode`}
          title={`Switch to ${readerTheme === 'light' ? 'dark' : 'light'} reading mode`}
        >
          {readerTheme === 'light' ? (
            <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.7 6.7 0 0 0 21 12.8Z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </svg>
          )}
        </button>
      </div>

      <header className="blog-post__header blog-text-box">
        <div className="blog-post__header-content">
          {formattedDate && (
            <time className="blog-post__date" dateTime={meta.date}>
              {formattedDate}
            </time>
          )}
          <h1 className="blog-post__title">{meta.title || slug}</h1>
          <div className="blog-post__metrics" aria-label="Post activity">
            <span>{metrics.reads} reads</span>
            <span>{metrics.likes} likes</span>
            <span>{metrics.comments} comments</span>
          </div>
        </div>

        {meta.icon && (
          <div className="blog-post__icon-container" aria-hidden="true">
            <img src={meta.icon} alt="" className="blog-post__icon" />
          </div>
        )}
      </header>

      {/* Rendered markdown — sanitized via DOMPurify */}
      <div
        className="prose blog-text-box"
        dangerouslySetInnerHTML={{ __html: safeHtml }}
      />

      {/* Like, Comment & Social (GitHub / AllPoetry) interactions */}
      <PostInteractions
        slug={slug}
        allpoetry={post.allpoetry}
        onMetricsChange={(nextMetrics) => setMetrics((currentMetrics) => ({ ...currentMetrics, ...nextMetrics }))}
        showCounts={false}
      />

      <section className="related-posts" aria-labelledby="related-posts-title">
        <div className="related-posts__heading">
          <h2 id="related-posts-title">You may also like</h2>
        </div>
        <div className="related-posts__grid">
          {relatedPosts.map((item) => (
            <PostCard key={item.slug} {...item} backgroundImage={item.background} />
          ))}
        </div>
      </section>
    </article>
  );
}

