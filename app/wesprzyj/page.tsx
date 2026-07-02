import { getStory } from '@/lib/storyblok/client'
import type { StronaContent } from '@/lib/storyblok/types'
import { prefetchDynamicStories } from '@/lib/storyblok/prefetch'
import { LivePreview } from '@/components/storyblok/live-preview'
import { donateActionSchema } from '@/lib/seo/schema'
import WesprzyjHardcoded from './_hardcoded'

export const metadata = {
  title: 'Wesprzyj nas',
  description: 'Przekaż 1% PIT, dokonaj darowizny lub wesprzyj rzeczowo Stowarzyszenie Otwarte Kaszuby. KRS 0000718370. Status OPP.',
}

export default async function WesprzyjPage() {
  const [story, dynamic] = await Promise.all([
    getStory<StronaContent>('wesprzyj'),
    prefetchDynamicStories(),
  ])
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(donateActionSchema()) }} />
      {story?.content?.sekcje?.length
        ? <LivePreview initialStory={story as any} dynamic={dynamic} />
        : <WesprzyjHardcoded />}
    </>
  )
}
