import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getStory } from '@/lib/storyblok/client'
import type { StronaContent } from '@/lib/storyblok/types'
import { BlocksRenderer } from '@/components/storyblok/block-renderer'
import { donateActionSchema } from '@/lib/seo/schema'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const story = await getStory<StronaContent>('wesprzyj')
  if (!story) return {}
  return { title: story.content.tytul_seo, description: story.content.opis_seo }
}

export default async function WesprzyjPage() {
  const story = await getStory<StronaContent>('wesprzyj')
  if (!story) notFound()
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(donateActionSchema()) }} />
      <BlocksRenderer blocks={story.content.sekcje} />
    </>
  )
}
