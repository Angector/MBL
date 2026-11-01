'use client';

import { Check, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/components/cart/CartProvider';

interface AddToCartProps {
  productId: string;
  variantId: string;
  qty?: number;
  disabled?: boolean;
  label: string;
  addedLabel: string;
}

export function AddToCart({
  productId,
  variantId,
  qty = 1,
  disabled,
  label,
  addedLabel,
}: AddToCartProps) {
  const { add, lines } = useCart();

  const inCart = lines.some(
    (line) =>
      line.productId === productId &&
      line.variantId === variantId
  );

  return (
    <Button
      onClick={() => add(productId, variantId, qty)}
      disabled={disabled}
      variant={inCart ? 'terracotta' : 'primary'}
    >
      {inCart ? (
        <Check className="h-4 w-4" aria-hidden />
      ) : (
        <ShoppingBag className="h-4 w-4" aria-hidden />
      )}

      {inCart ? addedLabel : label}
    </Button>
  );
}
