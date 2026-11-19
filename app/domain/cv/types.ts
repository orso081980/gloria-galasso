/**
 * Domain model of the CV.
 * Pure TypeScript: no Vue, no Nuxt, no I/O. Everything else depends on this layer, never the opposite.
 */

/** Partial ISO date: 'YYYY' or 'YYYY-MM'. */
export type PartialDate = string

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
  /** Short bio, one paragraph per entry. */
  summary: string[]
  tagline: string
  /** Phrases the hero rotates through: "Teaching machines to read: <phrase>". */
  focusAreas: string[]
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
  period: DateRange
  kind: ExperienceKind
  summary: string
  highlights: string[]
  /** A light-hearted one-liner. */
  quip?: string
}

export interface Project {
  id: string
  title: string
  institution: string
  period: DateRange
  highlights: string[]
  tags: string[]
  quip?: string
}

export interface SkillGroup {
  id: string
  /** Identifier-style label, e.g. `nlp_and_llms`. */
  key: string
  label: string
  skills: string[]
}

export type LanguageLevel = 'Native' | 'C1' | 'B2' | 'B1'

/** ISO 3166-1 alpha-2 code of the flag shown next to a language. */
export type CountryCode = 'IT' | 'GB' | 'DE' | 'FR' | 'ES'

export interface LanguageSkill {
  name: string
  countryCode: CountryCode
  level: LanguageLevel
  note?: string
}

export interface Education {
  id: string
  degree: string
  institution: string
  location: string
  period: DateRange
  grade?: string
  highlights: string[]
}

export interface Question {
  id: string
  prompt: string
  answer: string
  confidence: number
  /** Where in the CV the answer comes from. */
  source: string
}

export interface Cv {
  profile: Profile
  experience: Experience[]
  projects: Project[]
  skills: SkillGroup[]
  languages: LanguageSkill[]
  education: Education[]
  questions: Question[]
}
