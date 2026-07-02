import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ExternalLink, Quote, MapPin, Phone, Mail, Facebook, Instagram } from 'lucide-react'
import { cn } from '@/lib/utils'
import { linkUrl } from '@/lib/storyblok/client'
import { getStories, getStory } from '@/lib/storyblok/client'
import type {
  AnyBlok, RichText, RichTextNode, StoryblokAsset, ProjektContent, AktualnoscContent, CzlonekZarzaduContent
} from '@/lib/storyblok/types'
import { StatsCounter } from '@/components/sok/stats-counter'
import { ProjectTimeline, HistoryTimeline } from '@/components/sok/timeline-event'
import { KaszubskiDivider } from '@/components/sok/kaszubski-divider'
import { KrsClickToCopy } from '@/components/sok/krs-click-to-copy'
import { BoardMemberCard } from '@/components/sok/board-member-card'
import { AnimatedSection } from '@/components/sok/animated-section'
import { PayPalLogo, FaniManiLogo, PatroniteLogo } from '@/components/sok/donation-logos'

const ASSET_BASE = 'https://a.storyblok.com'

function assetUrl(asset?: StoryblokAsset | string | null, w = 1600): string {
  if (!asset) return ''
  const filename = typeof asset === 'string' ? asset : asset.filename
  if (!filename) return ''
  if (filename.includes('/m/')) return filename
  return `${filename}/m/${w}x0`
}

function isStoryblokImage(filename: string) {
  return filename.startsWith(ASSET_BASE) || filename.startsWith('//a.storyblok.com')
}

// =================== RICH TEXT RENDERER ===================
function renderRichTextNode(node: RichTextNode, key: number): React.ReactNode {
  if (node.type === 'text') {
    let content: React.ReactNode = node.text || ''
    for (const mark of node.marks || []) {
      if (mark.type === 'bold') content = <strong key={`b${key}`}>{content}</strong>
      else if (mark.type === 'italic') content = <em key={`i${key}`}>{content}</em>
      else if (mark.type === 'underline') content = <u key={`u${key}`}>{content}</u>
      else if (mark.type === 'strike') content = <s key={`s${key}`}>{content}</s>
      else if (mark.type === 'link') {
        const href = (mark.attrs?.href as string) || '#'
        const target = mark.attrs?.target as string | undefined
        content = (
          <a key={`l${key}`} href={href} target={target} rel={target === '_blank' ? 'noopener noreferrer' : undefined} className="text-[var(--color-ok-primary)] hover:underline">
            {content}
          </a>
        )
      }
    }
    return content
  }
  const children = (node.content || []).map((c, i) => renderRichTextNode(c, i))
  if (node.type === 'paragraph') return <p key={key} className="mb-5 leading-relaxed">{children}</p>
  if (node.type === 'heading') {
    const lvl = (node.attrs?.level as number) || 2
    const cls = 'font-headline font-bold mt-8 mb-4 ' + (lvl === 2 ? 'text-3xl' : lvl === 3 ? 'text-2xl' : 'text-xl')
    if (lvl === 2) return <h2 key={key} className={cls}>{children}</h2>
    if (lvl === 3) return <h3 key={key} className={cls}>{children}</h3>
    return <h4 key={key} className={cls}>{children}</h4>
  }
  if (node.type === 'bullet_list') return <ul key={key} className="list-disc list-inside mb-5 space-y-2">{children}</ul>
  if (node.type === 'ordered_list') return <ol key={key} className="list-decimal list-inside mb-5 space-y-2">{children}</ol>
  if (node.type === 'list_item') return <li key={key}>{children}</li>
  if (node.type === 'blockquote') return <blockquote key={key} className="border-l-4 border-[var(--color-ok-gold)] pl-6 italic my-6 text-[var(--color-ok-text-secondary)]">{children}</blockquote>
  if (node.type === 'hard_break') return <br key={key} />
  return <span key={key}>{children}</span>
}

export function RichTextRenderer({ doc, className }: { doc: RichText | null | undefined; className?: string }) {
  if (!doc?.content) return null
  return <div className={cn('prose-text', className)}>{doc.content.map((n, i) => renderRichTextNode(n, i))}</div>
}

// =================== BLOCK RENDERERS ===================

function ButtonBlock({ b }: { b: any }) {
  const url = linkUrl(b.link)
  const isExternal = url.startsWith('http')
  const cls = b.wariant === 'outline'
    ? 'border-2 border-[var(--color-ok-primary)] text-[var(--color-ok-primary)] hover:bg-[var(--color-ok-primary-50)]'
    : b.wariant === 'link'
    ? 'text-[var(--color-ok-primary)] hover:underline'
    : 'bg-[var(--color-ok-primary)] text-white hover:bg-[var(--color-ok-primary-hover)]'
  const isBtn = b.wariant !== 'link'
  return (
    <Link href={url} target={isExternal ? '_blank' : undefined} rel={isExternal ? 'noopener noreferrer' : undefined}
      className={cn('inline-flex items-center justify-center gap-2 font-medium rounded-md transition-all', isBtn && 'px-6 py-3.5 hover:scale-[1.02]', cls)}>
      {b.etykieta}
      {b.ikona !== false && <ArrowRight className="size-4" />}
    </Link>
  )
}

