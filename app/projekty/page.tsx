import type { Metadata } from 'next'
import { AnimatedSection } from '@/components/sok/animated-section'
import Link from 'next/link'
import { PROJEKTY } from '@/lib/data/projekty'
import { ProjectCard } from '@/components/sok/project-card'

export const metadata: Metadata = {
  title: 'Projekty',
  description: 'Aktywne i zakończone projekty Stowarzyszenia Otwarte Kaszuby — Centrum Wsparcia Uchodźców, Sklep Społeczny, programy senioralne i kulturalne.',
}

export default function Projekty() {
  return (
    <article>
      <section className="relative bg-[var(--color-ok-bg-secondary)] py-16 lg:py-20 overflow-hidden">
        <span aria-hidden="true" className="blob-1 -top-20 -right-32 w-[500px] h-[500px] bg-[var(--color-ok-primary)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav aria-label="breadcrumb" className="text-sm text-[var(--color-ok-text-secondary)] mb-4 animate-fade-in-up">
            <Link href="/" className="link-underline hover:text-[var(--color-ok-primary)]">Strona główna</Link>
            <span aria-hidden="true" className="mx-2">›</span>
            <span aria-current="page">Projekty</span>
          </nav>
          <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>Nasze projekty</h1>
          <p className="text-lg text-[var(--color-ok-text-secondary)] max-w-3xl leading-relaxed animate-fade-in-up" style={{ animationDelay: '250ms' }}>
            Programy wspierające uchodźców, seniorów, młodzież oraz pielęgnujące kulturę kaszubską.
            Działamy lokalnie, myślimy globalnie.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {PROJEKTY.map((p, idx) => (
            <AnimatedSection key={p.slug} animation="fade-up" delay={idx * 80}>
              <ProjectCard project={p} />
            </AnimatedSection>
          ))}
        </div>
      </section>
    </article>
  )
}
