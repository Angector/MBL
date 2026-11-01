import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/lib/i18n';
import { isLocale } from '@/lib/i18n/config';
import { ComparisonView } from '@/components/compare/ComparisonView';
import { PageShell } from '@/components/ui/PageShell';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getDictionary(locale).compare.title, alternates: { canonical: `/${locale}/compare` } } : {};
}
export default async function ComparePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  return (
    <PageShell crumbLabel={t.common.breadcrumb} crumbs={[{ label: t.common.home, href: `/${locale}` }, { label: t.compare.title }]} title={t.compare.title} subtitle={t.compare.subtitle}>
      <ComparisonView locale={locale} t={t} />
    </PageShell>
  );
}
