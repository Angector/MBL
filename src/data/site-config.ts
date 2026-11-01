import type { SiteConfig } from '@/types/site';

/**
 * Central store settings. Change the name, logo, market and contact info here.
 * Nothing in the UI invents services: only entries set to `true` below are shown.
 */
export const siteConfig: SiteConfig = {
  name: { fa: 'موبیلو', en: 'Mobilo' }, // temporary text logo
  tagline: { fa: 'فروشگاه تخصصی موبایل', en: 'Smartphone specialists' },
  description: {
    fa: 'فروشگاه اینترنتی تخصصی گوشی‌های سامسونگ، شیائومی، گوگل پیکسل و اپل.',
    en: 'A specialist online store for Samsung, Xiaomi, Google Pixel and Apple smartphones.',
  },
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  logoSrc: null,
  market: { country: 'IR', currency: 'IRT' }, // change to e.g. 'USD' for another market
  announcement: {
    enabled: true,
    messages: [
      {
        fa: 'قیمت و موجودی هر مدل از طریق استعلام اعلام می‌شود.',
        en: 'Pricing and availability for each model are provided on request.',
      },
    ],
  },
  contact: {
    // email: 'hello@example.com',
    // phone: '+98 21 0000 0000',
    // address: { fa: '...', en: '...' },
  },
  social: [
    // { label: 'Instagram', href: 'https://instagram.com/your-account' },
  ],
  services: {
    buyingGuide: true,
    support: true,
    warrantyInfo: true,
    comparison: false,
    storeServices: false,
    shipping: true,
  },
  newsletterEndpoint: undefined, // e.g. '/api/newsletter' once the backend exists
};
