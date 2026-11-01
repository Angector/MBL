import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SearchX } from 'lucide-react';
import { brands } from '@/data/brands';
import { fmt, getDictionary } from '@/lib/i18n';
import { isLocale } from '@/lib/i18n/config';
import { searchCatalog } from '@/lib/catalog/search';
import { ProductCard } from '@/components/product/ProductCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageShell } from '@/components/ui/PageShell';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getDictionary(locale).search.title, robots: { index: false } } : {};
}

export default async function SearchPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ q?: string | string[] }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const sp = await searchParams;
  const q = (Array.isArray(sp.q) ? sp.q[0] : sp.q)?.slice(0, 80) ?? '';
  const t = getDictionary(locale);
  const result = searchCatalog(q, 48);
  const total = result.products.length + result.brands.length;

  return (
    <PageShell crumbLabel={t.common.breadcrumb} crumbs={[{ label: t.common.home, href: `/${locale}` }, { label: t.search.title }]} title={q ? fmt(t.search.resultsFor, { q }) : t.search.title}>
      {!q && <p className="text-center text-sm text-ink/75">{t.search.emptyQuery}</p>}
      {q && total === 0 && <EmptyState icon={SearchX} title={fmt(t.search.noResults, { q })} text={t.search.tryAgain} action={<Link className="text-sm font-semibold text-olive underline" href={`/${locale}/brands`}>{t.nav.allBrands}</Link>} />}
      {result.brands.length > 0 && (
        <ul className="mb-8 flex flex-wrap justify-center gap-2">{result.brands.map((b) => <li key={b}><Link href={`/${locale}/brand/${b}`} className="rounded-full bg-beige px-5 py-2 text-sm font-semibold text-olive-deep hover:bg-olive hover:text-ivory">{brands[b].name}</Link></li>)}</ul>
      )}
      {result.products.length > 0 && <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{result.products.map((p) => <li key={p.id}><ProductCard product={p} locale={locale} t={t} /></li>)}</ul>}
    </PageShell>
  );
}
