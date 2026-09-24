'use client'

import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

type Animation = 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'fade-in' | 'zoom-in' | 'zoom-out' | 'tilt'

interface Props {
  children: React.ReactNode
  animation?: Animation
  delay?: number
  duration?: number
  threshold?: number
  className?: string
  as?: keyof React.JSX.IntrinsicElements
  once?: boolean
}

const ANIMATION_INITIAL: Record<Animation, string> = {
  'fade-up': 'opacity-0 translate-y-8',
  'fade-down': 'opacity-0 -translate-y-8',
  'fade-left': 'opacity-0 translate-x-8',
  'fade-right': 'opacity-0 -translate-x-8',
  'fade-in': 'opacity-0',
  'zoom-in': 'opacity-0 scale-95',
  'zoom-out': 'opacity-0 scale-105',
  'tilt': 'opacity-0 -rotate-2 translate-y-4',
}

/** Gorny limit opoznienia — dluga lista kart nie moze czekac sekundami na pojawienie sie */
const MAX_DELAY_MS = 240

/**
 * Stan animacji:
 * - 'static'  — HTML z serwera i elementy widoczne od razu po zaladowaniu: tresc widoczna bez czekania na JS
 * - 'hidden'  — element ponizej ekranu: ukryty do momentu przewiniecia
 * - 'visible' — element wjechal w ekran: animacja wejscia
 */
type AnimState = 'static' | 'hidden' | 'visible'

export function AnimatedSection({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 500,
  threshold = 0.15,
  className,
  as: Tag = 'div',
  once = true,
}: Props) {
  const ref = useRef<HTMLElement>(null)
  const [state, setState] = useState<AnimState>('static')

  useEffect(() => {
    if (typeof window === 'undefined') return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return
    const node = ref.current
    if (!node) return
    // Element juz na ekranie przy starcie strony: zostaje widoczny, bez animacji (szybsze pierwsze wyswietlenie)
    const rect = node.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) return
    setState('hidden')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setState('visible')
            if (once) observer.unobserve(entry.target)
          } else if (!once) {
            setState('hidden')
          }
        })
      },
      { threshold, rootMargin: '0px 0px -50px 0px' }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold, once])

  const TagAny = Tag as React.ElementType
  return (
    <TagAny
      ref={ref as never}
      className={cn(
        state === 'hidden'
          ? cn('transition-none', ANIMATION_INITIAL[animation])
          : 'opacity-100 translate-x-0 translate-y-0 scale-100 rotate-0',
        state === 'visible' && 'will-change-transform transition-all ease-out',
        className
      )}
      style={state === 'visible' ? { transitionDuration: `${duration}ms`, transitionDelay: `${Math.min(delay, MAX_DELAY_MS)}ms` } : undefined}
    >
      {children}
    </TagAny>
  )
}

interface StaggerProps {
  children: React.ReactNode
  animation?: Animation
  baseDelay?: number
  step?: number
  className?: string
}

/** Stagger wrapper · automatycznie dodaje delay do każdego dziecka */
export function StaggerChildren({ children, animation = 'fade-up', baseDelay = 0, step = 80, className }: StaggerProps) {
  const items = Array.isArray(children) ? children : [children]
  return (
    <>
      {items.map((child, idx) => (
        <AnimatedSection
          key={idx}
          animation={animation}
          delay={baseDelay + idx * step}
          className={className}
        >
          {child}
        </AnimatedSection>
      ))}
    </>
  )
}
