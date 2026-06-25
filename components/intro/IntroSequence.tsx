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

const CHAPTER_TEXT = "The next chapter";

export function IntroSequence({ onComplete }: { onComplete: () => void }) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const yearBgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const yearRefs = useRef<(HTMLSpanElement | null)[]>([]);
  // Slide A — "The next chapter" typewriter
  const slideARef = useRef<HTMLDivElement | null>(null);
  const chapterRef = useRef<HTMLSpanElement | null>(null);
  const caretRef = useRef<HTMLSpanElement | null>(null);
  // Slide B — "5th edition" card
  const slideBRef = useRef<HTMLDivElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    ensureGsap();

    if (prefersReducedMotion()) {
      setDone(true);
      onComplete();
      return;
    }

    const yearEls = yearRefs.current.filter(
      (el): el is HTMLSpanElement => !!el,
    );
    if (yearEls.length === 0) {
      setDone(true);
      onComplete();
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
      if (caretRef.current) gsap.set(caretRef.current, { autoAlpha: 0 });

      const tl = gsap.timeline({
        onComplete: () => {
          setDone(true);
          onComplete();
        },
      });
      tlRef.current = tl;

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

      // ───── Phase 3 — "The next chapter" typewriter ─────
      const slideAStart = phase2Start + 0.95;
      const typeDur = CHAPTER_TEXT.length * 0.04; // ~0.64s — brisk

      if (slideARef.current) {
        tl.set(slideARef.current, { autoAlpha: 1 }, slideAStart - 0.01);
        tl.fromTo(
          slideARef.current,
          { y: 14 },
          { y: 0, duration: 0.7, ease: "expo.out" },
          slideAStart,
        );
      }
      if (caretRef.current) {
        tl.set(caretRef.current, { autoAlpha: 1 }, slideAStart);
      }
      // The typewriter itself — reveal one character at a time.
      const typer = { n: 0 };
      tl.to(
        typer,
        {
          n: CHAPTER_TEXT.length,
          duration: typeDur,
          ease: "none",
          onUpdate: () => {
            if (chapterRef.current) {
              chapterRef.current.textContent = CHAPTER_TEXT.slice(
                0,
                Math.round(typer.n),
              );
            }
          },
        },
        slideAStart,
      );
      // Caret fades once typing settles.
      if (caretRef.current) {
        tl.to(
          caretRef.current,
          { autoAlpha: 0, duration: 0.3 },
          slideAStart + typeDur + 0.45,
        );
      }

      // Transform A → B: chapter line lifts + blurs away.
      const aHold = 0.5;
      const aOutStart = slideAStart + typeDur + aHold;
      if (slideARef.current) {
        tl.to(
          slideARef.current,
          {
            autoAlpha: 0,
            filter: "blur(14px)",
            y: -36,
            scale: 0.96,
            duration: 0.6,
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

      // Transition B → hero: the whole card pushes forward + dissolves so the
      // real FinalHero (which animates itself in) is revealed behind it.
      const bHold = 0.85;
      const bOutStart = slideBStart + 0.85 + 0.26 + bHold;
      if (slideBRef.current) {
        tl.to(
          slideBRef.current,
          {
            autoAlpha: 0,
            filter: "blur(22px)",
            scale: 1.06,
            duration: 0.7,
            ease: "expo.in",
          },
          bOutStart,
        );
      }
    }, rootRef);

    return () => ctx.revert();
  }, [onComplete]);

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
            className="object-cover"
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

      {/* ── Slide A — "The next chapter" (typewriter) ── */}
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
          <span ref={chapterRef} />
          <span
            ref={caretRef}
            aria-hidden
            className="intro-caret"
            style={{
              display: "inline-block",
              marginLeft: "0.06em",
              fontWeight: 200,
              color: "#111111",
            }}
          >
            |
          </span>
        </h2>
      </div>

      {/* ── Slide B — "5th edition" card ── */}
      <div
        ref={slideBRef}
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        style={{ opacity: 0, visibility: "hidden" }}
      >
        <p
          data-b-item
          className="text-base uppercase tracking-[0.3em] md:text-xl"
          style={{ color: "#303030", fontWeight: 500 }}
        >
          November, 2026
        </p>
        <h2
          data-b-item
          className="mt-4 font-semibold md:mt-5"
          style={{
            fontFamily: "var(--font-sora), sans-serif",
            fontSize: "clamp(2.75rem, 9vw, 9rem)",
            letterSpacing: "-0.05em",
            lineHeight: 0.95,
            color: "#111111",
          }}
        >
          5th edition
        </h2>
        <p
          data-b-item
          className="mt-5 text-sm uppercase tracking-[0.24em] md:mt-7 md:text-lg"
          style={{ color: "#303030", fontWeight: 400 }}
        >
          Falkensteiner Punta Skala Resort&nbsp;&nbsp;•&nbsp;&nbsp;Zadar, Petrčane
        </p>
      </div>

      <style>{`
        @keyframes introCaretBlink {
          0%, 49%  { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        .intro-caret {
          animation: introCaretBlink 0.9s steps(1) infinite;
        }
      `}</style>
    </div>
  );
}
