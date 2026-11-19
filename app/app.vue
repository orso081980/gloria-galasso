<script setup lang="ts">
useSiteSeo()
</script>

<template>
  <a
    href="#main"
    class="sr-only z-50 rounded-lg bg-ink px-4 py-2 font-semibold text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
  >
    Skip to content
  </a>

  <AppHeader />

  <main id="main">
    <HeroSection />
    <AboutSection />
    <ExperienceSection />
    <ProjectsSection />
    <SkillsSection />
    <EducationSection />
    <AskTheModelSection />
    <ContactSection />
  </main>

  <AppFooter />
</template>
