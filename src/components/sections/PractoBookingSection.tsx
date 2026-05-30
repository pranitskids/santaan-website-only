"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { AlertCircle, CalendarDays, CheckCircle2, ExternalLink, LoaderCircle, MessageCircle, PhoneCall, ShieldCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";
import { PRACTO_BOOKING_URL, PRIMARY_CALL_HREF, PRIMARY_CALL_NUMBER, PRIMARY_WHATSAPP_BOOKING_URL } from "@/data/centers";
import { cn } from "@/lib/utils";

const practoWidgetId = process.env.NEXT_PUBLIC_PRACTO_WIDGET_ID?.trim() || "183548fb196d70a5";
const practoBookingUrl = process.env.NEXT_PUBLIC_PRACTO_BOOKING_URL?.trim() || PRACTO_BOOKING_URL;
const practoDoctorLabel =
  process.env.NEXT_PUBLIC_PRACTO_DOCTOR_LABEL?.trim() || "Santaan Fertility Centre and Research Institute";
const practoLocationLabel = process.env.NEXT_PUBLIC_PRACTO_LOCATION_LABEL?.trim() || "Berhampur, Odisha";
const practoWidgetMarkup = `<practo:abs_widget widget="${practoWidgetId}"></practo:abs_widget>`;

const trustPoints = [
  "Confidential fertility consultation with specialist-led guidance",
  "Choose a convenient slot online or continue on WhatsApp",
  "Designed as a low-friction first step before advanced testing or IVF planning",
];

type WidgetStatus = "idle" | "loading" | "ready" | "fallback";

function hasRenderedPractoWidget(host: HTMLElement | null) {
  if (!host) return false;

  const text = host.textContent?.trim() || "";
  if (/book|appointment|consult/i.test(text)) return true;

  if (host.querySelector("iframe")) return true;

  return Array.from(host.querySelectorAll("a, button")).some((node) => {
    const label = node.textContent?.trim() || "";
    return label.length > 0;
  });
}

export function PractoBookingSection() {
  const callHref = PRIMARY_CALL_HREF;
  const whatsappBookingHref = PRIMARY_WHATSAPP_BOOKING_URL;
  const hostRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const [widgetStatus, setWidgetStatus] = useState<WidgetStatus>(practoWidgetId ? "loading" : "idle");

  useEffect(() => {
    if (!practoWidgetId) return;

    const host = hostRef.current;
    if (!host) return;

    if (hasRenderedPractoWidget(host)) {
      timeoutRef.current = window.setTimeout(() => {
        setWidgetStatus("ready");
      }, 0);
      return;
    }

    const observer = new MutationObserver(() => {
      if (hasRenderedPractoWidget(host)) {
        if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        setWidgetStatus("ready");
      }
    });

    observer.observe(host, { childList: true, subtree: true, characterData: true });

    timeoutRef.current = window.setTimeout(() => {
      if (!hasRenderedPractoWidget(host)) {
        setWidgetStatus("fallback");
      }
    }, 4500);

    return () => {
      observer.disconnect();
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <section
      id="book-consultation"
      className="relative overflow-hidden bg-gradient-to-br from-[#f8f3ed] via-white to-[#eef5f1] py-24 scroll-mt-24"
    >
      {practoWidgetId ? (
        <Script
          id="practo-widget-helper"
          src="https://www.practo.com/bundles/practopractoapp/js/abs_widget_helper.js"
          strategy="afterInteractive"
          onLoad={() => {
            const host = hostRef.current;
            if (hasRenderedPractoWidget(host)) {
              setWidgetStatus("ready");
              return;
            }

            setWidgetStatus("loading");
          }}
          onError={() => {
            setWidgetStatus("fallback");
          }}
        />
      ) : null}

      <div className="absolute inset-0 opacity-60">
        <div className="absolute left-0 top-12 h-64 w-64 rounded-full bg-santaan-amber/15 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-santaan-teal/10 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-santaan-teal/10 bg-white/80 px-4 py-1.5 text-sm font-semibold tracking-wide text-santaan-teal shadow-sm">
              <CalendarDays className="h-4 w-4 text-santaan-amber" />
              Appointment booking
            </span>

            <h2 className="mt-5 mx-auto max-w-xl font-playfair text-3xl font-bold text-santaan-teal md:text-5xl">
              Book your consultation without losing the Santaan experience
            </h2>

            <p className="mt-4 mx-auto max-w-2xl text-base leading-7 text-santaan-teal/80 md:text-lg">
              Pick your preferred slot with {practoDoctorLabel}. The booking area stays inside a branded Santaan shell,
              while the inner Practo interface remains intact for reliability.
            </p>

            <div className="mt-8 mx-auto max-w-2xl grid gap-4">
              {trustPoints.map((point) => (
                <div
                  key={point}
                  className="flex items-start gap-3 rounded-2xl border border-santaan-teal/10 bg-white/75 px-4 py-4 shadow-[0_12px_30px_rgba(47,79,79,0.06)] backdrop-blur"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-santaan-amber" />
                  <p className="text-sm leading-6 text-santaan-teal/85 md:text-[15px]">{point}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={whatsappBookingHref}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Book on WhatsApp
              </a>
              <a href={callHref} className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full sm:w-auto")}>
                <PhoneCall className="mr-2 h-5 w-5" />
                Call Santaan
              </a>
            </div>
          </div>

          
        </div>
      </div>
    </section>
  );
}
