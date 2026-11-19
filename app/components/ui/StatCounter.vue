<script setup lang="ts">
import type { Stat } from '~/domain/cv/types'

const props = defineProps<{ stat: Stat }>()

const el = ref<HTMLElement | null>(null)
const inView = useInView(el, { threshold: 0.5 })
const value = useCountUp(props.stat.value, inView)

const display = computed(() => {
  const decimals = props.stat.decimals ?? 0
  const text = value.value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
  return `${text}${props.stat.suffix ?? ''}`
})
</script>

<template>
  <div ref="el" class="rounded-2xl border border-line bg-surface p-5 text-center shadow-sm">
    <p class="font-display text-4xl font-black tabular-nums text-violet sm:text-5xl">{{ display }}</p>
    <p class="mt-2 text-sm text-muted">{{ stat.label }}</p>
  </div>
</template>
