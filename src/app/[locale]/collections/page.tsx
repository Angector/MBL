import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { homeAssets } from '@/data/home-assets';
import { collectionIds, getProductsByCollection } from '@/lib/catalog';
import { fmt, getDictionary } from '@/lib/i18n';
import { isLocale } from '@/lib/i18n/config';
import { formatNumber } from '@/lib/format/number';
import { AssetImage } from '@/components/ui/AssetImage';
import { PageShell } from '@/components/ui/PageShell';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getDictionary(locale).collectionsPage.title, alternates: { canonical: `/${locale}/collections` } } : {};
}
export default async function CollectionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  return (
    <PageShell crumbLabel={t.common.breadcrumb} crumbs={[{ label: t.common.home, href: `/${locale}` }, { label: t.collectionsPage.title }]} title={t.collectionsPage.title} subtitle={t.collectionsPage.subtitle}>
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5">
        {collectionIds.map((c) => {
          const n = getProductsByCollection(c).length;
          return (
            <li key={c}>
              <Link href={`/${locale}/shop?collection=${c}`} className="group relative block aspect-[4/5] overflow-hidden rounded-3xl shadow-soft">
                <span className="absolute inset-0 transition-transform duration-[900ms] ease-soft group-hover:scale-105"><AssetImage src={homeAssets.collections[c].src} alt={homeAssets.collections[c].alt[locale]} sizes="(min-width: 768px) 33vw, 50vw" /></span>
                <span aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-forest/75 to-transparent" />
                <span className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-2 text-ivory"><span><span className="block text-base font-bold md:text-lg">{t.collections.items[c]}</span><span className="text-xs opacity-85">{n > 0 ? fmt(t.collectionsPage.count, { n: formatNumber(n, locale) }) : t.collectionsPage.soon}</span></span><ArrowUpRight aria-hidden className="h-5 w-5 rtl:-scale-x-100" /></span>
              </Link>
            </li>
          );
        })}
      </ul>
    </PageShell>
  );
}
