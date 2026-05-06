"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ensureGsap, gsap, prefersReducedMotion } from "@/lib/animations";

type YearSpec = { value: number; col: number };

// 4 columns across the viewport. Each year sits at the BOTTOM of its column.
const YEARS: YearSpec[] = [
  { value: 22, col: 0 },
  { value: 23, col: 1 },
  { value: 24, col: 2 },
  { value: 25, col: 3 },
];

export function IntroSequence({ onComplete }: { onComplete: () => void }) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const bgImageRef = useRef<HTMLDivElement | null>(null);
  const yearRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const revealRef = useRef<HTMLDivElement | null>(null);
  const whatNowRef = useRef<HTMLHeadingElement | null>(null);
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
        // ensure column position is locked from the start
        el.dataset.col = String(YEARS[i]?.col ?? i);
      });

      if (revealRef.current) gsap.set(revealRef.current, { autoAlpha: 0 });
      if (headerRef.current)
        gsap.set(headerRef.current, { autoAlpha: 0, y: -8 });

      const tl = gsap.timeline({
        onComplete: () => {
          setDone(true);
          onComplete();
        },
      });
      tlRef.current = tl;

      if (headerRef.current) {
        tl.to(
          headerRef.current,
          { autoAlpha: 1, y: 0, duration: 0.5, ease: "expo.out" },
          0,
        );
      }

      const enterDur = 0.18;
      const countDur = 0.34;
      const hold = 0.1;
      const exitDur = 0.24;
      // The next year STARTS its entrance the moment the current one starts
      // exiting — no dead air between frames.
      const frameDur = enterDur + countDur + hold;
      const baseStart = 0.22;

      YEARS.forEach((spec, i) => {
        const el = yearEls[i];
        if (!el) return;
        const frameStart = baseStart + i * frameDur;
        const counter = { value: 0 };

        tl.call(() => setText(el, 0), [], frameStart);

        // 1. Enter — blur in.
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

        // 2. Counter rolls from 00 → target.
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

        // 3. Sharpen.
        tl.to(
          el,
          { filter: "blur(0px)", duration: 0.22, ease: "expo.out" },
          frameStart + enterDur + countDur - 0.16,
        );

        // 4. Exit (every frame, including the last — last one fades into phase 2).
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

      if (headerRef.current) {
        tl.to(
          headerRef.current,
          { autoAlpha: 0, y: -8, duration: 0.4, ease: "expo.in" },
          phase2Start,
        );
      }

      tl.to(
        rootRef.current,
        {
          backgroundColor: "#F9F7F3",
          color: "#0A0A0F",
          duration: 0.85,
          ease: "expo.inOut",
        },
        phase2Start + 0.08,
      );

      // Fade out the background photo at the same time as the cream
      // background fades in — the image reads as the "dark stage" mood
      // that gives way to the calm light hero.
      if (bgImageRef.current) {
        tl.to(
          bgImageRef.current,
          { autoAlpha: 0, duration: 0.85, ease: "expo.inOut" },
          phase2Start + 0.08,
        );
      }

      const phase3Start = phase2Start + 0.75;

      if (revealRef.current) {
        tl.to(
          revealRef.current,
          { autoAlpha: 1, duration: 0.5, ease: "expo.out" },
          phase3Start,
        );

        // Side items (eyebrow + venue) animate together; "What Now?" gets
        // its own bombastic treatment.
        const sideItems = revealRef.current.querySelectorAll<HTMLElement>(
          "[data-reveal-item]:not([data-reveal-hero])",
        );
        if (sideItems.length > 0) {
          gsap.set(sideItems, { autoAlpha: 0, filter: "blur(14px)", y: 16 });
          tl.to(
            sideItems,
            {
              autoAlpha: 1,
              filter: "blur(0px)",
              y: 0,
              duration: 0.9,
              ease: "expo.out",
              stagger: 0.18,
            },
            phase3Start + 0.1,
          );
        }

        // "What Now?" entrance — slightly slower, starts smaller and
        // pushes forward as it sharpens.
        if (whatNowRef.current) {
          gsap.set(whatNowRef.current, {
            autoAlpha: 0,
            filter: "blur(28px)",
            scale: 0.86,
            transformOrigin: "50% 50%",
          });
          tl.to(
            whatNowRef.current,
            {
              autoAlpha: 1,
              filter: "blur(0px)",
              scale: 1,
              duration: 1.2,
              ease: "expo.out",
            },
            phase3Start + 0.25,
          );
        }
      }

      // ───── Phase 4 — "What Now?" zoom-out blast through the screen ─────
      const blastStart = phase3Start + 1.9;

      // Side items + header fade out first so What Now? owns the moment.
      if (revealRef.current) {
        const sideItems = revealRef.current.querySelectorAll<HTMLElement>(
          "[data-reveal-item]:not([data-reveal-hero])",
        );
        if (sideItems.length > 0) {
          tl.to(
            sideItems,
            {
              autoAlpha: 0,
              filter: "blur(8px)",
              y: -8,
              duration: 0.45,
              ease: "expo.in",
              stagger: 0.04,
            },
            blastStart,
          );
        }
      }

      // The main event — What Now? scales up massively and dissolves toward
      // the camera, like the camera flies through the text.
      if (whatNowRef.current) {
        tl.to(
          whatNowRef.current,
          {
            scale: 4.2,
            filter: "blur(48px)",
            autoAlpha: 0,
            duration: 1.1,
            ease: "expo.in",
          },
          blastStart + 0.15,
        );
      }
    }, rootRef);

    return () => ctx.revert();
  }, [onComplete]);

  function skip() {
    if (tlRef.current) tlRef.current.progress(0.999);
    setDone(true);
    onComplete();
  }

  if (done) return null;

  // 4 columns; each year locked to the bottom of its column.
  // The horizontal alignment inside each column varies a bit so the
  // composition feels editorial rather than a strict grid.
  // Each year is centered horizontally inside its own quarter of the
  // viewport — that yields even spacing between all four numbers.
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
      {/* Background image — Rediscover stage photo with dark overlay */}
      <div ref={bgImageRef} className="absolute inset-0 z-0">
        <Image
          src="/intro-bg.jpg"
          alt=""
          fill
          priority
          quality={80}
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div
        ref={headerRef}
        className="absolute top-8 left-6 z-10 flex flex-col gap-1 text-[10px] uppercase tracking-[0.32em] lg:top-12 lg:left-16 lg:text-xs"
        style={{ opacity: 0, visibility: "hidden" }}
      >
        <p>Rediscover · 5th Edition</p>
        <p>November 2026 · Zadar</p>
      </div>

      <button
        type="button"
        onClick={skip}
        className="absolute right-6 top-6 z-10 inline-flex items-center gap-2 rounded-full border border-current/30 px-4 py-2 text-[10px] uppercase tracking-[0.28em] opacity-70 transition-opacity duration-200 hover:opacity-100 focus-ring cursor-pointer"
        aria-label="Skip intro"
      >
        Skip intro
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M2 1L7 5L2 9" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </button>

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

      {/* Phase 3 reveal */}
      <div
        ref={revealRef}
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        style={{ opacity: 0, visibility: "hidden" }}
      >
        <p
          data-reveal-item
          className="mb-8 text-xs uppercase tracking-[0.32em] opacity-70"
          style={{ opacity: 0 }}
        >
          5th Edition · November 2026
        </p>
        <h1
          ref={whatNowRef}
          data-reveal-item
          data-reveal-hero
          className="headline font-semibold will-change-transform"
          style={{
            fontSize: "clamp(4.5rem, 20vw, 18rem)",
            letterSpacing: "-0.05em",
            lineHeight: 0.92,
            opacity: 0,
          }}
        >
          What now?
        </h1>
        <p
          data-reveal-item
          className="mt-8 text-sm uppercase tracking-[0.28em] opacity-70 md:text-base"
          style={{ opacity: 0 }}
        >
          Rediscover · Zadar
        </p>
      </div>
    </div>
  );
}
