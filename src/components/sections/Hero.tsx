import { ArrowRight, MessageCircle, PhoneCall } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/Button';
import { PRIMARY_CALL_HREF, PRIMARY_CALL_NUMBER, PRIMARY_WHATSAPP_BOOKING_URL } from '@/data/centers';
import { cn } from '@/lib/utils';

export function Hero() {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-24 md:pt-28 bg-gradient-to-br from-santaan-cream via-[#E6F0E6] to-[#FDF6F0]">
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-r from-santaan-teal/90 via-santaan-teal/60 to-transparent mix-blend-multiply z-10" />
                <div className="absolute inset-0">
                    <Image
                        src="/assets/hero-family.png"
                        alt="Happy family celebrating parenthood"
                        fill
                        sizes="100vw"
                        className="object-cover"
                        priority
                        quality={70}
                    />
                </div>
            </div>

            <div className="container relative z-10 px-4 md:px-6 text-center max-w-4xl mx-auto">
                <div className="mx-auto mb-8 max-w-3xl rounded-3xl border border-white/20 bg-white/10 px-6 py-5 text-white shadow-2xl backdrop-blur-md">
                    <p className="font-playfair text-lg md:text-xl">संतानः वंशस्य सातत्यम्, जीवनस्य समृद्धिः, प्रीतेः स्वरूपम्।</p>
                    <p className="mt-2 text-sm text-white/70">Santānaḥ vaṃśasya sātatyam, jīvanasya samṛddhiḥ, prīteḥ svarūpam.</p>
                    <p className="mt-2 text-sm md:text-base text-white/90">
                        &quot;Santaan is the continuity of lineage, the prosperity of life, and the embodiment of love.&quot;
                    </p>
                </div>

                <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-sm font-medium tracking-wide border border-white/20 shadow-sm">
                    Evidence-backed, research-led care
                </span>

                <h1 className="text-3xl md:text-5xl font-playfair font-bold text-white mb-5 leading-tight drop-shadow-md">
                    Evidence-Driven IVF &amp; Fertility Care in Bhubaneswar, Berhampur and Angul
                </h1>

                <h2 className="mb-6 font-playfair text-2xl md:text-4xl font-bold text-white drop-shadow-md">
                    Where Science Meets <span className="text-santaan-amber">Hope</span>
                </h2>

                <p className="text-lg md:text-xl text-white/90 mb-4 max-w-3xl mx-auto leading-relaxed drop-shadow-sm font-medium">
                    Advanced diagnostics, compassionate specialists, and personalized treatment pathways for your fertility journey.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-2 mb-8 md:mb-10">
                    <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-xs md:text-sm font-medium tracking-wide border border-white/20">
                        Odisha&apos;s only IVF chain*
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-xs md:text-sm font-medium tracking-wide border border-white/20">
                        15K+ families supported*
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-xs md:text-sm font-medium tracking-wide border border-white/20">
                        15+ national awards
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-xs md:text-sm font-medium tracking-wide border border-white/20">
                        4.8 / 5 rating from 479 Berhampur reviews*
                    </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 md:mb-16">
                    <a
                        href={PRIMARY_WHATSAPP_BOOKING_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cta-kind="whatsapp"
                        data-center="Network"
                        data-cta-target={PRIMARY_WHATSAPP_BOOKING_URL}
                        className={cn(
                            buttonVariants({
                                size: 'lg',
                                className:
                                    'group w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 border-none shadow-lg hover:shadow-xl transition-all',
                            })
                        )}
                    >
                        <MessageCircle className="w-5 h-5 mr-2" />
                        Book on WhatsApp
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </a>

                    <Link
                        href="/fertility-insights"
                        className={cn(
                            buttonVariants({
                                variant: 'outline',
                                size: 'lg',
                                className: 'w-full sm:w-auto border-white/40 text-white hover:bg-white/10 backdrop-blur-sm',
                            })
                        )}
                    >
                        Read Today&apos;s Insight
                    </Link>

                    <a
                        href={PRIMARY_CALL_HREF}
                        data-cta-kind="call"
                        data-center="Network"
                        data-cta-target={PRIMARY_CALL_HREF}
                        className={cn(
                            buttonVariants({
                                variant: 'outline',
                                size: 'lg',
                                className: 'w-full sm:w-auto border-white/40 text-white hover:bg-white/10 backdrop-blur-sm',
                            })
                        )}
                    >
                        <PhoneCall className="w-5 h-5 mr-2" />
                        Call {PRIMARY_CALL_NUMBER}
                    </a>
                </div>

                <p className="mb-8 text-sm md:text-base text-white/80 max-w-2xl mx-auto">
                    Prefer a calendar view?{' '}
                    <a href="#book-consultation" className="font-semibold text-white underline underline-offset-4 hover:text-santaan-amber transition-colors">
                        Open booking options
                    </a>
                    .
                </p>

                <p className="mb-8 text-sm md:text-base text-white/80 max-w-2xl mx-auto">
                    Prefer to explore first?{' '}
                    <a href="#santaan-signal" className="font-semibold text-white underline underline-offset-4 hover:text-santaan-amber transition-colors">
                        Know your fertility score
                    </a>
                    .
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto">
                    <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 px-4 py-4 md:px-5 md:py-5 text-left">
                        <p className="text-2xl md:text-3xl font-playfair font-bold text-white leading-none">15K+</p>
                        <p className="mt-2 text-xs md:text-sm text-white/85 font-medium">Families supported*</p>
                    </div>
                    <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 px-4 py-4 md:px-5 md:py-5 text-left">
                        <p className="text-2xl md:text-3xl font-playfair font-bold text-white leading-none">15+</p>
                        <p className="mt-2 text-xs md:text-sm text-white/85 font-medium">National awards</p>
                    </div>
                    <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 px-4 py-4 md:px-5 md:py-5 text-left">
                        <p className="text-2xl md:text-3xl font-playfair font-bold text-white leading-none">4.8 / 5</p>
                        <p className="mt-2 text-xs md:text-sm text-white/85 font-medium">479 Berhampur reviews*</p>
                    </div>
                    <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 px-4 py-4 md:px-5 md:py-5 text-left">
                        <p className="text-2xl md:text-3xl font-playfair font-bold text-white leading-none">Odisha</p>
                        <p className="mt-2 text-xs md:text-sm text-white/85 font-medium">Only IVF chain*</p>
                    </div>
                </div>
                <p className="mt-4 text-[11px] md:text-xs text-white/70 max-w-4xl mx-auto">
                    *Figures are based on internal records and public review snapshots available with the Santaan team as of Apr 2026.
                    Family count is 15K+ and counting. “Only IVF chain” claim is based on publicly available information for Odisha.
                    Medical outcomes vary by age, diagnosis, and clinical factors.
                </p>
            </div>
        </section>
    );
}
