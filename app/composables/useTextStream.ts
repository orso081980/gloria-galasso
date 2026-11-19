/** Reveals a text word by word, like a streaming answer. */
export function useTextStream(intervalMs = 35) {
  const shown = ref('')
  const isStreaming = ref(false)
  let timer: ReturnType<typeof setInterval> | undefined

  function stop() {
    clearInterval(timer)
    isStreaming.value = false
  }

  function start(fullText: string) {
    stop()
    if (prefersReducedMotion()) {
      shown.value = fullText
      return
    }
    const words = fullText.split(' ')
    let count = 0
    shown.value = ''
    isStreaming.value = true
    timer = setInterval(() => {
      count += 1
      shown.value = words.slice(0, count).join(' ')
      if (count >= words.length) stop()
    }, intervalMs)
  }

  onBeforeUnmount(stop)

  return { shown, isStreaming, start }
}
