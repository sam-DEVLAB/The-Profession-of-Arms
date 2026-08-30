import { useMemo, useState } from 'react';
import PostCard from '../components/PostCard';
import { getAllPosts } from '../posts';

export default function Search() {
  const posts = getAllPosts();
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().toLowerCase();
  const filteredPosts = useMemo(() => {
    if (!normalizedQuery) return posts;

    return posts.filter((post) => {
      const searchableText = [post.title, post.excerpt, post.slug, ...(post.tags || [])]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return searchableText.includes(normalizedQuery);
    });
  }, [normalizedQuery, posts]);

  return (
    <section className="search-page fade-in">
      <div className="search-page__heading">
          <p className="search-page__eyebrow">The archive</p>
        <h1 className="search-page__title">Search stories</h1>
      </div>
      <label className="search-page__field">
        <span className="search-page__icon" aria-hidden="true">⌕</span>
        <span className="sr-only">Search stories</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by title or subject"
          autoFocus
        />
      </label>
      <div className="search-page__results">
        {filteredPosts.map((post) => (
          <PostCard key={post.slug} {...post} />
        ))}
        {filteredPosts.length === 0 && (
          <p className="search-page__empty">No stories found for &quot;{query}&quot;.</p>
        )}
      </div>
    </section>
  );
}
