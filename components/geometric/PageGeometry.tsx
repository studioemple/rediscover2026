"use client";

/**
 * Page-wide geometric backdrop — absolute inside <main>, scrolls with
 * the page. Hairlines + circles + diagonals scattered across the whole
 * document so every section has its own pattern.
 *
 * Diagonals are intentionally OVERSIZED (wider than the viewport, often
 * positioned off-screen) so their endpoints never show — they read as
 * infinite cuts across the page.
 */

const STROKE = "#D9D9D9";

/* Vertical hairlines — span the full document height. Evenly spaced and
   symmetric: outer pair at 10% / 90%, inner pair splitting the span into
   three equal 26.67% gaps. The WhyReturn accordion aligns its box edges to
   the outer pair (10vw / 90vw) on mobile. */
const VERTICAL_LINES = [10, 36.6667, 63.3333, 90];

/* Horizontal hairlines — distributed across the whole document.
   Wider gap kept clear around the Audience section (≈320–600vh) so the
   "Made for those shaping…" headline + titles list stay completely free.
   FAQ zone (≈1400vh+) is also intentionally line-free — the FAQ accordion
   already has its own item separators, so background hairlines clash. */
const HORIZONTAL_LINES = [
  18, 92, 175, 260,
  // (Audience zone 320–600vh intentionally line-free)
  640, 760, 900,
  // (1030 + 1190 removed — they fell across the FAQ rows after the
  //  WhyReturn section lengthened the page.)
];

/* Scattered decorations — circles and diagonals spread across vertical
   positions so the lower half of the page isn't just bare verticals. */
type Decor =
  | {
      kind: "circle";
      left: string;
      topVh: number;
      size: number;
      /** Optional override for base rotation in degrees. If omitted, a
       *  deterministic pseudo-random rotation is computed from the index. */
      rot?: number;
      /** Mobile-only position override (<768px). When set, the desktop
       *  circle becomes `hidden md:block` and a second, differently-placed
       *  copy renders `md:hidden`. Lets a circle sit in a corner / white
       *  space on phones instead of landing behind stacked content. */
      mobile?: { left: string; topVh: number; size?: number; rot?: number };
      /** Hide this circle entirely below md (no mobile replacement). */
      mobileHide?: boolean;
    }
  | {
      kind: "diagonal";
      topVh: number;
      flip?: boolean; // if true, line goes ↘ instead of ↗
      leftVw?: number; // override default left positioning
    };

const DECORATIONS: Decor[] = [
  // ───── Top zone (Hero / Aftermovie 0–200vh) ─────
  // Hero left circle — ~60% visible (40% off the left edge), anchored at
  // 38vh so it lives in the middle of the hero zone.
  { kind: "circle",   left: "-252px",             topVh: 38,   size: 630 },
  // Hero right circle — mirrors the left one, ~60% visible off the right edge,
  // slightly higher so the two read as a paired but not symmetric duo.
  // On mobile it moves to a subtle top-left corner arc (out of the text).
  { kind: "circle",   left: "calc(100% - 378px)", topVh: 62,   size: 630,
    mobile: { left: "-42%", topVh: 7, size: 300 } },
  { kind: "diagonal", topVh: 4 },
  { kind: "diagonal", topVh: 76, flip: true },
  { kind: "circle",   left: "78%",                topVh: 145,  size: 266 },

  // ───── Value-prop zone (200–320vh) ─────
  { kind: "diagonal", topVh: 215 },
  // Value-prop left circle — pinned at rot: 0 so the Rentlio "R" reads upright.
  // On mobile it moves to the top-right white space of the section.
  { kind: "circle",   left: "-6%",                topVh: 260,  size: 644, rot: 0,
    mobile: { left: "75%", topVh: 214, size: 280 } },

  // ───── Audience zone (≈320–700vh) intentionally CLEAR — no lines,
  //       circles or diagonals cross the centered title + titles list.
  //       Buffer extended on both sides because section heights vary. ─────

  // ───── Program / Speakers zone (≈700–860vh) ─────
  { kind: "circle",   left: "8%",                 topVh: 720,  size: 350 },
  { kind: "circle",   left: "80%",                topVh: 760,  size: 266 },
  { kind: "diagonal", topVh: 800, flip: true },
  // (Speakers headline backdrops are rendered locally inside
  //  SpeakersSection.tsx, so they're guaranteed to sit in that section
  //  regardless of how the document's total height shifts.)

  // ───── Gallery / Testimonials zone (800–1100vh) ─────
  { kind: "diagonal", topVh: 830 },
  // (Left circle removed — it was bleeding into the testimonials section.)
  { kind: "diagonal", topVh: 950, flip: true },
  { kind: "circle",   left: "72%",                topVh: 1020, size: 308 },
  { kind: "diagonal", topVh: 1080 },

  // ───── Partners / Register zone (1100–1400vh) ─────
  { kind: "diagonal", topVh: 1160, flip: true },
  // (Partners-left backdrop is rendered locally inside PartnersSection.tsx,
  //  so it's guaranteed to sit above the logo grid regardless of how the
  //  document's total height shifts.)
  { kind: "circle",   left: "82%",                topVh: 1340, size: 322 },
  // Diagonals at 1280 + 1390 removed — they bled down into the FAQ
  // accordion and clashed with its separators.

  // ───── FAQ / Footer zone (1400–1600vh) ─────
  // Diagonal removed — it cut across the FAQ accordion separators and
  // looked like a clash. Circles stay since they sit behind the content
  // without crossing the hairline rows.
  { kind: "circle",   left: "calc(70% - 224px)",  topVh: 1450, size: 314 },
  { kind: "circle",   left: "20%",                topVh: 1560, size: 266 },
];

