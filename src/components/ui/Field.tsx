'use client';

import { useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface Props extends InputHTMLAttributes<HTMLInputElement> { label: string; error?: string; hint?: ReactNode; ltr?: boolean }

/** Labelled input with error text wired through aria-describedby. */
export function Field({ label, error, hint, ltr, className, ...rest }: Props) {
  const id = useId();
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold text-olive-deep">{label}</label>
      <input
        id={id} dir={ltr ? 'ltr' : undefined} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined}
        className={cn('min-h-12 w-full rounded-2xl border bg-ivory px-4 text-base outline-none transition-colors placeholder:text-subtle focus:border-olive', error ? 'border-terracotta' : 'border-line', ltr && 'text-start', className)}
        {...rest}
      />
      {hint && !error && <p className="text-xs text-ink/70">{hint}</p>}
      {error && <p id={`${id}-err`} className="text-xs font-semibold text-terracotta">{error}</p>}
    </div>
  );
}
