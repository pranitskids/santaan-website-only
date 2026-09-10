import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PRIMARY_CALL_HREF, PRIMARY_CALL_NUMBER, PRIMARY_CENTER } from '@/data/centers';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Legal & Business Information',
  description:
    'Legal entity and business information for Santaan Fertility, including verified business contact details and address.',
  path: '/legal-business-information',
  keywords: ['Santaan Fertility legal information', 'Santaan Fertility business information'],
});

const businessDetails = [
  ['Brand Name', 'Santaan Fertility'],
  ['Legal Entity', 'SANTAAN FERTILITY CENTER & RESEARCH INSTITUTE PRIVATE LIMITED'],
  [
    'Business Type / Activity',
    'Fertility healthcare, reproductive medicine, fertility diagnostics and assisted reproductive technology services',
  ],
  ['Business Address', PRIMARY_CENTER.fullAddress],
  ['Business Email', 'info@santaan.in'],
  ['Business Phone', PRIMARY_CALL_NUMBER],
];

export default function LegalBusinessInformationPage() {
  return (
    <main className="min-h-screen bg-santaan-cream">
      <Header />
      <section className="px-4 py-20 md:py-28">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-santaan-amber mb-4">
            Legal &amp; Company
          </p>
          <h1 className="text-3xl md:text-5xl font-playfair font-bold text-santaan-teal mb-6">
            Legal &amp; Business Information
          </h1>
          <p className="text-gray-700 leading-relaxed max-w-3xl mb-10">
            The following information identifies the business operating under the Santaan Fertility brand.
            Contact details and address are based on the verified information currently maintained in this website repository.
          </p>

          <dl className="divide-y divide-santaan-teal/10 border-y border-santaan-teal/10">
            {businessDetails.map(([label, value]) => (
              <div key={label} className="grid gap-2 py-5 md:grid-cols-[minmax(12rem,0.8fr)_2fr] md:gap-8">
                <dt className="font-semibold text-santaan-teal">{label}</dt>
                <dd className="text-gray-700 leading-relaxed">
                  {label === 'Business Email' ? (
                    <a href="mailto:info@santaan.in" className="text-santaan-teal font-semibold hover:text-santaan-amber">
                      {value}
                    </a>
                  ) : label === 'Business Phone' ? (
                    <a href={PRIMARY_CALL_HREF} className="text-santaan-teal font-semibold hover:text-santaan-amber">
                      {value}
                    </a>
                  ) : (
                    value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <Footer />
    </main>
  );
}
