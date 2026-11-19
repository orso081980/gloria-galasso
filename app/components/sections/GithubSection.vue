<script setup lang="ts">
import { formatPartialDate } from '~/domain/cv/period'
import { languageColor, selectShowcaseRepos } from '~/domain/github/showcase'

const { profile, copy, ui } = useCv()
const { kicker, title, intro, cta, noDescription, pushedLabel } = copy.github
const { data } = useGithubRepos()

const repos = computed(() => selectShowcaseRepos(data.value ?? []))
const githubUrl = profile.links.find((link) => link.id === 'github')?.url ?? 'https://github.com'
const handle = githubUrl.split('/').filter(Boolean).pop() ?? ''
</script>

<template>
  <section id="github" class="bg-surface/60 py-20" aria-labelledby="github-title">
    <div class="mx-auto max-w-6xl px-5 sm:px-8">
      <SectionHeading
        id="github-title"
        :kicker="kicker"
        :title="title"
        :intro="intro"
      />

      <ul class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <RevealOnScroll v-for="(repo, index) in repos" :key="repo.name" as="li" :delay="index * 80" class="h-full">
          <article class="group relative flex h-full flex-col rounded-3xl border border-line bg-paper p-6 shadow-sm transition hover:-translate-y-1 hover:border-violet hover:shadow-xl">
            <div class="flex items-center gap-2 font-mono text-xs text-muted">
              <AppIcon name="github" :size="16" />
              <span>{{ handle }}</span>
            </div>

            <h3 class="mt-3 break-words font-mono text-lg font-bold leading-snug">
              <a
                :href="repo.url"
                target="_blank"
                rel="noopener noreferrer"
                class="text-violet after:absolute after:inset-0 after:rounded-3xl after:content-[''] hover:underline"
              >
                {{ repo.name }}<span class="sr-only"> ({{ ui.opensInNewTab }})</span>
              </a>
            </h3>

            <p class="mt-3 flex-1 text-sm leading-relaxed">{{ repo.description?.trim() || noDescription }}</p>

            <p class="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-muted">
              <span v-if="repo.language" class="inline-flex items-center gap-1.5">
                <span class="size-2.5 rounded-full" :style="{ backgroundColor: languageColor(repo.language) }" aria-hidden="true" />
                {{ repo.language }}
              </span>
              <span v-if="repo.stars > 0" class="inline-flex items-center gap-1.5">
                <FaIcon name="star" />
                {{ repo.stars }}
              </span>
              <span class="inline-flex items-center gap-1.5">
                <FaIcon name="code-commit" />
                {{ pushedLabel }} {{ formatPartialDate(repo.pushedAt.slice(0, 7), ui) }}
              </span>
            </p>
          </article>
        </RevealOnScroll>
      </ul>

      <RevealOnScroll class="mt-10 text-center">
        <a
          :href="githubUrl"
          target="_blank"
          rel="noopener noreferrer"
          data-brand="github"
          class="brand-btn inline-flex items-center gap-2 rounded-full border-2 border-ink px-6 py-3 font-semibold transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          <AppIcon name="github" :size="18" />
          {{ cta }}
          <span class="sr-only">({{ ui.opensInNewTab }})</span>
        </a>
      </RevealOnScroll>
    </div>
  </section>
</template>
