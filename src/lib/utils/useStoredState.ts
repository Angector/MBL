'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * localStorage-backed state that is safe for SSR (hydrates after mount) and
 * tolerates blocked/full storage. Only non-sensitive data belongs here.
 */
export function useStoredState<T>(key: string, initial: T, parse: (raw: unknown) => T | null) {
  const [value, setValue] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);
  const parseRef = useRef(parse);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        const parsed = parseRef.current(JSON.parse(raw));
        if (parsed !== null) setValue(parsed);
      }
    } catch { /* ignore */ }
    setHydrated(true);
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    try { window.localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
  }, [key, value, hydrated]);

  const update = useCallback((fn: (prev: T) => T) => setValue(fn), []);
  return [value, update, hydrated] as const;
}

export const parseStringArray = (raw: unknown): string[] | null =>
  Array.isArray(raw) && raw.every((v) => typeof v === 'string') ? (raw as string[]) : null;
