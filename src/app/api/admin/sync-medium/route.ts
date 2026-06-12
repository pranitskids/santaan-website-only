import { NextRequest, NextResponse } from 'next/server';
import { syncMediumPostsToStore } from '@/lib/medium';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const syncSecret = request.headers.get('x-sync-secret');
  const expectedSecret = process.env.SYNC_SECRET;

  if (!syncSecret || syncSecret !== expectedSecret) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const result = await syncMediumPostsToStore({ limit: 100 });
    return NextResponse.json({ 
      success: true, 
      synced: result.synced 
    });
  } catch (error) {
    console.error('Medium sync failed:', error);
    return NextResponse.json(
      { success: false, error: 'Sync failed' },
      { status: 500 }
    );
  }
}
