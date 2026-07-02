#!/usr/bin/env node
// Full visual parity migration · adds missing block schemas + enriches content stories
// Goal: 1:1 identity vs pre-storyblok-backup while keeping full Storyblok editability

const PAT = process.env.STORYBLOK_PAT || 'sb_pat_LsgqChDB2hkfa8UOuZLYd4MIt2ERQj-ZpdmfgsB_ihE'
const SPACE_ID = '293294109226994'
const BASE = `https://mapi.storyblok.com/v1/spaces/${SPACE_ID}`

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function api(path, method = 'GET', body = null, retries = 3) {
  const url = `${BASE}${path}`
  const headers = { 'Authorization': PAT, 'Content-Type': 'application/json; charset=utf-8' }
  const init = { method, headers }
  if (body) init.body = JSON.stringify(body)
  const res = await fetch(url, init)
  const text = await res.text()
  if (!res.ok) {
    if (res.status === 429 && retries > 0) { await sleep(3000); return api(path, method, body, retries - 1) }
    console.log(`  ERR ${res.status}: ${text.substring(0, 300)}`)
    return null
  }
  return text ? JSON.parse(text) : null
}

// UUID helper for _uid fields
function uid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
}

// =============== BLOCK SCHEMAS ===============

const BLOCK_SCHEMAS = {
  // Extend hero_section: add breadcrumb + badge + subtitle_only variant
  hero_section: {
    name: 'hero_section',
    display_name: 'Hero (sekcja powitalna)',
    is_nestable: true,
    schema: {
      wariant: { type: 'option', display_name: 'Wariant', pos: 0, options: [
        { name: 'Duży (bg image + blob)', value: 'big' },
        { name: 'Kompaktowy (bez bg image)', value: 'compact' },
      ], default_value: 'big' },
      breadcrumb_current: { type: 'text', display_name: 'Breadcrumb · aktualna strona', pos: 1 },
      naglowek: { type: 'text', display_name: 'Nagłówek H1', pos: 2 },
      podtytul: { type: 'textarea', display_name: 'Podtytuł', pos: 3 },
      badge_tekst: { type: 'text', display_name: 'Badge (nad H1 lub pod)', pos: 4 },
      badge_kolor: { type: 'option', display_name: 'Kolor badge', pos: 5, options: [
        { name: 'Złoty (OPP)', value: 'gold' },
        { name: 'Primary', value: 'primary' },
      ], default_value: 'gold' },
      cta_primary_label: { type: 'text', display_name: 'CTA1 label', pos: 6 },
      cta_primary_link: { type: 'multilink', display_name: 'CTA1 link', pos: 7 },
      cta_secondary_label: { type: 'text', display_name: 'CTA2 label', pos: 8 },
      cta_secondary_link: { type: 'multilink', display_name: 'CTA2 link', pos: 9 },
      tlo_zdjecie: { type: 'asset', display_name: 'Zdjęcie tła', pos: 10, filetypes: ['images'] },
      animacja: { type: 'boolean', display_name: 'Animacja ken-burns', pos: 11, default_value: true },
    }
  },

  // O-NAS
  values_chips_blok: {
    name: 'values_chips_blok',
    display_name: 'Lista wartości (chips)',
    is_nestable: true,
    schema: {
      tytul: { type: 'text', display_name: 'Tytuł sekcji', pos: 0 },
      wartosci: { type: 'text', display_name: 'Wartości (rozdziel przecinkiem)', pos: 1, description: 'np. Otwartość, Współpraca, Szacunek' }
    }
  },
  bento_gallery_blok: {
    name: 'bento_gallery_blok',
    display_name: 'Bento gallery (o-nas · Zespół)',
    is_nestable: true,
    schema: {
      tytul: { type: 'text', display_name: 'Tytuł sekcji', pos: 0 },
      opis: { type: 'textarea', display_name: 'Opis', pos: 1 },
      obraz_glowny_url: { type: 'text', display_name: 'URL obrazu głównego', pos: 2 },
      obraz_glowny_alt: { type: 'text', display_name: 'Alt obrazu głównego', pos: 3 },
      obraz_glowny_kategoria: { type: 'text', display_name: 'Kategoria (mono badge)', pos: 4 },
      obraz_glowny_tytul: { type: 'text', display_name: 'Tytuł obrazu głównego', pos: 5 },
      obraz_2_url: { type: 'text', display_name: 'URL obrazu 2', pos: 6 },
      obraz_2_alt: { type: 'text', display_name: 'Alt obrazu 2', pos: 7 },
      obraz_2_tytul: { type: 'text', display_name: 'Tytuł obrazu 2', pos: 8 },
      obraz_3_url: { type: 'text', display_name: 'URL obrazu 3', pos: 9 },
      obraz_3_alt: { type: 'text', display_name: 'Alt obrazu 3', pos: 10 },
      obraz_3_kategoria: { type: 'text', display_name: 'Kategoria obrazu 3', pos: 11 },
      obraz_3_tytul: { type: 'text', display_name: 'Tytuł obrazu 3', pos: 12 },
    }
  },
  historia_event_item: {
    name: 'historia_event_item',
    display_name: 'Wydarzenie historyczne',
    is_nestable: true,
    schema: {
      rok: { type: 'text', display_name: 'Rok', pos: 0 },
      tytul: { type: 'text', display_name: 'Tytuł', pos: 1 },
      opis: { type: 'textarea', display_name: 'Opis', pos: 2 },
    }
  },
  historia_timeline_blok: {
    name: 'historia_timeline_blok',
    display_name: 'Historia timeline',
    is_nestable: true,
    schema: {
      tytul: { type: 'text', display_name: 'Tytuł sekcji', pos: 0 },
      wydarzenia: { type: 'bloks', display_name: 'Wydarzenia', pos: 1, restrict_components: true, component_whitelist: ['historia_event_item'] }
    }
  },
  aside_reprezentacja_blok: {
    name: 'aside_reprezentacja_blok',
    display_name: 'Aside · Reprezentacja (info box)',
    is_nestable: true,
    schema: {
      tytul: { type: 'text', display_name: 'Tytuł', pos: 0 },
      tresc: { type: 'textarea', display_name: 'Treść', pos: 1 },
    }
  },
  partner_link_item: {
    name: 'partner_link_item',
    display_name: 'Partner (link)',
    is_nestable: true,
    schema: {
      nazwa: { type: 'text', display_name: 'Nazwa', pos: 0 },
      url: { type: 'text', display_name: 'URL (opcjonalny)', pos: 1 },
    }
  },
  partner_group_item: {
    name: 'partner_group_item',
    display_name: 'Grupa partnerów (kategoria)',
    is_nestable: true,
    schema: {
      etykieta: { type: 'text', display_name: 'Etykieta kategorii', pos: 0 },
      partnerzy: { type: 'bloks', display_name: 'Partnerzy', pos: 1, restrict_components: true, component_whitelist: ['partner_link_item'] }
    }
  },
  partnerzy_grouped_blok: {
    name: 'partnerzy_grouped_blok',
    display_name: 'Partnerzy grupowani (kategorie)',
    is_nestable: true,
    schema: {
      tytul: { type: 'text', display_name: 'Tytuł sekcji', pos: 0 },
      grupy: { type: 'bloks', display_name: 'Grupy', pos: 1, restrict_components: true, component_whitelist: ['partner_group_item'] }
    }
  },
  dane_rejestrowe_blok: {
    name: 'dane_rejestrowe_blok',
    display_name: 'Dane rejestrowe (KRS/NIP/REGON)',
    is_nestable: true,
    schema: {
      tytul: { type: 'text', display_name: 'Tytuł', pos: 0 },
      wariant: { type: 'option', display_name: 'Wariant', pos: 1, options: [
        { name: 'Grid (o-nas)', value: 'grid' },
        { name: 'Lista dl (kontakt)', value: 'list' },
      ], default_value: 'grid' },
      krs: { type: 'text', display_name: 'KRS', pos: 2 },
      nip: { type: 'text', display_name: 'NIP', pos: 3 },
      regon: { type: 'text', display_name: 'REGON', pos: 4 },
      data_rejestracji: { type: 'text', display_name: 'Data rejestracji', pos: 5 },
      adres_pelny: { type: 'text', display_name: 'Adres pełny', pos: 6 },
      forma_prawna: { type: 'text', display_name: 'Forma prawna', pos: 7 },
      status_opp: { type: 'boolean', display_name: 'Pokaż status OPP', pos: 8, default_value: true },
    }
  },

  // WESPRZYJ
  karta_1_pit_blok: {
    name: 'karta_1_pit_blok',
    display_name: 'Karta 1% PIT (KRS + instrukcja)',
    is_nestable: true,
    schema: {
      badge_1: { type: 'text', display_name: 'Badge 1 (np. Rekomendowane)', pos: 0 },
      badge_2: { type: 'text', display_name: 'Badge 2 (np. 0 zł kosztu)', pos: 1 },
      tytul: { type: 'text', display_name: 'Tytuł', pos: 2 },
      opis: { type: 'textarea', display_name: 'Opis', pos: 3 },
      krs: { type: 'text', display_name: 'KRS', pos: 4 },
      instrukcja_summary: { type: 'text', display_name: 'Tytuł zwijanej instrukcji', pos: 5 },
      instrukcja_kroki: { type: 'textarea', display_name: 'Kroki instrukcji (jeden na linię)', pos: 6 },
      legal_name: { type: 'text', display_name: 'Nazwa prawna', pos: 7 },
    }
  },
  karta_donacja_item: {
    name: 'karta_donacja_item',
    display_name: 'Karta donacyjna (Patronite/PayPal/FaniMani)',
    is_nestable: true,
    schema: {
      badge: { type: 'text', display_name: 'Badge', pos: 0 },
      badge_kolor_bg: { type: 'text', display_name: 'Kolor badge bg (hex)', pos: 1 },
      badge_kolor_text: { type: 'text', display_name: 'Kolor badge text (hex)', pos: 2 },
      logo_id: { type: 'option', display_name: 'Logo (Component)', pos: 3, options: [
        { name: 'Patronite', value: 'patronite' },
        { name: 'PayPal', value: 'paypal' },
        { name: 'FaniMani', value: 'fanimani' },
      ]},
      opis: { type: 'textarea', display_name: 'Opis', pos: 4 },
      cta_label: { type: 'text', display_name: 'CTA label', pos: 5 },
      cta_url: { type: 'text', display_name: 'CTA URL', pos: 6 },
      accent_kolor: { type: 'text', display_name: 'Kolor akcentu (hex)', pos: 7 },
    }
  },
  karty_donacja_blok: {
    name: 'karty_donacja_blok',
    display_name: 'Karty donacyjne (Wsparcie online)',
    is_nestable: true,
    schema: {
      tytul: { type: 'text', display_name: 'Tytuł sekcji', pos: 0 },
      karty: { type: 'bloks', display_name: 'Karty', pos: 1, restrict_components: true, component_whitelist: ['karta_donacja_item'] }
    }
  },
  pomoc_rzeczowa_blok: {
    name: 'pomoc_rzeczowa_blok',
    display_name: 'Pomoc rzeczowa (highlight box + tel)',
    is_nestable: true,
    schema: {
      tytul: { type: 'text', display_name: 'Tytuł', pos: 0 },
      tresc: { type: 'textarea', display_name: 'Treść', pos: 1 },
      cta_label: { type: 'text', display_name: 'CTA label (np. Zadzwoń do CWU)', pos: 2 },
      cta_tel: { type: 'text', display_name: 'Telefon widoczny', pos: 3 },
      cta_tel_e164: { type: 'text', display_name: 'Telefon E.164', pos: 4 },
    }
  },
  info_podatkowa_blok: {
    name: 'info_podatkowa_blok',
    display_name: 'Info podatkowa (info box)',
    is_nestable: true,
    schema: {
      naglowek: { type: 'text', display_name: 'Nagłówek pogrubiony', pos: 0 },
      tresc: { type: 'textarea', display_name: 'Treść', pos: 1 },
      krs: { type: 'text', display_name: 'KRS (opcjonalnie)', pos: 2 },
    }
  },

  // KONTAKT
  kontakt_item: {
    name: 'kontakt_item',
    display_name: 'Element kontakt (adres/tel/mail)',
    is_nestable: true,
    schema: {
      ikona: { type: 'option', display_name: 'Ikona', pos: 0, options: [
        { name: 'Adres (MapPin)', value: 'map_pin' },
        { name: 'Telefon (Phone)', value: 'phone' },
        { name: 'Email (Mail)', value: 'mail' },
      ]},
      etykieta: { type: 'text', display_name: 'Etykieta (bold)', pos: 1 },
      wartosc: { type: 'text', display_name: 'Wartość widoczna', pos: 2 },
      wartosc_2: { type: 'text', display_name: 'Wartość widoczna 2 (line break)', pos: 3 },
      link_href: { type: 'text', display_name: 'Link href (tel: mailto:)', pos: 4 },
    }
  },
  kontakt_lista_blok: {
    name: 'kontakt_lista_blok',
    display_name: 'Kontakt lista (dwie kolumny)',
    is_nestable: true,
    schema: {
      col1_tytul: { type: 'text', display_name: 'Kolumna 1 tytuł', pos: 0 },
      col1_items: { type: 'bloks', display_name: 'Kolumna 1 elementy', pos: 1, restrict_components: true, component_whitelist: ['kontakt_item'] },
      col1_social_tytul: { type: 'text', display_name: 'Social title', pos: 2 },
      col1_facebook_url: { type: 'text', display_name: 'Facebook URL', pos: 3 },
      col1_instagram_url: { type: 'text', display_name: 'Instagram URL', pos: 4 },
      col2_tytul: { type: 'text', display_name: 'Kolumna 2 tytuł', pos: 5 },
      col2_dane_ref: { type: 'text', display_name: '[read-only] Dane rejestrowe reprezentowane obok', pos: 6 },
    }
  },
  mapa_link_blok: {
    name: 'mapa_link_blok',
    display_name: 'Mapa link (Google Maps CTA)',
    is_nestable: true,
    schema: {
      label: { type: 'text', display_name: 'Label', pos: 0 },
      query: { type: 'text', display_name: 'Google Maps query (adres)', pos: 1 },
    }
  },
}

