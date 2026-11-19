/** Title, description, Open Graph, Twitter card, canonical URL and schema.org Person JSON-LD. */
export function useSiteSeo() {
  const { profile } = useCv()
  const siteUrl = useRuntimeConfig().public.siteUrl.replace(/\/$/, '')

  const title = `${profile.name} · NLP & LLM Data Scientist`
  const description =
    `${profile.name} is an NLP and LLM data scientist (M.Sc. Computational Linguistics) based in ${profile.location}. ` +
    'Text classification, information extraction, LLM fine-tuning and speech for health. Open to work.'
  const image = `${siteUrl}/og-image.png`

  useSeoMeta({
    title,
    description,
    author: profile.name,
    robots: 'index, follow',
    ogType: 'website',
    ogSiteName: profile.name,
    ogTitle: title,
    ogDescription: description,
    ogUrl: siteUrl,
    ogImage: image,
    ogImageAlt: `${profile.name}, NLP and LLM data scientist`,
    ogLocale: 'en_US',
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: image,
  })

  useHead({
    link: [{ rel: 'canonical', href: siteUrl }],
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: profile.name,
          jobTitle: profile.headline,
          url: siteUrl,
          image: `${siteUrl}${profile.photo.jpg}`,
          email: `mailto:${profile.email}`,
          address: { '@type': 'PostalAddress', addressLocality: 'Stuttgart', addressCountry: 'DE' },
          alumniOf: [
            { '@type': 'CollegeOrUniversity', name: 'University of Stuttgart' },
            { '@type': 'CollegeOrUniversity', name: 'University of Kent' },
            { '@type': 'CollegeOrUniversity', name: 'Università Cattolica del Sacro Cuore' },
          ],
          knowsLanguage: ['it', 'en', 'de', 'fr', 'es'],
          knowsAbout: ['Natural Language Processing', 'Large Language Models', 'Text classification', 'Information extraction', 'Speech processing'],
          sameAs: profile.links.map((link) => link.url),
        }),
      },
    ],
  })
}
