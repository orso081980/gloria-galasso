import contentFiles from '#markdown-content'
import type { MarkdownFile } from '#markdown-content'
import type { CvRepository } from '~/domain/cv/cv.repository'
import type {
  Copy,
  CountryCode,
  Cv,
  Education,
  Experience,
  ExperienceKind,
  HeroCopy,
  LanguageLevel,
  Languages,
  Profile,
  Project,
  Question,
  SectionCopy,
  SkillGroup,
  SocialLink,
} from '~/domain/cv/types'

/**
 * Adapter: builds the CV from the markdown files in /content (parsed at build time by
 * modules/markdown-content.ts). Every field is checked, so a typo in a markdown file fails the
 * build with the file name and field instead of rendering an empty page.
 */

type Data = Record<string, unknown>

const COUNTRY_CODES: readonly CountryCode[] = ['IT', 'GB', 'DE', 'FR', 'ES', 'US', 'BE']

class ContentError extends Error {
  constructor(file: string, message: string) {
    super(`[content/${file}] ${message}`)
  }
}

/* ---------- tiny typed readers ---------- */

function str(file: string, data: Data, key: string): string {
  const value = data[key]
  if (typeof value === 'string' && value.trim()) return value.trim()
  if (typeof value === 'number') return String(value)
  throw new ContentError(file, `"${key}" is required (text)`)
}

function optStr(file: string, data: Data, key: string): string | undefined {
  return data[key] === undefined || data[key] === null ? undefined : str(file, data, key)
}

function num(file: string, data: Data, key: string): number {
  const value = data[key]
  if (typeof value === 'number' && Number.isFinite(value)) return value
  throw new ContentError(file, `"${key}" is required (number)`)
}

function list(file: string, data: Data, key: string): unknown[] {
  const value = data[key]
  if (Array.isArray(value)) return value
  throw new ContentError(file, `"${key}" is required (list)`)
}

function strList(file: string, data: Data, key: string): string[] {
  return list(file, data, key).map((item, index) => {
    if (typeof item === 'string' || typeof item === 'number') return String(item)
    throw new ContentError(file, `"${key}[${index}]" must be text`)
  })
}

function obj(file: string, data: Data, key: string): Data {
  const value = data[key]
  if (value && typeof value === 'object' && !Array.isArray(value)) return value as Data
  throw new ContentError(file, `"${key}" is required (group of fields)`)
}

function oneOf<T extends string>(file: string, key: string, value: string, allowed: readonly T[]): T {
  if ((allowed as readonly string[]).includes(value)) return value as T
  throw new ContentError(file, `"${key}" must be one of ${allowed.join(', ')} (got "${value}")`)
}

/* ---------- lookups ---------- */

