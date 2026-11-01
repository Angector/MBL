'use client';

import { motion, useReducedMotion } from 'motion/react';
import { Heart } from 'lucide-react';
import { useToast } from '@/components/providers/ToastProvider';
import { useUserLists } from '@/components/providers/UserListsProvider';
import { cn } from '@/lib/utils/cn';

interface Props { productId: string; labels: { add: string; remove: string; added: string; removed: string }; className?: string; withText?: boolean }

export function WishlistButton({ productId, labels, className, withText }: Props) {
  const { wishlist, toggleWishlist } = useUserLists();
  const toast = useToast();
  const reduced = useReducedMotion();
  const active = wishlist.includes(productId);
  const label = active ? labels.remove : labels.add;

  return (
    <button
      type="button" aria-pressed={active} aria-label={withText ? undefined : label}
      onClick={() => { const added = toggleWishlist(productId); toast(added ? labels.added : labels.removed, 'success'); }}
      className={cn('inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-line bg-ivory px-3 text-sm font-semibold text-olive-deep transition-colors hover:bg-beige', active && 'border-terracotta/40 text-terracotta', className)}
    >
      <motion.span key={String(active)} initial={reduced ? false : { scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 420, damping: 16 }} className="flex">
        <Heart aria-hidden className={cn('h-5 w-5', active && 'fill-terracotta')} />
      </motion.span>
      {withText && <span>{label}</span>}
    </button>
  );
}
