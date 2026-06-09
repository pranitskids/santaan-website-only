"use client";

import { motion } from 'framer-motion';
import { ArrowUpRight, BookOpen, Calendar, Stethoscope } from 'lucide-react';
import Link from 'next/link';

interface SantaanPost {
    slug?: string;
    href?: string;
    title: string;
    publishedAt?: string;
    eyebrow?: string;
    thumbnail?: string;
    excerpt: string;
}

interface InsightsProps {
    posts?: SantaanPost[];
}

const fallbackGuides: SantaanPost[] = [
    {
        href: '/know-your-score',
        title: 'Check Your Fertility Readiness',
        eyebrow: 'Interactive readiness check',
        excerpt: 'A low-pressure WhatsApp-friendly CTA for warm leads who want to understand where they stand before booking.',
    },
    {
        href: '/fertility-conditions',
        title: 'Understand common fertility conditions',
        eyebrow: 'PCOS, thyroid, male factor and more',
        excerpt: 'Help patients connect symptoms and reports with the right next step without overwhelming them.',
    },
    {
        href: '/fertility-guides',
        title: 'Browse Santaan fertility guides',
        eyebrow: 'Patient education archive',
        excerpt: 'Evergreen explainers remain available for SEO and education while the homepage stays focused.',
    },
];

export function Insights({ posts = [] }: InsightsProps) {
    // Helper to format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };



    const displayPosts = posts.length > 0 ? posts : fallbackGuides;

    return (
        <section id="insights" className="py-20 bg-santaan-cream relative overflow-hidden">
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-gradient-to-br from-santaan-teal via-santaan-amber to-santaan-cream" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <span className="text-santaan-amber font-medium uppercase tracking-wider text-sm mb-2 flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            Patient guides
                        </span>
                        <h2 className="text-3xl md:text-5xl font-playfair font-bold text-santaan-teal">
                            Insights &amp; Stories
                        </h2>
                        <p className="text-gray-600 mt-3 max-w-xl text-sm md:text-base">
                            Practical fertility explainers, patient questions, and Santaan stories for couples who want clarity before they take the next step.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/clinical-insights"
                            aria-label="Browse doctor insights"
                            className="text-santaan-teal font-semibold hover:text-santaan-amber transition-colors"
                        >
                            <span className="inline-flex items-center gap-2">
                                <Stethoscope className="h-4 w-4" />
                                Doctor insights
                            </span>
                        </Link>
                        <Link
                            href="/fertility-guides"
                            className="group flex items-center gap-2 text-santaan-teal font-medium hover:text-santaan-amber transition-colors"
                        >
                            See all guides
                            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {displayPosts.map((post, index) => (
                        <motion.div
                            key={post.slug || post.href}
                            className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-gray-100"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            {/* Content */}
                            <div className="p-5 flex flex-col grow">
                                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                                    <Calendar className="w-3 h-3" />
                                    {post.publishedAt ? formatDate(post.publishedAt) : post.eyebrow}
                                </div>

                                <h3 className="text-lg md:text-xl font-playfair font-bold text-gray-900 mb-3 group-hover:text-santaan-amber transition-colors line-clamp-2 min-h-[3.4rem]">
                                    {post.title}
                                </h3>
                                
                                {/* Thumbnail Image */}
                                {post.thumbnail && (
                                    <div className="relative h-40 w-full overflow-hidden rounded-lg mb-3">
                                        <img
                                            src={post.thumbnail}
                                            alt={post.title}
                                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    </div>
                                )}

                                <div className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4 grow min-h-[4.2rem]">
                                    <p className="line-clamp-3">{post.excerpt}</p>
                                </div>

                                <Link href={post.href || `/fertility-insights/${post.slug}`} className="mt-auto flex items-center text-santaan-amber text-sm font-bold uppercase tracking-wide group-hover:gap-2 transition-all">
                                    Read this guide
                                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
