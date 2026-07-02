#!/usr/bin/env node
// Create global Footer component + story in Storyblok
// Run: node scripts/create-footer-global.mjs

const PAT = process.env.STORYBLOK_PAT || 'sb_pat_LsgqChDB2hkfa8UOuZLYd4MIt2ERQj-ZpdmfgsB_ihE'
const SPACE_ID = '293294109226994'
const BASE = `https://mapi.storyblok.com/v1/spaces/${SPACE_ID}`

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function api(path, method = 'GET', body = null) {
  const url = `${BASE}${path}`
  const headers = { 'Authorization': PAT, 'Content-Type': 'application/json; charset=utf-8' }
  const init = { method, headers }
  if (body) init.body = JSON.stringify(body)
  const res = await fetch(url, init)
  const text = await res.text()
  if (!res.ok) {
    if (res.status === 429) { await sleep(3000); return api(path, method, body) }
    console.log(`  ERR ${res.status}: ${text.substring(0, 300)}`)
    return null
  }
  return text ? JSON.parse(text) : null
}

// 1. Sprawdź czy component footer_global już istnieje
async function ensureFooterComponent() {
  const list = await api('/components')
  const existing = list?.components?.find(c => c.name === 'footer_global')
  if (existing) {
    console.log(`✓ Component footer_global exists (id=${existing.id})`)
    return existing
  }
  console.log('→ Creating component footer_global...')
  const created = await api('/components', 'POST', {
    component: {
      name: 'footer_global',
      display_name: 'Stopka (globalna)',
      is_root: true,
      is_nestable: false,
      schema: {
        // Legal / rejestrowe
        legal_name: { type: 'text', display_name: 'Nazwa organizacji', pos: 0 },
        krs: { type: 'text', display_name: 'KRS', pos: 1 },
        nip: { type: 'text', display_name: 'NIP', pos: 2 },
        regon: { type: 'text', display_name: 'REGON', pos: 3 },
        // Kontakt
        address_street: { type: 'text', display_name: 'Ulica i numer', pos: 10 },
        address_postal: { type: 'text', display_name: 'Kod pocztowy', pos: 11 },
        address_city: { type: 'text', display_name: 'Miasto', pos: 12 },
        phone: { type: 'text', display_name: 'Telefon (biuro)', pos: 13 },
        phone_e164: { type: 'text', display_name: 'Telefon E.164 (biuro)', pos: 14 },
        cwu_phone: { type: 'text', display_name: 'Telefon CWU', pos: 15 },
        cwu_phone_e164: { type: 'text', display_name: 'Telefon E.164 (CWU)', pos: 16 },
        email: { type: 'text', display_name: 'Email', pos: 17 },
        // Social
        facebook_url: { type: 'text', display_name: 'Facebook URL', pos: 20 },
        instagram_url: { type: 'text', display_name: 'Instagram URL', pos: 21 },
        youtube_url: { type: 'text', display_name: 'YouTube URL', pos: 22 },
        cwu_facebook_url: { type: 'text', display_name: 'Facebook CWU URL', pos: 23 },
        cwu_facebook_label: { type: 'text', display_name: 'Etykieta CWU FB', pos: 24 },
        // 1% PIT
        opp_title: { type: 'text', display_name: 'Tytuł sekcji 1% PIT', pos: 30 },
        opp_description: { type: 'text', display_name: 'Opis sekcji 1% PIT', pos: 31 },
        opp_link_label: { type: 'text', display_name: 'Link CTA', pos: 32 },
        // Copyright
        copyright_suffix: { type: 'text', display_name: 'Sufiks copyright', pos: 40 },
        opp_badge: { type: 'text', display_name: 'Badge OPP', pos: 41 },
      }
    }
  })
  console.log(`✓ Created (id=${created?.component?.id})`)
  return created?.component
}

// 2. Utwórz lub zaktualizuj story _globals/footer
async function upsertFooterStory() {
  // Sprawdź czy folder _globals istnieje
  let folders = await api('/stories?per_page=100&folder_only=1')
  let globalsFolder = folders?.stories?.find(s => s.slug === '_globals')
  if (!globalsFolder) {
    console.log('→ Creating folder _globals...')
    const f = await api('/stories', 'POST', {
      story: { name: '_globals', slug: '_globals', is_folder: true, parent_id: 0 }
    })
    globalsFolder = f?.story
    console.log(`✓ Folder created (id=${globalsFolder?.id})`)
  } else {
    console.log(`✓ Folder _globals exists (id=${globalsFolder.id})`)
  }

  // Content matching current hardcoded footer.tsx + constants.ts SOK
  const content = {
    component: 'footer_global',
    legal_name: 'Stowarzyszenie Otwarte Kaszuby',
    krs: '0000718370',
    nip: '5891985437',
    regon: '369587550',
    address_street: 'ul. Klasztorna 3',
    address_postal: '83-300',
    address_city: 'Kartuzy',
    phone: '+48 501 234 567',
    phone_e164: '+48501234567',
    cwu_phone: '+48 502 345 678',
    cwu_phone_e164: '+48502345678',
    email: 'kontakt@otwartekaszuby.pl',
    facebook_url: 'https://www.facebook.com/otwartekaszuby',
    instagram_url: 'https://www.instagram.com/otwartekaszuby',
    youtube_url: 'https://www.youtube.com/@otwartekaszuby',
    cwu_facebook_url: 'https://www.facebook.com/cwukartuzy',
    cwu_facebook_label: 'cwukartuzy',
    opp_title: 'Wsparcie 1% PIT',
    opp_description: 'Status OPP — przekaż 1% podatku:',
    opp_link_label: 'Inne formy wsparcia →',
    copyright_suffix: 'Wszystkie prawa zastrzeżone.',
    opp_badge: 'Organizacja Pożytku Publicznego',
  }

  // Sprawdź czy story już istnieje
  let existingList = await api('/stories?with_slug=_globals/footer')
  let existing = existingList?.stories?.find(s => s.full_slug === '_globals/footer')

  if (existing) {
    console.log(`→ Updating story _globals/footer (id=${existing.id})...`)
    const updated = await api(`/stories/${existing.id}`, 'PUT', {
      story: { name: 'Stopka (globalna)', slug: 'footer', content, parent_id: globalsFolder.id },
      publish: 1
    })
    console.log(`✓ Updated (id=${updated?.story?.id})`)
    return updated?.story
  } else {
    console.log('→ Creating story _globals/footer...')
    const created = await api('/stories', 'POST', {
      story: {
        name: 'Stopka (globalna)',
        slug: 'footer',
        parent_id: globalsFolder.id,
        content,
      },
      publish: 1
    })
    console.log(`✓ Created (id=${created?.story?.id})`)
    return created?.story
  }
}

// Main
;(async () => {
  console.log('=== FOOTER GLOBAL SETUP ===')
  await ensureFooterComponent()
  await sleep(500)
  const story = await upsertFooterStory()
  console.log('\n=== DONE ===')
  console.log(`Story: _globals/footer (id=${story?.id})`)
  console.log(`Aleksandra edytuje: https://app.storyblok.com/#/me/spaces/${SPACE_ID}/stories/0/0/${story?.id}`)
})()
