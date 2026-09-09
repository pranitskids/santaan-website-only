import Link from "next/link";
import { FertilityMapEmbed } from "@/components/features/FertilityMapEmbed";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { buildBreadcrumbSchema, buildFaqSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site";

const description =
  "Understand the IVF process step by step, including tests, injections, egg retrieval, fertilisation, embryo transfer, timing and common questions.";

export const metadata = buildMetadata({
  title: "IVF Process Guide: Steps, Timeline and FAQs",
  description,
  path: "/fertility-map",
  keywords: ["IVF process", "IVF steps", "IVF timeline", "IVF procedure in Odisha", "IVF guide"],
});

const stages = [
  {
    title: "Consultation and fertility tests",
    text: "A fertility specialist reviews both partners’ medical history and may recommend blood tests, ultrasound and semen analysis before personalising the plan.",
  },
  {
    title: "Ovarian stimulation",
    text: "Prescribed hormone injections encourage several follicles to develop, with scans and blood tests used to monitor the response.",
  },
  {
    title: "Egg retrieval",
    text: "Mature eggs are collected during a short, ultrasound-guided procedure performed with sedation or anaesthesia.",
  },
  {
    title: "Fertilisation and embryo culture",
    text: "Eggs and sperm are combined using conventional IVF or ICSI when advised, and the resulting embryos are observed in the laboratory.",
  },
  {
    title: "Embryo transfer",
    text: "A selected embryo is placed in the uterus using a thin catheter. Your clinician explains medication and activity guidance for your situation.",
  },
  {
    title: "Pregnancy test and follow-up",
    text: "A pregnancy test is performed on the date advised by the clinic, followed by monitoring or a review of the next options.",
  },
];

const faqs = [
  {
    question: "How long does one IVF cycle take?",
    answer:
      "A cycle often takes several weeks from initial preparation to the pregnancy test. The exact timeline varies with the treatment protocol, response to medication and whether embryo freezing or genetic testing is involved.",
  },
  {
    question: "Is IVF painful?",
    answer:
      "Experience varies. Injections and stimulation can cause temporary discomfort or bloating. Egg retrieval is performed with sedation or anaesthesia, while embryo transfer is usually a short procedure. Ask your clinician what to expect with your protocol.",
  },
  {
    question: "Does every IVF patient need ICSI or genetic testing?",
    answer:
      "No. ICSI and preimplantation genetic testing are recommended only in selected situations. Your fertility specialist should explain the potential benefits, limits and costs in relation to your history.",
  },
  {
    question: "What happens after embryo transfer?",
    answer:
      "Continue medicines exactly as prescribed and attend the pregnancy test on the advised date. Contact your clinic about concerning symptoms, and do not stop medication without medical guidance.",
  },
];

export default function FertilityMapPage() {
  const baseUrl = getSiteUrl();
  const faqSchema = buildFaqSchema(faqs);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: baseUrl },
    { name: "IVF Process Guide", url: `${baseUrl}/fertility-map` },
  ]);
  const processSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "IVF process steps",
    description,
    numberOfItems: stages.length,
    itemListElement: stages.map((stage, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: stage.title,
      description: stage.text,
      url: `${baseUrl}/fertility-map#ivf-step-${index + 1}`,
    })),
  };

  return (
    <main className="min-h-screen bg-[#f7f5ef]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(processSchema) }} />

      <Header />
      <div className="mx-auto max-w-6xl px-4 pb-10 pt-36 sm:px-6">
        <div className="mb-7 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
            Private, educational IVF guide
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            What Happens in IVF? A Step-by-Step Guide
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Explore the IVF process, typical timing and common questions without entering your name or
            number. Switch between English and Odia inside the guide, and contact Santaan only if you choose.
          </p>
        </div>
        <FertilityMapEmbed />

        <section aria-labelledby="ivf-steps-heading" className="mx-auto mt-14 max-w-5xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">IVF at a glance</p>
            <h2 id="ivf-steps-heading" className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              The main steps in an IVF cycle
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              Every treatment plan is individual. This overview explains the usual sequence; your clinician
              may adapt, add or omit steps based on your diagnosis and response.
            </p>
          </div>

          <ol className="mt-8 grid gap-4 md:grid-cols-2">
            {stages.map((stage, index) => (
              <li
                id={`ivf-step-${index + 1}`}
                key={stage.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <p className="text-sm font-bold text-teal-700">Step {index + 1}</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-950">{stage.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{stage.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="ivf-faq-heading" className="mx-auto mt-14 max-w-5xl">
          <h2 id="ivf-faq-heading" className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Common IVF questions
          </h2>
          <div className="mt-6 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white px-6 shadow-sm">
            {faqs.map((faq) => (
              <article key={faq.question} className="py-6">
                <h3 className="text-lg font-semibold text-slate-950">{faq.question}</h3>
                <p className="mt-2 leading-7 text-slate-600">{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <aside className="mx-auto mt-10 max-w-5xl rounded-2xl bg-[#073f3c] p-6 text-white sm:p-8">
          <h2 className="text-2xl font-semibold">Ready to discuss your situation?</h2>
          <p className="mt-3 max-w-3xl leading-7 text-teal-50">
            Learn about{" "}
            <Link href="/treatments/ivf" className="font-semibold underline underline-offset-4">
              IVF treatment
            </Link>
            , review{" "}
            <Link href="/pricing" className="font-semibold underline underline-offset-4">
              IVF pricing
            </Link>
            , or find your nearest Santaan centre. Jeypore is coming soon.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/contact-centres" className="rounded-full bg-white px-5 py-3 text-sm font-bold text-[#073f3c]">
              Find a Santaan centre
            </Link>
            <Link
              href="/ivf-clinic-bhubaneswar"
              className="rounded-full border border-white/40 px-5 py-3 text-sm font-bold text-white"
            >
              IVF centre in Bhubaneswar
            </Link>
          </div>
        </aside>

        <p className="mx-auto mt-6 max-w-5xl text-sm leading-6 text-slate-500">
          This guide is for education and does not replace individual medical advice. A fertility specialist
          should confirm decisions for your circumstances.
        </p>
      </div>
      <Footer />
    </main>
  );
}
