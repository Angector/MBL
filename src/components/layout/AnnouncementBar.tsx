import type { Locale } from '@/lib/i18n/config';
import { siteConfig } from '@/data/site-config';
import { Container } from '@/components/ui/Container';

export function AnnouncementBar({ locale }: { locale: Locale }) {
  const { enabled, messages } = siteConfig.announcement;
  if (!enabled || messages.length === 0) return null;
  return (
    <div className="bg-terracotta py-2 text-ivory">
      <Container className="flex flex-wrap items-center justify-center gap-x-8 gap-y-1 text-center text-xs font-light md:text-sm">
        {messages.map((m) => (
          <p key={m.en}>{m[locale]}</p>
        ))}
      </Container>
    </div>
  );
}
