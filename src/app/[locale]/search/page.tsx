import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getDictionary } from '@/lib/i18n';
import { isLocale } from '@/lib/i18n/config';
import { SearchResults } from '@/components/search/SearchResults';
import { PageShell } from '@/components/ui/PageShell';
import { Skeleton } from '@/components/ui/Skeleton';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getDictionary(locale).search.title, robots: { index: false } } : {};
}

// No `searchParams` prop here: that would force dynamic rendering, which static export forbids.
export default async function SearchPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  return (
    <PageShell crumbLabel={t.common.breadcrumb} crumbs={[{ label: t.common.home, href: `/${locale}` }, { label: t.search.title }]} title={t.search.title}>
      <Suspense fallback={<Skeleton className="h-64" />}>
        <SearchResults locale={locale} t={t} />
      </Suspense>
    </PageShell>
  );
}
