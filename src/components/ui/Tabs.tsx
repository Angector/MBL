'use client';

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export function Tabs({ tabs }: { tabs: { id: string; label: string; content: ReactNode }[] }) {
  const [active, setActive] = useState(tabs[0]?.id ?? '');
  const base = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: KeyboardEvent, i: number) => {
    const rtl = getComputedStyle(e.currentTarget).direction === 'rtl';
    const step = e.key === 'ArrowRight' ? (rtl ? -1 : 1) : e.key === 'ArrowLeft' ? (rtl ? 1 : -1) : 0;
    if (!step) return;
    e.preventDefault();
    const next = (i + step + tabs.length) % tabs.length;
    refs.current[next]?.focus();
    const t = tabs[next];
    if (t) setActive(t.id);
  };

  return (
    <div>
      <div role="tablist" className="no-scrollbar flex gap-2 overflow-x-auto border-b border-line">
        {tabs.map((t, i) => (
          <button
            key={t.id} ref={(el) => { refs.current[i] = el; }} role="tab" id={`${base}-t-${t.id}`} aria-selected={active === t.id} aria-controls={`${base}-p-${t.id}`}
            tabIndex={active === t.id ? 0 : -1} onKeyDown={(e) => onKey(e, i)} onClick={() => setActive(t.id)}
            className={cn('relative whitespace-nowrap px-5 py-3 text-sm font-semibold transition-colors', active === t.id ? 'text-olive-deep after:absolute after:inset-x-3 after:-bottom-px after:h-0.5 after:bg-terracotta' : 'text-ink/70 hover:text-olive')}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t) => (
        <div key={t.id} role="tabpanel" id={`${base}-p-${t.id}`} aria-labelledby={`${base}-t-${t.id}`} hidden={active !== t.id} tabIndex={0} className="py-6">
          {active === t.id && t.content}
        </div>
      ))}
    </div>
  );
}
