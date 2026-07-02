# Backup otwartekaszuby.pl

Data eksportu: 2026-07-02
Cel: Archiwum starej strony WordPress przed migracjÄ… domeny na nowszÄ… wersjÄ™ Next.js/Storyblok

## ZawartoĹ›Ä‡

- `sitemap/` â€” peĹ‚ne sitemapy WordPress
- `wp-api-json/` â€” dump WordPress REST API (posts, pages, media, categories, tags, users)
- `html-mirror/` â€” statyczne HTML wszystkich URL
- `media/uploads/` â€” oryginalne obrazy z /wp-content/uploads/
- `logs/` â€” listy URL i mediĂłw

## Rekonstrukcja

Zobacz JSON w wp-api-json/ dla peĹ‚nej treĹ›ci postĂłw i stron. Struktura folderu media/ zachowuje ukĹ‚ad YYYY/MM WordPress.
