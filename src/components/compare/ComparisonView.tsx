'use client';

import Link from 'next/link';
import { GitCompareArrows, Plus, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { brands } from '@/data/brands';
import { getAllProducts, getProductById, primaryImage, startingPrice } from '@/lib/catalog';
import { formatPrice } from '@/lib/format/price';
import type { Dictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/config';
import type { Product } from '@/types/product';
import { AssetImage } from '@/components/ui/AssetImage';
import { Button, buttonClasses } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { useUserLists, MAX_COMPARE } from '@/components/providers/UserListsProvider';
import { cn } from '@/lib/utils/cn';

type RowKey = keyof Dictionary['compare']['rows'];
const rowOrder: RowKey[] = ['brand', 'model', 'price', 'storage', 'ram', 'display', 'processor', 'camera', 'battery', 'os', 'weight', 'connectivity'];

export function ComparisonView({ locale, t }: { locale: Locale; t: Dictionary }) {
  const { compare, toggleCompare, clearCompare, hydrated } = useUserLists();
  const [diffOnly, setDiffOnly] = useState(false);
  const items = compare.flatMap((id) => { const p = getProductById(id); return p ? [p] : []; });
  const dash = t.pdp.unknown;

  const value = (p: Product, k: RowKey): string => {
    const uniq = (xs: (string | undefined)[]) => Array.from(new Set(xs.filter(Boolean))).join(' / ') || dash;
    switch (k) {
      case 'brand': return brands[p.brand].name;
      case 'model': return p.model;
      case 'price': { const pr = startingPrice(p); return pr ? formatPrice(pr.amount, pr.currency, locale) : t.product.inquiry; }
      case 'storage': return uniq(p.variants.map((v) => v.storage));
      case 'ram': return uniq(p.variants.map((v) => v.ram));
      case 'display': { const d = p.specs.display; return d ? [d.sizeInch ? `${d.sizeInch} ${t.shopx.inchUnit}` : '', d.type, d.resolution, d.refreshRate].filter(Boolean).join(' · ') || dash : dash; }
      default: return p.specs[k] ?? dash;
    }
  };

  const rows = useMemo(() => rowOrder.map((k) => {
    const vals = items.map((p) => value(p, k));
    return { key: k, vals, differs: items.length > 1 && new Set(vals).size > 1 };
  }), [items.map((i) => i.id).join(','), locale]); // eslint-disable-line react-hooks/exhaustive-deps
  const shownRows = diffOnly ? rows.filter((r) => r.differs) : rows;
  const candidates = getAllProducts().filter((p) => !compare.includes(p.id));

  if (!hydrated) return <div className="h-64" aria-busy="true" aria-label={t.common.loading} />;
  if (items.length === 0) {
    return <EmptyState icon={GitCompareArrows} title={t.compare.emptyTitle} text={t.compare.emptyText} action={<Link href={`/${locale}/shop`} className={buttonClasses('primary')}>{t.compare.browse}</Link>} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={diffOnly} onChange={(e) => setDiffOnly(e.target.checked)} className="h-4 w-4 accent-[rgb(var(--olive))]" />{t.compare.onlyDifferences}</label>
        <div className="flex gap-2">
          {items.length < MAX_COMPARE && candidates.length > 0 && (
            <label className="flex items-center gap-2"><span className="sr-only">{t.compare.add}</span>
              <select value="" onChange={(e) => { if (e.target.value) toggleCompare(e.target.value); }} className="min-h-11 rounded-full border border-line bg-ivory px-4 text-sm"><option value="">+ {t.compare.pick}</option>{candidates.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
            </label>
          )}
          <Button variant="outline" onClick={clearCompare}>{t.compare.clear}</Button>
        </div>
      </div>
      {items.length < 2 && <p className="text-sm text-ink/75" role="status">{t.compare.needTwo}</p>}

      <div className="overflow-x-auto rounded-3xl border border-line bg-ivory">
        <table className="w-full min-w-[34rem] border-collapse text-sm">
          <caption className="sr-only">{t.compare.title}</caption>
          <thead>
            <tr>
              <td className="sticky start-0 z-10 w-28 bg-ivory p-3" />
              {items.map((p) => (
                <th key={p.id} scope="col" className="p-4 align-top font-normal">
                  <div className="relative mx-auto flex max-w-[11rem] flex-col items-center gap-2 text-center">
                    <button onClick={() => toggleCompare(p.id)} aria-label={`${t.compare.remove}: ${p.name}`} className="absolute -end-2 -top-2 rounded-full bg-beige p-1.5 hover:bg-olive hover:text-ivory"><X className="h-3.5 w-3.5" /></button>
                    <Link href={`/${locale}/product/${p.slug}`} className="relative block aspect-[4/5] w-28 overflow-hidden rounded-2xl bg-cream"><AssetImage src={primaryImage(p)} alt={p.name} sizes="112px" fit="contain" /></Link>
                    <Link href={`/${locale}/product/${p.slug}`} className="font-bold text-olive-deep hover:underline">{p.name}</Link>
                  </div>
                </th>
              ))}
              {items.length < MAX_COMPARE && <td className="hidden p-4 sm:table-cell"><div className="mx-auto flex aspect-[4/5] w-28 items-center justify-center rounded-2xl border border-dashed border-olive/30 text-olive-muted"><Plus aria-hidden /></div></td>}
            </tr>
          </thead>
          <tbody>
            {shownRows.map((r) => (
              <tr key={r.key} className={cn('border-t border-line', r.differs && 'bg-terracotta/5')}>
                <th scope="row" className="sticky start-0 z-10 bg-ivory p-3 text-start font-semibold text-olive-deep">
                  {t.compare.rows[r.key]}{r.differs && <span className="ms-2 rounded-full bg-terracotta px-2 py-0.5 text-[10px] font-semibold text-ivory">{t.compare.differsBadge}</span>}
                </th>
                {r.vals.map((v, i) => <td key={`${r.key}-${i}`} className={cn('p-3 text-center', r.differs && 'font-semibold')}>{v}</td>)}
                {items.length < MAX_COMPARE && <td className="hidden sm:table-cell" />}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
