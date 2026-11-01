import { ArrowUpRight } from 'lucide-react';
import type { Dictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/config';
import { homeAssets } from '@/data/home-assets';
import { AssetImage } from '@/components/ui/AssetImage';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';

export function HeroSection({ locale, t }: { locale: Locale; t: Dictionary['hero'] }) {
  const base = `/${locale}`;
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-ivory to-cream pb-16 pt-10 md:pb-24 md:pt-16">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.4fr_1fr]">
          <Reveal className="hidden lg:block">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] shadow-soft">
              <AssetImage src={homeAssets.heroLeft.src} alt={homeAssets.heroLeft.alt[locale]} sizes="(min-width: 1024px) 28vw, 0px" priority />
            </div>
          </Reveal>

          <Reveal className="flex flex-col items-center text-center">
            <p className="mb-6 flex items-center gap-3 text-xs font-semibold tracking-[0.18em] text-olive-muted uppercase">
              <span aria-hidden className="h-px w-8 bg-current opacity-50" />
              {t.eyebrow}
              <span aria-hidden className="h-px w-8 bg-current opacity-50" />
            </p>
            <h1 className="text-balance text-5xl font-extrabold text-olive-deep md:text-6xl xl:text-7xl">
              {t.titleA} <span className="accent block">{t.titleB}</span>
            </h1>
            <p className="mt-6 max-w-md text-pretty text-base font-light text-ink/80 md:text-lg">{t.text}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <ButtonLink href={`${base}/shop`}>{t.primary}<ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden /></ButtonLink>
              <ButtonLink href={`${base}#brands`} variant="outline">{t.secondary}</ButtonLink>
            </div>
          </Reveal>

          <Reveal className="hidden lg:block" delay={120}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] shadow-soft">
              <AssetImage src={homeAssets.heroRight.src} alt={homeAssets.heroRight.alt[locale]} sizes="(min-width: 1024px) 28vw, 0px" priority />
            </div>
          </Reveal>
        </div>

        {/* mobile / tablet: both images side by side under the text */}
        <div className="mt-12 grid grid-cols-2 gap-4 lg:hidden">
          {[homeAssets.heroLeft, homeAssets.heroRight].map((img, i) => (
            <Reveal key={img.src} delay={i * 100}>
              <div className="relative aspect-[3/4] overflow-hidden rounded-3xl shadow-soft">
                <AssetImage src={img.src} alt={img.alt[locale]} sizes="(max-width: 1024px) 45vw, 0px" />
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
