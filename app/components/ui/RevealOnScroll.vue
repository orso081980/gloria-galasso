<script setup lang="ts">
const props = withDefaults(defineProps<{ as?: string; delay?: number }>(), { as: 'div', delay: 0 })

const el = ref<HTMLElement | null>(null)
const visible = useInView(el)
</script>

<template>
  <component
    :is="props.as"
    ref="el"
    class="reveal"
    :class="{ 'is-visible': visible }"
    :style="{ '--reveal-delay': `${props.delay}ms` }"
  >
    <slot />
  </component>
</template>
