import type { Cv } from '../../app/domain/cv/types'
import { formatPeriod } from '../../app/domain/cv/period'
import { LOCALES, LOCALE_INFO, localePath } from '../../app/domain/i18n/locales'
import type { Locale } from '../../app/domain/i18n/locales'

/** Inline HTML produced from the markdown bodies -> markdown again (for the plain-text AI files). */
export function htmlToMarkdown(html: string): string {
  return html
    .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
    .replace(/<em>(.*?)<\/em>/g, '*$1*')
    .replace(/<code>(.*?)<\/code>/g, '`$1`')
    .replace(/<a href="([^"]+)"[^>]*>(.*?)<\/a>/g, '[$2]($1)')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

const absolute = (siteUrl: string, path: string) => (path.startsWith('http') ? path : `${siteUrl}${path}`)
const pageUrl = (siteUrl: string, locale: Locale) => (locale === 'en' ? `${siteUrl}/` : `${siteUrl}${localePath(locale)}`)
const prefix = (locale: Locale) => (locale === 'en' ? '' : localePath(locale))

/**
 * /llms.txt (and /it/llms.txt, /de/llms.txt): the short, link-based summary that AI assistants and
 * search tools look for (https://llmstxt.org), in the language of the page.
 */
export function buildLlmsTxt(cv: Cv, siteUrl: string): string {
  const { profile, copy, ui, locale } = cv
  const p = ui.plain
  return [
    `# ${profile.name}`,
    '',
    `> ${copy.seo.description}`,
    '',
    `${p.allOnWebsite} [llms-full.txt](${siteUrl}${prefix(locale)}/llms-full.txt).`,
    '',
    `## ${p.mainPages}`,
    '',
    ...LOCALES.map((code) => `- [${p.website} (${LOCALE_INFO[code].name})](${pageUrl(siteUrl, code)})`),
    `- [${p.fullProfile}](${siteUrl}${prefix(locale)}/llms-full.txt)`,
    `- [${p.cv}](${absolute(siteUrl, profile.cvPdf)})`,
    '',
    `## ${p.profiles}`,
    '',
    ...profile.links.map((link) => `- [${link.label}](${link.url})`),
    '',
    `## ${p.contact}`,
    '',
    `- ${p.email}: ${profile.email}`,
    `- ${p.location}: ${profile.location}`,
    `- ${p.status}: ${profile.availability}`,
    '',
  ].join('\n')
}

/** /llms-full.txt (per language): the whole profile as markdown, generated from the same files as the page. */
export function buildLlmsFullTxt(cv: Cv, siteUrl: string): string {
  const { profile, copy, ui, locale } = cv
  const p = ui.plain
  const lines: string[] = [
    `# ${profile.name}: ${profile.headline}`,
    '',
    `> ${copy.seo.description}`,
    '',
    `- ${p.website}: ${pageUrl(siteUrl, locale)}`,
    `- ${p.location}: ${profile.location}`,
    `- ${p.status}: ${profile.availability}`,
    `- ${p.email}: ${profile.email}`,
    ...profile.links.map((link) => `- ${link.label}: ${link.url}`),
    `- ${p.cv}: ${absolute(siteUrl, profile.cvPdf)}`,
    '',
    copy.footer.about,
    '',
    `## ${p.experience}`,
    '',
  ]

  for (const job of cv.experience) {
    lines.push(`### ${job.role}, ${job.organization} (${formatPeriod(job.period, ui)})`, '', `${job.location}. ${job.summary}`, '')
    for (const bullet of job.highlights) lines.push(`- ${htmlToMarkdown(bullet)}`)
    if (job.highlights.length) lines.push('')
  }

  lines.push(`## ${p.projects}`, '')
  for (const project of cv.projects) {
    lines.push(`### ${project.title} (${formatPeriod(project.period, ui)})`, '', `${project.institution}.`, '')
    for (const bullet of project.highlights) lines.push(`- ${htmlToMarkdown(bullet)}`)
    lines.push('', `${p.keywords}: ${project.tags.join(', ')}`, '')
  }

  lines.push(`## ${p.education}`, '')
  for (const item of cv.education) {
    lines.push(`### ${item.degree}, ${item.institution} (${formatPeriod(item.period, ui)})`, '', item.location + (item.grade ? `. ${item.grade}` : ''), '')
    for (const bullet of item.highlights) lines.push(`- ${htmlToMarkdown(bullet)}`)
    lines.push('')
  }

  lines.push(`## ${p.skills}`, '')
  for (const group of cv.skills) lines.push(`- ${group.label}: ${group.skills.join(', ')}`)

  lines.push('', `## ${p.languages}`, '')
  for (const language of cv.languages.items) {
    lines.push(`- ${language.name}: ${ui.levels[language.level]}${language.note ? ` (${language.note})` : ''}`)
  }

  lines.push('', `## ${p.faq}`, '')
  for (const question of cv.questions) lines.push(`### ${question.prompt}`, '', question.answer, '')

  return lines.join('\n')
}
