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
          <stop offset="0" stopColor="#224a76" />
          <stop offset="1" stopColor="#0a1526" />
        </linearGradient>
      </defs>
      <rect x="0.5" y="0.5" width="63" height="63" rx="16" fill="url(#fp-logo-bg)" />
      <rect
        x="0.5"
        y="0.5"
        width="63"
        height="63"
        rx="16"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.14"
      />
      <rect
        x="4"
        y="4"
        width="56"
        height="56"
        rx="12.5"
        fill="none"
        stroke="#d8b25f"
        strokeOpacity="0.45"
        strokeWidth="1"
      />
      <path
        d="M30 21 L39 12"
        stroke="#d8b25f"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <g fill="#f6f1e3">
        <rect x="16" y="17" width="7" height="34" rx="3.5" />
        <rect x="16" y="17" width="17" height="7" rx="3.5" />
        <rect x="16" y="29" width="22" height="7" rx="3.5" />
        <rect x="16" y="41" width="14" height="7" rx="3.5" />
      </g>
      <rect x="22" y="52" width="20" height="4" rx="2" fill="#d8b25f" />
    </svg>
  );
}