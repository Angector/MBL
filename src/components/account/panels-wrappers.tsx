'use client';

import type { Dictionary } from '@/lib/i18n';
import { DemoForm } from './AccountPanels';

export function ProfileForm({ t }: { t: Dictionary }) {
  return <DemoForm t={t} fields={[{ key: 'name', label: t.auth.name }, { key: 'email', label: t.auth.email, type: 'email', ltr: true }]} />;
}
export function AddressForm({ t }: { t: Dictionary }) {
  return <DemoForm t={t} fields={[{ key: 'city', label: t.checkout.city }, { key: 'line', label: t.checkout.line }, { key: 'postal', label: t.checkout.postal, ltr: true }]} />;
}