function HeroBlock({ b }: { b: any }) {
  // Compact variant · breadcrumb + h1 + optional badge + subtitle (o-nas, wesprzyj, kontakt)
  if (b.wariant === 'compact') {
    const badgeColorCls = b.badge_kolor === 'primary'
      ? 'bg-[var(--color-ok-primary)] text-white'
      : 'bg-[var(--color-ok-gold)] text-white'
    return (
      <section className="relative bg-[var(--color-ok-bg-secondary)] py-16 lg:py-20 overflow-hidden">
        <span aria-hidden="true" className="blob-2 top-10 -right-20 w-96 h-96 bg-[var(--color-ok-gold-soft)]" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {b.breadcrumb_current && (
            <nav aria-label="breadcrumb" className="text-sm text-[var(--color-ok-text-secondary)] mb-4 animate-fade-in-up">
              <Link href="/" className="link-underline hover:text-[var(--color-ok-primary)]">Strona główna</Link>
              <span aria-hidden="true" className="mx-2">›</span>
              <span aria-current="page">{b.breadcrumb_current}</span>
            </nav>
          )}
          <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            {b.naglowek}
          </h1>
          {b.badge_tekst && (
            <span className={cn('inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-6 animate-fade-in-up', badgeColorCls)} style={{ animationDelay: '250ms' }}>
              {b.badge_tekst}
            </span>
          )}
          {b.podtytul && (
            <p className="text-lg text-[var(--color-ok-text-secondary)] leading-relaxed animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              {b.podtytul}
            </p>
          )}
        </div>
      </section>
    )
  }
  // Big variant · full-width bg image + blobs + big H1 + CTAs (homepage)
  const bg = assetUrl(b.tlo_zdjecie, 2000) || '/images/klodno-kaszuby.jpg'
  const bgAlt = b.tlo_alt || 'Krajobraz Kaszub'
  return (
    <section className="relative bg-[var(--color-ok-bg-secondary)] overflow-hidden">
      {bg && (
        <div className="absolute inset-0 z-0">
          <div className={cn('absolute inset-0', b.animacja !== false && 'animate-ken-burns')}>
            <Image src={bg} alt={bgAlt} fill sizes="100vw" className="object-cover opacity-30" priority />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-ok-bg-secondary)] via-[var(--color-ok-bg-secondary)]/80 to-transparent" />
        </div>
      )}
      <span aria-hidden="true" className="blob-1 top-10 -left-20 w-96 h-96 bg-[var(--color-ok-primary)]" />
      <span aria-hidden="true" className="blob-2 bottom-0 right-10 w-[500px] h-[500px] bg-[var(--color-ok-gold-soft)]" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="max-w-4xl">
          <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] mb-6 animate-fade-in-up">
            {b.naglowek}
          </h1>
          {b.podtytul && (
            <p className="text-lg lg:text-xl text-[var(--color-ok-text-secondary)] max-w-2xl leading-relaxed mb-8 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              {b.podtytul}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
            {b.cta_primary_label && b.cta_primary_link && (
              <ButtonBlock b={{ etykieta: b.cta_primary_label, link: b.cta_primary_link, wariant: 'primary', ikona: true }} />
            )}
            {b.cta_secondary_label && b.cta_secondary_link && (
              <ButtonBlock b={{ etykieta: b.cta_secondary_label, link: b.cta_secondary_link, wariant: 'outline', ikona: false }} />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// =========== NEW BLOCKS · full parity vs pre-storyblok-backup ===========

function ValuesChipsBlock({ b }: { b: any }) {
  const values = String(b.wartosci || '').split(',').map((v: string) => v.trim()).filter(Boolean)
  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
      <AnimatedSection animation="fade-up">
        {b.tytul && <h2 className="font-headline text-3xl md:text-4xl font-bold mb-6">{b.tytul}</h2>}
      </AnimatedSection>
      <div className="flex flex-wrap gap-3">
        {values.map((v, idx) => (
          <AnimatedSection key={v} animation="zoom-in" delay={idx * 60}>
            <span className="inline-block px-4 py-2 bg-[var(--color-ok-bg-tertiary)] text-[var(--color-ok-primary)] rounded-full text-sm font-medium border border-[var(--color-ok-border-default)] hover:scale-110 hover:bg-[var(--color-ok-primary-50)] transition-all cursor-default">
              {v}
            </span>
          </AnimatedSection>
        ))}
      </div>
    </section>
  )
}

function BentoGalleryBlock({ b }: { b: any }) {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <AnimatedSection animation="fade-up">
        {b.tytul && <h2 className="font-headline text-3xl md:text-4xl font-bold mb-3">{b.tytul}</h2>}
        {b.opis && <p className="text-[var(--color-ok-text-secondary)] mb-10 max-w-2xl">{b.opis}</p>}
      </AnimatedSection>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        {b.obraz_glowny_url && (
          <AnimatedSection animation="fade-up" delay={0} className="md:col-span-2 md:row-span-2">
            <div className="relative aspect-[4/3] md:aspect-auto md:h-full rounded-2xl overflow-hidden group">
              <Image src={b.obraz_glowny_url} alt={b.obraz_glowny_alt || ''} fill sizes="(max-width: 768px) 100vw, 66vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                {b.obraz_glowny_kategoria && <p className="text-sm font-mono uppercase tracking-wider opacity-90 mb-1">{b.obraz_glowny_kategoria}</p>}
                {b.obraz_glowny_tytul && <p className="font-headline text-xl lg:text-2xl font-semibold">{b.obraz_glowny_tytul}</p>}
              </div>
            </div>
          </AnimatedSection>
        )}
        {b.obraz_2_url && (
          <AnimatedSection animation="fade-up" delay={150}>
            <div className="relative aspect-square rounded-2xl overflow-hidden group">
              <Image src={b.obraz_2_url} alt={b.obraz_2_alt || ''} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                {b.obraz_2_tytul && <p className="font-headline text-base font-semibold">{b.obraz_2_tytul}</p>}
              </div>
            </div>
          </AnimatedSection>
        )}
        {b.obraz_3_url && (
          <AnimatedSection animation="fade-up" delay={300}>
            <div className="relative aspect-square rounded-2xl overflow-hidden group">
              <Image src={b.obraz_3_url} alt={b.obraz_3_alt || ''} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                {b.obraz_3_kategoria && <p className="font-mono text-xs uppercase tracking-wider opacity-90">{b.obraz_3_kategoria}</p>}
                {b.obraz_3_tytul && <p className="font-headline text-base font-semibold">{b.obraz_3_tytul}</p>}
              </div>
            </div>
          </AnimatedSection>
        )}
      </div>
    </section>
  )
}

function HistoriaTimelineBlock({ b }: { b: any }) {
  const events = (b.wydarzenia || []).map((e: any) => ({ year: parseInt(e.rok, 10) || 0, title: e.tytul, description: e.opis }))
  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
      {b.tytul && (
        <AnimatedSection animation="fade-up">
          <h2 className="font-headline text-3xl md:text-4xl font-bold mb-10">{b.tytul}</h2>
        </AnimatedSection>
      )}
      <AnimatedSection animation="fade-up" delay={150}>
        <HistoryTimeline events={events} />
      </AnimatedSection>
    </section>
  )
}

function AsideReprezentacjaBlock({ b }: { b: any }) {
  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-8">
      <aside className="bg-[var(--color-ok-bg-tertiary)] border-l-4 border-[var(--color-ok-gold)] p-6 rounded-r-md">
        {b.tytul && <h3 className="font-semibold mb-2 text-[var(--color-ok-text-primary)]">{b.tytul}</h3>}
        {b.tresc && <p className="text-[var(--color-ok-text-secondary)] text-sm leading-relaxed">{b.tresc}</p>}
      </aside>
    </section>
  )
}

