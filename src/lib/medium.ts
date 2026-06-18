import { LEGACY_BLOG_SEEDS } from '@/content/legacyBlogSeeds';
import { MEDIUM_ARCHIVE_SEEDS } from '@/content/mediumArchiveSeeds';
import { getWriteDropPosts } from '@/lib/write-drop-posts';

const EXCLUDED_PUBLIC_POST_SLUGS = new Set([
  'santaan-ivf-now-serving-bengalurus-it-corridor-aecs-layout',
  'ivf-treatment-cost-in-bangalore-understanding-the-price-procedure-and-success',
]);

export type BlogType = 'blog' | 'news' | 'doctor';

export interface SantaanBlogPost {
  slug: string;
  title: string;
  excerpt: string;
  html: string;
  publishedAt: string;
  author: string;
  thumbnail?: string;
  tags: string[];
  sourceUrl: string;
  type: BlogType;
  readMinutes: number;
}

function mergeWithLegacySeeds(posts: SantaanBlogPost[], options?: { limit?: number; type?: BlogType }): SantaanBlogPost[] {
  const visiblePosts = posts.filter((post) => !EXCLUDED_PUBLIC_POST_SLUGS.has(post.slug));
  const existingSlugs = new Set(visiblePosts.map((post) => post.slug));
  const fallbackSeeds = [...MEDIUM_ARCHIVE_SEEDS, ...LEGACY_BLOG_SEEDS].map(normalizeArchivedPost);
  const eligibleFallback = fallbackSeeds.filter((seed) => {
    if (EXCLUDED_PUBLIC_POST_SLUGS.has(seed.slug)) return false;
    if (existingSlugs.has(seed.slug)) return false;
    existingSlugs.add(seed.slug);
    return true;
  });
  const merged = [...visiblePosts, ...eligibleFallback];
  const typeFiltered = options?.type ? merged.filter((post) => post.type === options.type) : merged;
  typeFiltered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  if (typeof options?.limit === 'number') {
    return typeFiltered.slice(0, Math.max(0, options.limit));
  }

  return typeFiltered;
}

function normalizeArchivedPost(post: SantaanBlogPost): SantaanBlogPost {
  const html = sanitizeMediumHtml(post.html);
  return {
    ...post,
    html,
    thumbnail: post.thumbnail || extractFirstImageUrl(html),
  };
}

function unwrapGoogleSearchRedirect(url: string): string {
  const match = url.match(/^https?:\/\/www\.google\.com\/search\?q=([^&]+).*$/i);
  if (!match) return url;

  try {
    const decoded = decodeURIComponent(match[1]);
    if (/^https?:\/\//i.test(decoded)) {
      return decoded;
    }
  } catch {
    return url;
  }
  return url;
}

function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function rewriteLegacySantaanLinks(html: string): string {
  const replacements = [
    ['https://ivf.santaan.in/male-infertility-clinic', 'https://www.santaan.in/male-infertility-clinic'],
    ['https://ivf.santaan.in/', 'https://www.santaan.in/ivf-cost-in-india-2026'],
    ['https://santaan.in/ivf-treatment', 'https://www.santaan.in/treatments/ivf'],
    ['https://santaan.in/technology', 'https://www.santaan.in/treatments/ivf'],
    ['https://santaan.in/contact-us', 'https://www.santaan.in/contact-centres'],
    ['https://santaan.in/contact', 'https://www.santaan.in/contact-centres'],
  ].sort((a, b) => b[0].length - a[0].length);

  return replacements.reduce(
    (updatedHtml, [from, to]) => updatedHtml.replace(new RegExp(escapeRegExp(from), 'g'), to),
    html
  );
}

function normalizeLegacyPhoneCtas(html: string): string {
  return html.replace(
    /(\+91[\s\u00a0\u2013\u2014-]*)?(?:81051[\s\u00a0]*08416|97772[\s\u00a0]*68755|9777268755|969[\s\u00a0]*208[\s\u00a0]*1966|933[\s\u00a0]*732[\s\u00a0]*6896)/g,
    '+91 96689 04011'
  );
}

