/**
 * site.config.js — Central Blog Template Configuration
 *
 * Edit all site branding, hero text, quotes, and navigation here.
 * Changes made here will automatically reflect across the entire blog!
 */
export const siteConfig = {
  // Main Site Branding
  title: 'THE PROFESSION OF ARMS',
  author: 'Sameer Kumar',
  description:
    'For those who sacrificed their today for our tomorrow.',

  // Home Page About / Hero Section
  hero: {
    avatar: 'fiesta-image-asset_7d4422ad78dce3d11e62ce38c9995989.png',
    title: 'Welcome to The Profession of Arms',
    subtitle: '',
    sectionTitle: 'Blogs',
  },

  // Navigation Bar Links
  nav: [
    { label: 'Blog', path: '/' },
  ],

  // Footer Quote & Attribution
  footer: {
    quote:
      '"तलवार से बिजली करके, लाल लहू बहे धरती, ये वर देना प्रभु मोहे विजय होय वीर गति"',
    attribution: '—Lt Gen Hanut Singh Rathore, PVSM, MVC',
    email: 'theprofessionofarms.blog@gmail.com',
  },

  // Social Defaults (can be overridden or toggled per post in frontmatter)
  social: {
    allpoetry: 'https://allpoetry.com',
  },
};

