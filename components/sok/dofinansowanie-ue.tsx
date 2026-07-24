import Image from 'next/image'

interface Props {
  znakiUrl?: string
  znakiAlt?: string
  tekst?: string
}

/**
 * Obowiązkowe oznakowanie projektu unijnego (FE 2021-2027).
 * Treść wyświetlana SŁOWO W SŁOWO z pola `tekst` (Storyblok, edytowalne).
 * Akapity rozdzielone pustą linią; łamania linii wewnątrz akapitu zachowane.
 * Znaki w wersji pełnokolorowej — wymóg dla stron www.
 */
export function DofinansowanieUe({ znakiUrl, znakiAlt, tekst }: Props) {
  const paragraphs = (tekst || '').split(/\n{2,}/).map((t) => t.trim()).filter(Boolean)
  if (!paragraphs.length && !znakiUrl) return null
  return (
    <section
      aria-label="Informacja o dofinansowaniu z Funduszy Europejskich"
      className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="rounded-2xl border border-[var(--color-ok-border-default)] bg-[var(--color-ok-bg-secondary)] overflow-hidden">
        <div className="h-1.5 bg-[var(--color-ok-primary)]" aria-hidden="true" />
        <div className="p-6 lg:p-10">
          {znakiUrl && (
            <div className="bg-white rounded-xl border border-[var(--color-ok-border-default)] p-4 lg:p-6 mb-8">
              <Image
                src={znakiUrl}
                alt={znakiAlt || 'Zestaw znaków: Fundusze Europejskie, Rzeczpospolita Polska, Unia Europejska'}
                width={2586}
                height={242}
                className="w-full h-auto max-w-2xl mx-auto"
                sizes="(max-width: 768px) 100vw, 640px"
              />
            </div>
          )}
          <div className="space-y-4 text-base lg:text-lg leading-relaxed text-[var(--color-ok-text-primary)]">
            {paragraphs.map((para, i) => (
              <p key={i} className="whitespace-pre-line">
                {para}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
