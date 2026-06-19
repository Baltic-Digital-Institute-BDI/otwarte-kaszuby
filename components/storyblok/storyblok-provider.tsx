'use client'

import { storyblokInit, apiPlugin } from '@storyblok/react'
import { useEffect } from 'react'

let initialized = false

/**
 * Storyblok Bridge initialization
 * Loads only in browser · enables Visual Editor click-to-edit
 * No-op in production unless rendered inside Storyblok admin iframe
 */
export function StoryblokProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (initialized) return
    if (typeof window === 'undefined') return
    storyblokInit({
      accessToken: process.env.NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN || 'Qzzxcq9oXwCmyGLwtPjHdwtt',
      use: [apiPlugin],
      bridge: true,
      apiOptions: {
        region: 'eu',
      },
    })
    initialized = true
  }, [])
  return <>{children}</>
}
