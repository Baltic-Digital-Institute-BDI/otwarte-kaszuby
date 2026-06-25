/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: '/otwartekaszuby',
  assetPrefix: '/otwartekaszuby',
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: 'otwartekaszuby.pl' },
      { protocol: 'https', hostname: 'a.storyblok.com' },
      { protocol: 'https', hostname: 'img.storyblok.com' },
    ],
  },
  async redirects() {
    return [
      { source: '/category/projekty/:path*', destination: '/projekty', permanent: true },
      { source: '/category/wiadomosci/:path*', destination: '/aktualnosci', permanent: true },
      { source: '/category/bez-kategorii-pl/:path*', destination: '/aktualnosci', permanent: true },
      { source: '/project/:slug', destination: '/projekty/:slug', permanent: true },
      { source: '/ukraina', destination: '/projekty/cwu', permanent: true },
      { source: '/sklep-spoleczny', destination: '/projekty/sklep-spoleczny', permanent: true },
      { source: '/en/home-english', destination: '/', permanent: true },
      { source: '/author/:any*', destination: '/o-nas', permanent: true },
      { source: '/wp-admin/:any*', destination: '/404', permanent: false },
      { source: '/wp-login.php', destination: '/404', permanent: false },
      { source: '/tag/:tag', destination: '/aktualnosci', permanent: true },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // X-Frame-Options REMOVED · superseded by CSP frame-ancestors below
          // (X-Frame-Options doesn't support multi-origin allowlist)
          { key: 'Content-Security-Policy', value: "frame-ancestors 'self' https://app.storyblok.com https://*.storyblok.com" },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        ],
      },
    ]
  },
}
export default nextConfig
