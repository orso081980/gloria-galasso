<script setup lang="ts">
const { profile, copy, ui } = useCv()
const homeLabel = ui.homeLabel.replace('{name}', profile.name)
const emailLabel = ui.emailAria.replace('{email}', profile.email)

const links = copy.header.nav
const ctaLabel = copy.header.cta
const downloadLabel = copy.hero.secondaryCta
const githubLinks = profile.links

const menuOpen = ref(false)
const scrolled = ref(false)
const overlay = ref<HTMLElement | null>(null)
const menuButton = ref<HTMLButtonElement | null>(null)
const closeButton = ref<HTMLButtonElement | null>(null)

function onScroll() {
  scrolled.value = window.scrollY > 12
}

function closeMenu() {
  menuOpen.value = false
}

function onKeydown(event: KeyboardEvent) {
  if (!menuOpen.value) return
  if (event.key === 'Escape') {
    closeMenu()
    return
  }
  // Keep keyboard focus inside the open menu.
  if (event.key === 'Tab' && overlay.value) {
    const focusable = overlay.value.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (!first || !last) return
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }
}

// Lock page scroll while the menu is open and move focus in and out of it.
watch(menuOpen, async (open) => {
  document.documentElement.classList.toggle('overflow-hidden', open)
  await nextTick()
  if (open) closeButton.value?.focus({ preventScroll: true })
  else menuButton.value?.focus({ preventScroll: true })
})

let desktopQuery: MediaQueryList | undefined
const onDesktop = (event: MediaQueryListEvent) => {
  if (event.matches) closeMenu()
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKeydown)
  desktopQuery = window.matchMedia('(min-width: 1024px)')
  desktopQuery.addEventListener('change', onDesktop)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKeydown)
  desktopQuery?.removeEventListener('change', onDesktop)
  document.documentElement.classList.remove('overflow-hidden')
})
</script>

