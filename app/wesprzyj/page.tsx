import type { Metadata } from 'next'
import { getStory } from '@/lib/storyblok/client'
import type { StronaContent } from '@/lib/storyblok/types'
import { BlocksRenderer } from '@/components/storyblok/block-renderer'
import { Editable } from '@/components/storyblok/editable'
import { donateActionSchema } from '@/lib/seo/schema'
import WesprzyjHardcoded from './_hardcoded'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const story = await getStory<StronaContent>('wesprzyj').catch(() => null)
  return {
    title: story?.content?.tytul_seo || 'Wesprzyj nas',
    description: story?.content?.opis_seo,
  }
}

export default async function WesprzyjPage() {
  const story = await getStory<StronaContent>('wesprzyj').catch(() => null)
  if (!story || !story.content?.sekcje?.length) return <WesprzyjHardcoded />
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(donateActionSchema()) }} />
      <Editable blok={story.content}>
        <BlocksRenderer blocks={story.content.sekcje} />
      </Editable>
    </>
  )
}
