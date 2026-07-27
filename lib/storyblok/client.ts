import 'server-only'
import { draftMode } from 'next/headers'

const STORYBLOK_API = process.env.STORYBLOK_API_BASE || 'https://api.storyblok.com/v2/cdn'
const TOKEN = process.env.STORYBLOK_PREVIEW_TOKEN || 'Qzzxcq9oXwCmyGLwtPjHdwtt'

async function isDraftMode(): Promise<boolean> {
  try {
    const dm = await draftMode()
    return dm.isEnabled
  } catch {
    return false
  }
}

export type Story<T = unknown> = {
  id: number
  uuid: string
  name: string
  slug: string
  full_slug: string
  content: T
  published: boolean
  created_at: string
  published_at: string | null
  first_published_at: string | null
  parent_id: number | null
  is_startpage: boolean
}

interface FetchOptions {
  version?: 'draft' | 'published'
  resolveLinks?: 'url' | 'story' | 'link'
  resolveRelations?: string
  cv?: number
}

const isDev = process.env.NODE_ENV === 'development'
const isPreview = process.env.VERCEL_ENV === 'preview'

/** Fetch single story */
export async function getStory<T = unknown>(slug: string, opts: FetchOptions = {}): Promise<Story<T> | null> {
  const isDraft = await isDraftMode()
  const params = new URLSearchParams({
    token: TOKEN,
    version: opts.version || (isDraft || isDev || isPreview ? 'draft' : 'published'),
    cv: String(Date.now()),
  })
  if (opts.resolveLinks) params.set('resolve_links', opts.resolveLinks)
  if (opts.resolveRelations) params.set('resolve_relations', opts.resolveRelations)
  if (opts.cv) params.set('cv', String(opts.cv))

  const url = `${STORYBLOK_API}/stories/${slug}?${params}`
  const res = await fetch(url, {
    next: { revalidate: isDraft || isDev ? 0 : 60, tags: ['storyblok', `story:${slug}`] },
    cache: isDraft ? 'no-store' : 'default',
  })
  if (!res.ok) {
    if (res.status === 404) return null
    console.error(`Storyblok fetch error ${res.status} for ${slug}`)
    return null
  }
  const data = await res.json()
  return data.story as Story<T>
}

/** Fetch list of stories */
export async function getStories<T = unknown>(opts: FetchOptions & {
  startsWith?: string
  contentType?: string
  perPage?: number
  page?: number
  sortBy?: string
  filterQuery?: Record<string, unknown>
} = {}): Promise<{ stories: Story<T>[]; total: number }> {
  const params = new URLSearchParams({
    token: TOKEN,
    version: opts.version || (isDev || isPreview ? 'draft' : 'published'),
    per_page: String(opts.perPage || 25),
    page: String(opts.page || 1),
  })
  if (opts.startsWith) params.set('starts_with', opts.startsWith)
  if (opts.contentType) params.set('content_type', opts.contentType)
  if (opts.sortBy) params.set('sort_by', opts.sortBy)
  if (opts.resolveLinks) params.set('resolve_links', opts.resolveLinks)
  if (opts.resolveRelations) params.set('resolve_relations', opts.resolveRelations)
  if (opts.filterQuery) {
    for (const [k, v] of Object.entries(opts.filterQuery)) {
      // Strip 'content.' prefix — Storyblok CDN expects field name only
      const field = k.replace(/^content\./, '')
      params.set(`filter_query[${field}][in]`, String(v))
    }
  }

  const url = `${STORYBLOK_API}/stories?${params}`
  const res = await fetch(url, {
    next: { revalidate: isDev ? 0 : 60, tags: ['storyblok', `list:${opts.startsWith || 'all'}`] },
  })
  if (!res.ok) {
    console.error(`Storyblok list error ${res.status}`)
    return { stories: [], total: 0 }
  }
  const data = await res.json()
  const total = parseInt(res.headers.get('total') || '0', 10)
  return { stories: data.stories as Story<T>[], total }
}

/** Helper: render Storyblok asset URL with transforms */
export function imageUrl(asset?: { filename?: string } | string | null, transforms = '1600x0'): string {
  if (!asset) return ''
  const filename = typeof asset === 'string' ? asset : asset.filename
  if (!filename) return ''
  // Storyblok image service · /m/{transforms}
  return `${filename}/m/${transforms}`
}

/** Helper: extract URL from Storyblok multilink */
export function linkUrl(link?: { url?: string; cached_url?: string; linktype?: string } | null): string {
  if (!link) return '#'
  if (link.url) return link.url
  if (link.cached_url) {
    if (link.linktype === 'story') return `/${link.cached_url}`
    return link.cached_url
  }
  return '#'
}
