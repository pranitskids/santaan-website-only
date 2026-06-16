import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const MEDIUM_FEED_URL = 'https://medium.com/feed/@santaanIVF';
const RSS2JSON_ENDPOINT = 'https://api.rss2json.com/v1/api.json';
const ARCHIVE_PATH = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../content/mediumArchiveSeeds.ts'
);

const dryRun = process.argv.includes('--dry-run');

function stripHtml(input) {
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

function unwrapGoogleSearchRedirect(url) {
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

function escapeRegExp(input) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function rewriteLegacySantaanLinks(html) {
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

function normalizeLegacyPhoneCtas(html) {
  return html.replace(
    /(\+91[\s\u00a0\u2013\u2014-]*)?(?:81051[\s\u00a0]*08416|97772[\s\u00a0]*68755|9777268755|969[\s\u00a0]*208[\s\u00a0]*1966|933[\s\u00a0]*732[\s\u00a0]*6896)/g,
    '+91 96689 04011'
  );
}

function stripInternalPublishingTail(html) {
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

function ensureImageAttributes(html) {
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

function sanitizeMediumHtml(input) {
  if (!input) return '';

  let html = stripInternalPublishingTail(input);

  html = html.replace(
    /<img[^>]+src=["']https?:\/\/medium\.com\/_\/stat\?[^"']+["'][^>]*>/gi,
    ''
  );
  html = html.replace(
    /href=["'](https?:\/\/www\.google\.com\/search\?q=[^"']+)["']/gi,
    (_full, href) => `href="${unwrapGoogleSearchRedirect(href)}"`
  );
  html = rewriteLegacySantaanLinks(html);
  html = normalizeLegacyPhoneCtas(html);
  html = html.replace(/<p>\s*[—-]\s*[—-]?\s*<\/p>\s*$/gi, '');
  html = ensureImageAttributes(html);

  return html.trim();
}

function makeSlug(item) {
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

function normalizeTag(tag) {
  return tag.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function inferTypeFromTags(tags) {
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

function inferTypeFromContent(input) {
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

function inferPostType(input) {
  const tagType = inferTypeFromTags(input.tags);
  if (tagType !== 'blog') return tagType;
  return inferTypeFromContent({ title: input.title, excerpt: input.excerpt, html: input.html });
}

function estimateReadMinutes(text) {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

function normalizeImageUrl(value) {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (trimmed.startsWith('//')) {
    return `https:${trimmed}`;
  }
  return trimmed;
}

function extractFirstImageUrl(html) {
  if (!html) return undefined;
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return normalizeImageUrl(match?.[1]);
}

function normalizeItem(item) {
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

function findArchiveArray(source) {
  const exportStart = source.indexOf('export const MEDIUM_ARCHIVE_SEEDS');
  if (exportStart === -1) {
    throw new Error('Could not find MEDIUM_ARCHIVE_SEEDS export.');
  }

  const arrayStart = source.indexOf('[', exportStart);
  if (arrayStart === -1) {
    throw new Error('Could not find MEDIUM_ARCHIVE_SEEDS array.');
  }

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = arrayStart; index < source.length; index += 1) {
    const char = source[index];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }

    if (char === '[') depth += 1;
    if (char === ']') depth -= 1;

    if (depth === 0) {
      return {
        start: arrayStart,
        end: index + 1,
      };
    }
  }

  throw new Error('Could not parse MEDIUM_ARCHIVE_SEEDS array.');
}

function parseArchive(source) {
  const arrayBounds = findArchiveArray(source);
  const arrayText = source.slice(arrayBounds.start, arrayBounds.end);
  const declarationEnd = source.indexOf(';', arrayBounds.end);
  if (declarationEnd === -1) {
    throw new Error('Could not find MEDIUM_ARCHIVE_SEEDS declaration terminator.');
  }

  return {
    posts: JSON.parse(arrayText),
    arrayBounds: {
      ...arrayBounds,
      declarationEnd: declarationEnd + 1,
    },
  };
}

async function fetchMediumPosts() {
  const params = new URLSearchParams({
    rss_url: MEDIUM_FEED_URL,
  });
  const apiKey = process.env.RSS2JSON_API_KEY?.trim();
  if (apiKey) {
    params.set('api_key', apiKey);
    params.set('count', '100');
  }

  const fetchFeed = async (feedParams) => {
    const response = await fetch(`${RSS2JSON_ENDPOINT}?${feedParams.toString()}`, {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Medium feed: ${response.status}`);
    }

    return response.json();
  };

  let data = null;
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
    throw new Error(data?.message || 'Invalid Medium feed response.');
  }

  return (data.items || []).map(normalizeItem);
}

function normalizeSourceUrl(url) {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    parsed.search = '';
    parsed.hash = '';
    return parsed.toString();
  } catch {
    return url;
  }
}

function sortByPublishedAtDesc(a, b) {
  const dateA = Date.parse(a.publishedAt || '') || 0;
  const dateB = Date.parse(b.publishedAt || '') || 0;
  if (dateA !== dateB) return dateB - dateA;
  return a.slug.localeCompare(b.slug);
}

async function main() {
  const source = await fs.readFile(ARCHIVE_PATH, 'utf8');
  const { posts: archivedPosts, arrayBounds } = parseArchive(source);
  const archivedSlugs = new Set(archivedPosts.map((post) => post.slug));
  const archivedSources = new Set(archivedPosts.map((post) => normalizeSourceUrl(post.sourceUrl)));
  const mediumPosts = await fetchMediumPosts();

  const newPosts = mediumPosts.filter((post) => {
    if (archivedSlugs.has(post.slug)) return false;
    if (archivedSources.has(normalizeSourceUrl(post.sourceUrl))) return false;
    return true;
  });

  console.log(`Medium feed posts fetched: ${mediumPosts.length}`);
  console.log(`Archive posts already stored: ${archivedPosts.length}`);
  console.log(`New archive posts found: ${newPosts.length}`);

  if (newPosts.length === 0) {
    return;
  }

  for (const post of newPosts) {
    console.log(`- ${post.publishedAt}: ${post.title} (${post.type})`);
  }

  if (dryRun) {
    console.log('Dry run only. Archive file was not changed.');
    return;
  }

  const mergedPosts = [...newPosts, ...archivedPosts].sort(sortByPublishedAtDesc);
  const serialized = `${JSON.stringify(mergedPosts, null, 2)} satisfies MediumArchiveSeed[];`;
  const updatedSource = `${source.slice(0, arrayBounds.start)}${serialized}${source.slice(arrayBounds.declarationEnd)}`;

  await fs.writeFile(ARCHIVE_PATH, updatedSource);
  console.log(`Updated ${ARCHIVE_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
