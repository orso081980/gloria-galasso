import { LOCALES, LOCALE_INFO } from '../../app/domain/i18n/locales'

/** One <url> per language, each listing all language versions (hreflang), as Google expects. */
export default defineEventHandler((event) => {
  const siteUrl = getSiteUrl(event)
  const lastmod = useRuntimeConfig(event).public.buildDate
  setHeader(event, 'content-type', 'application/xml; charset=utf-8')

  const alternates = [
    ...LOCALES.map((code) => `    <xhtml:link rel="alternate" hreflang="${LOCALE_INFO[code].htmlLang}" href="${pageUrl(siteUrl, code)}"/>`),
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${pageUrl(siteUrl, 'en')}"/>`,
  ].join('\n')

  const urls = LOCALES.map((code) => {
    const image = `${siteUrl}${getCv(code).copy.seo.image}`
    return `  <url>
    <loc>${pageUrl(siteUrl, code)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${code === 'en' ? '1.0' : '0.9'}</priority>
${alternates}
    <image:image>
      <image:loc>${image}</image:loc>
    </image:image>
  </url>`
  }).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>
`
})
