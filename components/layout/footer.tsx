import Link from 'next/link'
import { Facebook, Instagram, Youtube, Phone, Mail, MapPin } from 'lucide-react'
import { SOK } from '@/lib/constants'
import { KrsClickToCopy } from '@/components/sok/krs-click-to-copy'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="mt-24 bg-[var(--color-ok-primary-900)] text-[var(--color-ok-text-inverse)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <h3 className="font-headline text-lg font-semibold mb-4">{SOK.legalName}</h3>
            <p className="text-sm leading-relaxed opacity-90 mb-3">
              <span className="block opacity-75">KRS</span>
              <span className="font-mono">{SOK.krs}</span>
            </p>
            <p className="text-sm leading-relaxed opacity-90 mb-3">
              <span className="block opacity-75">NIP</span>
              <span className="font-mono">{SOK.nip}</span>
            </p>
            <p className="text-sm leading-relaxed opacity-90">
              <span className="block opacity-75">REGON</span>
              <span className="font-mono">{SOK.regon}</span>
            </p>
          </div>

          <div>
            <h3 className="font-headline text-lg font-semibold mb-4">Kontakt</h3>
            <address className="not-italic text-sm space-y-3 opacity-90">
              <div className="flex items-start gap-2">
                <MapPin className="size-4 mt-0.5 shrink-0" />
                <span>
                  {SOK.address.street}<br />
                  {SOK.address.postalCode} {SOK.address.city}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="size-4 shrink-0" />
                <a href={`tel:${SOK.contact.phoneE164}`} className="hover:underline">
                  {SOK.contact.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="size-4 shrink-0" />
                <a href={`tel:${SOK.contact.cwuPhoneE164}`} className="hover:underline">
                  {SOK.contact.cwuPhone}
                </a>
                <span className="text-xs opacity-75">(CWU)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="size-4 shrink-0" />
                <a href={`mailto:${SOK.contact.email}`} className="hover:underline break-all">
                  {SOK.contact.email}
                </a>
              </div>
            </address>
          </div>

          <div>
            <h3 className="font-headline text-lg font-semibold mb-4">Znajdziesz nas</h3>
            <div className="flex flex-wrap gap-3">
              <a href={SOK.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="p-2 rounded-md bg-white/10 hover:bg-white/20 transition-colors">
                <Facebook className="size-5" />
              </a>
              <a href={SOK.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="p-2 rounded-md bg-white/10 hover:bg-white/20 transition-colors">
                <Instagram className="size-5" />
              </a>
              <a href={SOK.social.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="p-2 rounded-md bg-white/10 hover:bg-white/20 transition-colors">
                <Youtube className="size-5" />
              </a>
            </div>
            <p className="mt-4 text-xs opacity-70">
              Centrum Wsparcia Uchodźców:{' '}
              <a href={SOK.social.cwuFacebook} target="_blank" rel="noopener noreferrer" className="underline hover:opacity-100">
                cwukartuzy
              </a>
            </p>
          </div>

          <div>
            <h3 className="font-headline text-lg font-semibold mb-4">Wsparcie 1% PIT</h3>
            <p className="text-sm opacity-90 mb-3">
              Status OPP — przekaż 1% podatku:
            </p>
            <div className="bg-white/10 rounded-md p-3">
              <KrsClickToCopy variant="dark" />
            </div>
            <Link
              href="/wesprzyj"
              className="inline-block mt-3 text-sm font-medium text-[var(--color-ok-gold-soft)] hover:text-white"
            >
              Inne formy wsparcia →
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/15 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <p className="text-xs opacity-70">
            © {year} {SOK.legalName}. Wszystkie prawa zastrzeżone.
          </p>
          <p className="text-xs opacity-70">
            <span aria-hidden="true">·</span> Organizacja Pożytku Publicznego
          </p>
        </div>
      </div>
    </footer>
  )
}
