import { NextRequest, NextResponse } from 'next/server';
import { getSantaanBlogPosts, type BlogType } from '@/lib/medium';
import { isPatientAudiencePost } from '@/lib/patient-content';

export const revalidate = 86400;
export const dynamic = 'force-dynamic';

const cachedJsonHeaders = {
  'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
  'CDN-Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
  'Vercel-CDN-Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
  'Netlify-CDN-Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const typeParam = searchParams.get('type');

    const limit = limitParam ? Number.parseInt(limitParam, 10) : undefined;
    const type = (
      typeParam === 'blog' || typeParam === 'news' || typeParam === 'doctor' ? typeParam : undefined
    ) as BlogType | undefined;

    const requestedLimit = Number.isFinite(limit) ? limit : undefined;
    const fetchLimit = type === 'blog'
      ? Math.max((requestedLimit || 6) * 4, 24)
      : requestedLimit;

    const posts = await getSantaanBlogPosts({
      limit: fetchLimit,
      type,
    });
    const visiblePosts = type === 'blog'
      ? posts.filter(isPatientAudiencePost).slice(0, requestedLimit || 6)
      : posts;

    return NextResponse.json({ posts: visiblePosts }, { headers: cachedJsonHeaders });
  } catch (error) {
    console.error('Failed to fetch Santaan blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500, headers: cachedJsonHeaders }
    );
  }
}
