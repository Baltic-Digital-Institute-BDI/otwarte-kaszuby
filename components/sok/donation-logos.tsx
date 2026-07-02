// Inline SVG components dla zewnętrznych marek donations
// Dlaczego inline: zero network requests · zero remotePatterns CSP issues · idealnie ostre na każdym DPI

/**
 * PayPal official logo · dual "P" layered symbol + wordmark
 * Colors: PayPal Blue #003087 (front P) + Blue #009CDE (back P) + Dark Blue #012169 (wordmark)
 */
export function PayPalLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 124 33" xmlns="http://www.w3.org/2000/svg" className={className} role="img" aria-label="PayPal">
      {/* Back "P" (light blue, offset) */}
      <path
        fill="#009CDE"
        d="M46.211 6.749h-6.839a.95.95 0 0 0-.939.802l-2.766 17.537a.57.57 0 0 0 .564.658h3.265a.95.95 0 0 0 .939-.803l.746-4.73a.95.95 0 0 1 .938-.803h2.165c4.505 0 7.105-2.18 7.784-6.5.306-1.89.013-3.375-.872-4.415-.972-1.142-2.696-1.746-4.985-1.746Zm.789 6.405c-.374 2.454-2.249 2.454-4.062 2.454h-1.032l.724-4.583a.57.57 0 0 1 .563-.481h.473c1.235 0 2.4 0 3.002.704.359.42.469 1.044.332 1.906Z"
      />
      {/* Front "P" (dark blue) */}
      <path
        fill="#003087"
        d="M11.049 6.749H4.211a.95.95 0 0 0-.939.802L.506 25.088a.57.57 0 0 0 .564.658H4.32a.95.95 0 0 0 .938-.803l.746-4.73a.95.95 0 0 1 .939-.803h2.165c4.505 0 7.105-2.18 7.784-6.5.306-1.89.013-3.375-.872-4.415-.972-1.142-2.696-1.746-4.985-1.746Zm.789 6.405c-.374 2.454-2.249 2.454-4.062 2.454H6.744l.724-4.583a.57.57 0 0 1 .563-.481h.473c1.235 0 2.4 0 3.002.704.359.42.469 1.044.332 1.906Z"
      />
      {/* "ay" letters after front P */}
      <path
        fill="#003087"
        d="M30.264 13.075H26.99a.57.57 0 0 0-.564.481l-.145.916-.229-.332c-.709-1.03-2.292-1.373-3.871-1.373-3.626 0-6.723 2.746-7.325 6.6-.313 1.923.132 3.762 1.223 5.045.999 1.18 2.43 1.671 4.135 1.671 2.921 0 4.541-1.879 4.541-1.879l-.146.909a.57.57 0 0 0 .563.66h2.951a.95.95 0 0 0 .938-.803l1.771-11.222a.57.57 0 0 0-.568-.673Zm-4.559 6.386c-.316 1.877-1.805 3.136-3.706 3.136-.954 0-1.716-.306-2.206-.886-.486-.575-.67-1.395-.516-2.307.295-1.86 1.809-3.16 3.682-3.16.934 0 1.691.31 2.191.895.502.591.7 1.415.555 2.322Z"
      />
      {/* "l" tail */}
      <path
        fill="#003087"
        d="m47.766 13.075-3.302 4.847-1.4-4.658a.95.95 0 0 0-.912-.677H38.94a.57.57 0 0 0-.539.753l2.607 7.652-2.451 3.461a.571.571 0 0 0 .466.902h3.207c.286 0 .555-.14.719-.376l7.941-11.474a.57.57 0 0 0-.47-.895h-2.234a.951.951 0 0 0-.42.465Z"
      />
      {/* "P" for Pal (light blue back P repeat as capital-a of Pal) */}
      <path
        fill="#009CDE"
        d="M65.334 13.075h-3.276a.57.57 0 0 0-.564.481l-.145.916-.229-.332c-.709-1.03-2.292-1.373-3.871-1.373-3.626 0-6.723 2.746-7.325 6.6-.313 1.923.132 3.762 1.223 5.045.999 1.18 2.43 1.671 4.135 1.671 2.921 0 4.541-1.879 4.541-1.879l-.146.909a.57.57 0 0 0 .563.66h2.951a.95.95 0 0 0 .938-.803l1.771-11.222a.57.57 0 0 0-.566-.673Zm-4.559 6.386c-.316 1.877-1.805 3.136-3.706 3.136-.954 0-1.716-.306-2.206-.886-.486-.575-.67-1.395-.516-2.307.295-1.86 1.809-3.16 3.682-3.16.934 0 1.691.31 2.191.895.502.591.7 1.415.555 2.322Z"
      />
      {/* Long "l" at end of PayPal */}
      <path
        fill="#009CDE"
        d="M69.198 7.234 66.394 25.09a.57.57 0 0 0 .563.66h2.824a.95.95 0 0 0 .938-.803l2.768-17.535a.57.57 0 0 0-.564-.66h-3.161a.57.57 0 0 0-.564.482Z"
      />
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
