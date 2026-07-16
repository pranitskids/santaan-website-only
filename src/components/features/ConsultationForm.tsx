'use client';

import { useRef, useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { trackConfirmedLead } from '@/lib/analytics';
import {
  createWebsiteSubmissionId,
  readMarketingAttribution,
} from '@/lib/marketing-attribution';
import { ensureMandatoryUtm, readUtmParams } from '@/lib/utm';

interface ConsultationFormProps {
  centre: string;
  comingSoon?: boolean;
}

export function ConsultationForm({ centre, comingSoon = false }: ConsultationFormProps) {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', concern: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const submissionIdRef = useRef<string | null>(null);
  const fieldPrefix = centre.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');
    setMessage('');

    const submissionId = submissionIdRef.current || createWebsiteSubmissionId();
    submissionIdRef.current = submissionId;
    const utm = ensureMandatoryUtm({ ...readUtmParams(), center: centre.toLowerCase() });
    const attribution = readMarketingAttribution();

    try {
      const response = await fetch('/api/consultation/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          centre,
          submissionId,
          utm,
          attribution,
          landingPath: `${window.location.pathname}${window.location.search}`,
          referrer: document.referrer,
          occurredAt: new Date().toISOString(),
        }),
      });
      const data = await response.json();

      if (!response.ok || !data?.leadId) {
        throw new Error(data?.error || 'We could not save your request. Please try again.');
      }

      trackConfirmedLead({
        leadId: data.leadId,
        centre,
        formName: comingSoon ? 'jeypore_interest_form' : 'consultation_form',
        appointmentType: comingSoon ? 'opening_update' : 'private_consultation',
        utm,
        attribution,
      });

      setStatus('success');
      setMessage(
        comingSoon
          ? 'Your interest is registered. The Odisha team will share verified Jeypore opening information when available.'
          : 'Your request is confirmed. The centre team will contact you privately to schedule the next step.',
      );
      submissionIdRef.current = null;
      setFormData({ name: '', phone: '', email: '', concern: '' });
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'We could not save your request. Please try again.');
    }
  };

  return (
    <section id="book-consultation" className="scroll-mt-28 pb-16" data-centre={centre}>
      <div className="container mx-auto max-w-5xl px-4 md:px-6">
        <div className="grid gap-8 rounded-2xl bg-santaan-teal p-6 text-white shadow-sm md:p-9 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-santaan-amber">
              {comingSoon ? 'Coming soon' : 'Private appointment request'}
            </p>
            <h2 className="mt-3 font-playfair text-3xl font-bold">
              {comingSoon ? 'Register for Jeypore updates' : `Book a private consultation in ${centre}`}
            </h2>
            <p className="mt-4 leading-relaxed text-white/80">
              {comingSoon
                ? 'We will record Jeypore as your preferred centre and contact you only when verified opening or consultation information is available.'
                : 'Share your details and the centre team will confirm availability, the consulting clinician and any reports to bring.'}
            </p>
          </div>

          {status === 'success' ? (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl bg-white p-8 text-center text-gray-900">
              <CheckCircle2 className="h-12 w-12 text-emerald-600" />
              <h3 className="mt-4 font-playfair text-2xl font-bold text-santaan-teal">Request received</h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-gray-600">{message}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-4 rounded-2xl bg-white p-5 text-gray-900 md:grid-cols-2 md:p-6" data-testid="consultation-form">
              <div className="grid gap-2">
                <Label htmlFor={`${fieldPrefix}-name`}>Name</Label>
                <Input
                  id={`${fieldPrefix}-name`}
                  required
                  autoComplete="name"
                  value={formData.name}
                  onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`${fieldPrefix}-phone`}>Phone number</Label>
                <Input
                  id={`${fieldPrefix}-phone`}
                  required
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`${fieldPrefix}-email`}>Email (optional)</Label>
                <Input
                  id={`${fieldPrefix}-email`}
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`${fieldPrefix}-concern`}>What would you like to discuss? (optional)</Label>
                <Input
                  id={`${fieldPrefix}-concern`}
                  value={formData.concern}
                  onChange={(event) => setFormData({ ...formData, concern: event.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                {message ? (
                  <p className={`mb-3 text-sm ${status === 'error' ? 'text-rose-700' : 'text-gray-600'}`} role="status">
                    {message}
                  </p>
                ) : null}
                <Button type="submit" fullWidth disabled={status === 'loading'} className="justify-center">
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving request...
                    </>
                  ) : comingSoon ? (
                    'Register my interest'
                  ) : (
                    'Request private consultation'
                  )}
                </Button>
                <p className="mt-3 text-center text-xs text-gray-500">
                  Your request is sent only after successful confirmation. Medical outcomes are never guaranteed.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
