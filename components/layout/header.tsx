'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/', label: 'Strona główna' },
  { href: '/o-nas', label: 'O nas' },
  { href: '/projekty', label: 'Projekty' },
  { href: '/aktualnosci', label: 'Aktualności' },
  { href: '/wesprzyj', label: 'Wesprzyj' },
  { href: '/kontakt', label: 'Kontakt' },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header className={cn(
      'sticky top-0 z-40 backdrop-blur-md transition-all duration-300',
      scrolled ? 'bg-white/95 shadow-md-warm border-b border-[var(--color-ok-border-default)]' : 'bg-white/85 border-b border-transparent'
    )}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={cn('flex items-center justify-between transition-all duration-300', scrolled ? 'h-14 lg:h-16' : 'h-16 lg:h-20')}>
          <Link href="/" className="flex items-center group" aria-label="Strona główna · Stowarzyszenie Otwarte Kaszuby">
            <Image
              src="/logo-ok.png"
              alt="Stowarzyszenie Otwarte Kaszuby"
              width={200}
              height={56}
              className={cn('w-auto transition-all duration-300 group-hover:scale-105', scrolled ? 'h-10 lg:h-12' : 'h-12 lg:h-14')}
              priority
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-1" aria-label="Menu główne">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-200',
                    active
                      ? 'text-[var(--color-ok-primary)] bg-[var(--color-ok-primary-50)]'
                      : 'text-[var(--color-ok-text-primary)] hover:text-[var(--color-ok-primary)] hover:bg-[var(--color-ok-primary-50)]'
                  )}
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute left-4 right-4 -bottom-0.5 h-0.5 bg-[var(--color-ok-primary)] rounded-full transition-transform duration-300 origin-center',
                      active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    )}
                  />
                </Link>
              )
            })}
          </nav>

          <button
            className="lg:hidden p-2 -mr-2 rounded-md hover:bg-[var(--color-ok-primary-50)]"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Zamknij menu' : 'Otwórz menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>

        <nav
          id="mobile-menu"
          className={cn('lg:hidden overflow-hidden transition-all duration-500 ease-out', open ? 'max-h-[28rem] pb-4' : 'max-h-0')}
          aria-label="Menu mobilne"
        >
          <div className="flex flex-col gap-1 pt-2">
            {NAV_ITEMS.map((item, idx) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                style={{ transitionDelay: open ? `${idx * 40}ms` : '0ms' }}
                className={cn(
                  'px-4 py-3 text-base font-medium rounded-md transition-all duration-300',
                  isActive(item.href)
                    ? 'text-[var(--color-ok-primary)] bg-[var(--color-ok-primary-50)] translate-x-2'
                    : 'text-[var(--color-ok-text-primary)] hover:bg-[var(--color-ok-primary-50)] hover:translate-x-2'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  )
}
