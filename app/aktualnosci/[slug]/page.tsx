import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getStory, getStories } from '@/lib/storyblok/client'
import type { AktualnoscContent } from '@/lib/storyblok/types'
import { storyToNews } from '@/lib/storyblok/adapters'
import { articleSchema } from '@/lib/seo/schema'
import { SITE } from '@/lib/constants'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const story = await getStory<AktualnoscContent>(`aktualnosci/${slug}`)
  if (!story) return {}
  const n = storyToNews(story)
  return { title: n.title, description: n.excerpt }
}

export default async function AktualnoscDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const story = await getStory<AktualnoscContent>(`aktualnosci/${slug}`)
  if (!story) notFound()
  const news = storyToNews(story)

  const { stories: allStories } = await getStories<AktualnoscContent>({
    startsWith: 'aktualnosci/', contentType: 'aktualnosc',
    perPage: 4, sortBy: 'content.data_publikacji:desc',
  })
  const related = allStories.map(storyToNews).filter((n) => n.slug !== news.slug).slice(0, 3)

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            articleSchema({
              title: news.title,
              date: news.date,
              description: news.excerpt,
              url: `${SITE.url}/aktualnosci/${news.slug}`,
            })
          ),
        }}
      />
      <section className="bg-[var(--color-ok-bg-secondary)] py-12 lg:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <nav aria-label="breadcrumb" className="text-sm text-[var(--color-ok-text-secondary)] mb-4">
            <Link href="/" className="hover:text-[var(--color-ok-primary)]">Strona główna</Link>
            <span aria-hidden="true" className="mx-2">›</span>
            <Link href="/aktualnosci" className="hover:text-[var(--color-ok-primary)]">Aktualności</Link>
          </nav>
          <div className="flex flex-wrap items-center gap-3 mb-4 text-xs">
            <time className="font-mono text-[var(--color-ok-text-tertiary)] uppercase">{formatDate(news.date)}</time>
            <span className="font-semibold text-[var(--color-ok-primary)] uppercase">{news.category}</span>
          </div>
          <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
            {news.title}
          </h1>
          <p className="text-lg text-[var(--color-ok-text-secondary)] leading-relaxed">{news.excerpt}</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="space-y-5 text-base lg:text-lg leading-relaxed text-[var(--color-ok-text-primary)]">
          {news.body.map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>
        {news.tags && news.tags.length > 0 && (
          <div className="mt-10 pt-8 border-t border-[var(--color-ok-border-default)]">
            <p className="text-xs uppercase font-semibold text-[var(--color-ok-text-tertiary)] mb-3">Tagi</p>
            <div className="flex flex-wrap gap-2">
              {news.tags.map((t) => (
                <span key={t} className="inline-block px-3 py-1 bg-[var(--color-ok-bg-tertiary)] text-[var(--color-ok-text-secondary)] rounded-full text-xs">
                  #{t}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      {related.length > 0 && (
        <section className="bg-[var(--color-ok-bg-secondary)] py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-headline text-3xl font-bold mb-8">Zobacz również</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((n) => (
                <Link
                  key={n.slug}
                  href={`/aktualnosci/${n.slug}`}
                  className="group block bg-white rounded-xl p-6 border border-[var(--color-ok-border-default)] hover:border-[var(--color-ok-primary)] transition-colors"
                >
                  <time className="text-xs font-mono text-[var(--color-ok-text-tertiary)] uppercase mb-2 block">
                    {formatDate(n.date)}
                  </time>
                  <h3 className="font-headline text-lg font-semibold leading-tight group-hover:text-[var(--color-ok-primary)] transition-colors">
                    {n.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  )
}
