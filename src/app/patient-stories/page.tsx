import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PatientReviewCard } from '@/components/sections/PatientReviews';
import { buildMetadata } from '@/lib/seo';
import { getApprovedPatientReviews } from '@/lib/patient-reviews';
import { PRIMARY_WHATSAPP_URL } from '@/data/centers';
import { MessageCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata = buildMetadata({
  title: 'Patient Stories & Reviews',
  description:
    'Read curated Santaan IVF patient stories and approved public feedback from families across Odisha.',
  path: '/patient-stories',
  keywords: ['Santaan IVF reviews', 'fertility patient stories', 'IVF patient feedback'],
});

export default function PatientStoriesPage() {
  const reviews = getApprovedPatientReviews();

  return (
    <main id="main-content" className="min-h-screen bg-santaan-cream">
      <Header />
      <section className="relative overflow-hidden bg-santaan-teal pt-32 pb-20 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.22),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.16),transparent_34%)]" />
        <div className="container relative mx-auto px-4 md:px-6">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-santaan-amber">Patient voices</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight md:text-6xl font-playfair">
              Reviews and stories from families who chose Santaan
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-white/85">
              Curated public reviews and patient feedback, anonymized when appropriate. The goal is simple: help new couples understand the care experience before they take the first step.
            </p>
            <Link
              href={PRIMARY_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-cta-kind="whatsapp"
              data-center="Network"
              data-cta-target={PRIMARY_WHATSAPP_URL}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-950/20 transition hover:bg-emerald-400"
            >
              <MessageCircle className="h-4 w-4" />
              Talk to Santaan on WhatsApp
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          {reviews.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {reviews.map((review) => (
                <PatientReviewCard key={review.slug} review={review} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-santaan-sage/20 bg-white p-8 text-center">
              <h2 className="text-2xl font-bold text-santaan-teal font-playfair">No approved patient stories yet</h2>
              <p className="mt-3 text-gray-600">Add approved Markdown files under content/patient-reviews to publish this page.</p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
