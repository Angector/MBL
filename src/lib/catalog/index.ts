import { products } from '@/data/products';
import type { BrandId, CollectionId, Product, ProductVariant } from '@/types/product';

/**
 * Data-access layer. The UI only talks to these functions, so replacing the local
 * array with a database / API later does not touch any component.
 */
export const brandIds: BrandId[] = ['samsung', 'xiaomi', 'google', 'apple'];
export const collectionIds: CollectionId[] = ['flagship', 'budget', 'photography', 'gaming', 'compact', 'latest'];

export const isBrandId = (v: string | undefined): v is BrandId => !!v && (brandIds as string[]).includes(v);
export const isCollectionId = (v: string | undefined): v is CollectionId => !!v && (collectionIds as string[]).includes(v);

export const getAllProducts = (): Product[] => products;
export const getFeaturedProducts = (): Product[] => products.filter((p) => p.featured);
export const getNewProducts = (): Product[] => products.filter((p) => p.isNew);
export const getProductBySlug = (slug: string): Product | undefined => products.find((p) => p.slug === slug);
export const getProductById = (id: string): Product | undefined => products.find((p) => p.id === id);
export const getProductsByBrand = (brand: BrandId): Product[] => products.filter((p) => p.brand === brand);
export const getProductsByCollection = (c: CollectionId): Product[] => products.filter((p) => p.collections.includes(c));

export function findVariant(productId: string, variantId: string): { product: Product; variant: ProductVariant } | undefined {
  const product = getProductById(productId);
  const variant = product?.variants.find((v) => v.id === variantId);
  return product && variant ? { product, variant } : undefined;
}

export const primaryImage = (p: Product): string => p.images[0] ?? '';

/** Lowest listed price among variants, if any. */
export function startingPrice(p: Product) {
  const priced = p.variants.flatMap((v) => (v.price ? [v.price] : []));
  return priced.length ? priced.reduce((a, b) => (b.amount < a.amount ? b : a)) : undefined;
}

export function getAvailability(p: Product): ProductVariant['availability'] {
  if (p.variants.some((v) => v.availability === 'available')) return 'available';
  if (p.variants.some((v) => v.availability === 'preorder')) return 'preorder';
  if (p.variants.length && p.variants.every((v) => v.availability === 'unavailable')) return 'unavailable';
  return 'unknown';
}

export function getRelatedProducts(p: Product, limit = 4): Product[] {
  const score = (o: Product) => (o.brand === p.brand ? 2 : 0) + o.collections.filter((c) => p.collections.includes(c)).length;
  return products.filter((o) => o.id !== p.id).sort((a, b) => score(b) - score(a)).slice(0, limit);
}
