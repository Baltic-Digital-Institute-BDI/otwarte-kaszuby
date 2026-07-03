#!/usr/bin/env node
// Uaktualnij historie projekty-listing i aktualnosci-listing:
// dodaj blok lista_projektow / lista_aktualnosci z limit=100

const PAT = process.env.STORYBLOK_PAT || 'sb_pat_LsgqChDB2hkfa8UOuZLYd4MIt2ERQj-ZpdmfgsB_ihE'
const SPACE_ID = '293294109226994'
const BASE = `https://mapi.storyblok.com/v1/spaces/${SPACE_ID}`

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }
async function api(path, method = 'GET', body = null, retries = 3) {
  const headers = { 'Authorization': PAT, 'Content-Type': 'application/json; charset=utf-8' }
  const init = { method, headers }
  if (body) init.body = JSON.stringify(body)
  const res = await fetch(`${BASE}${path}`, init)
  const text = await res.text()
  if (!res.ok) {
    if (res.status === 429 && retries > 0) { await sleep(3000); return api(path, method, body, retries - 1) }
    console.log(`  ERR ${res.status}: ${text.substring(0, 300)}`)
    return null
  }
  return text ? JSON.parse(text) : null
}
function uid() { return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => { const r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16) }) }
async function findStoryBySlug(slug) {
  const list = await api(`/stories?with_slug=${encodeURIComponent(slug)}`)
  return list?.stories?.[0] || null
}

async function updateStory(slug, buildContent) {
  const existing = await findStoryBySlug(slug)
  if (!existing) { console.log(`  MISSING ${slug}`); return }
  const content = buildContent()
  const payload = { story: { name: existing.name, slug, content, publish: 1 } }
  console.log(`  UPDATE ${slug} (id=${existing.id})`)
  return api(`/stories/${existing.id}`, 'PUT', payload)
}

console.log('=== UPDATE listing pages · dodaj bloki listy ===\n')

await updateStory('projekty-listing', () => ({
  component: 'strona',
  tytul_seo: 'Projekty',
  opis_seo: 'Aktywne i zakończone projekty Stowarzyszenia Otwarte Kaszuby — Centrum Wsparcia Uchodźców, Sklep Społeczny, programy senioralne i kulturalne.',
  sekcje: [
    {
      _uid: uid(),
      component: 'hero_section',
      wariant: 'compact',
      breadcrumb_current: 'Projekty',
      naglowek: 'Nasze projekty',
      podtytul: 'Programy wspierające uchodźców, seniorów, młodzież oraz pielęgnujące kulturę kaszubską. Działamy lokalnie, myślimy globalnie.',
      animacja: true,
    },
    {
      _uid: uid(),
      component: 'lista_projektow',
      limit: '100',
      // brak link_wszystkie_label → nie renderuj linku "wszystkie"
    },
  ],
}))
await sleep(500)

await updateStory('aktualnosci-listing', () => ({
  component: 'strona',
  tytul_seo: 'Aktualności',
  opis_seo: 'Najnowsze informacje o działaniach Stowarzyszenia Otwarte Kaszuby — projekty, wydarzenia, programy społeczne na Pomorzu.',
  sekcje: [
    {
      _uid: uid(),
      component: 'hero_section',
      wariant: 'compact',
      breadcrumb_current: 'Aktualności',
      naglowek: 'Aktualności',
      podtytul: 'Bądź na bieżąco z naszymi projektami i wydarzeniami.',
      animacja: false,
    },
    {
      _uid: uid(),
      component: 'lista_aktualnosci',
      limit: '100',
    },
  ],
}))

console.log('\n=== DONE ===')
