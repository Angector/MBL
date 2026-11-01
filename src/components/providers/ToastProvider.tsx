'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { CheckCircle2, Info, TriangleAlert, X } from 'lucide-react';
import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';

type Tone = 'success' | 'info' | 'error';
interface ToastItem { id: number; message: string; tone: Tone }
const ToastContext = createContext<((message: string, tone?: Tone) => void) | null>(null);

export function ToastProvider({ children, closeLabel }: { children: ReactNode; closeLabel: string }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(1);
  const reduced = useReducedMotion();

  const dismiss = useCallback((id: number) => setItems((l) => l.filter((t) => t.id !== id)), []);
  const push = useCallback((message: string, tone: Tone = 'success') => {
    const id = nextId.current++;
    setItems((l) => [...l.slice(-2), { id, message, tone }]);
    window.setTimeout(() => dismiss(id), 3800);
  }, [dismiss]);
  const value = useMemo(() => push, [push]);
  const Icon = { success: CheckCircle2, info: Info, error: TriangleAlert };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-20 z-[60] flex flex-col items-center gap-2 px-4 lg:bottom-6" aria-live="polite" role="status">
        <AnimatePresence initial={false}>
          {items.map((t) => {
            const I = Icon[t.tone];
            return (
              <motion.div
                key={t.id} layout={!reduced}
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
                transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
                className="pointer-events-auto flex max-w-md items-center gap-3 rounded-full bg-forest px-5 py-3 text-sm text-ivory shadow-soft"
              >
                <I className={t.tone === 'error' ? 'h-5 w-5 text-terracotta' : 'h-5 w-5 text-ivory/80'} aria-hidden />
                <span>{t.message}</span>
                <button onClick={() => dismiss(t.id)} aria-label={closeLabel} className="rounded-full p-1 hover:bg-ivory/10"><X className="h-4 w-4" /></button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
