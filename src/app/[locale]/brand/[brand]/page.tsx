import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { brands } from '@/data/brands';
import { brandIds, getProductsByBrand, isBrandId } from '@/lib/catalog';
import { getDictionary } from '@/lib/i18n';
import { isLocale, locales } from '@/lib/i18n/config';
import { ProductCard } from '@/components/product/ProductCard';
import { AssetImage } from '@/components/ui/AssetImage';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { EmptyState } from '@/components/ui/EmptyState';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Smartphone } from 'lucide-react';

type Params = Promise<{ locale: string; brand: string }>;
export const dynamicParams = false;
export const generateStaticParams = () => locales.flatMap((locale) => brandIds.map((brand) => ({ locale, brand })));

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, brand } = await params;
  if (!isLocale(locale) || !isBrandId(brand)) return {};
  return { title: brands[brand].name, description: brands[brand].intro[locale], alternates: { canonical: `/${locale}/brand/${brand}`, languages: { fa: `/fa/brand/${brand}`, en: `/en/brand/${brand}` } } };
}

export default async function BrandPage({ params }: { params: Params }) {
  const { locale, brand } = await params;
  if (!isLocale(locale) || !isBrandId(brand)) notFound();
  const t = getDictionary(locale);
  const info = brands[brand];
  const items = getProductsByBrand(brand);
  const featured = items.filter((p) => p.featured).slice(0, 4);

  return (
    <>
      <section className="bg-gradient-to-b from-ivory to-cream pb-14 pt-8 md:pb-20">
        <Container>
          <Breadcrumbs label={t.common.breadcrumb} items={[{ label: t.common.home, href: `/${locale}` }, { label: t.nav.allBrands, href: `/${locale}/brands` }, { label: info.name }]} />
          <div className="mt-10 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal className="space-y-6">
              <p className="text-xs font-semibold tracking-[0.18em] text-olive-muted uppercase">{t.brandPage.explore}</p>
              <h1 className="text-balance text-5xl font-extrabold text-olive-deep md:text-6xl">{info.name}</h1>
              <p className="accent text-2xl">{info.tagline[locale]}</p>
              <p className="max-w-md text-base font-light text-ink/85">{info.intro[locale]}</p>
              <div className="flex flex-wrap gap-3"><ButtonLink href={`/${locale}/shop?brand=${brand}`}>{t.brandPage.models}</ButtonLink><ButtonLink variant="outline" href={`/${locale}/compare`}>{t.brandPage.compareCta}</ButtonLink></div>
            </Reveal>
            <Reveal delay={100}>
              <div className="relative aspect-[5/4] overflow-hidden rounded-[2.5rem] shadow-soft lg:rounded-ss-[7rem]"><AssetImage src={info.hero.src} alt={info.hero.alt[locale]} sizes="(min-width: 1024px) 50vw, 100vw" priority /></div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="py-14 md:py-20"><Container>
        <SectionHeading title={t.brandPage.featured} />
        {featured.length === 0 ? <div className="mt-8"><EmptyState icon={Smartphone} title={t.brandPage.empty} /></div> : (
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{featured.map((p) => <li key={p.id}><ProductCard product={p} locale={locale} t={t} /></li>)}</ul>
        )}
      </Container></section>

      <section className="bg-olive py-16 text-ivory md:py-24"><Container>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal><div className="relative aspect-[4/3] overflow-hidden rounded-[2.5rem]"><AssetImage src={info.editorial.src} alt={info.editorial.alt[locale]} sizes="(min-width: 1024px) 50vw, 100vw" /></div></Reveal>
          <Reveal delay={100}><SectionHeading align="start" tone="light" title={t.brandPage.editorialTitle} text={t.brandPage.editorialText} /></Reveal>
        </div>
      </Container></section>

      <section className="py-14 md:py-20"><Container>
        <SectionHeading title={t.brandPage.otherBrands} />
        <ul className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
          {brandIds.filter((b) => b !== brand).map((b) => (
            <li key={b}><Link href={`/${locale}/brand/${b}`} className="block rounded-3xl border border-line bg-ivory px-6 py-5 text-center text-lg font-bold text-olive-deep transition-colors hover:bg-beige">{brands[b].name}</Link></li>
          ))}
        </ul>
      </Container></section>
    </>
  );
}
