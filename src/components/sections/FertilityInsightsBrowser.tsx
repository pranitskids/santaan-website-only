"use client";

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';

export interface FertilityInsightCard {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  readMinutes: number;
  thumbnail?: string;
  tags: string[];
}

interface FertilityInsightsBrowserProps {
  posts: FertilityInsightCard[];
  topTags: string[];
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function FertilityInsightsBrowser({ posts, topTags }: FertilityInsightsBrowserProps) {
  const [query, setQuery] = useState('');

  const normalizedQuery = query.trim().toLowerCase();
  const visiblePosts = normalizedQuery
    ? posts.filter((post) => {
        const haystack = `${post.title} ${post.excerpt} ${post.tags.join(' ')}`.toLowerCase();
        return haystack.includes(normalizedQuery);
      })
    : posts;

  const updateQueryUrl = (nextQuery: string) => {
    const params = new URLSearchParams(window.location.search);
    if (nextQuery) {
      params.set('q', nextQuery);
    } else {
      params.delete('q');
    }
    const suffix = params.toString();
    window.history.replaceState(null, '', `${window.location.pathname}${suffix ? `?${suffix}` : ''}`);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateQueryUrl(query.trim());
  };

  const handleClear = () => {
    setQuery('');
    updateQueryUrl('');
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-10 bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
          <h2 className="text-xl font-playfair font-bold text-santaan-teal">Search</h2>
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col sm:flex-row gap-3">
            <Input
              name="q"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search articles (e.g., PCOS, IVF, AMH, semen analysis)"
              className="flex-1"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-full bg-santaan-teal text-white font-semibold hover:bg-santaan-dark-teal transition-colors"
            >
              Search
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="px-5 py-2.5 rounded-full border border-santaan-teal/30 text-santaan-teal font-semibold hover:bg-santaan-teal/5 transition-colors text-center"
            >
              Clear
            </button>
          </form>
          {normalizedQuery ? <p className="mt-3 text-sm text-gray-600">Showing results for &quot;{query.trim()}&quot;.</p> : null}
        </div>

        {topTags.length > 0 && (
          <div className="mb-10 bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
            <h2 className="text-xl font-playfair font-bold text-santaan-teal">Browse by topic</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {topTags.map((tag) => (
                <Link
                  key={tag}
                  href={`/fertility-insights/tag/${tag}`}
                  className="px-3 py-1.5 rounded-full bg-santaan-sage/20 text-santaan-teal hover:bg-santaan-sage/30 transition-colors text-sm font-medium"
                >
                  {tag.replace(/-+/g, ' ')}
                </Link>
              ))}
            </div>
          </div>
        )}

        {visiblePosts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
            <h2 className="text-2xl font-playfair font-bold text-santaan-teal">No matching articles found</h2>
            <p className="text-gray-600 mt-3">Try a different keyword (PCOS, IVF, AMH, male infertility) or clear the search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visiblePosts.map((post) => (
              <article
                key={post.slug}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-shadow flex flex-col h-full"
              >
                {post.thumbnail ? (
                  <img src={post.thumbnail} alt={post.title} className="w-full h-52 object-cover" loading="lazy" decoding="async" />
                ) : (
                  <div className="w-full h-52 bg-gradient-to-r from-santaan-sage/30 to-santaan-teal/20" />
                )}
                <div className="p-6 flex flex-col grow">
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                    <span>{formatDate(post.publishedAt)}</span>
                    <span className="text-gray-300">.</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readMinutes} min read
                    </span>
                  </div>

                  <h2 className="text-xl font-playfair font-bold text-gray-900 leading-tight mb-3 min-h-[3.4rem] [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] overflow-hidden">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed mb-5 min-h-[4.2rem] [display:-webkit-box] [-webkit-line-clamp:3] [-webkit-box-orient:vertical] overflow-hidden">
                    {post.excerpt}
                  </p>

                  <Link
                    href={`/fertility-insights/${post.slug}`}
                    className="mt-auto inline-flex items-center gap-2 text-santaan-teal font-semibold hover:text-santaan-amber transition-colors"
                  >
                    Read this guide
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
