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
 * Patronite logo · red circle with white "P" + wordmark
 */
export function PatroniteLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg" className={className} role="img" aria-label="Patronite">
      {/* Circle */}
      <circle cx="22" cy="25" r="20" fill="#FF424D" />
      {/* Clean white letter P inside the circle */}
      <path
        fill="#FFFFFF"
        d="M16 14h9.2c2.1 0 3.7.5 4.8 1.5 1.1 1 1.6 2.4 1.6 4.2 0 1.8-.5 3.2-1.6 4.2-1.1 1-2.7 1.5-4.8 1.5H20v6.6h-4V14Zm9 8.1c1 0 1.7-.2 2.2-.6.5-.4.7-1 .7-1.8s-.2-1.4-.7-1.8c-.5-.4-1.2-.6-2.2-.6H20v4.8h5Z"
      />
      {/* Wordmark */}
      <text x="52" y="34" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="700" fill="#2D2D2D">
        patronite
      </text>
    </svg>
  )
}
