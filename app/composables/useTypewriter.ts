/**
 * Types and deletes a list of phrases in a loop.
 * SSR (and reduced-motion) renders the first phrase statically.
 */
export function useTypewriter(phrases: string[], { typeMs = 70, deleteMs = 35, holdMs = 1600 } = {}) {
  const text = ref(phrases[0] ?? '')
  let timer: ReturnType<typeof setTimeout> | undefined
  let stopped = false

  onMounted(() => {
    if (prefersReducedMotion() || phrases.length < 2) return
    let index = 0
    let typing = false
    text.value = ''

    const step = () => {
      if (stopped) return
      const word = phrases[index]!
      if (typing) {
        text.value = word.slice(0, text.value.length + 1)
        if (text.value === word) {
          typing = false
          timer = setTimeout(step, holdMs)
          return
        }
        timer = setTimeout(step, typeMs)
      } else {
        text.value = word.slice(0, Math.max(text.value.length - 1, 0))
        if (text.value === '') {
          typing = true
          index = (index + 1) % phrases.length
        }
        timer = setTimeout(step, deleteMs)
      }
    }
    typing = true
    step()
  })

  onBeforeUnmount(() => {
    stopped = true
    clearTimeout(timer)
  })

  return text
}
