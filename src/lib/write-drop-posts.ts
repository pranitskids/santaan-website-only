import fs from 'node:fs';
import path from 'node:path';
import { marked } from 'marked';
import type { BlogType, SantaanBlogPost } from '@/lib/medium';

const WRITE_DROP_DIR = path.join(process.cwd(), 'content', 'write-drop');

type WriteDropStatus = 'draft' | 'approved' | 'archived';

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

function tagsField(fields: Record<string, unknown>) {
  const value = fields.tags;
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function normalizeStatus(value: string): WriteDropStatus {
  if (value === 'approved' || value === 'archived') return value;
  return 'draft';
}

function normalizeType(value: string): BlogType {
  if (value === 'doctor' || value === 'news') return value;
  return 'blog';
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

function estimateReadMinutes(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

function normalizeSlug(filename: string, frontmatterSlug: string) {
  return (frontmatterSlug || filename.replace(/\.md$/i, '')).trim().toLowerCase();
}

function buildExcerpt(explicitExcerpt: string, plainText: string) {
  if (explicitExcerpt) return explicitExcerpt;
  return plainText.slice(0, 180) + (plainText.length > 180 ? '...' : '');
}

function parseWriteDropFile(filename: string): SantaanBlogPost | null {
  const fullPath = path.join(WRITE_DROP_DIR, filename);
  const raw = fs.readFileSync(fullPath, 'utf8');
  const { frontmatter, body } = splitFrontmatter(raw);
  const fields = parseFrontmatter(frontmatter);

  if (!body || filename.startsWith('_')) return null;

  const html = marked.parse(body, { gfm: true, breaks: false }) as string;
  const plainText = stripHtml(html);
  const slug = normalizeSlug(filename, stringField(fields, 'slug'));

  return {
    slug,
    title: stringField(fields, 'title', slug.replace(/-+/g, ' ')),
    excerpt: buildExcerpt(stringField(fields, 'excerpt'), plainText),
    html,
    publishedAt: stringField(fields, 'publishedAt', new Date().toISOString()),
    author: stringField(fields, 'author', 'Santaan Editorial Team'),
    thumbnail: stringField(fields, 'thumbnail') || undefined,
    tags: tagsField(fields),
    sourceUrl: stringField(fields, 'sourceUrl', ''),
    type: normalizeType(stringField(fields, 'type')),
    readMinutes: estimateReadMinutes(plainText),
    status: normalizeStatus(stringField(fields, 'status')),
  } as SantaanBlogPost & { status: WriteDropStatus };
}

export function getWriteDropPosts(
  options?: { type?: BlogType; limit?: number; status?: WriteDropStatus }
): SantaanBlogPost[] {
  if (!fs.existsSync(WRITE_DROP_DIR)) return [];

  const targetStatus = options?.status ?? 'approved';
  let posts = fs
    .readdirSync(WRITE_DROP_DIR)
    .filter((filename) => filename.endsWith('.md'))
    .map(parseWriteDropFile)
    .filter((post): post is SantaanBlogPost & { status: WriteDropStatus } => post !== null)
    .filter((post) => post.status === targetStatus)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  if (options?.type) {
    posts = posts.filter((post) => post.type === options.type);
  }

  if (typeof options?.limit === 'number') {
    posts = posts.slice(0, Math.max(0, options.limit));
  }

  return posts;
}
