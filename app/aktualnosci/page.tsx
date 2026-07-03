// /aktualnosci · client-side Storyblok live preview z Ola-edytowalną hero + lista aktualności
import type { Metadata } from 'next'
import { getStory } from '@/lib/storyblok/client'
import type { StronaContent } from '@/lib/storyblok/types'
import { prefetchDynamicStories } from '@/lib/storyblok/prefetch'
import { LivePreview } from '@/components/storyblok/live-preview'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const story = await getStory<StronaContent>('aktualnosci-listing')
  const c = story?.content
  return {
    title: c?.tytul_seo || 'Aktualności',
    description: c?.opis_seo || 'Aktualności Stowarzyszenia Otwarte Kaszuby.',
  }
}

export default async function Aktualnosci() {
  const [story, dynamicStories] = await Promise.all([
    getStory<StronaContent>('aktualnosci-listing'),
    prefetchDynamicStories({ aktualnosciLimit: 100 }),
  ])
  if (!story?.content?.sekcje?.length) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="font-headline text-4xl font-bold mb-4">Aktualności</h1>
        <p className="text-[var(--color-ok-text-secondary)]">Brak treści w Storyblok. Skontaktuj się z administratorem.</p>
      </section>
    )
  }
  return <LivePreview initialStory={story as any} dynamic={dynamicStories} />
}