// =============== CREATE / UPDATE COMPONENTS ===============
async function upsertAllComponents() {
  console.log('\n=== COMPONENT SCHEMAS ===')
  const list = await api('/components')
  const existing = new Map((list?.components || []).map(c => [c.name, c]))

  for (const [name, schema] of Object.entries(BLOCK_SCHEMAS)) {
    const found = existing.get(name)
    if (found) {
      console.log(`→ Updating ${name} (id=${found.id})...`)
      await api(`/components/${found.id}`, 'PUT', { component: { ...found, ...schema } })
    } else {
      console.log(`→ Creating ${name}...`)
      await api('/components', 'POST', { component: schema })
    }
    await sleep(200)
  }
}

// =============== CONTENT ENRICHMENT ===============

// Full SOK constants values (copied · SSOT)
const SOK = {
  krs: '0000718370',
  nip: '5892040045',
  regon: '369483509',
  registeredAt: '2018-02-12',
  legalForm: 'Stowarzyszenie rejestrowe',
  legalName: 'Stowarzyszenie Otwarte Kaszuby',
  mission: 'Łączymy ludzi, kultury i społeczności na Kaszubach poprzez budowanie mostów wzajemnego zrozumienia, współpracy oraz promocji lokalnej tożsamości. Pielęgnujemy tradycje i dziedzictwo Kaszub, jednocześnie otwierając się na nowe idee i możliwości.',
  address: { street: 'ul. Dworcowa 13 A / 10', postalCode: '83-300', city: 'Kartuzy' },
  contact: { phone: '+48 697 068 146', phoneE164: '+48697068146', cwuPhone: '+48 695 127 816', cwuPhoneE164: '+48695127816', email: 'kontakt@otwartekaszuby.pl' },
  social: { facebook: 'https://www.facebook.com/OtwarteKaszuby/', instagram: 'https://www.instagram.com/otwartekaszuby/' },
  representation: 'Do składania oświadczeń woli w imieniu Stowarzyszenia, w tym w sprawach majątkowych, uprawnionych jest dwóch członków zarządu działających łącznie.',
  values: ['Otwartość', 'Współpraca', 'Szacunek', 'Solidarność', 'Rozwój', 'Tradycja', 'Innowacyjność', 'Wspólnota'],
}

