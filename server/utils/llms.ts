import type { Cv } from '../../app/domain/cv/types'
import { formatPeriod } from '../../app/domain/cv/period'

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

/**
 * /llms.txt: the short, link-based summary that AI assistants and search tools look for
 * (https://llmstxt.org).
 */
export function buildLlmsTxt(cv: Cv, siteUrl: string): string {
  const { profile, copy } = cv
  const github = profile.links.map((link) => `- [${link.label}](${link.url}): ${profile.name} on ${link.label}`)
  return [
    `# ${profile.name}`,
    '',
    `> ${copy.seo.description}`,
    '',
    `${profile.name} is currently ${profile.availability.split('·')[0]!.trim().toLowerCase()}. Everything on the website is also available as plain text in [llms-full.txt](${siteUrl}/llms-full.txt).`,
    '',
    '## Main pages',
    '',
    `- [Website](${siteUrl}/): CV, projects, skills, education and contact`,
    `- [Full profile as plain text](${siteUrl}/llms-full.txt): experience, projects, education, skills, languages and FAQ`,
    `- [CV (PDF)](${absolute(siteUrl, profile.cvPdf)}): downloadable résumé`,
    '',
    '## Profiles',
    '',
    ...github,
    '',
    '## Contact',
    '',
    `- Email: ${profile.email}`,
    `- Location: ${profile.location}`,
    '',
  ].join('\n')
}

/** /llms-full.txt: the whole profile as markdown, generated from the same files as the page. */
export function buildLlmsFullTxt(cv: Cv, siteUrl: string): string {
  const { profile, copy } = cv
  const lines: string[] = [
    `# ${profile.name}: ${profile.headline}`,
    '',
    `> ${copy.seo.description}`,
    '',
    `- Website: ${siteUrl}/`,
    `- Location: ${profile.location}`,
    `- Status: ${profile.availability}`,
    `- Email: ${profile.email}`,
    ...profile.links.map((link) => `- ${link.label}: ${link.url}`),
    `- CV (PDF): ${absolute(siteUrl, profile.cvPdf)}`,
    '',
    copy.footer.about,
    '',
    '## Experience',
    '',
  ]

  for (const job of cv.experience) {
    lines.push(`### ${job.role}, ${job.organization} (${formatPeriod(job.period)})`, '', `${job.location}. ${job.summary}`, '')
    for (const bullet of job.highlights) lines.push(`- ${htmlToMarkdown(bullet)}`)
    if (job.highlights.length) lines.push('')
  }

  lines.push('## Projects', '')
  for (const project of cv.projects) {
    lines.push(`### ${project.title} (${formatPeriod(project.period)})`, '', `${project.institution}.`, '')
    for (const bullet of project.highlights) lines.push(`- ${htmlToMarkdown(bullet)}`)
    lines.push('', `Keywords: ${project.tags.join(', ')}`, '')
  }

  lines.push('## Education', '')
  for (const item of cv.education) {
    lines.push(`### ${item.degree}, ${item.institution} (${formatPeriod(item.period)})`, '', item.location + (item.grade ? `. ${item.grade}` : ''), '')
    for (const bullet of item.highlights) lines.push(`- ${htmlToMarkdown(bullet)}`)
    lines.push('')
  }

  lines.push('## Skills', '')
  for (const group of cv.skills) lines.push(`- ${group.label}: ${group.skills.join(', ')}`)

  lines.push('', '## Languages', '')
  for (const language of cv.languages.items) {
    lines.push(`- ${language.name}: ${language.level}${language.note ? ` (${language.note})` : ''}`)
  }

  lines.push('', '## Frequently asked questions', '')
  for (const question of cv.questions) lines.push(`### ${question.prompt}`, '', question.answer, '')

  return lines.join('\n')
}
