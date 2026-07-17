import { NextResponse } from 'next/server';

const DEFAULT_INTENT_URL = 'https://api.crmai.greybrain.ai/api/website/intent';
const ALLOWED_KINDS = new Set(['call', 'whatsapp', 'book', 'content']);

const clean = (value: unknown, max: number) => String(value ?? '').trim().slice(0, max);

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });

  const kind = clean(body.kind, 40).toLowerCase();
  const eventId = clean(body.event_id, 200);
  if (!ALLOWED_KINDS.has(kind) || !eventId) {
    return NextResponse.json({ ok: false, error: 'invalid_intent' }, { status: 400 });
  }

  const payload = {
    ...body,
    kind,
    event_id: eventId,
    event_name: 'Contact',
    test_event_code: undefined,
  };

  try {
    const response = await fetch(process.env.AICRM_WEBSITE_INTENT_URL?.trim() || DEFAULT_INTENT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://www.santaan.in',
        'User-Agent': request.headers.get('user-agent')?.slice(0, 500) || 'SantaanWebsite/1.0',
        'X-Forwarded-For': request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '',
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
      signal: AbortSignal.timeout(3000),
    });
    const result = await response.json().catch(() => ({}));
    return NextResponse.json(result, { status: response.ok ? 200 : 502 });
  } catch {
    // A tracking outage must never block the visitor's call or WhatsApp action.
    return NextResponse.json({ ok: false, error: 'intent_unavailable' }, { status: 202 });
  }
}
