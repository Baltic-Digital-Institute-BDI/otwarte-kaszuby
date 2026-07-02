// /wesprzyj · full render z Storyblok (edytowalna przez Aleksandrę w Visual Editor)
import { getStory } from '@/lib/storyblok/client'
import type { StronaContent } from '@/lib/storyblok/types'
import { BlocksRenderer } from '@/components/storyblok/block-renderer'
import { donateActionSchema } from '@/lib/seo/schema'
import WesprzyjHardcoded from './_hardcoded'

export const metadata = {
  title: 'Wesprzyj nas',
  description: 'Przekaż 1% PIT, dokonaj darowizny lub wesprzyj rzeczowo Stowarzyszenie Otwarte Kaszuby. KRS 0000718370. Status OPP.',
}

export default async function WesprzyjPage() {
  const story = await getStory<StronaContent>('wesprzyj')
  const sekcje = story?.content?.sekcje
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(donateActionSchema()) }} />
      {sekcje?.length ? <BlocksRenderer blocks={sekcje} /> : <WesprzyjHardcoded />}
    </>
  )
}
