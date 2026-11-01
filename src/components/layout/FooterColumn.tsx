'use client';

import { ChevronDown } from 'lucide-react';
import { useId, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

/** Accordion on mobile, static column from md up. */
export function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className="border-b border-line md:border-0">
      <h3 className="text-xs font-bold tracking-[0.16em] text-olive-deep uppercase">
        <button
          type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between py-4 md:pointer-events-none md:py-0 md:pb-5"
        >
          {title}
          <ChevronDown aria-hidden className={cn('h-4 w-4 transition-transform duration-300 md:hidden', open && 'rotate-180')} />
        </button>
      </h3>
      <div id={id} className={cn('pb-5 md:block md:pb-0', open ? 'block' : 'hidden')}>{children}</div>
    </div>
  );
}
