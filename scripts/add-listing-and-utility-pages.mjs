#!/usr/bin/env node
// Utwórz historie w Storyblok dla stron listingowych + utility (404/500)
// Aby Ola mogła edytować pełne teksty w Visual Editor.
// Slugi: projekty-listing · aktualnosci-listing · utility-404 · utility-500

const PAT = process.env.STORYBLOK_PAT || 'sb_pat_LsgqChDB2hkfa8UOuZLYd4MIt2ERQj-ZpdmfgsB_ihE'
const SPACE_ID = '293294109226994'
const BASE = `https://mapi.storyblok.com/v1/spaces/${SPACE_ID}`

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function api(path, method = 'GET', body = null, retries = 3) {
  const url = `${BASE}${path}`
  const headers = { 'Authorization': PAT, 'Content-Type': 'application/json; charset=utf-8' }
  const init = { method, headers }
  if (body) init.body = JSON.stringify(body)
  const res = await fetch(url, init)
  const text = await res.text()
  if (!res.ok) {
    if (res.status === 429 && retries > 0) { await sleep(3000); return api(path, method, body, retries - 1) }
    console.log(`  ERR ${res.status}: ${text.substring(0, 300)}`)
    return null
  }
  return text ? JSON.parse(text) : null
}

function uid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
}

async function findStoryBySlug(slug) {
  const list = await api(`/stories?with_slug=${encodeURIComponent(slug)}`)
  return list?.stories?.[0] || null
}

async function upsertStory(name, slug, content) {
  const existing = await findStoryBySlug(slug)
  const payload = {
    story: {
      name,
      slug,
      content,
      is_startpage: false,
      publish: 1,
    },
  }
  if (existing) {
    console.log(`  UPDATE ${slug} (id=${existing.id})`)
    return api(`/stories/${existing.id}`, 'PUT', payload)
  }
  console.log(`  CREATE ${slug}`)
  return api('/stories', 'POST', payload)
}

// === PAGES ===
const pages = [
  {
    name: 'Projekty · lista',
    slug: 'projekty-listing',
    content: {
      component: 'strona',
      tytul_seo: 'Projekty',
      opis_seo: 'Aktywne i zakończone projekty Stowarzyszenia Otwarte Kaszuby — Centrum Wsparcia Uchodźców, Sklep Społeczny, programy senioralne i kulturalne.',
      sekcje: [
        {
          _uid: uid(),
          component: 'hero_section',
          naglowek: 'Nasze projekty',
          podtytul: 'Programy wspierające uchodźców, seniorów, młodzież oraz pielęgnujące kulturę kaszubską. Działamy lokalnie, myślimy globalnie.',
          animacja: true,
        },
      ],
    },
  },
  {
    name: 'Aktualności · lista',
    slug: 'aktualnosci-listing',
    content: {
      component: 'strona',
      tytul_seo: 'Aktualności',
      opis_seo: 'Najnowsze informacje o działaniach Stowarzyszenia Otwarte Kaszuby — projekty, wydarzenia, programy społeczne na Pomorzu.',
      sekcje: [
        {
          _uid: uid(),
          component: 'hero_section',
          naglowek: 'Aktualności',
          podtytul: 'Bądź na bieżąco z naszymi projektami i wydarzeniami.',
          animacja: false,
        },
      ],
    },
  },
  {
    name: 'Błąd 404 · strona nie znaleziona',
    slug: 'utility-404',
    content: {
      component: 'strona',
      tytul_seo: 'Strona nie znaleziona',
      opis_seo: '',
      sekcje: [
        {
          _uid: uid(),
          component: 'hero_section',
          naglowek: 'Strona zaginęła jak haft kaszubski',
          podtytul: 'Adres, którego szukasz, nie istnieje albo został przeniesiony. Sprawdź adres URL lub wróć na stronę główną.',
          cta_primary_label: 'Strona główna',
          cta_primary_link: { url: '/', linktype: 'url' },
          cta_secondary_label: 'Sprawdź projekty',
          cta_secondary_link: { url: '/projekty', linktype: 'url' },
          animacja: false,
        },
      ],
    },
  },
  {
    name: 'Błąd 500 · błąd serwera',
    slug: 'utility-500',
    content: {
      component: 'strona',
      tytul_seo: 'Błąd serwera',
      opis_seo: '',
      sekcje: [
        {
          _uid: uid(),
          component: 'hero_section',
          naglowek: 'Coś poszło nie tak',
          podtytul: 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie lub wróć na stronę główną. Jeśli problem powtarza się, skontaktuj się z nami.',
          cta_primary_label: 'Strona główna',
          cta_primary_link: { url: '/', linktype: 'url' },
          animacja: false,
        },
      ],
    },
  },
]

console.log('=== ADD LISTING + UTILITY PAGES ===\n')
for (const p of pages) {
  await upsertStory(p.name, p.slug, p.content)
  await sleep(500)
}
console.log('\n=== DONE ===')
console.log('Utworzone historie:')
console.log('  · projekty-listing')
console.log('  · aktualnosci-listing')
console.log('  · utility-404')
console.log('  · utility-500')
