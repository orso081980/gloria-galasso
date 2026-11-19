<script setup lang="ts">
const { profile, copy } = useCv()

const copyright = copy.footer.copyright
  .replace('{year}', String(new Date().getFullYear()))
  .replace('{name}', profile.name)
</script>

<template>
  <footer class="border-t border-line">
    <div class="mx-auto max-w-6xl px-5 pt-10 sm:px-8">
      <p class="max-w-3xl text-sm leading-relaxed text-muted">{{ copy.footer.about }}</p>
    </div>
    <div class="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 text-sm text-muted sm:px-8 md:flex-row md:items-center md:justify-between">
      <p>
        {{ copyright }}
        <span class="font-mono">{{ copy.footer.status }}</span>
      </p>
      <p>{{ copy.footer.built }}</p>
      <ul class="flex gap-4">
        <li v-for="link in profile.links" :key="link.id">
          <a :href="link.url" target="_blank" rel="noopener noreferrer" class="font-medium text-ink underline-offset-4 hover:underline">
            {{ link.label }}
          </a>
        </li>
      </ul>
    </div>
  </footer>
</template>
