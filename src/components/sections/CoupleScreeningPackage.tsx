import Link from 'next/link';
import { ArrowRight, Check, MessageCircle, ShieldCheck } from 'lucide-react';
import { buttonVariants } from '@/components/ui/Button';
import { buildPrimaryWhatsappUrl } from '@/data/centers';
import { cn } from '@/lib/utils';

const packageItems = [
  'Semen analysis',
  'AMH blood test',
  'Pelvic ultrasound baseline scan',
  'Senior specialist doctor consultation',
  'Past medical records and second-opinion review',
];

const packageWhatsappUrl = buildPrimaryWhatsappUrl(
  "Hi Santaan, I'd like to check availability for the 5-in-1 Couple Screening Package (₹1,000). Please reply on WhatsApp; do not call unless I ask.",
);

export function CoupleScreeningPackage() {
  return (
    <section id="couple-screening" aria-labelledby="couple-screening-heading" className="scroll-mt-20 bg-[#f8f3ed] py-16 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] border border-santaan-sage/20 bg-white shadow-[0_24px_70px_rgba(47,79,79,0.10)] lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative flex flex-col justify-center bg-santaan-teal p-7 text-white md:p-10">
            <span className="w-fit rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]">
              Clear first step for couples
            </span>
            <p className="mt-5 text-sm font-medium text-white/75">ଦମ୍ପତି ପ୍ରାଥମିକ ଯାଞ୍ଚ ପ୍ୟାକେଜ୍</p>
            <h2 id="couple-screening-heading" className="mt-2 font-playfair text-3xl font-bold leading-tight md:text-4xl">
              5-in-1 Couple Screening Package — ₹1,000
            </h2>
            <p className="mt-5 leading-7 text-white/85">
              Five defined diagnostic steps with a standard diagnostic value of ₹5,000+, offered at a subsidised
              ₹1,000 screening fee.
            </p>
            <div className="mt-6 flex gap-3 rounded-2xl border border-santaan-amber/40 bg-white/10 p-4 text-sm leading-6 text-white/90">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-santaan-amber" />
              <p>This is an initial diagnostic screening package—not IVF treatment, surgery or a free-treatment offer.</p>
            </div>
          </div>

          <div className="p-7 md:p-10">
            <h3 className="font-playfair text-2xl font-bold text-santaan-teal">What the package includes</h3>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {packageItems.map((item) => (
                <li key={item} className="flex items-start gap-3 rounded-xl bg-santaan-cream/70 p-4 text-sm leading-6 text-gray-700">
                  <span className="mt-0.5 rounded-full bg-santaan-sage/20 p-1 text-santaan-teal">
                    <Check className="h-4 w-4" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-6 text-gray-600">
              Ask about availability in Bhubaneswar (Nayapalli), Berhampur (Gajapati Nagar) or Angul (Bazarapada).
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href={packageWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cta-kind="whatsapp"
                data-center="Network"
                data-cta-target={packageWhatsappUrl}
                className={cn(buttonVariants({ size: 'lg' }), 'bg-emerald-600 hover:bg-emerald-700')}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Check availability on WhatsApp
              </a>
              <Link
                href="/fertility-map"
                data-cta-kind="guide"
                data-center="Network"
                data-cta-target="/fertility-map"
                className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
              >
                Understand the IVF process
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            <p className="mt-3 text-xs text-gray-500">We reply on WhatsApp. No call unless you request one.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
