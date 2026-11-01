'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { brands } from '@/data/brands';
import { brandIds, isBrandId, isCollectionId } from '@/lib/catalog';
import { applyFilters, sortKeys, sortProducts, type ShopFilters, type SortKey } from '@/lib/catalog/filter';
import { getFacets } from '@/lib/catalog/facets';
import { fmt, type Dictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/config';
import { formatNumber } from '@/lib/format/number';
import type { Product } from '@/types/product';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { FilterPanel } from './FilterPanel';

const PAGE = 8;
const csv = (v: string | null) => (v ? v.split(',').filter(Boolean) : []);

export function ShopClient({ products, locale, t }: { products: Product[]; locale: Locale; t: Dictionary }) {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [drawer, setDrawer] = useState(false);
  const [visible, setVisible] = useState(PAGE);
  const facets = useMemo(() => getFacets(products), [products]);

  const filters: ShopFilters = {
    brands: csv(sp.get('brand')).filter(isBrandId),
    collection: isCollectionId(sp.get('collection') ?? undefined) ? (sp.get('collection') as ShopFilters['collection']) : undefined,
    storages: csv(sp.get('storage')), rams: csv(sp.get('ram')), screens: csv(sp.get('screen')).map(Number).filter((n) => !Number.isNaN(n)),
    minPrice: sp.get('min') ? Number(sp.get('min')) : undefined, maxPrice: sp.get('max') ? Number(sp.get('max')) : undefined,
    availableOnly: sp.get('available') === '1', query: sp.get('q') ?? '',
  };
  const sortParam = sp.get('sort') as SortKey | null;
  const sort: SortKey = sortParam && sortKeys.includes(sortParam) ? sortParam : 'recommended';

  const results = useMemo(() => sortProducts(applyFilters(products, filters), sort), [products, sp.toString()]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => setVisible(PAGE), [sp.toString()]); // eslint-disable-line react-hooks/exhaustive-deps

  const update = (patch: Record<string, string | null>) => {
    const p = new URLSearchParams(sp.toString());
    Object.entries(patch).forEach(([k, v]) => (v === null || v === '' ? p.delete(k) : p.set(k, v)));
    const qs = p.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };
  const toggleIn = (key: string, list: string[], value: string) => update({ [key]: (list.includes(value) ? list.filter((x) => x !== value) : [...list, value]).join(',') || null });
  const clearAll = () => router.replace(pathname, { scroll: false });

  const chips: { key: string; label: string; remove: () => void }[] = [
    ...filters.brands.map((b) => ({ key: `b-${b}`, label: brands[b].name, remove: () => toggleIn('brand', filters.brands, b) })),
    ...(filters.collection ? [{ key: 'c', label: t.collections.items[filters.collection], remove: () => update({ collection: null }) }] : []),
    ...filters.storages.map((s) => ({ key: `s-${s}`, label: s, remove: () => toggleIn('storage', filters.storages, s) })),
    ...filters.rams.map((s) => ({ key: `r-${s}`, label: `${t.shopx.ram} ${s}`, remove: () => toggleIn('ram', filters.rams, s) })),
    ...filters.screens.map((s) => ({ key: `sc-${s}`, label: `${s} ${t.shopx.inchUnit}`, remove: () => toggleIn('screen', filters.screens.map(String), String(s)) })),
    ...(filters.minPrice !== undefined || filters.maxPrice !== undefined ? [{ key: 'p', label: `${t.shopx.price}`, remove: () => update({ min: null, max: null }) }] : []),
    ...(filters.availableOnly ? [{ key: 'a', label: t.shopx.availableOnly, remove: () => update({ available: null }) }] : []),
    ...(filters.query ? [{ key: 'q', label: `“${filters.query}”`, remove: () => update({ q: null }) }] : []),
  ];

  const panel = <FilterPanel t={t} facets={facets} filters={filters} toggleIn={toggleIn} update={update} brandIds={brandIds} />;
  const shown = results.slice(0, visible);

  return (
    <div className="grid gap-10 lg:grid-cols-[17rem_1fr]">
      <aside className="hidden lg:block" aria-label={t.shopx.filters}>{panel}</aside>

      <div>
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => setDrawer(true)} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-ivory px-5 text-sm font-semibold lg:hidden"><SlidersHorizontal className="h-4 w-4" aria-hidden />{t.shopx.openFilters}</button>
          <div className="relative min-w-0 flex-1 basis-56">
            <Search aria-hidden className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-olive-muted" />
            <label htmlFor="shop-q" className="sr-only">{t.shopx.search}</label>
            <input id="shop-q" type="search" defaultValue={filters.query} key={filters.query} placeholder={t.shopx.search} onChange={(e) => update({ q: e.target.value.trim() || null })} className="min-h-11 w-full rounded-full border border-line bg-ivory ps-11 pe-4 text-sm outline-none focus:border-olive" />
          </div>
          <label className="flex items-center gap-2 text-sm"><span className="font-semibold text-olive-deep">{t.shopx.sort}</span>
            <select value={sort} onChange={(e) => update({ sort: e.target.value === 'recommended' ? null : e.target.value })} className="min-h-11 rounded-full border border-line bg-ivory px-4 text-sm outline-none focus:border-olive">
              {sortKeys.map((k) => <option key={k} value={k}>{t.shopx.sortOptions[k]}</option>)}
            </select>
          </label>
        </div>

        {chips.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2" aria-label={t.shopx.activeFilters}>
            {chips.map((c) => (
              <button key={c.key} onClick={c.remove} aria-label={`${t.shopx.remove}: ${c.label}`} className="inline-flex items-center gap-1.5 rounded-full bg-beige px-3 py-1.5 text-xs font-semibold text-olive-deep hover:bg-olive hover:text-ivory">{c.label}<X className="h-3 w-3" aria-hidden /></button>
            ))}
            <button onClick={clearAll} className="text-xs text-terracotta hover:underline">{t.shopx.clearAll}</button>
          </div>
        )}

        <p className="mt-5 text-sm text-ink/75" role="status" aria-live="polite">{fmt(t.shopx.count, { n: formatNumber(results.length, locale) })}</p>

        {results.length === 0 ? (
          <div className="mt-10"><EmptyState icon={Search} title={t.shopx.emptyTitle} text={t.shopx.emptyText} action={<Button variant="outline" onClick={clearAll}>{t.shopx.clearAll}</Button>} /></div>
        ) : (
          <>
            <ul className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {shown.map((p) => <li key={p.id}><ProductCard product={p} locale={locale} t={t} /></li>)}
            </ul>
            {results.length > visible && (
              <div className="mt-10 flex flex-col items-center gap-3">
                <p className="text-xs text-ink/70">{fmt(t.shopx.shown, { n: formatNumber(shown.length, locale), total: formatNumber(results.length, locale) })}</p>
                <Button variant="outline" onClick={() => setVisible((v) => v + PAGE)}>{t.shopx.loadMore}</Button>
              </div>
            )}
          </>
        )}
      </div>

      <AnimatePresence>
        {drawer && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div className="absolute inset-0 bg-forest/40" onClick={() => setDrawer(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.div role="dialog" aria-modal="true" aria-label={t.shopx.filters} className="absolute inset-x-0 bottom-0 flex max-h-[85vh] flex-col rounded-t-[2rem] bg-ivory"
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}>
              <div className="flex items-center justify-between border-b border-line px-6 py-4"><h2 className="text-lg font-bold text-olive-deep">{t.shopx.filters}</h2><button onClick={() => setDrawer(false)} aria-label={t.header.close} className="rounded-full p-2 hover:bg-beige"><X className="h-5 w-5" /></button></div>
              <div className="flex-1 overflow-y-auto px-6 py-5">{panel}</div>
              <div className="border-t border-line p-4"><Button className="w-full" onClick={() => setDrawer(false)}>{fmt(t.shopx.showResults, { n: formatNumber(results.length, locale) })}</Button></div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
