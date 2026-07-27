// Storyblok block types · 1:1 z block schemas in Management API

export interface StoryblokAsset {
  filename: string
  alt?: string
  title?: string
  name?: string
  focus?: string | null
  copyright?: string | null
}

export interface StoryblokLink {
  id?: string
  url?: string
  linktype?: 'url' | 'story' | 'email' | 'asset'
  cached_url?: string
  story?: { full_slug?: string; url?: string }
  target?: string
}

export interface RichTextNode {
  type: string
  text?: string
  content?: RichTextNode[]
  attrs?: Record<string, unknown>
  marks?: { type: string; attrs?: Record<string, unknown> }[]
}

export interface RichText {
  type: 'doc'
  content: RichTextNode[]
}

// ===== Nestable blocks =====
export interface ZdjecieBlok { _uid: string; component: 'zdjecie_blok'; obraz: StoryblokAsset; alt: string; podpis?: string }

export interface PrzyciskBlok {
  _uid: string; component: 'przycisk_blok'
  etykieta: string; link: StoryblokLink
  wariant?: 'primary' | 'outline' | 'link'
  ikona?: boolean
}

export interface TekstBlok { _uid: string; component: 'tekst_blok'; tresc: RichText; szerokosc?: 'wezsza' | 'szeroka' }

export interface CytatBlok { _uid: string; component: 'cytat_blok'; tekst: string; autor?: string; rola?: string }

export interface KartaBlok {
  _uid: string; component: 'karta_blok'
  zdjecie?: StoryblokAsset
  badge?: string
  badge_kolor?: 'gold' | 'primary' | 'neutral'
  tytul: string
  opis?: string
  link?: StoryblokLink
}

export interface StatystykaItem { _uid: string; component: 'statystyka_item'; wartosc: string; suffix?: string; etykieta: string }

export interface TimelineEvent { _uid: string; component: 'timeline_event'; data: string; tytul: string; opis?: string }

export interface PartnerItem { _uid: string; component: 'partner_item'; nazwa: string; url?: StoryblokLink; kategoria?: string }

export interface HeroSection {
  _uid: string; component: 'hero_section'
  naglowek: string; podtytul?: string
  cta_primary_label?: string; cta_primary_link?: StoryblokLink
  cta_secondary_label?: string; cta_secondary_link?: StoryblokLink
  tlo_zdjecie?: StoryblokAsset
  animacja?: boolean
}

export interface GaleriaBlok {
  _uid: string; component: 'galeria_blok'
  zdjecia: StoryblokAsset[]
  uklad?: 'grid_2' | 'grid_3' | 'grid_4' | 'bento'
  tytul?: string
}

export interface KartyGrid {
  _uid: string; component: 'karty_grid'
  tytul?: string; opis?: string
  karty: KartaBlok[]
  kolumny?: '2' | '3' | '4'
}

export interface StatystykiBlok { _uid: string; component: 'statystyki_blok'; tytul?: string; statystyki: StatystykaItem[] }

export interface TimelineBlok { _uid: string; component: 'timeline_blok'; tytul?: string; wydarzenia: TimelineEvent[] }

export interface PartnerzyBlok { _uid: string; component: 'partnerzy_blok'; tytul?: string; partnerzy: PartnerItem[] }

export interface DonateCTABlok {
  _uid: string; component: 'donate_cta_blok'
  tytul?: string; opis?: string; pokaz_krs?: boolean
  cta_label?: string; cta_link?: StoryblokLink
}

export interface DividerKaszubski { _uid: string; component: 'divider_kaszubski'; wariant?: 'tulipan' | 'kalina' | 'lilia' }

export interface ListaProjektow {
  _uid: string; component: 'lista_projektow'
  tytul?: string; opis?: string
  projekty?: string[]; limit?: string
  link_wszystkie_label?: string
}

export interface ListaAktualnosci {
  _uid: string; component: 'lista_aktualnosci'
  tytul?: string; aktualnosci?: string[]; limit?: string
}

export interface ListaZarzadu {
  _uid: string; component: 'lista_zarzadu'
  tytul?: string; opis?: string
  organ: 'zarzad' | 'komisja_rewizyjna'
}

export type AnyBlok =
  | ZdjecieBlok | PrzyciskBlok | TekstBlok | CytatBlok | KartaBlok
  | HeroSection | GaleriaBlok | KartyGrid | StatystykiBlok | TimelineBlok
  | PartnerzyBlok | DonateCTABlok | DividerKaszubski | ListaProjektow
  | ListaAktualnosci | ListaZarzadu

export interface DofinansowanieUeBlok {
  _uid: string
  component: 'dofinansowanie_ue_blok'
  tekst?: string
  znaki?: StoryblokAsset
  znaki_alt?: string
  tytul_projektu?: string
  program?: string
  cel?: string
  szkolenia?: string
  wartosc_calkowita?: string
  dofinansowanie?: string
  srodki_europejskie?: string
  wspolfinansowanie_bp?: string
  formula?: string
}

// ===== Root content types =====
export interface StronaContent {
  component: 'strona'
  tytul_seo: string
  opis_seo?: string
  zdjecie_og?: StoryblokAsset
  sekcje: AnyBlok[]
}

export interface ProjektContent {
  component: 'projekt'
  tytul: string
  status: 'aktywny' | 'zakonczony' | 'archiwalny'
  kategoria?: string
  data_startu: string
  data_zakonczenia?: string
  zdjecie_hero?: StoryblokAsset
  krotki_opis: string
  sekcje: AnyBlok[]
  partnerzy_tekst?: RichText
  finansowanie_tekst?: RichText
  kontakt_tel?: string
  dofinansowanie_ue?: DofinansowanieUeBlok[]
}

export interface AktualnoscContent {
  component: 'aktualnosc'
  tytul: string
  data_publikacji: string
  kategoria: string
  tagi?: string
  zdjecie?: StoryblokAsset
  excerpt: string
  tresc: RichText
}

export interface CzlonekZarzaduContent {
  component: 'czlonek_zarzadu'
  imie: string; nazwisko: string
  organ: 'zarzad' | 'komisja_rewizyjna'
  funkcja: string
  od_kiedy: string
  zdjecie?: StoryblokAsset
  bio?: string
  kolejnosc?: string
}
