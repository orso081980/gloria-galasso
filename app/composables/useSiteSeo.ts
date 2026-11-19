import type { Link } from '@unhead/vue/types'

/**
 * Everything search engines and AI assistants read from <head>:
 * title/description, Open Graph, Twitter card, canonical, rel=me profiles, a pointer to the
 * plain-text version (/llms-full.txt) and schema.org structured data (WebSite + ProfilePage +
 * Person + FAQPage) generated from the same content as the page.
 */
export function useSiteSeo() {
  const { profile, copy, education, languages, skills, questions } = useCv()
  const config = useRuntimeConfig().public
  const siteUrl = config.siteUrl.replace(/\/$/, '')

  const { title, description } = copy.seo
  const image = `${siteUrl}/og-image.png`
  // 'Stuttgart, Germany' -> locality + country
  const [locality = profile.location, country = ''] = profile.location.split(',').map((part) => part.trim())

  const ids = {
    website: `${siteUrl}/#website`,
    page: `${siteUrl}/#profilepage`,
    person: `${siteUrl}/#person`,
    faq: `${siteUrl}/#faq`,
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
    ogUrl: siteUrl,
    ogImage: image,
    ogImageAlt: `${profile.name}, ${profile.headline}`,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageType: 'image/png',
    ogLocale: 'en_US',
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: image,
    twitterImageAlt: `${profile.name}, ${profile.headline}`,
  })

  const links: Link[] = [
    { rel: 'canonical', href: siteUrl },
    // Same profiles as in schema.org sameAs: lets crawlers verify they belong to the same person.
    ...profile.links.map((link): Link => ({ rel: 'me', href: link.url })),
    // Plain-text, link-free version of the whole page for AI tools.
    { rel: 'alternate', type: 'text/plain', href: `${siteUrl}/llms-full.txt`, title: `${profile.name} (plain text)` },
  ]

  useHead({
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
              url: siteUrl,
              name: profile.name,
              description,
              inLanguage: 'en',
              publisher: { '@id': ids.person },
            },
            {
              '@type': 'ProfilePage',
              '@id': ids.page,
              url: siteUrl,
              name: title,
              description,
              inLanguage: 'en',
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
              url: siteUrl,
              image: `${siteUrl}${profile.photo.jpg}`,
              email: `mailto:${profile.email}`,
              address: { '@type': 'PostalAddress', addressLocality: locality, addressCountry: country },
              homeLocation: { '@type': 'Place', name: profile.location },
              hasOccupation: {
                '@type': 'Occupation',
                name: profile.headline,
                skills: allSkills.join(', '),
              },
              alumniOf: education.map((item) => ({ '@type': 'CollegeOrUniversity', name: item.institution })),
              knowsLanguage: languages.items.map((item) => item.name),
              knowsAbout,
              sameAs: profile.links.map((link) => link.url),
              mainEntityOfPage: { '@id': ids.page },
            },
            {
              // The GloriaGPT questions double as an FAQ that answer engines can quote.
              '@type': 'FAQPage',
              '@id': ids.faq,
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
