type AnalyticsWindow = Window & {
    gtag?: (command: string, eventName: string, params?: Record<string, unknown>) => void;
    dataLayer?: unknown[];
    fbq?: (...args: unknown[]) => void;
};

export function trackConfirmedLead(input: {
    leadId: string;
    formKind: string;
    leadChannel?: string;
    center?: string;
}) {
    if (typeof window === "undefined") return;

    const analyticsWindow = window as AnalyticsWindow;
    const eventId = `crmai:${input.leadId}:Lead`;
    const params = {
        event_category: "lead_completion",
        event_label: input.formKind,
        form_kind: input.formKind,
        lead_channel: input.leadChannel || "form",
        center: input.center || "Network",
        event_id: eventId,
        value: 1,
        currency: "INR",
    };

    if (analyticsWindow.gtag) {
        analyticsWindow.gtag("event", "generate_lead", params);
    } else {
        analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
        analyticsWindow.dataLayer.push({ event: "generate_lead", ...params });
    }

    analyticsWindow.fbq?.(
        "track",
        "Lead",
        {
            content_category: "website_form",
            content_name: input.formKind,
            lead_channel: input.leadChannel || "form",
            center: input.center || "Network",
        },
        { eventID: eventId }
    );
}
