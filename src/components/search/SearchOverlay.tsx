'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Clock, Search, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { brands } from '@/data/brands';
import { primaryImage } from '@/lib/catalog';
import { searchCatalog } from '@/lib/catalog/search';
import { fmt, type Dictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/config';
import { AssetImage } from '@/components/ui/AssetImage';
import { useUserLists } from '@/components/providers/UserListsProvider';
import { cn } from '@/lib/utils/cn';

const popular = ['iPhone', 'Samsung', 'Pixel', 'Xiaomi'];

export function SearchOverlay({ open, onClose, locale, t }: { open: boolean; onClose: () => void; locale: Locale; t: Dictionary }) {
  const router = useRouter();
  const { searches, pushSearch, clearSearches } = useUserLists();
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const reduced = useReducedMotion();
  const result = useMemo(() => searchCatalog(query, 6), [query]);

  // Flat list of navigable targets for keyboard control.
  const targets = useMemo(() => [
    ...result.brands.map((b) => ({ key: `b-${b}`, href: `/${locale}/brand/${b}` })),
    ...result.products.map((p) => ({ key: p.id, href: `/${locale}/product/${p.slug}` })),
  ], [result, locale]);

  useEffect(() => { if (open) { setQuery(''); setCursor(-1); window.setTimeout(() => inputRef.current?.focus(), 50); } }, [open]);
  useEffect(() => setCursor(-1), [query]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: globalThis.KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const go = (href: string) => { pushSearch(query); onClose(); router.push(href); };
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setCursor((c) => Math.min(targets.length - 1, c + 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setCursor((c) => Math.max(-1, c - 1)); }
    if (e.key === 'Enter') {
      e.preventDefault();
      const target = targets[cursor];
      if (target) go(target.href);
      else if (query.trim()) go(`/${locale}/search?q=${encodeURIComponent(query.trim())}`);
    }
  };
  const q = query.trim();

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 bg-cream/98 backdrop-blur" role="dialog" aria-modal="true" aria-label={t.search.title}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
          <motion.div className="mx-auto flex h-full max-w-3xl flex-col px-5 pt-6 md:pt-16"
            initial={reduced ? false : { y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}>
            <div className="flex items-center gap-3 border-b-2 border-olive pb-3">
              <Search aria-hidden className="h-7 w-7 text-olive" />
              <label htmlFor="overlay-search" className="sr-only">{t.search.title}</label>
              <input
                id="overlay-search" ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={onKeyDown}
                role="combobox" aria-expanded={targets.length > 0} aria-controls="search-results" aria-autocomplete="list" aria-activedescendant={targets[cursor] ? `sr-${targets[cursor].key}` : undefined}
                placeholder={t.search.placeholder} autoComplete="off" enterKeyHint="search"
                className="min-w-0 flex-1 bg-transparent text-2xl font-semibold text-olive-deep outline-none placeholder:text-subtle md:text-4xl"
              />
              {query && <button onClick={() => { setQuery(''); inputRef.current?.focus(); }} aria-label={t.search.clear} className="rounded-full p-2 hover:bg-beige"><X className="h-5 w-5" /></button>}
              <button onClick={onClose} className="rounded-full border border-line px-4 py-2 text-sm font-semibold hover:bg-beige">{t.header.close}</button>
            </div>
            <p className="mt-2 text-xs text-ink/60">{t.search.kb}</p>

            <div id="search-results" role="listbox" aria-label={t.search.title} className="mt-6 flex-1 overflow-y-auto pb-24">
              {!q && (
                <div className="space-y-8">
                  {searches.length > 0 && (
                    <section>
                      <div className="mb-3 flex items-center justify-between"><h2 className="text-sm font-bold text-olive-deep">{t.search.recent}</h2><button onClick={clearSearches} className="text-xs text-terracotta hover:underline">{t.search.clearRecent}</button></div>
                      <ul className="flex flex-wrap gap-2">{searches.map((s) => (<li key={s}><button onClick={() => setQuery(s)} className="inline-flex items-center gap-2 rounded-full border border-line bg-ivory px-4 py-2 text-sm hover:bg-beige"><Clock aria-hidden className="h-4 w-4 text-olive-muted" />{s}</button></li>))}</ul>
                    </section>
                  )}
                  <section>
                    <h2 className="mb-3 text-sm font-bold text-olive-deep">{t.search.popular}</h2>
                    <ul className="flex flex-wrap gap-2">{popular.map((s) => (<li key={s}><button onClick={() => setQuery(s)} className="rounded-full bg-beige px-4 py-2 text-sm font-semibold text-olive-deep hover:bg-olive hover:text-ivory">{s}</button></li>))}</ul>
                  </section>
                  <section>
                    <h2 className="mb-3 text-sm font-bold text-olive-deep">{t.search.brands}</h2>
                    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">{Object.values(brands).map((b) => (<li key={b.id}><Link href={`/${locale}/brand/${b.id}`} onClick={onClose} className="block rounded-2xl border border-line bg-ivory px-4 py-3 text-sm font-semibold text-olive-deep hover:bg-beige">{b.name}</Link></li>))}</ul>
                  </section>
                </div>
              )}

              {q && targets.length === 0 && (
                <div className="py-10 text-center" role="status"><p className="text-lg font-semibold text-olive-deep">{fmt(t.search.noResults, { q })}</p><p className="mt-2 text-sm text-ink/70">{t.search.tryAgain}</p></div>
              )}

              {q && targets.length > 0 && (
                <div className="space-y-6">
                  {result.brands.length > 0 && (
                    <section><h2 className="mb-2 text-sm font-bold text-olive-deep">{t.search.brands}</h2>
                      <ul>{result.brands.map((b) => { const key = `b-${b}`; const i = targets.findIndex((x) => x.key === key); return (
                        <li key={key} role="option" id={`sr-${key}`} aria-selected={cursor === i}><Link href={`/${locale}/brand/${b}`} onClick={() => { pushSearch(query); onClose(); }} className={cn('block rounded-2xl px-4 py-3 text-base font-semibold text-olive-deep hover:bg-beige', cursor === i && 'bg-beige')}>{brands[b].name}</Link></li>); })}</ul></section>
                  )}
                  {result.products.length > 0 && (
                    <section><h2 className="mb-2 text-sm font-bold text-olive-deep">{t.search.products}</h2>
                      <ul>{result.products.map((p) => { const i = targets.findIndex((x) => x.key === p.id); return (
                        <li key={p.id} role="option" id={`sr-${p.id}`} aria-selected={cursor === i}>
                          <Link href={`/${locale}/product/${p.slug}`} onClick={() => { pushSearch(query); onClose(); }} className={cn('flex items-center gap-4 rounded-2xl p-2 hover:bg-beige', cursor === i && 'bg-beige')}>
                            <span className="relative h-16 w-14 shrink-0 overflow-hidden rounded-xl bg-cream"><AssetImage src={primaryImage(p)} alt={p.name} sizes="56px" fit="contain" /></span>
                            <span><span className="block text-xs text-olive-muted">{brands[p.brand].name}</span><span className="text-base font-semibold text-olive-deep">{p.name}</span></span>
                          </Link></li>); })}</ul></section>
                  )}
                  <Link href={`/${locale}/search?q=${encodeURIComponent(q)}`} onClick={() => { pushSearch(query); onClose(); }} className="inline-block text-sm font-semibold text-olive underline">{t.search.viewAll}</Link>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
