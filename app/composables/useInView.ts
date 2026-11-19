import type { Ref } from 'vue'

/** Becomes true the first time `target` scrolls into view, then stops observing. */
export function useInView(target: Ref<HTMLElement | null>, options: IntersectionObserverInit = { threshold: 0.15 }) {
  const inView = ref(false)
  let observer: IntersectionObserver | undefined

  onMounted(() => {
    if (!target.value) return
    if (!('IntersectionObserver' in window) || prefersReducedMotion()) {
      inView.value = true
      return
    }
    observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        inView.value = true
        observer?.disconnect()
      }
    }, options)
    observer.observe(target.value)
  })

  onBeforeUnmount(() => observer?.disconnect())

  return inView
}