function PartnerzyGroupedBlock({ b }: { b: any }) {
  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
      {b.tytul && <h2 className="font-headline text-3xl md:text-4xl font-bold mb-10">{b.tytul}</h2>}
      <div className="space-y-8">
        {(b.grupy || []).map((g: any) => (
          <div key={g._uid}>
            {g.etykieta && <h3 className="font-headline text-xl font-semibold mb-4">{g.etykieta}</h3>}
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(g.partnerzy || []).map((p: any) => (
                <li key={p._uid}>
                  {p.url ? (
                    <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-[var(--color-ok-primary)] hover:underline">
                      {p.nazwa}
                    </a>
                  ) : (
                    <span className="text-[var(--color-ok-text-secondary)]">{p.nazwa}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

function DaneRejestroweBlock({ b }: { b: any }) {
  if (b.wariant === 'list') {
    return (
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-16">
        <div>
          {b.tytul && <h2 className="font-headline text-2xl font-bold mb-6">{b.tytul}</h2>}
          <dl className="space-y-3 mb-8 max-w-md">
            {b.krs && <div className="flex justify-between gap-4 py-2 border-b border-[var(--color-ok-border-default)]"><dt className="text-[var(--color-ok-text-secondary)]">KRS</dt><dd className="font-mono font-semibold">{b.krs}</dd></div>}
            {b.nip && <div className="flex justify-between gap-4 py-2 border-b border-[var(--color-ok-border-default)]"><dt className="text-[var(--color-ok-text-secondary)]">NIP</dt><dd className="font-mono font-semibold">{b.nip}</dd></div>}
            {b.regon && <div className="flex justify-between gap-4 py-2 border-b border-[var(--color-ok-border-default)]"><dt className="text-[var(--color-ok-text-secondary)]">REGON</dt><dd className="font-mono font-semibold">{b.regon}</dd></div>}
            {b.forma_prawna && <div className="flex justify-between gap-4 py-2 border-b border-[var(--color-ok-border-default)]"><dt className="text-[var(--color-ok-text-secondary)]">Forma prawna</dt><dd className="text-right">{b.forma_prawna}</dd></div>}
            {b.status_opp !== false && <div className="flex justify-between gap-4 py-2 border-b border-[var(--color-ok-border-default)]"><dt className="text-[var(--color-ok-text-secondary)]">Status</dt><dd className="text-right text-[var(--color-ok-success)] font-semibold">OPP</dd></div>}
          </dl>
        </div>
      </section>
    )
  }
  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 mb-16">
      <div className="bg-[var(--color-ok-bg-tertiary)] rounded-xl p-8">
        {b.tytul && <h2 className="font-headline text-2xl font-bold mb-4">{b.tytul}</h2>}
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          {b.krs && <div><dt className="text-[var(--color-ok-text-tertiary)] uppercase text-xs tracking-wider">KRS</dt><dd className="font-mono text-base">{b.krs}</dd></div>}
          {b.nip && <div><dt className="text-[var(--color-ok-text-tertiary)] uppercase text-xs tracking-wider">NIP</dt><dd className="font-mono text-base">{b.nip}</dd></div>}
          {b.regon && <div><dt className="text-[var(--color-ok-text-tertiary)] uppercase text-xs tracking-wider">REGON</dt><dd className="font-mono text-base">{b.regon}</dd></div>}
          {b.data_rejestracji && <div><dt className="text-[var(--color-ok-text-tertiary)] uppercase text-xs tracking-wider">Data rejestracji</dt><dd className="font-mono text-base">{b.data_rejestracji}</dd></div>}
          {b.adres_pelny && <div className="sm:col-span-2"><dt className="text-[var(--color-ok-text-tertiary)] uppercase text-xs tracking-wider">Adres siedziby</dt><dd>{b.adres_pelny}</dd></div>}
          {b.forma_prawna && <div className="sm:col-span-2"><dt className="text-[var(--color-ok-text-tertiary)] uppercase text-xs tracking-wider">Forma prawna</dt><dd>{b.forma_prawna}</dd></div>}
        </dl>
      </div>
    </section>
  )
}

function Karta1PitBlock({ b }: { b: any }) {
  const kroki = String(b.instrukcja_kroki || '').split('\n').map(s => s.trim()).filter(Boolean)
  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-[var(--color-ok-bg-tertiary)] border-2 border-[var(--color-ok-gold)] rounded-2xl p-8 lg:p-10">
        <div className="flex flex-wrap gap-2 mb-4">
          {b.badge_1 && <span className="inline-block bg-[var(--color-ok-gold)] text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">{b.badge_1}</span>}
          {b.badge_2 && <span className="inline-block bg-[var(--color-ok-success-bg)] text-[var(--color-ok-success)] px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">{b.badge_2}</span>}
        </div>
        {b.tytul && <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4">{b.tytul}</h2>}
        {b.opis && <p className="text-[var(--color-ok-text-secondary)] mb-6 leading-relaxed">{b.opis}</p>}
        {b.krs && (
          <div className="max-w-lg">
            <KrsClickToCopy krs={b.krs} />
          </div>
        )}
        {kroki.length > 0 && b.instrukcja_summary && (
          <details className="mt-6 group">
            <summary className="cursor-pointer text-[var(--color-ok-primary)] font-medium hover:underline list-none flex items-center gap-2">
              <ArrowRight className="size-4 group-open:rotate-90 transition-transform" />
              {b.instrukcja_summary}
            </summary>
            <ol className="mt-4 ml-6 list-decimal space-y-3 text-[var(--color-ok-text-secondary)]">
              {kroki.map((k, i) => <li key={i}>{k}</li>)}
            </ol>
          </details>
        )}
      </div>
    </section>
  )
}

function KartyDonacjaBlock({ b }: { b: any }) {
  const renderLogo = (id: string) => {
    if (id === 'patronite') return <PatroniteLogo className="h-9 w-auto" />
    if (id === 'paypal') return <PayPalLogo className="h-7 w-auto" />
    if (id === 'fanimani') return <FaniManiLogo className="h-7 w-auto" />
    return null
  }
  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      {b.tytul && (
        <AnimatedSection animation="fade-up">
          <h2 className="font-headline text-3xl font-bold mb-6">{b.tytul}</h2>
        </AnimatedSection>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(b.karty || []).map((k: any, i: number) => (
          <AnimatedSection key={k._uid} animation="fade-up" delay={i * 120}>
            <a
              href={k.cta_url}
              target="_blank"
              rel="noopener noreferrer"
              className="card-hover group flex flex-col h-full bg-white rounded-xl p-8 border border-[var(--color-ok-border-default)] relative overflow-hidden"
              style={{ borderColor: 'var(--color-ok-border-default)' }}
            >
              {k.badge && (
                <span
                  className="inline-block self-start px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4"
                  style={{ backgroundColor: k.badge_kolor_bg || '#E8E4D9', color: k.badge_kolor_text || '#4A4A4A' }}
                >
                  {k.badge}
                </span>
              )}
              <div className="h-12 mb-4 flex items-center">{renderLogo(k.logo_id)}</div>
              {k.opis && <p className="text-[var(--color-ok-text-secondary)] mb-4 flex-1">{k.opis}</p>}
              <span className="inline-flex items-center gap-2 font-semibold" style={{ color: k.accent_kolor || '#000' }}>
                {k.cta_label} <ExternalLink className="size-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </a>
          </AnimatedSection>
        ))}
      </div>
    </section>
  )
}

function PomocRzeczowaBlock({ b }: { b: any }) {
  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      {b.tytul && <h2 className="font-headline text-3xl font-bold mb-6">{b.tytul}</h2>}
      <div className="bg-[var(--color-ok-bg-tertiary)] rounded-xl p-8 border-l-4 border-[var(--color-ok-primary)]">
        {b.tresc && <p className="text-[var(--color-ok-text-primary)] leading-relaxed mb-6">{b.tresc}</p>}
        {b.cta_label && b.cta_tel_e164 && (
          <a href={`tel:${b.cta_tel_e164}`} className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-ok-primary)] text-white rounded-md font-medium hover:bg-[var(--color-ok-primary-hover)] transition-colors">
            {b.cta_label}: {b.cta_tel}
          </a>
        )}
      </div>
    </section>
  )
}

function InfoPodatkowaBlock({ b }: { b: any }) {
  const tresc = String(b.tresc || '').replace('{KRS}', b.krs || '')
  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 mb-16">
      <div className="bg-[var(--color-ok-info)]/5 border border-[var(--color-ok-info)]/20 rounded-xl p-6 text-sm text-[var(--color-ok-text-secondary)]">
        <p className="leading-relaxed">
          {b.naglowek && <strong className="text-[var(--color-ok-text-primary)]">{b.naglowek}</strong>}{' '}
          {tresc}
        </p>
      </div>
    </section>
  )
}

function KontaktListaBlock({ b }: { b: any }) {
  const renderIcon = (id: string) => {
    if (id === 'map_pin') return <MapPin className="size-5" />
    if (id === 'phone') return <Phone className="size-5" />
    if (id === 'mail') return <Mail className="size-5" />
    return null
  }
  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          {b.col1_tytul && <h2 className="font-headline text-2xl font-bold mb-6">{b.col1_tytul}</h2>}
          <ul className="space-y-5">
            {(b.col1_items || []).map((it: any) => (
              <li key={it._uid} className="flex items-start gap-4">
                <span className="shrink-0 size-10 rounded-full bg-[var(--color-ok-primary-50)] flex items-center justify-center text-[var(--color-ok-primary)]">
                  {renderIcon(it.ikona)}
                </span>
                <div>
                  {it.etykieta && <p className="font-semibold mb-1">{it.etykieta}</p>}
                  {it.link_href ? (
                    <a href={it.link_href} className="text-[var(--color-ok-primary)] hover:underline font-mono text-lg">{it.wartosc}</a>
                  ) : (
                    <p className="text-[var(--color-ok-text-secondary)] leading-relaxed">
                      {it.wartosc}
                      {it.wartosc_2 && <><br />{it.wartosc_2}</>}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
          {b.col1_social_tytul && (
            <>
              <h2 className="font-headline text-2xl font-bold mt-10 mb-4">{b.col1_social_tytul}</h2>
              <div className="flex flex-wrap gap-3">
                {b.col1_facebook_url && (
                  <a href={b.col1_facebook_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--color-ok-bg-tertiary)] text-[var(--color-ok-text-primary)] rounded-md hover:bg-[var(--color-ok-primary-50)] transition-colors">
                    <Facebook className="size-4" /> Facebook
                  </a>
                )}
                {b.col1_instagram_url && (
                  <a href={b.col1_instagram_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--color-ok-bg-tertiary)] text-[var(--color-ok-text-primary)] rounded-md hover:bg-[var(--color-ok-primary-50)] transition-colors">
                    <Instagram className="size-4" /> Instagram
                  </a>
                )}
              </div>
            </>
          )}
        </div>
        {b.col2_tytul && (
          <div>
            <h2 className="font-headline text-2xl font-bold mb-6">{b.col2_tytul}</h2>
            <p className="text-sm text-[var(--color-ok-text-tertiary)]">(patrz sekcja "Dane rejestrowe" poniżej)</p>
          </div>
        )}
      </div>
    </section>
  )
}

function MapaLinkBlock({ b }: { b: any }) {
  const q = encodeURIComponent(b.query || '')
  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-8">
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${q}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-5 py-3 border-2 border-[var(--color-ok-primary)] text-[var(--color-ok-primary)] rounded-md font-medium hover:bg-[var(--color-ok-primary-50)] transition-colors"
      >
        <MapPin className="size-4" /> {b.label || 'Otwórz w Google Maps'}
      </a>
    </section>
  )
}

function TextBlock({ b }: { b: any }) {
  const w = b.szerokosc === 'szeroka' ? 'max-w-7xl' : 'max-w-3xl'
  return (
    <section className={cn('mx-auto px-4 sm:px-6 lg:px-8 py-8', w)}>
      <AnimatedSection animation="fade-up">
        <RichTextRenderer doc={b.tresc} className="text-base lg:text-lg text-[var(--color-ok-text-primary)]" />
      </AnimatedSection>
    </section>
  )
}

function ImageBlock({ b }: { b: any }) {
  if (!b.obraz?.filename) return null
  const url = assetUrl(b.obraz, 1600)
  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      <AnimatedSection animation="fade-up">
        <figure>
          <div className="relative aspect-video rounded-xl overflow-hidden">
            <Image src={url} alt={b.alt || ''} fill sizes="(max-width: 1024px) 100vw, 1024px" className="object-cover" />
          </div>
          {b.podpis && <figcaption className="text-sm text-[var(--color-ok-text-tertiary)] text-center mt-3">{b.podpis}</figcaption>}
        </figure>
      </AnimatedSection>
    </section>
  )
}

function QuoteBlock({ b }: { b: any }) {
  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      <AnimatedSection animation="fade-up">
        <blockquote className="relative pl-12 py-4">
          <Quote className="absolute left-0 top-2 size-8 text-[var(--color-ok-gold)] opacity-60" aria-hidden="true" />
          <p className="font-headline text-xl lg:text-2xl text-[var(--color-ok-text-primary)] leading-relaxed mb-3">{b.tekst}</p>
          {b.autor && (
            <footer className="text-sm text-[var(--color-ok-text-secondary)]">
              — <cite className="not-italic font-semibold">{b.autor}</cite>
              {b.rola && <span className="text-[var(--color-ok-text-tertiary)]">, {b.rola}</span>}
            </footer>
          )}
        </blockquote>
      </AnimatedSection>
    </section>
  )
}

function CardBlock({ b }: { b: any }) {
  const url = linkUrl(b.link)
  const bgUrl = assetUrl(b.zdjecie, 800)
  const badgeCls = b.badge_kolor === 'primary' ? 'bg-[var(--color-ok-primary)] text-white'
    : b.badge_kolor === 'neutral' ? 'bg-[var(--color-ok-text-secondary)] text-white'
    : 'bg-[var(--color-ok-gold)] text-white'
  const content = (
    <article className="card-hover group flex flex-col h-full bg-white rounded-xl overflow-hidden border border-[var(--color-ok-border-default)] hover:border-[var(--color-ok-primary)]">
      {bgUrl && (
        <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-ok-bg-tertiary)]">
          <Image src={bgUrl} alt={b.tytul} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
          {b.badge && <span className={cn('absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full', badgeCls)}>{b.badge}</span>}
        </div>
      )}
      <div className="flex flex-col flex-1 p-6">
        {!bgUrl && b.badge && <span className={cn('inline-flex self-start text-xs font-semibold px-2.5 py-1 rounded-full mb-4', badgeCls)}>{b.badge}</span>}
        <h3 className="font-headline text-xl lg:text-2xl font-bold leading-tight mb-3 group-hover:text-[var(--color-ok-primary)] transition-colors">{b.tytul}</h3>
        {b.opis && <p className="text-[var(--color-ok-text-secondary)] text-sm leading-relaxed flex-1">{b.opis}</p>}
        {b.link && <span className="mt-4 inline-flex items-center gap-2 text-[var(--color-ok-primary)] font-medium text-sm">Zobacz więcej <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" /></span>}
      </div>
    </article>
  )
  return url && url !== '#' ? <Link href={url}>{content}</Link> : content
}

function CardsGridBlock({ b }: { b: any }) {
  const colsCls = b.kolumny === '2' ? 'md:grid-cols-2' : b.kolumny === '4' ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-3'
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      {(b.tytul || b.opis) && (
        <AnimatedSection animation="fade-up">
          <div className="mb-10">
            {b.tytul && <h2 className="font-headline text-3xl md:text-4xl lg:text-5xl font-bold mb-3">{b.tytul}</h2>}
            {b.opis && <p className="text-[var(--color-ok-text-secondary)] text-lg max-w-2xl">{b.opis}</p>}
          </div>
        </AnimatedSection>
      )}
      <div className={cn('grid grid-cols-1 gap-6 lg:gap-8', colsCls)}>
        {(b.karty || []).map((k: any, i: number) => (
          <AnimatedSection key={k._uid} animation="fade-up" delay={i * 80}><CardBlock b={k} /></AnimatedSection>
        ))}
      </div>
    </section>
  )
}

