import { useId } from "react";

function shade(hex, amount) {
  const normalized = hex.replace("#", "");

  if (normalized.length !== 6) {
    return hex;
  }

  const clamp = (value) => Math.max(0, Math.min(255, value));
  const r = clamp(parseInt(normalized.slice(0, 2), 16) + amount);
  const g = clamp(parseInt(normalized.slice(2, 4), 16) + amount);
  const b = clamp(parseInt(normalized.slice(4, 6), 16) + amount);

  return `rgb(${r}, ${g}, ${b})`;
}

export default function SuitSVG({
  color = "#1a1a2e",
  accent = "#c9a84c",
  lining = "#f5f0e8",
  pattern = "solid",
  styleType = "single-2",
  size = 190,
}) {
  const uid = useId().replace(/:/g, "");
  const ids = {
    stripe: `stripe-${uid}`,
    check: `check-${uid}`,
    herringbone: `herringbone-${uid}`,
    pinstripe: `pinstripe-${uid}`,
    windowpane: `windowpane-${uid}`,
  };

  const fill =
    pattern === "solid"
      ? color
      : pattern === "stripes"
      ? `url(#${ids.stripe})`
      : pattern === "checks"
      ? `url(#${ids.check})`
      : pattern === "windowpane"
      ? `url(#${ids.windowpane})`
      : pattern === "herringbone"
      ? `url(#${ids.herringbone})`
      : `url(#${ids.pinstripe})`;

  const isDouble = styleType === "double";
  const isThreePiece = styleType === "three-piece";
  const isTuxedo = styleType === "tuxedo";
  const isThreeButtons = styleType === "single-3";
  const lapelFill = isTuxedo ? "#111216" : shade(color, -8);

  return (
    <svg
      viewBox="0 0 280 380"
      className="mx-auto drop-shadow-[0_30px_70px_rgba(0,0,0,0.28)]"
      style={{ width: size, height: size * 1.35 }}
    >
      <defs>
        <pattern id={ids.stripe} width="10" height="10" patternUnits="userSpaceOnUse">
          <rect width="10" height="10" fill={color} />
          <rect x="5" width="1" height="10" fill={accent} opacity="0.35" />
        </pattern>
        <pattern id={ids.check} width="16" height="16" patternUnits="userSpaceOnUse">
          <rect width="16" height="16" fill={color} />
          <path d="M0 8H16M8 0V16" stroke={accent} opacity="0.25" />
        </pattern>
        <pattern id={ids.windowpane} width="18" height="18" patternUnits="userSpaceOnUse">
          <rect width="18" height="18" fill={color} />
          <path d="M0 0H18M0 0V18" stroke={accent} opacity="0.3" />
        </pattern>
        <pattern id={ids.herringbone} width="14" height="14" patternUnits="userSpaceOnUse">
          <rect width="14" height="14" fill={color} />
          <path d="M0 7L7 0M7 14L14 7" stroke={accent} opacity="0.28" />
        </pattern>
        <pattern id={ids.pinstripe} width="12" height="12" patternUnits="userSpaceOnUse">
          <rect width="12" height="12" fill={color} />
          <rect width="1" height="12" fill={accent} opacity="0.38" />
        </pattern>
      </defs>

      <ellipse cx="140" cy="352" rx="80" ry="12" fill="rgba(65,48,26,0.12)" />

      <path
        d="M70 90 L40 175 L35 350 L245 350 L240 175 L210 90 Z"
        fill={fill}
        stroke={accent}
        strokeWidth="1.4"
      />

      <path d="M70 90 L140 148 L110 90 Z" fill={lapelFill} opacity="0.92" stroke={accent} />
      <path d="M210 90 L140 148 L170 90 Z" fill={lapelFill} opacity="0.92" stroke={accent} />

      <path
        d="M105 74 L140 104 L175 74 L166 52 L140 64 L114 52 Z"
        fill={shade(color, -14)}
        stroke={accent}
      />
      <path d="M110 90 L140 148 L170 90 L160 68 L140 78 L120 68 Z" fill="#f7f2ea" />
      <path d="M137 80 L143 80 L147 130 L140 144 L133 130 Z" fill={lining} />

      {isTuxedo ? (
        <>
          <path d="M124 146L116 154L124 160H156L164 154L156 146Z" fill="#111216" />
          <circle cx="140" cy="205" r="5" fill={accent} />
        </>
      ) : isDouble ? (
        <>
          <circle cx="122" cy="180" r="5" fill={accent} />
          <circle cx="158" cy="180" r="5" fill={accent} />
          <circle cx="122" cy="205" r="5" fill={accent} />
          <circle cx="158" cy="205" r="5" fill={accent} />
        </>
      ) : isThreePiece ? (
        <>
          <path
            d="M114 95 L140 114 L166 95 L160 246 L120 246 Z"
            fill={shade(color, -16)}
            stroke={accent}
            strokeWidth="1.1"
          />
          <circle cx="140" cy="156" r="4.5" fill={accent} />
          <circle cx="140" cy="178" r="4.5" fill={accent} />
          <circle cx="140" cy="200" r="4.5" fill={accent} />
          <circle cx="140" cy="222" r="4.5" fill={accent} />
        </>
      ) : isThreeButtons ? (
        <>
          <circle cx="140" cy="176" r="5" fill={accent} />
          <circle cx="140" cy="202" r="5" fill={accent} />
          <circle cx="140" cy="228" r="5" fill={accent} />
        </>
      ) : (
        <>
          <circle cx="140" cy="188" r="5" fill={accent} />
          <circle cx="140" cy="214" r="5" fill={accent} />
        </>
      )}

      <rect x="50" y="160" width="40" height="22" rx="3" fill={shade(color, -4)} opacity="0.7" stroke={accent} />
      <rect x="35" y="258" width="34" height="14" rx="2" fill={shade(color, -4)} opacity="0.7" stroke={accent} />
      <rect x="211" y="258" width="34" height="14" rx="2" fill={shade(color, -4)} opacity="0.7" stroke={accent} />

      <rect x="35" y="340" width="210" height="12" fill={lining} opacity="0.45" />
    </svg>
  );
}
