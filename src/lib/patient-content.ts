import type { SantaanBlogPost } from '@/lib/medium';
import { tagToSlug } from '@/lib/tag-utils';

export interface PatientContentQuality {
  wordCount: number;
  hasStructuredSections: boolean;
  hasLongformSignal: boolean;
  isSubstantive: boolean;
  isReady: boolean;
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

export function getPatientContentQuality(post: SantaanBlogPost): PatientContentQuality {
  const html = post.html || '';
  const plain = stripHtml(html);
  const wordCount = plain.split(/\s+/).filter(Boolean).length;

  const hasStructuredSections = /<h[1-6]|<ol|<ul/i.test(html);
  const hasLongformSignal = wordCount >= 700;
  const isSubstantive = wordCount >= 220;
  const isReady = isSubstantive && (hasStructuredSections || hasLongformSignal);

  return {
    wordCount,
    hasStructuredSections,
    hasLongformSignal,
    isSubstantive,
    isReady,
  };
}

export function isPatientReadyPost(post: SantaanBlogPost): boolean {
  if (!isPatientAudiencePost(post)) return false;
  return getPatientContentQuality(post).isReady;
}

export function isPatientAudiencePost(post: SantaanBlogPost): boolean {
  // If post is explicitly doctor or news, it's not for patients
  if (post.type === 'doctor' || post.type === 'news') return false;
  // All other posts (type: 'blog') are for patients
  return true;
}
