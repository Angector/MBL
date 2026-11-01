import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { Dictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/config';
import { homeAssets } from '@/data/home-assets';
import { brandIds } from '@/lib/catalog';
import { AssetImage } from '@/components/ui/AssetImage';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

export function BrandCategories({ locale, t }: { locale: Locale; t: Dictionary['brands'] }) {
  return (
    <section id="brands" className="scroll-mt-24 bg-cream py-16 md:py-24">
      <Container>
        <Reveal><SectionHeading title={t.title} text={t.text} /></Reveal>
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {brandIds.map((id, i) => {
            const item = t.items[id];
            const asset = homeAssets.brands[id];
            return (
              <li key={id}>
                <Reveal delay={i * 90} className="h-full">
                  <Link href={`/${locale}/brand/${id}`} className="group flex h-full flex-col overflow-hidden rounded-3xl bg-ivory shadow-soft transition-shadow duration-500 hover:shadow-[0_24px_44px_-20px_rgb(52_61_44/0.4)]">
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <div className="absolute inset-0 transition-transform duration-[900ms] ease-soft group-hover:scale-105">
                        <AssetImage src={asset.src} alt={asset.alt[locale]} sizes="(min-width: 1024px) 24vw, (min-width: 640px) 45vw, 100vw" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-4 p-5">
                      <div>
                        <h3 className="text-xl font-bold text-olive-deep">{item.name}</h3>
                        <p className="mt-1 text-sm font-light text-ink/75">{item.description}</p>
                        <span className="sr-only">{t.cta}</span>
                      </div>
                      <ArrowUpRight aria-hidden className="h-6 w-6 shrink-0 text-olive transition-transform duration-300 group-hover:-translate-y-1 ltr:group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
                    </div>
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
