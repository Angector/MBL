import { localeMeta, type Locale } from '@/lib/i18n/config';

/** Iranian Toman has no ISO 4217 code, so it is formatted manually. */
export function formatPrice(amount: number, currency: string, locale: Locale): string {
  const intl = localeMeta[locale].intl;
  if (currency === 'IRT') {
    const unit = locale === 'fa' ? 'تومان' : 'Toman';
    return `${new Intl.NumberFormat(intl).format(amount)} ${unit}`;
  }
  return new Intl.NumberFormat(intl, { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}
