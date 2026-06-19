import type { Metadata } from 'next'
import { AnimatedSection } from '@/components/sok/animated-section'
import Image from 'next/image'
import Link from 'next/link'
import { SOK } from '@/lib/constants'
import { ZARZAD, KOMISJA_REWIZYJNA } from '@/lib/data/zarzad'
import { HISTORIA } from '@/lib/data/historia'
import { PARTNERZY } from '@/lib/data/partnerzy'
import { BoardMemberCard } from '@/components/sok/board-member-card'
import { HistoryTimeline } from '@/components/sok/timeline-event'
import { KaszubskiDivider } from '@/components/sok/kaszubski-divider'

export const metadata: Metadata = {
  title: 'O nas',
  description: 'Stowarzyszenie Otwarte Kaszuby od 2018 roku łączy ludzi, kultury i społeczności na Kaszubach. Status OPP. Misja, wartości, zarząd, historia.',
}

const VALUES = SOK.values

const PARTNER_GROUPS = {
  samorzad: 'Samorząd',
  ngo: 'Organizacje pozarządowe',
  grant: 'Grantodawcy',
  miedzynarodowy: 'Współpraca międzynarodowa',
  kultura: 'Instytucje kultury',
  biznes: 'Biznes',
} as const

export default function ONas() {
  const partnersByCategory = (Object.keys(PARTNER_GROUPS) as (keyof typeof PARTNER_GROUPS)[]).map((cat) => ({
    label: PARTNER_GROUPS[cat],
    items: PARTNERZY.filter((p) => p.category === cat),
  })).filter((g) => g.items.length > 0)

  return (
    <article>
      <section className="relative bg-[var(--color-ok-bg-secondary)] py-16 lg:py-20 overflow-hidden">
        <span aria-hidden="true" className="blob-2 top-10 -right-20 w-96 h-96 bg-[var(--color-ok-gold-soft)]" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <nav aria-label="breadcrumb" className="text-sm text-[var(--color-ok-text-secondary)] mb-4 animate-fade-in-up">
            <Link href="/" className="link-underline hover:text-[var(--color-ok-primary)]">Strona główna</Link>
            <span aria-hidden="true" className="mx-2">›</span>
            <span aria-current="page">O nas</span>
          </nav>
          <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>O nas</h1>
          <span className="inline-block bg-[var(--color-ok-gold)] text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-6 animate-fade-in-up" style={{ animationDelay: '250ms' }}>
            Organizacja Pożytku Publicznego
          </span>
          <p className="text-lg text-[var(--color-ok-text-secondary)] leading-relaxed animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            {SOK.mission}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <AnimatedSection animation="fade-up">
          <h2 className="font-headline text-3xl md:text-4xl font-bold mb-6">Nasze wartości</h2>
        </AnimatedSection>
        <div className="flex flex-wrap gap-3">
          {VALUES.map((v, idx) => (
            <AnimatedSection key={v} animation="zoom-in" delay={idx * 60}>
              <span className="inline-block px-4 py-2 bg-[var(--color-ok-bg-tertiary)] text-[var(--color-ok-primary)] rounded-full text-sm font-medium border border-[var(--color-ok-border-default)] hover:scale-110 hover:bg-[var(--color-ok-primary-50)] transition-all cursor-default">
                {v}
              </span>
            </AnimatedSection>
          ))}
        </div>
      </section>

      <KaszubskiDivider variant="lilia" />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <AnimatedSection animation="fade-up">
          <h2 className="font-headline text-3xl md:text-4xl font-bold mb-3">Zespół w działaniu</h2>
          <p className="text-[var(--color-ok-text-secondary)] mb-10 max-w-2xl">
            Kilkanaście aktywnych osób, ponad 60 wolontariuszy i tysiące godzin pracy społecznej.
            Razem zmieniamy region.
          </p>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          <AnimatedSection animation="fade-up" delay={0} className="md:col-span-2 md:row-span-2">
            <div className="relative aspect-[4/3] md:aspect-auto md:h-full rounded-2xl overflow-hidden group">
              <Image
                src="https://otwartekaszuby.pl/wp-content/uploads/2023/05/obraz_viber_2023-05-31_11-31-39-728-1024x804.jpg"
                alt="Zespół Stowarzyszenia Otwarte Kaszuby — solidarność z Ukrainą"
                fill
                sizes="(max-width: 768px) 100vw, 66vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <p className="text-sm font-mono uppercase tracking-wider opacity-90 mb-1">Solidarność z Ukrainą</p>
                <p className="font-headline text-xl lg:text-2xl font-semibold">Wspólnie dla pomocy humanitarnej</p>
              </div>
            </div>
          </AnimatedSection>
          <AnimatedSection animation="fade-up" delay={150}>
            <div className="relative aspect-square rounded-2xl overflow-hidden group">
              <Image
                src="https://otwartekaszuby.pl/wp-content/uploads/2023/06/photo_2023-06-21_09-31-23-2.jpg"
                alt="Działania Stowarzyszenia"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <p className="font-headline text-base font-semibold">Wsparcie społeczne</p>
              </div>
            </div>
          </AnimatedSection>
          <AnimatedSection animation="fade-up" delay={300}>
            <div className="relative aspect-square rounded-2xl overflow-hidden group">
              <Image
                src="https://otwartekaszuby.pl/wp-content/uploads/2026/02/Aleksandra-Cieszynska_Otwarci-na-rozwoj-1024x683.jpg"
                alt="Aleksandra Cieszyńska — Wiceprzewodnicząca SOK"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <p className="font-mono text-xs uppercase tracking-wider opacity-90">Aleksandra Cieszyńska</p>
                <p className="font-headline text-base font-semibold">Otwarci na rozwój</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <KaszubskiDivider variant="kalina" />

      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <AnimatedSection animation="fade-up">
          <h2 className="font-headline text-3xl md:text-4xl font-bold mb-10">Nasza historia</h2>
        </AnimatedSection>
        <AnimatedSection animation="fade-up" delay={150}>
          <HistoryTimeline events={HISTORIA} />
        </AnimatedSection>
      </section>

      <KaszubskiDivider variant="tulipan" />

      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <AnimatedSection animation="fade-up">
          <h2 className="font-headline text-3xl md:text-4xl font-bold mb-3">Zarząd</h2>
          <p className="text-[var(--color-ok-text-secondary)] mb-10">
            Skład zgodny z aktualnym wpisem w Krajowym Rejestrze Sądowym.
          </p>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {ZARZAD.map((m, idx) => (
            <AnimatedSection key={`${m.firstName}-${m.lastName}`} animation="fade-up" delay={idx * 150}>
              <BoardMemberCard member={m} />
            </AnimatedSection>
          ))}
        </div>
        <aside className="bg-[var(--color-ok-bg-tertiary)] border-l-4 border-[var(--color-ok-gold)] p-6 rounded-r-md">
          <h3 className="font-semibold mb-2 text-[var(--color-ok-text-primary)]">Reprezentacja</h3>
          <p className="text-[var(--color-ok-text-secondary)] text-sm leading-relaxed">{SOK.representation}</p>
        </aside>
      </section>

      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <AnimatedSection animation="fade-up">
          <h2 className="font-headline text-3xl md:text-4xl font-bold mb-10">Komisja Rewizyjna</h2>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {KOMISJA_REWIZYJNA.map((m, idx) => (
            <AnimatedSection key={`${m.firstName}-${m.lastName}`} animation="fade-up" delay={idx * 150}>
              <BoardMemberCard member={m} />
            </AnimatedSection>
          ))}
        </div>
      </section>

      <KaszubskiDivider variant="kalina" />

      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="font-headline text-3xl md:text-4xl font-bold mb-10">Z kim współpracujemy</h2>
        <div className="space-y-8">
          {partnersByCategory.map((group) => (
            <div key={group.label}>
              <h3 className="font-headline text-xl font-semibold mb-4">{group.label}</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {group.items.map((p) => (
                  <li key={p.name}>
                    {p.url ? (
                      <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-[var(--color-ok-primary)] hover:underline">
                        {p.name}
                      </a>
                    ) : (
                      <span className="text-[var(--color-ok-text-secondary)]">{p.name}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 mb-16">
        <div className="bg-[var(--color-ok-bg-tertiary)] rounded-xl p-8">
          <h2 className="font-headline text-2xl font-bold mb-4">Dane rejestrowe</h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-[var(--color-ok-text-tertiary)] uppercase text-xs tracking-wider">KRS</dt>
              <dd className="font-mono text-base">{SOK.krs}</dd>
            </div>
            <div>
              <dt className="text-[var(--color-ok-text-tertiary)] uppercase text-xs tracking-wider">NIP</dt>
              <dd className="font-mono text-base">{SOK.nip}</dd>
            </div>
            <div>
              <dt className="text-[var(--color-ok-text-tertiary)] uppercase text-xs tracking-wider">REGON</dt>
              <dd className="font-mono text-base">{SOK.regon}</dd>
            </div>
            <div>
              <dt className="text-[var(--color-ok-text-tertiary)] uppercase text-xs tracking-wider">Data rejestracji</dt>
              <dd className="font-mono text-base">{SOK.registeredAt}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-[var(--color-ok-text-tertiary)] uppercase text-xs tracking-wider">Adres siedziby</dt>
              <dd>{SOK.address.street}, {SOK.address.postalCode} {SOK.address.city}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-[var(--color-ok-text-tertiary)] uppercase text-xs tracking-wider">Forma prawna</dt>
              <dd>{SOK.legalForm}</dd>
            </div>
          </dl>
        </div>
      </section>
    </article>
  )
}
