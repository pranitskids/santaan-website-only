'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BookOpen, MessageCircle } from 'lucide-react';
import { buildPrimaryWhatsappUrl, CENTER_PROFILES, PRIMARY_WHATSAPP_CONCIERGE_URL } from '@/data/centers';

export default function StickyContactBar() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const centre = CENTER_PROFILES.find((item) => item.href === pathname);
  const centreName = centre?.city || 'Network';
  const whatsappHref = centre
    ? buildPrimaryWhatsappUrl(
        `Hi Santaan, I'd like private guidance about the ${centre.city} centre. Please reply on WhatsApp; do not call unless I ask.`,
      )
    : PRIMARY_WHATSAPP_CONCIERGE_URL;

  useEffect(() => {
    const updateVisibility = () => {
      setIsVisible(window.scrollY > Math.min(480, window.innerHeight * 0.55));
    };

    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    return () => window.removeEventListener('scroll', updateVisibility);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-auto max-w-sm">
      <nav
        aria-label="Quick contact options"
        className="bg-white/95 backdrop-blur-md shadow-xl border border-santaan-sage/30 rounded-2xl p-2 flex items-center justify-between gap-2"
      >
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          data-cta-kind="whatsapp"
          data-center={centreName}
          data-cta-target={whatsappHref}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-xs md:text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          Private WhatsApp
        </a>

        <Link
          href="/fertility-map"
          data-cta-kind="guide"
          data-center={centreName}
          data-cta-target="/fertility-map"
          className="inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs md:text-sm font-semibold text-santaan-teal hover:bg-santaan-teal/10 transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          IVF guide
        </Link>
      </nav>
    </div>
  );
}
