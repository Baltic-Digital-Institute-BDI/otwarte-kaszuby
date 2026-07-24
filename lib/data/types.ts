export type ProjectStatus = 'aktywny' | 'zakonczony' | 'archiwalny'
export type ProjectCategory = 'uchodzcy' | 'seniorzy' | 'kultura' | 'edukacja' | 'obywatelskie'

export interface Stat {
  value: number
  suffix?: string
  label: string
}

export interface TimelineEvent {
  date: string
  title: string
  description?: string
}

export interface Funding {
  source: string
  amount: number
  year: number
  currency?: string
}

export interface ProjectContact {
  name?: string
  phone?: string
  email?: string
}

export interface Project {
  slug: string
  title: string
  status: ProjectStatus
  category: ProjectCategory
  startDate: string
  endDate?: string
  shortDescription: string
  description: string[]
  stats?: Stat[]
  timeline?: TimelineEvent[]
  partners?: string[]
  funding?: Funding[]
  contact?: ProjectContact
  externalLinks?: { label: string; url: string }[]
  heroImage?: string
  dofinansowanieUe?: { tekst: string; znakiUrl?: string; znakiAlt?: string }
}

export interface News {
  slug: string
  title: string
  date: string
  category: string
  excerpt: string
  body: string[]
  tags?: string[]
  heroImage?: string
}

export interface BoardMember {
  firstName: string
  lastName: string
  position: 'czlonkini_zarzadu' | 'czlonek_zarzadu' | 'wiceprzewodniczaca' | 'wiceprzewodniczacy' | 'przewodniczaca' | 'przewodniczacy' | 'czlonek_komisji' | 'beneficjent_rzeczywisty'
  positionLabel: string
  organ: 'zarzad' | 'komisja_rewizyjna' | 'beneficjent'
  since: string
  bio?: string
}

export interface Partner {
  name: string
  category: 'samorzad' | 'ngo' | 'grant' | 'biznes' | 'miedzynarodowy' | 'kultura'
  url?: string
}

export interface HistoryEvent {
  year: number
  title: string
  description: string
}
