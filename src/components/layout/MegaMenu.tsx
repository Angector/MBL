import Link from 'next/link';
import { brands } from '@/data/brands';
import { brandIds, collectionIds } from '@/lib/catalog';
import type { Dictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/config';
import { AssetImage } from '@/components/ui/AssetImage';

/** Panel content for the Shop mega menu (rendered inside Header's hover/focus wrapper). */
export function MegaMenu({ locale, t, onNavigate }: { locale: Locale; t: Dictionary; onNavigate: () => void }) {
  const base = `/${locale}`;
  return (
    <div className="mx-auto grid max-w-site grid-cols-[2fr_1fr_1fr] gap-10 px-8 py-8">
      <div>
        <p className="mb-4 text-xs font-bold tracking-[0.16em] text-olive-muted uppercase">{t.nav.mega.brands}</p>
        <ul className="grid grid-cols-4 gap-4">
          {brandIds.map((id) => (
            <li key={id}>
              <Link href={`${base}/brand/${id}`} onClick={onNavigate} className="group block">
                <span className="relative block aspect-[4/5] overflow-hidden rounded-2xl bg-beige">
                  <span className="absolute inset-0 transition-transform duration-700 ease-soft group-hover:scale-105"><AssetImage src={brands[id].card.src} alt={brands[id].card.alt[locale]} sizes="180px" /></span>
                </span>
                <span className="mt-2 block text-sm font-semibold text-olive-deep">{brands[id].name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="mb-4 text-xs font-bold tracking-[0.16em] text-olive-muted uppercase">{t.nav.mega.collections}</p>
        <ul className="space-y-2.5">
          {collectionIds.map((c) => (
            <li key={c}><Link href={`${base}/shop?collection=${c}`} onClick={onNavigate} className="text-sm text-ink/85 hover:text-olive hover:underline">{t.collections.items[c]}</Link></li>
          ))}
        </ul>
      </div>
      <div>
        <p className="mb-4 text-xs font-bold tracking-[0.16em] text-olive-muted uppercase">{t.nav.mega.quick}</p>
        <ul className="space-y-2.5 text-sm">
          <li><Link href={`${base}/shop`} onClick={onNavigate} className="font-semibold text-olive hover:underline">{t.nav.mega.browse}</Link></li>
          <li><Link href={`${base}/new`} onClick={onNavigate} className="text-ink/85 hover:text-olive hover:underline">{t.nav.newArrivals}</Link></li>
          <li><Link href={`${base}/compare`} onClick={onNavigate} className="text-ink/85 hover:text-olive hover:underline">{t.nav.compare}</Link></li>
          <li><Link href={`${base}/wishlist`} onClick={onNavigate} className="text-ink/85 hover:text-olive hover:underline">{t.nav.wishlist}</Link></li>
          <li><Link href={`${base}/brands`} onClick={onNavigate} className="text-ink/85 hover:text-olive hover:underline">{t.nav.allBrands}</Link></li>
        </ul>
      </div>
    </div>
  );
}
