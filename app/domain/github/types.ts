export interface GithubRepo {
  name: string
  description: string | null
  url: string
  language: string | null
  stars: number
  /** ISO timestamp of the last push. */
  pushedAt: string
  fork: boolean
}
