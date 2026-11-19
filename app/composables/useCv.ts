import { markdownCvRepository } from '~/infrastructure/content/markdown-cv.repository'
import type { Locale } from '~/domain/i18n/locales'

/**
 * Application layer entry point: components ask for the CV here and never know where it is stored.
 * It returns the content in the language of the current page (see useLocale).
 * Today it comes from the markdown files in /content; swap the repository to change the source.
 */
export function useCv(locale: Locale = useLocale().value) {
  return markdownCvRepository.get(locale)
}
