import type { ReactNode } from 'react';
import { Breadcrumbs, type Crumb } from './Breadcrumbs';
import { Container } from './Container';
import { SectionHeading } from './SectionHeading';

/** Consistent page layout: breadcrumbs, heading, content. */
export function PageShell({ crumbs, crumbLabel, title, subtitle, children, narrow }: { crumbs?: Crumb[]; crumbLabel: string; title: string; subtitle?: string; children: ReactNode; narrow?: boolean }) {
  return (
    <section className="py-10 md:py-16">
      <Container>
        {crumbs && <div className="mb-8"><Breadcrumbs items={crumbs} label={crumbLabel} /></div>}
        <SectionHeading as="h1" title={title} text={subtitle} />
        <div className={narrow ? 'mx-auto mt-10 max-w-3xl' : 'mt-10'}>{children}</div>
      </Container>
    </section>
  );
}
