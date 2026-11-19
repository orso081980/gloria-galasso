<script setup lang="ts">
const { profile } = useCv()
const focus = useTypewriter(profile.focusAreas)
</script>

<template>
  <section id="top" class="relative overflow-hidden" aria-labelledby="hero-title">
    <!-- decorative background -->
    <div class="pointer-events-none absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black_60%,transparent)]" aria-hidden="true">
      <div class="dot-grid absolute inset-0 opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      <div class="animate-float absolute -left-24 top-10 size-80 rounded-full bg-accent/25 blur-3xl" />
      <div class="animate-float absolute -right-16 top-40 size-96 rounded-full bg-violet/25 blur-3xl [animation-delay:-3s]" />
      <div class="animate-float absolute bottom-0 left-1/3 size-72 rounded-full bg-mint/20 blur-3xl [animation-delay:-6s]" />
    </div>

    <div class="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-12 sm:px-8 md:pt-20 lg:grid-cols-[1.25fr_1fr] lg:gap-16 lg:pb-28">
      <div>
        <p class="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-sm font-medium shadow-sm">
          <span class="relative flex size-2.5" aria-hidden="true">
            <span class="absolute inline-flex size-full animate-ping rounded-full bg-mint opacity-75" />
            <span class="relative inline-flex size-2.5 rounded-full bg-mint" />
          </span>
          {{ profile.availability }}
        </p>

        <h1 id="hero-title" class="mt-6 font-display text-5xl font-black leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
          {{ profile.name }}
          <span class="mt-2 block text-3xl font-bold italic text-violet sm:text-4xl lg:text-5xl">
            {{ profile.headline }}
          </span>
        </h1>

        <p class="mt-6 max-w-xl text-xl text-muted">
          {{ profile.tagline }}
        </p>

        <p class="mt-4 font-mono text-base">
          <span class="text-muted">currently obsessed with:</span>
          <span class="sr-only">{{ profile.focusAreas.join(', ') }}</span>
          <span class="ml-2 font-medium text-accent" aria-hidden="true">{{ focus }}<span class="animate-blink">▍</span></span>
        </p>

        <div class="mt-8 flex flex-wrap gap-3">
          <a
            href="#contact"
            class="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 font-semibold text-paper transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            Let's talk
            <AppIcon name="arrow-right" :size="18" class="transition group-hover:translate-x-1" />
          </a>
          <a
            :href="profile.cvPdf"
            download
            class="inline-flex items-center gap-2 rounded-full border-2 border-ink px-6 py-3 font-semibold transition hover:-translate-y-0.5 hover:bg-surface"
          >
            <AppIcon name="download" :size="18" />
            Download CV
          </a>
        </div>

        <ul class="mt-6 flex items-center gap-3">
          <li v-for="link in profile.links" :key="link.id">
            <a
              :href="link.url"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex size-11 items-center justify-center rounded-full border border-line bg-surface transition hover:-translate-y-0.5 hover:border-violet hover:text-violet"
              :aria-label="`${link.label} (opens in a new tab)`"
            >
              <AppIcon :name="link.id" />
            </a>
          </li>
          <li class="ml-2 inline-flex items-center gap-1.5 text-sm text-muted">
            <AppIcon name="pin" :size="16" />
            {{ profile.location }}
          </li>
        </ul>

        <div class="mt-8">
          <TokenizedName />
        </div>
      </div>

      <!-- Portrait run through an "object detector" -->
      <figure class="relative mx-auto w-full max-w-sm lg:max-w-none">
        <div class="relative rounded-[2rem] bg-surface p-3 shadow-2xl shadow-violet/20 ring-1 ring-line">
          <picture>
            <source :srcset="profile.photo.webp" type="image/webp">
            <img
              :src="profile.photo.jpg"
              :alt="profile.photo.alt"
              width="640"
              height="640"
              fetchpriority="high"
              class="aspect-square w-full rounded-3xl object-cover"
            >
          </picture>

          <div class="pointer-events-none absolute inset-3 overflow-hidden rounded-3xl" aria-hidden="true">
            <div class="animate-scan absolute inset-x-0 h-0.5 bg-mint shadow-[0_0_14px_3px_var(--mint)]" />
            <span class="absolute left-3 top-3 size-8 rounded-tl-xl border-l-4 border-t-4 border-accent" />
            <span class="absolute right-3 top-3 size-8 rounded-tr-xl border-r-4 border-t-4 border-accent" />
            <span class="absolute bottom-3 left-3 size-8 rounded-bl-xl border-b-4 border-l-4 border-accent" />
            <span class="absolute bottom-3 right-3 size-8 rounded-br-xl border-b-4 border-r-4 border-accent" />
          </div>
        </div>

        <figcaption
          class="absolute -bottom-4 left-6 rounded-lg bg-accent px-3 py-1.5 font-mono text-xs font-bold text-paper shadow-lg"
          aria-hidden="true"
        >
          person: gloria · 0.99
        </figcaption>
        <p
          class="absolute -right-2 top-8 hidden rotate-6 rounded-xl border border-line bg-sun-soft px-3 py-2 text-sm font-semibold shadow-lg sm:block"
          aria-hidden="true"
        >
          Wants: a great team ✨
        </p>
      </figure>
    </div>
  </section>
</template>
