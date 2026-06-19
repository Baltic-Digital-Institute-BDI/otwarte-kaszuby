import { AnimatedSection } from '@/components/sok/animated-section'
import Link from 'next/link'
import { ExternalLink, ArrowRight } from 'lucide-react'
import { SOK, FEATURES } from '@/lib/constants'
import { KrsClickToCopy } from '@/components/sok/krs-click-to-copy'
import { PayPalLogo, FaniManiLogo, PatroniteLogo } from '@/components/sok/donation-logos'
import { donateActionSchema } from '@/lib/seo/schema'

export default function WesprzyjHardcoded() {
  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(donateActionSchema()) }}
      />

      <section className="bg-[var(--color-ok-bg-secondary)] py-16 lg:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <nav aria-label="breadcrumb" className="text-sm text-[var(--color-ok-text-secondary)] mb-4">
            <Link href="/" className="hover:text-[var(--color-ok-primary)]">Strona główna</Link>
            <span aria-hidden="true" className="mx-2">›</span>
            <span aria-current="page">Wesprzyj</span>
          </nav>
          <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in-up">
            Twoje wsparcie zmienia życia
          </h1>
          <p className="text-lg text-[var(--color-ok-text-secondary)] max-w-3xl leading-relaxed">
            Każda złotówka trafia na cele statutowe Stowarzyszenia Otwarte Kaszuby.
            Status Organizacji Pożytku Publicznego pozwala Ci wybrać dogodną formę wsparcia.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-[var(--color-ok-bg-tertiary)] border-2 border-[var(--color-ok-gold)] rounded-2xl p-8 lg:p-10">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="inline-block bg-[var(--color-ok-gold)] text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
              Rekomendowane
            </span>
            <span className="inline-block bg-[var(--color-ok-success-bg)] text-[var(--color-ok-success)] px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
              0 zł kosztu dla Ciebie
            </span>
          </div>
          <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4">Przekaż 1% podatku</h2>
          <p className="text-[var(--color-ok-text-secondary)] mb-6 leading-relaxed">
            W zeznaniu rocznym PIT-37, PIT-36 lub PIT-28 wpisz nasz numer KRS w sekcji
            "Wniosek o przekazanie 1% podatku".
          </p>
          <div className="max-w-lg">
            <KrsClickToCopy />
          </div>
          <details className="mt-6 group">
            <summary className="cursor-pointer text-[var(--color-ok-primary)] font-medium hover:underline list-none flex items-center gap-2">
              <ArrowRight className="size-4 group-open:rotate-90 transition-transform" />
              Jak to zrobić — instrukcja krok po kroku
            </summary>
            <ol className="mt-4 ml-6 list-decimal space-y-3 text-[var(--color-ok-text-secondary)]">
              <li>W zeznaniu rocznym znajdź sekcję "Wniosek o przekazanie 1,5% (lub 1%) podatku organizacji pożytku publicznego".</li>
              <li>Wpisz nasz numer KRS: <code className="font-mono font-semibold text-[var(--color-ok-text-primary)]">{SOK.krs}</code></li>
              <li>Nazwa organizacji wypełni się automatycznie: <strong>{SOK.legalName}</strong></li>
              <li>Możesz dodać cel szczegółowy (opcjonalnie) — np. "CWU" lub "Seniorzy".</li>
              <li>Wyślij zeznanie elektronicznie lub złóż w urzędzie skarbowym.</li>
            </ol>
          </details>
        </div>
      </section>

      {FEATURES.bankTransfer && (
        <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="font-headline text-3xl font-bold mb-6">Przelew bankowy</h2>
          <p className="text-[var(--color-ok-text-secondary)]">
            (Dane konta zostaną opublikowane wkrótce.)
          </p>
        </section>
      )}

      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        <AnimatedSection animation="fade-up">
          <h2 className="font-headline text-3xl font-bold mb-6">Wsparcie online</h2>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AnimatedSection animation="fade-up" delay={0}>
            <a
              href={SOK.donations.patroniteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="card-hover group flex flex-col h-full bg-white rounded-xl p-8 border border-[var(--color-ok-border-default)] hover:border-[#FF424D] relative overflow-hidden"
            >
              <span className="inline-block self-start bg-[#FF424D] text-white px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
                Comiesięczne wsparcie
              </span>
              <div className="h-12 mb-4 flex items-center">
                <PatroniteLogo className="h-9 w-auto" />
              </div>
              <p className="text-[var(--color-ok-text-secondary)] mb-4 flex-1">
                Zostań Patronem. Od kilku zł miesięcznie regularnie wspierasz nasze działania i otrzymujesz informacje z pierwszej ręki.
              </p>
              <span className="inline-flex items-center gap-2 text-[#FF424D] font-semibold">
                Zostań Patronem <ExternalLink className="size-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </a>
          </AnimatedSection>
          <AnimatedSection animation="fade-up" delay={120}>
            <a
              href={SOK.donations.paypalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="card-hover group flex flex-col h-full bg-white rounded-xl p-8 border border-[var(--color-ok-border-default)] hover:border-[#003087]"
            >
              <span className="inline-block self-start bg-[var(--color-ok-bg-tertiary)] text-[var(--color-ok-text-secondary)] px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
                Jednorazowo
              </span>
              <div className="h-12 mb-4 flex items-center">
                <PayPalLogo className="h-7 w-auto" />
              </div>
              <p className="text-[var(--color-ok-text-secondary)] mb-4 flex-1">
                Wpłać dowolną kwotę kartą lub z konta PayPal. Szybko i bezpiecznie.
              </p>
              <span className="inline-flex items-center gap-2 text-[#003087] font-semibold">
                Wpłać przez PayPal <ExternalLink className="size-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </a>
          </AnimatedSection>
          <AnimatedSection animation="fade-up" delay={240}>
            <a
              href={SOK.donations.fanimaniUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="card-hover group flex flex-col h-full bg-white rounded-xl p-8 border border-[var(--color-ok-border-default)] hover:border-[#E5267C]"
            >
              <span className="inline-block self-start bg-[var(--color-ok-bg-tertiary)] text-[var(--color-ok-text-secondary)] px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
                Bez kosztu dla Ciebie
              </span>
              <div className="h-12 mb-4 flex items-center">
                <FaniManiLogo className="h-7 w-auto" />
              </div>
              <p className="text-[var(--color-ok-text-secondary)] mb-4 flex-1">
                Zakupy online u partnerów FaniMani — sklepy oddają nam część prowizji. Nic Cię nie kosztuje.
              </p>
              <span className="inline-flex items-center gap-2 text-[#E5267C] font-semibold">
                Aktywuj wsparcie <ExternalLink className="size-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </a>
          </AnimatedSection>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="font-headline text-3xl font-bold mb-6">Pomoc rzeczowa</h2>
        <div className="bg-[var(--color-ok-bg-tertiary)] rounded-xl p-8 border-l-4 border-[var(--color-ok-primary)]">
          <p className="text-[var(--color-ok-text-primary)] leading-relaxed mb-6">
            Centrum Wsparcia Uchodźców przyjmuje regularne wsparcie rzeczowe — paczki żywnościowe,
            środki higieniczne, ubrania zimowe oraz inne potrzeby zgłaszane przez podopiecznych.
            Aby uzgodnić formę pomocy, skontaktuj się bezpośrednio z koordynatorami CWU.
          </p>
          <a
            href={`tel:${SOK.contact.cwuPhoneE164}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-ok-primary)] text-white rounded-md font-medium hover:bg-[var(--color-ok-primary-hover)] transition-colors"
          >
            Zadzwoń do CWU: {SOK.contact.cwuPhone}
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 mb-16">
        <div className="bg-[var(--color-ok-info)]/5 border border-[var(--color-ok-info)]/20 rounded-xl p-6 text-sm text-[var(--color-ok-text-secondary)]">
          <p className="leading-relaxed">
            <strong className="text-[var(--color-ok-text-primary)]">Informacja podatkowa:</strong>{' '}
            Darowizny dla organizacji pożytku publicznego są odliczalne od dochodu — do 6% rocznego dochodu (osoby fizyczne) lub 10% (firmy). Status OPP Stowarzyszenia Otwarte Kaszuby został potwierdzony w Krajowym Rejestrze Sądowym (KRS {SOK.krs}).
          </p>
        </div>
      </section>
    </article>
  )
}

