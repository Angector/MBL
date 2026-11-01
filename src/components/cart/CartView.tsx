'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { primaryImage } from '@/lib/catalog';
import { formatPrice } from '@/lib/format/price';
import type { Dictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/config';
import { buttonClasses, Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { CartLineItem } from './CartLineItem';
import { useCart } from './CartProvider';
import { useCartDetails } from './useCartDetails';

export function CartView({ locale, t }: { locale: Locale; t: Dictionary }) {
  const { hydrated, clear } = useCart();
  const { detailed, subtotal, currency, hasPriced, hasInquiry, mixedCurrency } = useCartDetails();
  if (!hydrated) return <div className="h-64" aria-busy="true" aria-label={t.common.loading} />;
  if (detailed.length === 0) return <EmptyState icon={ShoppingBag} title={t.cartPage.emptyTitle} text={t.cartPage.emptyText} action={<Link href={`/${locale}/shop`} className={buttonClasses('primary')}>{t.cartPage.continue}</Link>} />;

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_22rem]">
      <ul className="divide-y divide-line rounded-3xl border border-line bg-ivory px-6">
        {detailed.map((d) => <CartLineItem key={`${d.product.id}-${d.variant.id}`} d={d} locale={locale} t={t} image={primaryImage(d.product)} />)}
      </ul>
      <aside className="h-fit space-y-4 rounded-3xl border border-line bg-ivory p-6 lg:sticky lg:top-28" aria-label={t.cartPage.subtotal}>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between"><dt>{t.cartPage.subtotal}</dt><dd className="font-bold text-olive-deep">{hasPriced && currency && !mixedCurrency ? formatPrice(subtotal, currency, locale) : t.product.inquiry}</dd></div>
          <div className="flex justify-between gap-4"><dt>{t.cartPage.delivery}</dt><dd className="text-end text-xs text-ink/70">{t.cartPage.deliveryPlaceholder}</dd></div>
        </dl>
        {mixedCurrency && <p className="text-xs text-terracotta">{t.cartPage.mixedCurrency}</p>}
        {hasInquiry && <p className="text-xs text-ink/70">{t.cart.inquiryNote}</p>}
        <Link href={`/${locale}/checkout`} className={buttonClasses('primary', 'w-full')}>{t.cartPage.toCheckout}</Link>
        <Link href={`/${locale}/shop`} className={buttonClasses('outline', 'w-full')}>{t.cartPage.continue}</Link>
        <Button variant="outline" className="w-full !border-terracotta/40 !text-terracotta hover:!bg-terracotta hover:!text-ivory" onClick={clear}>{t.cartPage.clear}</Button>
      </aside>
    </div>
  );
}
