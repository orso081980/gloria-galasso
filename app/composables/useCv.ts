import { staticCvRepository } from '~/infrastructure/content/static-cv.repository'
import type { CvRepository } from '~/domain/cv/cv.repository'

/**
 * Application layer entry point: components ask for the CV here and never know where it is stored.
 * Swap `repository` to change the data source.
 */
export function useCv(repository: CvRepository = staticCvRepository) {
  return repository.get()
}
