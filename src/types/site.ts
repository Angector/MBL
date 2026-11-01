export type L10n = { fa: string; en: string };

export type ServiceId =
  | 'buyingGuide'
  | 'support'
  | 'warrantyInfo'
  | 'comparison'
  | 'storeServices'
  | 'shipping';

export interface SiteConfig {
  name: L10n;
  tagline: L10n;
  description: L10n;
  url: string;
  /** null => text logo. Put your real logo path here, e.g. '/images/logo.svg' */
  logoSrc: string | null;
  market: { country: string; currency: string };
  announcement: { enabled: boolean; messages: L10n[] };
  contact: { email?: string; phone?: string; address?: L10n };
  social: { label: string; href: string }[];
  /** Only services set to true are shown on the site. */
  services: Record<ServiceId, boolean>;
  newsletterEndpoint?: string;
}

export interface ImageAsset {
  src: string;
  alt: L10n;
}
