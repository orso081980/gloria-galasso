import type { GithubRepo } from './types'

/** Original work only (no forks), most recently pushed first. */
export function selectShowcaseRepos(repos: GithubRepo[], limit = 6): GithubRepo[] {
  return repos
    .filter((repo) => !repo.fork)
    .sort((a, b) => b.pushedAt.localeCompare(a.pushedAt))
    .slice(0, limit)
}

const LANGUAGE_COLORS: Record<string, string> = {
  Python: '#3572A5',
  'Jupyter Notebook': '#DA5B0B',
  TeX: '#3D6117',
  HTML: '#E34C26',
  TypeScript: '#3178C6',
  JavaScript: '#F1E05A',
  R: '#198CE7',
}

export function languageColor(language: string | null): string {
  return (language && LANGUAGE_COLORS[language]) || '#8b8fa8'
}
