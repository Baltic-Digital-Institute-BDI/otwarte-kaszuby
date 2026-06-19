import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Phone } from 'lucide-react'
import { getStory, getStories } from '@/lib/storyblok/client'
import type { ProjektContent } from '@/lib/storyblok/types'
import { BlocksRenderer, RichTextRenderer } from '@/components/storyblok/block-renderer'

export const revalidate = 60
export const dynamicParams = true

const STATUS_LABEL: Record<string, string> = {
  aktywny: 'AKTYWNY',
  zakonczony: 'ZAKOŃCZONY',
  archiwalny: 'ARCHIWALNY',
}

function assetUrl(asset?: { filename?: string }, w = 1800) {
  if (!asset?.filename) return ''
  return `${asset.filename}/m/${w}x0`
}

export async function generateStaticParams() {
  try {
    const { stories } = await getStories<ProjektContent>({ startsWith: 'projekty/', contentType: 'projekt', perPage: 100 })
    return stories.map((s) => ({ slug: s.slug }))
  } catch (e) {
    console.warn('generateStaticParams · network fail, deferring to runtime:', e)
    return []
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const story = await getStory<ProjektContent>(`projekty/${slug}`)
  if (!story) return {}
  return { title: story.content.tytul, description: story.content.krotki_opis }
}

export default async function ProjektDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const story = await getStory<ProjektContent>(`projekty/${slug}`)
  if (!story) notFound()
  const p = story.content
  const heroUrl = assetUrl(p.zdjecie_hero, 1800)

  return (
    <article>
      {heroUrl ? (
        <section className="relative h-[50vh] lg:h-[60vh] min-h-[400px] overflow-hidden">
          <Image src={heroUrl} alt={p.tytul} fill sizes="100vw" className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/30" />
          <div className="relative z-10 h-full mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12 lg:pb-16">
            <nav aria-label="breadcrumb" className="text-sm text-white/80 mb-4">
              <Link href="/" className="hover:text-white">Strona główna</Link>
              <span aria-hidden="true" className="mx-2">›</span>
              <Link href="/projekty" className="hover:text-white">Projekty</Link>
              <span aria-hidden="true" className="mx-2">›</span>
              <span aria-current="page">{p.tytul}</span>
            </nav>
            <span className="inline-block self-start bg-[var(--color-ok-gold)] text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">{STATUS_LABEL[p.status]}</span>
            <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight text-white">{p.tytul}</h1>
            <p className="text-lg text-white/90 max-w-3xl leading-relaxed">{p.krotki_opis}</p>
          </div>
        </section>
      ) : (
        <section className="bg-[var(--color-ok-bg-secondary)] py-16 lg:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <nav aria-label="breadcrumb" className="text-sm text-[var(--color-ok-text-secondary)] mb-4">
              <Link href="/" className="hover:text-[var(--color-ok-primary)]">Strona główna</Link>
              <span aria-hidden="true" className="mx-2">›</span>
              <Link href="/projekty" className="hover:text-[var(--color-ok-primary)]">Projekty</Link>
              <span aria-hidden="true" className="mx-2">›</span>
              <span aria-current="page">{p.tytul}</span>
            </nav>
            <span className="inline-block bg-[var(--color-ok-gold)] text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">{STATUS_LABEL[p.status]}</span>
            <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">{p.tytul}</h1>
            <p className="text-lg text-[var(--color-ok-text-secondary)] max-w-3xl leading-relaxed">{p.krotki_opis}</p>
          </div>
        </section>
      )}

      <BlocksRenderer blocks={p.sekcje} />

      {p.partnerzy_tekst && (
        <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="font-headline text-3xl font-bold mb-6">Partnerzy</h2>
          <RichTextRenderer doc={p.partnerzy_tekst} />
        </section>
      )}

      {p.finansowanie_tekst && (
        <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="font-headline text-3xl font-bold mb-6">Finansowanie</h2>
          <RichTextRenderer doc={p.finansowanie_tekst} />
        </section>
      )}

      {p.kontakt_tel && (
        <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-[var(--color-ok-bg-tertiary)] border-l-4 border-[var(--color-ok-primary)] rounded-r-xl p-8">
            <h2 className="font-headline text-2xl font-bold mb-4">Kontakt projektu</h2>
            <a href={`tel:${p.kontakt_tel.replace(/\s/g, '')}`} className="inline-flex items-center gap-2 px-5 py-3 bg-[var(--color-ok-primary)] text-white rounded-md font-medium hover:bg-[var(--color-ok-primary-hover)] transition-colors">
              <Phone className="size-4" /> {p.kontakt_tel}
            </a>
          </div>
        </section>
      )}
    </article>
  )
}
