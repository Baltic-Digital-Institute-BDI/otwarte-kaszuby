# Deployment guide — otwarte-kaszuby

## Local development (5 min)

```bash
cd otwarte-kaszuby
npm install                 # pierwsza instalacja · ok 60-120 sek
npm run dev                 # http://localhost:3000
```

Otwórz `http://localhost:3000` — strona powinna się załadować.

## Production build verification (przed deployem)

```bash
npm run typecheck           # sprawdza TypeScript
npm run lint                # sprawdza ESLint
npm run build               # Next.js production build
npm run start               # serwer produkcyjny lokalnie
```

Wszystkie 4 komendy MUSZĄ zwrócić exit code 0 przed Vercel deploy.

## Vercel deployment (10 min · pierwszy raz)

### Krok 1 · zainstaluj Vercel CLI globalnie

```bash
npm install -g vercel
```

### Krok 2 · zaloguj się

```bash
vercel login
```

Przeglądarka otworzy formularz logowania — użyj konta Adama (it@baltic-digital.org).

### Krok 3 · pierwsze deploy + linkowanie projektu

W folderze `otwarte-kaszuby/`:

```bash
vercel
```

CLI zapyta o:
- **Set up and deploy?** → `Y`
- **Which scope?** → wybierz **BDI** (team `team_ug381E6GRUIvq44iRBLlxTO9`)
- **Link to existing project?** → `N`
- **Project name?** → `otwarte-kaszuby` (Enter dla default)
- **Code directory?** → `.` (Enter)
- **Modify settings?** → `N`

Po 2-3 minutach dostaniesz preview URL: `https://otwarte-kaszuby-xxx.vercel.app`

### Krok 4 · production deploy

Po wstępnym sprawdzeniu preview URL:

```bash
vercel --prod
```

Production URL: `https://otwarte-kaszuby.vercel.app` lub Twój custom domain.

### Krok 5 · konfiguracja domeny (opcjonalne · dla otwartekaszuby.pl)

W Vercel Dashboard → Project Settings → Domains:
1. Dodaj `otwartekaszuby.pl` + `www.otwartekaszuby.pl`
2. Vercel pokaże instrukcje DNS — zaktualizuj rekordy u rejestratora domeny:
   - `A` rekord `@` → `76.76.21.21` (Vercel IP)
   - `CNAME` `www` → `cname.vercel-dns.com`
3. Po propagacji DNS (do 24h, zwykle <1h) — SSL automatic via Let's Encrypt.

## GitHub integration (recommended · auto-deploy)

```bash
# w folderze otwarte-kaszuby/
git init
git add -A
git commit -m "feat: initial commit · G3 build complete"
gh repo create baltic-digital/otwarte-kaszuby --public --source=. --push
```

W Vercel Dashboard → Project Settings → Git → Connect GitHub repository.
Każdy push do `main` = auto-deploy production · każdy push do `dev` = preview deploy.

## Future · CMS activation (deferred)

Gdy będziesz gotowy aktywować Sanity Studio:

1. `npm install @sanity/client @sanity/image-url next-sanity`
2. Skopiuj schemas z `lib/cms-future/` do nowego projektu Sanity Studio
3. Ustaw env: `NEXT_PUBLIC_SANITY_PROJECT_ID` + `NEXT_PUBLIC_SANITY_DATASET`
4. Aktywuj `FEATURES.cms = true` w `lib/constants.ts`
5. Zastąp hardcoded data w `lib/data/*.ts` zapytaniami GROQ do Sanity

Pełna dokumentacja: `lib/cms-future/README.md`.

## Env variables matrix

| Variable | Required | When | Default |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes | Always | `https://otwartekaszuby.pl` |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | No | CMS activation | — |
| `NEXT_PUBLIC_SANITY_DATASET` | No | CMS activation | `production` |
| `SANITY_API_READ_TOKEN` | No | CMS activation | — |
| `SANITY_REVALIDATE_SECRET` | No | CMS activation | — |
| `BREVO_API_KEY` | No | Newsletter activation | — |
| `BREVO_LIST_ID` | No | Newsletter activation | — |
| `RESEND_API_KEY` | No | Contact form activation | — |
| `CONTACT_EMAIL` | No | Contact form activation | `kontakt@otwartekaszuby.pl` |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | No | Analytics activation | — |
| `SENTRY_DSN` | No | Errors activation | — |

## Troubleshooting

### Build fail · TypeScript errors
```bash
npm run typecheck
```
Czytaj komunikaty błędów. Jeśli importy z `@/...` nie działają — sprawdź `tsconfig.json` paths.

### Lighthouse <95
1. `npm run build && npm run start`
2. Otwórz Chrome DevTools → Lighthouse → run analysis
3. Zoptymalizuj: image sizes, font preloads, third-party scripts (na DEV niewiele jest)

### CSS nie ładuje się
Tailwind 4 wymaga `postcss.config.mjs` z `@tailwindcss/postcss` plugin. Sprawdź że `globals.css` ma `@import "tailwindcss"`.

### React 19 + dependencies konflikt
Niektóre paczki nie wspierają React 19. Jeśli `npm install` fail — użyj `npm install --legacy-peer-deps`.

## DoD G3 BUILD complete

- [x] 46 plików kodu napisanych (~2500 linii TS/TSX/CSS)
- [x] 9 routes implementowane (/, /o-nas, /projekty, /projekty/[slug], /aktualnosci, /aktualnosci/[slug], /wesprzyj, /kontakt, /404, /500)
- [x] 7 custom SOK components
- [x] Hardcoded content z Drive (statut, historia, zarząd KRS, projekty, aktualności)
- [x] Schema.org NGO + DonateAction + Article markup
- [x] 301 redirects map dla legacy URLs
- [x] Sitemap auto-generated
- [x] PWA manifest
- [x] Print stylesheet
- [x] A11y skip link + focus rings + prefers-reduced-motion
- [x] AA-compliant color palette (D-021)
- [x] Source Serif 4 + Inter + JetBrains Mono fonts
- [x] Brand extracted favicon + logo SVG
- [x] Feature flags env-gated dla CMS/Newsletter/Forms/Analytics
- [x] No widoczne placeholdery dla użytkownika
- [ ] **Adam action**: `npm install` + `npm run build` lokalne weryfikacja
- [ ] **Adam action**: Vercel deploy
- [ ] **Adam action**: DNS migration (otwartekaszuby.pl)