<template>
  <header
    class="sticky top-0 z-40 border-b transition-colors duration-300"
    :class="scrolled ? 'border-line bg-paper/90 backdrop-blur' : 'border-transparent bg-transparent'"
  >
    <div class="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
      <a href="#top" class="flex items-center gap-2 font-display text-lg font-bold" :aria-label="homeLabel">
        <span class="grid size-9 place-items-center rounded-xl bg-ink text-sm font-black text-paper">GG</span>
        <span class="hidden sm:inline lg:hidden xl:inline">{{ profile.name }}</span>
      </a>

      <nav class="hidden items-center gap-0.5 lg:flex xl:gap-1" :aria-label="ui.mainNav">
        <a
          v-for="link in links"
          :key="link.href"
          :href="link.href"
          class="rounded-full px-2.5 py-2 text-sm font-medium text-muted transition hover:bg-surface hover:text-ink xl:px-3"
        >
          {{ link.label }}
        </a>
      </nav>

      <div class="flex items-center gap-2">
        <a
          href="#contact"
          class="hidden items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-paper transition hover:-translate-y-0.5 hover:shadow-lg sm:inline-flex"
        >
          <FaIcon name="envelope" />
          {{ ctaLabel }}
        </a>
        <LanguageSwitcher />
        <ThemeToggle />
        <button
          ref="menuButton"
          type="button"
          class="inline-flex size-10 items-center justify-center rounded-full border border-line bg-surface lg:hidden"
          :aria-expanded="menuOpen"
          aria-controls="mobile-nav"
          :aria-label="ui.openMenu"
          @click="menuOpen = true"
        >
          <AppIcon name="menu" />
        </button>
      </div>
    </div>
  </header>

  <!-- Full-height mobile menu. It is a sibling of <header> on purpose: the header's backdrop blur
       would otherwise become the containing block of this fixed overlay. -->
  <Transition name="menu">
    <div
      v-if="menuOpen"
      id="mobile-nav"
      ref="overlay"
      class="fixed inset-0 z-50 flex h-dvh flex-col bg-paper lg:hidden"
      role="dialog"
      aria-modal="true"
      :aria-label="ui.menuDialog"
    >
      <div class="flex h-16 shrink-0 items-center justify-between px-5">
        <a href="#top" class="flex items-center gap-2 font-display text-lg font-bold" :aria-label="homeLabel" @click="closeMenu">
          <span class="grid size-9 place-items-center rounded-xl bg-ink text-sm font-black text-paper">GG</span>
        </a>
        <div class="flex items-center gap-2">
          <ThemeToggle />
          <button
            ref="closeButton"
            type="button"
            class="inline-flex size-10 items-center justify-center rounded-full border border-line bg-surface"
            :aria-label="ui.closeMenu"
            @click="closeMenu"
          >
            <AppIcon name="x" />
          </button>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto px-5 pb-6 pt-2">
        <!-- about the person -->
        <div class="menu-item flex items-center gap-4 rounded-3xl border border-line bg-surface p-4" style="--i: 0">
          <picture class="shrink-0">
            <source :srcset="profile.photo.webp" type="image/webp">
            <img :src="profile.photo.jpg" alt="" width="64" height="64" class="size-16 rounded-2xl object-cover">
          </picture>
          <div class="min-w-0">
            <p class="font-display text-xl font-bold leading-tight">{{ profile.name }}</p>
            <p class="text-sm font-semibold text-violet">{{ profile.headline }}</p>
            <p class="mt-1 flex items-center gap-1.5 text-xs text-muted">
              <FaIcon name="location-dot" />
              {{ profile.location }}
            </p>
          </div>
        </div>
        <p class="menu-item mt-4 flex items-center gap-2 text-sm font-medium" style="--i: 1">
          <span class="relative flex size-2.5" aria-hidden="true">
            <span class="absolute inline-flex size-full animate-ping rounded-full bg-mint opacity-75" />
            <span class="relative inline-flex size-2.5 rounded-full bg-mint" />
          </span>
          {{ profile.availability }}
        </p>
        <p class="menu-item mt-2 text-muted" style="--i: 2">{{ profile.tagline }}</p>

        <!-- navigation -->
        <nav class="mt-6" :aria-label="ui.mobileNav">
          <ul class="grid gap-1">
            <li v-for="(link, index) in links" :key="link.href" class="menu-item" :style="{ '--i': index + 3 }">
              <a
                :href="link.href"
                class="block rounded-2xl px-3 py-3.5 font-display text-3xl font-bold transition hover:bg-surface"
                @click="closeMenu"
              >
                {{ link.label }}
              </a>
            </li>
          </ul>
        </nav>

        <div class="menu-item mt-6" style="--i: 9">
          <LanguageSwitcher variant="inline" @navigate="closeMenu" />
        </div>
      </div>

      <!-- pinned at the bottom: call to action + social links -->
      <div class="shrink-0 border-t border-line bg-paper px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
        <a
          href="#contact"
          class="flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-lg font-semibold text-paper"
          @click="closeMenu"
        >
          <FaIcon name="envelope" />
          {{ ctaLabel }}
        </a>

        <ul class="mt-4 flex items-center justify-center gap-3">
          <li v-for="link in githubLinks" :key="link.id">
            <a
              :href="link.url"
              target="_blank"
              rel="noopener noreferrer"
              :data-brand="link.id"
              class="brand-btn inline-flex size-12 items-center justify-center rounded-full border border-line bg-surface transition"
              :aria-label="`${link.label} (${ui.opensInNewTab})`"
            >
              <AppIcon :name="link.id" />
            </a>
          </li>
          <li>
            <a
              :href="`mailto:${profile.email}`"
              data-brand="mail"
              class="brand-btn inline-flex size-12 items-center justify-center rounded-full border border-line bg-surface transition"
              :aria-label="emailLabel"
            >
              <AppIcon name="mail" />
            </a>
          </li>
          <li>
            <a
              :href="profile.cvPdf"
              download
              data-brand="cv"
              class="brand-btn inline-flex size-12 items-center justify-center rounded-full border border-line bg-surface transition"
              :aria-label="downloadLabel"
            >
              <AppIcon name="download" />
            </a>
          </li>
        </ul>
        <p class="mt-3 text-center font-mono text-xs text-muted">{{ profile.email }}</p>
      </div>
    </div>
  </Transition>
</template>
