import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Doctors } from '@/components/sections/Doctors';
import { buildMetadata } from '@/lib/seo';
import { OdishaCentresLinks } from '@/components/sections/OdishaCentresLinks';

export const metadata = buildMetadata({
  title: 'Our Fertility Doctors',
  description:
    'Meet Santaan IVF fertility specialists and centre heads serving Odisha. Explore doctor expertise in IVF, IUI, PCOS and male fertility care.',
  path: '/our-doctors',
  keywords: ['ivf specialist', 'fertility doctor', 'santaan doctors'],
});

export default function OurDoctorsPage() {
  return (
    <main className="min-h-screen bg-santaan-cream">
      <Header />
      <section className="pt-14 md:pt-16">
        <Doctors headingAs="h1" />
      </section>
      <OdishaCentresLinks />
      <Footer />
    </main>
  );
}
