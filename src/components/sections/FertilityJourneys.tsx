import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const journeys = [
    {
        eyebrow: 'Planning ahead',
        title: 'Fertility preservation and egg freezing',
        description:
            'Understand ovarian reserve, timing, and whether egg freezing fits your family-planning goals before deciding on any treatment.',
        image: '/assets/hero-egg-freezing.png',
        imageAlt: 'Woman considering fertility preservation and egg freezing',
        href: '/female-fertility',
        linkLabel: 'Explore female fertility care',
    },
    {
        eyebrow: 'Irregular cycles',
        title: 'PCOS fertility treatment',
        description:
            'PCOS can affect ovulation, but it does not automatically mean IVF. A structured evaluation helps identify the right first step.',
        image: '/assets/hero-meera-final.jpg',
        imageAlt: 'Woman learning about PCOS fertility treatment',
        href: '/pcos-fertility-treatment',
        linkLabel: 'Understand PCOS care',
    },
    {
        eyebrow: 'Couple-first evaluation',
        title: 'Male infertility testing and treatment',
        description:
            'Assessing both partners early can reduce delays and clarify whether semen, hormonal, ovulation, or other factors need attention.',
        image: '/assets/hero-couple.png',
        imageAlt: 'Couple discussing male and female fertility evaluation',
        href: '/male-infertility-clinic',
        linkLabel: 'Explore male fertility care',
    },
    {
        eyebrow: 'Reviewing the next step',
        title: 'IVF guidance after an earlier attempt',
        description:
            'A careful review of prior reports, stimulation details, and embryology notes can help shape a clearer, individualised next-step plan.',
        image: '/assets/hero-arjun-shreya-final.png',
        imageAlt: 'Couple reviewing the next step in their IVF journey',
        href: '/treatments',
        linkLabel: 'Compare treatment pathways',
    },
];

export function FertilityJourneys() {
    return (
        <section id="fertility-journeys" className="relative overflow-hidden bg-santaan-cream py-20 md:py-24">
            <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-santaan-sage/10 blur-3xl" />
            <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-santaan-amber/10 blur-3xl" />

            <div className="container relative mx-auto px-4 md:px-6">
                <div className="mx-auto mb-12 max-w-3xl text-center">
                    <span className="text-sm font-semibold uppercase tracking-[0.2em] text-santaan-teal">
                        Care shaped around you
                    </span>
                    <h2 className="mt-3 font-playfair text-3xl font-bold text-gray-900 md:text-4xl">
                        Different journeys deserve different fertility care
                    </h2>
                    <p className="mt-4 leading-relaxed text-gray-600">
                        Fertility care is not one-size-fits-all. Some people are planning ahead, some need help understanding
                        PCOS or male infertility, and others are reviewing what to do after an earlier attempt. Santaan begins
                        with diagnosis, context, and a step-wise plan.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                    {journeys.map((journey) => (
                        <article
                            key={journey.title}
                            className="group overflow-hidden rounded-3xl border border-white/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                        >
                            <div className="relative aspect-[4/3] overflow-hidden bg-[#FDF6F0]">
                                <Image
                                    src={journey.image}
                                    alt={journey.imageAlt}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                                    className="object-cover object-top transition duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-santaan-dark-teal/55 via-transparent to-transparent" />
                                <span className="absolute bottom-4 left-4 rounded-full border border-white/30 bg-santaan-dark-teal/65 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm">
                                    {journey.eyebrow}
                                </span>
                            </div>

                            <div className="flex min-h-64 flex-col p-6">
                                <h3 className="font-playfair text-xl font-bold leading-snug text-gray-900">{journey.title}</h3>
                                <p className="mt-3 text-sm leading-relaxed text-gray-600">{journey.description}</p>
                                <Link
                                    href={journey.href}
                                    className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-santaan-teal transition-colors hover:text-santaan-amber"
                                >
                                    {journey.linkLabel}
                                    <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
