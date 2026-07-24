import Image from 'next/image'

interface Props {
  tekst: string
  znakiUrl?: string
  znakiAlt?: string
}

/**
 * Obowiązkowe oznakowanie projektu unijnego (FE 2021-2027).
 * Treść (VERBATIM) i zestaw znaków pochodzą ze Storyblok — edytowalne przez
 * właściciela treści (pole `dofinansowanie_ue` na komponencie `projekt`).
 * Wersja pełnokolorowa znaków — wymóg dla stron internetowych.
 */
export function DofinansowanieUe({ tekst, znakiUrl, znakiAlt }: Props) {
  if (!tekst && !znakiUrl) return null
  return (
    <section
      aria-label="Informacja o dofinansowaniu z Funduszy Europejskich"
      className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="border border-[var(--color-ok-border-default)] rounded-xl p-6 lg:p-8 bg-[var(--color-ok-bg-secondary)]">
        {znakiUrl && (
          <div className="mb-6">
            <Image
              src={znakiUrl}
              alt={znakiAlt || 'Zestaw znaków: Fundusze Europejskie, Rzeczpospolita Polska, Unia Europejska'}
              width={2586}
              height={242}
              className="w-full h-auto"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}
        {tekst && (
          <p className="text-sm lg:text-base leading-relaxed text-[var(--color-ok-text-secondary)] whitespace-pre-line">
            {tekst}
          </p>
        )}
      </div>
    </section>
  )
}
