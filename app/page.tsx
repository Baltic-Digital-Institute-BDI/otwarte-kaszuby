import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { SOK } from '@/lib/constants'
import { STATS_HOMEPAGE } from '@/lib/data/stats'
import { getFeaturedProjects } from '@/lib/data/projekty'
import { getRecentNews } from '@/lib/data/aktualnosci'
import { FEATURED_PARTNERS } from '@/lib/data/partnerzy'
import { ProjectCard } from '@/components/sok/project-card'
import { StatsCounter } from '@/components/sok/stats-counter'
import { KaszubskiDivider } from '@/components/sok/kaszubski-divider'
import { DonateCTA } from '@/components/sok/donate-cta'
import { AnimatedSection } from '@/components/sok/animated-section'
import { formatDate } from '@/lib/utils'

export default function HomePage() {
  const projects = getFeaturedProjects(3)
  const news = getRecentNews(3)

  return (
    <>
      <section className="relative bg-[var(--color-ok-bg-secondary)] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 animate-ken-burns">
            <Image
              src="/images/klodno-kaszuby.jpg"
              alt="Krajobraz Kaszub"
              fill
              sizes="100vw"
              className="object-cover opacity-30"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-ok-bg-secondary)] via-[var(--color-ok-bg-secondary)]/80 to-transparent" />
          <span aria-hidden="true" className="blob-1 top-10 -left-20 w-96 h-96 bg-[var(--color-ok-primary)]" />
          <span aria-hidden="true" className="blob-2 bottom-0 right-10 w-[500px] h-[500px] bg-[var(--color-ok-gold-soft)]" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-4xl">
            <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] mb-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              Łączymy ludzi, kultury i społeczności na <span className="text-[var(--color-ok-primary)]">Kaszubach</span>.
            </h1>
            <p className="text-lg lg:text-xl text-[var(--color-ok-text-secondary)] max-w-2xl leading-relaxed mb-8 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              Stowarzyszenie Otwarte Kaszuby od 2018 roku działa na rzecz rozwoju regionu, kultury kaszubskiej i wsparcia uchodźców. Status Organizacji Pożytku Publicznego.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
              <Link
                href="/wesprzyj"
                className="btn-shine group inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[var(--color-ok-primary)] text-white font-medium rounded-md hover:bg-[var(--color-ok-primary-hover)] transition-all hover:scale-[1.02] hover:shadow-lg-warm"
              >
                Przekaż 1% PIT
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/projekty"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border-2 border-[var(--color-ok-primary)] text-[var(--color-ok-primary)] font-medium rounded-md hover:bg-[var(--color-ok-primary-50)] transition-all hover:scale-[1.02]"
              >
                Poznaj nasze projekty
              </Link>
            </div>
          </div>
        </div>
      </section>

      <KaszubskiDivider variant="tulipan" />

      <AnimatedSection animation="fade-up">
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16" aria-labelledby="stats-heading">
          <h2 id="stats-heading" className="sr-only">Nasze osiągnięcia</h2>
          <StatsCounter stats={[...STATS_HOMEPAGE]} />
        </section>
      </AnimatedSection>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20" aria-labelledby="projects-heading">
        <AnimatedSection animation="fade-up">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <h2 id="projects-heading" className="font-headline text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
                Co robimy?
              </h2>
              <p className="text-[var(--color-ok-text-secondary)] text-lg max-w-2xl">
                Aktywne programy wspierające mieszkańców regionu i osoby w kryzysie.
              </p>
            </div>
            <Link href="/projekty" className="link-underline inline-flex items-center gap-2 text-[var(--color-ok-primary)] font-medium hover:gap-3 transition-all">
              Wszystkie projekty <ArrowRight className="size-4" />
            </Link>
          </div>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {projects.map((p, idx) => (
            <AnimatedSection key={p.slug} animation="fade-up" delay={idx * 120}>
              <ProjectCard project={p} />
            </AnimatedSection>
          ))}
        </div>
      </section>

      <KaszubskiDivider variant="kalina" />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20" aria-labelledby="news-heading">
        <AnimatedSection animation="fade-up">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <h2 id="news-heading" className="font-headline text-3xl md:text-4xl lg:text-5xl font-bold">
              Aktualności
            </h2>
            <Link href="/aktualnosci" className="link-underline inline-flex items-center gap-2 text-[var(--color-ok-primary)] font-medium hover:gap-3 transition-all">
              Wszystkie aktualności <ArrowRight className="size-4" />
            </Link>
          </div>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {news.map((n, idx) => (
            <AnimatedSection key={n.slug} animation="fade-up" delay={idx * 120}>
              <Link
                href={`/aktualnosci/${n.slug}`}
                className="card-hover group flex flex-col h-full bg-white rounded-xl p-6 border border-[var(--color-ok-border-default)] hover:border-[var(--color-ok-primary)]"
              >
                <time className="text-xs font-mono text-[var(--color-ok-text-tertiary)] uppercase mb-2">{formatDate(n.date)}</time>
                <span className="text-xs font-semibold text-[var(--color-ok-primary)] uppercase mb-3">{n.category}</span>
                <h3 className="font-headline text-xl font-semibold mb-3 group-hover:text-[var(--color-ok-primary)] transition-colors leading-tight">
                  {n.title}
                </h3>
                <p className="text-sm text-[var(--color-ok-text-secondary)] leading-relaxed flex-1">{n.excerpt}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-[var(--color-ok-primary)] text-sm font-medium">
                  Czytaj więcej <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </section>

      <DonateCTA />

      <AnimatedSection animation="fade-up">
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16" aria-labelledby="partners-heading">
          <h2 id="partners-heading" className="text-center text-sm font-semibold uppercase tracking-wider text-[var(--color-ok-text-secondary)] mb-8">
            Wspólnie działamy z
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-6">
            {FEATURED_PARTNERS.map((partner, idx) => (
              <AnimatedSection key={partner.name} animation="zoom-in" delay={idx * 60}>
                <span className="text-[var(--color-ok-text-tertiary)] text-sm font-medium">
                  {partner.url ? (
                    <a href={partner.url} target="_blank" rel="noopener noreferrer" className="link-underline hover:text-[var(--color-ok-primary)] transition-colors">
                      {partner.name}
                    </a>
                  ) : (
                    partner.name
                  )}
                </span>
              </AnimatedSection>
            ))}
          </div>
        </section>
      </AnimatedSection>
    </>
  )
}
