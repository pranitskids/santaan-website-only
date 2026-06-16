import Link from 'next/link';
import { ArrowRight, CheckCircle2, MessageCircle, PhoneCall } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { SeoCostPageData } from '@/content/seoCostPages';
import { PRIMARY_CALL_NUMBER, buildPrimaryWhatsappUrl } from '@/data/centers';
import { buildBreadcrumbSchema, buildFaqSchema } from '@/lib/schema';
import { getSiteUrl } from '@/lib/site';

interface CostLandingPageProps {
  page: SeoCostPageData;
}

export function CostLandingPage({ page }: CostLandingPageProps) {
  const baseUrl = getSiteUrl();
  const pageUrl = `${baseUrl}/${page.slug}`;
  const faqSchema = buildFaqSchema(page.faqs);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: `${baseUrl}/` },
    { name: 'Pricing', url: `${baseUrl}/pricing` },
    { name: page.h1, url: pageUrl },
  ]);
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: page.h1,
    description: page.description,
    url: pageUrl,
    about: {
      '@type': 'MedicalProcedure',
      name: page.primaryKeyword,
    },
    publisher: {
      '@type': 'MedicalOrganization',
      name: 'Santaan IVF',
      url: baseUrl,
    },
  };
  const callHref = `tel:${PRIMARY_CALL_NUMBER.replace(/[^0-9+]/g, '')}`;
  const whatsappHref = buildPrimaryWhatsappUrl(`Hi, I'd like a cost estimate for ${page.h1}`);

  return (
    <main className="min-h-screen bg-santaan-cream">
      <Header />

      <section className="pt-36 pb-20 bg-gradient-to-br from-santaan-teal via-santaan-teal/90 to-santaan-dark-teal text-white">
        <div className="container mx-auto px-4 md:px-6">
          <p className="uppercase tracking-[0.2em] text-santaan-amber text-xs font-semibold mb-4">{page.kicker}</p>
          <h1 className="text-4xl md:text-6xl font-playfair font-bold max-w-4xl leading-tight">{page.h1}</h1>
          <p className="mt-6 max-w-3xl text-white/90 text-lg leading-relaxed">{page.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              data-cta-kind="whatsapp"
              data-center="Network"
              data-cta-target={whatsappHref}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              Ask for cost estimate
            </a>
            <a
              href={callHref}
              data-cta-kind="call"
              data-center="Network"
              data-cta-target={callHref}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/40 font-semibold hover:bg-white/10 transition-colors"
            >
              <PhoneCall className="h-4 w-4" />
              Call Santaan
            </a>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/40 font-semibold hover:bg-white/10 transition-colors"
            >
              Full pricing guide
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <aside className="rounded-3xl border border-gray-100 bg-white p-6 md:p-8 shadow-sm">
              <p className="uppercase tracking-[0.2em] text-santaan-amber text-xs font-semibold">Quick answer</p>
              <h2 className="mt-3 text-2xl md:text-3xl font-playfair font-bold text-santaan-teal">Planning range</h2>
              <p className="mt-4 text-3xl font-playfair font-bold text-gray-900">{page.planningRange}</p>
              <p className="mt-4 text-sm leading-relaxed text-gray-700">{page.quickAnswer}</p>
              <div className="mt-6 rounded-2xl bg-santaan-sage/15 border border-santaan-sage/30 p-4">
                <p className="text-sm font-semibold text-gray-900">Important guardrail</p>
                <p className="mt-2 text-sm leading-relaxed text-gray-700">
                  These are planning ranges, not a medical quote. Final cost changes after report review and specialist consultation.
                </p>
              </div>
            </aside>

            <div className="rounded-3xl border border-gray-100 bg-white p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl md:text-3xl font-playfair font-bold text-santaan-teal">Cost components to compare</h2>
              <p className="mt-3 text-gray-600">
                Use this table to compare written estimates. The safest quote is the one that clearly lists what is included and what may be billed separately.
              </p>
              <div className="mt-7">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[34%] text-gray-700">Component</TableHead>
                      <TableHead className="w-[28%] text-gray-700">Planning range</TableHead>
                      <TableHead className="text-gray-700">What to check</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {page.rows.map((row) => (
                      <TableRow key={row.item}>
                        <TableCell className="font-semibold text-gray-900">{row.item}</TableCell>
                        <TableCell className="font-semibold text-santaan-teal">{row.range}</TableCell>
                        <TableCell className="text-gray-600">{row.note}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="grid gap-6">
              {page.sections.map((section) => (
                <article key={section.heading} className="rounded-3xl border border-gray-100 bg-white p-6 md:p-8 shadow-sm">
                  <h2 className="text-2xl md:text-3xl font-playfair font-bold text-santaan-teal">{section.heading}</h2>
                  <p className="mt-3 text-gray-700 leading-relaxed">{section.body}</p>
                </article>
              ))}
            </div>

            <aside className="rounded-3xl border border-gray-100 bg-white p-6 md:p-8 shadow-sm h-fit">
              <p className="uppercase tracking-[0.2em] text-santaan-amber text-xs font-semibold">What changes cost</p>
              <h2 className="mt-3 text-2xl font-playfair font-bold text-santaan-teal">Main cost drivers</h2>
              <div className="mt-5 grid gap-3">
                {page.factors.map((factor) => (
                  <div key={factor} className="flex gap-3 rounded-2xl bg-santaan-cream/60 border border-santaan-sage/20 p-4">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-santaan-teal" />
                    <p className="text-sm leading-relaxed text-gray-700">{factor}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>

          <div className="mt-10 rounded-3xl border border-gray-100 bg-white p-6 md:p-8 shadow-sm">
            <h2 className="text-2xl md:text-3xl font-playfair font-bold text-santaan-teal">Frequently asked questions</h2>
            <div className="mt-6 grid gap-4">
              {page.faqs.map((faq) => (
                <article key={faq.question} className="rounded-2xl border border-santaan-sage/30 bg-santaan-cream/40 p-5">
                  <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-700">{faq.answer}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-10 rounded-3xl border border-gray-100 bg-white p-6 md:p-8 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="uppercase tracking-[0.2em] text-santaan-amber text-xs font-semibold">Next useful step</p>
                <h2 className="mt-3 text-2xl md:text-3xl font-playfair font-bold text-santaan-teal">Continue from cost comparison to a real plan</h2>
              </div>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                data-cta-kind="whatsapp"
                data-center="Network"
                data-cta-target={whatsappHref}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
              >
                Ask on WhatsApp
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {page.related.map((related) => (
                <Link
                  key={`${related.href}-${related.label}`}
                  href={related.href}
                  className="rounded-2xl border border-santaan-sage/30 bg-santaan-cream/40 p-5 hover:bg-white transition-colors"
                >
                  <h3 className="font-semibold text-gray-900">{related.label}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-700">{related.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <Footer />
    </main>
  );
}
