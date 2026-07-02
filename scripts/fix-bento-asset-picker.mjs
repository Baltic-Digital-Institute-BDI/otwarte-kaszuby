#!/usr/bin/env node
// Convert bento_gallery_blok schema from text URL to asset picker for images
// Ola klika upload w Storyblok Visual Editor zamiast wpisywać URL ręcznie

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
  if (!res.ok) { console.log(`ERR ${res.status}: ${text.substring(0, 500)}`); return null }
  return text ? JSON.parse(text) : null
}

// 1. Update component schema
const list = await api('/components')
const comp = list.components.find(c => c.name === 'bento_gallery_blok')
if (!comp) { console.log('bento_gallery_blok not found'); process.exit(1) }

const newSchema = {
  tytul: { type: 'text', display_name: 'Tytuł sekcji', pos: 0 },
  opis: { type: 'textarea', display_name: 'Opis', pos: 1 },
  obraz_glowny: { type: 'asset', display_name: 'Zdjęcie główne (2× rozmiar)', pos: 2, filetypes: ['images'] },
  obraz_glowny_kategoria: { type: 'text', display_name: 'Zdjęcie 1 · Kategoria (mono badge)', pos: 3 },
  obraz_glowny_tytul: { type: 'text', display_name: 'Zdjęcie 1 · Tytuł overlay', pos: 4 },
  obraz_2: { type: 'asset', display_name: 'Zdjęcie 2', pos: 5, filetypes: ['images'] },
  obraz_2_tytul: { type: 'text', display_name: 'Zdjęcie 2 · Tytuł overlay', pos: 6 },
  obraz_3: { type: 'asset', display_name: 'Zdjęcie 3', pos: 7, filetypes: ['images'] },
  obraz_3_kategoria: { type: 'text', display_name: 'Zdjęcie 3 · Kategoria', pos: 8 },
  obraz_3_tytul: { type: 'text', display_name: 'Zdjęcie 3 · Tytuł overlay', pos: 9 },
}

await api(`/components/${comp.id}`, 'PUT', { component: { ...comp, schema: newSchema } })
console.log('✓ Extended bento_gallery_blok schema (asset picker)')

// 2. Migrate /o-nas content — convert text URL to StoryblokAsset format
const story = await api('/stories/189109507636002')
const sekcje = story.story.content.sekcje

for (const s of sekcje) {
  if (s.component === 'bento_gallery_blok') {
    const oldUrl1 = s.obraz_glowny_url
    const oldUrl2 = s.obraz_2_url
    const oldUrl3 = s.obraz_3_url
    const oldAlt1 = s.obraz_glowny_alt || ''
    const oldAlt2 = s.obraz_2_alt || ''
    const oldAlt3 = s.obraz_3_alt || ''
    // Convert to StoryblokAsset shape
    s.obraz_glowny = { filename: oldUrl1, alt: oldAlt1, id: 0, name: '', focus: null, title: '', source: null, is_external_url: true }
    s.obraz_2 = { filename: oldUrl2, alt: oldAlt2, id: 0, name: '', focus: null, title: '', source: null, is_external_url: true }
    s.obraz_3 = { filename: oldUrl3, alt: oldAlt3, id: 0, name: '', focus: null, title: '', source: null, is_external_url: true }
    // Remove old text URL/alt fields
    delete s.obraz_glowny_url
    delete s.obraz_glowny_alt
    delete s.obraz_2_url
    delete s.obraz_2_alt
    delete s.obraz_3_url
    delete s.obraz_3_alt
    console.log(`✓ Migrated bento_gallery_blok content in o-nas`)
  }
}

const upd = await api('/stories/189109507636002', 'PUT', {
  story: { name: story.story.name, slug: story.story.slug, content: story.story.content, parent_id: story.story.parent_id },
  publish: 1,
})
console.log(`✓ /o-nas published: ${!!upd?.story?.published}`)
