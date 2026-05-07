# otwarte-kaszuby

Strona WWW Stowarzyszenia Otwarte Kaszuby (KRS 0000718370 · status OPP).

## Stack

- **Next.js 15** (App Router · React Server Components default)
- **TypeScript** strict
- **Tailwind CSS 4** (`@theme` config-in-CSS)
- **lucide-react** ikony
- Hardcoded content w `lib/data/*.ts` (CMS deferred · per Adam directive 2026-05-07)
- Polski (PL) only · EN deferred

## Quick start

```bash
pnpm install        # lub npm install / yarn install
pnpm dev            # http://localhost:3000
pnpm build          # production build
pnpm start          # production server
pnpm typecheck      # tsc --noEmit
pnpm lint           # next lint
```

## Struktura

```
app/                  # Next.js App Router pages
├── layout.tsx        # root layout · fonts · NGO schema · header/footer
├── globals.css       # Tailwind 4 @import + @theme tokens
├── page.tsx          # /
├── o-nas/page.tsx    # /o-nas
├── projekty/         # /projekty + /projekty/[slug]
├── aktualnosci/      # /aktualnosci + /aktualnosci/[slug]
├── wesprzyj/page.tsx # /wesprzyj (1% PIT widget)
├── kontakt/page.tsx  # /kontakt
├── not-found.tsx     # /404
├── error.tsx         # /500
├── sitemap.ts
├── robots.ts
└── manifest.ts       # PWA

components/
├── layout/           # Header · Footer
├── sok/              # KrsClickToCopy · ProjectCard · StatsCounter · ...
└── ui/               # shadcn/ui placeholder (future)

lib/
├── constants.ts      # SOK · SITE · FEATURES (env-gated flags)
├── utils.ts          # cn() · formatDate · slugify
├── data/             # hardcoded content (zarzad, projekty, aktualnosci, etc.)
├── seo/              # Schema.org generators
└── cms-future/       # Sanity Studio schemas (deferred)

public/               # logo.svg · favicon.svg · og-default.svg
```

## Feature flags (env-gated · `lib/constants.ts`)

Wszystkie poniższe są **wyłączone** w MVP — sekcje UI ukryte (no widoczne placeholdery dla użytkownika):

- `cms` — Sanity Studio integration
- `newsletter` — Brevo subscription form
- `contactForm` — Resend backend (currently using mailto: + tel:)
- `analytics` — Plausible script
- `cookieBanner` — RODO banner (no analytics = no banner needed)
- `bankTransfer` — `/wesprzyj` numer konta section
- `reports` — `/o-nas` sprawozdania OPP section

Aktywacja: ustaw `true` w `FEATURES` + dostarcz odpowiednie env variables (zobacz `.env.example`).

## Deployment

### Vercel (recommended)

```bash
# Wymaga utworzenia projektu Vercel + linkowania repo GitHub
vercel deploy --prod
```

Vercel auto-detect Next.js · zero config potrzebne. Środowisko zmiennych: ustaw w Vercel Dashboard lub przez CLI.

### Static export (alternatywa)

```bash
# Dodaj output: 'export' do next.config.mjs
pnpm build
# Uploaduj /out na dowolny static host (Cloudflare Pages · Netlify · GitHub Pages)
```

## SEO

- `app/sitemap.ts` — auto-generated sitemap.xml
- `app/robots.ts` — robots.txt
- Schema.org NGO + DonateAction + Article markup w `lib/seo/schema.ts`
- Open Graph + Twitter Cards w `app/layout.tsx` metadata
- 301 redirects z legacy WordPress URLs w `next.config.mjs`

## Accessibility

- Skip link "Pomiń do treści"
- Focus rings 2px solid primary color
- ARIA labels na wszystkich ikonach bez tekstu
- `prefers-reduced-motion` respected (StatsCounter · transitions)
- Color contrast AA verified (palette w `app/globals.css`)
- Print stylesheet

## License

© 2026 Stowarzyszenie Otwarte Kaszuby. Wszystkie prawa zastrzeżone.
Kod źródłowy: MIT (TBD pre-PROD).

## Dane rejestrowe

- **KRS**: 0000718370
- **NIP**: 5892040045
- **REGON**: 369483509
- **Adres**: ul. Dworcowa 13 A / 10, 83-300 Kartuzy
- **Status**: Organizacja Pożytku Publicznego
