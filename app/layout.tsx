import type { Metadata } from 'next'
import { Source_Serif_4, Inter, JetBrains_Mono } from 'next/font/google'
import { SITE, SOK, FEATURES } from '@/lib/constants'
import { ngoSchema } from '@/lib/seo/schema'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { StoryblokProvider } from '@/components/storyblok/storyblok-provider'
import { BridgeLoader } from '@/components/storyblok/bridge-loader'
import { draftMode } from 'next/headers'
import './globals.css'

const sourceSerif = Source_Serif_4({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-source-serif',
})

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.name, template: `%s · ${SITE.name}` },
  description: SITE.defaultDescription,
  applicationName: SITE.name,
  authors: [{ name: SOK.legalName, url: SITE.url }],
  creator: SOK.legalName,
  publisher: SOK.legalName,
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    url: SITE.url,
    siteName: SITE.name,
    title: SITE.name,
    description: SITE.defaultDescription,
  },
  twitter: { card: 'summary_large_image', title: SITE.name, description: SITE.defaultDescription },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
  icons: {
    icon: [
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/favicon-192.png',
  },
  manifest: '/manifest.webmanifest',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const dm = await draftMode()
  const isDraft = dm.isEnabled
  return (
    <html lang="pl-PL" className={`${sourceSerif.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <a href="#main" className="skip-link">Pomiń do treści</a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ngoSchema()) }} />
        <StoryblokProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </StoryblokProvider>
        {isDraft && <BridgeLoader />}
        {FEATURES.analytics && process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && (
          <script
            defer
            data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
            src="https://plausible.io/js/script.js"
          />
        )}
      </body>
    </html>
  )
}
