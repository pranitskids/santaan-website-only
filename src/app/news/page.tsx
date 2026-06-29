import Link from 'next/link';
import { ArrowRight, Bell, CalendarDays } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getSantaanBlogPosts } from '@/lib/medium';
import { buildMetadata } from '@/lib/seo';

export const revalidate = 300;

export const metadata = buildMetadata({
  title: 'Santaan News and Announcements',
  description:
    'Latest Santaan IVF announcements, awards, campaigns, centre updates and public notices across Odisha and Bangalore.',
  path: '/news',
  keywords: ['Santaan news', 'Santaan announcements', 'Santaan IVF awards', 'Santaan IVF updates'],
});

export default async function NewsPage() {
  const posts = await getSantaanBlogPosts({ type: 'news', limit: 60 }).catch(() => []);

  return (
    <main className="min-h-screen bg-santaan-cream">
      <Header />
      <section className="pt-40 pb-16 bg-gradient-to-br from-santaan-teal via-santaan-teal/90 to-santaan-dark-teal text-white">
        <div className="container mx-auto px-4 md:px-6">
          <p className="uppercase tracking-[0.2em] text-santaan-amber text-xs font-semibold mb-4 inline-flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Santaan updates
          </p>
          <h1 className="text-4xl md:text-6xl font-playfair font-bold max-w-3xl leading-tight">
            News and announcements
          </h1>
          <p className="mt-6 max-w-2xl text-white/85 text-lg">
            Awards, centre updates, seminars, launch notes and public announcements from Santaan.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          {posts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
              <h2 className="text-2xl font-playfair font-bold text-santaan-teal">News updates are syncing</h2>
              <p className="text-gray-600 mt-3">Please check back in a few minutes for the latest Santaan announcements.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article
                  key={post.slug}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-shadow flex flex-col h-full"
                >
                  {post.thumbnail ? (
                    <div className="h-52 bg-white border-b border-gray-100 flex items-center justify-center">
                      <img src={post.thumbnail} alt={post.title} className="max-h-52 w-full object-contain" loading="lazy" decoding="async" />
                    </div>
                  ) : (
                    <div className="h-52 bg-gradient-to-r from-santaan-sage/30 to-santaan-teal/20" />
                  )}
                  <div className="p-6 flex flex-col grow">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                      <CalendarDays className="w-3.5 h-3.5" />
                      <span>{new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <h2 className="text-xl font-playfair font-bold text-gray-900 leading-tight mb-3">{post.title}</h2>
                    <p className="text-gray-600 text-sm leading-relaxed mb-5 [display:-webkit-box] [-webkit-line-clamp:3] [-webkit-box-orient:vertical] overflow-hidden">
                      {post.excerpt}
                    </p>
                    <Link
                      href={`/news/${post.slug}`}
                      className="mt-auto inline-flex items-center gap-2 text-santaan-teal font-semibold hover:text-santaan-amber transition-colors"
                    >
                      Read update
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
