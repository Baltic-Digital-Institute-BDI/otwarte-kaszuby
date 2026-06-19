import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

const SECRET = process.env.STORYBLOK_WEBHOOK_SECRET || 'otwarte-kaszuby-revalidate-2026'

/**
 * Storyblok webhook endpoint · revalidates Next.js cache when content publishes.
 * Configure in Storyblok: Settings → Webhooks → Story published/unpublished/deleted
 * POST {url}/api/revalidate?secret=<SECRET>
 */
export async function POST(request: Request) {
  const url = new URL(request.url)
  const secret = url.searchParams.get('secret')
  if (secret !== SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
  }
  try {
    const payload: { full_slug?: string; story_id?: number } = await request.json().catch(() => ({}))
    const revalidated: string[] = []
    // Revalidate homepage + lists always (cheap)
    revalidatePath('/')
    revalidatePath('/projekty')
    revalidatePath('/aktualnosci')
    revalidatePath('/o-nas')
    revalidatePath('/wesprzyj')
    revalidatePath('/kontakt')
    revalidatePath('/sitemap.xml')
    revalidated.push('/', '/projekty', '/aktualnosci', '/o-nas', '/wesprzyj', '/kontakt')
    // Revalidate specific story path if provided
    if (payload.full_slug) {
      const slugPath = '/' + payload.full_slug.replace(/^\/+|\/+$/g, '')
      revalidatePath(slugPath)
      revalidated.push(slugPath)
    }
    return NextResponse.json({
      revalidated,
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    info: 'POST with ?secret=<token> + Storyblok payload to revalidate cache',
  })
}
