import { useId } from "react";

function toRgba(hex, alpha) {
  const normalized = hex.replace("#", "");

  if (normalized.length !== 6) {
    return `rgba(255,255,255,${alpha})`;
  }

  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function clamp(value) {
  return Math.max(0, Math.min(255, value));
}

function shift(hex, amount) {
  const normalized = hex.replace("#", "");

  if (normalized.length !== 6) {
    return hex;
  }

  const r = clamp(parseInt(normalized.slice(0, 2), 16) + amount);
  const g = clamp(parseInt(normalized.slice(2, 4), 16) + amount);
  const b = clamp(parseInt(normalized.slice(4, 6), 16) + amount);

  return `rgb(${r}, ${g}, ${b})`;
}

function PatternDefs({ ids, color, pattern }) {
  if (pattern === "solid") return null;

  const base = <rect width="24" height="24" fill={`url(#${ids.cloth})`} />;

  if (pattern === "stripes") {
    return (
      <pattern id={ids.pattern} width="14" height="14" patternUnits="userSpaceOnUse">
        {base}
        <path d="M4 0V14 M10 0V14" stroke="rgba(255,255,255,0.16)" strokeWidth="1" />
      </pattern>
    );
  }

  if (pattern === "pinstripe") {
    return (
      <pattern id={ids.pattern} width="16" height="16" patternUnits="userSpaceOnUse">
        {base}
        <path
          d="M4 0V16 M12 0V16"
          stroke="rgba(255,255,255,0.24)"
          strokeWidth="1"
          strokeDasharray="1.5 3"
        />
      </pattern>
    );
  }

  if (pattern === "checks") {
    return (
      <pattern id={ids.pattern} width="18" height="18" patternUnits="userSpaceOnUse">
        {base}
        <path
          d="M0 0H18 M0 9H18 M0 18H18 M0 0V18 M9 0V18 M18 0V18"
          stroke="rgba(255,255,255,0.14)"
          strokeWidth="0.8"
        />
      </pattern>
    );
  }

  if (pattern === "windowpane") {
    return (
      <pattern id={ids.pattern} width="24" height="24" patternUnits="userSpaceOnUse">
        {base}
        <path d="M0 0H24 M0 0V24" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      </pattern>
    );
  }

  return (
    <pattern id={ids.pattern} width="14" height="14" patternUnits="userSpaceOnUse">
      {base}
      <path
        d="M0 8L4 4L8 8L12 4L16 8"
        stroke="rgba(255,255,255,0.16)"
        strokeWidth="0.9"
        fill="none"
      />
    </pattern>
  );
}

function SuitShell({ size, defs, ids, children }) {
  return (
    <svg
      width={size}
      height={size * 1.38}
      viewBox="0 0 260 340"
      xmlns="http://www.w3.org/2000/svg"
    >
      {defs}

      <ellipse cx="130" cy="316" rx="56" ry="11" fill="rgba(52, 40, 23, 0.16)" />
      <ellipse cx="130" cy="78" rx="72" ry="66" fill={`url(#${ids.aura})`} />

      <g filter={`url(#${ids.shadow})`}>
        <path
          d="M93 39C104 28 117 22 130 22C143 22 156 28 167 39L172 57C160 53 147 51 130 51C113 51 100 53 88 57L93 39Z"
          fill={`url(#${ids.neck})`}
          stroke="rgba(21,32,47,0.65)"
          strokeWidth="1.7"
        />

        {children}
      </g>
    </svg>
  );
}

function Trousers({ ids, tuxedo = false }) {
  return (
    <>
      <path
        d="M114 234L104 311H123L127 233Z"
        fill={`url(#${ids.trousers})`}
        stroke="#1b2635"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M146 234L156 311H137L133 233Z"
        fill={`url(#${ids.trousers})`}
        stroke="#1b2635"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {tuxedo && (
        <>
          <path d="M118 240L113 306" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" />
          <path d="M142 240L147 306" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" />
        </>
      )}
      <path d="M102 311H124" stroke="rgba(21,32,47,0.75)" strokeWidth="2" strokeLinecap="round" />
      <path d="M136 311H158" stroke="rgba(21,32,47,0.75)" strokeWidth="2" strokeLinecap="round" />
    </>
  );
}

function Sleeves({ fill }) {
  return (
    <>
      <path
        d="M88 72C61 85 45 117 44 161L48 255C49 272 57 283 73 286L88 288C97 288 103 280 101 268L97 158C95 117 93 90 88 72Z"
        fill={fill}
        stroke="#1b2635"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M172 72C199 85 215 117 216 161L212 255C211 272 203 283 187 286L172 288C163 288 157 280 159 268L163 158C165 117 167 90 172 72Z"
        fill={fill}
        stroke="#1b2635"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M65 250H86" stroke="rgba(21,32,47,0.72)" strokeWidth="2" strokeLinecap="round" />
      <path d="M174 250H195" stroke="rgba(21,32,47,0.72)" strokeWidth="2" strokeLinecap="round" />
    </>
  );
}

function Shirt({ ids, accent, bowTie = false, slim = false }) {
  const left = slim ? 112 : 106;
  const right = slim ? 148 : 154;

  return (
    <>
      <path
        d={`M${left} 96L130 122L${right} 96L149 229H111Z`}
        fill={`url(#${ids.shirt})`}
        stroke="#c9d0d7"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M108 95L130 118L152 95L143 148H117Z"
        fill="#ffffff"
        stroke="#d5dbe2"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {bowTie ? (
        <>
          <path d="M101 146L117 140L117 160L101 154Z" fill={accent} stroke="#1b2635" strokeWidth="1.1" />
          <path d="M159 146L143 140L143 160L159 154Z" fill={accent} stroke="#1b2635" strokeWidth="1.1" />
          <rect x="117" y="143" width="26" height="12" rx="4" fill={accent} stroke="#1b2635" strokeWidth="1.1" />
        </>
      ) : (
        <path
          d="M119 119H141L145 165L130 214L115 165Z"
          fill={`url(#${ids.tie})`}
          stroke="#1b2635"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      )}
    </>
  );
}

function Vest({ fill, accent }) {
  return (
    <>
      <path
        d="M102 88L130 102L158 88L162 232C154 240 145 245 130 248C115 245 106 240 98 232L102 88Z"
        fill={fill}
        stroke="#1b2635"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      {[126, 152, 178, 204].map((y) => (
        <circle key={y} cx="130" cy={y} r="3.3" fill={accent} stroke="#1b2635" strokeWidth="1" />
      ))}
    </>
  );
}

function Buttons({ accent, positions, double = false }) {
  const columns = double ? [116, 144] : [130];

  return columns.flatMap((x) =>
    positions.map((y) => (
      <circle key={`${x}-${y}`} cx={x} cy={y} r="4" fill={accent} stroke="#1b2635" strokeWidth="1.1" />
    ))
  );
}

function SingleBreasted2({ size, ids, defs, fill, color, accent, lining }) {
  return (
    <SuitShell {...{ size, defs, ids }}>
      <Sleeves fill={fill} />
      <Trousers ids={ids} />
      <path
        d="M92 70L130 89L120 290C103 286 88 275 75 256L72 149C72 111 77 84 92 70Z"
        fill={fill}
        stroke="#1b2635"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M168 70L130 89L140 290C157 286 172 275 185 256L188 149C188 111 183 84 168 70Z"
        fill={fill}
        stroke="#1b2635"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M105 80L130 89L119 129L102 111Z" fill={lining} stroke="#1b2635" strokeWidth="1.4" />
      <path d="M155 80L130 89L141 129L158 111Z" fill={lining} stroke="#1b2635" strokeWidth="1.4" />
      <path d="M95 71L130 89L109 162L88 120Z" fill={shift(color, -10)} stroke="#1b2635" strokeWidth="1.8" />
      <path d="M165 71L130 89L151 162L172 120Z" fill={shift(color, -10)} stroke="#1b2635" strokeWidth="1.8" />
      <Shirt ids={ids} accent={accent} />
      {Buttons({ accent, positions: [154, 188] })}
      <path d="M92 201H111" stroke="rgba(27,38,53,0.7)" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M149 201H168" stroke="rgba(27,38,53,0.7)" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M101 129H117" stroke="rgba(27,38,53,0.6)" strokeWidth="1.5" strokeLinecap="round" />
    </SuitShell>
  );
}

function SingleBreasted3({ size, ids, defs, fill, color, accent, lining }) {
  return (
    <SuitShell {...{ size, defs, ids }}>
      <Sleeves fill={fill} />
      <Trousers ids={ids} />
      <path
        d="M94 70L130 85L120 290C104 286 89 276 77 256L74 148C74 111 79 84 94 70Z"
        fill={fill}
        stroke="#1b2635"
        strokeWidth="2"
      />
      <path
        d="M166 70L130 85L140 290C156 286 171 276 183 256L186 148C186 111 181 84 166 70Z"
        fill={fill}
        stroke="#1b2635"
        strokeWidth="2"
      />
      <path d="M107 79L130 85L121 122L106 107Z" fill={lining} stroke="#1b2635" strokeWidth="1.4" />
      <path d="M153 79L130 85L139 122L154 107Z" fill={lining} stroke="#1b2635" strokeWidth="1.4" />
      <path d="M97 72L130 85L111 153L91 117Z" fill={shift(color, -10)} stroke="#1b2635" strokeWidth="1.8" />
      <path d="M163 72L130 85L149 153L169 117Z" fill={shift(color, -10)} stroke="#1b2635" strokeWidth="1.8" />
      <Shirt ids={ids} accent={accent} />
      {Buttons({ accent, positions: [144, 174, 204] })}
    </SuitShell>
  );
}

function DoubleBreasted({ size, ids, defs, fill, color, accent, lining }) {
  return (
    <SuitShell {...{ size, defs, ids }}>
      <Sleeves fill={fill} />
      <Trousers ids={ids} />
      <path
        d="M92 71L141 87L133 290C108 287 88 274 73 250L68 145C68 108 76 82 92 71Z"
        fill={fill}
        stroke="#1b2635"
        strokeWidth="2"
      />
      <path
        d="M168 71L119 87L127 290C152 287 172 274 187 250L192 145C192 108 184 82 168 71Z"
        fill={fill}
        stroke="#1b2635"
        strokeWidth="2"
      />
      <path d="M113 80L141 87L128 122L110 104Z" fill={lining} stroke="#1b2635" strokeWidth="1.4" />
      <path d="M147 80L119 87L132 122L150 104Z" fill={lining} stroke="#1b2635" strokeWidth="1.4" />
      <path d="M95 72L136 87L103 146L79 99Z" fill={shift(color, -12)} stroke="#1b2635" strokeWidth="1.8" />
      <path d="M165 72L124 87L157 146L181 99Z" fill={shift(color, -12)} stroke="#1b2635" strokeWidth="1.8" />
      <Shirt ids={ids} accent={accent} slim />
      {Buttons({ accent, positions: [142, 172, 202], double: true })}
    </SuitShell>
  );
}

function ThreePiece({ size, ids, defs, fill, color, accent, lining }) {
  return (
    <SuitShell {...{ size, defs, ids }}>
      <Sleeves fill={fill} />
      <Trousers ids={ids} />
      <Vest fill={shift(color, -2)} accent={accent} />
      <path
        d="M94 70L120 92L114 250C100 245 88 233 77 215L74 147C74 112 80 84 94 70Z"
        fill={fill}
        stroke="#1b2635"
        strokeWidth="2"
      />
      <path
        d="M166 70L140 92L146 250C160 245 172 233 183 215L186 147C186 112 180 84 166 70Z"
        fill={fill}
        stroke="#1b2635"
        strokeWidth="2"
      />
      <path d="M109 81L120 92L115 123L104 111Z" fill={lining} stroke="#1b2635" strokeWidth="1.3" />
      <path d="M151 81L140 92L145 123L156 111Z" fill={lining} stroke="#1b2635" strokeWidth="1.3" />
      <path d="M97 72L120 92L108 148L90 118Z" fill={shift(color, -10)} stroke="#1b2635" strokeWidth="1.7" />
      <path d="M163 72L140 92L152 148L170 118Z" fill={shift(color, -10)} stroke="#1b2635" strokeWidth="1.7" />
      <path d="M120 106H140L143 137L130 164L117 137Z" fill={`url(#${ids.tie})`} stroke="#1b2635" strokeWidth="1.1" />
    </SuitShell>
  );
}

function Tuxedo({ size, ids, defs, fill, accent, lining }) {
  return (
    <SuitShell {...{ size, defs, ids }}>
      <Sleeves fill={fill} />
      <Trousers ids={ids} tuxedo />
      <path
        d="M92 70L130 89L120 290C103 286 88 275 75 256L72 149C72 111 77 84 92 70Z"
        fill={fill}
        stroke="#1b2635"
        strokeWidth="2"
      />
      <path
        d="M168 70L130 89L140 290C157 286 172 275 185 256L188 149C188 111 183 84 168 70Z"
        fill={fill}
        stroke="#1b2635"
        strokeWidth="2"
      />
      <path d="M105 81L130 89L119 128L102 111Z" fill={lining} stroke="#1b2635" strokeWidth="1.4" />
      <path d="M155 81L130 89L141 128L158 111Z" fill={lining} stroke="#1b2635" strokeWidth="1.4" />
      <path d="M95 72C110 75 121 82 130 95L108 176C89 154 79 128 76 102Z" fill="#111216" stroke="#1b2635" strokeWidth="1.8" />
      <path d="M165 72C150 75 139 82 130 95L152 176C171 154 181 128 184 102Z" fill="#111216" stroke="#1b2635" strokeWidth="1.8" />
      <Shirt ids={ids} accent={accent} bowTie />
      {Buttons({ accent, positions: [204] })}
    </SuitShell>
  );
}

export default function SuitSVG({
  color = "#1a2238",
  accent = "#c9a84c",
  lining = "#1a1a1a",
  pattern = "solid",
  styleType = "single-2",
  size = 240,
}) {
  const uid = useId().replace(/:/g, "");
  const ids = {
    cloth: `cloth-${uid}`,
    trousers: `trousers-${uid}`,
    tie: `tie-${uid}`,
    shirt: `shirt-${uid}`,
    aura: `aura-${uid}`,
    neck: `neck-${uid}`,
    pattern: `pattern-${uid}`,
    shadow: `shadow-${uid}`,
  };

  const defs = (
    <defs>
      <linearGradient id={ids.cloth} x1="35%" y1="0%" x2="70%" y2="100%">
        <stop offset="0%" stopColor={shift(color, 28)} />
        <stop offset="48%" stopColor={color} />
        <stop offset="100%" stopColor={shift(color, -18)} />
      </linearGradient>

      <linearGradient id={ids.trousers} x1="40%" y1="0%" x2="58%" y2="100%">
        <stop offset="0%" stopColor={shift(color, 12)} />
        <stop offset="100%" stopColor={shift(color, -22)} />
      </linearGradient>

      <linearGradient id={ids.tie} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={shift(accent, 20)} />
        <stop offset="100%" stopColor={shift(accent, -10)} />
      </linearGradient>

      <linearGradient id={ids.shirt} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#ece7de" />
      </linearGradient>

      <linearGradient id={ids.neck} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f0d7be" />
        <stop offset="100%" stopColor="#ddb899" />
      </linearGradient>

      <radialGradient id={ids.aura} cx="50%" cy="40%" r="65%">
        <stop offset="0%" stopColor={toRgba(accent, 0.18)} />
        <stop offset="60%" stopColor={toRgba(color, 0.12)} />
        <stop offset="100%" stopColor="rgba(0,0,0,0)" />
      </radialGradient>

      <filter id={ids.shadow} x="-20%" y="-20%" width="140%" height="160%">
        <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#000000" floodOpacity="0.14" />
      </filter>

      <PatternDefs ids={ids} color={color} pattern={pattern} />
    </defs>
  );

  const fill = pattern === "solid" ? `url(#${ids.cloth})` : `url(#${ids.pattern})`;
  const shared = {
    size,
    ids,
    defs,
    fill,
    color,
    accent,
    lining,
  };

  if (styleType === "double") return <DoubleBreasted {...shared} />;
  if (styleType === "three-piece") return <ThreePiece {...shared} />;
  if (styleType === "tuxedo") return <Tuxedo {...shared} />;
  if (styleType === "single-3") return <SingleBreasted3 {...shared} />;
  return <SingleBreasted2 {...shared} />;
}
