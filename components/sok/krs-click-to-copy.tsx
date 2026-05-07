'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { SOK } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function KrsClickToCopy({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(SOK.krs)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore
    }
  }
  return (
    <button
      onClick={handleCopy}
      type="button"
      className={cn(
        'inline-flex items-center gap-3 rounded-md px-4 py-2.5 transition-colors w-full text-left',
        variant === 'dark'
          ? 'hover:bg-white/10'
          : 'border border-[var(--color-ok-border-default)] hover:border-[var(--color-ok-primary)] bg-white'
      )}
      aria-label="Skopiuj numer KRS"
    >
      <span className="flex-1">
        <span className={cn('block text-xs uppercase tracking-wide', variant === 'dark' ? 'opacity-75' : 'text-[var(--color-ok-text-secondary)]')}>
          KRS
        </span>
        <span className={cn('font-mono text-base lg:text-lg font-semibold', variant === 'dark' ? 'text-white' : 'text-[var(--color-ok-text-primary)]')}>
          {SOK.krs}
        </span>
      </span>
      <span className={cn('shrink-0', variant === 'dark' ? 'text-[var(--color-ok-gold-soft)]' : 'text-[var(--color-ok-primary)]')}>
        {copied ? <Check className="size-5" /> : <Copy className="size-5" />}
      </span>
      <span className="sr-only" aria-live="polite">{copied ? 'Skopiowano do schowka' : ''}</span>
    </button>
  )
}
