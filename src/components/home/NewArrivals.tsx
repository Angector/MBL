import type { Dictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/config';
import { getNewProducts } from '@/lib/catalog';
import { ProductCard } from '@/components/product/ProductCard';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';

/** Renders only when real products are flagged `isNew`. */
export function NewArrivals({ locale, t }: { locale: Locale; t: Dictionary }) {
  const items = getNewProducts().slice(0, 4);
  if (items.length === 0) return null;
  return (
    <section className="py-16 md:py-24"><Container>
      <SectionHeading title={t.home2.newTitle} text={t.home2.newText} />
      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{items.map((p) => <li key={p.id}><ProductCard product={p} locale={locale} t={t} /></li>)}</ul>
    </Container></section>
  );
}