function buildRepository(files: MarkdownFile[]): CvRepository {
  const single = (path: string): MarkdownFile => {
    const file = files.find((candidate) => candidate.path === path)
    if (!file) throw new ContentError(path, 'file is missing')
    return file
  }
  const folder = (dir: string): MarkdownFile[] => {
    const found = files.filter((candidate) => candidate.dir === dir)
    if (!found.length) throw new ContentError(`${dir}/`, 'folder is empty or missing')
    return found // already sorted by path, so 01-, 02-... defines the order
  }

  const period = (file: MarkdownFile) => ({
    start: str(file.path, file.data, 'start'),
    end: optStr(file.path, file.data, 'end'),
  })

  const section = (path: string): { file: MarkdownFile; copy: SectionCopy } => {
    const file = single(path)
    return {
      file,
      copy: {
        kicker: str(path, file.data, 'kicker'),
        title: str(path, file.data, 'title'),
        intro: optStr(path, file.data, 'intro'),
      },
    }
  }

  return {
    get(): Cv {
      /* ----- profile + header/footer/SEO ----- */
      const site = single('site.md')
      const sd = site.data
      const links: SocialLink[] = list(site.path, sd, 'links').map((raw, index) => {
        const item = raw as Data
        const where = `links[${index}]`
        return {
          id: oneOf(site.path, `${where}.id`, str(site.path, item, 'id'), ['github', 'linkedin'] as const),
          label: str(site.path, item, 'label'),
          url: str(site.path, item, 'url'),
        }
      })
      const photo = obj(site.path, sd, 'photo')
      const profile: Profile = {
        name: str(site.path, sd, 'name'),
        headline: str(site.path, sd, 'headline'),
        location: str(site.path, sd, 'location'),
        email: str(site.path, sd, 'email'),
        tagline: str(site.path, sd, 'tagline'),
        availability: str(site.path, sd, 'availability'),
        cvPdf: str(site.path, sd, 'cvPdf'),
        photo: { webp: str(site.path, photo, 'webp'), jpg: str(site.path, photo, 'jpg'), alt: str(site.path, photo, 'alt') },
        links,
      }
      const seo = obj(site.path, sd, 'seo')
      const header = obj(site.path, sd, 'header')
      const footer = obj(site.path, sd, 'footer')

      /* ----- hero ----- */
      const hero = single('hero.md')
      const monitor = obj(hero.path, hero.data, 'monitor')
      const tokenizer = obj(hero.path, hero.data, 'tokenizer')
      const heroCopy: HeroCopy = {
        focusAreas: strList(hero.path, hero.data, 'focusAreas'),
        obsessedLabel: str(hero.path, hero.data, 'obsessedLabel'),
        primaryCta: str(hero.path, hero.data, 'primaryCta'),
        secondaryCta: str(hero.path, hero.data, 'secondaryCta'),
        stickyNote: str(hero.path, hero.data, 'stickyNote'),
        monitor: {
          caption: str(hero.path, monitor, 'caption'),
          osd: str(hero.path, monitor, 'osd'),
          label: str(hero.path, monitor, 'label'),
        },
        tokenizer: {
          call: str(hero.path, tokenizer, 'call'),
          // tokens may carry a leading space on purpose (" Gal"), so no trimming here
          tokens: list(hero.path, tokenizer, 'tokens').map(String),
          caption: str(hero.path, tokenizer, 'caption'),
        },
      }

      /* ----- sections ----- */
      const experienceSection = section('sections/experience.md')
      const kindLabels = obj(experienceSection.file.path, experienceSection.file.data, 'kindLabels')
      const github = section('sections/github.md')
      const ask = section('sections/ask.md')
      const contact = section('sections/contact.md')

      const copy: Copy = {
        seo: { title: str(site.path, seo, 'title'), description: str(site.path, seo, 'description') },
        header: {
          cta: str(site.path, header, 'cta'),
          nav: list(site.path, header, 'nav').map((raw) => ({
            href: str(site.path, raw as Data, 'href'),
            label: str(site.path, raw as Data, 'label'),
          })),
        },
        footer: {
          about: str(site.path, footer, 'about'),
          copyright: str(site.path, footer, 'copyright'),
          status: str(site.path, footer, 'status'),
          built: str(site.path, footer, 'built'),
        },
        hero: heroCopy,
        experience: {
          ...experienceSection.copy,
          kindLabels: {
            industry: str(experienceSection.file.path, kindLabels, 'industry'),
            research: str(experienceSection.file.path, kindLabels, 'research'),
            policy: str(experienceSection.file.path, kindLabels, 'policy'),
          },
        },
        projects: section('sections/projects.md').copy,
        skills: section('sections/skills.md').copy,
        education: section('sections/education.md').copy,
        github: {
          ...github.copy,
          cta: str(github.file.path, github.file.data, 'cta'),
          noDescription: str(github.file.path, github.file.data, 'noDescription'),
          pushedLabel: str(github.file.path, github.file.data, 'pushedLabel'),
        },
        ask: {
          ...ask.copy,
          terminalTitle: str(ask.file.path, ask.file.data, 'terminalTitle'),
          promptLabel: str(ask.file.path, ask.file.data, 'promptLabel'),
          emptyState: str(ask.file.path, ask.file.data, 'emptyState'),
          confidenceLabel: str(ask.file.path, ask.file.data, 'confidenceLabel'),
          sourceLabel: str(ask.file.path, ask.file.data, 'sourceLabel'),
        },
        contact: {
          ...contact.copy,
          emailSubject: str(contact.file.path, contact.file.data, 'emailSubject'),
          copyLabel: str(contact.file.path, contact.file.data, 'copyLabel'),
          copiedLabel: str(contact.file.path, contact.file.data, 'copiedLabel'),
          cvLabel: str(contact.file.path, contact.file.data, 'cvLabel'),
        },
      }

      /* ----- collections ----- */
      const experience: Experience[] = folder('experience').map((file) => ({
        id: file.id,
        role: str(file.path, file.data, 'role'),
        organization: str(file.path, file.data, 'organization'),
        location: str(file.path, file.data, 'location'),
        countryCode: oneOf<CountryCode>(file.path, 'country', str(file.path, file.data, 'country'), COUNTRY_CODES),
        period: period(file),
        kind: oneOf<ExperienceKind>(file.path, 'kind', str(file.path, file.data, 'kind'), ['industry', 'research', 'policy']),
        summary: str(file.path, file.data, 'summary'),
        highlights: file.bullets,
        quip: optStr(file.path, file.data, 'quip'),
      }))

      const projects: Project[] = folder('projects').map((file) => ({
        id: file.id,
        title: str(file.path, file.data, 'title'),
        institution: str(file.path, file.data, 'institution'),
        period: period(file),
        icon: optStr(file.path, file.data, 'icon'),
        highlights: file.bullets,
        tags: strList(file.path, file.data, 'tags'),
        quip: optStr(file.path, file.data, 'quip'),
      }))

      const skills: SkillGroup[] = folder('skills').map((file) => ({
        id: file.id,
        key: str(file.path, file.data, 'key'),
        label: str(file.path, file.data, 'label'),
        icon: optStr(file.path, file.data, 'icon'),
        skills: strList(file.path, file.data, 'skills'),
      }))

      const languagesFile = single('languages.md')
      const languages: Languages = {
        title: str(languagesFile.path, languagesFile.data, 'title'),
        intro: str(languagesFile.path, languagesFile.data, 'intro'),
        items: list(languagesFile.path, languagesFile.data, 'items').map((raw, index) => {
          const item = raw as Data
          const where = `items[${index}]`
          return {
            name: str(languagesFile.path, item, 'name'),
            countryCode: oneOf<CountryCode>(languagesFile.path, `${where}.country`, str(languagesFile.path, item, 'country'), COUNTRY_CODES),
            level: oneOf<LanguageLevel>(languagesFile.path, `${where}.level`, str(languagesFile.path, item, 'level'), ['Native', 'C1', 'B2', 'B1']),
            note: optStr(languagesFile.path, item, 'note'),
          }
        }),
      }

      const education: Education[] = folder('education').map((file) => ({
        id: file.id,
        degree: str(file.path, file.data, 'degree'),
        institution: str(file.path, file.data, 'institution'),
        location: str(file.path, file.data, 'location'),
        period: period(file),
        icon: optStr(file.path, file.data, 'icon'),
        grade: optStr(file.path, file.data, 'grade'),
        highlights: file.bullets,
      }))

      const questions: Question[] = folder('questions').map((file) => {
        if (!file.text) throw new ContentError(file.path, 'the body (the answer) is empty')
        return {
          id: file.id,
          prompt: str(file.path, file.data, 'prompt'),
          answer: file.text,
          confidence: num(file.path, file.data, 'confidence'),
          source: str(file.path, file.data, 'source'),
        }
      })

      return { profile, copy, experience, projects, skills, languages, education, questions }
    },
  }
}

/** Built once per process; the data is static. */
export const markdownCvRepository: CvRepository = (() => {
  let cached: Cv | undefined
  const repository = buildRepository(contentFiles)
  return { get: () => (cached ??= repository.get()) }
})()
