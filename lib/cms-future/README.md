# CMS Future · Sanity Studio integration

Schemas + integration code dla future Sanity Studio wdrożenia.
**Status (2026-05-07)**: deferred · per Adam directive D-015 (DEV mode).

Gdy Sanity Studio zostanie utworzone:
1. Run `pnpm dlx sanity@latest init` (lub `npm`/`yarn`)
2. Skopiuj poniższe schemas do `studio/schemas/`
3. Aktywuj `FEATURES.cms = true` w `lib/constants.ts`
4. Replace hardcoded data w `lib/data/*.ts` queries do Sanity GROQ

Pełna struktura schemas dokumentowana w `_OUTPUTS/design/otwarte-kaszuby.architecture.md` (sekcja "Sanity Schemas").
