import { ArrowUpRight, Compass, Eye, LifeBuoy } from 'lucide-react';
import type { Dictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/config';
import { homeAssets } from '@/data/home-assets';
import { AssetImage } from '@/components/ui/AssetImage';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

const icons = [Compass, Eye, LifeBuoy];

export function BrandStory({ locale, t }: { locale: Locale; t: Dictionary['story'] }) {
  return (
    <section className="bg-ivory py-16 md:py-24">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal className="space-y-8">
            <SectionHeading align="start" as="h2" eyebrow={t.eyebrow} title={t.title} accent={t.accent} text={t.text} />
            <ButtonLink href={`/${locale}/shop`}>{t.cta}<ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden /></ButtonLink>
          </Reveal>
          <Reveal delay={100}>
            <div className="relative aspect-[5/4] overflow-hidden rounded-[2.5rem] shadow-soft lg:rounded-es-[6rem]">
              <AssetImage src={homeAssets.story.main.src} alt={homeAssets.story.main.alt[locale]} sizes="(min-width: 1024px) 55vw, 100vw" />
            </div>
          </Reveal>
        </div>

        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {t.cards.map((card, i) => {
            const Icon = icons[i] ?? Compass;
            const asset = homeAssets.story.cards[i];
            return (
              <li key={card.title}>
                <Reveal delay={i * 90} className="h-full">
                  <article className="h-full overflow-hidden rounded-3xl border border-line bg-cream shadow-soft">
                    <div className="relative aspect-[16/9]">
                      {asset && <AssetImage src={asset.src} alt={asset.alt[locale]} sizes="(min-width: 768px) 33vw, 100vw" />}
                    </div>
                    <div className="relative p-6 pt-8">
                      <span className="absolute -top-6 start-6 flex h-12 w-12 items-center justify-center rounded-full bg-olive text-ivory shadow-soft"><Icon className="h-5 w-5" aria-hidden /></span>
                      <h3 className="text-lg font-bold text-olive-deep">{card.title}</h3>
                      <p className="mt-2 text-sm font-light text-ink/80">{card.text}</p>
                    </div>
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
