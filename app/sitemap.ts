import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/constants'
import { PROJEKTY } from '@/lib/data/projekty'
import { AKTUALNOSCI } from '@/lib/data/aktualnosci'
import { getStories, type Story } from '@/lib/storyblok/client'

// Spis podstron budowany z opublikowanych stories w Storyblok (to samo zrodlo co strona),
// a nie ze statycznego lib/data — inaczej nowe projekty i aktualnosci nigdy nie trafiaja do mapy.
// Statyczne dane zostaja wylacznie jako zapas, gdy Storyblok nie odpowie.
export const revalidate = 3600

type Entry = { slug: string; lastModified: string }

async function fromStoryblok(startsWith: string): Promise<Entry[] | null> {
  try {
    const { stories } = await getStories({ startsWith, version: 'published', perPage: 100 })
    if (!stories.length) return null
    return stories
      .filter((s: Story) => !s.is_startpage)
      .map((s: Story) => ({ slug: s.slug, lastModified: s.published_at || s.first_published_at || s.created_at }))
  } catch {
    return null
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString()
  const staticRoutes = ['', '/o-nas', '/projekty', '/aktualnosci', '/wesprzyj', '/kontakt']

  const projekty =
    (await fromStoryblok('projekty/')) ?? PROJEKTY.map((p) => ({ slug: p.slug, lastModified: now }))
  const aktualnosci =
    (await fromStoryblok('aktualnosci/')) ?? AKTUALNOSCI.map((n) => ({ slug: n.slug, lastModified: n.date }))

  return [
    ...staticRoutes.map((route) => ({
      url: `${SITE.url}${route}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: route === '' ? 1.0 : 0.8,
    })),
    ...projekty.map((p) => ({
      url: `${SITE.url}/projekty/${p.slug}`,
      lastModified: p.lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...aktualnosci.map((n) => ({
      url: `${SITE.url}/aktualnosci/${n.slug}`,
      lastModified: n.lastModified,
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
  ]
}
