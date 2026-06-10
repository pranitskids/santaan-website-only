import type { SocialItem } from '@/components/sections/SocialCarousel';

const SANTAAN_YOUTUBE_CHANNEL_ID = 'UCWzGAaPiWAguNtXlSiYJNLg';
const SANTAAN_YOUTUBE_FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${SANTAAN_YOUTUBE_CHANNEL_ID}`;

function decodeXmlEntities(value: string): string {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_match, code: string) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&#(\d+);/g, (_match, code: string) => String.fromCodePoint(parseInt(code, 10)))
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function extractTag(block: string, tagName: string): string | undefined {
  const match = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i').exec(block);
  return match?.[1] ? decodeXmlEntities(match[1]).replace(/\s+/g, ' ').trim() : undefined;
}

function extractAttribute(block: string, pattern: RegExp): string | undefined {
  const match = pattern.exec(block);
  return match?.[1] ? decodeXmlEntities(match[1]).trim() : undefined;
}

function normalizeYoutubeTitle(title: string): string {
  return title
    .replace(/\s*[|·-]\s*Santaan(?:\s+Fertility|\s+IVF)?\s*$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseYoutubeFeed(xml: string): SocialItem[] {
  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/gi)].map((match) => match[1]);

  return entries
    .map((entry): SocialItem | null => {
      const videoId = extractTag(entry, 'yt:videoId');
      const title = extractTag(entry, 'title');
      const link = extractAttribute(entry, /<link\b[^>]*\bhref="([^"]+)"/i);
      const thumb = extractAttribute(entry, /<media:thumbnail\b[^>]*\burl="([^"]+)"/i);

      if (!videoId || !title) return null;

      const url = link || `https://www.youtube.com/watch?v=${videoId}`;
      return {
        title: normalizeYoutubeTitle(title),
        platform: url.includes('/shorts/') ? 'youtube-short' : 'youtube',
        url,
        thumb: thumb || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      };
    })
    .filter((item): item is SocialItem => Boolean(item));
}

export async function getSantaanYoutubeHighlights(options?: { limit?: number }): Promise<SocialItem[]> {
  const limit = Math.max(1, Math.min(options?.limit || 8, 12));

  try {
    const response = await fetch(SANTAAN_YOUTUBE_FEED_URL, {
      cache: 'force-cache',
      headers: {
        Accept: 'application/atom+xml, application/xml;q=0.9, text/xml;q=0.8',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch YouTube feed: ${response.status}`);
    }

    return parseYoutubeFeed(await response.text()).slice(0, limit);
  } catch (error) {
    console.error('YouTube feed fetch failed:', error);
    return [];
  }
}
