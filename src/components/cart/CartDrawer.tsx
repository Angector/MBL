'use client';

import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ShoppingBag, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { primaryImage } from '@/lib/catalog';
import { formatPrice } from '@/lib/format/price';
import type { Dictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/config';
import { buttonClasses } from '@/components/ui/Button';
import { useCart } from './CartProvider';
import { CartLineItem } from './CartLineItem';
import { useCartDetails } from './useCartDetails';

export function CartDrawer({ locale, t }: { locale: Locale; t: Dictionary }) {
  const { isOpen, close } = useCart();
  const { detailed, subtotal, currency, hasPriced, hasInquiry, mixedCurrency } = useCartDetails();
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();
  const rtl = locale === 'fa';

  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, close]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          <motion.div className="absolute inset-0 bg-forest/40" onClick={close} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} />
          <motion.aside
            role="dialog" aria-modal="true" aria-label={t.cart.title}
            className="absolute inset-y-0 end-0 flex w-full max-w-md flex-col bg-ivory shadow-soft"
            initial={reduced ? { opacity: 0 } : { x: rtl ? '-100%' : '100%' }} animate={{ x: 0, opacity: 1 }} exit={reduced ? { opacity: 0 } : { x: rtl ? '-100%' : '100%' }}
            transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
          >
            <header className="flex items-center justify-between border-b border-line px-6 py-5">
              <h2 className="text-xl font-bold text-olive-deep">{t.cart.title}</h2>
              <button ref={closeRef} onClick={close} aria-label={t.header.close} className="rounded-full p-2 text-olive hover:bg-beige"><X className="h-5 w-5" /></button>
            </header>

            {detailed.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <ShoppingBag aria-hidden className="h-12 w-12 text-olive-muted/60" strokeWidth={1.2} />
                <p className="text-lg font-semibold text-olive-deep">{t.cart.empty}</p>
                <p className="text-sm text-ink/70">{t.cart.emptyHint}</p>
                <Link href={`/${locale}/shop`} onClick={close} className={buttonClasses('outline')}>{t.cart.continue}</Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-line overflow-y-auto px-6">
                  {detailed.map((d) => (
                    <CartLineItem key={`${d.product.id}-${d.variant.id}`} d={d} locale={locale} t={t} image={primaryImage(d.product)} compact />
                  ))}
                </ul>
                <footer className="space-y-3 border-t border-line px-6 py-5">
                  {hasPriced && currency && !mixedCurrency && (
                    <p className="flex items-center justify-between text-sm font-semibold text-olive-deep"><span>{t.cart.total}</span><span>{formatPrice(subtotal, currency, locale)}</span></p>
                  )}
                  {hasInquiry && <p className="text-xs text-ink/70">{t.cart.inquiryNote}</p>}
                  <Link href={`/${locale}/cart`} onClick={close} className={buttonClasses('outline', 'w-full')}>{t.cartPage.title}</Link>
                  <Link href={`/${locale}/checkout`} onClick={close} className={buttonClasses('primary', 'w-full')}>{t.cartPage.toCheckout}</Link>
                </footer>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
