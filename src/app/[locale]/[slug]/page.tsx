import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/data/site-config';
import { getDictionary } from '@/lib/i18n';
import { infoPages, isLocale, locales, type InfoPage } from '@/lib/i18n/config';
import { Accordion } from '@/components/ui/Accordion';
import { PageShell } from '@/components/ui/PageShell';

export const dynamicParams = false;
export const generateStaticParams = () => locales.flatMap((locale) => infoPages.map((slug) => ({ locale, slug })));
type Params = Promise<{ locale: string; slug: string }>;
const isInfoPage = (v: string): v is InfoPage => (infoPages as readonly string[]).includes(v);

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !isInfoPage(slug)) return {};
  return { title: getDictionary(locale).pages.titles[slug], alternates: { canonical: `/${locale}/${slug}`, languages: { fa: `/fa/${slug}`, en: `/en/${slug}` } } };
}

export default async function InfoPageRoute({ params }: { params: Params }) {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !isInfoPage(slug)) notFound();
  const t = getDictionary(locale);
  const { contact } = siteConfig;
  const body: Record<InfoPage, string> = {
    offers: t.pagesx.offers, about: t.pagesx.about, contact: t.pagesx.contact, faq: '', shipping: t.pagesx.shipping,
    returns: t.pagesx.returns, warranty: t.pagesx.warranty, privacy: t.pagesx.privacy, terms: t.pagesx.terms,
  };
  const title = t.pages.titles[slug];

  return (
    <PageShell narrow crumbLabel={t.common.breadcrumb} crumbs={[{ label: t.common.home, href: `/${locale}` }, { label: title }]} title={title}>
      <div className="space-y-6 text-center text-base font-light text-ink/85">
        {slug === 'faq' ? <div className="text-start"><Accordion items={t.faq} /></div> : <p>{body[slug]}</p>}
        {slug === 'contact' && (contact.email || contact.phone || contact.address) && (
          <dl className="mx-auto max-w-sm space-y-2 rounded-3xl border border-line bg-ivory p-6 text-start text-sm">
            {contact.email && <div className="flex justify-between gap-4"><dt>{t.pages.email}</dt><dd dir="ltr">{contact.email}</dd></div>}
            {contact.phone && <div className="flex justify-between gap-4"><dt>{t.pages.phone}</dt><dd dir="ltr">{contact.phone}</dd></div>}
            {contact.address && <div className="flex justify-between gap-4"><dt>{t.pages.address}</dt><dd>{contact.address[locale]}</dd></div>}
          </dl>
        )}
        <Link href={`/${locale}`} className="inline-block text-sm font-semibold text-olive underline">{t.pages.home}</Link>
      </div>
    </PageShell>
  );
}
