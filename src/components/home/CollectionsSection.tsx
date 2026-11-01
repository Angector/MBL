import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { Dictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/config';
import type { CollectionId } from '@/types/product';
import { homeAssets } from '@/data/home-assets';
import { cn } from '@/lib/utils/cn';
import { AssetImage } from '@/components/ui/AssetImage';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

const order: CollectionId[] = ['flagship', 'budget', 'photography', 'gaming', 'compact', 'latest'];

export function CollectionsSection({ locale, t }: { locale: Locale; t: Dictionary['collections'] }) {
  return (
    <section className="bg-cream py-16 md:py-24">
      <Container>
        <div className="mx-auto max-w-2xl">
          <Reveal><SectionHeading eyebrow={t.eyebrow} title={t.title} accent={t.accent} text={t.text} /></Reveal>
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5">
          {order.map((id, i) => {
            const asset = homeAssets.collections[id];
            const large = i === 0;
            return (
              <li key={id} className={cn(large && 'col-span-2 md:row-span-2')}>
                <Reveal delay={i * 70} className="h-full">
                  <Link
                    href={`/${locale}/shop?collection=${id}`}
                    className={cn('group relative block overflow-hidden rounded-3xl shadow-soft', large ? 'aspect-[16/11] md:aspect-auto md:h-full md:min-h-[32rem]' : 'aspect-[4/5] md:aspect-[4/4.4]')}
                  >
                    <div className="absolute inset-0 transition-transform duration-[900ms] ease-soft group-hover:scale-105">
                      <AssetImage src={asset.src} alt={asset.alt[locale]} sizes={large ? '(min-width: 768px) 60vw, 100vw' : '(min-width: 768px) 30vw, 50vw'} />
                    </div>
                    <span aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-forest/70 to-transparent" />
                    <span className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 text-ivory">
                      <span className={cn('font-bold', large ? 'text-2xl' : 'text-base md:text-lg')}>{t.items[id]}</span>
                      <ArrowUpRight aria-hidden className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:-translate-y-1 rtl:-scale-x-100" />
                    </span>
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ul>

        <div className="mt-10 flex justify-center">
          <ButtonLink href={`/${locale}/shop`}>{t.cta}</ButtonLink>
        </div>
      </Container>
    </section>
  );
}
