import { AnimatedSection } from '@/components/sok/animated-section'
import Link from 'next/link'
import { Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react'
import { SOK } from '@/lib/constants'

export default function KontaktHardcoded() {
  const mapsQuery = encodeURIComponent(`${SOK.address.street}, ${SOK.address.postalCode} ${SOK.address.city}`)

  return (
    <article>
      <section className="bg-[var(--color-ok-bg-secondary)] py-16 lg:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <nav aria-label="breadcrumb" className="text-sm text-[var(--color-ok-text-secondary)] mb-4">
            <Link href="/" className="hover:text-[var(--color-ok-primary)]">Strona główna</Link>
            <span aria-hidden="true" className="mx-2">›</span>
            <span aria-current="page">Kontakt</span>
          </nav>
          <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in-up">Kontakt</h1>
          <p className="text-lg text-[var(--color-ok-text-secondary)] max-w-3xl">
            Skontaktuj się z nami telefonicznie, mailowo lub przyjdź do biura w Kartuzach.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <h2 className="font-headline text-2xl font-bold mb-6">Stowarzyszenie</h2>
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <span className="shrink-0 size-10 rounded-full bg-[var(--color-ok-primary-50)] flex items-center justify-center text-[var(--color-ok-primary)]">
                  <MapPin className="size-5" />
                </span>
                <div>
                  <p className="font-semibold mb-1">Adres siedziby</p>
                  <p className="text-[var(--color-ok-text-secondary)] leading-relaxed">
                    {SOK.address.street}<br />
                    {SOK.address.postalCode} {SOK.address.city}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="shrink-0 size-10 rounded-full bg-[var(--color-ok-primary-50)] flex items-center justify-center text-[var(--color-ok-primary)]">
                  <Phone className="size-5" />
                </span>
                <div>
                  <p className="font-semibold mb-1">Stowarzyszenie</p>
                  <a href={`tel:${SOK.contact.phoneE164}`} className="text-[var(--color-ok-primary)] hover:underline font-mono text-lg">
                    {SOK.contact.phone}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="shrink-0 size-10 rounded-full bg-[var(--color-ok-primary-50)] flex items-center justify-center text-[var(--color-ok-primary)]">
                  <Phone className="size-5" />
                </span>
                <div>
                  <p className="font-semibold mb-1">Centrum Wsparcia Uchodźców</p>
                  <a href={`tel:${SOK.contact.cwuPhoneE164}`} className="text-[var(--color-ok-primary)] hover:underline font-mono text-lg">
                    {SOK.contact.cwuPhone}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="shrink-0 size-10 rounded-full bg-[var(--color-ok-primary-50)] flex items-center justify-center text-[var(--color-ok-primary)]">
                  <Mail className="size-5" />
                </span>
                <div>
                  <p className="font-semibold mb-1">Email</p>
                  <a href={`mailto:${SOK.contact.email}`} className="text-[var(--color-ok-primary)] hover:underline break-all">
                    {SOK.contact.email}
                  </a>
                </div>
              </li>
            </ul>

            <h2 className="font-headline text-2xl font-bold mt-10 mb-4">Social media</h2>
            <div className="flex flex-wrap gap-3">
              <a
                href={SOK.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--color-ok-bg-tertiary)] text-[var(--color-ok-text-primary)] rounded-md hover:bg-[var(--color-ok-primary-50)] transition-colors"
              >
                <Facebook className="size-4" /> Facebook
              </a>
              <a
                href={SOK.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--color-ok-bg-tertiary)] text-[var(--color-ok-text-primary)] rounded-md hover:bg-[var(--color-ok-primary-50)] transition-colors"
              >
                <Instagram className="size-4" /> Instagram
              </a>
            </div>
          </div>

          <div>
            <h2 className="font-headline text-2xl font-bold mb-6">Dane rejestrowe</h2>
            <dl className="space-y-3 mb-8">
              <div className="flex justify-between gap-4 py-2 border-b border-[var(--color-ok-border-default)]">
                <dt className="text-[var(--color-ok-text-secondary)]">KRS</dt>
                <dd className="font-mono font-semibold">{SOK.krs}</dd>
              </div>
              <div className="flex justify-between gap-4 py-2 border-b border-[var(--color-ok-border-default)]">
                <dt className="text-[var(--color-ok-text-secondary)]">NIP</dt>
                <dd className="font-mono font-semibold">{SOK.nip}</dd>
              </div>
              <div className="flex justify-between gap-4 py-2 border-b border-[var(--color-ok-border-default)]">
                <dt className="text-[var(--color-ok-text-secondary)]">REGON</dt>
                <dd className="font-mono font-semibold">{SOK.regon}</dd>
              </div>
              <div className="flex justify-between gap-4 py-2 border-b border-[var(--color-ok-border-default)]">
                <dt className="text-[var(--color-ok-text-secondary)]">Forma prawna</dt>
                <dd className="text-right">{SOK.legalForm}</dd>
              </div>
              <div className="flex justify-between gap-4 py-2 border-b border-[var(--color-ok-border-default)]">
                <dt className="text-[var(--color-ok-text-secondary)]">Status</dt>
                <dd className="text-right text-[var(--color-ok-success)] font-semibold">OPP</dd>
              </div>
            </dl>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 border-2 border-[var(--color-ok-primary)] text-[var(--color-ok-primary)] rounded-md font-medium hover:bg-[var(--color-ok-primary-50)] transition-colors"
            >
              <MapPin className="size-4" /> Otwórz w Google Maps
            </a>
          </div>
        </div>
      </section>
    </article>
  )
}

