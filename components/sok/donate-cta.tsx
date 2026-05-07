import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { KrsClickToCopy } from './krs-click-to-copy'
import { AnimatedSection } from './animated-section'

export function DonateCTA() {
  return (
    <section className="relative bg-[var(--color-ok-bg-tertiary)] py-16 lg:py-24 overflow-hidden" aria-labelledby="donate-heading">
      <span aria-hidden="true" className="blob-1 -top-20 left-10 w-96 h-96 bg-[var(--color-ok-gold-soft)]" />
      <span aria-hidden="true" className="blob-2 -bottom-32 -right-20 w-[500px] h-[500px] bg-[var(--color-ok-primary)]" />
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <AnimatedSection animation="fade-up">
          <h2 id="donate-heading" className="font-headline text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Twoje wsparcie zmienia życia
          </h2>
        </AnimatedSection>
        <AnimatedSection animation="fade-up" delay={150}>
          <p className="text-lg text-[var(--color-ok-text-secondary)] max-w-2xl mx-auto mb-8 leading-relaxed">
            Status OPP pozwala Ci przekazać 1% podatku do Stowarzyszenia Otwarte Kaszuby.
            Każda złotówka trafia na cele statutowe.
          </p>
        </AnimatedSection>
        <AnimatedSection animation="zoom-in" delay={300}>
          <div className="max-w-md mx-auto mb-8">
            <KrsClickToCopy />
          </div>
        </AnimatedSection>
        <AnimatedSection animation="fade-up" delay={450}>
          <Link
            href="/wesprzyj"
            className="btn-shine group inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-ok-primary)] text-white rounded-md font-medium hover:bg-[var(--color-ok-primary-hover)] hover:scale-[1.03] transition-all"
          >
            Pełne informacje o wsparciu
            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  )
}
