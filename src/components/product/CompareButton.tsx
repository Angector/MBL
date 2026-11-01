'use client';

import { GitCompareArrows } from 'lucide-react';
import { useToast } from '@/components/providers/ToastProvider';
import { useUserLists } from '@/components/providers/UserListsProvider';
import { cn } from '@/lib/utils/cn';

interface Props { productId: string; labels: { add: string; remove: string; added: string; removed: string; full: string }; className?: string; withText?: boolean }

export function CompareButton({ productId, labels, className, withText }: Props) {
  const { compare, toggleCompare } = useUserLists();
  const toast = useToast();
  const active = compare.includes(productId);
  const label = active ? labels.remove : labels.add;
  return (
    <button
      type="button" aria-pressed={active} aria-label={withText ? undefined : label}
      onClick={() => {
        const r = toggleCompare(productId);
        toast(r === 'full' ? labels.full : r === 'added' ? labels.added : labels.removed, r === 'full' ? 'info' : 'success');
      }}
      className={cn('inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-line bg-ivory px-3 text-sm font-semibold text-olive-deep transition-colors hover:bg-beige', active && 'border-olive bg-olive text-ivory hover:bg-olive-deep', className)}
    >
      <GitCompareArrows aria-hidden className="h-5 w-5" />
      {withText && <span>{label}</span>}
    </button>
  );
}
