<script setup lang="ts">
const { profile } = useCv()

const links = [
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#skills', label: 'Skills' },
  { href: '#education', label: 'Education' },
  { href: '#github', label: 'GitHub' },
  { href: '#ask', label: 'GloriaGPT' },
]

const menuOpen = ref(false)
const scrolled = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 12
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') menuOpen.value = false
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKeydown)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <header
    class="sticky top-0 z-40 border-b transition-colors duration-300"
    :class="scrolled || menuOpen ? 'border-line bg-paper/90 backdrop-blur' : 'border-transparent bg-transparent'"
  >
    <div class="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
      <a href="#top" class="flex items-center gap-2 font-display text-lg font-bold" aria-label="Gloria Galasso, back to top">
        <span class="grid size-9 place-items-center rounded-xl bg-ink text-sm font-black text-paper">GG</span>
        <span class="hidden sm:inline">{{ profile.name }}</span>
      </a>

      <nav class="hidden items-center gap-1 lg:flex" aria-label="Main">
        <a
          v-for="link in links"
          :key="link.href"
          :href="link.href"
          class="rounded-full px-3 py-2 text-sm font-medium text-muted transition hover:bg-surface hover:text-ink"
        >
          {{ link.label }}
        </a>
      </nav>

      <div class="flex items-center gap-2">
        <a
          href="#contact"
          class="hidden rounded-full bg-accent px-4 py-2 text-sm font-semibold text-paper transition hover:-translate-y-0.5 hover:shadow-lg sm:inline-block"
        >
          Hire Gloria
        </a>
        <ThemeToggle />
        <button
          type="button"
          class="inline-flex size-10 items-center justify-center rounded-full border border-line bg-surface lg:hidden"
          :aria-expanded="menuOpen"
          aria-controls="mobile-nav"
          aria-label="Menu"
          @click="menuOpen = !menuOpen"
        >
          <AppIcon :name="menuOpen ? 'x' : 'menu'" />
        </button>
      </div>
    </div>

    <nav
      v-show="menuOpen"
      id="mobile-nav"
      class="border-t border-line bg-paper px-5 pb-5 pt-3 lg:hidden"
      aria-label="Main (mobile)"
    >
      <ul class="grid gap-1">
        <li v-for="link in links" :key="link.href">
          <a
            :href="link.href"
            class="block rounded-xl px-3 py-3 text-base font-medium hover:bg-surface"
            @click="menuOpen = false"
          >
            {{ link.label }}
          </a>
        </li>
        <li>
          <a
            href="#contact"
            class="mt-2 block rounded-xl bg-accent px-3 py-3 text-center font-semibold text-paper"
            @click="menuOpen = false"
          >
            Hire Gloria
          </a>
        </li>
      </ul>
    </nav>
  </header>
</template>
