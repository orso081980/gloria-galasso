/** Client-only check. Returns false during SSR (content is rendered in its final state there). */
export function prefersReducedMotion(): boolean {
  return import.meta.client && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
