import { donateActionSchema } from '@/lib/seo/schema'
import WesprzyjHardcoded from './_hardcoded'

export const metadata = {
  title: 'Wesprzyj nas',
  description: 'Przekaż 1% PIT, dokonaj darowizny lub wesprzyj rzeczowo Stowarzyszenie Otwarte Kaszuby. KRS 0000718370. Status OPP.',
}

export default function WesprzyjPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(donateActionSchema()) }} />
      <WesprzyjHardcoded />
    </>
  )
}
