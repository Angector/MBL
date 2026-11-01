'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { SearchX } from 'lucide-react';
import { brands } from '@/data/brands';
import { searchCatalog } from '@/lib/catalog/search';
import { fmt, type Dictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/config';
import { ProductCard } from '@/components/product/ProductCard';
import { EmptyState } from '@/components/ui/EmptyState';

/** Reads ?q= in the browser, so the page itself can be statically exported. */
export function SearchResults({ locale, t }: { locale: Locale; t: Dictionary }) {
  const q = (useSearchParams().get('q') ?? '').slice(0, 80).trim();
  const result = searchCatalog(q, 48);
  const total = result.products.length + result.brands.length;

  return (
    <div>
      {q && <h2 className="mb-8 text-center text-xl font-bold text-olive-deep" aria-live="polite">{fmt(t.search.resultsFor, { q })}</h2>}
      {!q && <p className="text-center text-sm text-ink/75">{t.search.emptyQuery}</p>}
      {q && total === 0 && <EmptyState icon={SearchX} title={fmt(t.search.noResults, { q })} text={t.search.tryAgain} action={<Link className="text-sm font-semibold text-olive underline" href={`/${locale}/brands`}>{t.nav.allBrands}</Link>} />}
      {result.brands.length > 0 && (
        <ul className="mb-8 flex flex-wrap justify-center gap-2">{result.brands.map((b) => <li key={b}><Link href={`/${locale}/brand/${b}`} className="rounded-full bg-beige px-5 py-2 text-sm font-semibold text-olive-deep hover:bg-olive hover:text-ivory">{brands[b].name}</Link></li>)}</ul>
      )}
      {result.products.length > 0 && <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{result.products.map((p) => <li key={p.id}><ProductCard product={p} locale={locale} t={t} /></li>)}</ul>}
    </div>
  );
}
