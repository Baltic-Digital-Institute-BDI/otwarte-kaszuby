import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { AnimatedSection } from '@/components/sok/animated-section'
import { getStories } from '@/lib/storyblok/client'
import type { AktualnoscContent } from '@/lib/storyblok/types'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Aktualności',
  description: 'Najnowsze informacje o działaniach Stowarzyszenia Otwarte Kaszuby — projekty, wydarzenia, programy społeczne na Pomorzu.',
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default async function AktualnosciPage() {
  const { stories } = await getStories<AktualnoscContent>({
    startsWith: 'aktualnosci/', contentType: 'aktualnosc',
    perPage: 50, sortBy: 'content.data_publikacji:desc',
  })

  return (
    <article>
      <section className="bg-[var(--color-ok-bg-secondary)] py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav aria-label="breadcrumb" className="text-sm text-[var(--color-ok-text-secondary)] mb-4 animate-fade-in-up">
            <Link href="/" className="link-underline hover:text-[var(--color-ok-primary)]">Strona główna</Link>
            <span aria-hidden="true" className="mx-2">›</span>
            <span aria-current="page">Aktualności</span>
          </nav>
          <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>Aktualności</h1>
          <p className="text-lg text-[var(--color-ok-text-secondary)] max-w-3xl animate-fade-in-up" style={{ animationDelay: '250ms' }}>
            Bądź na bieżąco z naszymi projektami i wydarzeniami.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-8">
          {stories.map((s, i) => (
            <AnimatedSection key={s.id} animation="fade-up" delay={i * 80}>
              <Link
                href={`/${s.full_slug}`}
                className="group block bg-white rounded-xl p-6 lg:p-8 border border-[var(--color-ok-border-default)] hover:border-[var(--color-ok-primary)] hover:shadow-md-warm transition-all"
              >
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <time className="text-xs font-mono text-[var(--color-ok-text-tertiary)] uppercase">{fmtDate(s.content.data_publikacji)}</time>
                  <span className="text-xs font-semibold text-[var(--color-ok-primary)] uppercase">{s.content.kategoria}</span>
                </div>
                <h2 className="font-headline text-2xl lg:text-3xl font-bold mb-3 group-hover:text-[var(--color-ok-primary)] transition-colors">{s.content.tytul}</h2>
                <p className="text-[var(--color-ok-text-secondary)] leading-relaxed mb-4">{s.content.excerpt}</p>
                <span className="inline-flex items-center gap-2 text-[var(--color-ok-primary)] text-sm font-medium">
                  Czytaj więcej <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </section>
    </article>
  )
}
