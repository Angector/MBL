import { formatPrice } from '@/lib/format/price';
import type { Locale } from '@/lib/i18n/config';
import type { ProductPrice as Price } from '@/types/product';

export function ProductPrice({ price, locale, inquiry, size = 'md' }: { price?: Price; locale: Locale; inquiry: string; size?: 'md' | 'lg' }) {
  const text = size === 'lg' ? 'text-2xl' : 'text-lg';
  if (!price) return <p className={`${size === 'lg' ? 'text-xl' : 'text-base'} font-semibold text-olive`}>{inquiry}</p>;
  return (
    <p className={`flex flex-wrap items-baseline gap-x-3 ${text} font-bold text-olive-deep`}>
      <span>{formatPrice(price.amount, price.currency, locale)}</span>
      {price.compareAt && price.compareAt > price.amount && <s className="text-sm font-light text-subtle">{formatPrice(price.compareAt, price.currency, locale)}</s>}
    </p>
  );
}
