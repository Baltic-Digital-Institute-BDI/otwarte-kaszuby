import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { KaszubskiDivider } from '@/components/sok/kaszubski-divider'

export default function NotFound() {
  return (
    <section className="min-h-[60vh] flex items-center justify-center py-16">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
        <p className="font-mono text-sm text-[var(--color-ok-primary)] uppercase tracking-widest mb-4">Błąd 404</p>
        <h1 className="font-headline text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
          Strona zaginęła jak haft kaszubski
        </h1>
        <p className="text-lg text-[var(--color-ok-text-secondary)] mb-8 leading-relaxed">
          Adres, którego szukasz, nie istnieje albo został przeniesiony. Sprawdź adres URL lub wróć na stronę główną.
        </p>
        <KaszubskiDivider variant="tulipan" />
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-ok-primary)] text-white font-medium rounded-md hover:bg-[var(--color-ok-primary-hover)] transition-colors"
          >
            Strona główna <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/projekty"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-[var(--color-ok-primary)] text-[var(--color-ok-primary)] font-medium rounded-md hover:bg-[var(--color-ok-primary-50)] transition-colors"
          >
            Sprawdź projekty
          </Link>
        </div>
      </div>
    </section>
  )
}
