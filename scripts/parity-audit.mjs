#!/usr/bin/env node
// Systematic string-level audit · what's in hardcoded backup vs what renders on live
// Extract all Polish text literals from _hardcoded.tsx and their dependencies
// Then curl live URLs and check each string exists

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO = resolve(__dirname, '..')

// Extract JSX text nodes and specific patterns from source files
function extractStrings(sourcePath) {
  const src = readFileSync(sourcePath, 'utf8')
  const strings = new Set()

  // Match JSX text between tags: >Some text<
  const jsxTextRegex = />([^<>{]+?)</g
  let m
  while ((m = jsxTextRegex.exec(src))) {
    const t = m[1].trim()
    if (t.length > 3 && !/^[{}\s\[\]]+$/.test(t) && !/^\s*$/.test(t) && !/^className=/.test(t)) {
      strings.add(t)
    }
  }

  // Match string literals: 'Something' or "Something"
  const stringLitRegex = /(['"`])([\p{L}][^'"`\n]{5,80})\1/gu
  while ((m = stringLitRegex.exec(src))) {
    const t = m[2].trim()
    // Skip CSS-like, imports, etc
    if (!/^(var\(|@\/|next\/|lucide|react|https?:|\/)/.test(t) &&
        !/^[a-z_]+(-[a-z_]+)*$/.test(t) && // css class-like
        /[ĄąĆćĘęŁłŃńÓóŚśŹźŻż]|\s/.test(t) // Polish chars or spaces
       ) {
      strings.add(t)
    }
  }

  return [...strings]
}

async function fetchLive(url) {
  const r = await fetch(url, { cache: 'no-store' })
  return await r.text()
}

async function auditPage(name, hardcodedFile, liveUrl, extraFiles = []) {
  console.log(`\n========================================`)
  console.log(`AUDYT · ${name}`)
  console.log(`Hardcoded: ${hardcodedFile}`)
  console.log(`Live URL:  ${liveUrl}`)
  console.log(`========================================`)

  const allStrings = new Set()
  extractStrings(resolve(REPO, hardcodedFile)).forEach(s => allStrings.add(s))
  for (const f of extraFiles) {
    extractStrings(resolve(REPO, f)).forEach(s => allStrings.add(s))
  }

  const live = await fetchLive(liveUrl)
  const normalize = (s) => s.replace(/\s+/g, ' ').trim().toLowerCase()
  const liveNorm = normalize(live)
  const missing = []
  const present = []
  for (const s of allStrings) {
    // Filter out CSS class strings and code fragments
    if (/^[a-z-]+\s+[a-z-]+/.test(s) && !/[ĄąĆćĘęŁłŃńÓóŚśŹźŻż]|["'!?,.]/.test(s)) continue
    if (/^\)\s*:/.test(s) || /^const\s|^return\s|^import\s/.test(s)) continue
    const sNorm = normalize(s)
    if (sNorm.length < 5) continue
    if (liveNorm.includes(sNorm)) present.push(s)
    else missing.push(s)
  }

  console.log(`\n✓ Present: ${present.length}`)
  console.log(`✗ MISSING: ${missing.length}\n`)
  if (missing.length) {
    console.log('MISSING STRINGS:')
    missing.slice(0, 40).forEach(s => console.log(`  · ${s.substring(0, 100)}${s.length > 100 ? '...' : ''}`))
    if (missing.length > 40) console.log(`  ...and ${missing.length - 40} more`)
  }
  return { present, missing }
}

;(async () => {
  const results = {}

  results.home = await auditPage(
    'HOMEPAGE (/)',
    'app/_hardcoded.tsx',
    'https://otwarte-kaszuby.vercel.app/otwartekaszuby',
    ['components/sok/donate-cta.tsx']
  )

  results.onas = await auditPage(
    'O NAS (/o-nas)',
    'app/o-nas/_hardcoded.tsx',
    'https://otwarte-kaszuby.vercel.app/otwartekaszuby/o-nas'
  )

  results.wesprzyj = await auditPage(
    'WESPRZYJ (/wesprzyj)',
    'app/wesprzyj/_hardcoded.tsx',
    'https://otwarte-kaszuby.vercel.app/otwartekaszuby/wesprzyj'
  )

  results.kontakt = await auditPage(
    'KONTAKT (/kontakt)',
    'app/kontakt/_hardcoded.tsx',
    'https://otwarte-kaszuby.vercel.app/otwartekaszuby/kontakt'
  )

  console.log('\n\n=== SUMMARY ===')
  for (const [k, v] of Object.entries(results)) {
    console.log(`${k}: ${v.present.length} ok / ${v.missing.length} missing`)
  }
})()
