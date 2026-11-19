<script setup lang="ts">
const { profile } = useCv()
</script>

<template>
  <footer class="border-t border-line">
    <div class="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 text-sm text-muted sm:px-8 md:flex-row md:items-center md:justify-between">
      <p>
        © {{ new Date().getFullYear() }} {{ profile.name }}.
        <span class="font-mono">loss: 0.00 · status: hireable</span>
      </p>
      <p>Built with Nuxt, Vue, TypeScript and Tailwind. No GPUs were harmed.</p>
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
