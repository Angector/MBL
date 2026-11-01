'use client';

import { useMemo } from 'react';
import { findVariant } from '@/lib/catalog';
import type { Product, ProductVariant } from '@/types/product';
import { useCart, type CartLine } from './CartProvider';

export interface DetailedLine { line: CartLine; product: Product; variant: ProductVariant; subtotal: number | null }

/** Resolves cart lines against the catalog and computes totals from priced variants only. */
export function useCartDetails() {
  const { lines } = useCart();
  return useMemo(() => {
    const detailed: DetailedLine[] = lines.flatMap((line) => {
      const found = findVariant(line.productId, line.variantId);
      return found ? [{ line, ...found, subtotal: found.variant.price ? found.variant.price.amount * line.qty : null }] : [];
    });
    const priced = detailed.filter((d) => d.subtotal !== null);
    const currencies = new Set(priced.map((d) => d.variant.price?.currency));
    return {
      detailed,
      subtotal: priced.reduce((s, d) => s + (d.subtotal ?? 0), 0),
      currency: currencies.size === 1 ? ([...currencies][0] ?? null) : null,
      mixedCurrency: currencies.size > 1,
      hasPriced: priced.length > 0,
      hasInquiry: detailed.some((d) => d.subtotal === null),
    };
  }, [lines]);
}
