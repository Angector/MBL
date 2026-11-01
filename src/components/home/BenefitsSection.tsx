import { GitCompareArrows, Heart, Search, type LucideIcon } from 'lucide-react';
import type { Dictionary } from '@/lib/i18n';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

const icons: LucideIcon[] = [GitCompareArrows, Heart, Search];

export function BenefitsSection({ t }: { t: Dictionary }) {
  return (
    <section className="bg-ivory py-16 md:py-24">
      <Container>
        <Reveal><SectionHeading eyebrow={t.home2.benefitsEyebrow} title={t.home2.benefitsTitle} accent={t.home2.benefitsAccent} /></Reveal>
        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {t.home2.benefits.map((b, i) => {
            const Icon = icons[i] ?? Search;
            return (
              <li key={b.title}><Reveal delay={i * 90} className="h-full">
                <div className="flex h-full flex-col items-center gap-4 rounded-3xl border border-line bg-cream p-8 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-olive text-ivory"><Icon aria-hidden className="h-6 w-6" strokeWidth={1.4} /></span>
                  <h3 className="text-lg font-bold text-olive-deep">{b.title}</h3>
                  <p className="text-sm font-light text-ink/80">{b.text}</p>
                </div>
              </Reveal></li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
