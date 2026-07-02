// Strona główna · full render z Storyblok (edytowalna w Visual Editor przez Aleksandrę)
// Fallback do hardcoded jeśli story nie istnieje lub brak sekcji (bezpiecznik)
import { getStory } from '@/lib/storyblok/client'
import type { StronaContent } from '@/lib/storyblok/types'
import { BlocksRenderer } from '@/components/storyblok/block-renderer'
import HomePageHardcoded from './_hardcoded'

export const metadata = {
  title: 'Stowarzyszenie Otwarte Kaszuby',
  description: 'Łączymy ludzi, kultury i społeczności na Kaszubach. Stowarzyszenie OPP działa od 2018 roku.',
}

export default async function HomePage() {
  const story = await getStory<StronaContent>('home')
  const sekcje = story?.content?.sekcje
  if (!sekcje?.length) return <HomePageHardcoded />
  return <BlocksRenderer blocks={sekcje} />
}
