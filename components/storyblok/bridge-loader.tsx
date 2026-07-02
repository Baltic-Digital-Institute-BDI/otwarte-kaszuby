'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Script from 'next/script'

declare global {
  interface Window {
    StoryblokBridge?: new (opts?: unknown) => {
      on: (events: string | string[], cb: (event?: unknown) => void) => void
    }
    storyblokRegisterEvent?: (cb: () => void) => void
  }
}

/**
 * Storyblok Bridge · live preview loader (client-side)
 * - Loads storyblok-v2-latest.js from app.storyblok.com
 * - Subscribes to 'input' + 'change' + 'published' events
 * - Calls router.refresh() to re-fetch server components with updated draft content
 * - Enables click-to-edit highlights on elements with data-blok-c attribute
 */
export function BridgeLoader() {
  const router = useRouter()

  useEffect(() => {
    const initBridge = () => {
      if (!window.StoryblokBridge) return
      const bridge = new window.StoryblokBridge()
      // Live text updates while typing in Storyblok admin
      bridge.on(['input', 'change', 'published'], () => {
        router.refresh()
      })
      // Also refresh when Storyblok admin sends a "story" event (initial load)
      bridge.on('enterEditmode', () => router.refresh())
    }

    if (window.StoryblokBridge) {
      initBridge()
    } else {
      // Wait for script to load
      const check = setInterval(() => {
        if (window.StoryblokBridge) {
          clearInterval(check)
          initBridge()
        }
      }, 200)
      return () => clearInterval(check)
    }
  }, [router])

  return (
    <Script
      src="https://app.storyblok.com/f/storyblok-v2-latest.js"
      strategy="afterInteractive"
    />
  )
}
