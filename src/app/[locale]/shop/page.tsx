import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getAllProducts } from '@/lib/catalog';
import { getDictionary } from '@/lib/i18n';
import { isLocale } from '@/lib/i18n/config';
import { ShopClient } from '@/components/shop/ShopClient';
import { PageShell } from '@/components/ui/PageShell';
import { Skeleton } from '@/components/ui/Skeleton';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: getDictionary(locale).shopx.title, alternates: { canonical: `/${locale}/shop`, languages: { fa: '/fa/shop', en: '/en/shop' } } };
}

export default async function ShopPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  return (
    <PageShell crumbLabel={t.common.breadcrumb} crumbs={[{ label: t.common.home, href: `/${locale}` }, { label: t.shopx.title }]} title={t.shopx.title} subtitle={t.shopx.subtitle}>
      <Suspense fallback={<div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-96" />)}</div>}>
        <ShopClient products={getAllProducts()} locale={locale} t={t} />
      </Suspense>
    </PageShell>
  );
}
