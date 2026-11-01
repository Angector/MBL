import { getAllProducts } from '@/lib/catalog';
import type { Product } from '@/types/product';

/** Facets are derived from real data only: an empty facet is simply not shown. */
export function getFacets(items: Product[] = getAllProducts()) {
  const uniq = <T,>(arr: (T | undefined)[]) => Array.from(new Set(arr.filter((v): v is T => v !== undefined)));
  const prices = items.flatMap((p) => p.variants.flatMap((v) => (v.price ? [v.price.amount] : [])));
  return {
    storages: uniq(items.flatMap((p) => p.variants.map((v) => v.storage))),
    rams: uniq(items.flatMap((p) => p.variants.map((v) => v.ram))),
    screens: uniq(items.map((p) => p.specs.display?.sizeInch)).sort((a, b) => a - b),
    priceRange: prices.length ? { min: Math.min(...prices), max: Math.max(...prices) } : null,
  };
}
