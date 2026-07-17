export const CANONICAL_GA4_ID =
  process.env.NEXT_PUBLIC_CANONICAL_GA4_ID?.trim() || 'G-T5E4SKLMG3';

export function getAnalyticsConfig() {
  const mode = process.env.NEXT_PUBLIC_ANALYTICS_MODE?.trim().toLowerCase();
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID?.trim() || process.env.GTM_ID?.trim();

  return {
    mode: mode === 'gtm' && gtmId ? 'gtm' as const : 'gtag' as const,
    gtmId: mode === 'gtm' ? gtmId : undefined,
    googleTagId: CANONICAL_GA4_ID,
  };
}