function stripInternalPublishingTail(html: string): string {
  if (!html) return html;

  const markerPatterns = [
    /technical\s*(?:<\/?[^>]+>\s*)*publish\s*(?:<\/?[^>]+>\s*)*checklist/i,
    /publish\s*(?:<\/?[^>]+>\s*)*checklist\s*(?:<\/?[^>]+>\s*)*internal/i,
    /internal\s*(?:<\/?[^>]+>\s*)*use/i,
    /publishing\s*(?:<\/?[^>]+>\s*)*account/i,
    /mandatory\s*(?:<\/?[^>]+>\s*)*tags/i,
  ];

  let cutIndex = -1;
  for (const pattern of markerPatterns) {
    const match = html.match(pattern);
    if (!match || typeof match.index !== 'number') continue;
    cutIndex = cutIndex === -1 ? match.index : Math.min(cutIndex, match.index);
  }

  if (cutIndex === -1) return html;

  const blockStart = html.lastIndexOf('<', cutIndex);
  const safeIndex = blockStart >= 0 ? blockStart : cutIndex;
  return html.slice(0, safeIndex);
}

function ensureImageAttributes(html: string): string {
  if (!html) return html;

  return html.replace(/<img\b[^>]*>/gi, (tag) => {
    const hasAlt = /\salt\s*=/.test(tag);
    const hasLoading = /\sloading\s*=/.test(tag);
    const hasDecoding = /\sdecoding\s*=/.test(tag);

    let injection = '';
    if (!hasAlt) injection += ' alt=""';
    if (!hasLoading) injection += ' loading="lazy"';
    if (!hasDecoding) injection += ' decoding="async"';

    if (!injection) return tag;
    return tag.replace(/<img\b/i, `<img${injection}`);
  });
}

function sanitizeMediumHtml(input: string): string {
  if (!input) return '';

  let html = input;

  html = stripInternalPublishingTail(html);

  // Drop Medium RSS tracking pixels.
  html = html.replace(
    /<img[^>]+src=["']https?:\/\/medium\.com\/_\/stat\?[^"']+["'][^>]*>/gi,
    ''
  );

  // Unwrap Google "search?q=" redirects into direct links.
  html = html.replace(
    /href=["'](https?:\/\/www\.google\.com\/search\?q=[^"']+)["']/gi,
    (_full, href: string) => `href="${unwrapGoogleSearchRedirect(href)}"`
  );
  html = rewriteLegacySantaanLinks(html);
  html = normalizeLegacyPhoneCtas(html);

  // Remove dangling separators often used before internal notes.
  html = html.replace(/<p>\s*[—-]\s*[—-]?\s*<\/p>\s*$/gi, '');
  html = ensureImageAttributes(html);
  html = html.trim();
  return html;
}

function normalizeImageUrl(value?: string): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (trimmed.startsWith('//')) {
    return `https:${trimmed}`;
  }
  return trimmed;
}

function extractFirstImageUrl(html: string): string | undefined {
  if (!html) return undefined;
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return normalizeImageUrl(match?.[1]);
}

export async function getSantaanBlogPosts(options?: { limit?: number; type?: BlogType }): Promise<SantaanBlogPost[]> {
  const writeDropPosts = getWriteDropPosts(options);
  return mergeWithLegacySeeds(writeDropPosts, options);
}

export async function getSantaanBlogPostBySlug(slug: string): Promise<SantaanBlogPost | null> {
  if (EXCLUDED_PUBLIC_POST_SLUGS.has(slug)) {
    return null;
  }

  const directPost = getWriteDropPosts().find((post) => post.slug === slug);
  if (directPost) {
    return directPost;
  }

  const fallbackSeed = [...MEDIUM_ARCHIVE_SEEDS, ...LEGACY_BLOG_SEEDS].find((post) => post.slug === slug);
  if (fallbackSeed) {
    return normalizeArchivedPost(fallbackSeed);
  }

  return null;
}
