import { startingPrice } from '@/lib/catalog';
import type { BrandId, CollectionId, Product } from '@/types/product';

export type SortKey = 'recommended' | 'newest' | 'priceAsc' | 'priceDesc' | 'name';
export const sortKeys: SortKey[] = ['recommended', 'newest', 'priceAsc', 'priceDesc', 'name'];

export interface ShopFilters {
  brands: BrandId[];
  collection?: CollectionId;
  storages: string[];
  rams: string[];
  screens: number[];
  minPrice?: number;
  maxPrice?: number;
  availableOnly: boolean;
  query: string;
}

export function applyFilters(items: Product[], f: ShopFilters): Product[] {
  const q = f.query.trim().toLowerCase();
  return items.filter((p) => {
    if (f.brands.length && !f.brands.includes(p.brand)) return false;
    if (f.collection && !p.collections.includes(f.collection)) return false;
    if (f.storages.length && !p.variants.some((v) => v.storage && f.storages.includes(v.storage))) return false;
    if (f.rams.length && !p.variants.some((v) => v.ram && f.rams.includes(v.ram))) return false;
    if (f.screens.length && !(p.specs.display?.sizeInch !== undefined && f.screens.includes(p.specs.display.sizeInch))) return false;
    if (f.availableOnly && !p.variants.some((v) => v.availability === 'available')) return false;
    if (f.minPrice !== undefined || f.maxPrice !== undefined) {
      const price = startingPrice(p)?.amount;
      if (price === undefined) return false;
      if (f.minPrice !== undefined && price < f.minPrice) return false;
      if (f.maxPrice !== undefined && price > f.maxPrice) return false;
    }
    if (q && !`${p.name} ${p.model} ${p.brand}`.toLowerCase().includes(q)) return false;
    return true;
  });
}

export function sortProducts(items: Product[], sort: SortKey): Product[] {
  const copy = [...items];
  const price = (p: Product) => startingPrice(p)?.amount;
  switch (sort) {
    case 'newest': return copy.sort((a, b) => Number(b.isNew) - Number(a.isNew));
    case 'priceAsc': return copy.sort((a, b) => (price(a) ?? Infinity) - (price(b) ?? Infinity));
    case 'priceDesc': return copy.sort((a, b) => (price(b) ?? -Infinity) - (price(a) ?? -Infinity));
    case 'name': return copy.sort((a, b) => a.name.localeCompare(b.name));
    default: return copy; // recommended = catalog order (featured first)
  }
}
