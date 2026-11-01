'use client';

import { Check, Copy, Minus, Plus, Share2, ShoppingBag } from 'lucide-react';
import { useMemo, useState } from 'react';
import { getAvailability } from '@/lib/catalog';
import type { Dictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/config';
import { formatNumber } from '@/lib/format/number';
import type { Product } from '@/types/product';
import { useCart } from '@/components/cart/CartProvider';
import { CompareButton } from '@/components/product/CompareButton';
import { ProductPrice } from '@/components/product/ProductPrice';
import { WishlistButton } from '@/components/product/WishlistButton';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/providers/ToastProvider';
import { cn } from '@/lib/utils/cn';

const availabilityKey = { available: 'in_stock', unavailable: 'out_of_stock', preorder: 'preorder', unknown: 'unknown' } as const;

export function ProductPurchase({ product, locale, t }: { product: Product; locale: Locale; t: Dictionary }) {
  const { add, lines } = useCart();
  const toast = useToast();
  const colors = useMemo(() => Array.from(new Set(product.variants.flatMap((v) => (v.color ? [v.color] : [])))), [product]);
  const storages = useMemo(() => Array.from(new Set(product.variants.flatMap((v) => (v.storage ? [v.storage] : [])))), [product]);
  const first = product.variants[0];
  const [color, setColor] = useState(first?.color);
  const [storage, setStorage] = useState(first?.storage);
  const [qty, setQty] = useState(1);

  const variant = product.variants.find((v) => v.color === color && v.storage === storage);
  const swatch = (c: string) => product.variants.find((v) => v.color === c)?.colorHex;
  const purchasable = !!variant && variant.availability !== 'unavailable';
  const inCart = !!variant && lines.some((l) => l.productId === product.id && l.variantId === variant.id);
  const availability = variant ? availabilityKey[variant.availability] : availabilityKey[getAvailability(product)];

  const addToCart = () => { if (!variant) return; add(product.id, variant.id, qty); toast(t.toast.addedCart); };
  const url = () => (typeof window === 'undefined' ? '' : window.location.href);
  const copy = async () => { try { await navigator.clipboard.writeText(url()); toast(t.toast.linkCopied); } catch { toast(t.toast.copyFailed, 'error'); } };
  const share = async () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) { try { await navigator.share({ title: product.name, url: url() }); return; } catch { /* cancelled */ } }
    await copy();
  };

  const wl = { add: t.pdp.wishlistAdd, remove: t.pdp.wishlistRemove, added: t.toast.addedWishlist, removed: t.toast.removedWishlist };
  const cmp = { add: t.pdp.compareAdd, remove: t.pdp.compareRemove, added: t.toast.addedCompare, removed: t.toast.removedCompare, full: t.toast.compareFull };
  const optionBtn = (active: boolean, disabled?: boolean) => cn('min-h-11 rounded-full border px-5 text-sm font-semibold transition-colors', active ? 'border-olive bg-olive text-ivory' : 'border-line bg-ivory hover:bg-beige', disabled && 'opacity-40');

  const buyBlock = (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1 rounded-full border border-line bg-ivory">
        <button type="button" aria-label={t.cart.decrease} onClick={() => setQty((q) => Math.max(1, q - 1))} className="rounded-full p-3 hover:bg-beige"><Minus className="h-4 w-4" /></button>
        <span className="min-w-6 text-center text-sm" aria-live="polite" aria-label={t.pdp.quantity}>{formatNumber(qty, locale)}</span>
        <button type="button" aria-label={t.cart.increase} onClick={() => setQty((q) => Math.min(10, q + 1))} className="rounded-full p-3 hover:bg-beige"><Plus className="h-4 w-4" /></button>
      </div>
      <Button className="flex-1" variant={inCart ? 'terracotta' : 'primary'} disabled={!purchasable} onClick={addToCart}>
        {inCart ? <Check className="h-4 w-4" aria-hidden /> : <ShoppingBag className="h-4 w-4" aria-hidden />}
        {purchasable ? t.pdp.addToCart : variant ? t.pdp.outOfStock : t.pdp.variantUnavailable}
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <ProductPrice price={variant?.price} locale={locale} inquiry={t.product.inquiry} size="lg" />
        <p className="text-sm text-ink/80">{t.product.availability[availability]}</p>
        {variant?.price && <p className="text-xs text-ink/70">{t.product.source}: {variant.price.source} · {t.product.updated}: {variant.price.updatedAt}</p>}
      </div>

      {colors.length > 0 && (
        <fieldset><legend className="mb-2 text-sm font-bold text-olive-deep">{t.pdp.color}: <span className="font-normal">{color}</span></legend>
          <div className="flex flex-wrap gap-2">{colors.map((c) => (
            <button key={c} type="button" aria-pressed={c === color} onClick={() => setColor(c)} className={cn(optionBtn(c === color), 'flex items-center gap-2')}>
              {swatch(c) && <span aria-hidden className="h-4 w-4 rounded-full border border-line" style={{ background: swatch(c) }} />}{c}
            </button>))}</div></fieldset>
      )}
      {storages.length > 0 && (
        <fieldset><legend className="mb-2 text-sm font-bold text-olive-deep">{t.pdp.storage}</legend>
          <div className="flex flex-wrap gap-2">{storages.map((s) => (
            <button key={s} type="button" aria-pressed={s === storage} onClick={() => setStorage(s)} className={optionBtn(s === storage)}>{s}</button>))}</div></fieldset>
      )}

      <div className="hidden lg:block">{buyBlock}</div>

      <div className="flex flex-wrap gap-2">
        <WishlistButton productId={product.id} labels={wl} withText />
        <CompareButton productId={product.id} labels={cmp} withText />
        <button type="button" onClick={share} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-ivory px-4 text-sm font-semibold hover:bg-beige"><Share2 className="h-4 w-4" aria-hidden />{t.pdp.share}</button>
        <button type="button" onClick={copy} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-ivory px-4 text-sm font-semibold hover:bg-beige"><Copy className="h-4 w-4" aria-hidden />{t.pdp.copyLink}</button>
      </div>

      <dl className="space-y-3 rounded-3xl border border-line bg-ivory p-5 text-sm">
        <div><dt className="font-bold text-olive-deep">{t.pdp.delivery}</dt><dd className="text-ink/80">{t.pdp.deliveryNote}</dd></div>
        <div><dt className="font-bold text-olive-deep">{t.pdp.warranty}</dt><dd className="text-ink/80">{t.pdp.warrantyNote}</dd></div>
      </dl>

      {/* sticky purchase bar on mobile, above the bottom navigation */}
      <div className="fixed inset-x-0 bottom-14 z-30 border-t border-line bg-ivory/95 p-3 backdrop-blur lg:hidden">
        <div className="mx-auto max-w-lg">{buyBlock}</div>
      </div>
    </div>
  );
}
