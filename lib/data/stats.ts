import type { Stat } from './types'

// Statystyki kumulatywne CWU 2022-2024 · źródło Drive Opis SOK
export const STATS_HOMEPAGE: Stat[] = [
  { value: 7200, suffix: '+', label: 'uchodźców pod opieką' },
  { value: 7000, suffix: '+', label: 'paczek żywnościowych' },
  { value: 31, label: 'transportów humanitarnych' },
  { value: 60, suffix: '+', label: 'wolontariuszy' },
]

export const STATS_CWU_DETAIL: Stat[] = [
  { value: 7200, suffix: '+', label: 'uchodźców pod opieką' },
  { value: 7000, suffix: '+', label: 'paczek żywnościowych' },
  { value: 3000, suffix: '+', label: 'porad obywatelskich' },
  { value: 200, suffix: 'h', label: 'porad psychologicznych' },
  { value: 100, suffix: '+', label: 'osób na kursach języka polskiego' },
  { value: 31, label: 'transportów humanitarnych do Ukrainy' },
]
