import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/constants'
import { PROJEKTY } from '@/lib/data/projekty'
import { AKTUALNOSCI } from '@/lib/data/aktualnosci'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString()
  const staticRoutes = ['', '/o-nas', '/projekty', '/aktualnosci', '/wesprzyj', '/kontakt']

  return [
    ...staticRoutes.map((route) => ({
      url: `${SITE.url}${route}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: route === '' ? 1.0 : 0.8,
    })),
    ...PROJEKTY.map((p) => ({
      url: `${SITE.url}/projekty/${p.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...AKTUALNOSCI.map((n) => ({
      url: `${SITE.url}/aktualnosci/${n.slug}`,
      lastModified: n.date,
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
  ]
}
