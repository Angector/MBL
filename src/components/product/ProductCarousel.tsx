'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import type { Dictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/config';
import type { Product } from '@/types/product';
import { cn } from '@/lib/utils/cn';
import { ProductCard } from './ProductCard';

interface Props {
  products: Product[];
  locale: Locale;
  t: Dictionary;
  labels: { prev: string; next: string; carousel: string };
}

/** Scroll-snap carousel: buttons, mouse drag, touch swipe and arrow keys. The centred card is enlarged. */
export function ProductCarousel({ products, locale, t, labels }: Props) {
  const scroller = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: false });
  const [active, setActive] = useState(0);

  const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const centerOn = useCallback((index: number, smooth: boolean) => {
    const el = scroller.current;
    const item = el?.children[index] as HTMLElement | undefined;
    if (!el || !item) return;
    const a = el.getBoundingClientRect();
    const b = item.getBoundingClientRect();
    const delta = b.left + b.width / 2 - (a.left + a.width / 2);
    el.scrollBy({ left: delta, behavior: smooth && !prefersReduced() ? 'smooth' : 'auto' });
  }, []);

  const computeActive = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    const a = el.getBoundingClientRect();
    const center = a.left + a.width / 2;
    let best = 0;
    let bestDist = Infinity;
    Array.from(el.children).forEach((child, i) => {
      const r = child.getBoundingClientRect();
      const d = Math.abs(r.left + r.width / 2 - center);
      if (d < bestDist) { best = i; bestDist = d; }
    });
    setActive(best);
  }, []);

  // Start on the middle product whenever the list changes.
  useEffect(() => {
    const mid = Math.floor((products.length - 1) / 2);
    centerOn(mid, false);
    setActive(mid);
  }, [products, centerOn]);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(computeActive); };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => { el.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, [computeActive]);

  const go = (step: number) => centerOn(Math.min(products.length - 1, Math.max(0, active + step)), true);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const rtl = scroller.current ? getComputedStyle(scroller.current).direction === 'rtl' : false;
    if (e.key === 'ArrowRight') { e.preventDefault(); go(rtl ? -1 : 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(rtl ? 1 : -1); }
    if (e.key === 'Home') { e.preventDefault(); centerOn(0, true); }
    if (e.key === 'End') { e.preventDefault(); centerOn(products.length - 1, true); }
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    const el = scroller.current;
    if (e.pointerType !== 'mouse' || !el) return;
    drag.current = { active: true, startX: e.clientX, startScroll: el.scrollLeft, moved: false };
    el.classList.add('is-dragging');
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = scroller.current;
    if (!drag.current.active || !el) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    el.scrollLeft = drag.current.startScroll - dx;
  };
  const endDrag = () => {
    drag.current.active = false;
    scroller.current?.classList.remove('is-dragging');
  };

  return (
    <div className="relative" role="region" aria-roledescription="carousel" aria-label={labels.carousel}>
      <div
        ref={scroller}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onClickCapture={(e) => { if (drag.current.moved) { e.preventDefault(); e.stopPropagation(); drag.current.moved = false; } }}
        className="carousel no-scrollbar flex cursor-grab gap-5 overflow-x-auto py-8 focus-visible:outline-offset-[-4px]"
      >
        {products.map((p, i) => (
          <div key={p.id} className="carousel-item" aria-roledescription="slide" aria-label={`${i + 1} / ${products.length}`}>
            <div className={cn('h-full origin-center transition-all duration-500 ease-soft', i === active ? 'scale-100' : 'scale-[0.88] opacity-70')}>
              <ProductCard product={p} locale={locale} t={t} />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => go(-1)}
        disabled={active === 0}
        aria-label={labels.prev}
        className="absolute start-1 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-ivory text-olive-deep shadow-soft transition hover:bg-beige disabled:opacity-40 md:flex"
      >
        <ChevronLeft className="h-5 w-5 rtl:rotate-180" aria-hidden />
      </button>
      <button
        onClick={() => go(1)}
        disabled={active === products.length - 1}
        aria-label={labels.next}
        className="absolute end-1 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-ivory text-olive-deep shadow-soft transition hover:bg-beige disabled:opacity-40 md:flex"
      >
        <ChevronRight className="h-5 w-5 rtl:rotate-180" aria-hidden />
      </button>
    </div>
  );
}
