import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/constants'
import { getStories } from '@/lib/storyblok/client'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString()
  const staticRoutes = ['', '/o-nas', '/projekty', '/aktualnosci', '/wesprzyj', '/kontakt']

  let projekty: { full_slug: string; published_at: string | null }[] = []
  let news: { full_slug: string; published_at: string | null }[] = []
  try {
    const r1 = await getStories({ startsWith: 'projekty/', contentType: 'projekt', perPage: 100 })
    projekty = r1.stories
    const r2 = await getStories({ startsWith: 'aktualnosci/', contentType: 'aktualnosc', perPage: 100 })
    news = r2.stories
  } catch (e) {
    console.warn('sitemap · Storyblok fetch failed, static-only:', e)
  }

  return [
    ...staticRoutes.map((route) => ({
      url: `${SITE.url}${route}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: route === '' ? 1.0 : 0.8,
    })),
    ...projekty.map((p) => ({
      url: `${SITE.url}/${p.full_slug}`,
      lastModified: p.published_at || now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...news.map((n) => ({
      url: `${SITE.url}/${n.full_slug}`,
      lastModified: n.published_at || now,
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
  ]
}
