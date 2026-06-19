#!/usr/bin/env node
// Migration script · pushes lib/data → Storyblok stories
// Run: node scripts/migrate-to-storyblok.mjs

const PAT = process.env.STORYBLOK_PAT || 'sb_pat_LsgqChDB2hkfa8UOuZLYd4MIt2ERQj-ZpdmfgsB_ihE'
const SPACE_ID = '293294109226994'
const BASE = `https://mapi.storyblok.com/v1/spaces/${SPACE_ID}`

const FOLDER_ZARZAD = 189108122724958
const FOLDER_PROJEKTY = 189108118887001
const FOLDER_AKTUALNOSCI = 189108121123420

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function api(path, method = 'GET', body = null) {
  const url = `${BASE}${path}`
  const headers = { 'Authorization': PAT, 'Content-Type': 'application/json; charset=utf-8' }
  const init = { method, headers }
  if (body) init.body = JSON.stringify(body)
  const res = await fetch(url, init)
  const text = await res.text()
  if (!res.ok) {
    if (res.status === 429) {
      console.log(`  RATELIMIT · retry in 3s`)
      await sleep(3000)
      return api(path, method, body)
    }
    console.log(`  ERR ${res.status}: ${text.substring(0, 200)}`)
    return null
  }
  return text ? JSON.parse(text) : null
}

async function listStories() {
  const r = await api('/stories?per_page=100')
  return r?.stories || []
}

async function findOrCreateStory(payload, publish = true) {
  await sleep(300)
  const path = publish ? '/stories?publish=1' : '/stories'
  const name = payload.story.name
  const slug = payload.story.slug
  // Check existing
  const existing = await api(`/stories?starts_with=${slug}&per_page=1`)
  const found = existing?.stories?.find(s => s.slug === slug || s.full_slug.endsWith(`/${slug}`))
  if (found) {
    // Update
    const r = await api(`/stories/${found.id}${publish ? '?publish=1' : ''}`, 'PUT', payload)
    if (r) { console.log(`  UPD [${name}] id=${r.story.id} slug=${r.story.full_slug}`); return r.story }
  } else {
    const r = await api(path, 'POST', payload)
    if (r) { console.log(`  OK  [${name}] id=${r.story.id} slug=${r.story.full_slug}`); return r.story }
  }
}

const tekstBlok = (text) => ({
  component: 'tekst_blok',
  tresc: {
    type: 'doc',
    content: [{ type: 'paragraph', content: [{ type: 'text', text }] }]
  },
  szerokosc: 'wezsza'
})

const statBlok = (stats) => ({
  component: 'statystyki_blok',
  tytul: '',
  statystyki: stats.map(s => ({ component: 'statystyka_item', wartosc: String(s.v), suffix: s.s || '', etykieta: s.l }))
})

const heroBlok = (h, sub, ctaLabel, ctaUrl, secLabel, secUrl) => ({
  component: 'hero_section',
  naglowek: h,
  podtytul: sub,
  cta_primary_label: ctaLabel,
  cta_primary_link: { url: ctaUrl, linktype: 'url' },
  cta_secondary_label: secLabel || '',
  cta_secondary_link: secUrl ? { url: secUrl, linktype: 'url' } : null,
  animacja: true
})

const dividerBlok = (variant = 'tulipan') => ({ component: 'divider_kaszubski', wariant: variant })

const donateCta = () => ({
  component: 'donate_cta_blok',
  tytul: 'Twoje wsparcie zmienia życia',
  opis: 'Status OPP pozwala Ci przekazać 1% podatku do Stowarzyszenia Otwarte Kaszuby. Każda złotówka trafia na cele statutowe.',
  pokaz_krs: true,
  cta_label: 'Pełne informacje o wsparciu',
  cta_link: { url: '/wesprzyj', linktype: 'url' }
})

