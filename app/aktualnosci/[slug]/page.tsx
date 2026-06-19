import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getStory, getStories } from '@/lib/storyblok/client'
import type { AktualnoscContent } from '@/lib/storyblok/types'
import { RichTextRenderer } from '@/components/storyblok/block-renderer'
import { articleSchema } from '@/lib/seo/schema'
import { SITE } from '@/lib/constants'

export const revalidate = 60
export const dynamicParams = true

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' })
}

function assetUrl(asset?: { filename?: string }, w = 1600) {
  if (!asset?.filename) return ''
  return `${asset.filename}/m/${w}x0`
}

export async function generateStaticParams() {
  try {
    const { stories } = await getStories<AktualnoscContent>({ startsWith: 'aktualnosci/', contentType: 'aktualnosc', perPage: 100 })
    return stories.map((s) => ({ slug: s.slug }))
  } catch (e) {
    console.warn('generateStaticParams · network fail, deferring to runtime:', e)
    return []
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const story = await getStory<AktualnoscContent>(`aktualnosci/${slug}`)
  if (!story) return {}
  return { title: story.content.tytul, description: story.content.excerpt }
}

export default async function AktualnoscDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const story = await getStory<AktualnoscContent>(`aktualnosci/${slug}`)
  if (!story) notFound()
  const n = story.content
  const heroUrl = assetUrl(n.zdjecie, 1800)
  const tags = n.tagi?.split(',').map(t => t.trim()).filter(Boolean) || []

  const { stories: rel } = await getStories<AktualnoscContent>({
    startsWith: 'aktualnosci/', contentType: 'aktualnosc',
    perPage: 4, sortBy: 'content.data_publikacji:desc',
  })
  const related = rel.filter(r => r.slug !== story.slug).slice(0, 3)

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify(articleSchema({ title: n.tytul, date: n.data_publikacji, description: n.excerpt, url: `${SITE.url}/${story.full_slug}` }))
      }} />
      {heroUrl && (
        <div className="relative h-[40vh] lg:h-[50vh] min-h-[300px] overflow-hidden">
          <Image src={heroUrl} alt={n.tytul} fill sizes="100vw" className="object-cover" priority />
        </div>
      )}
      <section className="bg-[var(--color-ok-bg-secondary)] py-12 lg:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <nav aria-label="breadcrumb" className="text-sm text-[var(--color-ok-text-secondary)] mb-4">
            <Link href="/" className="hover:text-[var(--color-ok-primary)]">Strona główna</Link>
            <span aria-hidden="true" className="mx-2">›</span>
            <Link href="/aktualnosci" className="hover:text-[var(--color-ok-primary)]">Aktualności</Link>
          </nav>
          <div className="flex flex-wrap items-center gap-3 mb-4 text-xs">
            <time className="font-mono text-[var(--color-ok-text-tertiary)] uppercase">{fmtDate(n.data_publikacji)}</time>
            <span className="font-semibold text-[var(--color-ok-primary)] uppercase">{n.kategoria}</span>
          </div>
          <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">{n.tytul}</h1>
          <p className="text-lg text-[var(--color-ok-text-secondary)] leading-relaxed">{n.excerpt}</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="text-base lg:text-lg text-[var(--color-ok-text-primary)]">
          <RichTextRenderer doc={n.tresc} />
        </div>
        {tags.length > 0 && (
          <div className="mt-10 pt-8 border-t border-[var(--color-ok-border-default)]">
            <p className="text-xs uppercase font-semibold text-[var(--color-ok-text-tertiary)] mb-3">Tagi</p>
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => <span key={t} className="inline-block px-3 py-1 bg-[var(--color-ok-bg-tertiary)] text-[var(--color-ok-text-secondary)] rounded-full text-xs">#{t}</span>)}
            </div>
          </div>
        )}
      </section>

      {related.length > 0 && (
        <section className="bg-[var(--color-ok-bg-secondary)] py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-headline text-3xl font-bold mb-8">Zobacz również</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link key={r.id} href={`/${r.full_slug}`} className="group block bg-white rounded-xl p-6 border border-[var(--color-ok-border-default)] hover:border-[var(--color-ok-primary)] transition-colors">
                  <time className="text-xs font-mono text-[var(--color-ok-text-tertiary)] uppercase mb-2 block">{fmtDate(r.content.data_publikacji)}</time>
                  <h3 className="font-headline text-lg font-semibold leading-tight group-hover:text-[var(--color-ok-primary)] transition-colors">{r.content.tytul}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  )
}
