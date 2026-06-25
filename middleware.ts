import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware · injects security headers including CSP frame-ancestors
 * for Storyblok Visual Editor iframe support.
 */
export function middleware(_request: NextRequest) {
  const response = NextResponse.next()
  // Allow embedding by Storyblok Visual Editor + self
  response.headers.set(
    'Content-Security-Policy',
    "frame-ancestors 'self' https://app.storyblok.com https://*.storyblok.com"
  )
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  // Explicitly remove X-Frame-Options if anything sets it
  response.headers.delete('X-Frame-Options')
  return response
}

export const config = {
  matcher: [
    // Apply to all routes except Next.js internals and static files
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}
