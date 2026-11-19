import tailwindcss from '@tailwindcss/vite'

// Runs before first paint: applies the saved/system colour scheme (no flash)
// and flags that JS is available so scroll-reveal never hides content without it.
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches)){d.classList.add('dark')}}catch(e){}})();`

export default defineNuxtConfig({
  compatibilityDate: '2026-11-01',
  devtools: { enabled: true },
  typescript: { strict: true },

  // Fully static site -> `nuxt generate` -> `.output/public` (Cloudflare Pages).
  ssr: true,

  modules: ['@nuxt/fonts'],
  css: ['~/assets/css/main.css'],
  build: { transpile: ['@fortawesome/vue-fontawesome'] },
  vite: { plugins: [tailwindcss()] },

  // Components are organised in folders (layout/sections/ui) but referenced by file name.
  components: [{ path: '~/components', pathPrefix: false }],

  fonts: {
    families: [
      { name: 'Fraunces', provider: 'google', weights: [600, 700, 900], styles: ['normal', 'italic'] },
      { name: 'Inter', provider: 'google', weights: [400, 500, 600, 700] },
      { name: 'JetBrains Mono', provider: 'google', weights: [400, 500, 700] },
    ],
  },

  runtimeConfig: {
    // Optional GitHub token (server only, build time). Only raises the API rate limit.
    githubToken: '',
    public: {
      // Override with NUXT_PUBLIC_SITE_URL (Cloudflare Pages env var).
      siteUrl: 'https://gloria-galasso.pages.dev',
      // Cloudflare Web Analytics beacon token (NUXT_PUBLIC_CF_ANALYTICS_TOKEN). Empty = no analytics script.
      cfAnalyticsToken: '',
      // Frozen at build time so structured data and sitemap always agree.
      buildDate: new Date().toISOString().slice(0, 10),
    },
  },

  nitro: {
    prerender: {
      routes: [
        '/it',
        '/de',
        '/sitemap.xml',
        '/robots.txt',
        '/llms.txt',
        '/llms-full.txt',
        '/it/llms.txt',
        '/it/llms-full.txt',
        '/de/llms.txt',
        '/de/llms-full.txt',
      ],
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [
        // Her face, as a circle (tab icon), plus the sizes Google, Android and iOS ask for.
        { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
        { rel: 'icon', type: 'image/png', href: '/favicon-48.png', sizes: '48x48' },
        { rel: 'icon', type: 'image/png', href: '/icon-192.png', sizes: '192x192' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
      ],
      meta: [
        { name: 'theme-color', content: '#fbf7f0', media: '(prefers-color-scheme: light)' },
        { name: 'theme-color', content: '#0f1120', media: '(prefers-color-scheme: dark)' },
      ],
      script: [{ innerHTML: bootScript, tagPosition: 'head' }],
      noscript: [{ innerHTML: '<style>.reveal{opacity:1!important;transform:none!important}</style>' }],
    },
  },
})
