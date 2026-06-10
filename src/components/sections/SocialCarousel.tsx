'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Play, X } from 'lucide-react';

type Platform = 'youtube' | 'youtube-short' | 'instagram' | 'instagram-reel' | 'facebook';

export interface SocialItem {
  title: string;
  platform: Platform;
  url: string;
  previewUrl?: string;
  thumb?: string;
}

function ytIdFromUrl(url: string) {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) return u.pathname.replace('/', '');
    if (u.hostname.includes('youtube.com')) {
      const shortsMatch = u.pathname.match(/^\/shorts\/([^/?]+)/);
      if (shortsMatch?.[1]) return shortsMatch[1];
      return u.searchParams.get('v');
    }
    return null;
  } catch {
    return null;
  }
}

function buildThumb(item: SocialItem) {
  if (item.thumb) return item.thumb;
  const previewId = item.previewUrl ? ytIdFromUrl(item.previewUrl) : null;
  if (previewId) return `https://i.ytimg.com/vi/${previewId}/hqdefault.jpg`;

  if (item.platform === 'youtube' || item.platform === 'youtube-short') {
    const id = ytIdFromUrl(item.url);
    return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : undefined;
  }
  return undefined;
}

function getPlayableYoutubeId(item: SocialItem) {
  return ytIdFromUrl(item.previewUrl || item.url);
}

function buildYoutubeEmbedUrl(item: SocialItem) {
  const id = getPlayableYoutubeId(item);
  if (!id) return null;
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
}

function platformLabel(platform: Platform) {
  if (platform === 'youtube-short') return 'YouTube Short';
  if (platform === 'instagram-reel') return 'Instagram Reel';
  if (platform === 'youtube') return 'YouTube';
  if (platform === 'instagram') return 'Instagram';
  return 'Facebook';
}

export function SocialCarousel({
  items,
  heading = 'Campaign highlights',
  description = 'Short updates from Santaan IVF on awareness, outcomes, and evidence-led care.',
  sectionId = 'campaign-highlights',
}: {
  items: SocialItem[];
  heading?: string;
  description?: string;
  sectionId?: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeItem, setActiveItem] = useState<SocialItem | null>(null);
  const activeEmbedUrl = activeItem ? buildYoutubeEmbedUrl(activeItem) : null;

  const updateScrollProgress = () => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const maxScroll = scroller.scrollWidth - scroller.clientWidth;
    setScrollProgress(maxScroll > 0 ? scroller.scrollLeft / maxScroll : 0);
  };

  const scrollByCards = (direction: 'previous' | 'next') => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    scroller.scrollBy({
      left: direction === 'next' ? scroller.clientWidth * 0.8 : -scroller.clientWidth * 0.8,
      behavior: 'smooth',
    });
  };

  return (
    <section id={sectionId} className="py-16 bg-white">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h3 className="text-xl md:text-2xl font-playfair font-bold text-gray-900">{heading}</h3>
            <p className="text-gray-600 mt-2">{description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="https://www.youtube.com/@santaan7688/videos"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-santaan-teal/20 px-4 py-2 text-sm font-semibold text-santaan-teal hover:bg-santaan-teal/5"
            >
              View channel
            </Link>
            <button
              type="button"
              aria-label="Scroll campaign highlights left"
              onClick={() => scrollByCards('previous')}
              className="rounded-full border border-santaan-teal/20 p-2 text-santaan-teal hover:bg-santaan-teal/5"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Scroll campaign highlights right"
              onClick={() => scrollByCards('next')}
              className="rounded-full border border-santaan-teal/20 p-2 text-santaan-teal hover:bg-santaan-teal/5"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div
          ref={scrollerRef}
          onScroll={updateScrollProgress}
          className="overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="grid grid-flow-col auto-cols-[75%] sm:auto-cols-[45%] md:auto-cols-[30%] gap-4 snap-x snap-mandatory">
            {items.map((it, i) => {
              const thumb = buildThumb(it);
              const playable = Boolean(getPlayableYoutubeId(it));
              const cardContent = (
                <>
                  <div className="relative w-full aspect-video bg-gray-100">
                    {thumb ? (
                      <img src={thumb} alt="" className="w-full h-full object-cover" loading="lazy" decoding="async" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-santaan-sage/30 to-santaan-teal/20" />
                    )}
                    {playable ? (
                      <span className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 transition group-hover:opacity-100">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-santaan-teal shadow-lg">
                          <Play className="h-5 w-5 fill-current" />
                        </span>
                      </span>
                    ) : null}
                  </div>
                  <div className="p-4 text-left">
                    <p className="font-semibold text-gray-900 line-clamp-2">{it.title}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {platformLabel(it.platform)}
                      {playable ? ' · Preview' : ''}
                    </p>
                  </div>
                </>
              );

              const className =
                'group snap-start rounded-2xl border border-gray-100 overflow-hidden bg-white hover:border-santaan-teal/40 transition';

              if (playable) {
                return (
                  <button
                    key={`${it.platform}-${i}`}
                    type="button"
                    onClick={() => setActiveItem(it)}
                    className={className}
                    aria-label={`Play ${it.title}`}
                  >
                    {cardContent}
                  </button>
                );
              }

              return (
                <Link
                  key={`${it.platform}-${i}`}
                  href={it.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
                >
                  {cardContent}
                </Link>
              );
            })}
          </div>
        </div>
        <div className="mt-1 flex items-center gap-3" aria-hidden="true">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-santaan-sage/20">
            <div
              className="h-full rounded-full bg-santaan-teal transition-all duration-300"
              style={{ width: `${Math.max(18, Math.round(scrollProgress * 100))}%` }}
            />
          </div>
          <p className="hidden text-xs font-medium text-gray-500 sm:block">Scroll for more videos</p>
        </div>
      </div>
      {activeItem && activeEmbedUrl ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-santaan-teal/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`Playing ${activeItem.title}`}
          onClick={() => setActiveItem(null)}
        >
          <div
            className="w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-gray-900 line-clamp-1">{activeItem.title}</p>
                <p className="text-xs text-gray-500">{platformLabel(activeItem.platform)}</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveItem(null)}
                className="rounded-full border border-gray-200 p-2 text-gray-600 hover:bg-gray-50"
                aria-label="Close video preview"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className={activeItem.platform === 'youtube-short' ? 'mx-auto aspect-[9/16] max-h-[78vh] max-w-sm' : 'aspect-video'}>
              <iframe
                src={activeEmbedUrl}
                title={activeItem.title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <div className="flex items-center justify-between gap-3 px-5 py-4 text-sm">
              <p className="text-gray-500">Preview plays here so patients stay on Santaan.</p>
              <Link
                href={activeItem.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-semibold text-santaan-teal hover:text-santaan-dark-teal"
              >
                Open original
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
