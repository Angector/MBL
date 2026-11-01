import type { BrandId } from '@/types/product';
import type { ImageAsset, L10n } from '@/types/site';

export interface BrandInfo {
  id: BrandId;
  name: string;
  tagline: L10n;
  intro: L10n;
  hero: ImageAsset;
  card: ImageAsset;
  editorial: ImageAsset;
}

/** Brand copy is deliberately generic: no factual claims about the brands. */
export const brands: Record<BrandId, BrandInfo> = {
  samsung: {
    id: 'samsung', name: 'Samsung',
    tagline: { fa: 'گلکسی؛ مجموعه‌ای از گوشی‌های سامسونگ', en: 'Galaxy: the Samsung phone range' },
    intro: { fa: 'مدل‌های سامسونگ موجود در کاتالوگ فروشگاه را اینجا ببینید و با سایر برندها مقایسه کنید.', en: 'Browse the Samsung models in our catalogue and compare them with other brands.' },
    hero: { src: '/images/brands/samsung/hero.webp', alt: { fa: 'گوشی‌های سامسونگ', en: 'Samsung phones' } },
    card: { src: '/images/home/brands/samsung.webp', alt: { fa: 'گوشی‌های سامسونگ', en: 'Samsung phones' } },
    editorial: { src: '/images/brands/samsung/editorial.webp', alt: { fa: 'سامسونگ؛ تصویر تحریری', en: 'Samsung editorial' } },
  },
  xiaomi: {
    id: 'xiaomi', name: 'Xiaomi',
    tagline: { fa: 'شیائومی و ردمی؛ انتخاب‌های متنوع', en: 'Xiaomi and Redmi: varied choices' },
    intro: { fa: 'مدل‌های شیائومی و ردمی کاتالوگ فروشگاه، کنار هم و آماده مقایسه.', en: 'Xiaomi and Redmi models from our catalogue, side by side and ready to compare.' },
    hero: { src: '/images/brands/xiaomi/hero.webp', alt: { fa: 'گوشی‌های شیائومی', en: 'Xiaomi phones' } },
    card: { src: '/images/home/brands/xiaomi.webp', alt: { fa: 'گوشی‌های شیائومی', en: 'Xiaomi phones' } },
    editorial: { src: '/images/brands/xiaomi/editorial.webp', alt: { fa: 'شیائومی؛ تصویر تحریری', en: 'Xiaomi editorial' } },
  },
  google: {
    id: 'google', name: 'Google Pixel',
    tagline: { fa: 'پیکسل؛ تجربه اندروید گوگل', en: 'Pixel: the Google Android experience' },
    intro: { fa: 'مدل‌های گوگل پیکسل کاتالوگ فروشگاه را بررسی کنید.', en: 'Explore the Google Pixel models in our catalogue.' },
    hero: { src: '/images/brands/google/hero.webp', alt: { fa: 'گوشی‌های گوگل پیکسل', en: 'Google Pixel phones' } },
    card: { src: '/images/home/brands/google-pixel.webp', alt: { fa: 'گوشی‌های گوگل پیکسل', en: 'Google Pixel phones' } },
    editorial: { src: '/images/brands/google/editorial.webp', alt: { fa: 'پیکسل؛ تصویر تحریری', en: 'Pixel editorial' } },
  },
  apple: {
    id: 'apple', name: 'Apple iPhone',
    tagline: { fa: 'آیفون؛ مجموعه گوشی‌های اپل', en: 'iPhone: the Apple phone range' },
    intro: { fa: 'مدل‌های آیفون کاتالوگ فروشگاه را ببینید و با رقبا مقایسه کنید.', en: 'See the iPhone models in our catalogue and compare them with the competition.' },
    hero: { src: '/images/brands/apple/hero.webp', alt: { fa: 'آیفون اپل', en: 'Apple iPhone' } },
    card: { src: '/images/home/brands/apple.webp', alt: { fa: 'آیفون اپل', en: 'Apple iPhone' } },
    editorial: { src: '/images/brands/apple/editorial.webp', alt: { fa: 'آیفون؛ تصویر تحریری', en: 'iPhone editorial' } },
  },
};
