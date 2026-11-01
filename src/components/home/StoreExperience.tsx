import { BookOpen, Headphones, Scale, ShieldCheck, Store, Truck, type LucideIcon } from 'lucide-react';
import type { Dictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/config';
import type { ServiceId } from '@/types/site';
import { homeAssets } from '@/data/home-assets';
import { siteConfig } from '@/data/site-config';
import { AssetImage } from '@/components/ui/AssetImage';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

const icons: Record<ServiceId, LucideIcon> = {
  buyingGuide: BookOpen, support: Headphones, warrantyInfo: ShieldCheck, comparison: Scale, storeServices: Store, shipping: Truck,
};

export function StoreExperience({ locale, t }: { locale: Locale; t: Dictionary['experience'] }) {
  const active = (Object.keys(icons) as ServiceId[]).filter((id) => siteConfig.services[id]);

  return (
    <section className="bg-ivory py-16 md:py-24">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] shadow-soft lg:rounded-ss-[7rem]">
              <AssetImage src={homeAssets.experience.src} alt={homeAssets.experience.alt[locale]} sizes="(min-width: 1024px) 45vw, 100vw" />
            </div>
          </Reveal>

          <div className="space-y-8">
            <Reveal><SectionHeading align="start" eyebrow={t.eyebrow} title={t.title} accent={t.accent} text={t.text} /></Reveal>
            {active.length > 0 && (
              <ul className="grid grid-cols-2 gap-4">
                {active.map((id, i) => {
                  const Icon = icons[id];
                  return (
                    <li key={id}>
                      <Reveal delay={i * 70} className="h-full">
                        <div className="flex h-full flex-col items-center gap-3 rounded-3xl border border-line bg-cream p-5 text-center">
                          <Icon aria-hidden className="h-8 w-8 text-olive" strokeWidth={1.2} />
                          <span className="text-sm font-semibold text-olive-deep">{t.items[id]}</span>
                        </div>
                      </Reveal>
                    </li>
                  );
                })}
              </ul>
            )}
            <Reveal className="flex flex-wrap gap-3">
              <ButtonLink href={`/${locale}/contact`}>{t.primary}</ButtonLink>
              <ButtonLink href={`/${locale}/shipping`} variant="outline">{t.secondary}</ButtonLink>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
