'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Script from 'next/script'

/**
 * Storyblok Bridge · Visual Editor live preview + click-to-edit
 *
 * Script auto-detects iframe embedding (window.top !== window). Outside admin
 * iframe context, script is no-op — safe to load on production for everyone.
 *
 * Inside iframe context:
 *  - Bridge attaches click handlers to elements with data-blok-c attribute
 *  - On block click → postMessage to parent Storyblok admin → opens block editor panel
 *  - On admin content change (publish, save draft) → we call router.refresh() to re-fetch server components
 */
export function BridgeLoader() {
  const router = useRouter()

  useEffect(() => {
    // Skip if not in iframe
    if (typeof window === 'undefined') return
    if (window.top === window.self) return // not embedded, skip bridge init

    const w = window as unknown as {
      StoryblokBridge?: new () => {
        on: (events: string | string[], cb: (event?: unknown) => void) => void
      }
    }

    const initBridge = () => {
      if (!w.StoryblokBridge) return
      const bridge = new w.StoryblokBridge()
      // Only refresh on save/publish events (not per-keystroke 'input')
      bridge.on(['change', 'published'], () => {
        router.refresh()
      })
      // Also handle 'input' for live preview but with delay
      let inputTimer: ReturnType<typeof setTimeout> | null = null
      bridge.on(['input'], () => {
        if (inputTimer) clearTimeout(inputTimer)
        inputTimer = setTimeout(() => router.refresh(), 500)
      })
    }

    if (w.StoryblokBridge) {
      initBridge()
      return
    }

    // Poll for Bridge script load (max 10s)
    const startedAt = Date.now()
    const check = setInterval(() => {
      if (w.StoryblokBridge) {
        clearInterval(check)
        initBridge()
      } else if (Date.now() - startedAt > 10000) {
        clearInterval(check)
      }
    }, 200)

    return () => clearInterval(check)
  }, [router])

  return (
    <Script
      src="https://app.storyblok.com/f/storyblok-v2-latest.js"
      strategy="afterInteractive"
    />
  )
}
