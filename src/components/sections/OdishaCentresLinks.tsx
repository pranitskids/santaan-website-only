import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CENTER_PROFILES } from '@/data/centers';

export function OdishaCentresLinks() {
  return (
    <section className="pb-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-santaan-amber">Local care</p>
          <h2 className="mt-3 font-playfair text-2xl font-bold text-santaan-teal md:text-3xl">Our Odisha Centres</h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-gray-600">
            Choose the city page that matches your location so the enquiry, call and consultation request reach the appropriate centre team.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CENTER_PROFILES.map((centre) => (
              <Link
                key={centre.slug}
                href={centre.href}
                className="group rounded-xl border border-santaan-sage/30 bg-santaan-cream/40 p-4 transition-colors hover:bg-white"
              >
                <span className="flex items-center justify-between gap-3 font-semibold text-santaan-teal">
                  {centre.city}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
                <span className="mt-2 block text-sm text-gray-600">
                  {centre.comingSoon ? 'Coming soon — register for updates' : 'View centre details and consultation form'}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