function StatsBlock({ b }: { b: any }) {
  const stats = (b.statystyki || []).map((s: any) => ({
    value: parseInt(s.wartosc, 10) || 0,
    suffix: s.suffix || '',
    label: s.etykieta || '',
  }))
  const srHeading = b.tytul_sr_only || 'Nasze osiągnięcia'
  return (
    <AnimatedSection animation="fade-up">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16" aria-labelledby="stats-heading">
        <h2 id="stats-heading" className={b.tytul ? 'font-headline text-2xl md:text-3xl font-bold mb-8 text-center' : 'sr-only'}>
          {b.tytul || srHeading}
        </h2>
        <StatsCounter stats={stats} />
      </section>
    </AnimatedSection>
  )
}

function TimelineBlock({ b }: { b: any }) {
  const events = (b.wydarzenia || []).map((e: any) => ({ date: e.data, title: e.tytul, description: e.opis }))
  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      {b.tytul && <AnimatedSection animation="fade-up"><h2 className="font-headline text-3xl md:text-4xl font-bold mb-10">{b.tytul}</h2></AnimatedSection>}
      <AnimatedSection animation="fade-up" delay={150}><ProjectTimeline events={events} /></AnimatedSection>
    </section>
  )
}

function PartnersBlock({ b }: { b: any }) {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <AnimatedSection animation="fade-up">
        {b.tytul && <h2 className="text-center text-sm font-semibold uppercase tracking-wider text-[var(--color-ok-text-secondary)] mb-8">{b.tytul}</h2>}
        <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-6">
          {(b.partnerzy || []).map((p: any, i: number) => (
            <AnimatedSection key={p._uid} animation="zoom-in" delay={i * 60}>
              <span className="text-[var(--color-ok-text-tertiary)] text-sm font-medium">
                {p.url?.url || p.url?.cached_url ? (
                  <a href={linkUrl(p.url)} target="_blank" rel="noopener noreferrer" className="link-underline hover:text-[var(--color-ok-primary)] transition-colors">{p.nazwa}</a>
                ) : p.nazwa}
              </span>
            </AnimatedSection>
          ))}
        </div>
      </AnimatedSection>
    </section>
  )
}

