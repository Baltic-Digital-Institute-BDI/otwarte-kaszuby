'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Script from 'next/script'
import { BlocksClientRenderer, type DynamicStories } from './blocks-client'

interface Story {
  id: number
  uuid: string
  name: string
  slug: string
  content: {
    sekcje?: unknown[]
    [key: string]: unknown
  }
}

/**
 * LivePreview · client wrapper subskrybujący do Storyblok Bridge input events
 *
 * Flow:
 * 1. Initial render z prefetched server story
 * 2. Bridge script ładuje się (afterInteractive)
 * 3. Bridge init w iframe context → subscribe do 'input' event
 * 4. On input: setStory(updatedStory) → React re-renderuje BlocksClientRenderer inline
 * 5. On change/published: router.refresh() → fresh fetch server side
 */
export function LivePreview({
  initialStory,
  dynamic,
}: {
  initialStory: Story
  dynamic: DynamicStories
}) {
  const [story, setStory] = useState<Story>(initialStory)
  const router = useRouter()

  useEffect(() => {
    // Sync initial when server pushes new prefetched story
    setStory(initialStory)
  }, [initialStory])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const w = window as unknown as {
      StoryblokBridge?: new (opts?: unknown) => {
        on: (events: string | string[], cb: (event?: {
          action?: string
          story?: Story
        }) => void) => void
      }
    }

    const initBridge = () => {
      if (!w.StoryblokBridge) return
      const bridge = new w.StoryblokBridge({ resolveRelations: [] })
      // Live preview typing in admin → replace content inline
      bridge.on(['input'], (event) => {
        if (event?.story && event.story.id === story.id) {
          setStory({ ...story, content: event.story.content })
        }
      })
      // Save draft / publish → hard refresh (re-fetch from Storyblok CDN)
      bridge.on(['change', 'published'], () => {
        router.refresh()
      })
    }

    if (w.StoryblokBridge) {
      initBridge()
      return
    }

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
  }, [router, story])

  const sekcje = (story.content?.sekcje || []) as any[]

  return (
    <>
      <Script
        src="https://app.storyblok.com/f/storyblok-v2-latest.js"
        strategy="afterInteractive"
      />
      <BlocksClientRenderer sekcje={sekcje} dynamic={dynamic} />
    </>
  )
}
