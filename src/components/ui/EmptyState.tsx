import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export function EmptyState({ icon: Icon, title, text, action }: { icon: LucideIcon; title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-[2rem] border border-dashed border-olive/30 bg-ivory px-8 py-14 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-beige"><Icon aria-hidden className="h-9 w-9 text-olive-muted" strokeWidth={1.2} /></span>
      <h2 className="text-xl font-bold text-olive-deep">{title}</h2>
      {text && <p className="text-sm font-light text-ink/80">{text}</p>}
      {action}
    </div>
  );
}
