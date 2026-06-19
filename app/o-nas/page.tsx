import type { Metadata } from 'next'
import { getStory } from '@/lib/storyblok/client'
import type { StronaContent } from '@/lib/storyblok/types'
import { BlocksRenderer } from '@/components/storyblok/block-renderer'
import { Editable } from '@/components/storyblok/editable'
import ONasHardcoded from './_hardcoded'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const story = await getStory<StronaContent>('o-nas').catch(() => null)
  return {
    title: story?.content?.tytul_seo || 'O nas',
    description: story?.content?.opis_seo,
  }
}

export default async function ONasPage() {
  const story = await getStory<StronaContent>('o-nas').catch(() => null)
  if (!story || !story.content?.sekcje?.length) return <ONasHardcoded />
  return (
    <Editable blok={story.content}>
      <BlocksRenderer blocks={story.content.sekcje} />
    </Editable>
  )
}
