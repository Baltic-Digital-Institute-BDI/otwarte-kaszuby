import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Phone, Mail, ExternalLink } from 'lucide-react'
import { getStory, getStories } from '@/lib/storyblok/client'
import type { ProjektContent } from '@/lib/storyblok/types'
import { storyToProject } from '@/lib/storyblok/adapters'
import { StatsCounter } from '@/components/sok/stats-counter'
import { ProjectTimeline } from '@/components/sok/timeline-event'
import { KaszubskiDivider } from '@/components/sok/kaszubski-divider'
import { ProjectCard } from '@/components/sok/project-card'
import { DofinansowanieUe } from '@/components/sok/dofinansowanie-ue'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const story = await getStory<ProjektContent>(`projekty/${slug}`)
  if (!story) return {}
  const p = storyToProject(story)
  return { title: p.title, description: p.shortDescription }
}

const STATUS_LABEL: Record<string, string> = {
  aktywny: 'AKTYWNY',
  zakonczony: 'ZAKOŃCZONY',
  archiwalny: 'ARCHIWALNY',
}

export default async function ProjektDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const story = await getStory<ProjektContent>(`projekty/${slug}`)
  if (!story) notFound()
  const project = storyToProject(story)

  const { stories: allStories } = await getStories<ProjektContent>({
    startsWith: 'projekty/', contentType: 'projekt', perPage: 100,
    sortBy: 'content.data_startu:desc',
  })
  const related = allStories
    .map(storyToProject)
    .filter((p) => p.slug !== project.slug && p.status === 'aktywny')
    .slice(0, 3)

  return (
    <article>
      {project.heroImage ? (
        <section className="relative h-[50vh] lg:h-[60vh] min-h-[400px] overflow-hidden">
          <Image
            src={project.heroImage}
            alt={project.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/30" />
          <div className="relative z-10 h-full mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12 lg:pb-16">
            <nav aria-label="breadcrumb" className="text-sm text-white/80 mb-4">
              <Link href="/" className="hover:text-white">Strona główna</Link>
              <span aria-hidden="true" className="mx-2">›</span>
              <Link href="/projekty" className="hover:text-white">Projekty</Link>
              <span aria-hidden="true" className="mx-2">›</span>
              <span aria-current="page">{project.title}</span>
            </nav>
            <span className="inline-block self-start bg-[var(--color-ok-gold)] text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
              {STATUS_LABEL[project.status]}
            </span>
            <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight text-white">
              {project.title}
            </h1>
            <p className="text-lg text-white/90 max-w-3xl leading-relaxed">
              {project.shortDescription}
            </p>
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
              <span aria-current="page">{project.title}</span>
            </nav>
            <span className="inline-block bg-[var(--color-ok-gold)] text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
              {STATUS_LABEL[project.status]}
            </span>
            <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              {project.title}
            </h1>
            <p className="text-lg text-[var(--color-ok-text-secondary)] max-w-3xl leading-relaxed">
              {project.shortDescription}
            </p>
          </div>
        </section>
      )}

      {project.dofinansowanieUe && (
        <DofinansowanieUe {...project.dofinansowanieUe} />
      )}

      {project.stats && project.stats.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <StatsCounter stats={project.stats} />
        </section>
      )}

      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="font-headline text-3xl font-bold mb-6">Co robimy?</h2>
        <div className="space-y-5 text-base lg:text-lg leading-relaxed text-[var(--color-ok-text-primary)]">
          {project.description.map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>
      </section>

      {project.timeline && project.timeline.length > 0 && (
        <>
          <KaszubskiDivider variant="kalina" />
          <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="font-headline text-3xl font-bold mb-10">Nasza droga</h2>
            <ProjectTimeline events={project.timeline} />
          </section>
        </>
      )}

      {project.partners && project.partners.length > 0 && (
        <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="font-headline text-3xl font-bold mb-6">Partnerzy</h2>
          <ul className="space-y-2">
            {project.partners.map((p) => (
              <li key={p} className="text-[var(--color-ok-text-secondary)]">{p}</li>
            ))}
          </ul>
        </section>
      )}

      {project.funding && project.funding.length > 0 && (
        <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="font-headline text-3xl font-bold mb-6">Finansowanie</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-ok-border-default)]">
                <th className="text-left py-3 px-2 font-semibold">Źródło</th>
                <th className="text-right py-3 px-2 font-semibold">Kwota</th>
                <th className="text-right py-3 px-2 font-semibold w-20">Rok</th>
              </tr>
            </thead>
            <tbody>
              {project.funding.map((f, i) => (
                <tr key={i} className="border-b border-[var(--color-ok-border-default)]">
                  <td className="py-3 px-2">{f.source}</td>
                  <td className="py-3 px-2 text-right font-mono">
                    {f.amount.toLocaleString('pl-PL', { style: 'currency', currency: f.currency || 'PLN' })}
                  </td>
                  <td className="py-3 px-2 text-right font-mono">{f.year}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {project.contact && (
        <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-[var(--color-ok-bg-tertiary)] border-l-4 border-[var(--color-ok-primary)] rounded-r-xl p-8">
            <h2 className="font-headline text-2xl font-bold mb-4">Kontakt projektu</h2>
            {project.contact.name && <p className="font-semibold mb-3">{project.contact.name}</p>}
            <div className="flex flex-col sm:flex-row gap-3">
              {project.contact.phone && (
                <a href={`tel:${project.contact.phone.replace(/\s/g, '')}`} className="inline-flex items-center gap-2 px-5 py-3 bg-[var(--color-ok-primary)] text-white rounded-md font-medium hover:bg-[var(--color-ok-primary-hover)] transition-colors">
                  <Phone className="size-4" /> {project.contact.phone}
                </a>
              )}
              {project.contact.email && (
                <a href={`mailto:${project.contact.email}`} className="inline-flex items-center gap-2 px-5 py-3 border-2 border-[var(--color-ok-primary)] text-[var(--color-ok-primary)] rounded-md font-medium hover:bg-[var(--color-ok-primary-50)] transition-colors">
                  <Mail className="size-4" /> {project.contact.email}
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {project.externalLinks && project.externalLinks.length > 0 && (
        <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="font-headline text-2xl font-bold mb-4">Powiązane materiały</h2>
          <ul className="space-y-2">
            {project.externalLinks.map((link, i) => (
              <li key={i}>
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[var(--color-ok-primary)] hover:underline">
                  {link.label} <ExternalLink className="size-3.5" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="font-headline text-3xl font-bold mb-10">Inne nasze projekty</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {related.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
