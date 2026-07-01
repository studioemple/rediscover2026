"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ensureGsap, gsap, prefersReducedMotion } from "@/lib/animations";

type YearSpec = { value: number; col: number; ext?: string };

// 4 columns across the viewport. Each year sits at the BOTTOM of its column.
const YEARS: YearSpec[] = [
  { value: 22, col: 0 },
  { value: 23, col: 1 },
  { value: 24, col: 2 },
  { value: 25, col: 3, ext: "jpg" },
];

const CHAPTER_TEXT = "The Next Chapter";

export function IntroSequence({ onComplete }: { onComplete: () => void }) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const yearBgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const yearRefs = useRef<(HTMLSpanElement | null)[]>([]);
  // Slide A — "The next chapter" (soft fade)
  const slideARef = useRef<HTMLDivElement | null>(null);
  // Slide B — "5th edition" card
  const slideBRef = useRef<HTMLDivElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const [done, setDone] = useState(false);

  // Keep the latest onComplete without re-triggering the effect. Passing an
  // inline arrow as onComplete changes identity every parent render, so if we
  // depended on it the whole intro would rebuild + REPLAY on any re-render.
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    ensureGsap();

    if (prefersReducedMotion()) {
      setDone(true);
      onCompleteRef.current();
      return;
    }

    const yearEls = yearRefs.current.filter(
      (el): el is HTMLSpanElement => !!el,
    );
    if (yearEls.length === 0) {
      setDone(true);
      onCompleteRef.current();
      return;
    }

    const ctx = gsap.context(() => {
      const setText = (el: HTMLSpanElement, val: number) => {
        el.textContent = String(Math.floor(val)).padStart(2, "0");
      };

      // All years start hidden, blurred, slightly scaled.
      yearEls.forEach((el, i) => {
        gsap.set(el, { autoAlpha: 0, filter: "blur(24px)", scale: 0.94 });
        setText(el, 0);
        el.dataset.col = String(YEARS[i]?.col ?? i);
      });

      // Background images — all hidden initially; gentle blur + slight
      // scale-up so each one zooms in softly when revealed.
      const bgEls = yearBgRefs.current.filter(
        (el): el is HTMLDivElement => !!el,
      );
      gsap.set(bgEls, {
        autoAlpha: 0,
        scale: 1.0,
        filter: "blur(10px)",
        transformOrigin: "50% 50%",
      });

      // New slides start hidden.
      if (slideARef.current) gsap.set(slideARef.current, { autoAlpha: 0 });
      if (slideBRef.current) gsap.set(slideBRef.current, { autoAlpha: 0 });

      const tl = gsap.timeline();
      tlRef.current = tl;

      const finish = () => {
        setDone(true);
        onCompleteRef.current();
      };

      /* Reveal the real (hidden) hero instantly and finish — used as the
         safety fallback if the shared-element morph can't run. */
      const revealHeroInstant = () => {
        try {
          document
            .querySelectorAll<HTMLElement>("#hero [data-hero]")
            .forEach((el) => gsap.set(el, { autoAlpha: 1, clearProps: "transform,filter" }));
        } catch {
          /* noop */
        }
        finish();
      };

      /* ───── Shared-element morph: the Slide-B lines travel to their hero
         positions while the rest of the hero assembles, then hand off to the
         real hero elements. Runs at RUN time (positions/fonts settled). ───── */
      const runMorph = () => {
        try {
          const q = (s: string) => document.querySelector<HTMLElement>(s);
          const slideB = slideBRef.current;
          if (!slideB) return revealHeroInstant();

          const mDate = slideB.querySelector<HTMLElement>('[data-shared="date"]');
          const mEdition = slideB.querySelector<HTMLElement>('[data-shared="edition"]');
          const mVenue = slideB.querySelector<HTMLElement>('[data-shared="venue"]');

          const tEdition = q('[data-hero="edition"]');
          const tDate = q('[data-hero="date"]');
          const tVenue = q('[data-hero="venue"]');
          const heroHeader = q('[data-hero="header"]');
          const heroHeadline = q('[data-hero="headline"]');
          const heroLogo = q('[data-hero="logo"]');
          const heroStars = q('[data-hero="stars"]');
          const heroCta = q('[data-hero="cta"]');
          const heroScroll = q('[data-hero="scroll"]');
          const heroBrand = q('[data-hero="brand"]');

          if (!mDate || !mEdition || !mVenue || !tEdition || !tDate || !tVenue) {
            return revealHeroInstant();
          }

          // Make the overlay transparent so the real hero behind it shows
          // through (the page underneath is the same cream — no visual change).
          gsap.set(rootRef.current, { backgroundColor: "rgba(243,243,243,0)" });

          // FLIP-style deltas: center→center translate + font-size ratio scale.
          // We tween ONLY transforms (x/y/scale) — those are compositor-only,
          // so the shrink+travel is buttery smooth with no per-frame text
          // reflow/repaint (the old letter-spacing/color tweens caused that
          // "wobble"). Colour already matches (#303030); the tiny residual
          // letter-spacing delta is covered invisibly by the atomic swap.
          const compute = (mover: HTMLElement, target: HTMLElement) => {
            const f = mover.getBoundingClientRect();
            const l = target.getBoundingClientRect();
            const fSize = parseFloat(getComputedStyle(mover).fontSize) || 1;
            const lSize = parseFloat(getComputedStyle(target).fontSize) || 1;
            return {
              dx: l.left + l.width / 2 - (f.left + f.width / 2),
              dy: l.top + l.height / 2 - (f.top + f.height / 2),
              scale: lSize / fSize,
            };
          };

          // Promote the movers to their own compositor layers for a clean tween.
          gsap.set([mEdition, mDate, mVenue], {
            willChange: "transform",
            transformOrigin: "50% 50%",
            force3D: true,
          });

          const mt = gsap.timeline({ onComplete: finish });

          // Smooth, even ease-in-out (gentler than expo — no whip). All three
          // land together at ~1.05s. blur stays 0 so they read as sharp anchors.
          const EASE = "power3.inOut";
          const e = compute(mEdition, tEdition);
          mt.to(mEdition, { x: e.dx, y: e.dy, scale: e.scale, duration: 1.05, ease: EASE }, 0);
          const d = compute(mDate, tDate);
          mt.to(mDate, { x: d.dx, y: d.dy, scale: d.scale, duration: 1.02, ease: EASE }, 0.03);
          const v = compute(mVenue, tVenue);
          mt.to(mVenue, { x: v.dx, y: v.dy, scale: v.scale, duration: 1.0, ease: EASE }, 0.05);

          // Stars "crown" in above the venue line just before it lands.
          if (heroStars) {
            mt.fromTo(
              heroStars,
              { autoAlpha: 0, y: 8, scale: 0.85 },
              { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.6)" },
              0.85,
            );
          }

          // Rentlio brand mark at the very top fades in early.
          if (heroBrand) {
            mt.fromTo(
              heroBrand,
              { autoAlpha: 0, y: -8 },
              { autoAlpha: 1, y: 0, duration: 0.7, ease: "expo.out" },
              0.3,
            );
          }

          // Hero-only elements assemble (real nodes, revealed through the now
          // transparent overlay). "The Next Chapter" surfaces through the
          // shrinking edition word, timed to breathe with the ~1.05s morph.
          if (heroHeadline) {
            mt.fromTo(
              heroHeadline,
              { autoAlpha: 0, filter: "blur(24px)", y: 18, scale: 0.94 },
              { autoAlpha: 1, filter: "blur(0px)", y: 0, scale: 1, duration: 1.0, ease: "expo.out" },
              0.5,
            );
          }
          if (heroLogo) {
            mt.fromTo(
              heroLogo,
              { autoAlpha: 0, filter: "blur(14px)", y: 16 },
              { autoAlpha: 1, filter: "blur(0px)", y: 0, duration: 0.8, ease: "expo.out" },
              0.66,
            );
          }
          if (heroCta) {
            mt.fromTo(
              heroCta,
              { autoAlpha: 0, filter: "blur(8px)", y: 12 },
              { autoAlpha: 1, filter: "blur(0px)", y: 0, duration: 0.55, ease: "expo.out" },
              0.98,
            );
          }

          // Atomic swap for all three glyph-identical shared lines (edition,
          // date AND venue — the hero venue text now matches the mover). Exactly
          // when they land (~1.05), reveal the real weight-300 hero elements +
          // hide the movers in the SAME frame — pixel-coincident, zero jump.
          mt.add(() => {
            if (heroHeader) gsap.set(heroHeader, { autoAlpha: 1, clearProps: "filter" });
            if (tVenue) gsap.set(tVenue, { autoAlpha: 1, clearProps: "filter" });
            gsap.set([mEdition, mDate, mVenue], { autoAlpha: 0, willChange: "auto" });
          }, 1.05);

          // Scroll hint arrives last.
          if (heroScroll) {
            mt.fromTo(
              heroScroll,
              { autoAlpha: 0 },
              { autoAlpha: 1, duration: 0.5, ease: "power2.out" },
              1.18,
            );
          }
        } catch {
          revealHeroInstant();
        }
      };

      const enterDur = 0.28;
      const countDur = 0.5;
      const hold = 0.5; // longer hold so each year's photo can breathe
      const exitDur = 0.35;
      const frameDur = enterDur + countDur + hold;
      const baseStart = 0.28;

      // ───── Phase 1 — the 22 → 25 year counter ─────
      YEARS.forEach((spec, i) => {
        const el = yearEls[i];
        if (!el) return;
        const frameStart = baseStart + i * frameDur;
        const counter = { value: 0 };

        tl.call(() => setText(el, 0), [], frameStart);

        const bgEl = yearBgRefs.current[i];
        if (bgEl) {
          tl.to(
            bgEl,
            {
              autoAlpha: 1,
              filter: "blur(0px)",
              duration: 0.85,
              ease: "expo.out",
            },
            Math.max(0, frameStart - (i === 0 ? 0.2 : 0.15)),
          );
          tl.fromTo(
            bgEl,
            { scale: 1.0 },
            { scale: 1.07, duration: frameDur + 1.6, ease: "none" },
            Math.max(0, frameStart - 0.2),
          );
        }
        if (i > 0) {
          const prevBg = yearBgRefs.current[i - 1];
          if (prevBg) {
            tl.to(
              prevBg,
              {
                autoAlpha: 0,
                filter: "blur(8px)",
                duration: 0.85,
                ease: "power2.inOut",
              },
              Math.max(0, frameStart - 0.15),
            );
          }
        }

        tl.to(
          el,
          {
            autoAlpha: 1,
            filter: "blur(8px)",
            scale: 1,
            duration: enterDur,
            ease: "expo.out",
          },
          frameStart,
        );
        tl.to(
          counter,
          {
            value: spec.value,
            duration: countDur,
            ease: "power3.out",
            onUpdate: () => setText(el, counter.value),
          },
          frameStart + enterDur * 0.4,
        );
        tl.to(
          el,
          { filter: "blur(0px)", duration: 0.22, ease: "expo.out" },
          frameStart + enterDur + countDur - 0.16,
        );
        tl.to(
          el,
          {
            autoAlpha: 0,
            filter: "blur(18px)",
            scale: 1.06,
            duration: exitDur,
            ease: "expo.in",
          },
          frameStart + enterDur + countDur + hold,
        );
      });

      const phase2Start = baseStart + YEARS.length * frameDur + 0.05;

      // ───── Phase 2 — dissolve the dark frame into clean cream paper ─────
      tl.to(
        rootRef.current,
        {
          backgroundColor: "#F3F3F3",
          color: "#0A0A0F",
          duration: 0.85,
          ease: "expo.inOut",
        },
        phase2Start + 0.08,
      );
      const lastBg = yearBgRefs.current[YEARS.length - 1];
      if (lastBg) {
        tl.to(
          lastBg,
          { autoAlpha: 0, duration: 0.85, ease: "expo.inOut" },
          phase2Start + 0.08,
        );
      }

      // ───── Phase 3 — "The next chapter" soft fade in ─────
      const slideAStart = phase2Start + 0.95;
      const fadeInDur = 0.9;

      if (slideARef.current) {
        tl.fromTo(
          slideARef.current,
          { autoAlpha: 0, filter: "blur(16px)", y: 14 },
          {
            autoAlpha: 1,
            filter: "blur(0px)",
            y: 0,
            duration: fadeInDur,
            ease: "expo.out",
          },
          slideAStart,
        );
      }

      // Hold, then fade "The next chapter" back out (soft blur + lift).
      const aHold = 1.5;
      const aOutStart = slideAStart + fadeInDur + aHold;
      if (slideARef.current) {
        tl.to(
          slideARef.current,
          {
            autoAlpha: 0,
            filter: "blur(14px)",
            y: -30,
            duration: 0.7,
            ease: "expo.inOut",
          },
          aOutStart,
        );
      }

      // ───── Phase 4 — "5th edition" card rises in ─────
      const slideBStart = aOutStart + 0.25;
      if (slideBRef.current) {
        tl.set(slideBRef.current, { autoAlpha: 1 }, slideBStart - 0.01);
        const bItems =
          slideBRef.current.querySelectorAll<HTMLElement>("[data-b-item]");
        gsap.set(bItems, { autoAlpha: 0, y: 38, filter: "blur(16px)" });
        tl.to(
          bItems,
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.85,
            ease: "expo.out",
            stagger: 0.13,
          },
          slideBStart,
        );
      }

      // Transition B → hero: instead of dissolving the card, the shared lines
      // morph to their hero positions and the hero assembles around them.
      const bHold = 0.85;
      const bOutStart = slideBStart + 0.85 + 0.26 + bHold;
      tl.call(runMorph, [], bOutStart);
    }, rootRef);

    return () => ctx.revert();
    // Run ONCE on mount — onComplete is read through a ref so a changing
    // prop identity can't restart the intro.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (done) return null;

  // 4 columns; each year locked to the bottom of its quarter of the viewport.
  const COL_LAYOUT = [
    { left: "0%", width: "25%" },
    { left: "25%", width: "25%" },
    { left: "50%", width: "25%" },
    { left: "75%", width: "25%" },
  ] as const;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-50 overflow-hidden"
      style={{ backgroundColor: "#000000", color: "#ffffff" }}
      aria-label="Rediscover 2026 intro sequence"
    >
      {/* Year-specific background photos — one layer per year, all stacked. */}
      {YEARS.map((spec, i) => (
        <div
          key={`bg-${spec.value}`}
          ref={(el) => {
            yearBgRefs.current[i] = el;
          }}
          className="absolute inset-0 z-0"
          style={{ opacity: 0, visibility: "hidden" }}
        >
          <Image
            src={`/intro/year-${spec.value}.${spec.ext ?? "png"}`}
            alt=""
            fill
            priority={i === 0}
            quality={80}
            sizes="100vw"
            /* Mobile crop framing: 22 nudged left, 23/24/25 nudged right.
               Desktop keeps the centred crop. */
            className={`object-cover lg:object-center ${
              i === 0 ? "object-[35%_50%]" : "object-[65%_50%]"
            }`}
            style={{ filter: "grayscale(1)" }}
          />
        </div>
      ))}

      {/* Year columns — each pinned to the bottom of its quarter of the screen */}
      {YEARS.map((spec, i) => {
        const layout = COL_LAYOUT[i] ?? COL_LAYOUT[0];
        return (
          <div
            key={spec.value}
            className="absolute bottom-0 flex items-end justify-center"
            style={{
              left: layout.left,
              width: layout.width,
              paddingBottom: "6vh",
              height: "auto",
            }}
          >
            <span
              ref={(el) => {
                yearRefs.current[i] = el;
              }}
              className="block tabular-nums leading-none"
              style={{
                fontFamily: "var(--font-sora), sans-serif",
                fontSize: "min(20vw, 18rem)",
                fontWeight: 200,
                letterSpacing: "-0.05em",
                lineHeight: 0.85,
                fontVariantNumeric: "tabular-nums",
                opacity: 0,
                visibility: "hidden",
                filter: "blur(24px)",
              }}
            >
              00
            </span>
          </div>
        );
      })}

      {/* ── Slide A — "The next chapter" (soft fade) ── */}
      <div
        ref={slideARef}
        className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center"
        style={{ opacity: 0, visibility: "hidden" }}
      >
        <h2
          className="font-semibold"
          style={{
            fontFamily: "var(--font-sora), sans-serif",
            fontSize: "clamp(2.25rem, 7.5vw, 7.5rem)",
            letterSpacing: "-0.04em",
            lineHeight: 1.02,
            color: "#111111",
          }}
        >
          {CHAPTER_TEXT}
        </h2>
      </div>

      {/* ── Slide B — "5th edition" card ── */}
      <div
        ref={slideBRef}
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        style={{ opacity: 0, visibility: "hidden" }}
      >
        {/* Mirrors the hero header exactly (small "5th EDITION" over a big
            "November, 2026", both Sora weight 300, same case + tracking),
            just enlarged — so the morph into the hero is a pure scale, no
            weight/case jump. */}
        <p
          data-b-item
          data-shared="edition"
          style={{
            fontFamily: "var(--font-sora), sans-serif",
            fontSize: "clamp(1.5rem, 3.6vw, 2.75rem)",
            fontWeight: 300,
            letterSpacing: "0.02em",
            lineHeight: 1.2,
            color: "#303030",
          }}
        >
          5th EDITION
        </p>
        <p
          data-b-item
          data-shared="date"
          className="mt-2 whitespace-nowrap md:mt-3"
          style={{
            fontFamily: "var(--font-sora), sans-serif",
            fontSize: "clamp(2.1rem, 8.8vw, 7.5rem)",
            fontWeight: 300,
            letterSpacing: "-0.035em",
            lineHeight: 1.1,
            color: "#303030",
          }}
        >
          November, 2026
        </p>
        <p
          data-b-item
          data-shared="venue"
          className="mt-7 max-w-[280px] uppercase sm:max-w-none md:mt-9"
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "clamp(0.72rem, 1.6vw, 1.25rem)",
            fontWeight: 400,
            letterSpacing: "0.02em",
            lineHeight: 1.5,
            color: "#303030",
          }}
        >
          Falkensteiner Punta Skala Resort&nbsp;&nbsp;•&nbsp;&nbsp;Zadar, Petrčane
        </p>
      </div>
    </div>
  );
}
