export type MarketingAttribution = {
  fbclid?: string;
  fbp?: string;
  fbc?: string;
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  ad_id?: string;
  ad_name?: string;
  campaign_id?: string;
  content_urn?: string;
};

const STORAGE_KEY = "santaan_marketing_attribution";
const MAX_VALUE_LENGTH = 250;

const clean = (value: string | null | undefined) => {
  const normalized = value?.trim().slice(0, MAX_VALUE_LENGTH);
  return normalized || undefined;
};

const readCookie = (name: string) => {
  if (typeof document === "undefined") return undefined;
  const prefix = `${name}=`;
  return clean(
    document.cookie
      .split(";")
      .map((item) => item.trim())
      .find((item) => item.startsWith(prefix))
      ?.slice(prefix.length),
  );
};

const readStoredAttribution = (): MarketingAttribution => {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") as MarketingAttribution;
  } catch {
    return {};
  }
};

export const readMarketingAttribution = (): MarketingAttribution => {
  const stored = readStoredAttribution();
  return {
    ...stored,
    fbp: readCookie("_fbp") || stored.fbp,
    fbc: readCookie("_fbc") || stored.fbc,
  };
};

export const captureMarketingAttribution = (url: string) => {
  if (typeof window === "undefined") return;
  const parsed = new URL(url, window.location.origin);
  const params = parsed.searchParams;
  const existing = readMarketingAttribution();
  const fbclid = clean(params.get("fbclid")) || existing.fbclid;

  const next: MarketingAttribution = {
    fbclid,
    fbp: readCookie("_fbp") || existing.fbp,
    fbc:
      readCookie("_fbc") ||
      existing.fbc ||
      (fbclid ? `fb.1.${Date.now()}.${fbclid}` : undefined),
    gclid: clean(params.get("gclid")) || existing.gclid,
    gbraid: clean(params.get("gbraid")) || existing.gbraid,
    wbraid: clean(params.get("wbraid")) || existing.wbraid,
    ad_id: clean(params.get("ad_id")) || existing.ad_id,
    ad_name: clean(params.get("ad_name")) || existing.ad_name,
    campaign_id: clean(params.get("campaign_id")) || existing.campaign_id,
    content_urn:
      clean(params.get("content_urn")) || clean(params.get("urn")) || existing.content_urn,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Attribution capture must never block the page or its forms.
  }
};

export const createWebsiteSubmissionId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `web-${crypto.randomUUID()}`;
  }
  return `web-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
};
