import type { Ref } from 'vue'

/**
 * Animates a number from 0 to `target` once `active` turns true.
 * Starts at `target` so SSR / no-JS / reduced-motion users see the real value.
 */
export function useCountUp(target: number, active: Ref<boolean>, duration = 1400) {
  const value = ref(target)
  let frame = 0

  onMounted(() => {
    if (prefersReducedMotion()) return
    value.value = 0
    watch(
      active,
      (isActive) => {
        if (!isActive) return
        const startedAt = performance.now()
        const tick = (now: number) => {
          const progress = Math.min((now - startedAt) / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          value.value = target * eased
          if (progress < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { immediate: true },
    )
  })

  onBeforeUnmount(() => cancelAnimationFrame(frame))

  return value
}
