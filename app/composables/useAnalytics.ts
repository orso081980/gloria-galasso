/**
 * Cloudflare Web Analytics (cookieless, no consent banner needed in most cases).
 * Only loads when NUXT_PUBLIC_CF_ANALYTICS_TOKEN is set, so local dev and previews stay clean.
 * Skip this (leave the token empty) if you switched on "Web Analytics" in the Pages project:
 * Cloudflare then injects the same beacon for you and you would count every visit twice.
 */
export function useAnalytics() {
  const token = useRuntimeConfig().public.cfAnalyticsToken
  if (!token) return

  useHead({
    script: [
      {
        src: 'https://static.cloudflareinsights.com/beacon.min.js',
        defer: true,
        'data-cf-beacon': JSON.stringify({ token }),
        tagPosition: 'bodyClose',
      },
    ],
  })
}
