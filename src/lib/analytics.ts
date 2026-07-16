import type { MarketingAttribution } from '@/lib/marketing-attribution';
import type { UtmParams } from '@/lib/utm';

type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
};

const TRACKED_LEADS_KEY = 'santaan_confirmed_lead_events';

function hasAlreadyTracked(eventId: string) {
  try {
    const tracked = JSON.parse(sessionStorage.getItem(TRACKED_LEADS_KEY) || '[]') as string[];
    if (tracked.includes(eventId)) return true;
    sessionStorage.setItem(TRACKED_LEADS_KEY, JSON.stringify([...tracked.slice(-49), eventId]));
  } catch {
    // Analytics storage must never block a successful form confirmation.
  }
  return false;
}

export function trackConfirmedLead(input: {
  leadId: string;
  centre: string;
  formName: string;
  utm: UtmParams;
  attribution: MarketingAttribution;
  appointmentType?: string;
}) {
  if (typeof window === 'undefined' || !input.leadId) return;

  const eventId = `lead:${input.leadId}:${input.formName}`;
  if (hasAlreadyTracked(eventId)) return;

  const analyticsWindow = window as AnalyticsWindow;
  const params = {
    lead_id: input.leadId,
    centre: input.centre,
    center: input.centre,
    form_name: input.formName,
    appointment_type: input.appointmentType,
    gclid: input.attribution.gclid,
    gbraid: input.attribution.gbraid,
    wbraid: input.attribution.wbraid,
    utm_source: input.utm.utm_source,
    utm_medium: input.utm.utm_medium,
    utm_campaign: input.utm.utm_campaign,
    utm_term: input.utm.utm_term,
    utm_content: input.utm.utm_content,
    landing_page: `${window.location.pathname}${window.location.search}`,
    event_id: eventId,
  };

  analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
  if (process.env.NEXT_PUBLIC_ANALYTICS_MODE?.trim().toLowerCase() === 'gtag') {
    if (analyticsWindow.gtag) {
      analyticsWindow.gtag('event', 'generate_lead', params);
    } else {
      analyticsWindow.dataLayer.push(['event', 'generate_lead', params]);
    }
  } else {
    analyticsWindow.dataLayer.push({ event: 'generate_lead', ...params });
  }

  analyticsWindow.fbq?.(
    'track',
    'Lead',
    {
      content_category: 'website_form',
      content_name: input.formName,
      centre: input.centre,
    },
    { eventID: eventId },
  );
}
