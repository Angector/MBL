'use client';

import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { fmt, type Dictionary } from '@/lib/i18n';
import { AssetImage } from '@/components/ui/AssetImage';
import { cn } from '@/lib/utils/cn';

export function ProductGallery({ images, name, t }: { images: string[]; name: string; t: Dictionary }) {
  const [index, setIndex] = useState(0);
  const [full, setFull] = useState(false);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const n = images.length;
  const go = useCallback((d: number) => setIndex((i) => (i + d + n) % n), [n]);
  const alt = (i: number) => `${name} - ${fmt(t.pdp.imageOf, { i: i + 1, n })}`;

  useEffect(() => {
    if (!full) return;
    closeRef.current?.focus();
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setFull(false);
      const rtl = document.documentElement.dir === 'rtl';
      if (e.key === 'ArrowRight') go(rtl ? -1 : 1);
      if (e.key === 'ArrowLeft') go(rtl ? 1 : -1);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [full, go]);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };
  const onKeyMain = (e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFull(true); } };
  const src = images[index] ?? '';

  return (
    <div className="space-y-4" role="group" aria-roledescription="carousel" aria-label={t.pdp.gallery}>
      <div
        className="group relative aspect-[4/5] cursor-zoom-in overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-ivory to-beige/70 shadow-soft"
        onPointerMove={onMove} onPointerLeave={() => setZoom(null)} onClick={() => setFull(true)} tabIndex={0} role="button" aria-label={`${t.pdp.fullscreen}: ${alt(index)}`} onKeyDown={onKeyMain}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={src} className="absolute inset-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
            style={zoom ? { transform: 'scale(1.8)', transformOrigin: `${zoom.x}% ${zoom.y}%`, transition: 'transform 0.2s' } : { transition: 'transform 0.3s' }}>
            <AssetImage src={src} alt={alt(index)} sizes="(min-width: 1024px) 45vw, 100vw" fit="contain" priority={index === 0} />
          </motion.div>
        </AnimatePresence>
        <span className="pointer-events-none absolute end-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-ivory/90 text-olive-deep shadow-soft"><Maximize2 className="h-5 w-5" aria-hidden /></span>
        {n > 1 && (
          <>
            <button type="button" onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label={t.common.previous} className="absolute start-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/90 shadow-soft"><ChevronLeft className="h-5 w-5 rtl:rotate-180" aria-hidden /></button>
            <button type="button" onClick={(e) => { e.stopPropagation(); go(1); }} aria-label={t.common.next} className="absolute end-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/90 shadow-soft"><ChevronRight className="h-5 w-5 rtl:rotate-180" aria-hidden /></button>
          </>
        )}
      </div>

      {n > 1 && (
        <ul className="flex gap-3 overflow-x-auto no-scrollbar" aria-label={t.pdp.thumbnails}>
          {images.map((s, i) => (
            <li key={s}>
              <button type="button" onClick={() => setIndex(i)} aria-label={alt(i)} aria-current={i === index} className={cn('relative block h-20 w-16 overflow-hidden rounded-2xl border-2 bg-cream transition-colors', i === index ? 'border-olive' : 'border-transparent hover:border-line')}>
                <AssetImage src={s} alt="" sizes="64px" fit="contain" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <AnimatePresence>
        {full && (
          <motion.div className="fixed inset-0 z-[70] flex flex-col bg-forest/95" role="dialog" aria-modal="true" aria-label={t.pdp.fullscreen} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <div className="flex items-center justify-between p-4 text-ivory">
              <p className="text-sm">{fmt(t.pdp.imageOf, { i: index + 1, n })}</p>
              <button ref={closeRef} onClick={() => setFull(false)} aria-label={t.pdp.closeViewer} className="rounded-full p-2 hover:bg-ivory/10"><X className="h-6 w-6" /></button>
            </div>
            <div className="relative flex-1">
              <div className="absolute inset-4 md:inset-12"><AssetImage src={src} alt={alt(index)} sizes="100vw" fit="contain" /></div>
              {n > 1 && (
                <>
                  <button onClick={() => go(-1)} aria-label={t.common.previous} className="absolute start-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/90"><ChevronLeft className="rtl:rotate-180" aria-hidden /></button>
                  <button onClick={() => go(1)} aria-label={t.common.next} className="absolute end-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/90"><ChevronRight className="rtl:rotate-180" aria-hidden /></button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
