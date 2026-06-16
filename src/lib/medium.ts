import { LEGACY_BLOG_SEEDS } from '@/content/legacyBlogSeeds';
import { MEDIUM_ARCHIVE_SEEDS } from '@/content/mediumArchiveSeeds';

const MEDIUM_FEED_URL = 'https://medium.com/feed/@santaanIVF';

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

interface Rss2JsonItem {
  title?: string;
  pubDate?: string;
  link?: string;
  author?: string;
  thumbnail?: string;
  enclosure?: {
    link?: string;
    type?: string;
  };
  description?: string;
  content?: string;
  categories?: string[];
}

interface Rss2JsonResponse {
  status?: string;
  items?: Rss2JsonItem[];
}

function mergeWithLegacySeeds(posts: SantaanBlogPost[], options?: { limit?: number; type?: BlogType }): SantaanBlogPost[] {
  const existingSlugs = new Set(posts.map((post) => post.slug));
  const fallbackSeeds = [...MEDIUM_ARCHIVE_SEEDS, ...LEGACY_BLOG_SEEDS].map(normalizeArchivedPost);
  const eligibleFallback = fallbackSeeds.filter((seed) => {
    if (existingSlugs.has(seed.slug)) return false;
    existingSlugs.add(seed.slug);
    return true;
  });
  const merged = [...posts, ...eligibleFallback];
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

function stripHtml(input: string): string {
  return input
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
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

function makeSlug(item: Rss2JsonItem): string {
  if (item.link) {
    const lastPath = item.link.split('/').filter(Boolean).pop();
    if (lastPath) {
      return lastPath
        .replace(/\?.*$/, '')
        .replace(/-[a-f0-9]{8,}$/i, '')
        .toLowerCase();
    }
  }

  const title = (item.title || 'fertility-insight').toLowerCase();
  return title
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function normalizeTag(tag: string): string {
  return tag.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function inferTypeFromTags(tags: string[]): BlogType {
  const normalized = tags.map(normalizeTag);
  const isNews = normalized.some((tag) => tag.includes('santaan-news') || tag.includes('announcement'));
  if (isNews) return 'news';

  const isDoctor = normalized.some(
    (tag) =>
      tag.includes('audience-doctor') ||
      tag.includes('for-doctors') ||
      tag.includes('doctor-audience') ||
      tag.includes('doctor-insights') ||
      tag.includes('clinical-update') ||
      tag.includes('clinical-insight') ||
      tag === 'clinical' ||
      tag.includes('clinician-education') ||
      tag.includes('doctor') ||
      tag.includes('clinician')
  );
  if (isDoctor) return 'doctor';

  return 'blog';
}

function inferTypeFromContent(input: { title?: string; excerpt?: string; html?: string }): BlogType {
  const text = `${input.title || ''} ${input.excerpt || ''} ${stripHtml(input.html || '')}`.toLowerCase();

  const hardDoctorSignals = [
    'science for smile',
    'science for smiles',
    'clinical question',
    'clinical takeaway',
    'clinical disclaimer',
    'for clinician education',
    'for clinicians',
    'journal brief',
    'pmid',
    'doi:',
    'clinical protocol',
    'meta-analysis',
    'randomized trial',
    'randomised trial',
  ];

  if (hardDoctorSignals.some((signal) => text.includes(signal))) {
    return 'doctor';
  }

  const softDoctorSignals = [
    'evidence level',
    'protocol insight',
    'clinical implementation',
    'multicenter',
    'multicentre',
    'andrology lab',
    'controlled ovarian stimulation',
    'embryo selection',
    'endometrial receptivity',
    'multi-omics',
    'non-invasive pgt-a',
    'embryology',
    'implantation potential',
    'follicle intelligence',
  ];
  const softHits = softDoctorSignals.reduce((count, signal) => (text.includes(signal) ? count + 1 : count), 0);
  if (softHits >= 3) {
    return 'doctor';
  }

  return 'blog';
}

function inferPostType(input: { tags: string[]; title?: string; excerpt?: string; html?: string }): BlogType {
  const tagType = inferTypeFromTags(input.tags);
  if (tagType !== 'blog') return tagType;
  return inferTypeFromContent({ title: input.title, excerpt: input.excerpt, html: input.html });
}

function estimateReadMinutes(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
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

function normalizeItem(item: Rss2JsonItem): SantaanBlogPost {
  const html = sanitizeMediumHtml(item.content || item.description || '');
  const plainText = stripHtml(html);
  const excerpt = plainText.slice(0, 180) + (plainText.length > 180 ? '...' : '');
  const tags = (item.categories || []).filter(Boolean);
  const thumbnail =
    normalizeImageUrl(item.thumbnail) ||
    normalizeImageUrl(item.enclosure?.link) ||
    extractFirstImageUrl(html);

  return {
    slug: makeSlug(item),
    title: item.title || 'Untitled Insight',
    excerpt,
    html,
    publishedAt: item.pubDate || new Date().toISOString(),
    author: item.author || 'Santaan Editorial Team',
    thumbnail,
    tags,
    sourceUrl: item.link || MEDIUM_FEED_URL,
    type: inferPostType({ tags, title: item.title, excerpt, html }),
    readMinutes: estimateReadMinutes(plainText),
  };
}

async function fetchMediumFeedPosts(options?: { limit?: number; type?: BlogType }): Promise<SantaanBlogPost[]> {
  const params = new URLSearchParams({
    rss_url: MEDIUM_FEED_URL,
  });
  const apiKey = process.env.RSS2JSON_API_KEY?.trim();
  if (apiKey) {
    params.set('api_key', apiKey);
    params.set('count', String(Math.min(Math.max(options?.limit || 20, 10), 100)));
  }

  const fetchFeed = async (feedParams: URLSearchParams): Promise<Rss2JsonResponse> => {
    const response = await fetch(`https://api.rss2json.com/v1/api.json?${feedParams.toString()}`, {
      cache: 'force-cache',
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Medium feed: ${response.status}`);
    }

    return (await response.json()) as Rss2JsonResponse;
  };

  let data: Rss2JsonResponse | null = null;
  try {
    data = await fetchFeed(params);
  } catch (error) {
    if (!apiKey) throw error;
  }

  if (data?.status !== 'ok' && apiKey) {
    params.delete('api_key');
    params.delete('count');
    data = await fetchFeed(params);
  }

  if (!data || data.status !== 'ok') {
    throw new Error('Invalid Medium feed response');
  }

  let posts = (data.items || []).map(normalizeItem);

  if (options?.type) {
    posts = posts.filter((post) => post.type === options.type);
  }

  if (typeof options?.limit === 'number') {
    posts = posts.slice(0, Math.max(0, options.limit));
  }

  return mergeWithLegacySeeds(posts, options);
}

export async function getSantaanBlogPosts(options?: { limit?: number; type?: BlogType }): Promise<SantaanBlogPost[]> {
  try {
    return await fetchMediumFeedPosts(options);
  } catch (error) {
    console.error('Direct Medium fetch failed:', error);
    return mergeWithLegacySeeds([], options);
  }
}

export async function getSantaanBlogPostBySlug(slug: string): Promise<SantaanBlogPost | null> {
  const fallbackSeed = [...MEDIUM_ARCHIVE_SEEDS, ...LEGACY_BLOG_SEEDS].find((post) => post.slug === slug);
  if (fallbackSeed) {
    return normalizeArchivedPost(fallbackSeed);
  }

  try {
    const posts = await fetchMediumFeedPosts({ limit: 80 });
    const foundInFeed = posts.find((post) => post.slug === slug);
    if (foundInFeed) return foundInFeed;
  } catch (error) {
    console.error('Direct Medium slug fetch failed:', error);
  }

  return null;
}
