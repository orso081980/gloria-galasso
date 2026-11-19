/**
 * Domain model of the CV and of the page copy.
 * Pure TypeScript: no Vue, no Nuxt, no I/O. Everything else depends on this layer, never the opposite.
 */

/** Partial ISO date: 'YYYY' or 'YYYY-MM'. */
export type PartialDate = string

/** Inline HTML produced from markdown (bold, links, code). Written by us, safe to render with v-html. */
export type RichText = string

export interface DateRange {
  start: PartialDate
  /** Omitted when the period is still ongoing. */
  end?: PartialDate
}

export interface SocialLink {
  id: 'github' | 'linkedin'
  label: string
  url: string
}

export interface Profile {
  name: string
  headline: string
  location: string
  email: string
  tagline: string
  availability: string
  links: SocialLink[]
  photo: { webp: string; jpg: string; alt: string }
  cvPdf: string
}

export type ExperienceKind = 'industry' | 'research' | 'policy'

export interface Experience {
  id: string
  role: string
  organization: string
  location: string
  /** Country of the location, shown as a flag. */
  countryCode: CountryCode
  period: DateRange
  kind: ExperienceKind
  summary: string
  highlights: RichText[]
  /** A light-hearted one-liner. */
  quip?: string
}

export interface Project {
  id: string
  title: string
  institution: string
  period: DateRange
  /** Name of a Font Awesome icon (see app/utils/fa-icons.ts). */
  icon?: string
  highlights: RichText[]
  tags: string[]
  quip?: string
}

export interface SkillGroup {
  id: string
  /** Identifier-style label, e.g. `nlp_and_llms`. */
  key: string
  label: string
  icon?: string
  skills: string[]
}

export type LanguageLevel = 'Native' | 'C1' | 'B2' | 'B1'

/** ISO 3166-1 alpha-2 code of the flag shown next to a language. */
export type CountryCode = 'IT' | 'GB' | 'DE' | 'FR' | 'ES' | 'US' | 'BE'

export interface LanguageSkill {
  name: string
  countryCode: CountryCode
  level: LanguageLevel
  note?: string
}

export interface Languages {
  title: string
  intro: string
  items: LanguageSkill[]
}

export interface Education {
  id: string
  degree: string
  institution: string
  location: string
  period: DateRange
  icon?: string
  grade?: string
  highlights: RichText[]
}

export interface Question {
  id: string
  prompt: string
  answer: string
  confidence: number
  /** Where in the CV the answer comes from. */
  source: string
}

/* ---------- Page copy: menu, footer and section texts ---------- */

export interface NavLink {
  href: string
  label: string
}

export interface SectionCopy {
  kicker: string
  title: string
  intro?: string
}

export interface HeroCopy {
  /** Phrases the hero types out after `obsessedLabel`. */
  focusAreas: string[]
  obsessedLabel: string
  primaryCta: string
  emailLabel: string
  secondaryCta: string
  stickyNote: string
  monitor: { caption: string; osd: string; label: string }
  tokenizer: { call: string; tokens: string[]; caption: string }
}

export interface Copy {
  seo: { title: string; description: string }
  header: { cta: string; nav: NavLink[] }
  /** `copyright` may contain {year} and {name}. */
  footer: { about: string; copyright: string; status: string; built: string }
  hero: HeroCopy
  experience: SectionCopy & { kindLabels: Record<ExperienceKind, string> }
  projects: SectionCopy
  skills: SectionCopy
  education: SectionCopy
  github: SectionCopy & { cta: string; noDescription: string; pushedLabel: string }
  faq: SectionCopy & {
    terminalTitle: string
    promptLabel: string
    emptyState: string
    confidenceLabel: string
    sourceLabel: string
  }
  contact: SectionCopy & { emailSubject: string; copyLabel: string; copiedLabel: string; cvLabel: string }
}

export interface Cv {
  profile: Profile
  copy: Copy
  experience: Experience[]
  projects: Project[]
  skills: SkillGroup[]
  languages: Languages
  education: Education[]
  questions: Question[]
}
