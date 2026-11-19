<script setup lang="ts">
const { profile } = useCv()

const copied = ref(false)
let resetTimer: ReturnType<typeof setTimeout> | undefined

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(profile.email)
    copied.value = true
    clearTimeout(resetTimer)
    resetTimer = setTimeout(() => (copied.value = false), 2200)
  } catch {
    window.location.href = `mailto:${profile.email}`
  }
}

onBeforeUnmount(() => clearTimeout(resetTimer))
</script>

<template>
  <section id="contact" class="mx-auto max-w-6xl px-5 py-20 sm:px-8" aria-labelledby="contact-title">
    <RevealOnScroll class="on-night relative overflow-hidden rounded-[2.5rem] bg-night px-6 py-16 text-center text-night-fg sm:px-12">
      <div class="pointer-events-none absolute inset-0" aria-hidden="true">
        <div class="animate-float absolute -left-10 -top-10 size-64 rounded-full bg-accent/40 blur-3xl" />
        <div class="animate-float absolute -bottom-16 -right-10 size-72 rounded-full bg-violet/50 blur-3xl [animation-delay:-4s]" />
      </div>

      <div class="relative">
        <p class="font-mono text-sm font-medium text-[#ffb59f]">// deploy_gloria.sh</p>
        <h2 id="contact-title" class="mx-auto mt-3 max-w-2xl font-display text-4xl font-black leading-tight sm:text-6xl">
          Ready to ship her to your team?
        </h2>
        <p class="mx-auto mt-5 max-w-xl text-lg opacity-80">
          Looking for an NLP / LLM data scientist who writes tested code, explains her models and speaks five languages? Say hello. She replies faster than a cached response.
        </p>

        <div class="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a
            :href="`mailto:${profile.email}?subject=Hello%20Gloria`"
            class="inline-flex items-center gap-2 rounded-full bg-coral px-7 py-3.5 font-semibold text-night transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            <AppIcon name="mail" :size="18" />
            {{ profile.email }}
          </a>
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-full border-2 border-white/40 px-6 py-3 font-semibold transition hover:-translate-y-0.5 hover:border-white"
            @click="copyEmail"
          >
            <AppIcon :name="copied ? 'check' : 'copy'" :size="18" />
            {{ copied ? 'Copied!' : 'Copy email' }}
          </button>
          <span class="sr-only" role="status" aria-live="polite">{{ copied ? 'Email address copied' : '' }}</span>
        </div>

        <ul class="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm font-semibold">
          <li v-for="link in profile.links" :key="link.id">
            <a
              :href="link.url"
              target="_blank"
              rel="noopener noreferrer"
              :data-brand="link.id"
              class="brand-btn inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-5 py-2.5 transition hover:-translate-y-0.5"
            >
              <AppIcon :name="link.id" :size="18" />
              {{ link.label }}
              <span class="sr-only">(opens in a new tab)</span>
            </a>
          </li>
          <li>
            <a
              :href="profile.cvPdf"
              download
              data-brand="cv"
              class="brand-btn inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-5 py-2.5 transition hover:-translate-y-0.5"
            >
              <AppIcon name="download" :size="18" />
              CV (PDF)
            </a>
          </li>
        </ul>
      </div>
    </RevealOnScroll>
  </section>
</template>
