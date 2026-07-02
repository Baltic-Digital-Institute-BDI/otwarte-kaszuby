import Link from 'next/link'
import { Facebook, Instagram, Youtube, Phone, Mail, MapPin } from 'lucide-react'
import { SOK } from '@/lib/constants'
import { KrsClickToCopy } from '@/components/sok/krs-click-to-copy'
import { getStory } from '@/lib/storyblok/client'

/** Storyblok global footer content · shape z schema footer_global */
interface FooterGlobalContent {
  component: 'footer_global'
  legal_name: string
  krs: string
  nip: string
  regon: string
  address_street: string
  address_postal: string
  address_city: string
  phone: string
  phone_e164: string
  cwu_phone: string
  cwu_phone_e164: string
  email: string
  facebook_url: string
  instagram_url: string
  youtube_url: string
  cwu_facebook_url: string
  cwu_facebook_label: string
  opp_title: string
  opp_description: string
  opp_link_label: string
  copyright_suffix: string
  opp_badge: string
}

/**
 * Fallback z SOK constants jeśli Storyblok fetch fails.
 * Zapewnia że stopka zawsze się renderuje (bezpiecznik).
 */
function fallbackFromConstants(): FooterGlobalContent {
  return {
    component: 'footer_global',
    legal_name: SOK.legalName,
    krs: SOK.krs,
    nip: SOK.nip,
    regon: SOK.regon,
    address_street: SOK.address.street,
    address_postal: SOK.address.postalCode,
    address_city: SOK.address.city,
    phone: SOK.contact.phone,
    phone_e164: SOK.contact.phoneE164,
    cwu_phone: SOK.contact.cwuPhone,
    cwu_phone_e164: SOK.contact.cwuPhoneE164,
    email: SOK.contact.email,
    facebook_url: SOK.social.facebook,
    instagram_url: SOK.social.instagram,
    youtube_url: SOK.social.youtube,
    cwu_facebook_url: SOK.social.cwuFacebook,
    cwu_facebook_label: 'cwukartuzy',
    opp_title: 'Wsparcie 1% PIT',
    opp_description: 'Status OPP — przekaż 1% podatku:',
    opp_link_label: 'Inne formy wsparcia →',
    copyright_suffix: 'Wszystkie prawa zastrzeżone.',
    opp_badge: 'Organizacja Pożytku Publicznego',
  }
}

export async function Footer() {
  const year = new Date().getFullYear()
  const story = await getStory<FooterGlobalContent>('_globals/footer')
  const c = story?.content ?? fallbackFromConstants()

  return (
    <footer className="mt-24 bg-[var(--color-ok-primary-900)] text-[var(--color-ok-text-inverse)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <h3 className="font-headline text-lg font-semibold mb-4">{c.legal_name}</h3>
            <p className="text-sm leading-relaxed opacity-90 mb-3">
              <span className="block opacity-75">KRS</span>
              <span className="font-mono">{c.krs}</span>
            </p>
            <p className="text-sm leading-relaxed opacity-90 mb-3">
              <span className="block opacity-75">NIP</span>
              <span className="font-mono">{c.nip}</span>
            </p>
            <p className="text-sm leading-relaxed opacity-90">
              <span className="block opacity-75">REGON</span>
              <span className="font-mono">{c.regon}</span>
            </p>
          </div>

          <div>
            <h3 className="font-headline text-lg font-semibold mb-4">Kontakt</h3>
            <address className="not-italic text-sm space-y-3 opacity-90">
              <div className="flex items-start gap-2">
                <MapPin className="size-4 mt-0.5 shrink-0" />
                <span>
                  {c.address_street}<br />
                  {c.address_postal} {c.address_city}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="size-4 shrink-0" />
                <a href={`tel:${c.phone_e164}`} className="hover:underline">
                  {c.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="size-4 shrink-0" />
                <a href={`tel:${c.cwu_phone_e164}`} className="hover:underline">
                  {c.cwu_phone}
                </a>
                <span className="text-xs opacity-75">(CWU)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="size-4 shrink-0" />
                <a href={`mailto:${c.email}`} className="hover:underline break-all">
                  {c.email}
                </a>
              </div>
            </address>
          </div>

          <div>
            <h3 className="font-headline text-lg font-semibold mb-4">Znajdziesz nas</h3>
            <div className="flex flex-wrap gap-3">
              <a href={c.facebook_url} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="p-2 rounded-md bg-white/10 hover:bg-white/20 transition-colors">
                <Facebook className="size-5" />
              </a>
              <a href={c.instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="p-2 rounded-md bg-white/10 hover:bg-white/20 transition-colors">
                <Instagram className="size-5" />
              </a>
              <a href={c.youtube_url} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="p-2 rounded-md bg-white/10 hover:bg-white/20 transition-colors">
                <Youtube className="size-5" />
              </a>
            </div>
            <p className="mt-4 text-xs opacity-70">
              Centrum Wsparcia Uchodźców:{' '}
              <a href={c.cwu_facebook_url} target="_blank" rel="noopener noreferrer" className="underline hover:opacity-100">
                {c.cwu_facebook_label}
              </a>
            </p>
          </div>

          <div>
            <h3 className="font-headline text-lg font-semibold mb-4">{c.opp_title}</h3>
            <p className="text-sm opacity-90 mb-3">
              {c.opp_description}
            </p>
            <div className="bg-white/10 rounded-md p-3">
              <KrsClickToCopy variant="dark" krs={c.krs} />
            </div>
            <Link
              href="/wesprzyj"
              className="inline-block mt-3 text-sm font-medium text-[var(--color-ok-gold-soft)] hover:text-white"
            >
              {c.opp_link_label}
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/15 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <p className="text-xs opacity-70">
            © {year} {c.legal_name}. {c.copyright_suffix}
          </p>
          <p className="text-xs opacity-70">
            <span aria-hidden="true">·</span> {c.opp_badge}
          </p>
        </div>
      </div>
    </footer>
  )
}
