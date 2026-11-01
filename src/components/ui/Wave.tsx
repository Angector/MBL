import { cn } from '@/lib/utils/cn';

/** Organic wave divider. Colour comes from the text colour (e.g. `text-cream`). */
export function Wave({ className, flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg aria-hidden viewBox="0 0 1440 90" preserveAspectRatio="none" className={cn('block h-10 w-full md:h-16', flip && 'rotate-180', className)}>
      <path fill="currentColor" d="M0 46C180 96 360 10 600 42s420 66 640 22c80-16 140-26 200-18v44H0Z" />
    </svg>
  );
}
