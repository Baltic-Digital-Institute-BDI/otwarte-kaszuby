#!/usr/bin/env node
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

const r = await api('/stories/189109510363939')
const sekcje = r.story.content.sekcje

for (const s of sekcje) {
  if (s.component === 'karta_1_pit_blok') {
    console.log('Before summary:', JSON.stringify(s.instrukcja_summary))
    console.log('Before kroki:', JSON.stringify(s.instrukcja_kroki))
    s.instrukcja_summary = 'Jak to zrobić — instrukcja krok po kroku'
    s.instrukcja_kroki = s.instrukcja_kroki.replace(/opcjonalnie\)\s*[-—]\s*np/, 'opcjonalnie) — np')
    console.log('After summary:', JSON.stringify(s.instrukcja_summary))
    console.log('After kroki:', JSON.stringify(s.instrukcja_kroki))
  }
}

const upd = await api('/stories/189109510363939', 'PUT', {
  story: { name: r.story.name, slug: r.story.slug, content: r.story.content, parent_id: r.story.parent_id },
  publish: 1,
})
console.log('OK · published:', !!upd?.story?.published)
