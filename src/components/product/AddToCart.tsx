'use client';

import { Check, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/components/cart/CartProvider';

export function AddToCart({ productId, disabled, label, addedLabel }: { productId: string; disabled?: boolean; label: string; addedLabel: string }) {
  const { add, has } = useCart();
  const inCart = has(productId);
  return (
    <Button onClick={() => add(productId)} disabled={disabled} variant={inCart ? 'terracotta' : 'primary'}>
      {inCart ? <Check className="h-4 w-4" aria-hidden /> : <ShoppingBag className="h-4 w-4" aria-hidden />}
      {inCart ? addedLabel : label}
    </Button>
  );
}
