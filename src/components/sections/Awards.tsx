import { Award, ExternalLink, Trophy } from 'lucide-react';

const awards = [
    {
        title: 'No. 1 IVF Centre in Odisha',
        org: 'Times Health Icons Odisha 2026',
        desc: 'Recognised for the 10th consecutive year, according to Santaan’s official 2026 announcement.',
        sourceHref: 'https://www.linkedin.com/school/santaan-fertility-center-and-research-institute/',
        sourceLabel: 'View Santaan announcement',
        icon: Trophy,
    },
    {
        title: 'Fertility Tech Solution of the Year — National',
        org: 'ETHealthworld National Fertility Awards 2024',
        desc: 'Awarded to Santaan Fertility Centre and Research Institute for its Fertilife fertility-care solution.',
        sourceHref: 'https://health.economictimes.indiatimes.com/national-fertility-awards2024/winners-list',
        sourceLabel: 'View official winners list',
        icon: Award,
    },
];

export function Awards() {
    return (
        <section id="awards" className="relative overflow-hidden bg-santaan-dark-teal py-20 text-white md:py-24">
            <div className="absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full bg-santaan-sage/10 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 h-[480px] w-[480px] rounded-full bg-santaan-amber/10 blur-3xl" />

            <div className="container relative z-10 mx-auto px-4 md:px-6">
                <div className="mx-auto mb-12 max-w-3xl text-center">
                    <span className="text-sm font-semibold uppercase tracking-[0.2em] text-santaan-amber">Verified recognition</span>
                    <h2 className="mt-3 font-playfair text-3xl font-bold md:text-4xl">
                        Recognised for fertility care and innovation
                    </h2>
                    <p className="mt-4 leading-relaxed text-white/75">
                        Santaan&apos;s verified recognitions include the Times Health Icons Odisha 2026 honour and the national
                        Fertility Tech Solution of the Year award at the ETHealthworld National Fertility Awards 2024.
                    </p>
                </div>

                <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
                    {awards.map((award) => {
                        const Icon = award.icon;
                        return (
                            <article
                                key={award.title}
                                className="group rounded-3xl border border-white/10 bg-white/5 p-7 shadow-2xl backdrop-blur-sm transition hover:-translate-y-1 hover:border-santaan-amber/35 hover:bg-white/10 md:p-9"
                            >
                                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-santaan-amber/15 text-santaan-amber transition-transform duration-300 group-hover:scale-105">
                                    <Icon aria-hidden="true" className="h-7 w-7" />
                                </div>
                                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-santaan-amber">{award.org}</p>
                                <h3 className="mt-3 font-playfair text-2xl font-bold leading-tight">{award.title}</h3>
                                <p className="mt-4 leading-relaxed text-white/70">{award.desc}</p>
                                <a
                                    href={award.sourceHref}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-santaan-amber"
                                >
                                    {award.sourceLabel}
                                    <ExternalLink aria-hidden="true" className="h-4 w-4" />
                                </a>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
