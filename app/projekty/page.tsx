import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { AnimatedSection } from '@/components/sok/animated-section'
import { getStories } from '@/lib/storyblok/client'
import type { ProjektContent } from '@/lib/storyblok/types'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Projekty',
  description: 'Aktywne i zakończone projekty Stowarzyszenia Otwarte Kaszuby — Centrum Wsparcia Uchodźców, Sklep Społeczny, programy senioralne i kulturalne.',
}

const STATUS_LABELS: Record<string, string> = {
  aktywny: 'AKTYWNY',
  zakonczony: 'ZAKOŃCZONY',
  archiwalny: 'ARCHIWALNY',
}

function assetUrl(asset?: { filename?: string }, w = 800) {
  if (!asset?.filename) return ''
  return `${asset.filename}/m/${w}x0`
}

export default async function ProjektyPage() {
  const { stories } = await getStories<ProjektContent>({
    startsWith: 'projekty/', contentType: 'projekt',
    perPage: 50, sortBy: 'content.data_startu:desc',
  })

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
          {stories.map((s, i) => (
            <AnimatedSection key={s.id} animation="fade-up" delay={i * 80}>
              <Link
                href={`/${s.full_slug}`}
                className="card-hover group flex flex-col h-full bg-white rounded-xl overflow-hidden border border-[var(--color-ok-border-default)] hover:border-[var(--color-ok-primary)]"
              >
                {s.content.zdjecie_hero?.filename && (
                  <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-ok-bg-tertiary)]">
                    <Image src={assetUrl(s.content.zdjecie_hero)} alt={s.content.tytul} fill sizes="33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-3 left-3 inline-flex text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--color-ok-gold)] text-white">{STATUS_LABELS[s.content.status]}</span>
                  </div>
                )}
                <div className="flex flex-col flex-1 p-6">
                  {!s.content.zdjecie_hero?.filename && (
                    <span className="inline-flex self-start text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--color-ok-gold)] text-white mb-4">{STATUS_LABELS[s.content.status]}</span>
                  )}
                  <h3 className="font-headline text-xl lg:text-2xl font-bold leading-tight mb-3 group-hover:text-[var(--color-ok-primary)] transition-colors">{s.content.tytul}</h3>
                  <p className="text-[var(--color-ok-text-secondary)] text-sm leading-relaxed flex-1">{s.content.krotki_opis}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-[var(--color-ok-primary)] font-medium text-sm">
                    Zobacz więcej <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </section>
    </article>
  )
}
