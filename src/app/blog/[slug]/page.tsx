import { redirect } from 'next/navigation';
import { getSantaanBlogPostBySlug } from '@/lib/medium';

type Params = Promise<{ slug: string }>;

export const dynamicParams = true;
export const revalidate = 300;

export default async function LegacyBlogDetailRedirect({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await getSantaanBlogPostBySlug(slug);

  if (!post) {
    redirect('/fertility-insights');
  }

  if (post.type === 'doctor') {
    redirect(`/clinical-insights/${slug}`);
  }

  if (post.type === 'news') {
    redirect(`/news/${slug}`);
  }

  redirect(`/fertility-insights/${slug}`);
}
