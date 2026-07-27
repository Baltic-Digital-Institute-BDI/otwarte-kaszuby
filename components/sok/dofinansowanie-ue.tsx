import Image from 'next/image'

interface Props {
  znakiUrl?: string
  znakiAlt?: string
  tekst?: string
  wartoscCalkowita?: string
  dofinansowanie?: string
  srodkiEuropejskie?: string
  wspolfinansowanieBp?: string
  formula?: string
}

/**
 * Obowiązkowe oznakowanie projektu unijnego (FE 2021-2027).
 * Akapity opisowe SŁOWO W SŁOWO z pola `tekst`; kwoty jako zaprojektowana karta
 * (pola wartości w Storyblok — edytowalne). Znaki w wersji pełnokolorowej.
 */
export function DofinansowanieUe({
  znakiUrl, znakiAlt, tekst,
  wartoscCalkowita, dofinansowanie, srodkiEuropejskie, wspolfinansowanieBp, formula,
}: Props) {
  const paragraphs = (tekst || '').split(/\n{2,}/).map((t) => t.trim()).filter(Boolean)
  const hasFin = Boolean(wartoscCalkowita || dofinansowanie)
  if (!paragraphs.length && !hasFin && !znakiUrl) return null
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

          {paragraphs.length > 0 && (
            <div className="space-y-4 text-base lg:text-lg leading-relaxed text-[var(--color-ok-text-primary)]">
              {paragraphs.map((para, i) => (
                <p key={i} className="whitespace-pre-line">{para}</p>
              ))}
            </div>
          )}

          {hasFin && (
            <div className="mt-8 rounded-xl bg-white border border-[var(--color-ok-border-default)] p-5 lg:p-6">
              <dl className="divide-y divide-[var(--color-ok-border-default)]">
                {wartoscCalkowita && (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 py-3 first:pt-0">
                    <dt className="text-[var(--color-ok-text-secondary)]">Całkowita wartość projektu</dt>
                    <dd className="font-mono font-semibold text-[var(--color-ok-text-primary)]">{wartoscCalkowita}</dd>
                  </div>
                )}
                {dofinansowanie && (
                  <div className="py-3 last:pb-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <dt className="text-[var(--color-ok-text-secondary)]">Wysokość dofinansowania</dt>
                      <dd className="font-mono font-semibold text-[var(--color-ok-primary)]">{dofinansowanie}</dd>
                    </div>
                    {(srodkiEuropejskie || wspolfinansowanieBp) && (
                      <>
                        <p className="mt-3 mb-2 text-sm text-[var(--color-ok-text-secondary)]">w tym:</p>
                        <ul className="pl-4 border-l-2 border-[var(--color-ok-border-default)] space-y-2">
                          {srodkiEuropejskie && (
                            <li className="flex flex-col sm:flex-row sm:justify-between gap-1 text-sm">
                              <span className="text-[var(--color-ok-text-secondary)]">– finansowanie ze środków europejskich</span>
                              <span className="font-mono text-[var(--color-ok-text-secondary)]">{srodkiEuropejskie}</span>
                            </li>
                          )}
                          {wspolfinansowanieBp && (
                            <li className="flex flex-col sm:flex-row sm:justify-between gap-1 text-sm">
                              <span className="text-[var(--color-ok-text-secondary)]">– współfinansowanie ze środków budżetu państwa</span>
                              <span className="font-mono text-[var(--color-ok-text-secondary)]">{wspolfinansowanieBp}</span>
                            </li>
                          )}
                        </ul>
                      </>
                    )}
                  </div>
                )}
              </dl>
            </div>
          )}

          {formula && (
            <p className="mt-6 flex items-center justify-center gap-2 text-center text-sm font-semibold text-[var(--color-ok-text-primary)]">
              <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full bg-[var(--color-ok-primary)]" />
              {formula}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
