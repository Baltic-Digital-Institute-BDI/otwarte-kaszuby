#!/usr/bin/env node
// Update Storyblok content stories to point to Storyblok Assets URLs (not local /images/*)
// Now Ola sees images in Assets library and can swap them via Visual Editor

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO = resolve(__dirname, '..')

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
  if (!res.ok) { console.log(`ERR ${res.status}: ${text.substring(0, 400)}`); return null }
  return text ? JSON.parse(text) : null
}

// Map lokalna ścieżka → Storyblok Asset URL + ID
const MAP = JSON.parse(readFileSync(resolve(__dirname, 'asset-upload-map.json'), 'utf8'))

function toStoryblokAsset(localPath, alt = '') {
  const asset = MAP[localPath]
  if (!asset) return null
  return {
    filename: asset.filename,
    alt,
    id: asset.id,
    name: '',
    focus: null,
    title: '',
    source: null,
    is_external_url: false,
  }
}

async function updateStory(id, updater) {
  const story = await api(`/stories/${id}`)
  if (!story) return
  const before = JSON.stringify(story.story.content)
  updater(story.story.content)
  const after = JSON.stringify(story.story.content)
  if (before === after) { console.log(`  = no change`); return }
  const upd = await api(`/stories/${id}`, 'PUT', {
    story: { name: story.story.name, slug: story.story.slug, content: story.story.content, parent_id: story.story.parent_id },
    publish: 1,
  })
  console.log(`  ✓ ${story.story.full_slug} published=${!!upd?.story?.published}`)
}

// 1. HOME · Hero background
console.log('→ HOME hero background')
await updateStory('189106120597559', (content) => {
  for (const s of content.sekcje) {
    if (s.component === 'hero_section' && s.wariant !== 'compact') {
      s.tlo_zdjecie = toStoryblokAsset('/images/klodno-kaszuby.jpg', 'Krajobraz Kaszub')
    }
  }
})

// 2. O-NAS · Bento gallery images
console.log('→ O-NAS bento gallery')
await updateStory('189109507636002', (content) => {
  for (const s of content.sekcje) {
    if (s.component === 'bento_gallery_blok') {
      s.obraz_glowny = toStoryblokAsset('/images/klodno-kaszuby.jpg', 'Zespół Stowarzyszenia Otwarte Kaszuby — solidarność z Ukrainą')
      // Note: bento używa też external URLs z otwartekaszuby.pl · zostaw jak jest, tylko lokalne
      // Actually — 2 z 3 były external z wordpress. Zmienimy pierwszy (główny) na klodno.
      s.obraz_2 = toStoryblokAsset('/images/seniorzy.jpg', 'Działania Stowarzyszenia')
      s.obraz_3 = toStoryblokAsset('/images/aleksandra-otwarci.jpg', 'Aleksandra Cieszyńska — Wiceprzewodnicząca SOK')
    }
  }
})

// 3. PROJEKTY · zdjecie_hero per project
const PROJEKTY_MAP = {
  '189109475965714': '/images/cwu-hero.jpg',                    // cwu
  '189109478583060': '/images/seniorzy.jpg',                    // sklep-spoleczny
  '189109480950549': '/images/otwarci-na-rozwoj.jpg',           // otwarci-na-rozwoj
  '189109483322134': '/images/uniwersytet-ludowy.jpg',          // uniwersytet-ludowy-kartuzy
  '189109485673239': '/images/festiwal.jpg',                    // festiwal-6-kultur
  '189109488147224': '/images/seniorzy.jpg',                    // bo-we-mnie-jest-radosc
  '189109490629404': '/images/klodno-kaszuby.jpg',              // konstytucja-po-kaszubsku
}

for (const [id, imgPath] of Object.entries(PROJEKTY_MAP)) {
  console.log(`→ PROJEKT ${id} · ${imgPath}`)
  await updateStory(id, (content) => {
    content.zdjecie_hero = toStoryblokAsset(imgPath, content.tytul || '')
  })
}

console.log('\n=== DONE ===')
