// /kontakt · full render z Storyblok (edytowalna przez Aleksandrę w Visual Editor)
import { getStory } from '@/lib/storyblok/client'
import type { StronaContent } from '@/lib/storyblok/types'
import { BlocksRenderer } from '@/components/storyblok/block-renderer'
import KontaktHardcoded from './_hardcoded'

export const metadata = {
  title: 'Kontakt',
  description: 'Skontaktuj się ze Stowarzyszeniem Otwarte Kaszuby. Adres siedziby w Kartuzach, telefony do biura i CWU, adres email.',
}

export default async function KontaktPage() {
  const story = await getStory<StronaContent>('kontakt')
  const sekcje = story?.content?.sekcje
  if (!sekcje?.length) return <KontaktHardcoded />
  return <BlocksRenderer blocks={sekcje} />
}
