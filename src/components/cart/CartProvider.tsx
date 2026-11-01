'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { findVariant } from '@/lib/catalog';
import { useStoredState } from '@/lib/utils/useStoredState';

export interface CartLine { productId: string; variantId: string; qty: number }
const MAX_QTY = 10;

function parseLines(raw: unknown): CartLine[] | null {
  if (!Array.isArray(raw)) return null;
  return raw.filter((l): l is CartLine =>
    typeof l?.productId === 'string' && typeof l?.variantId === 'string' && Number.isInteger(l?.qty) && l.qty > 0 && !!findVariant(l.productId, l.variantId),
  );
}

interface Ctx {
  lines: CartLine[];
  count: number;
  isOpen: boolean;
  hydrated: boolean;
  add: (productId: string, variantId: string, qty?: number) => void;
  setQty: (productId: string, variantId: string, qty: number) => void;
  remove: (productId: string, variantId: string) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  hasProduct: (productId: string) => boolean;
}

const CartContext = createContext<Ctx | null>(null);
const same = (a: CartLine, p: string, v: string) => a.productId === p && a.variantId === v;

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines, hydrated] = useStoredState<CartLine[]>('cart:v2', [], parseLines);
  const [isOpen, setOpen] = useState(false);

  const add = useCallback((p: string, v: string, qty = 1) => {
    setLines((l) => l.some((x) => same(x, p, v))
      ? l.map((x) => (same(x, p, v) ? { ...x, qty: Math.min(MAX_QTY, x.qty + qty) } : x))
      : [...l, { productId: p, variantId: v, qty: Math.min(MAX_QTY, qty) }]);
  }, [setLines]);
  const setQty = useCallback((p: string, v: string, qty: number) =>
    setLines((l) => (qty <= 0 ? l.filter((x) => !same(x, p, v)) : l.map((x) => (same(x, p, v) ? { ...x, qty: Math.min(MAX_QTY, qty) } : x)))), [setLines]);
  const remove = useCallback((p: string, v: string) => setLines((l) => l.filter((x) => !same(x, p, v))), [setLines]);
  const clear = useCallback(() => setLines(() => []), [setLines]);

  const value = useMemo<Ctx>(() => ({
    lines, hydrated, isOpen,
    count: lines.reduce((n, l) => n + l.qty, 0),
    add, setQty, remove, clear,
    open: () => setOpen(true), close: () => setOpen(false),
    hasProduct: (id) => lines.some((l) => l.productId === id),
  }), [lines, hydrated, isOpen, add, setQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): Ctx {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
