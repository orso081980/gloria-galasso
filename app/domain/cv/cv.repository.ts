import type { Cv } from './types'

/** Port: where the CV comes from is an infrastructure concern (static file today, a CMS tomorrow). */
export interface CvRepository {
  get(): Cv
}
