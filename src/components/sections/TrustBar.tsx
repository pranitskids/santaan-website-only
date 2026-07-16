import { Award, Clock3, HeartHandshake, MapPin } from 'lucide-react';

const highlights = [
    {
        value: '15,000+',
        label: 'families supported',
        detail: 'Based on Santaan internal records',
        icon: HeartHandshake,
    },
    {
        value: '3 Odisha centres',
        label: 'open for consultation',
        detail: 'Bhubaneswar · Angul · Berhampur',
        icon: MapPin,
    },
    {
        value: 'Jeypore',
        label: 'coming soon',
        detail: 'Opening details will follow verification',
        icon: Clock3,
    },
    {
        value: 'Award-recognised',
        label: 'fertility care',
        detail: 'National and Odisha recognition',
        icon: Award,
    },
];

export function TrustBar() {
    return (
        <section aria-label="Santaan at a glance" className="border-b border-santaan-sage/15 bg-white py-7">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-2 gap-x-5 gap-y-8 lg:grid-cols-4 lg:gap-0">
                    {highlights.map((highlight) => {
                        const Icon = highlight.icon;
                        return (
                            <div
                                key={highlight.value}
                                className="flex flex-col items-center px-2 text-center lg:border-r lg:border-santaan-sage/20 lg:last:border-r-0"
                            >
                                <Icon aria-hidden="true" className="mb-3 h-5 w-5 text-santaan-amber" />
                                <div className="font-playfair text-xl font-bold leading-tight text-santaan-teal md:text-2xl">
                                    {highlight.value}
                                </div>
                                <div className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-gray-600 md:text-sm">
                                    {highlight.label}
                                </div>
                                <p className="mt-2 hidden text-xs text-gray-500 sm:block">{highlight.detail}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
