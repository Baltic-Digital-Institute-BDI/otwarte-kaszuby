import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getStory } from '@/lib/storyblok/client'
import type { StronaContent } from '@/lib/storyblok/types'
import { BlocksRenderer } from '@/components/storyblok/block-renderer'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const story = await getStory<StronaContent>('home')
  if (!story) return {}
  return {
    title: story.content.tytul_seo,
    description: story.content.opis_seo,
  }
}

export default async function HomePage() {
  const story = await getStory<StronaContent>('home')
  if (!story) notFound()
  return <BlocksRenderer blocks={story.content.sekcje} />
}
