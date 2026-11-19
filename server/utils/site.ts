import { markdownCvRepository } from '../../app/infrastructure/content/markdown-cv.repository'
import { DEFAULT_LOCALE, isLocale, localePath } from '../../app/domain/i18n/locales'
import type { Locale } from '../../app/domain/i18n/locales'

/** The CV in one language, read from the same markdown files the page uses. */
export const getCv = (locale: Locale = DEFAULT_LOCALE) => markdownCvRepository.get(locale)

/** Public site URL without a trailing slash (NUXT_PUBLIC_SITE_URL). */
export const getSiteUrl = (event: Parameters<typeof useRuntimeConfig>[0]) =>
  useRuntimeConfig(event).public.siteUrl.replace(/\/$/, '')

/** Absolute URL of the page in a language: https://site/ , https://site/it , https://site/de */
export const pageUrl = (siteUrl: string, locale: Locale) => (locale === DEFAULT_LOCALE ? siteUrl : `${siteUrl}${localePath(locale)}`)

/** Reads the :locale route parameter of /it/... and /de/... routes; English has no prefix, so it is a 404 here. */
export function routeLocale(event: Parameters<typeof getRouterParam>[0]): Locale {
  const locale = getRouterParam(event, 'locale')
  if (!isLocale(locale) || locale === DEFAULT_LOCALE) throw createError({ statusCode: 404, statusMessage: 'Not Found' })
  return locale
}
