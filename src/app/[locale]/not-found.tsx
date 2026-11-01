import Link from 'next/link';
import { Container } from '@/components/ui/Container';

// Locale is not available here, so both languages are shown.
export default function NotFound() {
  return (
    <section className="py-24">
      <Container><div className="mx-auto max-w-xl space-y-4 text-center">
        <h1 className="text-4xl font-bold text-olive-deep">404</h1>
        <p>صفحه پیدا نشد · Page not found</p>
        <Link href="/fa" className="text-olive underline">فارسی</Link>{' · '}
        <Link href="/en" className="text-olive underline">English</Link>
      </div></Container>
    </section>
  );
}
