<script setup lang="ts">
import { formatPeriod } from '~/domain/cv/period'

const { education, copy, ui } = useCv()
const { kicker, title, intro } = copy.education
</script>

<template>
  <section id="education" class="mx-auto max-w-6xl px-5 py-20 sm:px-8" aria-labelledby="education-title">
    <SectionHeading
      id="education-title"
      :kicker="kicker"
      :title="title"
      :intro="intro"
    />

    <div class="grid gap-6 lg:grid-cols-3">
      <RevealOnScroll v-for="(item, index) in education" :key="item.id" as="div" :delay="index * 110" class="h-full">
        <article class="flex h-full flex-col rounded-3xl border border-line bg-surface p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
          <div class="flex items-center justify-between gap-3">
            <span class="grid size-12 place-items-center rounded-2xl bg-violet-soft text-2xl text-violet">
              <FaIcon :name="item.icon" />
            </span>
            <p class="font-mono text-sm text-muted">{{ formatPeriod(item.period, ui) }}</p>
          </div>
          <h3 class="mt-4 font-display text-xl font-bold leading-snug">{{ item.degree }}</h3>
          <p class="mt-2 flex items-start gap-2 font-semibold text-violet">
            <FaIcon name="building-columns" class="mt-1 text-sm" />
            <span>{{ item.institution }}</span>
          </p>
          <p class="mt-0.5 flex items-center gap-2 text-sm text-muted">
            <FaIcon name="location-dot" class="text-xs" />
            {{ item.location }}
          </p>

          <p v-if="item.grade" class="mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-sun-soft px-3 py-1 text-sm font-bold">
            <FaIcon name="award" />
            {{ item.grade }}
          </p>

          <ul class="mt-4 space-y-2 text-sm">
            <li v-for="highlight in item.highlights" :key="highlight" class="flex gap-2.5">
              <span class="mt-2 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
              <span v-html="highlight" />
            </li>
          </ul>
        </article>
      </RevealOnScroll>
    </div>
  </section>
</template>
