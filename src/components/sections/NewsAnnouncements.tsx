"use client";

import { motion } from 'framer-motion';
import { Bell, Trophy, Calendar, Megaphone, ExternalLink, Loader2, Newspaper } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface SantaanPost {
    slug: string;
    title: string;
    publishedAt: string;
    excerpt: string;
    tags: string[];
}

const fallbackNewsPosts: SantaanPost[] = [
    {
        slug: 'break-the-silence-on-endometriosis-29th-march-2026-bigfm-92-7-tcmg9h',
        title: 'Break the Silence on Endometriosis 29th March, 2026 (BIGFM 92.7)',
        publishedAt: '2026-03-28T06:30:00.000Z',
        excerpt:
            'Dr Kaninika Panda will share doctor tips for managing endometriosis on BIG 92.7 FM, helping patients understand symptoms, fertility impact, and when to seek care.',
        tags: ['santaan-news', 'endometriosis', 'radio'],
    },
    {
        slug: 'break-the-silence-on-endometriosis-tune-in-today-tcld6s',
        title: 'Break the Silence on Endometriosis - Tune In Today!',
        publishedAt: '2026-03-28T05:30:00.000Z',
        excerpt:
            'A patient-awareness update from Santaan Bhubaneswar focused on endometriosis, fertility concerns, and practical doctor-led guidance.',
        tags: ['santaan-news', 'endometriosis'],
    },
    {
        slug: 'break-the-silence-on-endometriosis-tune-in-today',
        title: 'Break the Silence on Endometriosis - Tune In Today!',
        publishedAt: '2026-03-27T06:30:00.000Z',
        excerpt:
            'Dr Kaninika Panda shares important guidance on endometriosis and fertility so women can identify symptoms earlier and seek timely help.',
        tags: ['santaan-news', 'endometriosis'],
    },
    {
        slug: 'santaan-now-in-angul-sanker-cinema-road',
        title: 'Now in Angul: Santaan Fertility and Research Institute',
        publishedAt: '2026-02-25T06:30:00.000Z',
        excerpt:
            'Santaan Fertility and Research Institute is now available in Angul to support couples with evidence-driven fertility consultation closer to home.',
        tags: ['campaign', 'launch', 'angul'],
    },
];

// Map category keywords to icons and colors
const getCategoryStyle = (categories: string[]) => {
    const cats = categories.map(c => c.toLowerCase());
    
    if (cats.some(c => c.includes('award') || c.includes('recognition'))) {
        return { icon: Trophy, color: 'bg-amber-500/10 text-amber-600 border-amber-200', type: 'award' };
    }
    if (cats.some(c => c.includes('event') || c.includes('seminar') || c.includes('workshop'))) {
        return { icon: Calendar, color: 'bg-purple-500/10 text-purple-600 border-purple-200', type: 'event' };
    }
    if (cats.some(c => c.includes('campaign') || c.includes('offer') || c.includes('launch'))) {
        return { icon: Megaphone, color: 'bg-green-500/10 text-green-600 border-green-200', type: 'campaign' };
    }
    // Default: news
    return { icon: Newspaper, color: 'bg-blue-500/10 text-blue-600 border-blue-200', type: 'news' };
};

// Helper to format date
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
};

export function NewsAnnouncements() {
    const [posts, setPosts] = useState<SantaanPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch('/api/blogs?type=news&limit=4');
                const data = await response.json();

                if (response.ok && Array.isArray(data.posts)) {
                    setPosts(data.posts.length > 0 ? data.posts : fallbackNewsPosts);
                }
            } catch (error) {
                console.error('Failed to fetch Santaan news updates:', error);
                setPosts(fallbackNewsPosts);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNews();
    }, []);

    const displayPosts = !isLoading && posts.length === 0 ? fallbackNewsPosts : posts;

    return (
        <section className="py-14 bg-gradient-to-b from-santaan-cream to-white relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-santaan-teal/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-santaan-amber/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

            <div className="container px-4 md:px-6 mx-auto relative z-10">
                <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                    <span className="text-santaan-teal font-medium tracking-wide uppercase text-sm flex items-center gap-2">
                        <Bell className="w-4 h-4" />
                        What&apos;s New
                    </span>
                    <h2 className="text-3xl md:text-4xl font-playfair font-bold mt-2 text-gray-900">
                        News &amp; Announcements
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-600">
                        Seminars, awards, launches, and announcements stay visible here, while the deeper archive remains available for SEO.
                    </p>
                    </div>
                    <Link
                        href="/news"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-santaan-teal hover:text-santaan-amber transition-colors"
                    >
                        View all updates
                        <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-santaan-teal" />
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {displayPosts.map((post, i) => {
                            const { icon: IconComponent, color, type } = getCategoryStyle(post.tags);
                            
                            return (
                                <motion.div
                                    key={post.slug}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="group bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:border-santaan-teal/20 transition-all"
                                >
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border ${color}`}>
                                            <IconComponent className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${color}`}>
                                                {type}
                                            </span>
                                            <span className="text-xs text-gray-400 ml-2">
                                                {formatDate(post.publishedAt)}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-santaan-teal transition-colors">
                                        {post.title}
                                    </h3>
                                    
                                    <p className="text-gray-500 text-sm line-clamp-2 mb-3">
                                        {post.excerpt}
                                    </p>
                                    
                                    <Link href={`/news/${post.slug}`} className="inline-flex items-center gap-1 text-santaan-teal text-sm font-medium group-hover:gap-2 transition-all">
                                        Read update
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
