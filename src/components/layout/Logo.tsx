import Image from 'next/image';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';
import { siteConfig } from '@/data/site-config';

/** Text logo by default. Set `logoSrc` in site-config.ts to switch to an image logo. */
export function Logo({ locale }: { locale: Locale }) {
  const name = siteConfig.name[locale];
  return (
    <Link href={`/${locale}`} aria-label={name} className="inline-flex flex-col items-center leading-none">
      {siteConfig.logoSrc ? (
        <Image src={siteConfig.logoSrc} alt={name} width={160} height={48} priority className="h-10 w-auto" />
      ) : (
        <>
          <span className="text-2xl font-bold tracking-wide text-olive-deep md:text-3xl">{name}</span>
          <span className="mt-1.5 flex items-center gap-2 text-[10px] font-light tracking-[0.2em] text-olive-muted uppercase">
            <span aria-hidden className="h-px w-5 bg-olive-muted/60" />
            {siteConfig.tagline[locale]}
            <span aria-hidden className="h-px w-5 bg-olive-muted/60" />
          </span>
        </>
      )}
    </Link>
  );
}
