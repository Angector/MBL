'use client';

import Link from 'next/link';
import { Info, ShoppingBag, TriangleAlert } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { siteConfig } from '@/data/site-config';
import { primaryImage } from '@/lib/catalog';
import { formatPrice } from '@/lib/format/price';
import { formatNumber } from '@/lib/format/number';
import { demoOrderService, type OrderResult } from '@/lib/services/orders';
import type { Dictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/config';
import { AssetImage } from '@/components/ui/AssetImage';
import { Button, buttonClasses } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Field } from '@/components/ui/Field';
import { useCart } from '@/components/cart/CartProvider';
import { useCartDetails } from '@/components/cart/useCartDetails';

type FormState = { fullName: string; email: string; phone: string; country: string; region: string; city: string; line: string; postalCode: string; notes: string };
const empty: FormState = { fullName: '', email: '', phone: '', country: siteConfig.market.country, region: '', city: '', line: '', postalCode: '', notes: '' };
const deliveryIds = ['standard', 'express', 'pickup'] as const;
const paymentIds = ['online', 'cod'] as const;

export function CheckoutView({ locale, t }: { locale: Locale; t: Dictionary }) {
  const { hydrated } = useCart();
  const { detailed, subtotal, currency, hasPriced, mixedCurrency, hasInquiry } = useCartDetails();
  const [form, setForm] = useState<FormState>(empty);
  const [delivery, setDelivery] = useState<(typeof deliveryIds)[number]>('standard');
  const [payment, setPayment] = useState<(typeof paymentIds)[number]>('online');
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [result, setResult] = useState<OrderResult | null>(null);

  const set = (k: keyof FormState) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function validate(): boolean {
    const e: Partial<Record<keyof FormState, string>> = {};
    (['fullName', 'email', 'phone', 'country', 'region', 'city', 'line', 'postalCode'] as const).forEach((k) => { if (!form[k].trim()) e[k] = t.common.required; });
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = t.checkout.invalidEmail;
    if (form.phone && !/^[+\d][\d\s-]{6,}$/.test(form.phone.replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))))) e.phone = t.checkout.invalidPhone;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    if (!validate()) { setStatus('idle'); return; }
    setStatus('loading');
    try {
      const res = await demoOrderService.submit({
        customer: { fullName: form.fullName, email: form.email, phone: form.phone },
        address: { country: form.country, region: form.region, city: form.city, line: form.line, postalCode: form.postalCode },
        deliveryMethod: delivery, paymentMethod: payment, notes: form.notes || undefined,
        lines: detailed.map((d) => ({ productId: d.product.id, variantId: d.variant.id, quantity: d.line.qty })),
      });
      setResult(res); setStatus('idle');
    } catch { setStatus('error'); }
  }

  if (!hydrated) return <div className="h-64" aria-busy="true" aria-label={t.common.loading} />;
  if (result) {
    return (
      <div className="mx-auto max-w-xl space-y-5 rounded-[2rem] border border-olive/30 bg-ivory p-8 text-center" role="status">
        <Info aria-hidden className="mx-auto h-10 w-10 text-olive" />
        <h2 className="text-2xl font-bold text-olive-deep">{t.checkout.successTitle}</h2>
        <p className="text-sm font-light text-ink/85">{t.checkout.successText}</p>
        <p className="text-xs text-ink/70">{t.checkout.reference}: <span dir="ltr">{result.reference}</span></p>
        <Link href={`/${locale}/shop`} className={buttonClasses('primary')}>{t.checkout.backToShop}</Link>
      </div>
    );
  }
  if (detailed.length === 0) return <EmptyState icon={ShoppingBag} title={t.checkout.emptyTitle} text={t.checkout.emptyText} action={<Link href={`/${locale}/shop`} className={buttonClasses('primary')}>{t.checkout.backToShop}</Link>} />;

  const radio = (name: string, id: string, checked: boolean, label: string, onChange: () => void) => (
    <label key={id} className={`flex cursor-pointer items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 text-sm ${checked ? 'border-olive bg-olive/5' : 'border-line bg-ivory'}`}>
      <span className="flex items-center gap-3"><input type="radio" name={name} checked={checked} onChange={onChange} className="h-4 w-4 accent-[rgb(var(--olive))]" />{label}</span>
      <span className="rounded-full bg-beige px-2 py-0.5 text-[10px] font-semibold text-olive-deep">{t.checkout.optionNote}</span>
    </label>
  );

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-10 lg:grid-cols-[1fr_22rem]">
      <div className="space-y-8">
        <p className="flex items-start gap-3 rounded-2xl border border-terracotta/30 bg-terracotta/5 p-4 text-sm"><Info aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-terracotta" />{t.checkout.demoNotice}</p>
        {Object.keys(errors).length > 0 && <p role="alert" className="flex items-center gap-2 text-sm font-semibold text-terracotta"><TriangleAlert className="h-4 w-4" aria-hidden />{t.checkout.fixErrors}</p>}

        <fieldset className="space-y-4"><legend className="mb-1 text-lg font-bold text-olive-deep">{t.checkout.customer}</legend>
          <Field label={t.checkout.fullName} value={form.fullName} onChange={set('fullName')} error={errors.fullName} autoComplete="name" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t.checkout.email} type="email" ltr value={form.email} onChange={set('email')} error={errors.email} autoComplete="email" inputMode="email" />
            <Field label={t.checkout.phone} type="tel" ltr value={form.phone} onChange={set('phone')} error={errors.phone} autoComplete="tel" inputMode="tel" />
          </div>
        </fieldset>

        <fieldset className="space-y-4"><legend className="mb-1 text-lg font-bold text-olive-deep">{t.checkout.address}</legend>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label={t.checkout.country} value={form.country} onChange={set('country')} error={errors.country} autoComplete="country" />
            <Field label={t.checkout.region} value={form.region} onChange={set('region')} error={errors.region} autoComplete="address-level1" />
            <Field label={t.checkout.city} value={form.city} onChange={set('city')} error={errors.city} autoComplete="address-level2" />
          </div>
          <Field label={t.checkout.line} value={form.line} onChange={set('line')} error={errors.line} autoComplete="street-address" />
          <div className="grid gap-4 sm:grid-cols-2"><Field label={t.checkout.postal} ltr value={form.postalCode} onChange={set('postalCode')} error={errors.postalCode} autoComplete="postal-code" /></div>
          <Field label={t.checkout.notes} value={form.notes} onChange={set('notes')} />
        </fieldset>

        <fieldset className="space-y-3"><legend className="mb-1 text-lg font-bold text-olive-deep">{t.checkout.delivery}</legend>
          {deliveryIds.map((id) => radio('delivery', id, delivery === id, t.checkout.deliveryOptions[id], () => setDelivery(id)))}
          <p className="text-xs text-ink/70">{t.checkout.deliveryNote}</p>
        </fieldset>

        <fieldset className="space-y-3"><legend className="mb-1 text-lg font-bold text-olive-deep">{t.checkout.payment}</legend>
          {paymentIds.map((id) => radio('payment', id, payment === id, t.checkout.paymentOptions[id], () => setPayment(id)))}
          <p className="text-xs text-ink/70">{t.checkout.paymentNote}</p>
        </fieldset>
      </div>

      <aside className="h-fit space-y-4 rounded-3xl border border-line bg-ivory p-6 lg:sticky lg:top-28" aria-label={t.checkout.summary}>
        <h2 className="text-lg font-bold text-olive-deep">{t.checkout.summary}</h2>
        <ul className="space-y-3">
          {detailed.map((d) => (
            <li key={`${d.product.id}-${d.variant.id}`} className="flex items-center gap-3 text-sm">
              <span className="relative h-14 w-12 shrink-0 overflow-hidden rounded-lg bg-cream"><AssetImage src={primaryImage(d.product)} alt={d.product.name} sizes="48px" fit="contain" /></span>
              <span className="flex-1">{d.product.name}<span className="block text-xs text-ink/70">× {formatNumber(d.line.qty, locale)}</span></span>
              <span className="text-xs font-semibold">{d.subtotal !== null && d.variant.price ? formatPrice(d.subtotal, d.variant.price.currency, locale) : t.product.inquiry}</span>
            </li>
          ))}
        </ul>
        <p className="flex justify-between border-t border-line pt-3 text-sm font-bold text-olive-deep"><span>{t.cartPage.subtotal}</span><span>{hasPriced && currency && !mixedCurrency ? formatPrice(subtotal, currency, locale) : t.product.inquiry}</span></p>
        {hasInquiry && <p className="text-xs text-ink/70">{t.cart.inquiryNote}</p>}
        {status === 'error' && <p role="alert" className="text-xs font-semibold text-terracotta">{t.checkout.failure}</p>}
        <Button type="submit" className="w-full" disabled={status === 'loading'}>{status === 'loading' ? t.checkout.submitting : t.checkout.submit}</Button>
      </aside>
    </form>
  );
}
