<script setup lang="ts">
const { isDark, toggle, sync } = useTheme()

// The class on <html> is set before hydration; read it once mounted.
onMounted(sync)
</script>

<template>
  <button
    type="button"
    class="inline-flex size-10 items-center justify-center rounded-full border border-line bg-surface text-ink transition hover:-translate-y-0.5 hover:border-violet hover:text-violet"
    :aria-pressed="isDark"
    aria-label="Dark mode"
    @click="toggle"
  >
    <AppIcon name="moon" class="dark:hidden" />
    <AppIcon name="sun" class="hidden dark:block" />
  </button>
</template>