function DonateCtaBlock({ b }: { b: any }) {
  return (
    <section className="relative bg-[var(--color-ok-bg-tertiary)] py-16 lg:py-24 overflow-hidden">
      <span aria-hidden="true" className="blob-1 -top-20 left-10 w-96 h-96 bg-[var(--color-ok-gold-soft)]" />
      <span aria-hidden="true" className="blob-2 -bottom-32 -right-20 w-[500px] h-[500px] bg-[var(--color-ok-primary)]" />
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <AnimatedSection animation="fade-up">
          <h2 className="font-headline text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{b.tytul || 'Twoje wsparcie zmienia życia'}</h2>
        </AnimatedSection>
        {b.opis && <AnimatedSection animation="fade-up" delay={150}><p className="text-lg text-[var(--color-ok-text-secondary)] max-w-2xl mx-auto mb-8 leading-relaxed">{b.opis}</p></AnimatedSection>}
        {b.pokaz_krs !== false && <AnimatedSection animation="zoom-in" delay={300}><div className="max-w-md mx-auto mb-8"><KrsClickToCopy /></div></AnimatedSection>}
        {b.cta_label && b.cta_link && (
          <AnimatedSection animation="fade-up" delay={450}>
            <ButtonBlock b={{ etykieta: b.cta_label, link: b.cta_link, wariant: 'primary', ikona: true }} />
          </AnimatedSection>
        )}
      </div>
    </section>
  )
}

