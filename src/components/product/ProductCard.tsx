'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { brands } from '@/data/brands';
import { getAvailability, primaryImage, startingPrice } from '@/lib/catalog';
import type { Dictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/config';
import type { Product } from '@/types/product';
import { AssetImage } from '@/components/ui/AssetImage';
import { buttonClasses } from '@/components/ui/Button';
import { useCart } from '@/components/cart/CartProvider';
import { useToast } from '@/components/providers/ToastProvider';
import { CompareButton } from './CompareButton';
import { ProductPrice } from './ProductPrice';
import { WishlistButton } from './WishlistButton';

const availabilityKey = { available: 'in_stock', unavailable: 'out_of_stock', preorder: 'preorder', unknown: 'unknown' } as const;

export function ProductCard({ product, locale, t }: { product: Product; locale: Locale; t: Dictionary }) {
  const { add } = useCart();
  const toast = useToast();
  const href = `/${locale}/product/${product.slug}`;
  const availability = getAvailability(product);
  const onlyVariant = product.variants.length === 1 ? product.variants[0] : undefined;
  const quickAdd = onlyVariant && onlyVariant.availability !== 'unavailable';
  const wl = { add: t.pdp.wishlistAdd, remove: t.pdp.wishlistRemove, added: t.toast.addedWishlist, removed: t.toast.removedWishlist };
  const cmp = { add: t.pdp.compareAdd, remove: t.pdp.compareRemove, added: t.toast.addedCompare, removed: t.toast.removedCompare, full: t.toast.compareFull };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-ivory shadow-soft transition-shadow duration-500 hover:shadow-[0_24px_44px_-22px_rgb(52_61_44/0.35)]">
      <div className="relative">
        <Link href={href} className="relative block aspect-[4/5] bg-gradient-to-b from-cream to-beige/60" aria-label={`${product.name} - ${t.product.details}`}>
          <div className="absolute inset-6">
            <div className="relative h-full w-full transition-transform duration-700 ease-soft group-hover:scale-105">
              <AssetImage src={primaryImage(product)} alt={product.name} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 90vw" fit="contain" />
            </div>
          </div>
        </Link>
        <div className="absolute end-3 top-3 flex flex-col gap-2">
          <WishlistButton productId={product.id} labels={wl} className="h-11 w-11 px-0" />
          <CompareButton productId={product.id} labels={cmp} className="h-11 w-11 px-0" />
        </div>
        {product.isNew && <span className="absolute start-3 top-3 rounded-full bg-terracotta px-3 py-1 text-xs font-semibold text-ivory">{t.nav.newArrivals}</span>}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <p className="text-xs font-semibold tracking-wider text-olive-muted uppercase">{brands[product.brand].name}</p>
          <h3 className="mt-1 text-lg font-bold text-olive-deep"><Link href={href}>{product.name}</Link></h3>
        </div>
        <ProductPrice price={startingPrice(product)} locale={locale} inquiry={t.product.inquiry} />
        <p className="text-xs text-ink/70">{t.product.availability[availabilityKey[availability]]}</p>
        <div className="mt-auto flex items-center gap-2 pt-2">
          <Link href={href} className={buttonClasses('outline', 'flex-1 px-4')}>{t.product.details}</Link>
          {quickAdd && onlyVariant && (
            <button
              type="button" className={buttonClasses('primary', 'px-4')} aria-label={`${t.product.addToCart}: ${product.name}`}
              onClick={() => { add(product.id, onlyVariant.id); toast(t.toast.addedCart); }}
            >
              <ShoppingBag className="h-4 w-4" aria-hidden />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
