'use client';

import { useEffect } from 'react';
import { getProductById } from '@/lib/catalog';
import type { Dictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/config';
import { ProductCard } from '@/components/product/ProductCard';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useUserLists } from '@/components/providers/UserListsProvider';

/** Records the current product (if given) and lists the others the visitor viewed. */
export function RecentlyViewed({ locale, t, currentId, title, text, wrap = true }: { locale: Locale; t: Dictionary; currentId?: string; title: string; text?: string; wrap?: boolean }) {
  const { recent, pushRecent, hydrated } = useUserLists();
  useEffect(() => { if (currentId && hydrated) pushRecent(currentId); }, [currentId, hydrated, pushRecent]);

  const items = recent.filter((id) => id !== currentId).flatMap((id) => { const p = getProductById(id); return p ? [p] : []; }).slice(0, 4);
  if (!hydrated || items.length === 0) return null;
  const grid = (
    <>
      <SectionHeading title={title} text={text} />
      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{items.map((p) => <li key={p.id}><ProductCard product={p} locale={locale} t={t} /></li>)}</ul>
    </>
  );
  return wrap ? <section className="py-14"><Container>{grid}</Container></section> : grid;
}
