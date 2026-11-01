'use client';

import Link from 'next/link';
import { Heart, MapPin, Package } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import type { Dictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/config';
import { formatNumber } from '@/lib/format/number';
import { buttonClasses, Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Field } from '@/components/ui/Field';
import { useCart } from '@/components/cart/CartProvider';
import { useUserLists } from '@/components/providers/UserListsProvider';
import { useToast } from '@/components/providers/ToastProvider';

export function AccountOverview({ locale, t }: { locale: Locale; t: Dictionary }) {
  const { count } = useCart();
  const { wishlist, compare } = useUserLists();
  const stats = [[t.account.wishlistCount, wishlist.length], [t.account.cartCount, count], [t.account.compareCount, compare.length]] as const;
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-olive-deep">{t.account.welcome}</h2>
      <ul className="grid gap-4 sm:grid-cols-3">{stats.map(([label, n]) => <li key={label} className="rounded-3xl border border-line bg-ivory p-6"><p className="text-3xl font-bold text-olive-deep">{formatNumber(n, locale)}</p><p className="text-sm text-ink/75">{label}</p></li>)}</ul>
      <div className="flex flex-wrap gap-3"><Link href={`/${locale}/signin`} className={buttonClasses('primary')}>{t.auth.signin}</Link><Link href={`/${locale}/signup`} className={buttonClasses('outline')}>{t.auth.signup}</Link></div>
    </div>
  );
}

export function DemoForm({ t, fields }: { t: Dictionary; fields: { key: string; label: string; type?: string; ltr?: boolean }[] }) {
  const toast = useToast();
  const [values, setValues] = useState<Record<string, string>>({});
  const submit = (e: FormEvent) => { e.preventDefault(); toast(t.account.demoSaved, 'info'); };
  return (
    <form onSubmit={submit} className="max-w-xl space-y-4 rounded-3xl border border-line bg-ivory p-6">
      {fields.map((f) => <Field key={f.key} label={f.label} type={f.type} ltr={f.ltr} value={values[f.key] ?? ''} onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))} />)}
      <Button type="submit">{t.account.saveDemo}</Button>
    </form>
  );
}

export function AccountEmpty({ kind, t }: { kind: 'orders' | 'addresses'; t: Dictionary }) {
  return <EmptyState icon={kind === 'orders' ? Package : MapPin} title={kind === 'orders' ? t.account.ordersEmpty : t.account.addressesEmpty} />;
}

export function SavedPanel({ locale, t }: { locale: Locale; t: Dictionary }) {
  return <EmptyState icon={Heart} title={t.account.saved} text={t.account.savedText} action={<Link href={`/${locale}/wishlist`} className={buttonClasses('primary')}>{t.account.goWishlist}</Link>} />;
}
