#!/usr/bin/env node
// Upload wszystkich obrazów z /public/images/ do Storyblok Assets Library
// Ola potem może wybierać/podmieniać je w Visual Editor asset picker

import { readFileSync, readdirSync } from 'fs'
import { join, resolve } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO = resolve(__dirname, '..')
const IMAGES_DIR = join(REPO, 'public', 'images')
const LOGOS_DIR = join(REPO, 'public', 'logos')

const PAT = 'sb_pat_LsgqChDB2hkfa8UOuZLYd4MIt2ERQj-ZpdmfgsB_ihE'
const SPACE_ID = '293294109226994'
const BASE = `https://mapi.storyblok.com/v1/spaces/${SPACE_ID}`

async function api(path, method = 'GET', body = null) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Authorization': PAT, 'Content-Type': 'application/json; charset=utf-8' },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  if (!res.ok) { console.log(`ERR ${res.status}: ${text.substring(0, 400)}`); return null }
  return text ? JSON.parse(text) : null
}

/** Upload single file to Storyblok Assets · S3 signed URL flow */
async function uploadFile(filePath, filename) {
  console.log(`→ ${filename}...`)
  const buffer = readFileSync(filePath)

  // Step 1: Request signed upload URL
  const signedRes = await api('/assets', 'POST', {
    filename,
    size: `${buffer.length}b`,
    content_type: filename.endsWith('.png') ? 'image/png' : filename.endsWith('.svg') ? 'image/svg+xml' : 'image/jpeg',
  })
  if (!signedRes) return null

  // Step 2: POST file to S3 with signed params
  const formData = new FormData()
  for (const [k, v] of Object.entries(signedRes.fields)) {
    formData.append(k, v)
  }
  const blob = new Blob([buffer], { type: signedRes.fields['Content-Type'] || 'image/jpeg' })
  formData.append('file', blob, filename)

  const s3Res = await fetch(signedRes.post_url, { method: 'POST', body: formData })
  if (!s3Res.ok) {
    const err = await s3Res.text()
    console.log(`  S3 ERR ${s3Res.status}: ${err.substring(0, 200)}`)
    return null
  }

  // Step 3: Finalize (register the asset)
  const finalRes = await api(`/assets/${signedRes.id}/finish_upload`, 'GET')
  if (!finalRes) {
    // Fallback — get asset by ID
    const asset = await api(`/assets/${signedRes.id}`)
    console.log(`  ✓ Uploaded id=${signedRes.id} url=${asset?.pretty_url || 'unknown'}`)
    return { id: signedRes.id, filename: asset?.filename }
  }
  console.log(`  ✓ Uploaded id=${signedRes.id} pretty_url=${finalRes.pretty_url || 'unknown'}`)
  return { id: signedRes.id, filename: finalRes.filename || signedRes.pretty_url }
}

const uploaded = {}
for (const f of readdirSync(IMAGES_DIR)) {
  if (!/\.(jpg|jpeg|png)$/i.test(f)) continue
  const filePath = join(IMAGES_DIR, f)
  const r = await uploadFile(filePath, f)
  if (r) uploaded[`/images/${f}`] = r
}

// Upload logos too (patronite.svg)
for (const f of readdirSync(LOGOS_DIR)) {
  if (!/\.(svg|png)$/i.test(f)) continue
  const filePath = join(LOGOS_DIR, f)
  const r = await uploadFile(filePath, f)
  if (r) uploaded[`/logos/${f}`] = r
}

console.log('\n=== UPLOAD MAP ===')
for (const [k, v] of Object.entries(uploaded)) {
  console.log(`  ${k} → ${v.filename}`)
}
console.log('\nSaving map to scripts/asset-upload-map.json')
const { writeFileSync } = await import('fs')
writeFileSync(join(__dirname, 'asset-upload-map.json'), JSON.stringify(uploaded, null, 2))
console.log('Done.')
