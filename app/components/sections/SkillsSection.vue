<script setup lang="ts">
import { levelToPercent } from '~/domain/cv/period'

const { skills, languages, copy } = useCv()
const { kicker, title, intro } = copy.skills
const { title: languagesTitle, intro: languagesIntro, items: languageItems } = languages

const tones = ['bg-violet-soft text-violet', 'bg-accent-soft text-accent', 'bg-mint-soft text-mint', 'bg-sun-soft text-ink']
const toneFor = (n: number) => tones[n % tones.length]
</script>

<template>
  <section id="skills" class="bg-surface/60 py-20" aria-labelledby="skills-title">
    <div class="mx-auto max-w-6xl px-5 sm:px-8">
      <SectionHeading
        id="skills-title"
        :kicker="kicker"
        :title="title"
        :intro="intro"
      />

      <div class="grid gap-6 md:grid-cols-2">
        <RevealOnScroll v-for="(group, index) in skills" :key="group.id" as="div" :delay="index * 90">
          <section class="h-full rounded-3xl border border-line bg-paper p-6 shadow-sm" :aria-labelledby="`skills-${group.id}`">
            <h3 :id="`skills-${group.id}`" class="flex items-center gap-3 font-mono text-sm font-bold text-muted">
              <span class="grid size-9 shrink-0 place-items-center rounded-xl bg-accent-soft text-base text-accent">
                <FaIcon :name="group.icon" />
              </span>
              <span>
                <span class="text-accent">{{ group.key }}</span> = [
                <span class="sr-only">{{ group.label }}</span>
              </span>
            </h3>
            <ul class="mt-4 flex flex-wrap gap-2 pl-2" :aria-label="group.label">
              <li
                v-for="(skill, skillIndex) in group.skills"
                :key="skill"
                class="rounded-full px-3.5 py-1.5 text-sm font-semibold transition hover:-translate-y-0.5"
                :class="toneFor(index + skillIndex)"
              >
                {{ skill }}
              </li>
            </ul>
            <p class="mt-4 font-mono text-sm font-bold text-muted" aria-hidden="true">]</p>
          </section>
        </RevealOnScroll>
      </div>

      <!-- Languages -->
      <RevealOnScroll class="mt-10 rounded-3xl border border-line bg-paper p-6 shadow-sm sm:p-8">
        <h3 class="flex items-center gap-3 font-display text-2xl font-bold">
          <FaIcon name="globe" class="text-violet" />
          {{ languagesTitle }}
        </h3>
        <p class="mt-1 text-muted">{{ languagesIntro }}</p>

        <ul class="mt-6 grid gap-x-10 gap-y-5 md:grid-cols-2">
          <li v-for="language in languageItems" :key="language.name">
            <div class="flex items-baseline justify-between gap-3">
              <span class="inline-flex items-center gap-2.5 font-semibold">
                <FlagIcon :code="language.countryCode" />
                {{ language.name }}
              </span>
              <span class="font-mono text-sm text-muted">
                {{ language.level }}<template v-if="language.note"> · {{ language.note }}</template>
              </span>
            </div>
            <div class="mt-2 h-2.5 overflow-hidden rounded-full bg-line" aria-hidden="true">
              <div
                class="h-full rounded-full bg-gradient-to-r from-violet to-accent transition-[width] duration-1000 ease-out"
                :style="{ width: `${levelToPercent(language.level)}%` }"
              />
            </div>
          </li>
        </ul>
      </RevealOnScroll>
    </div>
  </section>
</template>
