import Script from 'next/script';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { buildMetadata } from '@/lib/seo';
import { buildFaqSchema } from '@/lib/schema';

export const metadata = buildMetadata({
  title: 'Understanding IVF Success Rates',
  description:
    'Learn how IVF success metrics are defined, what changes the denominator, and which methodology questions to ask before comparing clinic claims.',
  path: '/success-rates',
  keywords: ['ivf success rates by age', 'ivf outcomes', 'ivf success rate india', 'icsi success rate', 'santaan success rates'],
});

const ageBands = [
  { band: '<30', focus: 'Baseline assessment', note: 'Review diagnosis, ovarian reserve, semen factors and uterine findings before choosing a pathway.' },
  { band: '30–34', focus: 'Diagnosis-led planning', note: 'Protocol, lab strategy, uterine factors and treatment history should be considered together.' },
  { band: '35–37', focus: 'Time-aware planning', note: 'Discuss ovarian reserve, embryo factors and the value of cumulative planning across a full treatment plan.' },
  { band: '38–40', focus: 'Individual counselling', note: 'Review time sensitivity, prior response and the trade-offs among available treatment options.' },
  { band: '41–42', focus: 'Options review', note: 'Own-egg treatment, embryo factors and alternative pathways require individual clinical counselling.' },
  { band: '43+', focus: 'Specialist evaluation', note: 'A clinician should review diagnosis, treatment history and available pathways without relying on a headline percentage.' },
];

const methodNotes = [
  {
    title: 'What the numbers should represent',
    body: 'Define the exact metric before publishing: clinical pregnancy rate, live birth rate, or ongoing pregnancy rate. Use one primary metric and mention secondary metrics separately.',
  },
  {
    title: 'How we segment outcomes',
    body: 'Most audited reporting groups outcomes by maternal age, diagnosis (PCOS, endometriosis, male factor), and whether embryos were tested (PGT-A).',
  },
  {
    title: 'Why outcomes vary',
    body: 'Embryo genetics, ovarian reserve, sperm quality, uterine factors, and protocol adherence are major drivers. Lab processes and clinical decision quality also matter.',
  },
];

const faqs = [
  {
    question: 'Are success rates the same as live birth rates?',
    answer:
      'Not always. A success rate can mean different things (clinical pregnancy, ongoing pregnancy, or live birth). This page should clearly define the metric used once final numbers are approved.',
  },
  {
    question: 'Can you publish success rates by diagnosis?',
    answer:
      'Yes. Many clinics publish segmented success rates (PCOS, tubal factor, male factor, endometriosis) as long as the cohort size is sufficient and the methodology is clearly stated.',
  },
  {
    question: 'Does PGT-A improve outcomes?',
    answer:
      'PGT-A can reduce transfers of aneuploid embryos and may improve time-to-pregnancy in select cohorts, but it is not right for everyone. The decision should be individualized.',
  },
];

