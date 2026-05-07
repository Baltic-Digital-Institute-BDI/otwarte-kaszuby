import type React from "react"
type Variant = 'tulipan' | 'kalina' | 'lilia'

const PATHS: Record<Variant, React.JSX.Element> = {
  tulipan: (
    <g>
      <path d="M30 14 C26 18 26 24 30 28 C34 24 34 18 30 14 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M30 28 C26 32 22 34 18 34 C22 30 26 28 30 28 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M30 28 C34 32 38 34 42 34 C38 30 34 28 30 28 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <line x1="30" y1="28" x2="30" y2="42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </g>
  ),
  kalina: (
    <g>
      <circle cx="30" cy="20" r="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="24" cy="26" r="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="36" cy="26" r="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="30" cy="32" r="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <line x1="30" y1="35" x2="30" y2="42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </g>
  ),
  lilia: (
    <g>
      <path d="M30 12 L30 28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M30 28 C24 26 20 20 22 14 C26 18 30 22 30 28 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M30 28 C36 26 40 20 38 14 C34 18 30 22 30 28 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M22 30 L30 36 L38 30" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </g>
  ),
}

export function KaszubskiDivider({ variant = 'tulipan' }: { variant?: Variant }) {
  return (
    <div className="flex items-center justify-center my-12 lg:my-16" role="presentation">
      <span aria-hidden="true" className="h-px bg-[var(--color-ok-border-default)] flex-1 max-w-32" />
      <svg
        width="60"
        height="48"
        viewBox="0 0 60 48"
        className="mx-4 text-[var(--color-ok-gold)] opacity-60"
        aria-hidden="true"
      >
        {PATHS[variant]}
      </svg>
      <span aria-hidden="true" className="h-px bg-[var(--color-ok-border-default)] flex-1 max-w-32" />
    </div>
  )
}
