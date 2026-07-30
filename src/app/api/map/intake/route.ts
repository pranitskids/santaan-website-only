import { NextResponse } from "next/server";
import { pushWebsiteLeadToAiCrm, type WebsiteFormKind } from "@/lib/aicrm-website-intake";
import type { MarketingAttribution } from "@/lib/marketing-attribution";

const ALLOWED_ORIGINS = new Set([
  "https://map.santaan.in",
  "https://santaan.in",
  "https://www.santaan.in",
  "http://127.0.0.1:5173",
  "http://localhost:5173",
]);
const ACTION_FORM_KIND: Record<string, WebsiteFormKind> = {
  whatsapp: "map_whatsapp",
  callback: "map_callback",
  consultation: "map_consultation",
  "existing-patient": "map_existing_patient",
};
const ALLOWED_POSITIONS = new Set([
  "wondering",
  "trying",
  "reports",
  "comparing",
  "previous-treatment",
  "choosing-clinic",
  "existing-patient",
]);
const ALLOWED_HELP = new Set([
  "simple-explanation",
  "preparation-checklist",
  "questions-to-ask",
  "nearby-santaan",
  "private-whatsapp",
  "scheduled-callback",
  "consultation",
]);
const ALLOWED_LOCATIONS = new Set([
  "bhubaneswar",
  "berhampur",
  "angul",
  "south-odisha",
  "not-sure",
]);

const clean = (value: unknown, max: number) =>
  String(value ?? "")
    .trim()
    .slice(0, max);

function corsHeaders(origin: string | null): Record<string, string> {
  return origin && ALLOWED_ORIGINS.has(origin)
    ? {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        Vary: "Origin",
      }
    : {};
}

function response(
  body: Record<string, unknown>,
  status: number,
  origin: string | null,
) {
  return NextResponse.json(body, {
    status,
    headers: corsHeaders(origin),
  });
}

function journeyReference(submissionId: string) {
  return `MAP-${submissionId}`;
}

export function OPTIONS(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || !ALLOWED_ORIGINS.has(origin)) {
    return new NextResponse(null, { status: 403 });
  }
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && !ALLOWED_ORIGINS.has(origin)) {
    return response({ success: false, error: "origin_not_allowed" }, 403, origin);
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) {
    return response({ success: false, error: "invalid_json" }, 400, origin);
  }

  const action = clean(body.action, 40);
  const formKind = ACTION_FORM_KIND[action];
  const submissionId = clean(body.submissionId, 200);
  const journeyId = clean(body.journeyId, 200);
  const name = clean(body.name, 100);
  const phone = clean(body.phone, 24);
  const position = clean(body.position, 60);
  const helpRequested = clean(body.helpRequested, 60);
  const location = clean(body.location, 60);
  const consent = body.consent === true;
  const preferredWindow = clean(body.preferredWindow, 40);
  const language = clean(body.language, 20) === "Odia" ? "Odia" : "English";
  const satisfaction = clean(body.satisfaction, 40);
  const question = clean(body.question, 300);
  const topic = clean(body.topic, 80) || "private-guidance";
  const concerns = Array.isArray(body.concerns)
    ? body.concerns.map((value) => clean(value, 60)).filter(Boolean).slice(0, 3)
    : [];
  const rawAttribution =
    body.attribution && typeof body.attribution === "object"
      ? (body.attribution as Record<string, unknown>)
      : {};

  if (
    !formKind ||
    submissionId.length < 8 ||
    journeyId.length < 8 ||
    name.length < 2 ||
    phone.length < 10 ||
    !consent ||
    !ALLOWED_POSITIONS.has(position) ||
    !ALLOWED_HELP.has(helpRequested) ||
    !ALLOWED_LOCATIONS.has(location) ||
    (action === "callback" && !preferredWindow)
  ) {
    return response({ success: false, error: "invalid_request" }, 400, origin);
  }

  const attribution: MarketingAttribution = {
    fbclid: clean(rawAttribution.fbclid, 250) || undefined,
    gclid: clean(rawAttribution.gclid, 250) || undefined,
    gbraid: clean(rawAttribution.gbraid, 250) || undefined,
    wbraid: clean(rawAttribution.wbraid, 250) || undefined,
    ad_id: clean(rawAttribution.adId, 120) || undefined,
    ad_name: clean(rawAttribution.adName, 250) || undefined,
    adset_id: clean(rawAttribution.adsetId, 120) || undefined,
    adset_name: clean(rawAttribution.adsetName, 250) || undefined,
    campaign_id: clean(rawAttribution.campaignId, 120) || undefined,
    campaign_name: clean(rawAttribution.campaignName, 250) || undefined,
    placement: clean(rawAttribution.placement, 120) || undefined,
    ctwa_clid: clean(rawAttribution.ctwaClid, 250) || undefined,
    content_urn: clean(rawAttribution.contentUrn, 180) || undefined,
  };
  const source = clean(rawAttribution.source, 120) || "map_direct";
  const channel = clean(rawAttribution.channel, 80) || "website";
  const journeyRef = journeyReference(submissionId);
  const landingPage =
    clean(rawAttribution.landingPage, 1000) || "https://map.santaan.in/";

  const result = await pushWebsiteLeadToAiCrm(request, {
    submissionId,
    formKind,
    name,
    phone,
    location,
    campaign:
      clean(rawAttribution.utmCampaign, 180) ||
      clean(rawAttribution.campaignName, 180) ||
      `MAP_${topic.toUpperCase().replace(/-/g, "_")}`,
    landingPath: landingPage,
    referrer: clean(rawAttribution.referrer, 1000) || undefined,
    contentUrn: attribution.content_urn,
    attribution,
    utm: {
      utm_source: clean(rawAttribution.utmSource, 120) || source,
      utm_medium: clean(rawAttribution.utmMedium, 120) || channel,
      utm_campaign:
        clean(rawAttribution.utmCampaign, 180) || `map_${topic.replace(/-/g, "_")}`,
      utm_content: clean(rawAttribution.utmContent, 180) || undefined,
      utm_term: clean(rawAttribution.utmTerm, 180) || undefined,
    },
    formData: {
      journey_id: journeyId,
      journey_ref: journeyRef,
      map_action: action,
      journey_position: position,
      concerns: concerns.join("|"),
      help_requested: helpRequested,
      preferred_location: location,
      preferred_window: preferredWindow || null,
      language,
      satisfaction: satisfaction || null,
      patient_question: question || null,
      contact_permission:
        action === "callback" ? "callback_selected_window" : `${action}_only`,
      source,
      channel,
      embed: rawAttribution.embed === true,
    },
  });

  if (!result.ok) {
    return response(
      {
        success: false,
        accepted: false,
        error: result.error || "crm_intake_failed",
      },
      result.status,
      origin,
    );
  }

  return response(
    {
      success: true,
      accepted: true,
      duplicate: result.result?.duplicate === true,
      leadId: result.result?.lead_id,
      journeyRef,
      message:
        action === "whatsapp"
          ? "Request saved. Continue privately on WhatsApp."
          : "Your selected contact request has been saved.",
    },
    200,
    origin,
  );
}
