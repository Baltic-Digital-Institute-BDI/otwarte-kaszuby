#!/usr/bin/env node
// Ustawia Real Path (story.path) w Storyblok dla stori które mają preview URL
// mismatched z rzeczywistą ścieżką w Next.js.

const PAT = process.env.STORYBLOK_PAT || 'sb_pat_LsgqChDB2hkfa8UOuZLYd4MIt2ERQj-ZpdmfgsB_ihE'
const SPACE_ID = '293294109226994'
const BASE = `https://mapi.storyblok.com/v1/spaces/${SPACE_ID}`

async function api(path, method = 'GET', body = null) {
  const headers = { 'Authorization': PAT, 'Content-Type': 'application/json; charset=utf-8' }
  const init = { method, headers }
  if (body) init.body = JSON.stringify(body)
  const res = await fetch(`${BASE}${path}`, init)
  const text = await res.text()
  if (!res.ok) { console.log(`  ERR ${res.status}: ${text.substring(0, 400)}`); return null }
  return text ? JSON.parse(text) : null
}

async function findStoryBySlug(fullSlug) {
  const list = await api(`/stories?with_slug=${encodeURIComponent(fullSlug)}`)
  return list?.stories?.[0] || null
}

async function setRealPath(fullSlug, realPath) {
  const s = await findStoryBySlug(fullSlug)
  if (!s) { console.log(`  MISSING ${fullSlug}`); return }
  // Pobierz pełną storię z content (findStoryBySlug zwraca minimalne pole)
  const full = await api(`/stories/${s.id}`)
  if (!full?.story) { console.log(`  ERR getting full ${fullSlug}`); return }
  const payload = {
    story: {
      name: full.story.name,
      slug: full.story.slug,
      content: full.story.content,
      path: realPath, // ← real_path field
      publish: 1,
    },
  }
  const r = await api(`/stories/${s.id}`, 'PUT', payload)
  console.log(`  SET ${fullSlug} → real_path="${realPath}" ${r ? '(OK)' : '(FAIL)'}`)
}

console.log('=== SET Real Path dla stori z mismatched preview URL ===\n')

await setRealPath('projekty-listing', '/projekty')
await setRealPath('aktualnosci-listing', '/aktualnosci')
await setRealPath('_globals/footer', '/')

console.log('\n=== DONE ===')
console.log('Teraz w Visual Editor Storyblok:')
console.log('  projekty-listing → https://otwarte-kaszuby.vercel.app/otwartekaszuby/projekty')
console.log('  aktualnosci-listing → https://otwarte-kaszuby.vercel.app/otwartekaszuby/aktualnosci')
console.log('  _globals/footer → https://otwarte-kaszuby.vercel.app/otwartekaszuby/ (footer widoczny na home)')
