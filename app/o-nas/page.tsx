// /o-nas · full render z Storyblok (edytowalna przez Aleksandrę w Visual Editor)
import { getStory } from '@/lib/storyblok/client'
import type { StronaContent } from '@/lib/storyblok/types'
import { BlocksRenderer } from '@/components/storyblok/block-renderer'
import ONasHardcoded from './_hardcoded'

export const metadata = {
  title: 'O nas',
  description: 'Stowarzyszenie Otwarte Kaszuby od 2018 roku łączy ludzi, kultury i społeczności na Kaszubach. Status OPP. Misja, wartości, zarząd, historia.',
}

export default async function ONasPage() {
  const story = await getStory<StronaContent>('o-nas')
  const sekcje = story?.content?.sekcje
  if (!sekcje?.length) return <ONasHardcoded />
  return <BlocksRenderer blocks={sekcje} />
}
