<script setup lang="ts">
import { formatPeriod } from '~/domain/cv/period'

const { projects } = useCv()
</script>

<template>
  <section id="projects" class="mx-auto max-w-6xl px-5 py-20 sm:px-8" aria-labelledby="projects-title">
    <SectionHeading
      id="projects-title"
      kicker="// showcase"
      title="NLP & speech projects"
      intro="Two experiments she is happy to talk about for far too long."
    />

    <div class="grid gap-6 lg:grid-cols-2">
      <RevealOnScroll v-for="(project, index) in projects" :key="project.id" as="div" :delay="index * 120" class="h-full">
        <article class="flex h-full flex-col rounded-3xl border border-line bg-surface p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl sm:p-8">
          <div class="flex flex-wrap items-center justify-between gap-2 font-mono text-sm text-muted">
            <span>{{ formatPeriod(project.period) }}</span>
          </div>

          <h3 class="mt-3 font-display text-2xl font-bold leading-snug">{{ project.title }}</h3>
          <p class="mt-1 text-violet">{{ project.institution }}</p>

          <ul class="mt-5 space-y-3">
            <li v-for="highlight in project.highlights" :key="highlight" class="flex gap-3">
              <span class="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
              <span>{{ highlight }}</span>
            </li>
          </ul>

          <ul class="mt-6 flex flex-wrap gap-2" aria-label="Technologies">
            <li v-for="tag in project.tags" :key="tag" class="rounded-lg bg-paper px-2.5 py-1 font-mono text-xs ring-1 ring-line">
              {{ tag }}
            </li>
          </ul>

          <p v-if="project.quip" class="mt-auto pt-6 font-mono text-sm italic text-muted">
            <span aria-hidden="true">// </span>{{ project.quip }}
          </p>
        </article>
      </RevealOnScroll>
    </div>
  </section>
</template>
