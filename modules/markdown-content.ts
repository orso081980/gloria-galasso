import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { addTemplate, defineNuxtModule } from '@nuxt/kit'
import { marked } from 'marked'
import { parse as parseYaml } from 'yaml'
import { DEFAULT_LOCALE, LOCALES } from '../app/domain/i18n/locales'
import type { Locale } from '../app/domain/i18n/locales'

/**
 * Turns the markdown files in /content/<locale>/ into plain data at build time and exposes them as
 * `#markdown-content`, a real generated file (.nuxt/markdown-content.mjs): { en: [...], it: [...], de: [...] }.
 * No markdown/YAML parser ever reaches the browser.
 *
 * English (content/en) is the reference. A translation (content/it, content/de) mirrors its file
 * names and only needs the fields that are translated: everything else (dates, URLs, icons,
 * numbers, country codes...) is inherited from the English file, so it cannot drift. Lists in the
 * front matter are replaced as a whole when a translation provides them. The body (bullet points,
 * answers) must be translated, and the build fails if a translation is missing or incomplete.
 *
 * A file looks like:
 *
 *   ---
 *   title: Plain text fields live in the YAML front matter
 *   ---
 *   Paragraphs and bullet lists in the body are markdown (inline formatting + links).
 */

const ALIAS = '#markdown-content'
const FILENAME = 'markdown-content.mjs'
const FRONT_MATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/

interface ParsedFile {
  path: string
  id: string
  dir: string
  data: Record<string, unknown>
  paragraphs: string[]
  bullets: string[]
  text: string
}

function listMarkdown(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) return listMarkdown(full)
    return entry.name.endsWith('.md') ? [full] : []
  })
}

const inline = (markdown: string) => (marked.parseInline(markdown.trim(), { async: false }) as string).trim()

function readLocale(localeDir: string, label: string): ParsedFile[] {
  if (!existsSync(localeDir)) throw new Error(`[markdown-content] content/${label}/ is missing`)
  return listMarkdown(localeDir)
    .sort()
    .map((file) => {
      const path = relative(localeDir, file).split(sep).join('/')
      const where = `content/${label}/${path}`
      const match = FRONT_MATTER.exec(readFileSync(file, 'utf8'))
      if (!match) throw new Error(`[markdown-content] ${where}: missing front matter (--- ... ---)`)

      let data: Record<string, unknown>
      try {
        data = (parseYaml(match[1]!) ?? {}) as Record<string, unknown>
      } catch (error) {
        throw new Error(`[markdown-content] ${where}: invalid YAML front matter. ${(error as Error).message}`)
      }

      const paragraphs: string[] = []
      const bullets: string[] = []
      const plain: string[] = []
      for (const token of marked.lexer(match[2]!)) {
        if (token.type === 'paragraph') {
          paragraphs.push(inline(token.text))
          plain.push(token.text.trim())
        } else if (token.type === 'list') {
          for (const item of token.items) bullets.push(inline(item.text))
        }
      }

      const name = path.split('/').pop()!.replace(/\.md$/, '')
      return {
        path,
        id: name.replace(/^\d+-/, ''), // '01-modality' -> 'modality'
        dir: path.includes('/') ? path.slice(0, path.lastIndexOf('/')) : '',
        data,
        paragraphs,
        bullets,
        text: plain.join(' '),
      }
    })
}

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value)

/** Objects are merged key by key; lists and text are replaced. */
function deepMerge(base: Record<string, unknown>, override: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = { ...base }
  for (const [key, value] of Object.entries(override)) {
    const existing = result[key]
    result[key] = isPlainObject(existing) && isPlainObject(value) ? deepMerge(existing, value) : value
  }
  return result
}

function buildLocale(reference: ParsedFile[], locale: Locale, contentDir: string): ParsedFile[] {
  if (locale === DEFAULT_LOCALE) return reference

  const translated = readLocale(join(contentDir, locale), locale)
  const byPath = new Map(translated.map((file) => [file.path, file]))
  const problems: string[] = []

  for (const file of translated) {
    if (!reference.some((candidate) => candidate.path === file.path)) {
      problems.push(`content/${locale}/${file.path}: has no English counterpart in content/${DEFAULT_LOCALE}/`)
    }
  }

  const merged = reference.map((base) => {
    const own = byPath.get(base.path)
    if (!own) {
      problems.push(`content/${locale}/${base.path}: missing translation`)
      return base
    }
    if (own.bullets.length !== base.bullets.length) {
      problems.push(`content/${locale}/${base.path}: ${own.bullets.length} bullet points, English has ${base.bullets.length}`)
    }
    if (Boolean(own.text) !== Boolean(base.text)) {
      problems.push(`content/${locale}/${base.path}: body text ${base.text ? 'is missing' : 'should be empty'}`)
    }
    return { ...own, data: deepMerge(base.data, own.data) }
  })

  if (problems.length) {
    throw new Error(`[markdown-content] translation problems:\n  - ${problems.join('\n  - ')}`)
  }
  return merged
}

function readAll(contentDir: string): Record<Locale, ParsedFile[]> {
  const reference = readLocale(join(contentDir, DEFAULT_LOCALE), DEFAULT_LOCALE)
  return Object.fromEntries(LOCALES.map((locale) => [locale, buildLocale(reference, locale, contentDir)])) as Record<
    Locale,
    ParsedFile[]
  >
}

export default defineNuxtModule({
  meta: { name: 'markdown-content' },
  setup(_options, nuxt) {
    const contentDir = join(nuxt.options.rootDir, 'content')

    const template = addTemplate({
      filename: FILENAME,
      write: true, // a real file on disk, also for `nuxt generate`, so Nitro can import it too
      getContents: () => `export default ${JSON.stringify(readAll(contentDir))}\n`,
    })

    // `#markdown-content` -> .nuxt/markdown-content.mjs (Nuxt shares aliases with Nitro).
    nuxt.options.alias[ALIAS] = template.dst

    // Editing a markdown file restarts the dev server, which regenerates the file above.
    nuxt.options.watch.push(join(contentDir, '**/*.md'))
  },
})
