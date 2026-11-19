declare module '#markdown-content' {
  /** One markdown file from /content, already parsed at build time. */
  export interface MarkdownFile {
    /** Path relative to /content, e.g. `experience/01-modality.md`. */
    path: string
    /** File name without extension and without a numeric ordering prefix. */
    id: string
    /** Folder relative to /content, '' for top-level files. */
    dir: string
    /** YAML front matter (plain text fields). */
    data: Record<string, unknown>
    /** Body paragraphs, rendered as inline HTML. */
    paragraphs: string[]
    /** Body bullet-list items, rendered as inline HTML. */
    bullets: string[]
    /** Body paragraphs as plain markdown text, joined with spaces. */
    text: string
  }

  const files: MarkdownFile[]
  export default files
}
