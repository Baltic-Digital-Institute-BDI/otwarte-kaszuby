import Image from 'next/image'

interface Props {
  znakiUrl?: string
  znakiAlt?: string
  tytulProjektu?: string
  program?: string
  cel?: string
  szkolenia?: string[]
  wartoscCalkowita?: string
  dofinansowanie?: string
  srodkiEuropejskie?: string
  wspolfinansowanieBp?: string
  formula?: string
  tekst?: string
}

/**
 * Obowiązkowe oznakowanie projektu unijnego (FE 2021-2027) — zaprojektowane sekcje.
 * Wszystkie treści i kwoty pochodzą 1:1 ze Storyblok (pole `dofinansowanie_ue` na
 * komponencie `projekt`) i są edytowalne przez właściciela treści. Znaki w wersji
 * pełnokolorowej — wymóg dla stron internetowych.
 */
export function DofinansowanieUe(p: Props) {
  const hasStructured = Boolean(p.tytulProjektu || p.wartoscCalkowita || (p.szkolenia && p.szkolenia.length))
  if (!hasStructured && !p.tekst && !p.znakiUrl) return null
  return (
    <section
      aria-label="Informacja o dofinansowaniu z Funduszy Europejskich"
      className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="rounded-2xl border border-[var(--color-ok-border-default)] bg-[var(--color-ok-bg-secondary)] overflow-hidden">
        <div className="h-1.5 bg-[var(--color-ok-primary)]" aria-hidden="true" />
        <div className="p-6 lg:p-10">
          {p.znakiUrl && (
            <div className="bg-white rounded-xl border border-[var(--color-ok-border-default)] p-4 lg:p-6 mb-8">
              <Image
                src={p.znakiUrl}
                alt={p.znakiAlt || 'Zestaw znaków: Fundusze Europejskie, Rzeczpospolita Polska, Unia Europejska'}
                width={2586}
                height={242}
                className="w-full h-auto max-w-2xl mx-auto"
                sizes="(max-width: 768px) 100vw, 640px"
              />
            </div>
          )}

          {p.program && (
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ok-primary)] mb-2">
              {p.program}
            </p>
          )}
          <h2 className="font-headline text-2xl lg:text-3xl font-bold mb-2 leading-tight">
            Dofinansowanie ze środków Unii Europejskiej
          </h2>
          {p.tytulProjektu && (
            <p className="text-base lg:text-lg text-[var(--color-ok-text-secondary)] mb-8 leading-relaxed">
              {p.tytulProjektu}
            </p>
          )}

          {p.cel && (
            <div className="mb-8">
              <h3 className="font-headline text-lg font-bold mb-2">Cel</h3>
              <p className="text-[var(--color-ok-text-secondary)] leading-relaxed">{p.cel}</p>
            </div>
          )}

          {p.szkolenia && p.szkolenia.length > 0 && (
            <div className="mb-8">
              <h3 className="font-headline text-lg font-bold mb-3">Szkolenia</h3>
              <ul className="flex flex-wrap gap-2">
                {p.szkolenia.map((s, i) => (
                  <li
                    key={i}
                    className="inline-flex items-center rounded-full bg-[var(--color-ok-bg-tertiary)] border border-[var(--color-ok-border-default)] px-3 py-1 text-sm text-[var(--color-ok-text-primary)]"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(p.wartoscCalkowita || p.dofinansowanie) && (
            <div className="rounded-xl bg-white border border-[var(--color-ok-border-default)] p-5 lg:p-6 mb-6">
              <dl className="divide-y divide-[var(--color-ok-border-default)]">
                {p.wartoscCalkowita && (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 py-3 first:pt-0">
                    <dt className="text-[var(--color-ok-text-secondary)]">Całkowita wartość projektu</dt>
                    <dd className="font-mono font-semibold text-[var(--color-ok-text-primary)]">{p.wartoscCalkowita}</dd>
                  </div>
                )}
                {p.dofinansowanie && (
                  <div className="py-3 last:pb-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <dt className="text-[var(--color-ok-text-secondary)]">Wysokość dofinansowania</dt>
                      <dd className="font-mono font-semibold text-[var(--color-ok-primary)]">{p.dofinansowanie}</dd>
                    </div>
                    {(p.srodkiEuropejskie || p.wspolfinansowanieBp) && (
                      <div className="mt-3 pl-4 border-l-2 border-[var(--color-ok-border-default)] space-y-2">
                        {p.srodkiEuropejskie && (
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-1 text-sm">
                            <dt className="text-[var(--color-ok-text-secondary)]">w tym środki europejskie</dt>
                            <dd className="font-mono text-[var(--color-ok-text-secondary)]">{p.srodkiEuropejskie}</dd>
                          </div>
                        )}
                        {p.wspolfinansowanieBp && (
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-1 text-sm">
                            <dt className="text-[var(--color-ok-text-secondary)]">współfinansowanie z budżetu państwa</dt>
                            <dd className="font-mono text-[var(--color-ok-text-secondary)]">{p.wspolfinansowanieBp}</dd>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </dl>
            </div>
          )}

          {p.formula && (
            <p className="flex items-center justify-center gap-2 text-center text-sm font-semibold text-[var(--color-ok-text-primary)]">
              <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full bg-[var(--color-ok-primary)]" />
              {p.formula}
            </p>
          )}

          {!hasStructured && p.tekst && (
            <p className="text-sm lg:text-base leading-relaxed text-[var(--color-ok-text-secondary)] whitespace-pre-line">
              {p.tekst}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
