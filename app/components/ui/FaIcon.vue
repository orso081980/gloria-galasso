<script setup lang="ts">
import { config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// The Font Awesome CSS is imported once in main.css (avoids a flash of huge icons during SSR).
config.autoAddCss = false

const props = defineProps<{ name?: string }>()

const icon = computed(() => (props.name ? FA_ICONS[props.name] : undefined))

if (import.meta.dev && props.name && !FA_ICONS[props.name]) {
  console.warn(`[FaIcon] unknown icon "${props.name}". Add it to app/utils/fa-icons.ts`)
}
</script>

<template>
  <FontAwesomeIcon v-if="icon" :icon="icon" fixed-width aria-hidden="true" />
</template>
