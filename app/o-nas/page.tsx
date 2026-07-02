import { getStory } from '@/lib/storyblok/client'
import type { StronaContent } from '@/lib/storyblok/types'
import { prefetchDynamicStories } from '@/lib/storyblok/prefetch'
import { LivePreview } from '@/components/storyblok/live-preview'
import ONasHardcoded from './_hardcoded'

export const metadata = {
  title: 'O nas',
  description: 'Stowarzyszenie Otwarte Kaszuby od 2018 roku łączy ludzi, kultury i społeczności na Kaszubach. Status OPP. Misja, wartości, zarząd, historia.',
}

export default async function ONasPage() {
  const [story, dynamic] = await Promise.all([
    getStory<StronaContent>('o-nas'),
    prefetchDynamicStories(),
  ])
  if (!story?.content?.sekcje?.length) return <ONasHardcoded />
  return <LivePreview initialStory={story as any} dynamic={dynamic} />
}
