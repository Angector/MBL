import { siteConfig } from '@/data/site-config';
import type { Dictionary } from '@/lib/i18n';
import { NewsletterForm } from '@/components/layout/NewsletterForm';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';

export function NewsletterSection({ t }: { t: Dictionary }) {
  return (
    <section className="bg-cream py-16 md:py-20">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-2xl rounded-[2.5rem] bg-olive px-6 py-12 text-center text-ivory shadow-soft md:px-12">
            <h2 className="text-balance text-3xl font-bold md:text-4xl">{t.home2.newsletterTitle}</h2>
            <p className="mx-auto mt-3 max-w-md text-sm font-light text-ivory/85">{t.home2.newsletterText}</p>
            <div className="mx-auto mt-6 max-w-md text-start text-ink"><NewsletterForm t={t.footer} endpoint={siteConfig.newsletterEndpoint} /></div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
