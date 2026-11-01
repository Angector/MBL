'use client';

import { Minus, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { formatPrice } from '@/lib/format/price';
import { formatNumber } from '@/lib/format/number';
import type { Dictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/config';
import { AssetImage } from '@/components/ui/AssetImage';
import { useToast } from '@/components/providers/ToastProvider';
import { useCart } from './CartProvider';
import type { DetailedLine } from './useCartDetails';

export function CartLineItem({ d, locale, t, image, compact }: { d: DetailedLine; locale: Locale; t: Dictionary; image: string; compact?: boolean }) {
  const { setQty, remove } = useCart();
  const toast = useToast();
  const { product, variant, line } = d;
  const price = variant.price;
  return (
    <li className="flex gap-4 py-5">
      <Link href={`/${locale}/product/${product.slug}`} className={`relative shrink-0 overflow-hidden rounded-xl bg-cream ${compact ? 'h-24 w-20' : 'h-32 w-28'}`}>
        <AssetImage src={image} alt={product.name} sizes="112px" fit="contain" />
      </Link>
      <div className="flex flex-1 flex-col gap-1.5">
        <Link href={`/${locale}/product/${product.slug}`} className="text-sm font-semibold text-olive-deep hover:underline">{product.name}</Link>
        {(variant.color || variant.storage) && (
          <p className="text-xs text-ink/70">
            {variant.color && `${t.cartPage.color}: ${variant.color}`}{variant.color && variant.storage ? ' · ' : ''}{variant.storage && `${t.cartPage.storage}: ${variant.storage}`}
          </p>
        )}
        <p className="text-sm text-ink/80">{price ? formatPrice(price.amount, price.currency, locale) : t.product.inquiry}</p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1 rounded-full border border-line">
            <button aria-label={t.cart.decrease} onClick={() => setQty(product.id, variant.id, line.qty - 1)} className="rounded-full p-2 hover:bg-beige"><Minus className="h-4 w-4" /></button>
            <span className="min-w-6 text-center text-sm" aria-live="polite">{formatNumber(line.qty, locale)}</span>
            <button aria-label={t.cart.increase} onClick={() => setQty(product.id, variant.id, line.qty + 1)} className="rounded-full p-2 hover:bg-beige"><Plus className="h-4 w-4" /></button>
          </div>
          {d.subtotal !== null && price && !compact && <span className="text-sm font-bold text-olive-deep">{t.cartPage.lineTotal}: {formatPrice(d.subtotal, price.currency, locale)}</span>}
          <button onClick={() => { remove(product.id, variant.id); toast(t.toast.removedCart, 'info'); }} className="flex items-center gap-1 text-xs text-terracotta hover:underline">
            <Trash2 className="h-4 w-4" aria-hidden /> {t.cart.remove}
          </button>
        </div>
      </div>
    </li>
  );
}
