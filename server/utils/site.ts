import { markdownCvRepository } from '../../app/infrastructure/content/markdown-cv.repository'

/** The CV, read from the same markdown files the page uses. */
export const getCv = () => markdownCvRepository.get()

/** Public site URL without a trailing slash (NUXT_PUBLIC_SITE_URL). */
export const getSiteUrl = (event: Parameters<typeof useRuntimeConfig>[0]) =>
  useRuntimeConfig(event).public.siteUrl.replace(/\/$/, '')
