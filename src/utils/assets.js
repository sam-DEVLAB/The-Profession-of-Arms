/**
 * Resolves a public asset path to a fully qualified or clean relative URL
 * that works seamlessly on GitHub Pages, subpaths, and local development.
 */
export function getAssetUrl(assetPath) {
  if (!assetPath) return '';
  const str = String(assetPath).trim();

  // Return unchanged if already absolute or data URI
  if (
    str.startsWith('http://') ||
    str.startsWith('https://') ||
    str.startsWith('data:') ||
    str.startsWith('blob:')
  ) {
    return str;
  }

  const clean = str.replace(/^\.?\//, '');

  if (typeof window !== 'undefined' && window.location) {
    const origin = window.location.origin || '';
    const pathname = window.location.pathname || '/';
    // Ensure pathname has trailing slash
    const baseDir = pathname.endsWith('/') ? pathname : pathname.substring(0, pathname.lastIndexOf('/') + 1);
    return `${origin}${baseDir}${clean}`;
  }

  const base = import.meta.env.BASE_URL || './';
  if (base.endsWith('/')) {
    return `${base}${clean}`;
  }
  return `${base}/${clean}`;
}
