import { NextResponse } from 'next/server'
import { draftMode } from 'next/headers'

const SECRET = process.env.STORYBLOK_PREVIEW_SECRET || 'sok-preview-2026'

/**
 * Draft mode entry point · used by Storyblok Visual Editor iframe.
 * Storyblok loads the page with ?_storyblok=... + secret · this route flips
 * Next.js to draft mode which causes pages to fetch published=false content.
 */
const BASE_PATH = '/otwartekaszuby'

// Force this route to be dynamic (no ISR cache — always fresh redirect)
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: Request) {
  const url = new URL(request.url)
  const secret = url.searchParams.get('secret')
  const slug = url.searchParams.get('slug') || ''

  if (secret !== SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
  }

  const draft = await draftMode()
  draft.enable()

  // Normalize · 'home' → BASE_PATH/, else BASE_PATH/<slug>
  const normalizedSlug = slug === 'home' || slug === '' || slug === '/' ? '' : slug.replace(/^\//, '')
  const targetPathname = normalizedSlug ? `${BASE_PATH}/${normalizedSlug}` : `${BASE_PATH}/`

  // Build target by mutating url object (preserves origin, drops query)
  url.pathname = targetPathname
  url.search = ''
  return NextResponse.redirect(url.toString())
}

export async function POST(request: Request) {
  const url = new URL(request.url)
  const action = url.searchParams.get('action')
  if (action === 'disable') {
    const draft = await draftMode()
    draft.disable()
    return NextResponse.json({ ok: true, draft: false })
  }
  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
