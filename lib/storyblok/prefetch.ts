import 'server-only'
import { getStories } from './client'
import type { ProjektContent, AktualnoscContent, CzlonekZarzaduContent } from './types'
import type { DynamicStories } from '@/components/storyblok/blocks-client'

/**
 * Prefetch all dynamic story lists needed by BlocksClientRenderer on server side.
 * Called from server pages · pass result as prop to LivePreview client wrapper.
 */
export async function prefetchDynamicStories(opts?: { projektyLimit?: number; aktualnosciLimit?: number }): Promise<DynamicStories> {
  const [projekty, aktualnosci, zarzad, komisja] = await Promise.all([
    getStories<ProjektContent>({
      startsWith: 'projekty/',
      contentType: 'projekt',
      perPage: opts?.projektyLimit ?? 12,
      sortBy: 'content.data_startu:desc',
    }),
    getStories<AktualnoscContent>({
      startsWith: 'aktualnosci/',
      contentType: 'aktualnosc',
      perPage: opts?.aktualnosciLimit ?? 12,
      sortBy: 'content.data_publikacji:desc',
    }),
    getStories<CzlonekZarzaduContent>({
      startsWith: 'zarzad/',
      contentType: 'czlonek_zarzadu',
      perPage: 25,
      sortBy: 'content.kolejnosc:asc',
      filterQuery: { 'content.organ': 'zarzad' },
    }),
    getStories<CzlonekZarzaduContent>({
      startsWith: 'zarzad/',
      contentType: 'czlonek_zarzadu',
      perPage: 25,
      sortBy: 'content.kolejnosc:asc',
      filterQuery: { 'content.organ': 'komisja_rewizyjna' },
    }),
  ])

  return {
    projekty: projekty.stories.map((s) => ({ id: s.id, full_slug: s.full_slug, content: s.content })),
    aktualnosci: aktualnosci.stories.map((s) => ({ id: s.id, full_slug: s.full_slug, content: s.content })),
    zarzad: zarzad.stories.map((s) => ({ id: s.id, content: s.content })),
    komisja: komisja.stories.map((s) => ({ id: s.id, content: s.content })),
  }
}
