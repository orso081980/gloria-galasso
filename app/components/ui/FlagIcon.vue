<script setup lang="ts">
// Tree-shaken: only these flags end up in the bundle (country-flag-icons, 3:2 SVG strings).
import { BE, DE, ES, FR, GB, IT, US } from 'country-flag-icons/string/3x2'
import type { CountryCode } from '~/domain/cv/types'

const props = defineProps<{ code: CountryCode }>()

const FLAGS: Record<CountryCode, string> = { BE, DE, ES, FR, GB, IT, US }
const svg = computed(() => FLAGS[props.code])
</script>

<template>
  <span
    class="inline-block h-5 w-[1.875rem] shrink-0 overflow-hidden rounded-[4px] shadow-sm ring-1 ring-black/10 [&>svg]:block [&>svg]:size-full"
    aria-hidden="true"
    v-html="svg"
  />
</template>
