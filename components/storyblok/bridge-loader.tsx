'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Script from 'next/script'

/**
 * Storyblok Bridge · live preview loader (client-side)
 * - Loads storyblok-v2-latest.js from app.storyblok.com
 * - Subscribes to 'input' + 'change' + 'published' events
 * - Calls router.refresh() to re-fetch server components with updated draft content
 * - Enables click-to-edit highlights on elements with data-blok-c attribute
 *
 * Note: window.StoryblokBridge is declared by @storyblok/react — accessed via cast.
 */
export function BridgeLoader() {
  const router = useRouter()

  useEffect(() => {
    const w = window as unknown as { StoryblokBridge?: new () => { on: (events: string | string[], cb: (event?: unknown) => void) => void } }

    const initBridge = () => {
      if (!w.StoryblokBridge) return
      const bridge = new w.StoryblokBridge()
      bridge.on(['input', 'change', 'published'], () => {
        router.refresh()
      })
      bridge.on('enterEditmode', () => router.refresh())
    }

    if (w.StoryblokBridge) {
      initBridge()
    } else {
      const check = setInterval(() => {
        if (w.StoryblokBridge) {
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
