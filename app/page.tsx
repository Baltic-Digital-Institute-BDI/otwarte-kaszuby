import type { Metadata } from 'next'
import { getStory } from '@/lib/storyblok/client'
import type { StronaContent } from '@/lib/storyblok/types'
import { BlocksRenderer } from '@/components/storyblok/block-renderer'
import { Editable } from '@/components/storyblok/editable'
import HomePageHardcoded from './_hardcoded'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const story = await getStory<StronaContent>('home')
  if (!story) return { title: 'Stowarzyszenie Otwarte Kaszuby' }
  return { title: story.content.tytul_seo || 'Stowarzyszenie Otwarte Kaszuby', description: story.content.opis_seo }
}

export default async function HomePage() {
  const story = await getStory<StronaContent>('home').catch(() => null)
  if (!story || !story.content?.sekcje?.length) return <HomePageHardcoded />
  return (
    <Editable blok={story.content}>
      <BlocksRenderer blocks={story.content.sekcje} />
    </Editable>
  )
}
