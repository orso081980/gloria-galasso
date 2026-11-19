<script setup lang="ts">
const { profile, copy } = useCv()
const hero = copy.hero
const cvLabel = copy.contact.cvLabel
const focus = useTypewriter(hero.focusAreas)
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

        <!-- Contact + CV, visible without scrolling -->
        <ul class="mt-6 flex flex-wrap gap-2.5" aria-label="Contact and profiles">
          <li>
            <a
              :href="`mailto:${profile.email}`"
              data-brand="mail"
              class="brand-btn inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <AppIcon name="mail" :size="18" />
              {{ hero.emailLabel }}
            </a>
          </li>
          <li>
            <a
              :href="profile.cvPdf"
              download
              data-brand="cv"
              class="brand-btn inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <AppIcon name="download" :size="18" />
              {{ cvLabel }}
            </a>
          </li>
          <li v-for="link in profile.links" :key="link.id">
            <a
              :href="link.url"
              target="_blank"
              rel="noopener noreferrer"
              :data-brand="link.id"
              class="brand-btn inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <AppIcon :name="link.id" :size="18" />
              {{ link.label }}
              <span class="sr-only">(opens in a new tab)</span>
            </a>
          </li>
        </ul>

        <!-- Fixed height + no wrapping: the typed text can never change the layout below it. -->
        <p class="mt-4 font-mono text-base">
          <span class="block text-muted">{{ hero.obsessedLabel }}</span>
          <span class="sr-only">{{ hero.focusAreas.join(', ') }}</span>
          <span
            class="block h-7 overflow-hidden whitespace-nowrap font-medium leading-7 text-accent"
            aria-hidden="true"
          >{{ focus }}<span class="animate-blink">▍</span></span>
        </p>

        <div class="mt-8 flex flex-wrap gap-3">
          <a
            href="#contact"
            class="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 font-semibold text-paper transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            {{ hero.primaryCta }}
            <AppIcon name="arrow-right" :size="18" class="transition group-hover:translate-x-1" />
          </a>
        </div>

        <p class="mt-6 inline-flex items-center gap-1.5 text-sm text-muted">
          <AppIcon name="pin" :size="16" />
          {{ profile.location }}
        </p>

        <div class="mt-8">
          <TokenizedName :tokenizer="hero.tokenizer" />
        </div>
      </div>

      <!-- Portrait on a (slightly unwell) CRT monitor -->
      <figure class="relative mx-auto w-full max-w-sm lg:max-w-none">
        <GlitchMonitor
          :webp="profile.photo.webp"
          :jpg="profile.photo.jpg"
          :alt="profile.photo.alt"
          :osd="hero.monitor.osd"
          :label="hero.monitor.label"
        />

        <figcaption
          class="absolute -bottom-3 left-8 rounded-lg bg-accent px-3 py-1.5 font-mono text-xs font-bold text-paper shadow-lg"
          aria-hidden="true"
        >
          {{ hero.monitor.caption }}
        </figcaption>
        <p
          class="absolute -right-2 top-8 hidden rotate-6 rounded-xl border border-line bg-sun-soft px-3 py-2 text-sm font-semibold shadow-lg sm:block"
          aria-hidden="true"
        >
          {{ hero.stickyNote }}
        </p>
      </figure>
    </div>
  </section>
</template>
