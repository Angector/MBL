import { brands } from '@/data/brands';
import { brandIds, getAllProducts } from '@/lib/catalog';
import type { BrandId, Product } from '@/types/product';

/** Search service interface: today local, later an API call with the same shape. */
export interface SearchResult { products: Product[]; brands: BrandId[] }

const haystack = (p: Product) =>
  [p.name, p.model, p.brand, brands[p.brand].name, p.specs.processor, p.specs.os, p.specs.camera, ...p.variants.flatMap((v) => [v.storage, v.ram, v.color])]
    .filter(Boolean).join(' ').toLowerCase();

export function searchCatalog(query: string, limit = 24): SearchResult {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return { products: [], brands: [] };
  const matchedProducts = getAllProducts().filter((p) => { const h = haystack(p); return terms.every((t) => h.includes(t)); }).slice(0, limit);
  const matchedBrands = brandIds.filter((b) => terms.every((t) => brands[b].name.toLowerCase().includes(t) || b.includes(t)));
  return { products: matchedProducts, brands: matchedBrands };
}
