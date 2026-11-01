import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/lib/i18n';
import { isLocale } from '@/lib/i18n/config';
import { AuthForm } from '@/components/account/AuthForm';
import { PageShell } from '@/components/ui/PageShell';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getDictionary(locale).pagesx.titles.signup, robots: { index: false } } : {};
}
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  return (
    <PageShell crumbLabel={t.common.breadcrumb} crumbs={[{ label: t.common.home, href: `/${locale}` }, { label: t.pagesx.titles.signup }]} title={t.pagesx.titles.signup}>
      <AuthForm mode="signup" locale={locale} t={t} />
    </PageShell>
  );
}
