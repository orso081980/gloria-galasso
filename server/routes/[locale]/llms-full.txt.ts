// /it/llms-full.txt and /de/llms-full.txt
export default defineEventHandler((event) => {
  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return buildLlmsFullTxt(getCv(routeLocale(event)), getSiteUrl(event))
})
