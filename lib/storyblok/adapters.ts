import type { Story } from './client'
import type { ProjektContent, AktualnoscContent, StoryblokAsset } from './types'
import type { Project, News, ProjectStatus, ProjectCategory } from '@/lib/data/types'

const ASSET_BASE = 'https://a.storyblok.com'

function assetUrl(asset?: StoryblokAsset | null): string | undefined {
  if (!asset?.filename) return undefined
  const f = asset.filename
  if (f.startsWith('/') && !f.startsWith('//')) return f
  if (f.startsWith(ASSET_BASE) || f.startsWith('//a.storyblok.com')) return f
  return f
}

/** Convert Storyblok projekt story → old Project shape (used by pages + card) */
export function storyToProject(story: Story<ProjektContent>): Project {
  const c = story.content as any
  const rawStatus = c.status || ''
  const status = (['aktywny', 'zakonczony', 'archiwalny'].includes(rawStatus) ? rawStatus : 'zakonczony') as ProjectStatus
  const rawCategory = c.kategoria || ''
  const category = (['uchodzcy', 'seniorzy', 'kultura', 'edukacja', 'obywatelskie'].includes(rawCategory) ? rawCategory : 'kultura') as ProjectCategory

  // Description: from Storyblok description bloks or fallback to krotki_opis
  let description: string[] = []
  if (Array.isArray(c.description) && c.description.length > 0) {
    for (const blok of c.description as any[]) {
      if (blok.tresc?.content) {
        // Rich text — extract paragraphs
        for (const node of blok.tresc.content) {
          if (node.type === 'paragraph' && node.content) {
            description.push(node.content.map((n: any) => n.text || '').join(''))
          }
        }
      } else if (typeof blok === 'string') {
        description.push(blok)
      }
    }
  }
  if (description.length === 0 && c.krotki_opis) description = [c.krotki_opis]

  return {
    slug: story.slug,
    title: c.tytul || story.name,
    status,
    category,
    startDate: c.data_startu || (story.first_published_at || '').slice(0, 10) || '2020-01-01',
    endDate: c.data_konca || undefined,
    shortDescription: c.krotki_opis || '',
    description,
    heroImage: assetUrl(c.zdjecie_hero),
    stats: Array.isArray(c.stats) ? c.stats.map((s: any) => ({
      value: parseInt(s.wartosc || s.value, 10) || 0,
      suffix: s.suffix || '',
      label: s.etykieta || s.label || '',
    })) : undefined,
    timeline: Array.isArray(c.timeline) ? c.timeline.map((t: any) => ({
      date: t.data || t.date,
      title: t.tytul || t.title,
      description: t.opis || t.description,
    })) : undefined,
    partners: Array.isArray(c.partners) ? c.partners.map((p: any) => p.nazwa || p.name || p).filter(Boolean) : undefined,
    funding: Array.isArray(c.funding) ? c.funding.map((f: any) => ({
      source: f.zrodlo || f.source || '',
      amount: parseFloat(f.kwota || f.amount) || 0,
      year: parseInt(f.rok || f.year, 10) || 0,
      currency: f.waluta || f.currency,
    })) : undefined,
    contact: c.kontakt ? {
      name: c.kontakt.nazwa || c.kontakt.name,
      phone: c.kontakt.telefon || c.kontakt.phone,
      email: c.kontakt.email,
    } : undefined,
  }
}

/** Convert Storyblok aktualnosc story → old News shape */
export function storyToNews(story: Story<AktualnoscContent>): News {
  const c = story.content as any
  // Body from rich text
  let body: string[] = []
  if (c.tresc?.content) {
    for (const node of c.tresc.content as any[]) {
      if (node.type === 'paragraph' && node.content) {
        body.push(node.content.map((n: any) => n.text || '').join(''))
      } else if (node.type === 'heading' && node.content) {
        body.push(node.content.map((n: any) => n.text || '').join(''))
      }
    }
  }
  if (body.length === 0 && c.excerpt) body = [c.excerpt]

  return {
    slug: story.slug,
    title: c.tytul || story.name,
    date: c.data_publikacji || (story.first_published_at || '').slice(0, 10) || '2020-01-01',
    category: c.kategoria || 'wydarzenie',
    excerpt: c.excerpt || '',
    body,
    heroImage: assetUrl(c.zdjecie_hero),
    tags: Array.isArray(c.tags) ? c.tags : undefined,
  }
}
