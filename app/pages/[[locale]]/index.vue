<script setup lang="ts">
// One page, three URLs: "/" (English), "/it" and "/de". Anything else is a 404.
definePageMeta({
  // Re-create the whole page when the language changes, so every component reads the new content.
  key: (route) => route.path,
  validate: (route) => {
    const locale = route.params.locale
    return !locale || locale === 'it' || locale === 'de'
  },
})

const { ui } = useCv()
useSiteSeo()
</script>

<template>
  <a
    href="#main"
    class="sr-only z-50 rounded-lg bg-ink px-4 py-2 font-semibold text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
  >
    {{ ui.skipLink }}
  </a>

  <AppHeader />

  <main id="main">
    <HeroSection />
    <ExperienceSection />
    <ProjectsSection />
    <SkillsSection />
    <EducationSection />
    <GithubSection />
    <FaqSection />
    <ContactSection />
  </main>

  <AppFooter />
</template>
