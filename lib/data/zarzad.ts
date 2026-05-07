import type { BoardMember } from './types'

// Dane zgodne z aktualnym wpisem KRS · stan na 2026-04-28
// Źródło: rejestr.io/krs/718370/stowarzyszenie-otwarte-kaszuby
// D-014 · D-017 · D-WWW-otwarte-kaszuby-014 + 017
export const ZARZAD: BoardMember[] = [
  {
    firstName: 'Karolina',
    lastName: 'Janczukowicz',
    position: 'czlonkini_zarzadu',
    positionLabel: 'Członkini Zarządu',
    organ: 'zarzad',
    since: '2021-04-08',
    bio: 'Adiunkt Instytutu Anglistyki i Amerykanistyki Wydziału Filologicznego Uniwersytetu Gdańskiego. Prowadzi zajęcia z języka polskiego dla osób z Ukrainy w ramach Centrum Wsparcia Uchodźców.',
  },
  {
    firstName: 'Aleksandra',
    lastName: 'Cieszyńska',
    position: 'wiceprzewodniczaca',
    positionLabel: 'Wiceprzewodnicząca',
    organ: 'zarzad',
    since: '2022-10-06',
    bio: 'Prawniczka i specjalistka ds. prawa samorządowego, NGO oraz komunikacji publicznej. Radna powiatu kartuskiego. Członkini Rady Działalności Pożytku Publicznego w Powiecie Kartuskim. Specjalizuje się w prawie samorządowym, prawie NGO, komunikacji publicznej i poradnictwie obywatelskim.',
  },
]

export const KOMISJA_REWIZYJNA: BoardMember[] = [
  {
    firstName: 'Adrian',
    lastName: 'Pawłowski',
    position: 'czlonek_komisji',
    positionLabel: 'Członek Komisji Rewizyjnej',
    organ: 'komisja_rewizyjna',
    since: '2026-04-28',
  },
  {
    firstName: 'Radosław',
    lastName: 'Cebela',
    position: 'czlonek_komisji',
    positionLabel: 'Członek Komisji Rewizyjnej',
    organ: 'komisja_rewizyjna',
    since: '2026-04-28',
    bio: 'Od kilkunastu lat związany z pracą w samorządzie terytorialnym. Współpracuje z organizacjami pozarządowymi, koordynował Budżet Obywatelski w Żukowie. Aktywnie angażuje się w działalność społeczną na rzecz mieszkańców powiatu kartuskiego.',
  },
]
