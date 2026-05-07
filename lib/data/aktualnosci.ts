import type { News } from './types'

export const AKTUALNOSCI: News[] = [
  {
    slug: 'otwarci-na-rozwoj-zrob-cos-dobrego',
    title: 'Otwarci na rozwój – zrób coś dobrego dla siebie',
    date: '2026-01-27',
    category: 'Projekty',
    excerpt:
      'Projekt realizowany przez Stowarzyszenie Otwarte Kaszuby skierowany do mieszkańców powiatu kartuskiego, gminy Łęczyce oraz gminy Szemud.',
    body: [
      'Świat zmienia się szybciej niż kiedykolwiek. Nowe technologie, formalności, zmiany w pracy, nowe wymagania — wiele osób czuje dziś, że chciałoby lepiej radzić sobie z otaczającą rzeczywistością.',
      'Projekt "Otwarci na rozwój" to odpowiedź na te potrzeby. Oferujemy zajęcia podnoszące kompetencje cyfrowe, językowe oraz społeczne — praktyczne umiejętności przydatne w codziennym życiu i pracy.',
      'Zapraszamy mieszkańców powiatu kartuskiego oraz gmin Łęczyce i Szemud. Szczegóły rekrutacji udostępnimy wkrótce.',
    ],
    tags: ['edukacja', 'kompetencje', 'rozwój'],
  },
  {
    slug: 'festiwal-6-kultur-2023',
    title: 'Festiwal 6 Kultur rusza już 11 sierpnia!',
    date: '2023-08-10',
    category: 'Wydarzenia',
    excerpt:
      'Zachwycająca odyseja wielokulturowości w Kartuzach — festiwal łączący tradycje regionalne i międzynarodowe.',
    body: [
      'Festiwal Sześciu Kultur w Kartuzach to zachwycająca odyseja wielokulturowości. W dzisiejszym globalnym świecie, pełnym technologicznych rewolucji i szybkiej wymiany informacji, łatwo stracić z oczu nasze korzenie i tożsamość kulturową.',
      'Festiwal jest miejscem i wydarzeniem, które przywołuje przeszłość i pozwala zanurzyć się w bogactwie tradycji regionalnych oraz międzynarodowych.',
      'Zapraszamy 11 sierpnia 2023 do Kartuz na dwudniową celebrację kultur kaszubskiej, polskiej, ukraińskiej oraz innych reprezentowanych w naszym regionie.',
    ],
    tags: ['festiwal', 'kultura', 'Kartuzy', 'Kaszuby'],
  },
  {
    slug: 'wspolnie-dla-ukrainy',
    title: 'Wspólnie dla Ukrainy – Twoja pomoc może zmienić życie!',
    date: '2023-05-31',
    category: 'CWU',
    excerpt:
      'W Stowarzyszeniu Otwarte Kaszuby wierzymy w solidarność i chęć pomagania innym, niezależnie od granic czy narodowości.',
    body: [
      'Dziś pragniemy poruszyć ważny temat, który dotyka nas wszystkich – pomoc Ukrainie. W Stowarzyszeniu Otwarte Kaszuby wierzymy w solidarność i chęć pomagania innym, niezależnie od granic czy narodowości.',
      'Zapraszamy do aktywnego zaangażowania się w pomoc naszym wschodnim sąsiadom. Ukraina – kraj dotknięty wojną od lutego 2022 roku – wciąż potrzebuje regularnego wsparcia.',
      'Jak możesz pomóc? Przekaż 1% PIT, wesprzyj nas darowizną, dołącz do grona wolontariuszy CWU lub przyjdź z pomocą rzeczową do naszego Centrum.',
    ],
    tags: ['Ukraina', 'CWU', 'solidarność', 'wsparcie'],
  },
  {
    slug: 'wspieraj-kaszubska-tradycje',
    title: 'Wspieraj Kaszubską Tradycję',
    date: '2023-05-12',
    category: 'Kultura',
    excerpt:
      'Wraz z Fundacją Kaszubską tworzymy Uniwersytet Ludowy w Kartuzach. Zachowujemy język, kulturę i tradycję kaszubską.',
    body: [
      'Wraz z Fundacją Kaszubską tworzymy Uniwersytet Ludowy w Kartuzach. Otwieramy go szeroko dla wszystkich mieszkańców regionu.',
      'Szwajcaria Kaszubska jest bliska naszemu sercu, a język kaszubski to mowa naszych przodków. Razem z mieszkańcami Kaszub pragniemy zachować kulturę, tradycję i język kaszubski.',
      'W Uniwersytecie prowadzimy zajęcia z języka kaszubskiego, międzypokoleniowe spotkania dla seniorów i młodzieży oraz warsztaty kulturalne i historyczne.',
    ],
    tags: ['Kaszuby', 'kultura', 'edukacja'],
  },
  {
    slug: 'bo-we-mnie-jest-radosc-2023',
    title: 'Ruszają kolejne zajęcia dla seniorów „Bo we mnie jest radość"',
    date: '2023-04-17',
    category: 'Seniorzy',
    excerpt:
      'Niecierpliwie wyczekiwany przez seniorów projekt rusza kolejną edycją. Gry planszowe, zajęcia ruchowe, warsztaty rysunku.',
    body: [
      'Już niedługo ruszy tak niecierpliwie wyczekiwany przez seniorów projekt „Bo we mnie jest radość".',
      'W projekcie znajdą się między innymi: 10 spotkań „Bawmy się jak dzieci" gwarantujących wspaniałe emocje podczas gier planszowych, uwielbiane przez Was zajęcia ruchowe oraz warsztaty rysunku — one wydobędą Wasze artystyczne talenty.',
      'Aktywizacja seniorów daje im lepszy komfort życia. Projekt pokazuje, jak bardzo potrzebne jest seniorom wyjście z domu i spotkanie z innymi.',
    ],
    tags: ['seniorzy', 'aktywizacja', 'integracja'],
  },
]

export function getNewsBySlug(slug: string): News | undefined {
  return AKTUALNOSCI.find((n) => n.slug === slug)
}

export function getRecentNews(limit = 3): News[] {
  return AKTUALNOSCI.slice(0, limit)
}
