'use client';

import { ChevronDown } from 'lucide-react';
import { useId, useState } from 'react';
import { cn } from '@/lib/utils/cn';

export function Accordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();
  return (
    <ul className="divide-y divide-line rounded-3xl border border-line bg-ivory">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <li key={item.q}>
            <h3>
              <button
                type="button" aria-expanded={isOpen} aria-controls={`${base}-${i}`} onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-start text-base font-semibold text-olive-deep"
              >
                {item.q}
                <ChevronDown aria-hidden className={cn('h-5 w-5 shrink-0 transition-transform duration-300', isOpen && 'rotate-180')} />
              </button>
            </h3>
            <div id={`${base}-${i}`} role="region" className={cn('grid transition-[grid-template-rows] duration-300 ease-soft', isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
              <p className="min-h-0 overflow-hidden px-6 text-sm font-light text-ink/80"><span className="block pb-5">{item.a}</span></p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
