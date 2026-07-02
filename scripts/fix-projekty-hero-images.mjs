#!/usr/bin/env node
// Fill zdjecie_hero for each Storyblok projekty/* story using hardcoded heroImage from lib/data/projekty.ts

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
  if (!res.ok) { console.log(`ERR ${res.status} · ${path}: ${text.substring(0, 300)}`); return null }
  return text ? JSON.parse(text) : null
}

const PROJEKTY_HERO_MAP = {
  'cwu': { image: '/images/cwu-hero.jpg', alt: 'Centrum Wsparcia Uchodźców — działalność SOK' },
  'sklep-spoleczny': { image: '/images/seniorzy.jpg', alt: 'Sklep Społeczny — wsparcie seniorów' },
  'otwarci-na-rozwoj': { image: '/images/otwarci-na-rozwoj.jpg', alt: 'Otwarci na rozwój — kształcenie ustawiczne' },
  'uniwersytet-ludowy-kartuzy': { image: '/images/uniwersytet-ludowy.jpg', alt: 'Kaszubski Uniwersytet Ludowy w Kartuzach' },
  'festiwal-6-kultur': { image: '/images/festiwal.jpg', alt: 'Festiwal 6 Kultur Kartuzy' },
  'bo-we-mnie-jest-radosc': { image: '/images/seniorzy.jpg', alt: 'Bo we mnie jest radość — projekt senioralny' },
  'konstytucja-po-kaszubsku': { image: '/images/klodno-kaszuby.jpg', alt: 'Konstytucja po kaszubsku' },
}

const { stories } = await api('/stories?starts_with=projekty/&per_page=25')
console.log(`Found ${stories.length} projekty stories`)

for (const s of stories) {
  const slug = s.full_slug.replace(/^projekty\//, '')
  const hero = PROJEKTY_HERO_MAP[slug]
  if (!hero) { console.log(`  ! No hero map for ${slug}`); continue }

  const full = await api(`/stories/${s.id}`)
  full.story.content.zdjecie_hero = {
    filename: hero.image,
    alt: hero.alt,
    id: 0,
    name: '',
    focus: null,
    title: '',
    source: null,
    is_external_url: false,
  }

  const upd = await api(`/stories/${s.id}`, 'PUT', {
    story: {
      name: full.story.name,
      slug: full.story.slug,
      content: full.story.content,
      parent_id: full.story.parent_id,
    },
    publish: 1,
  })
  console.log(`  ✓ ${s.full_slug}: zdjecie_hero = ${hero.image}`)
}
console.log('\nDone.')
