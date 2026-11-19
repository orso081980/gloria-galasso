import type { GithubRepo } from './types'

/** Port: where repositories come from (GitHub API at build time, a snapshot as fallback). */
export interface GithubRepository {
  getRepos(username: string): Promise<GithubRepo[]>
}
