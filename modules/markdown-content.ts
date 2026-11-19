import { readdirSync, readFileSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { addTemplate, defineNuxtModule } from '@nuxt/kit'
import { marked } from 'marked'
import { parse as parseYaml } from 'yaml'

/**
 * Turns every markdown file in /content into plain data at build time and exposes it as the
 * module `#markdown-content`, a real generated file (.nuxt/markdown-content.mjs). Because it is a
 * normal file, the app (Vite) and the server routes (Nitro) both import it the same way, in dev and
 * in production. No markdown/YAML parser ever reaches the browser.
 *
 * A file looks like:
 *
 *   ---
 *   title: Plain text fields live in the YAML front matter
 *   ---
 *   Paragraphs and bullet lists in the body are markdown (inline formatting + links).
 *
 * and becomes { path, id, dir, data, paragraphs, bullets, text } (see shared/types/markdown-content.d.ts).
 */

const ALIAS = '#markdown-content'
const FILENAME = 'markdown-content.mjs'
const FRONT_MATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/

function listMarkdown(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) return listMarkdown(full)
    return entry.name.endsWith('.md') ? [full] : []
  })
}

const inline = (markdown: string) => (marked.parseInline(markdown.trim(), { async: false }) as string).trim()

function readContent(contentDir: string) {
  return listMarkdown(contentDir)
    .sort()
    .map((file) => {
      const path = relative(contentDir, file).split(sep).join('/')
      const raw = readFileSync(file, 'utf8')
      const match = FRONT_MATTER.exec(raw)
      if (!match) throw new Error(`[markdown-content] ${path}: missing front matter (--- ... ---)`)

      let data: Record<string, unknown>
      try {
        data = (parseYaml(match[1]!) ?? {}) as Record<string, unknown>
      } catch (error) {
        throw new Error(`[markdown-content] ${path}: invalid YAML front matter. ${(error as Error).message}`)
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
        // '01-modality' -> 'modality'
        id: name.replace(/^\d+-/, ''),
        dir: path.includes('/') ? path.slice(0, path.lastIndexOf('/')) : '',
        data,
        paragraphs,
        bullets,
        text: plain.join(' '),
      }
    })
}

export default defineNuxtModule({
  meta: { name: 'markdown-content' },
  setup(_options, nuxt) {
    const contentDir = join(nuxt.options.rootDir, 'content')

    const template = addTemplate({
      filename: FILENAME,
      write: true, // a real file on disk, also for `nuxt generate`, so Nitro can import it too
      getContents: () => `export default ${JSON.stringify(readContent(contentDir))}\n`,
    })

    // `#markdown-content` -> .nuxt/markdown-content.mjs (Nuxt shares aliases with Nitro).
    nuxt.options.alias[ALIAS] = template.dst

    // Editing a markdown file restarts the dev server, which regenerates the file above.
    nuxt.options.watch.push(join(contentDir, '**/*.md'))
  },
})
