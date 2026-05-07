import type { HistoryEvent, TimelineEvent } from '@/lib/data/types'
import { formatDate } from '@/lib/utils'

export function HistoryTimeline({ events }: { events: HistoryEvent[] }) {
  return (
    <ol className="relative space-y-10">
      <span aria-hidden="true" className="absolute left-4 top-2 bottom-2 w-px bg-[var(--color-ok-border-default)]" />
      {events.map((event) => (
        <li key={event.year} className="relative pl-14">
          <span aria-hidden="true" className="absolute left-0 top-1 flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-ok-primary)] text-white font-mono text-xs font-bold">
            {event.year.toString().slice(-2)}
          </span>
          <h3 className="font-headline text-xl font-semibold mb-2">
            <span className="font-mono text-[var(--color-ok-primary)] mr-2">{event.year}</span>
            {event.title}
          </h3>
          <p className="text-[var(--color-ok-text-secondary)] leading-relaxed">{event.description}</p>
        </li>
      ))}
    </ol>
  )
}

export function ProjectTimeline({ events }: { events: TimelineEvent[] }) {
  return (
    <ol className="relative space-y-6">
      <span aria-hidden="true" className="absolute left-3 top-2 bottom-2 w-px bg-[var(--color-ok-border-default)]" />
      {events.map((event) => (
        <li key={event.date + event.title} className="relative pl-10">
          <span aria-hidden="true" className="absolute left-0 top-2 size-6 rounded-full border-2 border-[var(--color-ok-primary)] bg-white" />
          <time className="block text-xs font-mono text-[var(--color-ok-text-secondary)] uppercase mb-1">
            {formatDate(event.date)}
          </time>
          <h4 className="font-semibold text-base mb-1">{event.title}</h4>
          {event.description && (
            <p className="text-sm text-[var(--color-ok-text-secondary)] leading-relaxed">{event.description}</p>
          )}
        </li>
      ))}
    </ol>
  )
}
