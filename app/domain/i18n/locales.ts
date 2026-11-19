import type { CountryCode } from '../cv/types'

/**
 * The languages of the site. Pure data, shared by the app, the build module and the server routes.
 * English lives at "/", the others under their code ("/it", "/de").
 */
export const LOCALES = ['en', 'it', 'de'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'en'

export interface LocaleInfo {
  code: Locale
  /** Name of the language in that language (shown in the switcher). */
  name: string
  /** Value of <html lang> and hreflang. */
  htmlLang: string
  /** Open Graph locale. */
  ogLocale: string
  /** Flag shown in the switcher. */
  flag: CountryCode
}

export const LOCALE_INFO: Record<Locale, LocaleInfo> = {
  en: { code: 'en', name: 'English', htmlLang: 'en', ogLocale: 'en_US', flag: 'GB' },
  it: { code: 'it', name: 'Italiano', htmlLang: 'it', ogLocale: 'it_IT', flag: 'IT' },
  de: { code: 'de', name: 'Deutsch', htmlLang: 'de', ogLocale: 'de_DE', flag: 'DE' },
}

export const isLocale = (value: unknown): value is Locale => (LOCALES as readonly unknown[]).includes(value)

/** '/' for English, '/it' and '/de' for the others. */
export const localePath = (locale: Locale): string => (locale === DEFAULT_LOCALE ? '/' : `/${locale}`)
