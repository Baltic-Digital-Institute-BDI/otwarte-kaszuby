'use client'

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
  as?: keyof JSX.IntrinsicElements
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

export function AnimatedSection({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 700,
  threshold = 0.15,
  className,
  as: Tag = 'div',
  once = true,
}: Props) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      setVisible(true)
      return
    }
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            if (once) observer.unobserve(entry.target)
          } else if (!once) {
            setVisible(false)
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
        'will-change-transform transition-all ease-out',
        visible ? 'opacity-100 translate-x-0 translate-y-0 scale-100 rotate-0' : ANIMATION_INITIAL[animation],
        className
      )}
      style={{ transitionDuration: `${duration}ms`, transitionDelay: `${delay}ms` }}
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
