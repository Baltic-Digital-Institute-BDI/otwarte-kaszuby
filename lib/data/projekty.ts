import type { Project } from './types'

export const PROJEKTY: Project[] = [
  {
    slug: 'cwu',
    title: 'Centrum Wsparcia Uchodźców',
    status: 'aktywny',
    category: 'uchodzcy',
    startDate: '2022-02-24',
    heroImage: '/images/cwu-hero.jpg',
    shortDescription:
      'Od pierwszych dni wojny w Ukrainie wspieramy uchodźców w Kartuzach i Gdańsku-Oliwie.',
    description: [
      'Centrum Wsparcia Uchodźców (CWU) powstało w odpowiedzi na rosyjską agresję na Ukrainę 24 lutego 2022 roku. Działamy 7 dni w tygodniu w dwóch lokalizacjach — Kartuzy i Gdańsk-Oliwa.',
      'Oferujemy kompleksowe wsparcie: pomoc humanitarną (paczki żywnościowe, leki, odzież, środki higieniczne), pomoc psychologiczną i prawną, kursy języka polskiego, bazę noclegów oraz konwoje humanitarne do Ukrainy.',
      'W ramach projektu "Most Humanitarny" rozszerzyliśmy działania o wymianę kulturową z Polonią w Cambridge w Wielkiej Brytanii.',
      'Zatrudniamy osoby z Ukrainy ze względu na znajomość języka — w tym dwie panie uchodźczynie. Współpracujemy z ponad 60 wolontariuszami oraz z wolontariatami trzech szkół średnich.',
    ],
    stats: [
      { value: 7200, suffix: '+', label: 'uchodźców pod opieką' },
      { value: 7000, suffix: '+', label: 'paczek żywnościowych' },
      { value: 3000, suffix: '+', label: 'porad obywatelskich' },
      { value: 200, suffix: 'h', label: 'porad psychologicznych' },
      { value: 100, suffix: '+', label: 'osób na kursach PL' },
      { value: 31, label: 'transportów humanitarnych' },
    ],
    timeline: [
      { date: '2022-02-24', title: 'Wybuch wojny', description: 'Uruchomienie CWU Kartuzy w pierwszych dniach kryzysu humanitarnego.' },
      { date: '2022-03-01', title: 'CWU Gdańsk-Oliwa', description: 'Otwarcie drugiego centrum.' },
      { date: '2022-03-13', title: 'Reportaż TVP3 Gdańsk', description: 'Materiał o pracy CWU emitowany w "Dzień Dobry Tu Gdańsk".' },
      { date: '2022-03-31', title: '1274 osoby pod opieką', description: 'Po miesiącu — 8,1 tony darów wydanych.' },
      { date: '2022-03-29', title: 'Pierwsze kursy języka polskiego', description: 'Start dla pierwszych dwóch grup — 24 osoby.' },
    ],
    partners: [
      'Bank Żywności w Trójmieście',
      'Urząd Marszałkowski Województwa Pomorskiego',
      'Fundacja Kaszubska',
      'Fundacja Instytut Nowoczesnej Edukacji',
      'Klub Polonia Cambridge',
      'Fundacja Netto',
      'Fundacja Rozwoju Systemu Edukacji',
    ],
    funding: [
      { source: 'Fundacja Rozwoju Systemu Edukacji (POWER · EFS)', amount: 388489.5, year: 2022 },
      { source: 'Urząd Marszałkowski Województwa Pomorskiego', amount: 300000, year: 2023 },
    ],
    contact: {
      name: 'Centrum Wsparcia Uchodźców',
      phone: '+48 695 127 816',
    },
    externalLinks: [
      { label: 'Centrum Wsparcia Uchodźców na Facebooku', url: 'https://www.facebook.com/cwukartuzy' },
      { label: 'Reportaż TVP3 Gdańsk', url: 'https://gdansk.tvp.pl/59021875/odc-13032022' },
    ],
  },
  {
    slug: 'sklep-spoleczny',
    title: 'Sklep Społeczny',
    status: 'aktywny',
    category: 'uchodzcy',
    startDate: '2022-09-06',
    heroImage: '/images/seniorzy.jpg',
    shortDescription:
      'Partnerstwo z Bankiem Żywności — bezpłatne pakiety żywnościowe dla osób potrzebujących w Kartuzach.',
    description: [
      'Od 6 września 2022 roku jesteśmy partnerem Mobilnego Sklepu Społecznego utworzonego przez Bank Żywności w Trójmieście, przy wsparciu Urzędu Marszałkowskiego Województwa Pomorskiego.',
      'Większość asortymentu stanowi żywność z krótkimi terminami ważności, pozyskana przez Bank Żywności od dużych sieci handlowych oraz lokalnych producentów. Konkretna pomoc łączy się z niemarnowaniem żywności.',
      'Aby skorzystać ze wsparcia, wystarczy miesięczne skierowanie z Gminnego Ośrodka Pomocy Społecznej w Kartuzach. Podczas każdego wydania dostępne jest 20 pakietów żywnościowych po 2,5 kg.',
      'Pilotaż prowadzony jest w sześciu lokalizacjach na Pomorzu: Gdynia, Gdańsk, Wejherowo, Kosakowo, Bolszewo i Kartuzy.',
    ],
    partners: [
      'Bank Żywności w Trójmieście',
      'Urząd Marszałkowski Województwa Pomorskiego',
      'Gminny Ośrodek Pomocy Społecznej w Kartuzach',
    ],
  },
  {
    slug: 'otwarci-na-rozwoj',
    title: 'Otwarci na rozwój',
    status: 'aktywny',
    category: 'edukacja',
    startDate: '2026-01-27',
    heroImage: '/images/otwarci-na-rozwoj.jpg',
    shortDescription:
      'Kształcenie ustawiczne dorosłych w powiecie kartuskim oraz gminach Łęczyce i Szemud.',
    description: [
      'Projekt "Otwarci na rozwój – zrób coś dobrego dla siebie" jest realizowany przez Stowarzyszenie Otwarte Kaszuby i skierowany do mieszkańców powiatu kartuskiego, gminy Łęczyce oraz gminy Szemud.',
      'Świat zmienia się szybciej niż kiedykolwiek. Nowe technologie, formalności, zmiany w pracy, nowe wymagania — wiele osób czuje dziś, że chciałoby lepiej radzić sobie z otaczającą rzeczywistością.',
      'Oferujemy zajęcia podnoszące kompetencje cyfrowe, językowe oraz społeczne. Skupiamy się na praktycznych umiejętnościach przydatnych w codziennym życiu i pracy.',
    ],
  },
  {
    slug: 'uniwersytet-ludowy-kartuzy',
    title: 'Kaszubski Uniwersytet Ludowy w Kartuzach',
    status: 'aktywny',
    category: 'kultura',
    startDate: '2023-05-12',
    heroImage: '/images/uniwersytet-ludowy.jpg',
    shortDescription:
      'Współtworzymy uniwersytet ludowy z Fundacją Kaszubską — promujemy język i kulturę kaszubską.',
    description: [
      'Wraz z Fundacją Kaszubską tworzymy Kaszubski Uniwersytet Ludowy w Kartuzach. Otwieramy go szeroko dla wszystkich mieszkańców regionu.',
      'Szwajcaria Kaszubska jest bliska naszemu sercu, a język kaszubski to mowa naszych przodków. Razem z mieszkańcami Kaszub pragniemy zachować kulturę, tradycję i język kaszubski.',
      'W Uniwersytecie prowadzimy zajęcia z języka kaszubskiego, międzypokoleniowe spotkania dla seniorów i młodzieży, warsztaty kulturalne i historyczne.',
    ],
    partners: ['Fundacja Kaszubska'],
    externalLinks: [{ label: 'Fundacja Kaszubska', url: 'https://fundacja-kaszubska.pl' }],
  },
  {
    slug: 'festiwal-6-kultur',
    title: 'Festiwal 6 Kultur Kartuzy',
    status: 'aktywny',
    category: 'kultura',
    startDate: '2023-08-11',
    heroImage: '/images/festiwal.jpg',
    shortDescription:
      'Coroczny festiwal wielokulturowy — odyseja przez bogactwo tradycji regionalnych i międzynarodowych.',
    description: [
      'Festiwal Sześciu Kultur w Kartuzach to zachwycająca odyseja wielokulturowości. W dzisiejszym globalnym świecie, pełnym technologicznych rewolucji i szybkiej wymiany informacji, łatwo stracić z oczu nasze korzenie i tożsamość kulturową.',
      'Festiwal jest miejscem i wydarzeniem, które przywołuje przeszłość i pozwala zanurzyć się w bogactwie tradycji regionalnych oraz międzynarodowych.',
      'Łączymy kultury kaszubską, polską oraz inne reprezentowane w naszym regionie — w tym ukraińską od czasu uruchomienia Centrum Wsparcia Uchodźców.',
    ],
  },
  {
    slug: 'bo-we-mnie-jest-radosc',
    title: 'Bo we mnie jest radość',
    status: 'aktywny',
    category: 'seniorzy',
    startDate: '2023-04-17',
    heroImage: '/images/seniorzy.jpg',
    shortDescription:
      'Program aktywizacji seniorów — gry planszowe, zajęcia ruchowe, warsztaty rysunku i terapia śmiechem.',
    description: [
      'Niecierpliwie wyczekiwany przez seniorów projekt "Bo we mnie jest radość" obejmuje serię spotkań i warsztatów aktywizujących osoby starsze.',
      'W programie: 10 spotkań "Bawmy się jak dzieci" z grami planszowymi, uwielbiane zajęcia ruchowe, warsztaty rysunku, joga śmiechu, gimnastyka, zajęcia taneczne, warsztaty "ziołowe inspiracje" oraz wizyty u kosmetyczki.',
      'Aktywizacja seniorów daje im lepszy komfort życia. Projekt pokazuje, jak bardzo potrzebują wyjścia z domu i spotkania z innymi.',
    ],
    partners: ['Starostwo Powiatowe w Kartuzach', 'OSP w Sulęczynie', 'Gminny Ośrodek Pomocy Społecznej w Kartuzach'],
  },
  {
    slug: 'konstytucja-po-kaszubsku',
    title: 'Konstytucja po kaszubsku',
    status: 'archiwalny',
    category: 'kultura',
    startDate: '2019-01-01',
    endDate: '2019-12-31',
    heroImage: '/images/klodno-kaszuby.jpg',
    shortDescription:
      'Przetłumaczyliśmy i wydaliśmy Konstytucję RP w języku kaszubskim — 1000 egzemplarzy.',
    description: [
      'W 2019 roku przetłumaczyliśmy na język kaszubski Konstytucję Rzeczypospolitej Polskiej i wydaliśmy ją w nakładzie 1000 egzemplarzy.',
      'To symboliczne przedsięwzięcie zwróciło uwagę opinii publicznej w całej Polsce i stało się jednym z najgłośniejszych działań Stowarzyszenia. Promowało język kaszubski jako żywy element kultury regionu.',
      'Publikacja jest dostępna w wybranych bibliotekach oraz instytucjach kultury na Pomorzu.',
    ],
    externalLinks: [{ label: 'Monitor Konstytucyjny — relacja', url: 'https://monitorkonstytucyjny.eu/archiwa/7495' }],
  },
]

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJEKTY.find((p) => p.slug === slug)
}

export function getActiveProjects(): Project[] {
  return PROJEKTY.filter((p) => p.status === 'aktywny')
}

export function getFeaturedProjects(limit = 4): Project[] {
  return getActiveProjects().slice(0, limit)
}
