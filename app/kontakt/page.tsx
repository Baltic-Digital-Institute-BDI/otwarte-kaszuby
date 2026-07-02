import { getStory } from '@/lib/storyblok/client'
import type { StronaContent } from '@/lib/storyblok/types'
import { prefetchDynamicStories } from '@/lib/storyblok/prefetch'
import { LivePreview } from '@/components/storyblok/live-preview'
import KontaktHardcoded from './_hardcoded'

export const metadata = {
  title: 'Kontakt',
  description: 'Skontaktuj się ze Stowarzyszeniem Otwarte Kaszuby. Adres siedziby w Kartuzach, telefony do biura i CWU, adres email.',
}

export default async function KontaktPage() {
  const [story, dynamic] = await Promise.all([
    getStory<StronaContent>('kontakt'),
    prefetchDynamicStories(),
  ])
  if (!story?.content?.sekcje?.length) return <KontaktHardcoded />
  return <LivePreview initialStory={story as any} dynamic={dynamic} />
}
