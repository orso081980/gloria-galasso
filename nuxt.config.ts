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
    public: {
      // Override with NUXT_PUBLIC_SITE_URL (Cloudflare Pages env var).
      siteUrl: 'https://gloria-galasso.pages.dev',
    },
  },

  nitro: {
    prerender: {
      routes: ['/sitemap.xml', '/robots.txt'],
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
      meta: [
        { name: 'theme-color', content: '#fbf7f0', media: '(prefers-color-scheme: light)' },
        { name: 'theme-color', content: '#0f1120', media: '(prefers-color-scheme: dark)' },
      ],
      script: [{ innerHTML: bootScript, tagPosition: 'head' }],
      noscript: [{ innerHTML: '<style>.reveal{opacity:1!important;transform:none!important}</style>' }],
    },
  },
})