const HISTORIA = [
  { year: 2018, title: 'Powstanie Stowarzyszenia', description: '6 stycznia odbyło się spotkanie założycielskie. 12 lutego Stowarzyszenie zostało zarejestrowane w Krajowym Rejestrze Sądowym (KRS 0000718370). 5 maja zorganizowaliśmy debatę "Transparentność i partycypacja obywatelska".' },
  { year: 2019, title: 'Konstytucja po kaszubsku', description: 'Przetłumaczyliśmy i wydaliśmy Konstytucję RP w języku kaszubskim w nakładzie 1000 egzemplarzy. Zrealizowaliśmy serię filmów z mitologii kaszubskiej "Kaszubskie Bóstwa i Demony".' },
  { year: 2020, title: 'Konkurs filmowy "Jestem Kaszubą"', description: 'Projekt skierowany do młodzieży, wspierający kreatywność, tożsamość regionalną i edukację kulturową.' },
  { year: 2021, title: 'Rozwój partnerstw lokalnych', description: 'Budowa lokalnych partnerstw, rozwój relacji z samorządami oraz wzmacnianie kompetencji zespołu — okres przygotowawczy do wyzwań kolejnego roku.' },
  { year: 2022, title: 'Przełomowy rok — Centra Wsparcia Uchodźców', description: 'Wraz z wybuchem wojny w Ukrainie utworzyliśmy dwa Centra Wsparcia Uchodźców: w Kartuzach i Gdańsku-Oliwie. Wsparliśmy ponad 7 200 uchodźców, wydaliśmy 7 000+ paczek, zorganizowaliśmy 31 transportów humanitarnych. Uruchomiliśmy też dwa duże projekty senioralne i pośredniczyliśmy przy Sklepach Społecznych. W Cambridge zorganizowaliśmy "Most Humanitarny".' },
  { year: 2023, title: 'Pomorskie z Ukrainą + integracja NGO', description: 'Realizacja projektu "Pomorskie z Ukrainą" (300 000 zł, Urząd Marszałkowski). Debata "Współdziałanie kaszubskich NGO" wspólnie z Fundacją Kaszubską. Festiwal 6 Kultur w Kartuzach.' },
  { year: 2024, title: 'Wzmocnienie roli obywatelskiej', description: 'Debata "Wolontariat Senioralny", spotkanie "Kobiety: Siła Głosu i Działania" w Żukowie, spotkanie z Magdaleną Adamowicz nt. UE, udział w Pomorskiej Radzie Przedsiębiorczości i Pomorskiej Radzie ds. Polityki Migracyjnej. "Artystyczny Wieczór z Sercem" — dochód dla onkologii dziecięcej.' },
  { year: 2025, title: 'Building Bridges — kontynuacja', description: 'Event w Cambridge "IN THE NAME OF LOVE" — kontynuacja projektu Building Bridges z Klubem Polonia. Warsztaty "Od hejtu do dialogu" z Instytutem Pawła Adamowicza, Fundacją Impuls i Kołem Gospodyń Wiejskich w Chwaszczynie.' },
  { year: 2026, title: 'Otwarci na rozwój', description: 'Start projektu "Otwarci na rozwój – zrób coś dobrego dla siebie" — kształcenie ustawiczne dorosłych w powiecie kartuskim oraz gminach Łęczyce i Szemud.' },
]