export function PageGeometry() {
  return (
    /* Hidden on small screens — the diagonals, oversized circles and
       full-document vh positioning don't play well with narrow mobile
       viewports (lines look mis-placed and decorations clutter the
       centred content). Comes back from md (768px) upwards. */
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      /* Gently fades the whole geometric backdrop in when it mounts (right as
         the hero settles at the end of the intro), instead of hard-popping.
         Shown on ALL sizes now — on mobile the horizontal hairlines +
         diagonals are hidden (their vh positions are calibrated for the
         desktop document height and would cut across stacked content), while
         the vertical hairlines + circles (size-capped to a fraction of the
         viewport) stay to softly fill the background. */
      style={{ animation: "pageGeomFadeIn 1.1s ease-out both" }}
    >
      {/* Vertical hairlines — full document height */}
      {VERTICAL_LINES.map((pct, i) => (
        <div
          key={`v-${pct}`}
          className="absolute top-0 bottom-0"
          style={{
            left: `${pct}%`,
            width: 1,
            background: STROKE,
            animation: `pageDriftX${i % 2} ${24 + i * 3}s ease-in-out ${i * 0.7}s infinite`,
            willChange: "transform",
          }}
        />
      ))}

      {/* Horizontal hairlines — hidden on mobile (vh positions calibrated for
          the desktop document height would cross stacked mobile content). */}
      {HORIZONTAL_LINES.map((topVh, i) => (
        <div
          key={`h-${i}-${topVh}`}
          className="absolute left-0 right-0 hidden md:block"
          style={{
            top: `${topVh}vh`,
            height: 1,
            background: STROKE,
            animation: `pageDriftY${i % 2} ${28 + (i % 5) * 2.5}s ease-in-out ${(i * 1.1) % 5}s infinite`,
            willChange: "transform",
          }}
        />
      ))}

      {/* Scattered circles (Rentlio circle SVG) + diagonals */}
      {DECORATIONS.map((d, i) => {
        const driftAnim = `pageDriftDecor${i % 3} ${32 + (i % 5) * 4}s ease-in-out ${(i * 0.9) % 6}s infinite`;

        if (d.kind === "circle") {
          /* Deterministic pseudo-random base rotation per index — stays
             stable across renders (no hydration mismatch) yet looks
             organically varied. A circle can override this by setting
             `rot` explicitly (e.g. rot: 0 for the standard orientation).
             The inner element also rotates very slowly forever, but the
             per-revolution time is huge so it reads as nearly-static
             "breathing" motion. */
          const breatheDur = 240 + (i % 6) * 40; // 240–440s — almost imperceptible
          const breatheDir = i % 2 === 0 ? 1 : -1; // alternate cw / ccw

          // Builds one circle element. Size is capped to a fraction of the
          // viewport so the big desktop circles shrink to sensible blobs on
          // phones; the vertical centring offset uses the SAME expression so
          // it stays centred at any size.
          const circleEl = (
            subKey: string,
            left: string,
            topVh: number,
            size: number,
            rotOverride: number | undefined,
            extraClass: string,
          ) => {
            const baseRot = rotOverride ?? d.rot ?? (i * 137 + 41) % 360;
            const sz = `min(${size}px, 62vw)`;
            return (
              <div
                key={subKey}
                className={`absolute ${extraClass}`.trim()}
                style={{
                  left,
                  top: `calc(${topVh}vh - ${sz} / 2)`,
                  width: sz,
                  height: sz,
                  animation: driftAnim,
                  willChange: "transform",
                }}
              >
                <div
                  className="size-full"
                  style={{
                    ["--base-rot" as never]: `${baseRot}deg`,
                    animation: `pageRentlioBreathe${breatheDir > 0 ? "Cw" : "Ccw"} ${breatheDur}s linear infinite`,
                  }}
                >
                  <img
                    src="/rentlio-circle.svg"
                    alt=""
                    aria-hidden
                    className="block size-full"
                    style={{ objectFit: "contain" }}
                  />
                </div>
              </div>
            );
          };

          // Mobile override → desktop copy hides below md, a repositioned
          // copy shows below md. (React flattens the returned array.)
          if (d.mobile) {
            return [
              circleEl(`c-${i}-d`, d.left, d.topVh, d.size, d.rot, "hidden md:block"),
              circleEl(`c-${i}-m`, d.mobile.left, d.mobile.topVh, d.mobile.size ?? d.size, d.mobile.rot, "md:hidden"),
            ];
          }
          return circleEl(`c-${i}`, d.left, d.topVh, d.size, d.rot, d.mobileHide ? "hidden md:block" : "");
        }

        // Diagonal — oversized so endpoints clip OFF the visible page.
        // Width 140vw, anchored at left: -20vw (so 20vw bleeds off each side).
        const leftVw = d.leftVw ?? -20;
        return (
          <svg
            key={`d-${i}`}
            className="absolute hidden md:block"
            preserveAspectRatio="none"
            fill="none"
            viewBox="0 0 1400 480"
            style={{
              left: `${leftVw}vw`,
              top: `${d.topVh}vh`,
              width: "140vw",
              height: "48vh",
              animation: driftAnim,
              willChange: "transform",
            }}
          >
            <line
              x1="0"
              y1={d.flip ? 0 : 480}
              x2="1400"
              y2={d.flip ? 480 : 0}
              stroke={STROKE}
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        );
      })}

      <style>{`
        @keyframes pageGeomFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        /* Small amplitude so the vertical hairlines stay visually centred
           around the content they frame (e.g. the WhyReturn boxes) — a big
           drift made the box look off-centre between its two outer lines. */
        @keyframes pageDriftX0 {
          0%, 100% { transform: translateX(0); }
          50%      { transform: translateX(2px); }
        }
        @keyframes pageDriftX1 {
          0%, 100% { transform: translateX(0); }
          50%      { transform: translateX(-2px); }
        }
        @keyframes pageDriftY0 {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(5px); }
        }
        @keyframes pageDriftY1 {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-4px); }
        }
        @keyframes pageDriftDecor0 {
          0%, 100% { transform: translate(0, 0); }
          50%      { transform: translate(12px, -8px); }
        }
        @keyframes pageDriftDecor1 {
          0%, 100% { transform: translate(0, 0); }
          50%      { transform: translate(-14px, 10px); }
        }
        @keyframes pageDriftDecor2 {
          0%, 100% { transform: translate(0, 0); }
          50%      { transform: translate(8px, 14px); }
        }
        /* Ultra-slow rotation drift for Rentlio circle marks. Each circle
           starts at its own --base-rot and completes a full revolution
           over 4–7 minutes, so the motion reads as gentle breathing
           rather than spinning. CW + CCW variants alternate so adjacent
           circles never look perfectly in sync. */
        @keyframes pageRentlioBreatheCw {
          from { transform: rotate(var(--base-rot, 0deg)); }
          to   { transform: rotate(calc(var(--base-rot, 0deg) + 360deg)); }
        }
        @keyframes pageRentlioBreatheCcw {
          from { transform: rotate(var(--base-rot, 0deg)); }
          to   { transform: rotate(calc(var(--base-rot, 0deg) - 360deg)); }
        }
      `}</style>
    </div>
  );
}
