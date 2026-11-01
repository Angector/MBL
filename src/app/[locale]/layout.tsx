import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import '../globals.css';
import { siteConfig } from '@/data/site-config';
import { getDictionary } from '@/lib/i18n';
import { isLocale, localeMeta, locales } from '@/lib/i18n/config';
import { CartProvider } from '@/components/cart/CartProvider';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { CompareTray } from '@/components/compare/CompareTray';
import { ToastProvider } from '@/components/providers/ToastProvider';
import { UserListsProvider } from '@/components/providers/UserListsProvider';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Footer } from '@/components/layout/Footer';
import { FontFaces } from '@/components/layout/FontFaces';
import { Header } from '@/components/layout/Header';

const latin = Inter({ subsets: ['latin'], variable: '--font-latin', display: 'swap' });
const display = Cormorant_Garamond({ subsets: ['latin'], variable: '--font-display', weight: ['500', '600', '700'], style: ['normal', 'italic'], display: 'swap' });

export const dynamicParams = false;
export const generateStaticParams = () => locales.map((locale) => ({ locale }));

export const viewport: Viewport = { themeColor: '#F4F1E8', width: 'device-width', initialScale: 1 };

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  const name = siteConfig.name[locale];
  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: `${name} | ${t.meta.homeTitle}`, template: `%s | ${name}` },
    description: siteConfig.description[locale],
    alternates: { canonical: `/${locale}`, languages: { fa: '/fa', en: '/en' } },
    openGraph: { type: 'website', siteName: name, locale: localeMeta[locale].og, title: name, description: siteConfig.description[locale] },
  };
}

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const { dir } = localeMeta[locale];

  return (
    <html lang={locale} dir={dir} className={`${latin.variable} ${display.variable}`}>
      <head><FontFaces /></head>
      <body className="flex min-h-screen flex-col antialiased">
        <noscript><style>{'.reveal{opacity:1!important;transform:none!important}'}</style></noscript>
        <ToastProvider closeLabel={t.header.close}>
          <UserListsProvider>
            <CartProvider>
              <AnnouncementBar locale={locale} />
              <Header locale={locale} t={t} />
              <main id="main" className="flex-1 pb-16 lg:pb-0">{children}</main>
              <Footer locale={locale} t={t.footer} />
              <CartDrawer locale={locale} t={t} />
              <CompareTray locale={locale} t={t} />
            </CartProvider>
          </UserListsProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
