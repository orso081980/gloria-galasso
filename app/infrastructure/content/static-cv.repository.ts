import type { CvRepository } from '~/domain/cv/cv.repository'
import { gloriaCv } from './gloria.data'

/** Adapter: serves the CV from the typed content file bundled with the app. */
export const staticCvRepository: CvRepository = {
  get: () => gloriaCv,
}
