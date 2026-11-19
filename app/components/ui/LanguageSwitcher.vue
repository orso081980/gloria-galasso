<script setup lang="ts">
import { LOCALES, LOCALE_INFO, localePath } from '~/domain/i18n/locales'

/**
 * Language switcher. Each language is a real link to its own URL (/, /it, /de), so it works without
 * JavaScript and search engines can follow it.
 *  - "menu":   one flag button that opens a small list (used in the header)
 *  - "inline": all languages side by side (used in the mobile menu)
 */
const props = withDefaults(defineProps<{ variant?: 'menu' | 'inline' }>(), { variant: 'menu' })
const emit = defineEmits<{ navigate: [] }>()

const route = useRoute()
const locale = useLocale()
const { ui } = useCv()

const current = computed(() => LOCALE_INFO[locale.value])
// Keep the section the visitor is reading (#faq...) when switching language.
const target = (code: (typeof LOCALES)[number]) => ({ path: localePath(code), hash: route.hash })

const open = ref(false)
const root = ref<HTMLElement | null>(null)
const button = ref<HTMLButtonElement | null>(null)

function close(returnFocus = false) {
  open.value = false
  if (returnFocus) button.value?.focus()
}

function onDocumentClick(event: MouseEvent) {
  if (open.value && root.value && !root.value.contains(event.target as Node)) close()
}
function onKeydown(event: KeyboardEvent) {
  if (open.value && event.key === 'Escape') close(true)
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onKeydown)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <!-- header: one flag, opens a list -->
  <div v-if="props.variant === 'menu'" ref="root" class="relative">
    <button
      ref="button"
      type="button"
      class="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-surface pl-3 pr-2.5 text-sm font-semibold transition hover:border-violet"
      :aria-expanded="open"
      aria-haspopup="true"
      :aria-label="`${ui.language}: ${current.name}`"
      @click="open = !open"
    >
      <FlagIcon :code="current.flag" />
      <span class="uppercase" aria-hidden="true">{{ current.code }}</span>
      <FaIcon name="chevron-down" class="text-xs text-muted transition-transform duration-200" :class="open ? 'rotate-180' : ''" />
    </button>

    <ul
      v-show="open"
      class="absolute right-0 top-full z-50 mt-2 min-w-44 overflow-hidden rounded-2xl border border-line bg-paper p-1.5 shadow-xl"
      :aria-label="ui.language"
    >
      <li v-for="code in LOCALES" :key="code">
        <NuxtLink
          :to="target(code)"
          :lang="LOCALE_INFO[code].htmlLang"
          :hreflang="LOCALE_INFO[code].htmlLang"
          class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition hover:bg-surface"
          :class="code === locale ? 'bg-violet-soft text-violet' : ''"
          :aria-current="code === locale ? 'true' : undefined"
          @click="close()"
        >
          <FlagIcon :code="LOCALE_INFO[code].flag" />
          {{ LOCALE_INFO[code].name }}
        </NuxtLink>
      </li>
    </ul>
  </div>

  <!-- mobile menu: all languages in a row -->
  <ul v-else class="flex flex-wrap gap-2" :aria-label="ui.language">
    <li v-for="code in LOCALES" :key="code">
      <NuxtLink
        :to="target(code)"
        :lang="LOCALE_INFO[code].htmlLang"
        :hreflang="LOCALE_INFO[code].htmlLang"
        class="inline-flex items-center gap-2.5 rounded-full border px-4 py-2.5 text-sm font-semibold transition"
        :class="code === locale ? 'border-violet bg-violet-soft text-violet' : 'border-line bg-surface hover:border-violet'"
        :aria-current="code === locale ? 'true' : undefined"
        @click="emit('navigate')"
      >
        <FlagIcon :code="LOCALE_INFO[code].flag" />
        {{ LOCALE_INFO[code].name }}
      </NuxtLink>
    </li>
  </ul>
</template>
