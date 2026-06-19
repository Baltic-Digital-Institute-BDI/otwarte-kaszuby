#!/usr/bin/env node
// Enrich Storyblok stories with full content parity matching hardcoded version
// Run: node scripts/enrich-storyblok-stories.mjs

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
    console.log(`  ERR ${res.status}: ${text.substring(0, 200)}`)
    return null
  }
  return text ? JSON.parse(text) : null
}

async function findStory(slug) {
  const r = await api(`/stories?starts_with=${slug}&per_page=10`)
  return r?.stories?.find(s => s.full_slug === slug || s.slug === slug)
}

async function updateStory(id, story) {
  await sleep(300)
  return await api(`/stories/${id}?publish=1`, 'PUT', { story })
}

const tekstBlok = (text) => ({
  component: 'tekst_blok',
  tresc: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text }] }] },
  szerokosc: 'wezsza'
})

const statBlok = (tytul, stats) => ({
  component: 'statystyki_blok',
  tytul: tytul || '',
  statystyki: stats.map(s => ({ component: 'statystyka_item', wartosc: String(s.v), suffix: s.s || '', etykieta: s.l }))
})

const heroBlok = (h, sub, ctaLabel, ctaUrl, secLabel, secUrl) => ({
  component: 'hero_section',
  naglowek: h,
  podtytul: sub,
  cta_primary_label: ctaLabel || '',
  cta_primary_link: ctaUrl ? { url: ctaUrl, linktype: 'url' } : null,
  cta_secondary_label: secLabel || '',
  cta_secondary_link: secUrl ? { url: secUrl, linktype: 'url' } : null,
  animacja: true,
})

const dividerBlok = (variant = 'tulipan') => ({ component: 'divider_kaszubski', wariant: variant })

const donateCta = () => ({
  component: 'donate_cta_blok',
  tytul: 'Twoje wsparcie zmienia życia',
  opis: 'Status OPP pozwala Ci przekazać 1% podatku do Stowarzyszenia Otwarte Kaszuby. Każda złotówka trafia na cele statutowe.',
  pokaz_krs: true,
  cta_label: 'Pełne informacje o wsparciu',
  cta_link: { url: '/wesprzyj', linktype: 'url' },
})

const partnersBlok = () => ({
  component: 'partnerzy_blok',
  tytul: 'Wspólnie działamy z',
  partnerzy: [
    { component: 'partner_item', nazwa: 'Fundacja Kaszubska', kategoria: 'ngo', url: { url: 'https://fundacja-kaszubska.pl', linktype: 'url' } },
    { component: 'partner_item', nazwa: 'Bank Żywności w Trójmieście', kategoria: 'ngo' },
    { component: 'partner_item', nazwa: 'Urząd Marszałkowski Województwa Pomorskiego', kategoria: 'samorzad', url: { url: 'https://pomorskie.eu', linktype: 'url' } },
    { component: 'partner_item', nazwa: 'Gmina Kartuzy', kategoria: 'samorzad' },
    { component: 'partner_item', nazwa: 'Powiat Kartuski', kategoria: 'samorzad' },
    { component: 'partner_item', nazwa: 'Starostwo Powiatowe w Kartuzach', kategoria: 'samorzad' },
  ],
})

async function enrichHomepage() {
  console.log('=== HOMEPAGE ===')
  const story = await findStory('home')
  if (!story) { console.log('  Story not found'); return }
  story.content = {
    component: 'strona',
    tytul_seo: 'Stowarzyszenie Otwarte Kaszuby',
    opis_seo: 'Łączymy ludzi, kultury i społeczności na Kaszubach. Stowarzyszenie OPP działa od 2018 roku.',
    sekcje: [
      heroBlok(
        'Łączymy ludzi, kultury i społeczności na Kaszubach.',
        'Stowarzyszenie Otwarte Kaszuby od 2018 roku działa na rzecz rozwoju regionu, kultury kaszubskiej i wsparcia uchodźców. Status Organizacji Pożytku Publicznego.',
        'Przekaż 1% PIT', '/wesprzyj',
        'Poznaj nasze projekty', '/projekty'
      ),
      dividerBlok('tulipan'),
      statBlok('', [
        { v: 7200, s: '+', l: 'uchodźców pod opieką' },
        { v: 7000, s: '+', l: 'paczek żywnościowych' },
        { v: 31, l: 'transportów humanitarnych' },
        { v: 60, s: '+', l: 'wolontariuszy' },
      ]),
      { component: 'lista_projektow', tytul: 'Co robimy?', opis: 'Aktywne programy wspierające mieszkańców regionu i osoby w kryzysie.', limit: '3', link_wszystkie_label: 'Wszystkie projekty' },
      dividerBlok('kalina'),
      { component: 'lista_aktualnosci', tytul: 'Aktualności', limit: '3' },
      donateCta(),
      partnersBlok(),
    ],
  }
  const r = await updateStory(story.id, story)
  console.log(`  UPD homepage · sekcje=${story.content.sekcje.length}`)
}

