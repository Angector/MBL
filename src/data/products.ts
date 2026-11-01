import type { BrandId, Product } from '@/types/product';

/**
 * DEMO CATALOG: model names only. No prices, stock, colours, storage or specs are
 * invented. Verify names against the official brand sites, then fill variants/specs
 * from a real source (manual entry, admin panel or authorised feed).
 */
const make = (brand: BrandId, folder: string, slug: string, name: string, model: string, extra: Partial<Product> = {}): Product => ({
  id: slug,
  slug,
  brand,
  name,
  model,
  images: [1, 2, 3].map((n) => `/images/products/${folder}/${slug}/${n}.webp`),
  variants: [{ id: `${slug}-default`, availability: 'unknown' }],
  specs: {},
  collections: [],
  featured: true,
  isNew: false,
  ...extra,
});

export const products: Product[] = [
  make('samsung', 'samsung', 'samsung-galaxy-s25-ultra', 'Samsung Galaxy S25 Ultra', 'Galaxy S25 Ultra', { collections: ['flagship'] }),
  make('samsung', 'samsung', 'samsung-galaxy-s25', 'Samsung Galaxy S25', 'Galaxy S25'),
  make('xiaomi', 'xiaomi', 'xiaomi-15', 'Xiaomi 15', 'Xiaomi 15'),
  make('xiaomi', 'xiaomi', 'redmi-note-14-pro', 'Redmi Note 14 Pro', 'Redmi Note 14 Pro'),
  make('google', 'google', 'google-pixel-10-pro', 'Google Pixel 10 Pro', 'Pixel 10 Pro', { collections: ['flagship'] }),
  make('google', 'google', 'google-pixel-10', 'Google Pixel 10', 'Pixel 10'),
  make('apple', 'apple', 'apple-iphone-17-pro', 'Apple iPhone 17 Pro', 'iPhone 17 Pro', { collections: ['flagship'] }),
  make('apple', 'apple', 'apple-iphone-17', 'Apple iPhone 17', 'iPhone 17'),
];
