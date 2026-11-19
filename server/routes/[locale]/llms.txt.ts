// /it/llms.txt and /de/llms.txt
export default defineEventHandler((event) => {
  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return buildLlmsTxt(getCv(routeLocale(event)), getSiteUrl(event))
})