const PARTNER_GROUPS = [
  { label: 'Samorząd', items: [
    { name: 'Urząd Marszałkowski Województwa Pomorskiego', url: 'https://pomorskie.eu' },
    { name: 'Gmina Kartuzy' }, { name: 'Powiat Kartuski' },
    { name: 'Gmina Żukowo' }, { name: 'Gmina Chmielno' },
    { name: 'Starostwo Powiatowe w Kartuzach' }, { name: 'OSP w Sulęczynie' },
  ]},
  { label: 'Organizacje pozarządowe', items: [
    { name: 'Fundacja Kaszubska', url: 'https://fundacja-kaszubska.pl' },
    { name: 'Bank Żywności w Trójmieście' },
    { name: 'Fundacja Instytut Nowoczesnej Edukacji' },
    { name: 'Fundacja Praw Pacjenta' },
    { name: 'Instytut Pawła Adamowicza' },
    { name: 'Fundacja Impuls' },
  ]},
  { label: 'Grantodawcy', items: [
    { name: 'Fundacja Netto' }, { name: 'Fundacja Rozwoju Systemu Edukacji' },
  ]},
  { label: 'Współpraca międzynarodowa', items: [
    { name: 'Klub Polonia Cambridge' },
  ]},
  { label: 'Instytucje kultury', items: [
    { name: 'Kartuskie Centrum Kultury' },
  ]},
]

