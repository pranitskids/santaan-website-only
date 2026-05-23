import fs from 'node:fs';
import path from 'node:path';

const REVIEW_DIR = path.join(process.cwd(), 'content', 'patient-reviews');

export type ReviewPlatform = 'google' | 'facebook' | 'patient-story' | 'internal';
export type ReviewStatus = 'draft' | 'approved' | 'archived';

export interface PatientReview {
  slug: string;
  status: ReviewStatus;
  platform: ReviewPlatform;
  displayName: string;
  city: string;
  center?: string;
  rating?: number;
  reviewDate?: string;
  sourceUrl?: string;
  featured: boolean;
  displayOrder: number;
  tags: string[];
  consent?: string;
  body: string;
}

interface ReviewOptions {
  featured?: boolean;
  center?: string;
  limit?: number;
}

function splitFrontmatter(raw: string) {
  const normalized = raw.replace(/^\uFEFF/, '');
  if (!normalized.startsWith('---\n')) {
    return { frontmatter: '', body: normalized.trim() };
  }

  const endIndex = normalized.indexOf('\n---', 4);
  if (endIndex === -1) {
    return { frontmatter: '', body: normalized.trim() };
  }

  return {
    frontmatter: normalized.slice(4, endIndex).trim(),
    body: normalized.slice(endIndex + 4).trim(),
  };
}

function parseScalar(value: string): string | number | boolean | string[] {
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);

  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    return trimmed
      .slice(1, -1)
      .split(',')
      .map((item) => item.trim().replace(/^["']|["']$/g, ''))
      .filter(Boolean);
  }

  return trimmed.replace(/^["']|["']$/g, '');
}

function parseFrontmatter(frontmatter: string): Record<string, string | number | boolean | string[]> {
  const fields: Record<string, string | number | boolean | string[]> = {};

  for (const line of frontmatter.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const colonIndex = trimmed.indexOf(':');
    if (colonIndex === -1) continue;

    const key = trimmed.slice(0, colonIndex).trim();
    const value = trimmed.slice(colonIndex + 1);
    fields[key] = parseScalar(value);
  }

  return fields;
}

function stringField(fields: Record<string, unknown>, key: string, fallback = '') {
  const value = fields[key];
  return typeof value === 'string' ? value.trim() : fallback;
}

function numberField(fields: Record<string, unknown>, key: string, fallback = 0) {
  const value = fields[key];
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function booleanField(fields: Record<string, unknown>, key: string, fallback = false) {
  const value = fields[key];
  return typeof value === 'boolean' ? value : fallback;
}

function tagsField(fields: Record<string, unknown>) {
  const value = fields.tags;
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function normalizePlatform(value: string): ReviewPlatform {
  if (value === 'facebook' || value === 'patient-story' || value === 'internal') return value;
  return 'google';
}

function normalizeStatus(value: string): ReviewStatus {
  if (value === 'approved' || value === 'archived') return value;
  return 'draft';
}

function parseReviewFile(filename: string): PatientReview | null {
  const fullPath = path.join(REVIEW_DIR, filename);
  const raw = fs.readFileSync(fullPath, 'utf8');
  const { frontmatter, body } = splitFrontmatter(raw);
  const fields = parseFrontmatter(frontmatter);
  const slug = filename.replace(/\.md$/i, '');
  const displayName = stringField(fields, 'displayName', 'Anonymous patient');
  const city = stringField(fields, 'city', 'Santaan IVF');

  if (!body || slug.startsWith('_')) return null;

  return {
    slug,
    status: normalizeStatus(stringField(fields, 'status')),
    platform: normalizePlatform(stringField(fields, 'platform')),
    displayName,
    city,
    center: stringField(fields, 'center') || undefined,
    rating: numberField(fields, 'rating') || undefined,
    reviewDate: stringField(fields, 'reviewDate') || undefined,
    sourceUrl: stringField(fields, 'sourceUrl') || undefined,
    featured: booleanField(fields, 'featured'),
    displayOrder: numberField(fields, 'displayOrder', 1000),
    tags: tagsField(fields),
    consent: stringField(fields, 'consent') || undefined,
    body,
  };
}

export function getPatientReviews(): PatientReview[] {
  if (!fs.existsSync(REVIEW_DIR)) return [];

  return fs
    .readdirSync(REVIEW_DIR)
    .filter((filename) => filename.endsWith('.md'))
    .map(parseReviewFile)
    .filter((review): review is PatientReview => review !== null)
    .sort((a, b) => {
      if (a.displayOrder !== b.displayOrder) return a.displayOrder - b.displayOrder;
      return a.displayName.localeCompare(b.displayName);
    });
}

export function getApprovedPatientReviews(options: ReviewOptions = {}): PatientReview[] {
  let reviews = getPatientReviews().filter((review) => review.status === 'approved');

  if (typeof options.featured === 'boolean') {
    reviews = reviews.filter((review) => review.featured === options.featured);
  }

  if (options.center) {
    const center = options.center.toLowerCase();
    reviews = reviews.filter((review) => review.center?.toLowerCase() === center || review.city.toLowerCase() === center);
  }

  if (typeof options.limit === 'number') {
    reviews = reviews.slice(0, Math.max(0, options.limit));
  }

  return reviews;
}
