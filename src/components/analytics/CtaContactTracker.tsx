"use client";

import { useEffect } from "react";
import { ensureMandatoryUtm, readUtmParams } from "@/lib/utm";
import { resolveCenter } from "@/lib/lead-attribution";
import { readMarketingAttribution } from "@/lib/marketing-attribution";

type CtaAction = "call" | "whatsapp" | "book";

const VISITOR_STORAGE_KEY = "santaan_visitor_id";
const PHONE_REGEX = /^tel:/i;
const WHATSAPP_REGEX = /(wa\.me|whatsapp\.com|api\.whatsapp\.com)/i;

type AnalyticsWindow = Window & {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
};

const buildVisitorId = () => {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
        return crypto.randomUUID();
    }
    return `visitor_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
};

const getVisitorId = () => {
    if (typeof window === "undefined") return "visitor_server";
    const existing = localStorage.getItem(VISITOR_STORAGE_KEY);
    if (existing) return existing;
    const next = buildVisitorId();
    localStorage.setItem(VISITOR_STORAGE_KEY, next);
    return next;
};

const resolveActionFromElement = (element: HTMLElement): { action: CtaAction; target: string; center?: string } | null => {
    const ctaKind = element.dataset.ctaKind?.toLowerCase();
    const ctaCenter = element.dataset.center;
    const ctaTarget = element.dataset.ctaTarget;

    if (ctaKind === "call" || ctaKind === "whatsapp" || ctaKind === "book") {
        if (ctaTarget) {
            return { action: ctaKind, target: ctaTarget, center: ctaCenter };
        }

        if (element instanceof HTMLAnchorElement && element.href) {
            return { action: ctaKind, target: element.href, center: ctaCenter };
        }

        return { action: ctaKind, target: window.location.href, center: ctaCenter };
    }

    if (element instanceof HTMLAnchorElement) {
        const rawHref = element.getAttribute("href") || "";
        const href = rawHref || element.href || "";

        if (PHONE_REGEX.test(href)) {
            return { action: "call", target: href, center: ctaCenter };
        }

        if (WHATSAPP_REGEX.test(href)) {
            return { action: "whatsapp", target: href, center: ctaCenter };
        }

        const normalizedHref = href.toLowerCase();
        if (normalizedHref.includes("/at-home-fertility-testing") || normalizedHref.includes("book-assessment")) {
            return { action: "book", target: href, center: ctaCenter };
        }
    }

    if (element.tagName === "BUTTON") {
        const text = element.textContent?.toLowerCase() || "";
        if (text.includes("book")) {
            return { action: "book", target: window.location.href, center: ctaCenter };
        }
    }

    return null;
};

export const getGoogleEventName = (action: CtaAction) => {
    if (action === "whatsapp") return "whatsapp_click";
    if (action === "book") return "appointment_start";
    return "call_click";
};

const emitIntentSignal = (input: {
    action: CtaAction;
    center: string;
    target: string;
    landingPath: string;
    utm: Record<string, unknown>;
    attribution: Record<string, unknown>;
    visitorId: string;
}) => {
    if (typeof window === "undefined") return;

    const analyticsWindow = window as AnalyticsWindow;
    const eventName = getGoogleEventName(input.action);
    const params = {
        event_category: "lead_intent",
        event_label: `${input.action}_${input.center.toLowerCase()}`,
        lead_channel: input.action,
        centre: input.center,
        center: input.center,
        cta_target: input.target,
        phone_number: input.action === "call" ? input.target.replace(/^tel:/i, "") : undefined,
        page_path: input.landingPath,
        landing_path: input.landingPath,
        gclid: input.attribution.gclid,
        gbraid: input.attribution.gbraid,
        wbraid: input.attribution.wbraid,
        utm_source: input.utm.utm_source,
        utm_medium: input.utm.utm_medium,
        utm_campaign: input.utm.utm_campaign,
        utm_term: input.utm.utm_term,
        utm_content: input.utm.utm_content,
        value: input.action === "book" ? 3 : input.action === "whatsapp" ? 2 : 1,
    };

    analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
    if (process.env.NEXT_PUBLIC_ANALYTICS_MODE?.trim().toLowerCase() === "gtm") {
        analyticsWindow.dataLayer.push({ event: eventName, ...params });
    } else if (analyticsWindow.gtag) {
        analyticsWindow.gtag("event", eventName, params);
    } else {
        analyticsWindow.dataLayer.push(["event", eventName, params]);
    }

    void fetch("/api/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            event_id: `intent:${input.visitorId}:${Date.now()}`,
            event_name: "Contact",
            kind: input.action,
            center: input.center,
            target: input.target,
            page_url: window.location.href,
            landing_path: input.landingPath,
            referrer: document.referrer,
            visitor_id: input.visitorId,
            fbp: input.attribution.fbp,
            fbc: input.attribution.fbc,
            gclid: input.attribution.gclid,
            gbraid: input.attribution.gbraid,
            wbraid: input.attribution.wbraid,
            content_urn: input.attribution.content_urn,
            utm: input.utm,
        }),
        keepalive: true,
    }).catch(() => undefined);
};

export default function CtaContactTracker() {
    useEffect(() => {
        if (typeof window === "undefined") return;

        const handleClick = (event: MouseEvent) => {
            const origin = event.target as HTMLElement | null;
            if (!origin) return;

            const trackable = origin.closest<HTMLElement>("[data-cta-kind],a[href],button");
            if (!trackable) return;

            const cta = resolveActionFromElement(trackable);
            if (!cta) return;

            const landingPath = `${window.location.pathname}${window.location.search}`;
            const utm = ensureMandatoryUtm({ ...readUtmParams(), landing_path: landingPath });
            const attribution = readMarketingAttribution();
            const center = resolveCenter({
                center: cta.center || new URL(window.location.href).searchParams.get("center"),
                landingPath,
                target: cta.target,
            });
            const visitorId = getVisitorId();

            emitIntentSignal({
                action: cta.action,
                center,
                target: cta.target,
                landingPath,
                utm,
                attribution,
                visitorId,
            });
        };

        document.addEventListener("click", handleClick, { capture: true });
        return () => document.removeEventListener("click", handleClick, { capture: true });
    }, []);

    return null;
}
