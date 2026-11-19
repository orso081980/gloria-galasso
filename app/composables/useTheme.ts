/** Light/dark theme. The initial class is set by an inline script in <head> (see nuxt.config.ts). */
export function useTheme() {
  const isDark = useState('theme-is-dark', () => false)

  function apply(dark: boolean) {
    isDark.value = dark
    document.documentElement.classList.toggle('dark', dark)
  }

  function sync() {
    isDark.value = document.documentElement.classList.contains('dark')
  }

  function toggle() {
    const next = !isDark.value
    apply(next)
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light')
    } catch {
      /* storage can be blocked: the choice just won't persist */
    }
  }

  return { isDark, toggle, sync }
}
