import type { L10n } from './site';

export type BrandId = 'samsung' | 'xiaomi' | 'google' | 'apple';
export type CollectionId = 'flagship' | 'budget' | 'photography' | 'gaming' | 'compact' | 'latest';
export type Availability = 'available' | 'unavailable' | 'preorder' | 'unknown';

export interface ProductPrice {
  amount: number;
  currency: string;
  /** Only set when a real previous price exists. */
  compareAt?: number;
  source: string;
  /** ISO date of last verification. */
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  color?: string;
  /** CSS colour for the swatch; optional. */
  colorHex?: string;
  storage?: string;
  ram?: string;
  /** undefined => "price on request". Never invent prices. */
  price?: ProductPrice;
  availability: Availability;
}

/** Every field is optional: nothing is guessed. Fill from official sources. */
export interface ProductSpecs {
  display?: { sizeInch?: number; type?: string; resolution?: string; refreshRate?: string };
  processor?: string;
  camera?: string;
  battery?: string;
  os?: string;
  weight?: string;
  connectivity?: string;
  dimensions?: string;
}

export interface Product {
  id: string;
  slug: string;
  brand: BrandId;
  name: string;
  model: string;
  /** First image is the primary one. Paths live under /public/images/products. */
  images: string[];
  description?: L10n;
  highlights?: L10n[];
  boxContents?: L10n[];
  variants: ProductVariant[];
  specs: ProductSpecs;
  collections: CollectionId[];
  featured: boolean;
  isNew: boolean;
  /** Where the data came from; shown on the product page. */
  source?: string;
  updatedAt?: string;
}