// Build o-nas content
function buildONasContent() {
  return {
    _uid: uid(),
    component: 'strona',
    sekcje: [
      // Hero compact z breadcrumb + badge
      {
        _uid: uid(),
        component: 'hero_section',
        wariant: 'compact',
        breadcrumb_current: 'O nas',
        naglowek: 'O nas',
        badge_tekst: 'Organizacja Pożytku Publicznego',
        badge_kolor: 'gold',
        podtytul: SOK.mission,
      },
      // Wartości
      {
        _uid: uid(),
        component: 'values_chips_blok',
        tytul: 'Nasze wartości',
        wartosci: SOK.values.join(', '),
      },
      { _uid: uid(), component: 'divider_kaszubski', wariant: 'lilia' },
      // Bento gallery
      {
        _uid: uid(),
        component: 'bento_gallery_blok',
        tytul: 'Zespół w działaniu',
        opis: 'Kilkanaście aktywnych osób, ponad 60 wolontariuszy i tysiące godzin pracy społecznej. Razem zmieniamy region.',
        obraz_glowny_url: 'https://otwartekaszuby.pl/wp-content/uploads/2023/05/obraz_viber_2023-05-31_11-31-39-728-1024x804.jpg',
        obraz_glowny_alt: 'Zespół Stowarzyszenia Otwarte Kaszuby — solidarność z Ukrainą',
        obraz_glowny_kategoria: 'Solidarność z Ukrainą',
        obraz_glowny_tytul: 'Wspólnie dla pomocy humanitarnej',
        obraz_2_url: 'https://otwartekaszuby.pl/wp-content/uploads/2023/06/photo_2023-06-21_09-31-23-2.jpg',
        obraz_2_alt: 'Działania Stowarzyszenia',
        obraz_2_tytul: 'Wsparcie społeczne',
        obraz_3_url: 'https://otwartekaszuby.pl/wp-content/uploads/2026/02/Aleksandra-Cieszynska_Otwarci-na-rozwoj-1024x683.jpg',
        obraz_3_alt: 'Aleksandra Cieszyńska — Wiceprzewodnicząca SOK',
        obraz_3_kategoria: 'Aleksandra Cieszyńska',
        obraz_3_tytul: 'Otwarci na rozwój',
      },
      { _uid: uid(), component: 'divider_kaszubski', wariant: 'kalina' },
      // Historia
      {
        _uid: uid(),
        component: 'historia_timeline_blok',
        tytul: 'Nasza historia',
        wydarzenia: HISTORIA.map(h => ({
          _uid: uid(), component: 'historia_event_item',
          rok: String(h.year), tytul: h.title, opis: h.description,
        })),
      },
      { _uid: uid(), component: 'divider_kaszubski', wariant: 'tulipan' },
      // Zarząd (existing lista_zarzadu block)
      {
        _uid: uid(),
        component: 'lista_zarzadu',
        tytul: 'Zarząd',
        opis: 'Skład zgodny z aktualnym wpisem w Krajowym Rejestrze Sądowym.',
        organ: 'zarzad',
      },
      // Aside Reprezentacja
      {
        _uid: uid(),
        component: 'aside_reprezentacja_blok',
        tytul: 'Reprezentacja',
        tresc: SOK.representation,
      },
      // Komisja Rewizyjna
      {
        _uid: uid(),
        component: 'lista_zarzadu',
        tytul: 'Komisja Rewizyjna',
        organ: 'komisja_rewizyjna',
      },
      { _uid: uid(), component: 'divider_kaszubski', wariant: 'kalina' },
      // Partnerzy grouped
      {
        _uid: uid(),
        component: 'partnerzy_grouped_blok',
        tytul: 'Z kim współpracujemy',
        grupy: PARTNER_GROUPS.map(g => ({
          _uid: uid(), component: 'partner_group_item',
          etykieta: g.label,
          partnerzy: g.items.map(p => ({
            _uid: uid(), component: 'partner_link_item',
            nazwa: p.name, url: p.url || '',
          })),
        })),
      },
      // Dane rejestrowe
      {
        _uid: uid(),
        component: 'dane_rejestrowe_blok',
        tytul: 'Dane rejestrowe',
        wariant: 'grid',
        krs: SOK.krs, nip: SOK.nip, regon: SOK.regon,
        data_rejestracji: SOK.registeredAt,
        adres_pelny: `${SOK.address.street}, ${SOK.address.postalCode} ${SOK.address.city}`,
        forma_prawna: SOK.legalForm,
      },
    ],
    opis_seo: 'Stowarzyszenie Otwarte Kaszuby od 2018 roku łączy ludzi, kultury i społeczności na Kaszubach. Status OPP. Misja, wartości, zarząd, historia.',
    tytul_seo: 'O nas',
  }
}

