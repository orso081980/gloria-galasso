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

`NUXT_GITHUB_TOKEN` (optional, secret) lets the build read her public repos without GitHub rate limits; without it the build falls back to a bundled snapshot.
`NUXT_PUBLIC_SITE_URL` feeds the canonical URL, Open Graph tags, `robots.txt` and `sitemap.xml`.
Set it (and re-deploy) once the real domain is known.

Direct upload from the terminal (no Git integration) is also possible:

```bash
npx wrangler login
npm run deploy     # generate + wrangler pages deploy .output/public
```

`public/_headers` adds security headers and long-lived caching for fingerprinted assets.

## Editing the content

All text lives in markdown files in [`content/`](content). Nothing is written in the components.

```
content/
├── site.md              # name, headline, email, links, SEO, header menu, footer text
├── hero.md              # hero copy, typed phrases, monitor + tokenizer texts
├── languages.md         # languages (+ flag country code and level)
├── sections/            # kicker / title / intro of every section (experience, projects, skills, education, github, faq, contact)
├── experience/          # one file per job
├── projects/            # one file per project
├── education/           # one file per degree
├── skills/              # one file per skill group
└── faq/                 # one file per FAQ question (the body is the answer)
```

- **Front matter** (between the `---` lines) holds plain text fields: titles, dates, tags, `icon: brain`.
- **The body** is markdown: bullet lists become the bullet points, paragraphs become text, and inline `**bold**`, `*italic*`, `` `code` `` and `[links](https://example.com)` work.
- **Order**: files in a folder are sorted by name, so prefix them `01-`, `02-`...
- Dates are `"YYYY-MM"` or `"YYYY"` (keep the quotes). Leave `end` out for an ongoing role.
- A typo in a required field (or an unknown `kind`/`level`/flag) fails the build and names the file and field.

The markdown is converted to data at build time ([`modules/markdown-content.ts`](modules/markdown-content.ts)), so no markdown or YAML parser reaches the browser.

Replace `public/cv-gloria-galasso.pdf` and `public/images/gloria.*` to update the CV download and portrait.
`public/og-image.png` is the social preview card (1200×630).

### Icons

[Font Awesome](https://fontawesome.com) (free, solid) is used for meaning: degrees, project and skill groups, job types, locations and the GitHub stats.
Use one by name (`icon: brain` in the front matter, or `<FaIcon name="brain" />`). Only icons registered in
[`app/utils/fa-icons.ts`](app/utils/fa-icons.ts) are bundled, so add a line there before using a new one.
UI glyphs (menu, arrows, GitHub/LinkedIn) are small inline SVGs in `AppIcon.vue`; language flags come from `country-flag-icons`.

## Architecture (light DDD)

```
app/
├── domain/               # Entities, value objects and repository ports (cv, github). Pure TS, no Vue.
│   ├── types.ts
│   ├── period.ts         # date formatting, language level -> percentage
│   └── cv.repository.ts
├── infrastructure/       # Adapters: markdown content (content/*.md), GitHub API + snapshot
├── composables/          # Application layer: useCv, useGithubRepos, useTheme, useInView, useTypewriter, useSiteSeo
├── components/
│   ├── layout/           # AppHeader, AppFooter
│   ├── sections/         # One component per page section
│   └── ui/               # Reusable presentational pieces
└── app.vue
server/routes/            # robots.txt + sitemap.xml (prerendered)
```

Dependencies point inwards: components → composables → domain ← infrastructure.

## SEO, AI search (GEO) and analytics

**SEO** (all generated from the markdown content, see `app/composables/useSiteSeo.ts`):
title, description, canonical, Open Graph + Twitter cards (1200×630 image), `rel="me"` links to GitHub/LinkedIn,
a sitemap with `lastmod`, favicon set (her face) + web manifest, and semantic HTML (one `h1`, landmarks, descriptive links).

**GEO: being found and quoted by AI search and assistants**
- `robots.txt` explicitly welcomes search and AI crawlers (OAI-SearchBot, ChatGPT-User, GPTBot, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended, Applebot-Extended, Bingbot, DuckAssistBot, CCBot...). Edit the list in `server/routes/robots.txt.ts`.
- `/llms.txt` (short, link-based summary) and `/llms-full.txt` (the whole profile as plain markdown: experience, projects, education, skills, languages and FAQ) are generated at build time from `content/`. The page links to the latter with `<link rel="alternate">`.
- schema.org JSON-LD graph: `WebSite`, `ProfilePage`, `Person` (job title, skills, education, languages, `sameAs`) and a `FAQPage` made from the FAQ section, so answer engines can quote clear, sourced facts.
- A plain-prose bio in the footer (`footer.about` in `content/site.md`), because assistants quote sentences, not widgets.
- **Check Cloudflare**: *Security → Bots → "Block AI bots / AI Scrapers and Crawlers"* and the *managed robots.txt* can block these crawlers before they ever read your files. For a CV you want them off.
- Set a real domain in `NUXT_PUBLIC_SITE_URL`, then submit the sitemap in Google Search Console and Bing Webmaster Tools. Everything else (links from LinkedIn/GitHub to the site, consistent name and title) helps AI tools connect the dots.

**Analytics: Cloudflare Web Analytics** (cookieless, no banner needed in most cases). Pick one:
1. *Easiest*: Cloudflare dashboard → your Pages project → **Metrics → Web Analytics → Enable**. Cloudflare injects the beacon itself. No code, no variable.
2. *Explicit*: Cloudflare → **Analytics & Logs → Web Analytics → Add a site**, copy the `token` from the beacon snippet and set `NUXT_PUBLIC_CF_ANALYTICS_TOKEN` in the Pages build environment. The site then adds the beacon script (`app/composables/useAnalytics.ts`). Do not combine it with option 1, or visits are counted twice.

## Quality checklist

- **SEO**: meta/Open Graph/Twitter tags, canonical URL, schema.org `Person` JSON-LD, sitemap, robots, semantic headings.
- **Accessibility**: skip link, landmarks, keyboard-friendly nav, visible focus, `aria-live` for the interactive demo, AA colour contrast in light and dark, `prefers-reduced-motion` respected.
- **Performance**: static HTML, self-hosted fonts (via `@nuxt/fonts`), WebP portrait, no runtime dependencies beyond Vue.
- **Progressive enhancement**: content is fully visible without JavaScript (scroll animations only activate when JS runs).
