#!/usr/bin/env node
// Clear all asset field references written by API (they don't render in Storyblok admin picker)
// After clearing, Ola manually picks assets from Library via "+ Dodaj Asset" button
// Fallback in block-renderer keeps images on live site

const PAT = 'sb_pat_LsgqChDB2hkfa8UOuZLYd4MIt2ERQj-ZpdmfgsB_ihE'
const SPACE_ID = '293294109226994'
const BASE = `https://mapi.storyblok.com/v1/spaces/${SPACE_ID}`

async function api(path, method = 'GET', body = null) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Authorization': PAT, 'Content-Type': 'application/json; charset=utf-8' },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  if (!res.ok) { console.log(`ERR ${res.status}: ${text.substring(0, 300)}`); return null }
  return text ? JSON.parse(text) : null
}

const EMPTY_ASSET = { id: null, alt: null, name: '', focus: null, title: null, source: null, filename: '', copyright: null, fieldtype: 'asset' }

async function updateStory(id, updater) {
  const story = await api(`/stories/${id}`)
  if (!story) return
  updater(story.story.content)
  const upd = await api(`/stories/${id}`, 'PUT', {
    story: { name: story.story.name, slug: story.story.slug, content: story.story.content, parent_id: story.story.parent_id },
    publish: 1,
  })
  console.log(`  ${upd?.story?.published ? '✓' : '⚠'} ${story.story.full_slug}`)
}

// 1. HOME · Hero tło
console.log('→ HOME')
await updateStory('189106120597559', (content) => {
  for (const s of content.sekcje) {
    if (s.component === 'hero_section' && s.tlo_zdjecie) s.tlo_zdjecie = EMPTY_ASSET
  }
})

// 2. O-NAS · Bento gallery images
console.log('→ O-NAS')
await updateStory('189109507636002', (content) => {
  for (const s of content.sekcje) {
    if (s.component === 'bento_gallery_blok') {
      s.obraz_glowny = EMPTY_ASSET
      s.obraz_2 = EMPTY_ASSET
      s.obraz_3 = EMPTY_ASSET
    }
  }
})

// 3. PROJEKTY · zdjecie_hero per project
const PROJEKTY_IDS = ['189109475965714','189109478583060','189109480950549','189109483322134','189109485673239','189109488147224','189109490629404']
for (const id of PROJEKTY_IDS) {
  console.log(`→ PROJEKT ${id}`)
  await updateStory(id, (content) => {
    if (content.zdjecie_hero) content.zdjecie_hero = EMPTY_ASSET
  })
}

console.log('\n=== DONE ===')
console.log('Fallback obrazki na live: /public/images/*.jpg (już działa)')
console.log('Ola klika "+ Dodaj Asset" w admin → wybiera z Library (9 obrazów tam jest)')