function buildWesprzyjContent() {
  return {
    _uid: uid(),
    component: 'strona',
    sekcje: [
      {
        _uid: uid(),
        component: 'hero_section',
        wariant: 'compact',
        breadcrumb_current: 'Wesprzyj',
        naglowek: 'Twoje wsparcie zmienia życia',
        podtytul: 'Każda złotówka trafia na cele statutowe Stowarzyszenia Otwarte Kaszuby. Status Organizacji Pożytku Publicznego pozwala Ci wybrać dogodną formę wsparcia.',
      },
      // Karta 1% PIT (highlight)
      {
        _uid: uid(),
        component: 'karta_1_pit_blok',
        badge_1: 'Rekomendowane',
        badge_2: '0 zł kosztu dla Ciebie',
        tytul: 'Przekaż 1% podatku',
        opis: 'W zeznaniu rocznym PIT-37, PIT-36 lub PIT-28 wpisz nasz numer KRS w sekcji "Wniosek o przekazanie 1% podatku".',
        krs: SOK.krs,
        legal_name: SOK.legalName,
        instrukcja_summary: 'Jak to zrobić — instrukcja krok po kroku',
        instrukcja_kroki: [
          'W zeznaniu rocznym znajdź sekcję "Wniosek o przekazanie 1,5% (lub 1%) podatku organizacji pożytku publicznego".',
          `Wpisz nasz numer KRS: ${SOK.krs}`,
          `Nazwa organizacji wypełni się automatycznie: ${SOK.legalName}`,
          'Możesz dodać cel szczegółowy (opcjonalnie) — np. "CWU" lub "Seniorzy".',
          'Wyślij zeznanie elektronicznie lub złóż w urzędzie skarbowym.',
        ].join('\n'),
      },
      // Karty donacja
      {
        _uid: uid(),
        component: 'karty_donacja_blok',
        tytul: 'Wsparcie online',
        karty: [
          {
            _uid: uid(), component: 'karta_donacja_item',
            badge: 'Comiesięczne wsparcie', badge_kolor_bg: '#FF424D', badge_kolor_text: '#FFFFFF',
            logo_id: 'patronite',
            opis: 'Zostań Patronem. Od kilku zł miesięcznie regularnie wspierasz nasze działania i otrzymujesz informacje z pierwszej ręki.',
            cta_label: 'Zostań Patronem', cta_url: 'https://patronite.pl/otwartekaszuby',
            accent_kolor: '#FF424D',
          },
          {
            _uid: uid(), component: 'karta_donacja_item',
            badge: 'Jednorazowo', badge_kolor_bg: '#E8E4D9', badge_kolor_text: '#4A4A4A',
            logo_id: 'paypal',
            opis: 'Wpłać dowolną kwotę kartą lub z konta PayPal. Szybko i bezpiecznie.',
            cta_label: 'Wpłać przez PayPal', cta_url: 'https://www.paypal.com/donate?hosted_button_id=PLACEHOLDER',
            accent_kolor: '#003087',
          },
          {
            _uid: uid(), component: 'karta_donacja_item',
            badge: 'Bez kosztu dla Ciebie', badge_kolor_bg: '#E8E4D9', badge_kolor_text: '#4A4A4A',
            logo_id: 'fanimani',
            opis: 'Zakupy online u partnerów FaniMani — sklepy oddają nam część prowizji. Nic Cię nie kosztuje.',
            cta_label: 'Aktywuj wsparcie', cta_url: 'https://fanimani.pl/otwartekaszuby/',
            accent_kolor: '#E5267C',
          },
        ],
      },
      // Pomoc rzeczowa
      {
        _uid: uid(),
        component: 'pomoc_rzeczowa_blok',
        tytul: 'Pomoc rzeczowa',
        tresc: 'Centrum Wsparcia Uchodźców przyjmuje regularne wsparcie rzeczowe — paczki żywnościowe, środki higieniczne, ubrania zimowe oraz inne potrzeby zgłaszane przez podopiecznych. Aby uzgodnić formę pomocy, skontaktuj się bezpośrednio z koordynatorami CWU.',
        cta_label: 'Zadzwoń do CWU',
        cta_tel: SOK.contact.cwuPhone,
        cta_tel_e164: SOK.contact.cwuPhoneE164,
      },
      // Info podatkowa
      {
        _uid: uid(),
        component: 'info_podatkowa_blok',
        naglowek: 'Informacja podatkowa:',
        tresc: 'Darowizny dla organizacji pożytku publicznego są odliczalne od dochodu — do 6% rocznego dochodu (osoby fizyczne) lub 10% (firmy). Status OPP Stowarzyszenia Otwarte Kaszuby został potwierdzony w Krajowym Rejestrze Sądowym (KRS {KRS}).',
        krs: SOK.krs,
      },
    ],
    opis_seo: 'Przekaż 1% PIT, dokonaj darowizny lub wesprzyj rzeczowo Stowarzyszenie Otwarte Kaszuby. KRS 0000718370. Status OPP.',
    tytul_seo: 'Wesprzyj nas',
  }
}

