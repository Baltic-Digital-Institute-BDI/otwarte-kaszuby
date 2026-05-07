// Inline SVG components dla zewnętrznych marek donations
// Dlaczego inline: zero network requests · zero remotePatterns CSP issues · idealnie ostre na każdym DPI

export function PayPalLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 28" xmlns="http://www.w3.org/2000/svg" className={className} role="img" aria-label="PayPal">
      <path
        fill="#003087"
        d="M12.4 6.7H7.6c-.3 0-.6.2-.6.5l-1.9 12.3c0 .2.1.4.3.4h2.3c.3 0 .6-.2.6-.5l.5-3.3c.1-.3.3-.5.6-.5h1.5c3.2 0 5-1.5 5.5-4.6.2-1.4 0-2.4-.6-3.2-.6-.8-1.7-1.1-3.4-1.1Zm.6 4.5c-.3 1.7-1.6 1.7-2.9 1.7h-.7l.5-3.3c0-.2.2-.3.4-.3h.3c.9 0 1.7 0 2.1.5.3.3.4.7.3 1.4Z"
      />
      <path
        fill="#003087"
        d="M27 11.2h-2.3c-.2 0-.3.1-.4.3l-.1.6-.2-.2c-.5-.7-1.6-1-2.7-1-2.5 0-4.6 1.9-5 4.5-.2 1.3.1 2.6.8 3.5.7.8 1.7 1.1 2.9 1.1 2 0 3.1-1.3 3.1-1.3l-.1.6c0 .2.1.4.3.4h2.1c.3 0 .6-.2.6-.5l1.2-7.6c.1-.2-.1-.4-.2-.4Zm-3.2 4.4c-.2 1.3-1.2 2.1-2.5 2.1-.6 0-1.2-.2-1.5-.6-.3-.4-.4-.9-.3-1.5.2-1.2 1.2-2.1 2.5-2.1.6 0 1.2.2 1.5.6.4.4.5 1 .3 1.5Z"
      />
      <path
        fill="#003087"
        d="m39.4 11.2-2.4 6.6c-.5-1.7-1.4-4.4-1.5-4.6-.1-.4-.4-.6-.8-.6h-2.6c-.2 0-.3.2-.2.4l3 8.7-2.8 4c-.1.2 0 .4.2.4h2.6c.3 0 .5-.1.6-.3l9.1-13.4c.1-.2 0-.4-.2-.4h-2.6c-.2.1-.4.2-.4.2Z"
      />
      <path
        fill="#0070E0"
        d="M48.7 6.7h-4.8c-.3 0-.6.2-.6.5l-1.9 12.3c0 .2.1.4.3.4h2.4c.2 0 .4-.2.4-.4l.5-3.4c.1-.3.3-.5.6-.5h1.5c3.2 0 5-1.5 5.5-4.6.2-1.4 0-2.4-.6-3.2-.6-.8-1.7-1.1-3.3-1.1Zm.6 4.5c-.3 1.7-1.6 1.7-2.9 1.7h-.7l.5-3.3c0-.2.2-.3.4-.3h.3c.9 0 1.7 0 2.1.5.3.3.4.7.3 1.4Z"
      />
      <path
        fill="#0070E0"
        d="M63.3 11.2H61c-.2 0-.4.1-.4.3l-.1.6-.2-.2c-.5-.7-1.6-1-2.7-1-2.5 0-4.6 1.9-5 4.5-.2 1.3.1 2.6.8 3.5.7.8 1.7 1.1 2.9 1.1 2 0 3.1-1.3 3.1-1.3l-.1.6c0 .2.1.4.3.4h2.1c.3 0 .6-.2.6-.5l1.2-7.6c.1-.2 0-.4-.2-.4Zm-3.2 4.4c-.2 1.3-1.2 2.1-2.5 2.1-.6 0-1.2-.2-1.5-.6-.3-.4-.4-.9-.3-1.5.2-1.2 1.2-2.1 2.5-2.1.6 0 1.2.2 1.5.6.4.4.5 1 .3 1.5Z"
      />
      <path
        fill="#0070E0"
        d="M66.1 7.1 64.2 19.5c0 .2.1.4.3.4h2c.3 0 .6-.2.6-.5L69 7.2c0-.2-.1-.4-.3-.4h-2.2c-.2-.1-.3.1-.4.3Z"
      />
    </svg>
  )
}

export function FaniManiLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg" className={className} role="img" aria-label="FaniMani.pl">
      <text x="0" y="34" fontFamily="Arial Black, sans-serif" fontSize="28" fontWeight="900" fill="#E5267C">
        Fani
      </text>
      <text x="62" y="34" fontFamily="Arial Black, sans-serif" fontSize="28" fontWeight="900" fill="#2D2D2D">
        Mani
      </text>
      <text x="138" y="34" fontFamily="Arial, sans-serif" fontSize="20" fontWeight="700" fill="#888">
        .pl
      </text>
    </svg>
  )
}

export function PatroniteLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg" className={className} role="img" aria-label="Patronite">
      <circle cx="22" cy="25" r="20" fill="#FF424D" />
      <path
        fill="#fff"
        d="M22 14a8 8 0 0 0-8 8c0 5 4 8 8 8s4-2 4-2-1 4 1 4 4-3 4-4c0-1.5-1-1.5-1-3 0-3-2-7-8-7-2 0-3 2-3 3a3 3 0 0 1 3-3c2 0 3 1 3 3 0 1-1 3-3 3-1 0-2-1-2-2 0-1 1-2 2-2"
      />
      <text x="50" y="34" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="700" fill="#2D2D2D">
        patronite
      </text>
    </svg>
  )
}
