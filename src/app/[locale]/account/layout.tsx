import Link from 'next/link';
import { Info } from 'lucide-react';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { getDictionary } from '@/lib/i18n';
import { isLocale } from '@/lib/i18n/config';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Container';

export default async function AccountLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const links = [
    { href: '', label: t.account.overview }, { href: '/profile', label: t.account.profile }, { href: '/addresses', label: t.account.addresses },
    { href: '/orders', label: t.account.orders }, { href: '/saved', label: t.account.saved },
  ];
  return (
    <section className="py-10 md:py-16">
      <Container>
        <Breadcrumbs label={t.common.breadcrumb} items={[{ label: t.common.home, href: `/${locale}` }, { label: t.account.title }]} />
        <h1 className="mt-6 text-4xl font-bold text-olive-deep md:text-5xl">{t.account.title}</h1>
        <p className="mt-4 flex items-start gap-3 rounded-2xl border border-terracotta/30 bg-terracotta/5 p-4 text-sm"><Info aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-terracotta" />{t.account.demoNotice}</p>
        <div className="mt-8 grid gap-8 lg:grid-cols-[14rem_1fr]">
          <nav aria-label={t.account.title} className="no-scrollbar flex gap-2 overflow-x-auto lg:flex-col">
            {links.map((l) => <Link key={l.href} href={`/${locale}/account${l.href}`} className="whitespace-nowrap rounded-full border border-line bg-ivory px-5 py-2.5 text-sm font-semibold text-olive-deep hover:bg-beige lg:rounded-2xl">{l.label}</Link>)}
          </nav>
          <div>{children}</div>
        </div>
      </Container>
    </section>
  );
}
