import Link from 'next/link';
import type { Dictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/config';
import { siteConfig } from '@/data/site-config';
import { brandIds } from '@/lib/catalog';
import { Container } from '@/components/ui/Container';
import { Wave } from '@/components/ui/Wave';
import { Logo } from './Logo';
import { FooterColumn } from './FooterColumn';
import { NewsletterForm } from './NewsletterForm';

const brandNames = { samsung: 'Samsung', xiaomi: 'Xiaomi', google: 'Google Pixel', apple: 'Apple' } as const;

export function Footer({ locale, t }: { locale: Locale; t: Dictionary['footer'] }) {
  const base = `/${locale}`;
  const linkClass = 'text-sm font-light text-ink/80 transition-colors hover:text-olive';
  const service = ['contact', 'faq', 'shipping', 'returns', 'warranty'] as const;
  const { contact } = siteConfig;

  return (
    <footer className="mt-auto">
      <Wave className="-mb-px text-beige" />
      <div className="bg-beige pt-12">
        <Container>
          <div className="grid gap-x-10 md:grid-cols-[1.3fr_1fr_1fr_1.4fr]">
            <div className="space-y-5 pb-8 md:pb-0">
              <div className="flex"><Logo locale={locale} /></div>
              <p className="max-w-xs text-sm font-light text-ink/80">{t.intro}</p>
              {(contact.email || contact.phone) && (
                <ul className="space-y-1 text-sm text-ink/80">
                  {contact.email && <li dir="ltr" className="text-start"><a href={`mailto:${contact.email}`} className="hover:text-olive">{contact.email}</a></li>}
                  {contact.phone && <li dir="ltr" className="text-start"><a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="hover:text-olive">{contact.phone}</a></li>}
                </ul>
              )}
              {siteConfig.social.length > 0 && (
                <ul className="flex flex-wrap gap-3">
                  {siteConfig.social.map((s) => (
                    <li key={s.href}><a href={s.href} rel="noopener noreferrer" target="_blank" className="rounded-full border border-olive/30 px-4 py-1.5 text-xs font-semibold text-olive hover:bg-olive hover:text-ivory">{s.label}</a></li>
                  ))}
                </ul>
              )}
            </div>

            <FooterColumn title={t.shop}>
              <ul className="space-y-3">
                <li><Link className={linkClass} href={`${base}/shop`}>{t.allProducts}</Link></li>
                {brandIds.map((b) => (
                  <li key={b}><Link className={linkClass} href={`${base}/brand/${b}`}>{brandNames[b]}</Link></li>
                ))}
              </ul>
            </FooterColumn>

            <FooterColumn title={t.service}>
              <ul className="space-y-3">
                {service.map((s) => <li key={s}><Link className={linkClass} href={`${base}/${s}`}>{t.links[s]}</Link></li>)}
              </ul>
            </FooterColumn>

            <FooterColumn title={t.newsletterTitle}>
              <p className="mb-4 text-sm font-light text-ink/80">{t.newsletterText}</p>
              <NewsletterForm t={t} endpoint={siteConfig.newsletterEndpoint} />
            </FooterColumn>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-line py-6 text-xs text-ink/70 md:flex-row">
            <p>© {new Date().getFullYear()} {siteConfig.name[locale]}. {t.rights}</p>
            <ul className="flex gap-6">
              <li><Link href={`${base}/privacy`} className="hover:text-olive">{t.privacy}</Link></li>
              <li><Link href={`${base}/terms`} className="hover:text-olive">{t.terms}</Link></li>
            </ul>
          </div>
        </Container>
      </div>
    </footer>
  );
}
