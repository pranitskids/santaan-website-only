import Script from 'next/script';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Doctors } from '@/components/sections/Doctors';
import { buildMetadata } from '@/lib/seo';
import { OdishaCentresLinks } from '@/components/sections/OdishaCentresLinks';
import { buildPhysicianSchemas } from '@/lib/schema';

export const metadata = buildMetadata({
  title: 'IVF Specialists and Fertility Doctors in Bhubaneswar',
  description:
    'Meet Santaan fertility doctors serving Bhubaneswar and Berhampur, with clinical leadership in IVF, IUI, PCOS and male-factor fertility evaluation.',
  path: '/our-doctors',
  keywords: ['ivf specialist', 'fertility doctor', 'santaan doctors'],
});

export default function OurDoctorsPage() {
  const physicianSchemas = buildPhysicianSchemas();

  return (
    <main className="min-h-screen bg-santaan-cream">
      <Script
        id="santaan-physician-schemas"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(physicianSchemas) }}
      />
      <Header />
      <section className="pt-14 md:pt-16">
        <Doctors headingAs="h1" eagerImages />
      </section>
      <OdishaCentresLinks />
      <Footer />
    </main>
  );
}
