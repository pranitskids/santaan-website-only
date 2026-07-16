'use client';

import { usePathname } from 'next/navigation';
import { Phone, CalendarCheck } from 'lucide-react';
import { CENTER_PROFILES, PRIMARY_CALL_HREF } from '@/data/centers';

export default function StickyContactBar() {
  const pathname = usePathname();
  const centre = CENTER_PROFILES.find((item) => item.href === pathname);
  const callHref = centre?.phones[0]
    ? `tel:${centre.phones[0].replace(/[^0-9+]/g, '')}`
    : PRIMARY_CALL_HREF;
  const bookingHref = centre ? '#book-consultation' : '/contact-centres';
  const centreName = centre?.city || 'Network';

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-auto max-w-sm">
      <div className="bg-white/95 backdrop-blur-md shadow-xl border border-santaan-sage/30 rounded-2xl p-2 flex items-center justify-between gap-2">
        <a
          href={bookingHref}
          data-cta-kind="book"
          data-center={centreName}
          data-cta-target={bookingHref}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-santaan-amber/30 px-3 py-2 text-xs md:text-sm font-semibold text-santaan-amber hover:bg-santaan-amber/10 transition-colors"
        >
          <CalendarCheck className="w-4 h-4" />
          {centre?.comingSoon ? 'Register' : 'Book Consultation'}
        </a>

        <a
          href={callHref}
          data-cta-kind="call"
          data-center={centreName}
          data-cta-target={callHref}
          className="inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs md:text-sm font-semibold text-santaan-teal hover:bg-santaan-teal/10 transition-colors"
        >
          <Phone className="w-4 h-4" />
          Call
        </a>
      </div>
    </div>
  );
}