function GalleryBlock({ b }: { b: any }) {
  const layout = b.uklad || 'grid_3'
  if (!b.zdjecia?.length) return null
  if (layout === 'bento' && b.zdjecia.length >= 3) {
    return (
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {b.tytul && <AnimatedSection animation="fade-up"><h2 className="font-headline text-3xl md:text-4xl font-bold mb-10">{b.tytul}</h2></AnimatedSection>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          <AnimatedSection animation="fade-up" delay={0} className="md:col-span-2 md:row-span-2">
            <div className="relative aspect-[4/3] md:aspect-auto md:h-full rounded-2xl overflow-hidden">
              <Image src={assetUrl(b.zdjecia[0], 1600)} alt={b.zdjecia[0].alt || ''} fill sizes="66vw" className="object-cover hover:scale-105 transition-transform duration-700" />
            </div>
          </AnimatedSection>
          {b.zdjecia.slice(1, 3).map((z: StoryblokAsset, i: number) => (
            <AnimatedSection key={i} animation="fade-up" delay={150 * (i + 1)}>
              <div className="relative aspect-square rounded-2xl overflow-hidden">
                <Image src={assetUrl(z, 800)} alt={z.alt || ''} fill sizes="33vw" className="object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>
    )
  }
  const cols = layout === 'grid_2' ? 'md:grid-cols-2' : layout === 'grid_4' ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-3'
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      {b.tytul && <AnimatedSection animation="fade-up"><h2 className="font-headline text-3xl md:text-4xl font-bold mb-10">{b.tytul}</h2></AnimatedSection>}
      <div className={cn('grid grid-cols-1 gap-4', cols)}>
        {b.zdjecia.map((z: StoryblokAsset, i: number) => (
          <AnimatedSection key={i} animation="fade-up" delay={i * 80}>
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
              <Image src={assetUrl(z, 800)} alt={z.alt || ''} fill sizes="33vw" className="object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          </AnimatedSection>
        ))}
      </div>
    </section>
  )
}

async function ListaProjektowBlock({ b }: { b: any }) {
  const limit = parseInt(b.limit, 10) || 3
  const { stories } = await getStories<ProjektContent>({
    startsWith: 'projekty/', contentType: 'projekt',
    perPage: limit, sortBy: 'content.data_startu:desc',
  })
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
      <AnimatedSection animation="fade-up">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            {b.tytul && <h2 className="font-headline text-3xl md:text-4xl lg:text-5xl font-bold mb-3">{b.tytul}</h2>}
            {b.opis && <p className="text-[var(--color-ok-text-secondary)] text-lg max-w-2xl">{b.opis}</p>}
          </div>
          {b.link_wszystkie_label && (
            <Link href="/projekty" className="link-underline inline-flex items-center gap-2 text-[var(--color-ok-primary)] font-medium">
              {b.link_wszystkie_label} <ArrowRight className="size-4" />
            </Link>
          )}
        </div>
      </AnimatedSection>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {stories.map((s, i) => (
          <AnimatedSection key={s.id} animation="fade-up" delay={i * 120}>
            <Link href={`/${s.full_slug}`} className="card-hover group flex flex-col h-full bg-white rounded-xl overflow-hidden border border-[var(--color-ok-border-default)] hover:border-[var(--color-ok-primary)]">
              {s.content.zdjecie_hero?.filename && (
                <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-ok-bg-tertiary)]">
                  <Image src={assetUrl(s.content.zdjecie_hero, 800)} alt={s.content.tytul} fill sizes="33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-3 left-3 inline-flex text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--color-ok-gold)] text-white">{s.content.status?.toUpperCase()}</span>
                </div>
              )}
              <div className="flex flex-col flex-1 p-6">
                {!s.content.zdjecie_hero?.filename && <span className="inline-flex self-start text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--color-ok-gold)] text-white mb-4">{s.content.status?.toUpperCase()}</span>}
                <h3 className="font-headline text-xl lg:text-2xl font-bold leading-tight mb-3 group-hover:text-[var(--color-ok-primary)] transition-colors">{s.content.tytul}</h3>
                <p className="text-[var(--color-ok-text-secondary)] text-sm leading-relaxed flex-1">{s.content.krotki_opis}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-[var(--color-ok-primary)] font-medium text-sm">Zobacz więcej <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" /></span>
              </div>
            </Link>
          </AnimatedSection>
        ))}
      </div>
    </section>
  )
}

