'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, Home, Search, ShoppingBag, Store } from 'lucide-react';
import type { Dictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/config';
import { formatNumber } from '@/lib/format/number';
import { cn } from '@/lib/utils/cn';
import { useCart } from '@/components/cart/CartProvider';
import { useUserLists } from '@/components/providers/UserListsProvider';

export function MobileBottomNav({ locale, t, onSearch }: { locale: Locale; t: Dictionary; onSearch: () => void }) {
  const pathname = usePathname() ?? '';
  const { count } = useCart();
  const { wishlist } = useUserLists();
  const base = `/${locale}`;
  const item = 'relative flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold';
  const active = (href: string, exact = false) => (exact ? pathname === href : pathname.startsWith(href));
  const links = [
    { href: base, label: t.nav.mobile.home, Icon: Home, exact: true, n: 0 },
    { href: `${base}/shop`, label: t.nav.mobile.shop, Icon: Store, exact: false, n: 0 },
  ];
  const cartHref = `${base}/cart`;
  const wishHref = `${base}/wishlist`;

  return (
    <nav aria-label={t.nav.bottom} className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ivory/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-lg">
        {links.map(({ href, label, Icon, exact }) => (
          <Link key={href} href={href} aria-current={active(href, exact) ? 'page' : undefined} className={cn(item, active(href, exact) ? 'text-terracotta' : 'text-olive-deep')}><Icon className="h-5 w-5" aria-hidden />{label}</Link>
        ))}
        <button type="button" onClick={onSearch} className={cn(item, 'text-olive-deep')}><Search className="h-5 w-5" aria-hidden />{t.nav.mobile.search}</button>
        <Link href={wishHref} aria-current={active(wishHref) ? 'page' : undefined} className={cn(item, active(wishHref) ? 'text-terracotta' : 'text-olive-deep')}>
          <span className="relative"><Heart className="h-5 w-5" aria-hidden />{wishlist.length > 0 && <span className="absolute -end-2 -top-1.5 min-w-4 rounded-full bg-terracotta px-1 text-center text-[10px] text-ivory">{formatNumber(wishlist.length, locale)}</span>}</span>{t.nav.mobile.wishlist}
        </Link>
        <Link href={cartHref} aria-current={active(cartHref) ? 'page' : undefined} className={cn(item, active(cartHref) ? 'text-terracotta' : 'text-olive-deep')}>
          <span className="relative"><ShoppingBag className="h-5 w-5" aria-hidden />{count > 0 && <span className="absolute -end-2 -top-1.5 min-w-4 rounded-full bg-terracotta px-1 text-center text-[10px] text-ivory">{formatNumber(count, locale)}</span>}</span>{t.nav.mobile.cart}
        </Link>
      </div>
    </nav>
  );
}
