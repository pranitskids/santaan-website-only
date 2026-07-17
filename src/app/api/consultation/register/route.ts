import { NextResponse } from 'next/server';
import { getCenterProfileByCity } from '@/data/centers';
import { pushWebsiteLeadToAiCrm } from '@/lib/aicrm-website-intake';
import { ensureMandatoryUtm } from '@/lib/utm';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body?.name || '').trim();
    const phone = String(body?.phone || '').trim();
    const email = body?.email ? String(body.email).trim() : '';
    const concern = body?.concern ? String(body.concern).trim() : '';
    const centre = body?.centre ? String(body.centre).trim() : '';
    const submissionId = String(body?.submissionId || '').trim();
    const centerProfile = getCenterProfileByCity(centre);
    const utm = ensureMandatoryUtm({ ...(body?.utm || {}), center: centre.toLowerCase() });

    if (!name || !phone || !centerProfile || submissionId.length < 8) {
      return NextResponse.json(
        { error: 'Name, phone number and a valid Odisha centre are required.' },
        { status: 400 },
      );
    }

    const result = await pushWebsiteLeadToAiCrm(request, {
      submissionId,
      formKind: 'book_consultation',
      name,
      phone,
      email,
      location: centerProfile.city,
      campaign: centerProfile.comingSoon ? 'JEYPORE_COMING_SOON' : `CONSULTATION_${centerProfile.city.toUpperCase()}`,
      utm,
      landingPath: String(body?.landingPath || utm.landing_path || centerProfile.href),
      referrer: body?.referrer ? String(body.referrer) : undefined,
      occurredAt: body?.occurredAt ? String(body.occurredAt) : undefined,
      attribution: body?.attribution,
      contentUrn: body?.attribution?.content_urn,
      formData: {
        concern,
        appointment_type: centerProfile.comingSoon ? 'opening_update' : 'private_consultation',
        preferred_centre: centerProfile.city,
        centre_status: centerProfile.comingSoon ? 'coming_soon' : 'active',
      },
    });

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error || 'Failed to register your consultation request.' },
        { status: result.status },
      );
    }

    return NextResponse.json({
      success: true,
      duplicate: result.result?.duplicate === true,
      leadId: result.result?.lead_id,
      message: centerProfile.comingSoon
        ? 'Interest registered for Jeypore opening updates.'
        : 'Private consultation request received.',
    });
  } catch (error) {
    console.error('Consultation registration error:', error);
    return NextResponse.json({ error: 'Failed to register your request.' }, { status: 500 });
  }
}
