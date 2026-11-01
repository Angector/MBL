import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export type ButtonVariant = 'primary' | 'outline' | 'light' | 'terracotta';

const base =
  'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors duration-300 ease-soft min-h-11 disabled:cursor-not-allowed disabled:opacity-50';

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-olive text-ivory hover:bg-olive-deep',
  outline: 'border border-olive/40 text-olive hover:bg-olive hover:text-ivory',
  light: 'bg-ivory text-olive-deep hover:bg-beige',
  terracotta: 'bg-terracotta text-ivory hover:bg-terracotta/90',
};

export function buttonClasses(variant: ButtonVariant = 'primary', className?: string) {
  return cn(base, variants[variant], className);
}

export function ButtonLink({
  href, variant = 'primary', className, children,
}: { href: string; variant?: ButtonVariant; className?: string; children: ReactNode }) {
  return (
    <Link href={href} className={buttonClasses(variant, className)}>
      {children}
    </Link>
  );
}

export function Button({
  variant = 'primary', className, children, type = 'button', ...rest
}: { variant?: ButtonVariant; children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={buttonClasses(variant, className)} {...rest}>
      {children}
    </button>
  );
}
