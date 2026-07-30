import type { Metadata } from "next";
import { FertilityMapEmbed } from "@/components/features/FertilityMapEmbed";

export const metadata: Metadata = {
  title: "Private Fertility Guidance Map | Santaan Fertility",
  description:
    "Explore a private educational fertility map before deciding whether to message, request a callback or book a consultation.",
  alternates: { canonical: "/fertility-map" },
};

export default function FertilityMapPage() {
  return (
    <main className="bg-[#f7f5ef] px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-7 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
            Private guidance before contact
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Find where you are before choosing the next step.
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Explore without entering your name or number. You decide whether to continue
            on WhatsApp, request a callback or ask for a consultation.
          </p>
        </div>
        <FertilityMapEmbed />
      </div>
    </main>
  );
}
