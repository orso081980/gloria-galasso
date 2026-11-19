<script setup lang="ts">
const { profile, stats } = useCv()
const paragraphs = profile.summary
</script>

<template>
  <section id="about" class="mx-auto max-w-6xl px-5 py-20 sm:px-8" aria-labelledby="about-title">
    <SectionHeading id="about-title" kicker="// about" title="The short version" />

    <div class="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-start">
      <RevealOnScroll class="space-y-5 text-lg leading-relaxed">
        <p v-for="paragraph in paragraphs" :key="paragraph">{{ paragraph }}</p>
        <p class="text-muted">
          Her path: <span class="marker font-medium text-ink">linguistics → international development → computational linguistics</span>.
          It explains why she cares as much about the people behind the data as about the F1 score.
        </p>
      </RevealOnScroll>

      <ul class="grid grid-cols-2 gap-4">
        <RevealOnScroll v-for="(stat, index) in stats" :key="stat.id" as="li" :delay="index * 90">
          <StatCounter :stat="stat" />
        </RevealOnScroll>
      </ul>
    </div>
  </section>
</template>
