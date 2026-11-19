import { createGithubApiRepository } from '~/infrastructure/github/github-api.repository'
import { githubSnapshot } from '~/infrastructure/github/github.snapshot'

/**
 * Public repos of the GitHub profile linked in the CV.
 * Fetched while the static site is generated (the result ships inside the page payload, so visitors
 * never call GitHub). If the API fails at build time, the bundled snapshot is used instead.
 */
export function useGithubRepos() {
  const { profile } = useCv()
  const githubUrl = profile.links.find((link) => link.id === 'github')?.url ?? ''
  const username = githubUrl.split('/').filter(Boolean).pop() ?? ''
  const token = useRuntimeConfig().githubToken

  return useAsyncData(
    'github-repos',
    async () => {
      try {
        return await createGithubApiRepository(token || undefined).getRepos(username)
      } catch {
        return githubSnapshot
      }
    },
    { default: () => githubSnapshot },
  )
}
