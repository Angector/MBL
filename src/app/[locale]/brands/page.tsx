import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { brands } from '@/data/brands';
import { brandIds, getProductsByBrand } from '@/lib/catalog';
import { fmt, getDictionary } from '@/lib/i18n';
import { isLocale } from '@/lib/i18n/config';
import { formatNumber } from '@/lib/format/number';
import { AssetImage } from '@/components/ui/AssetImage';
import { PageShell } from '@/components/ui/PageShell';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getDictionary(locale).brandsPage.title, alternates: { canonical: `/${locale}/brands` } } : {};
}
export default async function BrandsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  return (
    <PageShell crumbLabel={t.common.breadcrumb} crumbs={[{ label: t.common.home, href: `/${locale}` }, { label: t.brandsPage.title }]} title={t.brandsPage.title} subtitle={t.brandsPage.subtitle}>
      <ul className="grid gap-6 sm:grid-cols-2">
        {brandIds.map((b) => (
          <li key={b}>
            <Link href={`/${locale}/brand/${b}`} className="group flex items-center gap-5 overflow-hidden rounded-3xl border border-line bg-ivory p-4 shadow-soft">
              <span className="relative h-32 w-28 shrink-0 overflow-hidden rounded-2xl"><span className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"><AssetImage src={brands[b].card.src} alt={brands[b].card.alt[locale]} sizes="112px" /></span></span>
              <span className="flex-1"><span className="block text-xl font-bold text-olive-deep">{brands[b].name}</span><span className="text-sm text-ink/75">{fmt(t.collectionsPage.count, { n: formatNumber(getProductsByBrand(b).length, locale) })}</span></span>
              <ArrowUpRight aria-hidden className="h-6 w-6 text-olive rtl:-scale-x-100" />
            </Link>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
