import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Proxy (Next.js 16 replacement for middleware) · injects security headers
 * including CSP frame-ancestors for Storyblok Visual Editor iframe support.
 */
export function proxy(_request: NextRequest) {
  const response = NextResponse.next()
  response.headers.set(
    'Content-Security-Policy',
    "frame-ancestors 'self' https://app.storyblok.com https://*.storyblok.com"
  )
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  response.headers.delete('X-Frame-Options')
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}
