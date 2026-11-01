'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { getProductById, primaryImage } from '@/lib/catalog';
import { fmt, type Dictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/config';
import { formatNumber } from '@/lib/format/number';
import { AssetImage } from '@/components/ui/AssetImage';
import { buttonClasses } from '@/components/ui/Button';
import { useUserLists } from '@/components/providers/UserListsProvider';

/** Floating comparison drawer: appears as soon as one phone is selected. */
export function CompareTray({ locale, t }: { locale: Locale; t: Dictionary }) {
  const { compare, toggleCompare, clearCompare } = useUserLists();
  const items = compare.flatMap((id) => { const p = getProductById(id); return p ? [p] : []; });
  return (
    <AnimatePresence>
      {items.length > 0 && (
        <motion.aside
          aria-label={t.compare.trayTitle}
          initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }} transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
          className="fixed inset-x-3 bottom-20 z-30 mx-auto flex max-w-xl items-center gap-3 rounded-3xl border border-line bg-ivory p-3 shadow-soft lg:bottom-5"
        >
          <ul className="flex flex-1 items-center gap-2">
            {items.map((p) => (
              <li key={p.id} className="relative">
                <span className="relative block h-14 w-12 overflow-hidden rounded-xl bg-cream"><AssetImage src={primaryImage(p)} alt={p.name} sizes="48px" fit="contain" /></span>
                <button onClick={() => toggleCompare(p.id)} aria-label={`${t.compare.remove}: ${p.name}`} className="absolute -end-1.5 -top-1.5 rounded-full bg-olive p-0.5 text-ivory"><X className="h-3 w-3" /></button>
              </li>
            ))}
            <li className="ms-1 text-xs text-ink/70">{fmt(t.compare.count, { n: formatNumber(items.length, locale) })}</li>
          </ul>
          <button onClick={clearCompare} className="hidden text-xs text-terracotta hover:underline sm:block">{t.compare.clear}</button>
          <Link href={`/${locale}/compare`} className={buttonClasses('primary', 'px-5')}>{t.compare.open}</Link>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