async function ListaAktualnosciBlock({ b }: { b: any }) {
  const limit = parseInt(b.limit, 10) || 3
  const { stories } = await getStories<AktualnoscContent>({
    startsWith: 'aktualnosci/', contentType: 'aktualnosc',
    perPage: limit, sortBy: 'content.data_publikacji:desc',
  })
  const fmt = (d: string) => new Date(d).toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' })
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
      <AnimatedSection animation="fade-up">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          {b.tytul && <h2 className="font-headline text-3xl md:text-4xl lg:text-5xl font-bold">{b.tytul}</h2>}
          <Link href="/aktualnosci" className="link-underline inline-flex items-center gap-2 text-[var(--color-ok-primary)] font-medium">
            Wszystkie aktualności <ArrowRight className="size-4" />
          </Link>
        </div>
      </AnimatedSection>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {stories.map((s, i) => (
          <AnimatedSection key={s.id} animation="fade-up" delay={i * 120}>
            <Link href={`/${s.full_slug}`} className="card-hover group flex flex-col h-full bg-white rounded-xl p-6 border border-[var(--color-ok-border-default)] hover:border-[var(--color-ok-primary)]">
              <time className="text-xs font-mono text-[var(--color-ok-text-tertiary)] uppercase mb-2">{fmt(s.content.data_publikacji)}</time>
              <span className="text-xs font-semibold text-[var(--color-ok-primary)] uppercase mb-3">{s.content.kategoria}</span>
              <h3 className="font-headline text-xl font-semibold mb-3 group-hover:text-[var(--color-ok-primary)] transition-colors leading-tight">{s.content.tytul}</h3>
              <p className="text-sm text-[var(--color-ok-text-secondary)] leading-relaxed flex-1">{s.content.excerpt}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-[var(--color-ok-primary)] text-sm font-medium">Czytaj więcej <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" /></span>
            </Link>
          </AnimatedSection>
        ))}
      </div>
    </section>
  )
}

