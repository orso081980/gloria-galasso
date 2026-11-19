import type { Locale } from '../i18n/locales'
import type { Cv } from './types'

/** Port: where the CV comes from is an infrastructure concern (markdown files today, a CMS tomorrow). */
export interface CvRepository {
  get(locale: Locale): Cv
}
