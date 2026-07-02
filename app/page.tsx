// Strona główna · client-side rendering z Storyblok Bridge live preview
// Server: prefetches story + dynamic content · passes to LivePreview client wrapper
import { getStory } from '@/lib/storyblok/client'
import type { StronaContent } from '@/lib/storyblok/types'
import { prefetchDynamicStories } from '@/lib/storyblok/prefetch'
import { LivePreview } from '@/components/storyblok/live-preview'
import HomePageHardcoded from './_hardcoded'

export const metadata = {
  title: 'Stowarzyszenie Otwarte Kaszuby',
  description: 'Łączymy ludzi, kultury i społeczności na Kaszubach. Stowarzyszenie OPP działa od 2018 roku.',
}

// Force dynamic rendering · draft mode cookie needs runtime check
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [story, dynamic] = await Promise.all([
    getStory<StronaContent>('home'),
    prefetchDynamicStories(),
  ])
  if (!story?.content?.sekcje?.length) return <HomePageHardcoded />
  return <LivePreview initialStory={story as any} dynamic={dynamic} />
}
