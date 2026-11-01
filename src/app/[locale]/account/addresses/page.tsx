import { notFound } from 'next/navigation';
import { getDictionary } from '@/lib/i18n';
import { isLocale } from '@/lib/i18n/config';
import { AccountEmpty } from '@/components/account/AccountPanels';
import { AddressForm } from '@/components/account/panels-wrappers';

export const metadata = { robots: { index: false } };

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  return <div className="space-y-6"><AccountEmpty kind="addresses" t={t} /><AddressForm t={t} /></div>;
}
