import Link from 'next/link';
import { ArrowRight, Building2, LineChart, ShieldCheck } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Founder Notes on Fertility Access in India',
  description:
    'Santaan founder notes on India fertility access, IVF market gaps, patient trust, tier-2 care delivery and the opportunity to build ethical fertility infrastructure.',
  path: '/founder-notes',
  keywords: [
    'fertility startup India',
    'IVF market India',
    'fertility investor India',
    'healthcare startup Odisha',
    'Santaan founder notes',
  ],
});

const thesisCards = [
  {
    icon: Building2,
    title: 'Eastern India is under-supplied',
    body:
      'Large tier-2 and tier-3 populations still travel for fertility care, creating a gap between demand, trust, clinical access and affordability.',
  },
  {
    icon: ShieldCheck,
    title: 'Trust is the real infrastructure',
    body:
      'Fertility care is not only a procedure market. It depends on local language, ethical counseling, transparent pricing and continuity after setbacks.',
  },
  {
    icon: LineChart,
    title: 'Technology must lower friction',
    body:
      'AI, lab quality systems and structured patient pathways matter when they reduce delay, confusion and unnecessary treatment cycles.',
  },
];

const founderReads = [
  {
    title: 'The Eastern India Fertility Gap: A Blueprint for Investment in 2026',
    href: '/fertility-insights/the-eastern-india-fertility-gap-a-blueprint-for-investment-in-2026',
    description:
      'Why the eastern corridor of Odisha, Bengal, Jharkhand and Bihar is structurally under-served by organized fertility care.',
  },
  {
    title: 'India’s IVF Trust Gap: Why Rural Demand Remains Unmet',
    href: '/fertility-insights/indias-ivf-trust-gap-why-rural-demand-remains-unmet-santaan',
    description:
      'A founder lens on why patient trust, stigma and geography shape fertility demand more than advertising alone.',
  },
  {
    title: 'Why India’s IVF Boom Is Hiding a Patient Experience Crisis',
    href: '/fertility-insights/why-indias-ivf-boom-is-hiding-a-patient-experience-crisis-and-how-to-fix-it',
    description:
      'How growth in IVF must be matched by better counseling, failure support, transparency and patient-centered design.',
  },
];

export default function FounderNotesPage() {
  return (
    <main className="min-h-screen bg-santaan-cream">
      <Header />

      <section className="pt-36 pb-20 bg-gradient-to-br from-santaan-teal via-santaan-teal/90 to-santaan-dark-teal text-white">
        <div className="container mx-auto px-4 md:px-6">
          <p className="uppercase tracking-[0.2em] text-santaan-amber text-xs font-semibold mb-4">Founder Notes</p>
          <h1 className="text-4xl md:text-6xl font-playfair font-bold max-w-4xl leading-tight">
            Building ethical fertility access for India’s next decade.
          </h1>
          <p className="mt-6 max-w-3xl text-white/90 text-lg leading-relaxed">
            Notes on fertility infrastructure, patient trust, technology adoption, and the opportunity to serve India beyond premium metro markets.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/fertility-insights/the-eastern-india-fertility-gap-a-blueprint-for-investment-in-2026"
              className="inline-flex items-center gap-2 rounded-full bg-santaan-amber px-5 py-2.5 font-semibold text-white hover:bg-[#E08E45] transition-colors"
            >
              Read the investment thesis
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/clinical-insights"
              className="inline-flex items-center gap-2 rounded-full border border-white/35 px-5 py-2.5 font-semibold hover:bg-white/10 transition-colors"
            >
              Clinical insights
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="grid gap-6 md:grid-cols-3">
            {thesisCards.map((card) => (
              <article key={card.title} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-santaan-sage/20 text-santaan-teal">
                  <card.icon className="h-5 w-5" />
                </div>
                <h2 className="mt-5 text-xl font-playfair font-bold text-gray-900">{card.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-gray-700">{card.body}</p>
              </article>
            ))}
          </div>

          <div className="mt-12 rounded-3xl border border-gray-100 bg-white p-6 md:p-8 shadow-sm">
            <div className="max-w-3xl">
              <p className="uppercase tracking-[0.2em] text-santaan-amber text-xs font-semibold">Crawlable founder archive</p>
              <h2 className="mt-3 text-3xl md:text-4xl font-playfair font-bold text-santaan-teal">
                Founder and market notes for investors, partners and healthcare builders.
              </h2>
              <p className="mt-4 text-gray-700 leading-relaxed">
                These articles stay on Santaan’s canonical domain so search engines can connect our patient care, clinical research and market-building narrative in one place.
              </p>
            </div>

            <div className="mt-8 grid gap-5">
              {founderReads.map((post) => (
                <Link
                  key={post.href}
                  href={post.href}
                  className="group rounded-2xl border border-santaan-sage/30 bg-santaan-cream/40 p-5 hover:bg-white transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-santaan-teal transition-colors">{post.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-700">{post.description}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-santaan-teal">
                    Read note
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-10 rounded-3xl border border-gray-100 bg-white p-6 md:p-8 shadow-sm">
            <p className="uppercase tracking-[0.2em] text-santaan-amber text-xs font-semibold">Publishing guidance</p>
            <h2 className="mt-3 text-2xl md:text-3xl font-playfair font-bold text-santaan-teal">
              Where this content should live next
            </h2>
            <p className="mt-4 text-gray-700 leading-relaxed">
              Long-form founder and investor pieces should be published on Santaan first, then syndicated to LinkedIn and Medium with a canonical link back to this domain. That keeps authority with Santaan while still letting non-technical writers use familiar channels.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
