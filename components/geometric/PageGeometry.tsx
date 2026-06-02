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

/* Vertical hairlines — span the full document height. */
const VERTICAL_LINES = [10.45, 30.6, 70.8, 89.55];

/* Horizontal hairlines — distributed across the whole document.
   Wider gap kept clear around the Audience section (≈320–600vh) so the
   "Made for those shaping…" headline + titles list stay completely free. */
const HORIZONTAL_LINES = [
  18, 92, 175, 260,
  // (Audience zone 320–600vh intentionally line-free)
  640, 760, 900, 1030, 1190, 1320, 1460,
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
    }
  | {
      kind: "diagonal";
      topVh: number;
      flip?: boolean; // if true, line goes ↘ instead of ↗
      leftVw?: number; // override default left positioning
    };

const DECORATIONS: Decor[] = [
  // ───── Top zone (Hero / Aftermovie 0–200vh) ─────
  // Hero left circle — size 900, ~60% visible (40% / 360px off the left edge),
  // anchored at 38vh so it lives in the middle of the hero zone.
  { kind: "circle",   left: "-360px",             topVh: 38,   size: 900 },
  // Hero right circle — mirrors the left one, ~60% visible off the right edge,
  // slightly higher so the two read as a paired but not symmetric duo.
  { kind: "circle",   left: "calc(100% - 540px)", topVh: 62,   size: 900 },
  { kind: "diagonal", topVh: 4 },
  { kind: "diagonal", topVh: 76, flip: true },
  { kind: "circle",   left: "78%",                topVh: 145,  size: 380 },

  // ───── Value-prop zone (200–320vh) ─────
  { kind: "diagonal", topVh: 215 },
  // Value-prop left circle — doubled in size for stronger presence behind
  // marquee; pinned at rot: 0 so the Rentlio "R" reads upright.
  { kind: "circle",   left: "-6%",                topVh: 260,  size: 920, rot: 0 },

  // ───── Audience zone (≈320–700vh) intentionally CLEAR — no lines,
  //       circles or diagonals cross the centered title + titles list.
  //       Buffer extended on both sides because section heights vary. ─────

  // ───── Program / Speakers zone (≈700–860vh) ─────
  { kind: "circle",   left: "8%",                 topVh: 720,  size: 500 },
  { kind: "circle",   left: "80%",                topVh: 760,  size: 380 },
  { kind: "diagonal", topVh: 800, flip: true },
  // (Speakers headline backdrops are rendered locally inside
  //  SpeakersSection.tsx, so they're guaranteed to sit in that section
  //  regardless of how the document's total height shifts.)

  // ───── Gallery / Testimonials zone (800–1100vh) ─────
  { kind: "diagonal", topVh: 830 },
  // (Left circle removed — it was bleeding into the testimonials section.)
  { kind: "diagonal", topVh: 950, flip: true },
  { kind: "circle",   left: "72%",                topVh: 1020, size: 440 },
  { kind: "diagonal", topVh: 1080 },

  // ───── Partners / Register zone (1100–1400vh) ─────
  { kind: "diagonal", topVh: 1160, flip: true },
  // (Partners-left backdrop is rendered locally inside PartnersSection.tsx,
  //  so it's guaranteed to sit above the logo grid regardless of how the
  //  document's total height shifts.)
  { kind: "diagonal", topVh: 1280 },
  { kind: "circle",   left: "82%",                topVh: 1340, size: 460 },
  { kind: "diagonal", topVh: 1390, flip: true },

  // ───── FAQ / Footer zone (1400–1600vh) ─────
  { kind: "circle",   left: "calc(70% - 224px)",  topVh: 1450, size: 448 },
  { kind: "diagonal", topVh: 1500 },
  { kind: "circle",   left: "20%",                topVh: 1560, size: 380 },
];

export function PageGeometry() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
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

      {/* Horizontal hairlines */}
      {HORIZONTAL_LINES.map((topVh, i) => (
        <div
          key={`h-${i}-${topVh}`}
          className="absolute left-0 right-0"
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
          const baseRot = d.rot ?? (i * 137 + 41) % 360;
          const breatheDur = 240 + (i % 6) * 40; // 240–440s — almost imperceptible
          const breatheDir = i % 2 === 0 ? 1 : -1; // alternate cw / ccw
          return (
            <div
              key={`c-${i}`}
              className="absolute"
              style={{
                left: d.left,
                top: `calc(${d.topVh}vh - ${d.size / 2}px)`,
                width: d.size,
                height: d.size,
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
        }

        // Diagonal — oversized so endpoints clip OFF the visible page.
        // Width 140vw, anchored at left: -20vw (so 20vw bleeds off each side).
        const leftVw = d.leftVw ?? -20;
        return (
          <svg
            key={`d-${i}`}
            className="absolute"
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
        @keyframes pageDriftX0 {
          0%, 100% { transform: translateX(0); }
          50%      { transform: translateX(7px); }
        }
        @keyframes pageDriftX1 {
          0%, 100% { transform: translateX(0); }
          50%      { transform: translateX(-6px); }
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
