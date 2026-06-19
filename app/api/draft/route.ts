import { NextResponse } from 'next/server'
import { draftMode } from 'next/headers'

const SECRET = process.env.STORYBLOK_PREVIEW_SECRET || 'sok-preview-2026'

/**
 * Draft mode entry point · used by Storyblok Visual Editor iframe.
 * Storyblok loads the page with ?_storyblok=... + secret · this route flips
 * Next.js to draft mode which causes pages to fetch published=false content.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug') || '/'

  if (secret !== SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
  }

  const draft = await draftMode()
  draft.enable()

  return NextResponse.redirect(new URL(slug, request.url))
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
