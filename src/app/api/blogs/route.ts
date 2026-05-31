import { NextRequest, NextResponse } from 'next/server';
import { getSantaanBlogPosts, type BlogType } from '@/lib/medium';
import { isPatientAudiencePost } from '@/lib/patient-content';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

const uncachedJsonHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'Netlify-CDN-Cache-Control': 'no-store',
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

    return NextResponse.json({ posts: visiblePosts }, { headers: uncachedJsonHeaders });
  } catch (error) {
    console.error('Failed to fetch Santaan blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500, headers: uncachedJsonHeaders }
    );
  }
}
