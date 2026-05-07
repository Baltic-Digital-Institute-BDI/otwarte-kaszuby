export const SOK = {
  legalName: 'Stowarzyszenie Otwarte Kaszuby',
  shortName: 'SOK',
  krs: '0000718370',
  nip: '5892040045',
  regon: '369483509',
  registeredAt: '2018-02-12',
  oppStatus: true,
  legalForm: 'Stowarzyszenie rejestrowe',
  address: {
    street: 'ul. Dworcowa 13 A / 10',
    postalCode: '83-300',
    city: 'Kartuzy',
    country: 'PL',
    countryName: 'Polska',
  },
  contact: {
    phone: '+48 697 068 146',
    phoneE164: '+48697068146',
    cwuPhone: '+48 695 127 816',
    cwuPhoneE164: '+48695127816',
    email: 'kontakt@otwartekaszuby.pl',
  },
  social: {
    facebook: 'https://www.facebook.com/OtwarteKaszuby/',
    instagram: 'https://www.instagram.com/otwartekaszuby/',
    youtube: 'https://www.youtube.com/channel/UCcmhJDJuR5ppk2bWgJs1wbg',
    cwuFacebook: 'https://www.facebook.com/cwukartuzy',
  },
  donations: {
    paypalUrl: 'https://www.paypal.com/donate?hosted_button_id=PLACEHOLDER',
    fanimaniUrl: 'https://fanimani.pl/otwartekaszuby/',
    patroniteUrl: 'https://patronite.pl/otwartekaszuby',
  },
  representation:
    'Do składania oświadczeń woli w imieniu Stowarzyszenia, w tym w sprawach majątkowych, uprawnionych jest dwóch członków zarządu działających łącznie.',
  mission:
    'Łączymy ludzi, kultury i społeczności na Kaszubach poprzez budowanie mostów wzajemnego zrozumienia, współpracy oraz promocji lokalnej tożsamości. Pielęgnujemy tradycje i dziedzictwo Kaszub, jednocześnie otwierając się na nowe idee i możliwości.',
  shortMission: 'Łączymy ludzi, kultury i społeczności na Kaszubach.',
  values: [
    'Otwartość',
    'Współpraca',
    'Szacunek',
    'Solidarność',
    'Rozwój',
    'Tradycja',
    'Innowacyjność',
    'Wspólnota',
  ],
} as const

export const SITE = {
  name: 'Stowarzyszenie Otwarte Kaszuby',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://otwartekaszuby.pl',
  defaultDescription:
    'Łączymy ludzi, kultury i społeczności na Kaszubach. Stowarzyszenie OPP działa od 2018 roku.',
  ogImage: '/og-default.png',
} as const

// Feature flags · ENV-gated future implementations (per Adam directive 2026-05-07)
export const FEATURES = {
  cms: false, // Sanity Studio · deferred
  newsletter: false, // Brevo · deferred · sekcja UKRYTA gdy false
  contactForm: false, // Resend · deferred · contact = mailto + tel only
  analytics: false, // Plausible · deferred
  cookieBanner: false, // No analytics = no banner needed
  bankTransfer: false, // D-016 · numer konta hidden until populated
  reports: false, // D-013 · sprawozdania hidden until populated
} as const
