<script setup lang="ts">
const { isDark, toggle, sync } = useTheme()
const { ui } = useCv()

// The class on <html> is set before hydration; read it once mounted.
onMounted(sync)
</script>

<template>
  <button
    type="button"
    class="inline-flex size-10 items-center justify-center rounded-full border border-line bg-surface text-ink transition hover:-translate-y-0.5 hover:border-violet hover:bg-violet hover:text-paper"
    :aria-pressed="isDark"
    :aria-label="ui.themeToggle"
    @click="toggle"
  >
    <AppIcon name="moon" class="dark:hidden" />
    <AppIcon name="sun" class="hidden dark:block" />
  </button>
</template>
