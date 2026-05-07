import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import type { Project } from '@/lib/data/types'

const STATUS_LABELS: Record<Project['status'], string> = {
  aktywny: 'AKTYWNY',
  zakonczony: 'ZAKOŃCZONY',
  archiwalny: 'ARCHIWALNY',
}

const STATUS_STYLES: Record<Project['status'], string> = {
  aktywny: 'bg-[var(--color-ok-gold)] text-white',
  zakonczony: 'bg-[var(--color-ok-text-secondary)] text-white',
  archiwalny: 'bg-[var(--color-ok-text-tertiary)] text-white',
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projekty/${project.slug}`}
      className="group flex flex-col bg-white rounded-xl overflow-hidden hover:shadow-lg-warm transition-all border border-[var(--color-ok-border-default)] hover:border-[var(--color-ok-primary)]"
    >
      {project.heroImage && (
        <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-ok-bg-tertiary)]">
          <Image
            src={project.heroImage}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <span className={`absolute top-3 left-3 inline-flex text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[project.status]}`}>
            {STATUS_LABELS[project.status]}
          </span>
        </div>
      )}
      <div className="flex flex-col flex-1 p-6">
        {!project.heroImage && (
          <div className="flex items-start justify-between gap-3 mb-4">
            <span className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[project.status]}`}>
              {STATUS_LABELS[project.status]}
            </span>
          </div>
        )}
        <h3 className="font-headline text-xl lg:text-2xl font-bold leading-tight mb-3 group-hover:text-[var(--color-ok-primary)] transition-colors">
          {project.title}
        </h3>
        <p className="text-[var(--color-ok-text-secondary)] text-sm leading-relaxed flex-1">
          {project.shortDescription}
        </p>
        <div className="mt-4 inline-flex items-center gap-2 text-[var(--color-ok-primary)] font-medium text-sm">
          Zobacz więcej
          <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  )
}
