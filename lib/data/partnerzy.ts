import type { Partner } from './types'

export const PARTNERZY: Partner[] = [
  { name: 'Fundacja Kaszubska', category: 'ngo', url: 'https://fundacja-kaszubska.pl' },
  { name: 'Bank Żywności w Trójmieście', category: 'ngo' },
  { name: 'Urząd Marszałkowski Województwa Pomorskiego', category: 'samorzad', url: 'https://pomorskie.eu' },
  { name: 'Gmina Kartuzy', category: 'samorzad' },
  { name: 'Powiat Kartuski', category: 'samorzad' },
  { name: 'Gmina Żukowo', category: 'samorzad' },
  { name: 'Gmina Chmielno', category: 'samorzad' },
  { name: 'Starostwo Powiatowe w Kartuzach', category: 'samorzad' },
  { name: 'Fundacja Instytut Nowoczesnej Edukacji', category: 'ngo' },
  { name: 'Fundacja Praw Pacjenta', category: 'ngo' },
  { name: 'Klub Polonia Cambridge', category: 'miedzynarodowy' },
  { name: 'Fundacja Netto', category: 'grant' },
  { name: 'Fundacja Rozwoju Systemu Edukacji', category: 'grant' },
  { name: 'Kartuskie Centrum Kultury', category: 'kultura' },
  { name: 'OSP w Sulęczynie', category: 'samorzad' },
  { name: 'Instytut Pawła Adamowicza', category: 'ngo' },
  { name: 'Fundacja Impuls', category: 'ngo' },
]

export const FEATURED_PARTNERS = PARTNERZY.slice(0, 6)
