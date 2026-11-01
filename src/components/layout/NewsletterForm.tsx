'use client';

import { useState, type FormEvent } from 'react';
import type { Dictionary } from '@/lib/i18n';
import { Button } from '@/components/ui/Button';

type Status = 'idle' | 'loading' | 'success' | 'error';

export function NewsletterForm({ t, endpoint }: { t: Dictionary['footer']; endpoint?: string }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) { setStatus('error'); setMessage(t.invalidEmail); return; }
    if (!endpoint) { setStatus('error'); setMessage(t.notConnected); return; }
    setStatus('loading'); setMessage('');
    try {
      const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
      if (!res.ok) throw new Error(String(res.status));
      setStatus('success'); setMessage(t.success); setEmail('');
    } catch {
      setStatus('error'); setMessage(t.failure);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-2">
      <div className="flex items-center gap-2 rounded-full border border-line bg-ivory p-1.5">
        <label htmlFor="newsletter-email" className="sr-only">{t.email}</label>
        <input
          id="newsletter-email" type="email" inputMode="email" autoComplete="email" dir="ltr"
          value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t.email}
          aria-invalid={status === 'error'} aria-describedby="newsletter-msg"
          className="min-w-0 flex-1 bg-transparent px-4 text-sm outline-none placeholder:text-subtle"
        />
        <Button type="submit" variant="primary" className="px-5 py-2" disabled={status === 'loading'}>
          {status === 'loading' ? t.subscribing : t.subscribe}
        </Button>
      </div>
      <p id="newsletter-msg" role="status" className={`min-h-5 text-xs ${status === 'error' ? 'text-terracotta' : 'text-olive'}`}>{message}</p>
    </form>
  );
}
