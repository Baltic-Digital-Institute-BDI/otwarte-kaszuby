'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { RefreshCw, Home } from 'lucide-react'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])
  return (
    <section className="min-h-[60vh] flex items-center justify-center py-16">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
        <p className="font-mono text-sm text-[var(--color-ok-error)] uppercase tracking-widest mb-4">Błąd 500</p>
        <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          Coś poszło nie tak
        </h1>
        <p className="text-lg text-[var(--color-ok-text-secondary)] mb-8 leading-relaxed">
          Wystąpił nieoczekiwany błąd. Spróbuj ponownie lub wróć na stronę główną. Jeśli problem powtarza się, skontaktuj się z nami.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-ok-primary)] text-white font-medium rounded-md hover:bg-[var(--color-ok-primary-hover)] transition-colors"
          >
            <RefreshCw className="size-4" /> Spróbuj ponownie
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-[var(--color-ok-primary)] text-[var(--color-ok-primary)] font-medium rounded-md hover:bg-[var(--color-ok-primary-50)] transition-colors"
          >
            <Home className="size-4" /> Strona główna
          </Link>
        </div>
      </div>
    </section>
  )
}
