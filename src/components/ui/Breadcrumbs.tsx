import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export interface Crumb { label: string; href?: string }

export function Breadcrumbs({ items, label }: { items: Crumb[]; label: string }) {
  return (
    <nav aria-label={label} className="text-sm text-ink/70">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((c, i) => (
          <li key={`${c.label}-${i}`} className="flex items-center gap-1.5">
            {c.href ? <Link href={c.href} className="hover:text-olive hover:underline">{c.label}</Link> : <span aria-current="page" className="font-semibold text-olive-deep">{c.label}</span>}
            {i < items.length - 1 && <ChevronLeft aria-hidden className="h-3.5 w-3.5 ltr:rotate-180 opacity-60" />}
          </li>
        ))}
      </ol>
    </nav>
  );
}
