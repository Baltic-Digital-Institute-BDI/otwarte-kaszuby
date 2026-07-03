'use client'

// 500 error · client component. Fetch utility-500 story z Storyblok CDN client-side.
// Jeśli fetch failed (bo Storyblok API padło) → fallback hardcoded.

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { RefreshCw, Home } from 'lucide-react'

interface UtilityContent {
  sekcje?: Array<{
    _uid: string
    component: string
    naglowek?: string
    podtytul?: string
    cta_primary_label?: string
    cta_primary_link?: { url?: string; cached_url?: string }
    cta_secondary_label?: string
    cta_secondary_link?: { url?: string; cached_url?: string }
  }>
}

const STORYBLOK_CDN = 'https://api.storyblok.com/v2/cdn/stories'
const PREVIEW_TOKEN = 'Qzzxcq9oXwCmyGLwtPjHdwtt'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const [content, setContent] = useState<UtilityContent | null>(null)

  useEffect(() => {
    console.error(error)
    // Try to load editable content from Storyblok
    fetch(`${STORYBLOK_CDN}/utility-500?token=${PREVIEW_TOKEN}&version=published&cv=${Date.now()}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.story?.content) setContent(data.story.content)
      })
      .catch(() => {}) // silent fail → fallback rendering
  }, [error])

  // Wyciągnij pierwszy hero_section blok
  const hero = content?.sekcje?.find((s) => s.component === 'hero_section')
  const headline = hero?.naglowek || 'Coś poszło nie tak'
  const subline = hero?.podtytul || 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie lub wróć na stronę główną. Jeśli problem powtarza się, skontaktuj się z nami.'
  const ctaPrimaryLabel = hero?.cta_primary_label || 'Strona główna'
  const ctaPrimaryUrl = hero?.cta_primary_link?.url || hero?.cta_primary_link?.cached_url || '/'

  return (
    <section className="min-h-[60vh] flex items-center justify-center py-16">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
        <p className="font-mono text-sm text-[var(--color-ok-error)] uppercase tracking-widest mb-4">Błąd 500</p>
        <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          {headline}
        </h1>
        <p className="text-lg text-[var(--color-ok-text-secondary)] mb-8 leading-relaxed">
          {subline}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-ok-primary)] text-white font-medium rounded-md hover:bg-[var(--color-ok-primary-hover)] transition-colors"
          >
            <RefreshCw className="size-4" /> Spróbuj ponownie
          </button>
          <Link
            href={ctaPrimaryUrl}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-[var(--color-ok-primary)] text-[var(--color-ok-primary)] font-medium rounded-md hover:bg-[var(--color-ok-primary-50)] transition-colors"
          >
            <Home className="size-4" /> {ctaPrimaryLabel}
          </Link>
        </div>
      </div>
    </section>
  )
}
