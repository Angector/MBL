import type { MetadataRoute } from 'next';
import { siteConfig } from '@/data/site-config';
import { brandIds, getAllProducts } from '@/lib/catalog';
import { infoPages, locales } from '@/lib/i18n/config';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['', '/shop', '/brands', '/collections', '/new', '/compare', '/wishlist', ...brandIds.map((b) => `/brand/${b}`), ...infoPages.map((p) => `/${p}`), ...getAllProducts().map((p) => `/product/${p.slug}`)];
  return locales.flatMap((l) => paths.map((p) => ({ url: `${siteConfig.url}/${l}${p}`, lastModified: new Date() })));
}
