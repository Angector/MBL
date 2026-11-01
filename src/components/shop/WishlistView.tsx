'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { getProductById } from '@/lib/catalog';
import type { Dictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/config';
import { ProductCard } from '@/components/product/ProductCard';
import { buttonClasses } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { useUserLists } from '@/components/providers/UserListsProvider';

export function WishlistView({ locale, t }: { locale: Locale; t: Dictionary }) {
  const { wishlist, hydrated } = useUserLists();
  const items = wishlist.flatMap((id) => { const p = getProductById(id); return p ? [p] : []; });
  if (!hydrated) return <div className="h-64" aria-busy="true" aria-label={t.common.loading} />;
  if (items.length === 0) return <EmptyState icon={Heart} title={t.wishlist.emptyTitle} text={t.wishlist.emptyText} action={<Link href={`/${locale}/shop`} className={buttonClasses('primary')}>{t.wishlist.browse}</Link>} />;
  return <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{items.map((p) => <li key={p.id}><ProductCard product={p} locale={locale} t={t} /></li>)}</ul>;
}
