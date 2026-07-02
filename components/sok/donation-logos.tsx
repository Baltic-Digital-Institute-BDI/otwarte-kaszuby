// Inline SVG components dla zewnętrznych marek donations
// Dlaczego inline: zero network requests · zero remotePatterns CSP issues · idealnie ostre na każdym DPI

/**
 * PayPal logo · text wordmark (simplified · avoids broken glyph paths)
 * Colors: PayPal Blue #003087 (Pay) + Blue #009CDE (Pal)
 */
export function PayPalLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg" className={className} role="img" aria-label="PayPal">
      <text x="0" y="34" fontFamily="Arial Black, Impact, sans-serif" fontSize="30" fontWeight="900" fill="#003087" fontStyle="italic">
        Pay
      </text>
      <text x="60" y="34" fontFamily="Arial Black, Impact, sans-serif" fontSize="30" fontWeight="900" fill="#009CDE" fontStyle="italic">
        Pal
      </text>
    </svg>
  )
}

/**
 * FaniMani logo · text with brand pink + dark accent
 */
export function FaniManiLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg" className={className} role="img" aria-label="FaniMani.pl">
      <text x="0" y="34" fontFamily="Arial Black, Impact, sans-serif" fontSize="28" fontWeight="900" fill="#E5267C">
        Fani
      </text>
      <text x="62" y="34" fontFamily="Arial Black, Impact, sans-serif" fontSize="28" fontWeight="900" fill="#2D2D2D">
        Mani
      </text>
      <text x="138" y="34" fontFamily="Arial, sans-serif" fontSize="20" fontWeight="700" fill="#888">
        .pl
      </text>
    </svg>
  )
}

/**
 * Patronite logo · official brand logo hosted from /public/logos/patronite.svg
 * (znak słowno-graficzny Patronite chroniony przez UP RP nr R.322414 · Crowd8 sp. z o.o.)
 * Downloaded from cdn.patronite.pl for offline embedding
 */
export function PatroniteLogo({ className }: { className?: string }) {
  return (
    <img
      src="/otwartekaszuby/logos/patronite.svg"
      alt="Patronite"
      className={className}
      loading="lazy"
    />
  )
}
