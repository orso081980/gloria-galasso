import type { GithubRepo } from '~/domain/github/types'

/**
 * Snapshot of the public repos, used when the GitHub API is unreachable during the build
 * (rate limit, network). Refresh it now and then; the live data wins whenever it is available.
 */
export const githubSnapshot: GithubRepo[] = [
  {
    name: 'find-focal-terms',
    description: 'find focal terms between patents and pmid',
    url: 'https://github.com/gloriagalasso/find-focal-terms',
    language: 'Jupyter Notebook',
    stars: 0,
    pushedAt: '2026-09-23T15:26:44Z',
    fork: false,
  },
  {
    name: 'What-Do-Clinical-Speech-Models-Actually-Learn-',
    description: null,
    url: 'https://github.com/gloriagalasso/What-Do-Clinical-Speech-Models-Actually-Learn-',
    language: 'TeX',
    stars: 0,
    pushedAt: '2026-06-28T15:12:50Z',
    fork: false,
  },
  {
    name: 'References-for-Speech-Technology-for-Children',
    description: 'Reference for ST poster',
    url: 'https://github.com/gloriagalasso/References-for-Speech-Technology-for-Children',
    language: null,
    stars: 0,
    pushedAt: '2026-04-08T10:05:39Z',
    fork: false,
  },
  {
    name: 'infant-cry-audio-classification',
    description: 'Automatic classification of infant cries into need-based categories (belly pain, burping, discomfort, hunger, fatigue)',
    url: 'https://github.com/gloriagalasso/infant-cry-audio-classification',
    language: 'Jupyter Notebook',
    stars: 1,
    pushedAt: '2026-01-20T09:36:50Z',
    fork: false,
  },
  {
    name: 'texttech',
    description: 'Some python scripts example to web-scrape a website',
    url: 'https://github.com/gloriagalasso/texttech',
    language: 'HTML',
    stars: 0,
    pushedAt: '2026-01-19T16:23:13Z',
    fork: false,
  },
]
