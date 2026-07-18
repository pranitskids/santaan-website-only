import { resolveCenter } from "@/lib/lead-attribution";
import { ensureMandatoryUtm, type UtmParams } from "@/lib/utm";
import type { MarketingAttribution } from "@/lib/marketing-attribution";

const DEFAULT_INTAKE_URL = "https://api.crmai.greybrain.ai/api/intake/lead";
const DEFAULT_SITE_URL = "https://www.santaan.in";
const CLEAN_PHONE = /[^0-9]/g;

export type WebsiteFormKind = "at_home_testing" | "seminar_registration" | "book_consultation";

export type WebsiteIntakeInput = {
  submissionId: string;
  formKind: WebsiteFormKind;
  name: string;
  phone: string;
  email?: string;
  location?: string;
  campaign: string;
  landingPath: string;
  referrer?: string;
  contentUrn?: string;
  occurredAt?: string;
  utm?: UtmParams;
  attribution?: MarketingAttribution;
  formData?: Record<string, string | number | boolean | null>;
};

type IntakeResponse = {
  accepted?: boolean;
  duplicate?: boolean;
  lead_id?: string;
  submission_id?: string;
  event_id?: string;
  capi?: { queued?: boolean; status?: string };
  error?: string;
  message?: string;
};

export const normalizeWebsiteLeadPhone = (value: string) => {
  const digits = value.replace(CLEAN_PHONE, "");
  if (!digits) return "";
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  return `+${digits}`;
};

const canonicalLandingPage = (landingPath: string) => {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim() || DEFAULT_SITE_URL;
  const configuredUrl = new URL(configured);
  const base = ["santaan.in", "www.santaan.in"].includes(configuredUrl.hostname)
    ? configuredUrl
    : new URL(DEFAULT_SITE_URL);
  const landing = new URL(landingPath || "/", base);
  landing.protocol = "https:";
  landing.hostname = base.hostname;
  landing.port = "";
  return landing.toString();
};

const clientIp = (request: Request) =>
  request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
  request.headers.get("x-real-ip")?.trim() ||
  undefined;

export async function pushWebsiteLeadToAiCrm(request: Request, input: WebsiteIntakeInput) {
  const secret = process.env.AICRM_WEBSITE_INTAKE_SECRET?.trim();
  if (!secret) {
    return { ok: false, status: 503, error: "Website intake is not configured." };
  }

  const normalizedPhone = normalizeWebsiteLeadPhone(input.phone);
  if (!normalizedPhone) {
    return { ok: false, status: 400, error: "A valid WhatsApp number is required." };
  }

  const utm = ensureMandatoryUtm(input.utm || {});
  const landingPage = canonicalLandingPage(input.landingPath || utm.landing_path || "/");
  const center = resolveCenter({
    center: input.location || utm.center,
    landingPath: new URL(landingPage).pathname,
    target: input.phone,
  });
  const attribution = input.attribution || {};
  const payload = {
    submission_id: input.submissionId,
    event_id: input.submissionId,
    form_kind: input.formKind,
    name: input.name.trim(),
    phone: normalizedPhone,
    email: input.email?.trim().toLowerCase() || undefined,
    location: input.location?.trim() || center,
    campaign: input.campaign,
    landing_page: landingPage,
    referrer: input.referrer?.trim() || undefined,
    content_urn: input.contentUrn?.trim() || attribution.content_urn || undefined,
    occurred_at: input.occurredAt,
    utm: {
      utm_source: utm.utm_source,
      utm_medium: utm.utm_medium,
      utm_campaign: utm.utm_campaign,
      utm_term: utm.utm_term,
      utm_content: utm.utm_content,
    },
    attribution: {
      fbclid: attribution.fbclid,
      fbp: attribution.fbp,
      fbc: attribution.fbc,
      gclid: attribution.gclid,
      gbraid: attribution.gbraid,
      wbraid: attribution.wbraid,
      ad_id: attribution.ad_id,
      ad_name: attribution.ad_name,
      campaign_id: attribution.campaign_id,
    },
    client: {
      ip_address: clientIp(request),
      user_agent: request.headers.get("user-agent")?.slice(0, 500) || undefined,
    },
    form_data: input.formData || {},
  };

  try {
    const response = await fetch(
      process.env.AICRM_WEBSITE_INTAKE_URL?.trim() || DEFAULT_INTAKE_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${secret}`,
        },
        body: JSON.stringify(payload),
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      },
    );
    const responseText = await response.text();
    const result = (() => {
      if (!responseText) return {};
      try {
        return JSON.parse(responseText) as IntakeResponse;
      } catch {
        return {};
      }
    })();
    const accepted = response.ok && result.accepted === true && Boolean(result.lead_id);
    return {
      ok: accepted,
      status: response.status,
      result,
      error: accepted
        ? undefined
        : result.error ||
          result.message ||
          (response.ok ? "CRM did not accept the lead." : `CRM returned ${response.status}.`),
    };
  } catch (error) {
    console.error("AICRM website intake error:", error);
    return { ok: false, status: 502, error: "CRM intake could not be reached." };
  }
}
