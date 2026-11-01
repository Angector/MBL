'use client';

import { ArrowUpRight, Leaf } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { Dictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/config';
import type { BrandId, Product } from '@/types/product';
import { cn } from '@/lib/utils/cn';
import { ProductCarousel } from '@/components/product/ProductCarousel';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Wave } from '@/components/ui/Wave';

const filters: { id: BrandId | 'all'; label?: string }[] = [
  { id: 'all' }, { id: 'samsung', label: 'Samsung' }, { id: 'xiaomi', label: 'Xiaomi' }, { id: 'google', label: 'Google Pixel' }, { id: 'apple', label: 'Apple' },
];

export function FeaturedProducts({ locale, t, productT, products }: { locale: Locale; t: Dictionary['featured']; productT: Dictionary; products: Product[] }) {
  const [filter, setFilter] = useState<BrandId | 'all'>('all');
  const visible = useMemo(() => (filter === 'all' ? products : products.filter((p) => p.brand === filter)), [filter, products]);

  return (
    <section className="relative bg-olive pb-28 pt-16 text-ivory md:pb-36 md:pt-24">
      <Container>
        <div className="flex flex-col items-center gap-3">
          <Leaf aria-hidden className="h-6 w-6 text-ivory/70" strokeWidth={1.3} />
          <SectionHeading tone="light" title={t.title} accent={t.accent} text={t.subtitle} />
        </div>

        <div role="group" aria-label={t.filters} className="mt-8 flex flex-wrap justify-center gap-2">
          {filters.map((f) => {
            const selected = filter === f.id;
            return (
              <button
                key={f.id} type="button" aria-pressed={selected} onClick={() => setFilter(f.id)}
                className={cn('min-h-10 rounded-full border px-6 text-sm font-semibold transition-colors duration-300', selected ? 'border-ivory bg-ivory text-olive-deep' : 'border-ivory/40 text-ivory hover:bg-ivory/10')}
              >
                {f.id === 'all' ? t.all : f.label}
              </button>
            );
          })}
        </div>
      </Container>

      <div className="mt-4">
        {visible.length > 0 ? (
          <ProductCarousel products={visible} locale={locale} t={productT} labels={{ prev: t.prev, next: t.next, carousel: t.carousel }} />
        ) : (
          <p className="py-16 text-center text-ivory/80" role="status">{t.empty}</p>
        )}
      </div>

      <div className="mt-4 flex justify-center">
        <ButtonLink href={`/${locale}/shop`} variant="light">{t.shopAll}<ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden /></ButtonLink>
      </div>

      <Wave className="absolute inset-x-0 bottom-0 text-cream" />
    </section>
  );
}
