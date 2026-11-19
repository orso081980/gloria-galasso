# Gloria Galasso: personal CV website

A playful-but-professional CV site for Gloria Galasso, NLP and LLM data scientist.
Nuxt 4 · Vue 3 · TypeScript · Tailwind CSS 4 · fully static, ready for **Cloudflare Pages**.

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck  # vue-tsc
npm run generate   # static build -> .output/public
npm run preview    # serve the production build
```

Requires Node >= 20.19 (`.node-version` pins 22 for Cloudflare).

## Deploy on Cloudflare Pages

Connect the GitHub repo in **Workers & Pages → Create → Pages → Connect to Git** and use:

| Setting                | Value                  |
| ---------------------- | ---------------------- |
| Framework preset       | Nuxt.js (Static)       |
| Build command          | `npm run generate`     |
| Build output directory | `.output/public`       |
| Environment variable   | `NUXT_PUBLIC_SITE_URL` = the final site URL, e.g. `https://gloria-galasso.pages.dev` or her custom domain |

`NUXT_PUBLIC_SITE_URL` feeds the canonical URL, Open Graph tags, `robots.txt` and `sitemap.xml`.
Set it (and re-deploy) once the real domain is known.

Direct upload from the terminal (no Git integration) is also possible:

```bash
npx wrangler login
npm run deploy     # generate + wrangler pages deploy .output/public
```

`public/_headers` adds security headers and long-lived caching for fingerprinted assets.

## Editing the content

All text lives in **one file**: [`app/infrastructure/content/gloria.data.ts`](app/infrastructure/content/gloria.data.ts)
(profile, stats, experience, projects, skills, languages, education and the "Ask the model" answers).
Replace `public/cv-gloria-galasso.pdf` and `public/images/gloria.*` to update the CV download and portrait.
`public/og-image.png` is the social preview card (1200×630).

## Architecture (light DDD)

```
app/
├── domain/cv/            # Entities, value objects and the repository port. Pure TS, no Vue.
│   ├── types.ts
│   ├── period.ts         # date formatting, language level -> percentage
│   └── cv.repository.ts
├── infrastructure/content/   # Adapter: static typed content implementing the port
├── composables/          # Application layer: useCv, useTheme, useInView, useCountUp, useTypewriter, useTextStream, useSiteSeo
├── components/
│   ├── layout/           # AppHeader, AppFooter
│   ├── sections/         # One component per page section
│   └── ui/               # Reusable presentational pieces
└── app.vue
server/routes/            # robots.txt + sitemap.xml (prerendered)
```

Dependencies point inwards: components → composables → domain ← infrastructure.

## Quality checklist

- **SEO**: meta/Open Graph/Twitter tags, canonical URL, schema.org `Person` JSON-LD, sitemap, robots, semantic headings.
- **Accessibility**: skip link, landmarks, keyboard-friendly nav, visible focus, `aria-live` for the interactive demo, AA colour contrast in light and dark, `prefers-reduced-motion` respected.
- **Performance**: static HTML, self-hosted fonts (via `@nuxt/fonts`), WebP portrait, no runtime dependencies beyond Vue.
- **Progressive enhancement**: content is fully visible without JavaScript (scroll animations only activate when JS runs).
