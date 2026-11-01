'use client';

import type { ReactNode } from 'react';
import { brands } from '@/data/brands';
import type { getFacets } from '@/lib/catalog/facets';
import type { ShopFilters } from '@/lib/catalog/filter';
import type { Dictionary } from '@/lib/i18n';
import type { BrandId } from '@/types/product';

function Group({ title, children }: { title: string; children: ReactNode }) {
  return <fieldset className="border-b border-line pb-5"><legend className="mb-3 text-sm font-bold text-olive-deep">{title}</legend><div className="space-y-2.5">{children}</div></fieldset>;
}
function Check({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <label className="flex min-h-8 cursor-pointer items-center gap-3 text-sm">
      <input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 accent-[rgb(var(--olive))]" />{label}
    </label>
  );
}

interface Props {
  t: Dictionary;
  facets: ReturnType<typeof getFacets>;
  filters: ShopFilters;
  brandIds: BrandId[];
  toggleIn: (key: string, list: string[], value: string) => void;
  update: (patch: Record<string, string | null>) => void;
}

export function FilterPanel({ t, facets, filters, brandIds, toggleIn, update }: Props) {
  const noFacets = !facets.storages.length && !facets.rams.length && !facets.screens.length && !facets.priceRange;
  return (
    <div className="space-y-5">
      <Group title={t.shopx.brand}>
        {brandIds.map((b) => <Check key={b} label={brands[b].name} checked={filters.brands.includes(b)} onChange={() => toggleIn('brand', filters.brands, b)} />)}
      </Group>
      <Group title={t.shopx.category}>
        {(Object.keys(t.collections.items) as (keyof typeof t.collections.items)[]).map((c) => (
          <Check key={c} label={t.collections.items[c]} checked={filters.collection === c} onChange={() => update({ collection: filters.collection === c ? null : c })} />
        ))}
      </Group>
      <Group title={t.shopx.availability}>
        <Check label={t.shopx.availableOnly} checked={filters.availableOnly} onChange={() => update({ available: filters.availableOnly ? null : '1' })} />
      </Group>
      {facets.priceRange && (
        <Group title={t.shopx.price}>
          <div className="flex gap-2">
            <label className="flex-1 text-xs">{t.shopx.priceMin}<input type="number" inputMode="numeric" min={0} defaultValue={filters.minPrice} onBlur={(e) => update({ min: e.target.value || null })} className="mt-1 min-h-10 w-full rounded-xl border border-line bg-cream px-3 text-sm" /></label>
            <label className="flex-1 text-xs">{t.shopx.priceMax}<input type="number" inputMode="numeric" min={0} defaultValue={filters.maxPrice} onBlur={(e) => update({ max: e.target.value || null })} className="mt-1 min-h-10 w-full rounded-xl border border-line bg-cream px-3 text-sm" /></label>
          </div>
        </Group>
      )}
      {facets.storages.length > 0 && <Group title={t.shopx.storage}>{facets.storages.map((s) => <Check key={s} label={s} checked={filters.storages.includes(s)} onChange={() => toggleIn('storage', filters.storages, s)} />)}</Group>}
      {facets.rams.length > 0 && <Group title={t.shopx.ram}>{facets.rams.map((s) => <Check key={s} label={s} checked={filters.rams.includes(s)} onChange={() => toggleIn('ram', filters.rams, s)} />)}</Group>}
      {facets.screens.length > 0 && <Group title={t.shopx.screen}>{facets.screens.map((s) => <Check key={s} label={`${s} ${t.shopx.inchUnit}`} checked={filters.screens.includes(s)} onChange={() => toggleIn('screen', filters.screens.map(String), String(s))} />)}</Group>}
      {noFacets && <p className="rounded-2xl bg-beige p-4 text-xs text-ink/80">{t.shopx.noFacets}</p>}
    </div>
  );
}
