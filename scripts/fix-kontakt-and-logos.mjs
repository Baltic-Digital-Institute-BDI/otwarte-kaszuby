#!/usr/bin/env node
// Fix kontakt · consolidate into single 2-column section (like backup)
// Also extend kontakt_lista_blok schema with col2 fields

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

// 1. Extend kontakt_lista_blok schema (add col2 fields, remove col2_dane_ref)
const list = await api('/components')
const comp = list.components.find(c => c.name === 'kontakt_lista_blok')
if (comp) {
  const schema = { ...comp.schema }
  delete schema.col2_dane_ref
  schema.col2_krs = { type: 'text', display_name: 'Kolumna 2 · KRS', pos: 6 }
  schema.col2_nip = { type: 'text', display_name: 'Kolumna 2 · NIP', pos: 7 }
  schema.col2_regon = { type: 'text', display_name: 'Kolumna 2 · REGON', pos: 8 }
  schema.col2_forma_prawna = { type: 'text', display_name: 'Kolumna 2 · Forma prawna', pos: 9 }
  schema.col2_status_opp = { type: 'boolean', display_name: 'Kolumna 2 · Status OPP', pos: 10, default_value: true }
  schema.col2_maps_query = { type: 'text', display_name: 'Kolumna 2 · Google Maps query', pos: 11 }
  schema.col2_maps_label = { type: 'text', display_name: 'Kolumna 2 · Maps button label', pos: 12, default_value: 'Otwórz w Google Maps' }
  await api(`/components/${comp.id}`, 'PUT', { component: { ...comp, schema } })
  console.log(`✓ Extended kontakt_lista_blok schema with col2 fields`)
}

// 2. Fetch current /kontakt content
const kontakt = await api('/stories/189109513231140')
const sekcje = kontakt.story.content.sekcje
console.log(`Current sekcje: ${sekcje.map(s => s.component).join(', ')}`)

// Find kontakt_lista_blok, extend with col2 data, remove dane_rejestrowe_blok + mapa_link_blok
const kontaktLista = sekcje.find(s => s.component === 'kontakt_lista_blok')
if (kontaktLista) {
  kontaktLista.col2_tytul = 'Dane rejestrowe'
  kontaktLista.col2_krs = '0000718370'
  kontaktLista.col2_nip = '5892040045'
  kontaktLista.col2_regon = '369483509'
  kontaktLista.col2_forma_prawna = 'Stowarzyszenie rejestrowe'
  kontaktLista.col2_status_opp = true
  kontaktLista.col2_maps_query = 'ul. Dworcowa 13 A / 10, 83-300 Kartuzy'
  kontaktLista.col2_maps_label = 'Otwórz w Google Maps'
  delete kontaktLista.col2_dane_ref
}

// Remove dane_rejestrowe_blok and mapa_link_blok
kontakt.story.content.sekcje = sekcje.filter(s =>
  s.component !== 'dane_rejestrowe_blok' && s.component !== 'mapa_link_blok'
)
console.log(`New sekcje: ${kontakt.story.content.sekcje.map(s => s.component).join(', ')}`)

const upd = await api('/stories/189109513231140', 'PUT', {
  story: {
    name: kontakt.story.name,
    slug: kontakt.story.slug,
    content: kontakt.story.content,
    parent_id: kontakt.story.parent_id,
  },
  publish: 1,
})
console.log(`✓ /kontakt updated: ${!!upd?.story?.published}`)
