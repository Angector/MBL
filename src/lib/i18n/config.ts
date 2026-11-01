export const locales = ['fa', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'fa';

export const localeMeta: Record<Locale, { dir: 'rtl' | 'ltr'; label: string; intl: string; og: string }> = {
  fa: { dir: 'rtl', label: 'فارسی', intl: 'fa-IR', og: 'fa_IR' },
  en: { dir: 'ltr', label: 'English', intl: 'en-US', og: 'en_US' },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export const infoPages = [
  'offers', 'about', 'contact', 'faq', 'shipping', 'returns', 'warranty', 'privacy', 'terms',
] as const;
export type InfoPage = (typeof infoPages)[number];
