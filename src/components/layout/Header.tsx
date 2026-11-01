'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, GitCompareArrows, Heart, Languages, Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Dictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/config';
import { formatNumber } from '@/lib/format/number';
import { cn } from '@/lib/utils/cn';
import { useCart } from '@/components/cart/CartProvider';
import { useUserLists } from '@/components/providers/UserListsProvider';
import { SearchOverlay } from '@/components/search/SearchOverlay';
import { Logo } from './Logo';
import { MegaMenu } from './MegaMenu';
import { MobileBottomNav } from './MobileBottomNav';

function Badge({ n, locale }: { n: number; locale: Locale }) {
  if (n <= 0) return null;
  return <span className="absolute -end-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-terracotta px-1 text-[11px] font-bold text-ivory">{formatNumber(n, locale)}</span>;
}

export function Header({ locale, t }: { locale: Locale; t: Dictionary }) {
  const pathname = usePathname() ?? `/${locale}`;
  const { count, open: openCart } = useCart();
  const { wishlist, compare } = useUserLists();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const megaTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => { setMenuOpen(false); setMega(false); }, [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMega(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const other: Locale = locale === 'fa' ? 'en' : 'fa';
  const switchHref = pathname.replace(/^\/(fa|en)(?=\/|$)/, `/${other}`);
  const base = `/${locale}`;
  const nav = t.header.nav;
  const linkClass = 'relative py-2 text-sm font-semibold text-olive-deep transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:scale-x-0 after:bg-olive after:transition-transform after:duration-300 hover:text-olive hover:after:scale-x-100';
  const iconBtn = 'relative rounded-full p-2.5 text-olive-deep transition-colors hover:bg-beige';
  const startLinks = [{ href: `${base}/brands`, label: nav.brands }, { href: `${base}/offers`, label: nav.offers }];
  const endLinks = [{ href: `${base}/about`, label: nav.about }, { href: `${base}/contact`, label: nav.contact }];
  const openMega = () => { window.clearTimeout(megaTimer.current); setMega(true); };
  const closeMegaSoon = () => { megaTimer.current = window.setTimeout(() => setMega(false), 140); };

  return (
    <>
      <header className={cn('sticky top-0 z-40 bg-cream/95 backdrop-blur transition-shadow duration-300', scrolled && 'shadow-[0_1px_0_rgb(var(--line))]')} onMouseLeave={closeMegaSoon} onMouseEnter={() => window.clearTimeout(megaTimer.current)}>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-2 focus:rounded focus:bg-ivory focus:px-3 focus:py-2">{t.header.skip}</a>
        <div className={cn('mx-auto grid max-w-site grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 transition-all duration-300 md:px-8', scrolled ? 'py-2' : 'py-4')}>
          <div className="flex items-center gap-8">
            <button className={cn(iconBtn, 'lg:hidden')} aria-label={t.header.menu} aria-expanded={menuOpen} onClick={() => setMenuOpen((v) => !v)}>{menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
            <nav aria-label={t.nav.primary} className="hidden items-center gap-8 lg:flex">
              <div onMouseEnter={openMega}>
                <button type="button" aria-expanded={mega} aria-controls="mega-panel" onClick={() => setMega((v) => !v)} className={cn(linkClass, 'inline-flex items-center gap-1')}>
                  {nav.shop}<ChevronDown aria-hidden className={cn('h-4 w-4 transition-transform', mega && 'rotate-180')} />
                </button>
              </div>
              {startLinks.map((l) => <Link key={l.href} href={l.href} className={linkClass}>{l.label}</Link>)}
            </nav>
          </div>

          <Logo locale={locale} />

          <div className="flex items-center justify-end gap-2 lg:gap-6">
            <nav aria-label={t.nav.secondary} className="hidden items-center gap-8 xl:flex">
              {endLinks.map((l) => <Link key={l.href} href={l.href} className={linkClass}>{l.label}</Link>)}
            </nav>
            <div className="flex items-center">
              <button className={iconBtn} aria-label={t.header.search} onClick={() => setSearchOpen(true)}><Search className="h-5 w-5" /></button>
              <Link href={`${base}/compare`} className={cn(iconBtn, 'hidden sm:block')} aria-label={t.nav.compare}><GitCompareArrows className="h-5 w-5" /><Badge n={compare.length} locale={locale} /></Link>
              <Link href={`${base}/wishlist`} className={cn(iconBtn, 'hidden sm:block')} aria-label={t.nav.wishlist}><Heart className="h-5 w-5" /><Badge n={wishlist.length} locale={locale} /></Link>
              <Link href={`${base}/account`} className={cn(iconBtn, 'hidden md:block')} aria-label={t.header.account}><User className="h-5 w-5" /></Link>
              <Link href={switchHref} hrefLang={other} lang={other} className={cn(iconBtn, 'flex items-center gap-1 text-xs font-semibold')} aria-label={`${t.header.language}: ${t.header.switchTo}`}>
                <Languages className="h-5 w-5" aria-hidden /><span className="hidden sm:inline">{t.header.switchTo}</span>
              </Link>
              <button className={iconBtn} aria-label={t.header.cart} onClick={openCart}><ShoppingBag className="h-5 w-5" /><Badge n={count} locale={locale} /></button>
            </div>
          </div>
        </div>

        {/* mega menu (desktop) */}
        <div id="mega-panel" onMouseEnter={openMega} className={cn('absolute inset-x-0 top-full hidden border-t border-line bg-ivory shadow-soft transition-all duration-300 ease-soft lg:block', mega ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0')} inert={!mega}>
          <MegaMenu locale={locale} t={t} onNavigate={() => setMega(false)} />
        </div>

        {/* mobile menu */}
        <div className={cn('grid overflow-hidden border-t border-line bg-cream transition-[grid-template-rows] duration-500 ease-soft lg:hidden', menuOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr] border-transparent')}>
          <nav aria-label={t.nav.mobileMenu} className="min-h-0 overflow-hidden" inert={!menuOpen}>
            <ul className="flex flex-col px-5 py-4">
              {[{ href: `${base}/shop`, label: nav.shop }, { href: `${base}/brands`, label: nav.brands }, { href: `${base}/collections`, label: t.nav.collections }, { href: `${base}/new`, label: t.nav.newArrivals }, { href: `${base}/compare`, label: t.nav.compare }, ...startLinks.slice(1), ...endLinks, { href: `${base}/account`, label: t.header.account }].map((l) => (
                <li key={l.href}><Link href={l.href} className="block border-b border-line/70 py-3.5 text-base font-semibold text-olive-deep">{l.label}</Link></li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <SearchOverlay open={searchOpen} onClose={closeSearch} locale={locale} t={t} />
      <MobileBottomNav locale={locale} t={t} onSearch={() => setSearchOpen(true)} />
    </>
  );
}
