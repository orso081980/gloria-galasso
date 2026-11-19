import { markdownCvRepository } from '~/infrastructure/content/markdown-cv.repository'
import type { CvRepository } from '~/domain/cv/cv.repository'

/**
 * Application layer entry point: components ask for the CV here and never know where it is stored.
 * Today it comes from the markdown files in /content; swap `repository` to change the source.
 */
export function useCv(repository: CvRepository = markdownCvRepository) {
  return repository.get()
}
