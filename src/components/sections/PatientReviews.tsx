import Link from 'next/link';
import { ArrowRight, ExternalLink, MessageCircle, Quote, Star } from 'lucide-react';
import type { PatientReview } from '@/lib/patient-reviews';
import { PRIMARY_WHATSAPP_URL } from '@/data/centers';

const platformLabels: Record<PatientReview['platform'], string> = {
  google: 'Google review',
  facebook: 'Facebook review',
  'patient-story': 'Patient story',
  internal: 'Patient feedback',
};

function ReviewStars({ rating }: { rating?: number }) {
  const count = Math.max(0, Math.min(5, Math.round(rating || 0)));
  if (!count) return null;

  return (
    <div className="flex items-center gap-1 text-santaan-amber" role="img" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, index) => (
        <Star key={index} className="h-4 w-4 fill-current" />
      ))}
    </div>
  );
}

export function PatientReviewCard({ review, compact = false }: { review: PatientReview; compact?: boolean }) {
  const paragraphs = review.body.split(/\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean);

  return (
    <article className="relative flex h-full flex-col rounded-3xl border border-santaan-sage/20 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <Quote className="absolute right-5 top-5 h-10 w-10 text-santaan-teal/10" />
      <div className="flex flex-wrap items-center gap-3 pr-10">
        <span className="rounded-full bg-santaan-cream px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-santaan-teal">
          {platformLabels[review.platform]}
        </span>
        <ReviewStars rating={review.rating} />
      </div>

      <div className={`mt-5 space-y-3 text-gray-700 leading-relaxed ${compact ? 'line-clamp-5' : ''}`}>
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>&ldquo;{paragraph}&rdquo;</p>
        ))}
      </div>

      <div className="mt-6 border-t border-gray-100 pt-4">
        <p className="font-semibold text-gray-900">{review.displayName}</p>
        <p className="text-sm text-gray-500">
          {review.city}
          {review.reviewDate ? ` · ${review.reviewDate}` : ''}
        </p>
      </div>

      {review.sourceUrl ? (
        <Link
          href={review.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-santaan-teal hover:text-santaan-amber"
        >
          View original
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      ) : null}
    </article>
  );
}

export function PatientReviewsSection({ reviews }: { reviews: PatientReview[] }) {
  if (reviews.length === 0) return null;

  return (
    <section id="patient-reviews" className="relative overflow-hidden bg-[#FDF6F0] py-20">
      <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-santaan-amber/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-santaan-teal/10 blur-3xl" />
      <div className="container relative mx-auto px-4 md:px-6">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-santaan-amber">Patient voices</span>
          <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl font-playfair">
            What families say after meeting Santaan
          </h2>
          <p className="mt-4 text-gray-600">
            Curated public feedback and patient stories, anonymized where needed, so couples can understand the Santaan experience before they reach out.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {reviews.slice(0, 3).map((review) => (
            <PatientReviewCard key={review.slug} review={review} compact />
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/patient-stories"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-santaan-teal px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-santaan-teal/90"
          >
            Read more patient stories
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href={PRIMARY_WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-cta-kind="whatsapp"
            data-center="Network"
            data-cta-target={PRIMARY_WHATSAPP_URL}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-santaan-teal/30 bg-white px-6 py-3 text-sm font-semibold text-santaan-teal transition hover:border-santaan-teal hover:bg-white"
          >
            <MessageCircle className="h-4 w-4" />
            Ask on WhatsApp
          </Link>
        </div>
      </div>
    </section>
  );
}
