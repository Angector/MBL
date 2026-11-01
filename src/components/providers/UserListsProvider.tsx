'use client';

import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import { parseStringArray, useStoredState } from '@/lib/utils/useStoredState';

export const MAX_COMPARE = 3;
const MAX_RECENT = 8;
const MAX_SEARCHES = 6;

interface Ctx {
  wishlist: string[];
  compare: string[];
  recent: string[];
  searches: string[];
  hydrated: boolean;
  /** returns true when the product was added */
  toggleWishlist: (id: string) => boolean;
  toggleCompare: (id: string) => 'added' | 'removed' | 'full';
  clearCompare: () => void;
  pushRecent: (id: string) => void;
  pushSearch: (q: string) => void;
  clearSearches: () => void;
}

const UserListsContext = createContext<Ctx | null>(null);

/** Wishlist, comparison, recently viewed and recent searches (non-sensitive, local only). */
export function UserListsProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist, h1] = useStoredState<string[]>('wishlist:v1', [], parseStringArray);
  const [compare, setCompare, h2] = useStoredState<string[]>('compare:v1', [], parseStringArray);
  const [recent, setRecent, h3] = useStoredState<string[]>('recent:v1', [], parseStringArray);
  const [searches, setSearches, h4] = useStoredState<string[]>('searches:v1', [], parseStringArray);

  const toggleWishlist = useCallback((id: string) => {
    const adding = !wishlist.includes(id);
    setWishlist((l) => (l.includes(id) ? l.filter((x) => x !== id) : [...l, id]));
    return adding;
  }, [wishlist, setWishlist]);

  const toggleCompare = useCallback((id: string): 'added' | 'removed' | 'full' => {
    if (compare.includes(id)) { setCompare((l) => l.filter((x) => x !== id)); return 'removed'; }
    if (compare.length >= MAX_COMPARE) return 'full';
    setCompare((l) => [...l, id]);
    return 'added';
  }, [compare, setCompare]);

  const clearCompare = useCallback(() => setCompare(() => []), [setCompare]);
  const pushRecent = useCallback((id: string) => setRecent((l) => (l[0] === id ? l : [id, ...l.filter((x) => x !== id)].slice(0, MAX_RECENT))), [setRecent]);
  const pushSearch = useCallback((q: string) => {
    const v = q.trim();
    if (v.length < 2) return;
    setSearches((l) => [v, ...l.filter((x) => x.toLowerCase() !== v.toLowerCase())].slice(0, MAX_SEARCHES));
  }, [setSearches]);
  const clearSearches = useCallback(() => setSearches(() => []), [setSearches]);

  const value = useMemo<Ctx>(() => ({
    wishlist, compare, recent, searches, hydrated: h1 && h2 && h3 && h4,
    toggleWishlist, toggleCompare, clearCompare, pushRecent, pushSearch, clearSearches,
  }), [wishlist, compare, recent, searches, h1, h2, h3, h4, toggleWishlist, toggleCompare, clearCompare, pushRecent, pushSearch, clearSearches]);

  return <UserListsContext.Provider value={value}>{children}</UserListsContext.Provider>;
}

export function useUserLists(): Ctx {
  const ctx = useContext(UserListsContext);
  if (!ctx) throw new Error('useUserLists must be used inside <UserListsProvider>');
  return ctx;
}
