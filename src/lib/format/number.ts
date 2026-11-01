import { localeMeta, type Locale } from '@/lib/i18n/config';

export const formatNumber = (n: number, locale: Locale): string => new Intl.NumberFormat(localeMeta[locale].intl).format(n);
