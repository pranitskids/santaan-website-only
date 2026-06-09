import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getSantaanBlogPosts } from '@/lib/medium';
import { isPatientAudiencePost } from '@/lib/patient-content';
import { buildMetadata } from '@/lib/seo';
import { tagToSlug } from '@/lib/tag-utils';
import { FertilityInsightsBrowser } from '@/components/sections/FertilityInsightsBrowser';

const PATIENT_BLOG_LIMIT = 72;

export const metadata = buildMetadata({
  title: 'Fertility Insights and Stories',
  description:
    'Read Santaan IVF fertility insights on PCOS, male infertility, thyroid, tubal factor and IVF planning across Bhubaneswar, Berhampur and Bangalore.',
  path: '/fertility-insights',
  keywords: [
    'fertility blog india',
    'ivf insights',
    'pcos fertility guide',
    'male infertility articles',
    'santaan blog',
  ],
});

export default async function FertilityInsightsPage() {
  const posts = await getSantaanBlogPosts({ type: 'blog', limit: 90 }).catch(() => []);
  const patientPosts = posts.filter(isPatientAudiencePost).slice(0, PATIENT_BLOG_LIMIT);
  const tagCounts = patientPosts.reduce<Record<string, number>>((acc, post) => {
    post.tags.forEach((tag) => {
      const slug = tagToSlug(tag);
      if (!slug) return;
      acc[slug] = (acc[slug] || 0) + 1;
    });
    return acc;
  }, {});
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([slug]) => slug);
  const insightCards = patientPosts.map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    publishedAt: post.publishedAt,
    readMinutes: post.readMinutes,
    thumbnail: post.thumbnail,
    tags: post.tags,
  }));

  return (
    <main className="min-h-screen bg-santaan-cream">
      <Header />
      <section className="pt-40 pb-24 bg-gradient-to-br from-santaan-teal via-santaan-teal/90 to-santaan-dark-teal text-white">
        <div className="container mx-auto px-4 md:px-6">
          <p className="uppercase tracking-[0.2em] text-santaan-amber text-xs font-semibold mb-4">Knowledge Library</p>
          <h1 className="text-4xl md:text-6xl font-playfair font-bold max-w-3xl leading-tight">
            Fertility Insights and Stories
          </h1>
          <p className="mt-6 max-w-2xl text-white/85 text-lg">
            Science-backed explainers and practical fertility guidance for couples and individuals planning parenthood.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="px-4 py-2 rounded-full bg-white/20 text-white text-sm font-semibold">For Patients</span>
            <Link
              href="/clinical-insights"
              className="px-4 py-2 rounded-full border border-white/35 text-white text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              For Doctors
            </Link>
          </div>
        </div>
      </section>

      <FertilityInsightsBrowser posts={insightCards} topTags={topTags} />

      <Footer />
    </main>
  );
}
