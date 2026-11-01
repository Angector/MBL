import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import { getNewProducts } from '@/lib/catalog';
import { getDictionary } from '@/lib/i18n';
import { isLocale } from '@/lib/i18n/config';
import { ProductCard } from '@/components/product/ProductCard';
import { buttonClasses } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageShell } from '@/components/ui/PageShell';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getDictionary(locale).newPage.title, alternates: { canonical: `/${locale}/new` } } : {};
}
export default async function NewPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const items = getNewProducts();
  return (
    <PageShell crumbLabel={t.common.breadcrumb} crumbs={[{ label: t.common.home, href: `/${locale}` }, { label: t.newPage.title }]} title={t.newPage.title} subtitle={t.newPage.subtitle}>
      {items.length === 0
        ? <EmptyState icon={Sparkles} title={t.newPage.emptyTitle} text={t.newPage.emptyText} action={<Link href={`/${locale}/shop`} className={buttonClasses('primary')}>{t.compare.browse}</Link>} />
        : <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{items.map((p) => <li key={p.id}><ProductCard product={p} locale={locale} t={t} /></li>)}</ul>}
    </PageShell>
  );
}
