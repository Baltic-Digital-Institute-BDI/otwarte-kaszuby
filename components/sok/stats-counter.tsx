'use client'

import { useEffect, useRef, useState } from 'react'
import type { Stat } from '@/lib/data/types'

function CountUp({ value, suffix = '', duration = 1500 }: { value: number; suffix?: string; duration?: number }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      setDisplay(value)
      return
    }
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true
            const start = performance.now()
            const tick = (now: number) => {
              const elapsed = now - start
              const progress = Math.min(elapsed / duration, 1)
              const eased = 1 - Math.pow(1 - progress, 3)
              setDisplay(Math.floor(eased * value))
              if (progress < 1) requestAnimationFrame(tick)
              else setDisplay(value)
            }
            requestAnimationFrame(tick)
          }
        })
      },
      { rootMargin: '-50px' }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [value, duration])

  return (
    <span ref={ref}>
      {display.toLocaleString('pl-PL')}
      {suffix}
    </span>
  )
}

export function StatsCounter({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-10">
      {stats.map((stat) => (
        <div key={stat.label} className="text-center">
          <div className="font-headline font-bold text-4xl md:text-5xl lg:text-6xl text-[var(--color-ok-gold-deep)] mb-2">
            <CountUp value={stat.value} suffix={stat.suffix} />
          </div>
          <p className="text-sm text-[var(--color-ok-text-secondary)] leading-tight">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}