async function ListaZarzaduBlock({ b }: { b: any }) {
  const { stories } = await getStories<CzlonekZarzaduContent>({
    startsWith: 'zarzad/', contentType: 'czlonek_zarzadu',
    perPage: 25, sortBy: 'content.kolejnosc:asc',
    filterQuery: { 'content.organ': b.organ || 'zarzad' }
  })
  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
      <AnimatedSection animation="fade-up">
        {b.tytul && <h2 className="font-headline text-3xl md:text-4xl font-bold mb-3">{b.tytul}</h2>}
        {b.opis && <p className="text-[var(--color-ok-text-secondary)] mb-10">{b.opis}</p>}
      </AnimatedSection>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stories.map((s, i) => (
          <AnimatedSection key={s.id} animation="fade-up" delay={i * 150}>
            <BoardMemberCard member={{
              firstName: s.content.imie, lastName: s.content.nazwisko,
              position: 'czlonek_zarzadu',
              positionLabel: s.content.funkcja,
              organ: s.content.organ,
              since: s.content.od_kiedy,
              bio: s.content.bio,
            }} />
          </AnimatedSection>
        ))}
      </div>
    </section>
  )
}

// =================== MAIN RENDERER ===================
export async function BlockRenderer({ block }: { block: AnyBlok | any }) {
  switch (block.component) {
    case 'hero_section': return <HeroBlock b={block} />
    case 'tekst_blok': return <TextBlock b={block} />
    case 'zdjecie_blok': return <ImageBlock b={block} />
    case 'cytat_blok': return <QuoteBlock b={block} />
    case 'karta_blok': return <CardBlock b={block} />
    case 'karty_grid': return <CardsGridBlock b={block} />
    case 'statystyki_blok': return <StatsBlock b={block} />
    case 'timeline_blok': return <TimelineBlock b={block} />
    case 'partnerzy_blok': return <PartnersBlock b={block} />
    case 'donate_cta_blok': return <DonateCtaBlock b={block} />
    case 'divider_kaszubski': return <KaszubskiDivider variant={block.wariant || 'tulipan'} />
    case 'galeria_blok': return <GalleryBlock b={block} />
    case 'lista_projektow': return <ListaProjektowBlock b={block} />
    case 'lista_aktualnosci': return <ListaAktualnosciBlock b={block} />
    case 'lista_zarzadu': return <ListaZarzaduBlock b={block} />
    case 'values_chips_blok': return <ValuesChipsBlock b={block} />
    case 'bento_gallery_blok': return <BentoGalleryBlock b={block} />
    case 'historia_timeline_blok': return <HistoriaTimelineBlock b={block} />
    case 'aside_reprezentacja_blok': return <AsideReprezentacjaBlock b={block} />
    case 'partnerzy_grouped_blok': return <PartnerzyGroupedBlock b={block} />
    case 'dane_rejestrowe_blok': return <DaneRejestroweBlock b={block} />
    case 'karta_1_pit_blok': return <Karta1PitBlock b={block} />
    case 'karty_donacja_blok': return <KartyDonacjaBlock b={block} />
    case 'pomoc_rzeczowa_blok': return <PomocRzeczowaBlock b={block} />
    case 'info_podatkowa_blok': return <InfoPodatkowaBlock b={block} />
    case 'kontakt_lista_blok': return <KontaktListaBlock b={block} />
    case 'mapa_link_blok': return <MapaLinkBlock b={block} />
    case 'przycisk_blok':
      return (
        <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-4">
          <ButtonBlock b={block} />
        </section>
      )
    default:
      console.warn('Unknown Storyblok block:', block.component)
      return null
  }
}

/** Wraps a block element with data-blok-c / data-blok-uid attrs so Visual Editor sees it */
function editableWrap(blok: any) {
  if (!blok?._uid) return {}
  return {
    'data-blok-c': JSON.stringify({ name: blok.component, space: '293294109226994', uid: blok._uid, id: blok._uid }),
    'data-blok-uid': `293294109226994-${blok._uid}`,
  } as any
}

export async function BlocksRenderer({ blocks }: { blocks: AnyBlok[] | undefined }) {
  if (!blocks?.length) return null
  return <>{blocks.map((b: any) => (
    <div key={b._uid} {...editableWrap(b)}>
      <BlockRenderer block={b} />
    </div>
  ))}</>
}
