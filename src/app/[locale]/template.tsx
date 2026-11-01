'use client';

import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

/** Soft route entrance. Enter-only on purpose: no exit delay, no blocked navigation. */
export default function Template({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <motion.div initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.22, 0.61, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}
