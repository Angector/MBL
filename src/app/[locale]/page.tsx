import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/data/site-config';
import { getFeaturedProducts } from '@/lib/catalog';
import { getDictionary } from '@/lib/i18n';
import { isLocale } from '@/lib/i18n/config';
import { BrandCategories } from '@/components/home/BrandCategories';
import { BrandStory } from '@/components/home/BrandStory';
import { CollectionsSection } from '@/components/home/CollectionsSection';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { HeroSection } from '@/components/home/HeroSection';
import { StoreExperience } from '@/components/home/StoreExperience';
import { BenefitsSection } from '@/components/home/BenefitsSection';
import { NewArrivals } from '@/components/home/NewArrivals';
import { NewsletterSection } from '@/components/home/NewsletterSection';
import { RecentlyViewed } from '@/components/pdp/RecentlyViewed';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: getDictionary(locale).meta.homeTitle, alternates: { canonical: `/${locale}`, languages: { fa: '/fa', en: '/en' } } };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: siteConfig.name[locale],
    description: siteConfig.description[locale],
    url: `${siteConfig.url}/${locale}`,
    ...(siteConfig.contact.email ? { email: siteConfig.contact.email } : {}),
    ...(siteConfig.contact.phone ? { telephone: siteConfig.contact.phone } : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HeroSection locale={locale} t={t.hero} />
      <BrandCategories locale={locale} t={t.brands} />
      <BrandStory locale={locale} t={t.story} />
      <FeaturedProducts locale={locale} t={t.featured} productT={t} products={getFeaturedProducts()} />
      <NewArrivals locale={locale} t={t} />
      <CollectionsSection locale={locale} t={t.collections} />
      <StoreExperience locale={locale} t={t.experience} />
      <RecentlyViewed locale={locale} t={t} title={t.home2.recent} text={t.home2.recentText} />
      <BenefitsSection t={t} />
      <NewsletterSection t={t} />
    </>
  );
}
