'use client';

import Image from 'next/image';
import { Smartphone } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils/cn';

interface Props {
  src: string;
  alt: string;
  sizes: string;
  fit?: 'cover' | 'contain';
  priority?: boolean;
  className?: string;
}

/**
 * Fills its (relative, aspect-ratio'd) parent. If the file is not uploaded yet
 * it shows a calm placeholder instead of a broken image.
 */
export function AssetImage({ src, alt, sizes, fit = 'cover', priority, className }: Props) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setFailed(false);
    const el = ref.current;
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  }, [src]);

  if (failed) {
    return (
      <div role="img" aria-label={alt} className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-beige to-cream">
        <Smartphone aria-hidden className="h-1/4 w-1/4 max-h-16 max-w-16 text-olive-muted/50" strokeWidth={1} />
      </div>
    );
  }

  return (
    <Image
      ref={ref}
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      onError={() => setFailed(true)}
      className={cn(fit === 'cover' ? 'object-cover' : 'object-contain', className)}
    />
  );
}
