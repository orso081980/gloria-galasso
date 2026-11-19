import type { Link } from '@unhead/vue/types'
import { DEFAULT_LOCALE, LOCALES, LOCALE_INFO, localePath } from '~/domain/i18n/locales'
import type { Locale } from '~/domain/i18n/locales'

/**
 * Everything search engines and AI assistants read from <head>, for the language of the page:
 * <html lang>, title/description, Open Graph, Twitter card, canonical, hreflang alternates, rel=me
 * profiles, a pointer to the plain-text version (/llms-full.txt) and schema.org structured data
 * (WebSite + ProfilePage + Person + FAQPage), all generated from the same content as the page.
 */
export function useSiteSeo() {
  const locale = useLocale().value
  const { profile, copy, education, languages, skills, questions } = useCv(locale)
  const config = useRuntimeConfig().public
  const siteUrl = config.siteUrl.replace(/\/$/, '')
  const info = LOCALE_INFO[locale]

  const urlOf = (code: Locale) => (code === DEFAULT_LOCALE ? siteUrl : `${siteUrl}${localePath(code)}`)
  const pageUrl = urlOf(locale)
  const plainTextUrl = `${siteUrl}${locale === DEFAULT_LOCALE ? '' : localePath(locale)}/llms-full.txt`

  const { title, description } = copy.seo
  const image = `${siteUrl}${copy.seo.image}`
  const imageAlt = `${profile.name}, ${profile.headline}`
  // 'Stuttgart, Germany' -> locality + country
  const [locality = profile.location, country = ''] = profile.location.split(',').map((part) => part.trim())

  const ids = {
    website: `${pageUrl}/#website`,
    page: `${pageUrl}/#profilepage`,
    person: `${siteUrl}/#person`, // the same person on every language version
    faq: `${pageUrl}/#faq`,
  }

  const allSkills = skills.flatMap((group) => group.skills)
  const knowsAbout = [...new Set([...copy.hero.focusAreas, ...allSkills])]

  useSeoMeta({
    title,
    description,
    author: profile.name,
    creator: profile.name,
    robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
    formatDetection: 'telephone=no',
    ogType: 'website',
    ogSiteName: profile.name,
    ogTitle: title,
    ogDescription: description,
    ogUrl: pageUrl,
    ogImage: image,
    ogImageAlt: imageAlt,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageType: 'image/png',
    ogLocale: info.ogLocale,
    ogLocaleAlternate: LOCALES.filter((code) => code !== locale).map((code) => LOCALE_INFO[code].ogLocale),
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: image,
    twitterImageAlt: imageAlt,
  })

  const links: Link[] = [
    { rel: 'canonical', href: pageUrl },
    // The same page in every language, so search engines show each visitor the right version.
    ...LOCALES.map((code): Link => ({ rel: 'alternate', hreflang: LOCALE_INFO[code].htmlLang, href: urlOf(code) })),
    { rel: 'alternate', hreflang: 'x-default', href: urlOf(DEFAULT_LOCALE) },
    // Same profiles as in schema.org sameAs: lets crawlers verify they belong to the same person.
    ...profile.links.map((link): Link => ({ rel: 'me', href: link.url })),
    // Plain-text, link-free version of the whole page for AI tools.
    { rel: 'alternate', type: 'text/plain', href: plainTextUrl, title: `${profile.name} (plain text)` },
  ]

  useHead({
    htmlAttrs: { lang: info.htmlLang },
    link: links,
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'WebSite',
              '@id': ids.website,
              url: pageUrl,
              name: profile.name,
              description,
              inLanguage: info.htmlLang,
              publisher: { '@id': ids.person },
            },
            {
              '@type': 'ProfilePage',
              '@id': ids.page,
              url: pageUrl,
              name: title,
              description,
              inLanguage: info.htmlLang,
              dateModified: config.buildDate,
              isPartOf: { '@id': ids.website },
              mainEntity: { '@id': ids.person },
              primaryImageOfPage: { '@type': 'ImageObject', url: image, width: 1200, height: 630 },
            },
            {
              '@type': 'Person',
              '@id': ids.person,
              name: profile.name,
              jobTitle: profile.headline,
              description: copy.footer.about,
              url: pageUrl,
              image: `${siteUrl}${profile.photo.jpg}`,
              email: `mailto:${profile.email}`,
              address: { '@type': 'PostalAddress', addressLocality: locality, addressCountry: country },
              homeLocation: { '@type': 'Place', name: profile.location },
              hasOccupation: { '@type': 'Occupation', name: profile.headline, skills: allSkills.join(', ') },
              alumniOf: education.map((item) => ({ '@type': 'CollegeOrUniversity', name: item.institution })),
              knowsLanguage: languages.items.map((item) => item.name),
              knowsAbout,
              sameAs: profile.links.map((link) => link.url),
              mainEntityOfPage: { '@id': ids.page },
            },
            {
              // The FAQ section doubles as FAQPage data that answer engines can quote.
              '@type': 'FAQPage',
              '@id': ids.faq,
              inLanguage: info.htmlLang,
              mainEntity: questions.map((question) => ({
                '@type': 'Question',
                name: question.prompt,
                acceptedAnswer: { '@type': 'Answer', text: question.answer },
              })),
            },
          ],
        }),
      },
    ],
  })
}
