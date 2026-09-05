export function Logo({
  size = 32,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="Français Prépa"
    >
      <defs>
        <linearGradient id="fp-logo-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#24507f" />
          <stop offset="0.55" stopColor="#10263f" />
          <stop offset="1" stopColor="#0a1526" />
        </linearGradient>
        <radialGradient id="fp-logo-glow" cx="0.5" cy="1" r="0.95">
          <stop offset="0" stopColor="#d8b25f" stopOpacity="0.18" />
          <stop offset="1" stopColor="#d8b25f" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="fp-logo-sheen" cx="0.32" cy="0.22" r="1.1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="fp-logo-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6dc8e" />
          <stop offset="1" stopColor="#c4992f" />
        </linearGradient>
      </defs>
      <rect x="0.5" y="0.5" width="63" height="63" rx="16" fill="url(#fp-logo-bg)" />
      <rect x="0.5" y="0.5" width="63" height="63" rx="16" fill="none" stroke="#ffffff" strokeOpacity="0.1" />
      <rect x="0.5" y="0.5" width="63" height="63" rx="16" fill="url(#fp-logo-glow)" />
      <rect x="0.5" y="0.5" width="63" height="63" rx="16" fill="url(#fp-logo-sheen)" />
      <rect
        x="3.5"
        y="3.5"
        width="57"
        height="57"
        rx="13"
        fill="none"
        stroke="#d8b25f"
        strokeOpacity="0.55"
        strokeWidth="1"
      />
      <text
        x="32"
        y="32"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="40"
        fontWeight="700"
        fill="url(#fp-logo-gold)"
        textAnchor="middle"
        dominantBaseline="central"
      >
        É
      </text>
      <rect x="20" y="51" width="24" height="7" rx="3.5" fill="#0e1c31" stroke="#d8b25f" strokeOpacity="0.9" />
      <rect x="22.5" y="52" width="5.5" height="5" rx="2.5" fill="#7aa7e0" />
      <rect x="28" y="52" width="8" height="5" rx="2.5" fill="#f4eedd" />
      <rect x="36" y="52" width="5.5" height="5" rx="2.5" fill="#e5827b" />
    </svg>
  );
}