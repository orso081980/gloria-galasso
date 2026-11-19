import { DEFAULT_LOCALE, isLocale } from '~/domain/i18n/locales'
import type { Locale } from '~/domain/i18n/locales'

/** Language of the page being shown: 'it' / 'de' from the URL (/it, /de), English everywhere else. */
export function useLocale(): ComputedRef<Locale> {
  const route = useRoute()
  return computed(() => {
    const param = route.params.locale
    return typeof param === 'string' && isLocale(param) ? param : DEFAULT_LOCALE
  })
}
