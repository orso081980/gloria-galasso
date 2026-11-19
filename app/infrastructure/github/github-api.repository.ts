import type { GithubRepository } from '~/domain/github/github.repository'
import type { GithubRepo } from '~/domain/github/types'

interface ApiRepo {
  name: string
  description: string | null
  html_url: string
  language: string | null
  stargazers_count: number
  pushed_at: string
  fork: boolean
}

/** Adapter: public GitHub REST API. A token is optional (it only raises the rate limit). */
export function createGithubApiRepository(token?: string): GithubRepository {
  return {
    async getRepos(username) {
      const repos = await $fetch<ApiRepo[]>(`https://api.github.com/users/${encodeURIComponent(username)}/repos`, {
        query: { per_page: 100, sort: 'pushed' },
        headers: {
          Accept: 'application/vnd.github+json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        timeout: 8000,
      })
      return repos.map<GithubRepo>((repo) => ({
        name: repo.name,
        description: repo.description,
        url: repo.html_url,
        language: repo.language,
        stars: repo.stargazers_count,
        pushedAt: repo.pushed_at,
        fork: repo.fork,
      }))
    },
  }
}
