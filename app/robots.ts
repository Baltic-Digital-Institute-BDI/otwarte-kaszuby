import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/constants'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // /_next/ NIE jest blokowane: tam leza CSS, JS i zoptymalizowane obrazy (/_next/image).
      // Zablokowanie ich nie pozwala Google wyrenderowac strony ani zaindeksowac zdjec.
      { userAgent: '*', allow: '/', disallow: ['/api/'] },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  }
}
