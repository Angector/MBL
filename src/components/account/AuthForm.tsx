'use client';

import Link from 'next/link';
import { Eye, EyeOff, Info } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import type { Dictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/config';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';

type Mode = 'signin' | 'signup' | 'forgot';

/** DEMO form: validates, then shows a notice. Nothing is sent, stored or authenticated. */
export function AuthForm({ mode, locale, t }: { mode: Mode; locale: Locale; t: Dictionary }) {
  const [v, setV] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof v, string>>>({});
  const [done, setDone] = useState(false);
  const [show, setShow] = useState(false);
  const set = (k: keyof typeof v) => (e: { target: { value: string } }) => setV((s) => ({ ...s, [k]: e.target.value }));

  function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    const e: typeof errors = {};
    if (!/^\S+@\S+\.\S+$/.test(v.email)) e.email = t.checkout.invalidEmail;
    if (mode === 'signup' && !v.name.trim()) e.name = t.common.required;
    if (mode !== 'forgot') {
      if (v.password.length < 8) e.password = t.auth.passwordShort;
      if (mode === 'signup' && v.confirm !== v.password) e.confirm = t.auth.passwordMismatch;
    }
    setErrors(e);
    setDone(Object.keys(e).length === 0);
    if (Object.keys(e).length === 0) setV((s) => ({ ...s, password: '', confirm: '' }));
  }

  const pwType = show ? 'text' : 'password';
  const title = mode === 'signin' ? t.auth.signinTitle : mode === 'signup' ? t.auth.signupTitle : t.auth.forgotTitle;
  const cta = mode === 'signin' ? t.auth.signin : mode === 'signup' ? t.auth.signup : t.auth.sendLink;

  return (
    <div className="mx-auto max-w-md space-y-6 rounded-[2rem] border border-line bg-ivory p-7 shadow-soft">
      <h2 className="sr-only">{title}</h2>
      {done && (
        <div role="status" className="flex gap-3 rounded-2xl border border-olive/30 bg-olive/5 p-4 text-sm"><Info aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-olive" /><div><p className="font-bold text-olive-deep">{t.auth.demoTitle}</p><p className="text-ink/85">{t.auth.demoText}</p></div></div>
      )}
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        {mode === 'signup' && <Field label={t.auth.name} value={v.name} onChange={set('name')} error={errors.name} autoComplete="name" />}
        <Field label={t.auth.email} type="email" ltr value={v.email} onChange={set('email')} error={errors.email} autoComplete="email" />
        {mode !== 'forgot' && (
          <div className="relative">
            <Field label={t.auth.password} type={pwType} ltr value={v.password} onChange={set('password')} error={errors.password} autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} />
            <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? t.auth.hide : t.auth.show} className="absolute end-3 top-[2.35rem] rounded-full p-1.5 text-olive-muted hover:bg-beige">{show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
          </div>
        )}
        {mode === 'signup' && <Field label={t.auth.confirm} type={pwType} ltr value={v.confirm} onChange={set('confirm')} error={errors.confirm} autoComplete="new-password" />}
        <Button type="submit" className="w-full">{cta}</Button>
      </form>
      <p className="text-center text-xs text-ink/70">{t.common.demoBanner}</p>
      <div className="space-y-1.5 text-center text-sm">
        {mode === 'signin' && <><p>{t.auth.noAccount} <Link href={`/${locale}/signup`} className="font-semibold text-olive underline">{t.auth.signup}</Link></p><p><Link href={`/${locale}/forgot-password`} className="text-olive underline">{t.auth.forgotLink}</Link></p></>}
        {mode !== 'signin' && <p>{t.auth.haveAccount} <Link href={`/${locale}/signin`} className="font-semibold text-olive underline">{t.auth.signin}</Link></p>}
      </div>
    </div>
  );
}
