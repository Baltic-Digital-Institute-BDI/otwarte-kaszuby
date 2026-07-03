// /projekty · client-side Storyblok live preview z Ola-edytowalną hero + lista projektów
import type { Metadata } from 'next'
import { getStory } from '@/lib/storyblok/client'
import type { StronaContent } from '@/lib/storyblok/types'
import { prefetchDynamicStories } from '@/lib/storyblok/prefetch'
import { LivePreview } from '@/components/storyblok/live-preview'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const story = await getStory<StronaContent>('projekty-listing')
  const c = story?.content
  return {
    title: c?.tytul_seo || 'Projekty',
    description: c?.opis_seo || 'Projekty Stowarzyszenia Otwarte Kaszuby.',
  }
}

export default async function Projekty() {
  const [story, dynamicStories] = await Promise.all([
    getStory<StronaContent>('projekty-listing'),
    prefetchDynamicStories({ projektyLimit: 100 }),
  ])
  if (!story?.content?.sekcje?.length) {
    // Fallback: gdy Ola przypadkiem usunie storię — pokaż minimalny placeholder
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="font-headline text-4xl font-bold mb-4">Projekty</h1>
        <p className="text-[var(--color-ok-text-secondary)]">Brak treści w Storyblok. Skontaktuj się z administratorem.</p>
      </section>
    )
  }
  return <LivePreview initialStory={story as any} dynamic={dynamicStories} />
}