async function main() {
  console.log('=== ZARZĄD ===')
  const zarzad = [
    { name: 'Karolina Janczukowicz', slug: 'karolina-janczukowicz', content: {
      component: 'czlonek_zarzadu', imie: 'Karolina', nazwisko: 'Janczukowicz',
      organ: 'zarzad', funkcja: 'Członkini Zarządu', od_kiedy: '2021-04-08 00:00',
      bio: 'Adiunkt Instytutu Anglistyki i Amerykanistyki Wydziału Filologicznego Uniwersytetu Gdańskiego. Prowadzi zajęcia z języka polskiego dla osób z Ukrainy w ramach Centrum Wsparcia Uchodźców.',
      kolejnosc: "1"
    }},
    { name: 'Aleksandra Cieszyńska', slug: 'aleksandra-cieszynska', content: {
      component: 'czlonek_zarzadu', imie: 'Aleksandra', nazwisko: 'Cieszyńska',
      organ: 'zarzad', funkcja: 'Wiceprzewodnicząca', od_kiedy: '2022-10-06 00:00',
      bio: 'Prawniczka i specjalistka ds. prawa samorządowego, NGO oraz komunikacji publicznej. Radna powiatu kartuskiego. Członkini Rady Działalności Pożytku Publicznego w Powiecie Kartuskim.',
      kolejnosc: "2"
    }},
    { name: 'Adrian Pawłowski', slug: 'adrian-pawlowski', content: {
      component: 'czlonek_zarzadu', imie: 'Adrian', nazwisko: 'Pawłowski',
      organ: 'komisja_rewizyjna', funkcja: 'Członek Komisji Rewizyjnej', od_kiedy: '2026-04-28 00:00',
      bio: '', kolejnosc: "1"
    }},
    { name: 'Radosław Cebela', slug: 'radoslaw-cebela', content: {
      component: 'czlonek_zarzadu', imie: 'Radosław', nazwisko: 'Cebela',
      organ: 'komisja_rewizyjna', funkcja: 'Członek Komisji Rewizyjnej', od_kiedy: '2026-04-28 00:00',
      bio: 'Od kilkunastu lat związany z pracą w samorządzie terytorialnym. Współpracuje z organizacjami pozarządowymi, koordynował Budżet Obywatelski w Żukowie. Aktywnie angażuje się w działalność społeczną na rzecz mieszkańców powiatu kartuskiego.',
      kolejnosc: "2"
    }}
  ]
  for (const z of zarzad) {
    await findOrCreateStory({ story: { name: z.name, slug: z.slug, parent_id: FOLDER_ZARZAD, content: z.content } })
  }

  console.log('\n=== PROJEKTY ===')
  const projekty = [
    {
      name: 'Centrum Wsparcia Uchodźców', slug: 'cwu',
      status: 'aktywny', kategoria: 'uchodzcy', start: '2022-02-24 00:00',
      shortDesc: 'Od pierwszych dni wojny w Ukrainie wspieramy uchodźców w Kartuzach i Gdańsku-Oliwie.',
      sekcje: [
        tekstBlok('Centrum Wsparcia Uchodźców (CWU) powstało w odpowiedzi na rosyjską agresję na Ukrainę 24 lutego 2022 roku. Działamy 7 dni w tygodniu w dwóch lokalizacjach — Kartuzy i Gdańsk-Oliwa.'),
        tekstBlok('Oferujemy kompleksowe wsparcie: pomoc humanitarną (paczki żywnościowe, leki, odzież, środki higieniczne), pomoc psychologiczną i prawną, kursy języka polskiego, bazę noclegów oraz konwoje humanitarne do Ukrainy.'),
        statBlok([
          { v: 7200, s: '+', l: 'uchodźców pod opieką' },
          { v: 7000, s: '+', l: 'paczek żywnościowych' },
          { v: 3000, s: '+', l: 'porad obywatelskich' },
          { v: 31, l: 'transportów humanitarnych' }
        ])
      ]
    },
    {
      name: 'Sklep Społeczny', slug: 'sklep-spoleczny',
      status: 'aktywny', kategoria: 'uchodzcy', start: '2022-09-06 00:00',
      shortDesc: 'Partnerstwo z Bankiem Żywności — bezpłatne pakiety żywnościowe dla osób potrzebujących w Kartuzach.',
      sekcje: [
        tekstBlok('Od 6 września 2022 jesteśmy partnerem Mobilnego Sklepu Społecznego utworzonego przez Bank Żywności w Trójmieście, przy wsparciu Urzędu Marszałkowskiego Województwa Pomorskiego.'),
        tekstBlok('Aby skorzystać ze wsparcia, wystarczy miesięczne skierowanie z Gminnego Ośrodka Pomocy Społecznej w Kartuzach. Podczas każdego wydania dostępne jest 20 pakietów żywnościowych po 2,5 kg.')
      ]
    },
    {
      name: 'Otwarci na rozwój', slug: 'otwarci-na-rozwoj',
      status: 'aktywny', kategoria: 'edukacja', start: '2026-01-27 00:00',
      shortDesc: 'Kształcenie ustawiczne dorosłych w powiecie kartuskim oraz gminach Łęczyce i Szemud.',
      sekcje: [
        tekstBlok('Projekt "Otwarci na rozwój – zrób coś dobrego dla siebie" jest realizowany przez Stowarzyszenie Otwarte Kaszuby i skierowany do mieszkańców powiatu kartuskiego, gminy Łęczyce oraz gminy Szemud.'),
        tekstBlok('Oferujemy zajęcia podnoszące kompetencje cyfrowe, językowe oraz społeczne — praktyczne umiejętności przydatne w codziennym życiu i pracy.')
      ]
    },
    {
      name: 'Kaszubski Uniwersytet Ludowy w Kartuzach', slug: 'uniwersytet-ludowy-kartuzy',
      status: 'aktywny', kategoria: 'kultura', start: '2023-05-12 00:00',
      shortDesc: 'Współtworzymy uniwersytet ludowy z Fundacją Kaszubską — promujemy język i kulturę kaszubską.',
      sekcje: [
        tekstBlok('Wraz z Fundacją Kaszubską tworzymy Kaszubski Uniwersytet Ludowy w Kartuzach. Otwieramy go szeroko dla wszystkich mieszkańców regionu.'),
        tekstBlok('Szwajcaria Kaszubska jest bliska naszemu sercu, a język kaszubski to mowa naszych przodków. Razem z mieszkańcami Kaszub pragniemy zachować kulturę, tradycję i język kaszubski.')
      ]
    },
    {
      name: 'Festiwal 6 Kultur Kartuzy', slug: 'festiwal-6-kultur',
      status: 'aktywny', kategoria: 'kultura', start: '2023-08-11 00:00',
      shortDesc: 'Coroczny festiwal wielokulturowy — odyseja przez bogactwo tradycji regionalnych i międzynarodowych.',
      sekcje: [
        tekstBlok('Festiwal Sześciu Kultur w Kartuzach to zachwycająca odyseja wielokulturowości.'),
        tekstBlok('Łączymy kultury kaszubską, polską oraz inne reprezentowane w naszym regionie — w tym ukraińską od czasu uruchomienia Centrum Wsparcia Uchodźców.')
      ]
    },
    {
      name: 'Bo we mnie jest radość', slug: 'bo-we-mnie-jest-radosc',
      status: 'aktywny', kategoria: 'seniorzy', start: '2023-04-17 00:00',
      shortDesc: 'Program aktywizacji seniorów — gry planszowe, zajęcia ruchowe, warsztaty rysunku i terapia śmiechem.',
      sekcje: [
        tekstBlok('Niecierpliwie wyczekiwany przez seniorów projekt "Bo we mnie jest radość" obejmuje serię spotkań i warsztatów aktywizujących osoby starsze.'),
        tekstBlok('W programie: 10 spotkań "Bawmy się jak dzieci" z grami planszowymi, uwielbiane zajęcia ruchowe, warsztaty rysunku, joga śmiechu, gimnastyka, zajęcia taneczne.')
      ]
    },
    {
      name: 'Konstytucja po kaszubsku', slug: 'konstytucja-po-kaszubsku',
      status: 'archiwalny', kategoria: 'kultura', start: '2019-01-01 00:00',
      shortDesc: 'Przetłumaczyliśmy i wydaliśmy Konstytucję RP w języku kaszubskim — 1000 egzemplarzy.',
      sekcje: [
        tekstBlok('W 2019 roku przetłumaczyliśmy na język kaszubski Konstytucję Rzeczypospolitej Polskiej i wydaliśmy ją w nakładzie 1000 egzemplarzy.'),
        tekstBlok('To symboliczne przedsięwzięcie zwróciło uwagę opinii publicznej w całej Polsce i stało się jednym z najgłośniejszych działań Stowarzyszenia.')
      ]
    }
  ]
  for (const p of projekty) {
    await findOrCreateStory({ story: {
      name: p.name, slug: p.slug, parent_id: FOLDER_PROJEKTY,
      content: {
        component: 'projekt',
        tytul: p.name,
        status: p.status,
        kategoria: p.kategoria,
        data_startu: p.start,
        krotki_opis: p.shortDesc,
        sekcje: p.sekcje
      }
    }})
  }

  console.log('\n=== AKTUALNOŚCI ===')
  const news = [
    {
      slug: 'otwarci-na-rozwoj-zrob-cos-dobrego', name: 'Otwarci na rozwój – zrób coś dobrego dla siebie',
      date: '2026-01-27 00:00', cat: 'Projekty',
      excerpt: 'Projekt realizowany przez Stowarzyszenie Otwarte Kaszuby skierowany do mieszkańców powiatu kartuskiego, gminy Łęczyce oraz gminy Szemud.',
      body: [
        'Świat zmienia się szybciej niż kiedykolwiek. Nowe technologie, formalności, zmiany w pracy, nowe wymagania — wiele osób czuje dziś, że chciałoby lepiej radzić sobie z otaczającą rzeczywistością.',
        'Projekt "Otwarci na rozwój" to odpowiedź na te potrzeby. Oferujemy zajęcia podnoszące kompetencje cyfrowe, językowe oraz społeczne — praktyczne umiejętności przydatne w codziennym życiu i pracy.'
      ],
      tags: 'edukacja, kompetencje, rozwój'
    },
    {
      slug: 'festiwal-6-kultur-2023', name: 'Festiwal 6 Kultur rusza już 11 sierpnia!',
      date: '2023-08-10 00:00', cat: 'Wydarzenia',
      excerpt: 'Zachwycająca odyseja wielokulturowości w Kartuzach — festiwal łączący tradycje regionalne i międzynarodowe.',
      body: [
        'Festiwal Sześciu Kultur w Kartuzach to zachwycająca odyseja wielokulturowości.',
        'Zapraszamy 11 sierpnia 2023 do Kartuz na dwudniową celebrację kultur kaszubskiej, polskiej, ukraińskiej oraz innych reprezentowanych w naszym regionie.'
      ],
      tags: 'festiwal, kultura, Kartuzy, Kaszuby'
    },
    {
      slug: 'wspolnie-dla-ukrainy', name: 'Wspólnie dla Ukrainy – Twoja pomoc może zmienić życie!',
      date: '2023-05-31 00:00', cat: 'CWU',
      excerpt: 'W Stowarzyszeniu Otwarte Kaszuby wierzymy w solidarność i chęć pomagania innym, niezależnie od granic czy narodowości.',
      body: [
        'W Stowarzyszeniu Otwarte Kaszuby wierzymy w solidarność i chęć pomagania innym, niezależnie od granic czy narodowości.',
        'Jak możesz pomóc? Przekaż 1% PIT, wesprzyj nas darowizną, dołącz do grona wolontariuszy CWU lub przyjdź z pomocą rzeczową do naszego Centrum.'
      ],
      tags: 'Ukraina, CWU, solidarność, wsparcie'
    },
    {
      slug: 'wspieraj-kaszubska-tradycje', name: 'Wspieraj Kaszubską Tradycję',
      date: '2023-05-12 00:00', cat: 'Kultura',
      excerpt: 'Wraz z Fundacją Kaszubską tworzymy Uniwersytet Ludowy w Kartuzach. Zachowujemy język, kulturę i tradycję kaszubską.',
      body: [
        'Wraz z Fundacją Kaszubską tworzymy Uniwersytet Ludowy w Kartuzach. Otwieramy go szeroko dla wszystkich mieszkańców regionu.',
        'Szwajcaria Kaszubska jest bliska naszemu sercu, a język kaszubski to mowa naszych przodków.'
      ],
      tags: 'Kaszuby, kultura, edukacja'
    },
    {
      slug: 'bo-we-mnie-jest-radosc-2023', name: 'Ruszają kolejne zajęcia dla seniorów „Bo we mnie jest radość"',
      date: '2023-04-17 00:00', cat: 'Seniorzy',
      excerpt: 'Niecierpliwie wyczekiwany przez seniorów projekt rusza kolejną edycją. Gry planszowe, zajęcia ruchowe, warsztaty rysunku.',
      body: [
        'Już niedługo ruszy tak niecierpliwie wyczekiwany przez seniorów projekt „Bo we mnie jest radość".',
        'W projekcie znajdą się między innymi: 10 spotkań „Bawmy się jak dzieci", uwielbiane zajęcia ruchowe oraz warsztaty rysunku.'
      ],
      tags: 'seniorzy, aktywizacja, integracja'
    }
  ]
  for (const n of news) {
    const bodyContent = {
      type: 'doc',
      content: n.body.map(t => ({ type: 'paragraph', content: [{ type: 'text', text: t }] }))
    }
    await findOrCreateStory({ story: {
      name: n.name, slug: n.slug, parent_id: FOLDER_AKTUALNOSCI,
      content: {
        component: 'aktualnosc',
        tytul: n.name,
        data_publikacji: n.date,
        kategoria: n.cat,
        tagi: n.tags,
        excerpt: n.excerpt,
        tresc: bodyContent
      }
    }})
  }

  console.log('\n=== PAGES (Home, O nas, Wesprzyj, Kontakt) ===')

  // HOMEPAGE
  await findOrCreateStory({ story: {
    name: 'Strona główna', slug: 'home',
    content: {
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
        statBlok([
          { v: 7200, s: '+', l: 'uchodźców pod opieką' },
          { v: 7000, s: '+', l: 'paczek żywnościowych' },
          { v: 31, l: 'transportów humanitarnych' },
          { v: 60, s: '+', l: 'wolontariuszy' }
        ]),
        {
          component: 'lista_projektow',
          tytul: 'Co robimy?',
          opis: 'Aktywne programy wspierające mieszkańców regionu i osoby w kryzysie.',
          limit: "3",
          link_wszystkie_label: 'Wszystkie projekty'
        },
        dividerBlok('kalina'),
        {
          component: 'lista_aktualnosci',
          tytul: 'Aktualności',
          limit: "3"
        },
        donateCta()
      ]
    }
  }})

  // O NAS
  await findOrCreateStory({ story: {
    name: 'O nas', slug: 'o-nas',
    content: {
      component: 'strona',
      tytul_seo: 'O nas · Stowarzyszenie Otwarte Kaszuby',
      opis_seo: 'Stowarzyszenie Otwarte Kaszuby od 2018 roku łączy ludzi, kultury i społeczności na Kaszubach. Status OPP. Misja, wartości, zarząd, historia.',
      sekcje: [
        heroBlok(
          'O nas',
          'Łączymy ludzi, kultury i społeczności na Kaszubach poprzez budowanie mostów wzajemnego zrozumienia, współpracy oraz promocji lokalnej tożsamości. Pielęgnujemy tradycje i dziedzictwo Kaszub.',
          '', '', '', ''
        ),
        tekstBlok('Stowarzyszenie Otwarte Kaszuby jest Organizacją Pożytku Publicznego (KRS 0000718370). Działamy od lutego 2018 roku.'),
        { component: 'lista_zarzadu', tytul: 'Zarząd', opis: 'Skład zgodny z aktualnym wpisem w Krajowym Rejestrze Sądowym.', organ: 'zarzad' },
        { component: 'lista_zarzadu', tytul: 'Komisja Rewizyjna', opis: '', organ: 'komisja_rewizyjna' }
      ]
    }
  }})

  // WESPRZYJ
  await findOrCreateStory({ story: {
    name: 'Wesprzyj nas', slug: 'wesprzyj',
    content: {
      component: 'strona',
      tytul_seo: 'Wesprzyj nas · Stowarzyszenie Otwarte Kaszuby',
      opis_seo: 'Przekaż 1% PIT, dokonaj darowizny lub wesprzyj rzeczowo Stowarzyszenie Otwarte Kaszuby. KRS 0000718370. Status OPP.',
      sekcje: [
        heroBlok(
          'Twoje wsparcie zmienia życia',
          'Każda złotówka trafia na cele statutowe Stowarzyszenia Otwarte Kaszuby. Status Organizacji Pożytku Publicznego pozwala Ci wybrać dogodną formę wsparcia.',
          '', '', '', ''
        ),
        donateCta(),
        tekstBlok('Status OPP pozwala Ci przekazać 1% podatku do Stowarzyszenia Otwarte Kaszuby. W zeznaniu rocznym PIT-37, PIT-36 lub PIT-28 wpisz nasz numer KRS w sekcji "Wniosek o przekazanie 1% podatku".')
      ]
    }
  }})

  // KONTAKT
  await findOrCreateStory({ story: {
    name: 'Kontakt', slug: 'kontakt',
    content: {
      component: 'strona',
      tytul_seo: 'Kontakt · Stowarzyszenie Otwarte Kaszuby',
      opis_seo: 'Skontaktuj się ze Stowarzyszeniem Otwarte Kaszuby. Adres siedziby w Kartuzach, telefony do biura i CWU, adres email.',
      sekcje: [
        heroBlok(
          'Kontakt',
          'Skontaktuj się z nami telefonicznie, mailowo lub przyjdź do biura w Kartuzach.',
          '', '', '', ''
        ),
        tekstBlok('Stowarzyszenie Otwarte Kaszuby · ul. Dworcowa 13 A / 10, 83-300 Kartuzy · KRS 0000718370 · NIP 5892040045 · REGON 369483509'),
        tekstBlok('Stowarzyszenie: +48 697 068 146 · Centrum Wsparcia Uchodźców: +48 695 127 816 · Email: kontakt@otwartekaszuby.pl')
      ]
    }
  }})

  console.log('\n=== DONE ===')
  const all = await listStories()
  console.log(`Total stories: ${all.length}`)
}

main().catch(e => { console.error('FATAL:', e); process.exit(1) })
