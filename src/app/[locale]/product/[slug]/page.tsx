import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { brands } from '@/data/brands';
import { siteConfig } from '@/data/site-config';
import { getAllProducts, getProductBySlug, getRelatedProducts } from '@/lib/catalog';
import { getDictionary } from '@/lib/i18n';
import { isLocale, locales } from '@/lib/i18n/config';
import { ProductGallery } from '@/components/pdp/ProductGallery';
import { ProductPurchase } from '@/components/pdp/ProductPurchase';
import { RecentlyViewed } from '@/components/pdp/RecentlyViewed';
import { ProductCard } from '@/components/product/ProductCard';
import { Accordion } from '@/components/ui/Accordion';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Tabs } from '@/components/ui/Tabs';

export const generateStaticParams = () => locales.flatMap((locale) => getAllProducts().map((p) => ({ locale, slug: p.slug })));
type Params = Promise<{ locale: string; slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = getProductBySlug(slug);
  if (!isLocale(locale) || !product) return {};
  const t = getDictionary(locale);
  return {
    title: `${product.name} | ${t.meta.productSuffix}`,
    alternates: { canonical: `/${locale}/product/${slug}`, languages: { fa: `/fa/product/${slug}`, en: `/en/product/${slug}` } },
    openGraph: { title: product.name, type: 'website' },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const product = getProductBySlug(slug);
  if (!product) notFound();
  const t = getDictionary(locale);
  const brand = brands[product.brand];
  const priced = product.variants.find((v) => v.price);

  // Structured data only for products with a real, sourced price.
  const jsonLd = priced?.price ? {
    '@context': 'https://schema.org', '@type': 'Product', name: product.name, brand: { '@type': 'Brand', name: brand.name },
    offers: { '@type': 'Offer', price: priced.price.currency === 'IRT' ? priced.price.amount * 10 : priced.price.amount, priceCurrency: priced.price.currency === 'IRT' ? 'IRR' : priced.price.currency, url: `${siteConfig.url}/${locale}/product/${product.slug}` },
  } : null;

  const specRows = (Object.keys(t.pdp.specLabels) as (keyof typeof t.pdp.specLabels)[]).flatMap((k) => {
    let value: string | undefined;
    if (k === 'display') { const d = product.specs.display; value = d ? [d.sizeInch ? `${d.sizeInch} ${t.shopx.inchUnit}` : '', d.type, d.resolution, d.refreshRate].filter(Boolean).join(' · ') || undefined : undefined; }
    else value = product.specs[k];
    return [{ label: t.pdp.specLabels[k], value }];
  });
  const hasSpecs = specRows.some((r) => r.value);

  const overview = <p className="max-w-2xl text-base font-light text-ink/85">{product.description?.[locale] ?? t.pdp.overviewFallback}</p>;
  const specs = (
    <dl className="divide-y divide-line rounded-3xl border border-line bg-ivory">
      {specRows.map((r) => <div key={r.label} className="flex justify-between gap-4 px-5 py-3.5 text-sm"><dt className="text-ink/70">{r.label}</dt><dd className="text-end font-semibold">{r.value ?? t.pdp.unknown}</dd></div>)}
      {!hasSpecs && <p className="px-5 py-4 text-xs text-ink/70">{t.product.noSpecs}</p>}
    </dl>
  );
  const features = product.highlights?.length
    ? <ul className="list-disc space-y-2 ps-5 text-base font-light">{product.highlights.map((h) => <li key={h.en}>{h[locale]}</li>)}</ul>
    : <p className="text-sm text-ink/80">{t.pdp.noHighlights}</p>;
  const box = product.boxContents?.length
    ? <ul className="list-disc space-y-2 ps-5 text-base font-light">{product.boxContents.map((b) => <li key={b.en}>{b[locale]}</li>)}</ul>
    : <p className="text-sm text-ink/80">{t.pdp.boxFallback}</p>;
  const warranty = <div className="space-y-3 text-sm text-ink/85"><p>{t.pdp.warrantyNote}</p><p>{t.pdp.deliveryNote}</p>{product.source && <p>{t.product.source}: {product.source}{product.updatedAt ? ` · ${t.product.updated}: ${product.updatedAt}` : ''}</p>}</div>;

  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      <section className="py-8 md:py-14">
        <Container>
          <Breadcrumbs label={t.common.breadcrumb} items={[{ label: t.common.home, href: `/${locale}` }, { label: t.shopx.title, href: `/${locale}/shop` }, { label: brand.name, href: `/${locale}/brand/${product.brand}` }, { label: product.name }]} />
          <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
            <ProductGallery images={product.images} name={product.name} t={t} />
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-xs font-semibold tracking-wider text-olive-muted uppercase">{brand.name} · {t.pdp.demoBadge}</p>
                <h1 className="text-4xl font-bold text-olive-deep md:text-5xl">{product.name}</h1>
                <p className="text-xs text-ink/70">{t.pdp.reference}: {product.id}</p>
              </div>
              <ProductPurchase product={product} locale={locale} t={t} />
            </div>
          </div>

          <div className="mt-14">
            <Tabs tabs={[
              { id: 'overview', label: t.pdp.tabs.overview, content: overview },
              { id: 'specs', label: t.pdp.tabs.specs, content: specs },
              { id: 'features', label: t.pdp.tabs.features, content: features },
              { id: 'box', label: t.pdp.tabs.box, content: box },
              { id: 'warranty', label: t.pdp.tabs.warranty, content: warranty },
            ]} />
          </div>
        </Container>
      </section>

      <section className="bg-ivory py-14"><Container>
        <SectionHeading title={t.pdp.related} />
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{getRelatedProducts(product).map((p) => <li key={p.id}><ProductCard product={p} locale={locale} t={t} /></li>)}</ul>
        <p className="mt-8 text-center text-sm text-ink/70">{t.pdp.accessories}: {t.pdp.accessoriesNote}</p>
      </Container></section>

      <RecentlyViewed locale={locale} t={t} currentId={product.id} title={t.pdp.recent} />

      <section className="py-14"><Container><div className="mx-auto max-w-3xl"><SectionHeading title={t.pdp.faq} /><div className="mt-8"><Accordion items={t.faq} /></div></div></Container></section>
    </>
  );
}
