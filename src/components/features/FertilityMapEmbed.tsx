"use client";

import { useEffect, useRef, useState } from "react";

const MAP_ORIGIN = "https://map.santaan.in";

type FertilityMapEmbedProps = {
  topic?: string;
  className?: string;
  language?: "en" | "or";
};

export function FertilityMapEmbed({
  topic = "private-guidance",
  className = "",
  language = "en",
}: FertilityMapEmbedProps) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(760);

  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (
        event.origin !== MAP_ORIGIN ||
        event.source !== frameRef.current?.contentWindow ||
        event.data?.type !== "santaan-map-resize"
      ) {
        return;
      }
      const nextHeight = Number(event.data.height);
      if (Number.isFinite(nextHeight)) {
        setHeight(Math.min(1800, Math.max(560, nextHeight)));
      }
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, []);

  const source = `${MAP_ORIGIN}/${language}?embed=1&channel=website&source=santaan_website&topic=${encodeURIComponent(
    topic,
  )}&utm_source=santaan_website&utm_medium=owned&utm_campaign=fertility_map`;

  return (
    <iframe
      ref={frameRef}
      src={source}
      title="Santaan IVF process quick guide"
      className={`w-full rounded-3xl border border-slate-200 bg-[#f7f5ef] shadow-sm ${className}`}
      style={{ height }}
      loading="lazy"
      sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
      referrerPolicy="strict-origin-when-cross-origin"
      allow="clipboard-write"
    />
  );
}
