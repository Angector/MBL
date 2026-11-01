import { en } from './en';
import { enX } from './en-extra';
import { fa } from './fa';
import { faX } from './fa-extra';

import type { Dictionary as BaseDictionary } from './fa';
import type { ExtraDictionary } from './fa-extra';
import type { Locale } from './config';
import type { L10n } from '@/types/site';

export type Dictionary = BaseDictionary & ExtraDictionary;

function mergeDictionary(
  base: BaseDictionary,
  extra: ExtraDictionary
): Dictionary {
  return {
    ...base,
    ...extra,

    // Preserve both base and extended search translations.
    search: {
      ...base.search,
      ...extra.search,
    },
  };
}

const dictionaries: Record<Locale, Dictionary> = {
  fa: mergeDictionary(fa, faX),
  en: mergeDictionary(en, enX),
};

export const getDictionary = (locale: Locale): Dictionary =>
  dictionaries[locale];

export const t10 = (value: L10n, locale: Locale): string =>
  value[locale];

/** Replaces {key} placeholders. */
export const fmt = (
  template: string,
  values: Record<string, string | number>
): string =>
  template.replace(
    /\{(\w+)\}/g,
    (_, k: string) => String(values[k] ?? '')
  );