function buildKontaktContent() {
  return {
    _uid: uid(),
    component: 'strona',
    sekcje: [
      {
        _uid: uid(),
        component: 'hero_section',
        wariant: 'compact',
        breadcrumb_current: 'Kontakt',
        naglowek: 'Kontakt',
        podtytul: 'Skontaktuj się z nami telefonicznie, mailowo lub przyjdź do biura w Kartuzach.',
      },
      {
        _uid: uid(),
        component: 'kontakt_lista_blok',
        col1_tytul: 'Stowarzyszenie',
        col1_items: [
          { _uid: uid(), component: 'kontakt_item', ikona: 'map_pin', etykieta: 'Adres siedziby',
            wartosc: SOK.address.street, wartosc_2: `${SOK.address.postalCode} ${SOK.address.city}` },
          { _uid: uid(), component: 'kontakt_item', ikona: 'phone', etykieta: 'Stowarzyszenie',
            wartosc: SOK.contact.phone, link_href: `tel:${SOK.contact.phoneE164}` },
          { _uid: uid(), component: 'kontakt_item', ikona: 'phone', etykieta: 'Centrum Wsparcia Uchodźców',
            wartosc: SOK.contact.cwuPhone, link_href: `tel:${SOK.contact.cwuPhoneE164}` },
          { _uid: uid(), component: 'kontakt_item', ikona: 'mail', etykieta: 'Email',
            wartosc: SOK.contact.email, link_href: `mailto:${SOK.contact.email}` },
        ],
        col1_social_tytul: 'Social media',
        col1_facebook_url: SOK.social.facebook,
        col1_instagram_url: SOK.social.instagram,
        col2_tytul: 'Dane rejestrowe',
      },
      {
        _uid: uid(),
        component: 'dane_rejestrowe_blok',
        tytul: 'Dane rejestrowe',
        wariant: 'list',
        krs: SOK.krs, nip: SOK.nip, regon: SOK.regon,
        forma_prawna: SOK.legalForm,
        status_opp: true,
      },
      {
        _uid: uid(),
        component: 'mapa_link_blok',
        label: 'Otwórz w Google Maps',
        query: `${SOK.address.street}, ${SOK.address.postalCode} ${SOK.address.city}`,
      },
    ],
    opis_seo: 'Skontaktuj się ze Stowarzyszeniem Otwarte Kaszuby. Adres siedziby w Kartuzach, telefony do biura i CWU, adres email.',
    tytul_seo: 'Kontakt',
  }
}

async function updateStory(id, content, name, slug, parentId = 0) {
  console.log(`→ Updating story ${slug} (id=${id})...`)
  const r = await api(`/stories/${id}`, 'PUT', {
    story: { name, slug, content, parent_id: parentId },
    publish: 1,
  })
  console.log(`✓ Updated ${slug}`)
  return r
}

// Main
;(async () => {
  console.log('=== FULL VISUAL PARITY MIGRATION ===')
  await upsertAllComponents()

  console.log('\n=== CONTENT ENRICHMENT ===')
  await updateStory('189109507636002', buildONasContent(), 'O nas', 'o-nas', 0)
  await sleep(500)
  await updateStory('189109510363939', buildWesprzyjContent(), 'Wesprzyj', 'wesprzyj', 0)
  await sleep(500)
  await updateStory('189109513231140', buildKontaktContent(), 'Kontakt', 'kontakt', 0)

  console.log('\n=== DONE ===')
  console.log('Next: update block-renderer.tsx to render new blocks')
})()