export default function SuccessRatesPage() {
  const faqSchema = buildFaqSchema(faqs);

  return (
    <main className="min-h-screen bg-santaan-cream">
      <Script id="success-rates-faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Header />

      <section className="pt-40 pb-20 bg-gradient-to-br from-santaan-teal via-santaan-teal/90 to-santaan-dark-teal text-white">
        <div className="container mx-auto px-4 md:px-6">
          <p className="uppercase tracking-[0.2em] text-santaan-amber text-xs font-semibold mb-4">Transparency</p>
          <h1 className="text-4xl md:text-6xl font-playfair font-bold max-w-4xl leading-tight">Understanding IVF Success Rates</h1>
          <p className="mt-6 max-w-3xl text-white/85 text-lg">
            Learn what clinic percentages measure, how age and diagnosis affect interpretation, and which methodology questions to ask before comparing outcomes.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/contact-centres" className="px-5 py-2.5 bg-santaan-amber text-white rounded-full font-semibold hover:bg-[#E08E45] transition-colors">
              Discuss your clinical profile
            </Link>
            <Link href="/pricing" className="px-5 py-2.5 border border-white/35 rounded-full font-semibold hover:bg-white/10 transition-colors">
              See pricing & EMI
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-10">
            <h2 className="text-2xl md:text-3xl font-playfair font-bold text-santaan-teal">Age-band planning context</h2>
            <p className="text-gray-600 mt-3 max-w-3xl">
              No clinic success percentage is published here. Any future Santaan outcome figure must include a defined metric, timeframe, cohort size and denominator after medical and legal review.
            </p>

            <div className="mt-8">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[18%] text-gray-700">Age band</TableHead>
                    <TableHead className="w-[26%] text-gray-700">Planning context</TableHead>
                    <TableHead className="text-gray-700">Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ageBands.map((row) => (
                    <TableRow key={row.band}>
                      <TableCell className="font-semibold text-gray-900">{row.band}</TableCell>
                      <TableCell className="font-semibold text-santaan-teal">{row.focus}</TableCell>
                      <TableCell className="text-gray-600">{row.note}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-8 rounded-2xl bg-santaan-sage/15 p-6">
              <p className="text-sm text-gray-800 font-semibold">Methodology disclaimer (keep this section when publishing)</p>
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                <li>Success rates depend on age, diagnosis, ovarian reserve, sperm factors, embryo genetics, and treatment adherence.</li>
                <li>Any published number should specify timeframe, cohort size, and the exact metric definition.</li>
                <li>Individual outcomes vary; consult a fertility specialist for a personalized plan.</li>
              </ul>
              <p className="mt-3 text-xs text-gray-600">This page provides comparison questions, not an individual prognosis or treatment promise.</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mt-10">
            {methodNotes.map((card) => (
              <div key={card.title} className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
                <h3 className="text-xl font-playfair font-bold text-gray-900">{card.title}</h3>
                <p className="mt-3 text-gray-600 leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 mt-10">
            <h3 className="text-xl md:text-2xl font-playfair font-bold text-santaan-teal">The “success rate” that matters</h3>
            <p className="text-gray-600 mt-3 max-w-4xl">
              Not all success rates mean the same thing. The most meaningful outcomes are typically live birth rate and cumulative chance across a full plan, not a selective number taken from one step of the cycle.
            </p>

            <div className="grid lg:grid-cols-2 gap-6 mt-6">
              <div className="rounded-2xl bg-santaan-sage/10 border border-santaan-sage/20 p-6">
                <h4 className="font-semibold text-gray-900">What can make success rates look higher</h4>
                <ul className="mt-4 space-y-2 text-sm text-gray-700">
                  <li>Reporting per embryo transfer instead of per started cycle.</li>
                  <li>Mixing donor egg outcomes with own-egg outcomes without clear labeling.</li>
                  <li>Excluding poor-prognosis cases from the denominator or reporting only “selected patients”.</li>
                  <li>Using “clinical pregnancy” instead of ongoing pregnancy or live birth.</li>
                  <li>Not separating fresh vs frozen transfers or not stating the time window.</li>
                </ul>
              </div>
              <div className="rounded-2xl bg-santaan-amber/10 border border-santaan-amber/20 p-6">
                <h4 className="font-semibold text-gray-900">How Santaan focuses on better decisions</h4>
                <ul className="mt-4 space-y-2 text-sm text-gray-700">
                  <li>We use advanced diagnostics and careful protocol selection to reduce trial-and-error.</li>
                  <li>Embryology and clinical decisions are aligned to the couple’s diagnosis, not a one-size-fits-all template.</li>
                  <li>Our care model emphasizes empathy and continuity because adherence and stress load affect outcomes.</li>
                  <li>Santaan Lab is our active R&amp;D unit that helps improve process consistency and decision quality.</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 rounded-2xl bg-gray-50/60 border border-gray-100 p-6">
              <h4 className="font-semibold text-gray-900">What to ask when a clinic advertises a success percentage</h4>
              <div className="grid md:grid-cols-2 gap-4 mt-4 text-sm text-gray-700">
                <div className="space-y-2">
                  <p className="font-medium text-gray-900">Ask: which metric?</p>
                  <p>Clinical pregnancy, ongoing pregnancy, or live birth? Ask them to define it in one line.</p>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-gray-900">Ask: what is the denominator?</p>
                  <p>Per started cycle, per retrieval, per transfer, or per embryo? This changes the number.</p>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-gray-900">Ask: what cohort?</p>
                  <p>Own eggs vs donor eggs, fresh vs frozen, PGT vs non-PGT, and age distribution.</p>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-gray-900">Ask: what timeframe?</p>
                  <p>Which years? How many cycles/transfers? Small samples can look artificially high.</p>
                </div>
              </div>
              <p className="mt-4 text-xs text-gray-500 max-w-4xl">
                This page is educational. It is not a guarantee of outcome. Individual success varies based on age, diagnosis, ovarian reserve, sperm factors and other clinical considerations.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 mt-10">
            <h3 className="text-xl font-playfair font-bold text-santaan-teal">Success rate FAQs</h3>
            <div className="mt-6 grid gap-4">
              {faqs.map((faq) => (
                <details key={faq.question} className="group rounded-xl border border-gray-100 bg-gray-50/40 p-5">
                  <summary className="cursor-pointer list-none font-semibold text-gray-900 flex items-center justify-between gap-4">
                    <span>{faq.question}</span>
                    <span className="text-santaan-teal group-open:rotate-180 transition-transform">▾</span>
                  </summary>
                  <p className="mt-3 text-gray-700 leading-relaxed">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