async function enrichONas() {
  console.log('=== O NAS ===')
  const story = await findStory('o-nas')
  if (!story) { console.log('  Story not found'); return }
  story.content = {
    component: 'strona',
    tytul_seo: 'O nas · Stowarzyszenie Otwarte Kaszuby',
    opis_seo: 'Stowarzyszenie Otwarte Kaszuby od 2018 roku łączy ludzi, kultury i społeczności na Kaszubach. Status OPP. Misja, wartości, zarząd, historia.',
    sekcje: [
      heroBlok(
        'O nas',
        'Łączymy ludzi, kultury i społeczności na Kaszubach poprzez budowanie mostów wzajemnego zrozumienia, współpracy oraz promocji lokalnej tożsamości. Pielęgnujemy tradycje i dziedzictwo Kaszub, jednocześnie otwierając się na nowe idee i możliwości.',
      ),
      tekstBlok('Nasze wartości: Otwartość · Współpraca · Szacunek · Solidarność · Rozwój · Tradycja · Innowacyjność · Wspólnota.'),
      dividerBlok('lilia'),
      { component: 'lista_zarzadu', tytul: 'Zarząd', opis: 'Skład zgodny z aktualnym wpisem w Krajowym Rejestrze Sądowym.', organ: 'zarzad' },
      { component: 'lista_zarzadu', tytul: 'Komisja Rewizyjna', opis: '', organ: 'komisja_rewizyjna' },
      tekstBlok('Do składania oświadczeń woli w imieniu Stowarzyszenia, w tym w sprawach majątkowych, uprawnionych jest dwóch członków zarządu działających łącznie.'),
      dividerBlok('kalina'),
      partnersBlok(),
    ],
  }
  const r = await updateStory(story.id, story)
  console.log(`  UPD o-nas · sekcje=${story.content.sekcje.length}`)
}

async function enrichWesprzyj() {
  console.log('=== WESPRZYJ ===')
  const story = await findStory('wesprzyj')
  if (!story) { console.log('  Story not found'); return }
  story.content = {
    component: 'strona',
    tytul_seo: 'Wesprzyj nas · Stowarzyszenie Otwarte Kaszuby',
    opis_seo: 'Przekaż 1% PIT, dokonaj darowizny lub wesprzyj rzeczowo Stowarzyszenie Otwarte Kaszuby. KRS 0000718370. Status OPP.',
    sekcje: [
      heroBlok('Twoje wsparcie zmienia życia', 'Każda złotówka trafia na cele statutowe Stowarzyszenia Otwarte Kaszuby. Status Organizacji Pożytku Publicznego pozwala Ci wybrać dogodną formę wsparcia.'),
      donateCta(),
      tekstBlok('W zeznaniu rocznym PIT-37, PIT-36 lub PIT-28 wpisz nasz numer KRS w sekcji "Wniosek o przekazanie 1% podatku". Nazwa organizacji wypełni się automatycznie.'),
      tekstBlok('Wsparcie online: Patronite (comiesięczne wsparcie) · PayPal (jednorazowo) · FaniMani.pl (bez kosztu dla Ciebie · zakupy online).'),
      tekstBlok('Pomoc rzeczowa: Centrum Wsparcia Uchodźców przyjmuje regularne wsparcie rzeczowe — paczki żywnościowe, środki higieniczne, ubrania zimowe. Zadzwoń do CWU: +48 695 127 816.'),
      tekstBlok('Informacja podatkowa: Darowizny dla organizacji pożytku publicznego są odliczalne od dochodu — do 6% rocznego dochodu (osoby fizyczne) lub 10% (firmy). Status OPP Stowarzyszenia Otwarte Kaszuby został potwierdzony w Krajowym Rejestrze Sądowym (KRS 0000718370).'),
    ],
  }
  const r = await updateStory(story.id, story)
  console.log(`  UPD wesprzyj · sekcje=${story.content.sekcje.length}`)
}

async function enrichKontakt() {
  console.log('=== KONTAKT ===')
  const story = await findStory('kontakt')
  if (!story) { console.log('  Story not found'); return }
  story.content = {
    component: 'strona',
    tytul_seo: 'Kontakt · Stowarzyszenie Otwarte Kaszuby',
    opis_seo: 'Skontaktuj się ze Stowarzyszeniem Otwarte Kaszuby. Adres siedziby w Kartuzach, telefony do biura i CWU, adres email.',
    sekcje: [
      heroBlok('Kontakt', 'Skontaktuj się z nami telefonicznie, mailowo lub przyjdź do biura w Kartuzach.'),
      tekstBlok('Adres siedziby: ul. Dworcowa 13 A / 10, 83-300 Kartuzy'),
      tekstBlok('Telefony: Stowarzyszenie +48 697 068 146 · Centrum Wsparcia Uchodźców +48 695 127 816'),
      tekstBlok('Email: kontakt@otwartekaszuby.pl'),
      tekstBlok('Dane rejestrowe: KRS 0000718370 · NIP 5892040045 · REGON 369483509 · Forma prawna: Stowarzyszenie rejestrowe · Status: Organizacja Pożytku Publicznego (OPP)'),
    ],
  }
  const r = await updateStory(story.id, story)
  console.log(`  UPD kontakt · sekcje=${story.content.sekcje.length}`)
}

async function main() {
  await enrichHomepage()
  await enrichONas()
  await enrichWesprzyj()
  await enrichKontakt()
  console.log('\n=== DONE ===')
}

main().catch(e => { console.error('FATAL:', e); process.exit(1) })
