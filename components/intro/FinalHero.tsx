"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { heroCopy, event } from "@/lib/content";
import { gsap, ensureGsap } from "@/lib/animations";

/* ─── Background geometry ─── */
function HeroGeometry() {
  const stroke = "#D9D9D9";
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {[10.45, 30.6, 70.8, 89.55].map((pct) => (
        <div key={`v-${pct}`} className="absolute top-0 bottom-0"
          style={{ left: `${pct}%`, width: 1, background: stroke }} />
      ))}
      {[10.14, 21.06, 73.19].map((pct) => (
        <div key={`h-${pct}`} className="absolute left-0 right-0"
          style={{ top: `${pct}%`, height: 1, background: stroke }} />
      ))}
      <svg className="absolute right-0 top-0" width="55%" height="40%"
        viewBox="0 0 800 400" preserveAspectRatio="none" fill="none">
        <line x1="0" y1="400" x2="800" y2="0" stroke={stroke} strokeWidth={1}
          vectorEffect="non-scaling-stroke" />
      </svg>
      <svg className="absolute" fill="none"
        style={{ left: "calc(23.16% - 224px)", top: "calc(-1.16% - 224px)", width: 448, height: 448 }}>
        <circle cx="224" cy="224" r="224" stroke={stroke} strokeWidth={1}
          vectorEffect="non-scaling-stroke" />
      </svg>
      <svg className="absolute" fill="none"
        style={{ left: "calc(70.8% - 224px)", top: "calc(103.4% - 224px)", width: 448, height: 448 }}>
        <circle cx="224" cy="224" r="224" stroke={stroke} strokeWidth={1}
          vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}

/* ─── Stars ─── */
function StarRow() {
  return (
    <div className="flex items-center justify-center" style={{ gap: 2, color: "#303030" }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 2L14.618 9.172H22.5L16.122 13.914L18.74 21.086L12 16.343L5.26 21.086L7.878 13.914L1.5 9.172H9.382L12 2Z" />
        </svg>
      ))}
    </div>
  );
}

/* ─── FinalHero ─── */
export function FinalHero({ id = "hero", shouldAnimate = false }: { id?: string; shouldAnimate?: boolean }) {
  const sectionRef   = useRef<HTMLDivElement>(null);
  const rediscoverRef = useRef<HTMLHeadingElement>(null);
  const headerRef    = useRef<HTMLDivElement>(null);
  const questionRef  = useRef<HTMLParagraphElement>(null);
  const venueRef     = useRef<HTMLDivElement>(null);
  const ctasRef      = useRef<HTMLDivElement>(null);
  const scrollRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureGsap();
    const els = [
      rediscoverRef.current,
      headerRef.current,
      questionRef.current,
      venueRef.current,
      ctasRef.current,
      scrollRef.current,
    ].filter(Boolean);

    // Keep everything hidden until we animate in
    gsap.set(els, { autoAlpha: 0 });
  }, []);

  useEffect(() => {
    if (!shouldAnimate) return;
    ensureGsap();

    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

    // 1. Rediscover — big blur reveal (the main event)
    tl.fromTo(
      rediscoverRef.current,
      { autoAlpha: 0, filter: "blur(24px)", y: 20 },
      { autoAlpha: 1, filter: "blur(0px)", y: 0, duration: 1.1 },
      0.05,
    );

    // 2. Header (5th EDITION / 2026 November) — slides in from above
    tl.fromTo(
      headerRef.current,
      { autoAlpha: 0, filter: "blur(10px)", y: -14 },
      { autoAlpha: 1, filter: "blur(0px)", y: 0, duration: 0.75 },
      0.55,
    );

    // 3. "What Now?" — blurs in below
    tl.fromTo(
      questionRef.current,
      { autoAlpha: 0, filter: "blur(14px)", y: 12 },
      { autoAlpha: 1, filter: "blur(0px)", y: 0, duration: 0.75 },
      0.75,
    );

    // 4. Stars + location
    tl.fromTo(
      venueRef.current,
      { autoAlpha: 0, y: 10 },
      { autoAlpha: 1, y: 0, duration: 0.6 },
      0.95,
    );

    // 5. CTAs
    tl.fromTo(
      ctasRef.current,
      { autoAlpha: 0, y: 10 },
      { autoAlpha: 1, y: 0, duration: 0.55 },
      1.1,
    );

    // 6. Scroll hint — last, after everything settles
    tl.fromTo(
      scrollRef.current,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.5 },
      1.35,
    );

    return () => { tl.kill(); };
  }, [shouldAnimate]);

  return (
    <section
      id={id}
      ref={sectionRef}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden"
      /* No explicit bg — cream comes from the page-level <main>, so the
         PageGeometry behind it is visible through the hero. */
    >
      {/* HeroGeometry removed — page-wide PageGeometry now provides the
          geometric backdrop across the entire site. */}

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-6 text-center">

        {/* Header — 5th EDITION / 2026 November */}
        <div
          ref={headerRef}
          className="mb-10 flex flex-col items-center"
          style={{ color: "#303030", fontFamily: "var(--font-sora), sans-serif" }}
        >
          <p style={{ fontSize: 26, fontWeight: 300, lineHeight: 1.2 }}>5th EDITION</p>
          <p style={{ fontSize: 48, fontWeight: 300, letterSpacing: "-1.8px", lineHeight: 1.2 }}>
            November, 2026
          </p>
        </div>

        {/* Rediscover — main wordmark, blurs in first */}
        <h1
          ref={rediscoverRef}
          aria-label="Rediscover"
          className="relative w-full max-w-[1200px]"
          style={{ aspectRatio: "1199 / 181" }}
        >
          <Image
            src="/rediscover-logo-2026.svg"
            alt="Rediscover"
            fill
            priority
            sizes="(min-width: 1280px) 1200px, 90vw"
            className="object-contain"
          />
        </h1>

        {/* The Next Chapter */}
        <p
          ref={questionRef}
          className="mt-6 lg:mt-10"
          style={{
            fontFamily: "var(--font-sora), sans-serif",
            fontSize: "clamp(2rem, 3.5vw, 50px)",
            fontWeight: 300,
            letterSpacing: "-0.04em",
            color: "#303030",
            lineHeight: 1.2,
          }}
        >
          The Next Chapter
        </p>

        {/* Stars + location */}
        <div ref={venueRef} className="mt-16 flex flex-col items-center gap-3">
          <StarRow />
          <p
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 18,
              fontWeight: 400,
              lineHeight: 2,
              textTransform: "uppercase",
              color: "#303030",
              letterSpacing: "0.02em",
            }}
          >
            Falkensteiner Punta Skala Resort • Zadar
          </p>
        </div>

        {/* CTAs */}
        <div ref={ctasRef} className="mt-12 flex justify-center">
          <a href="#register">
            <Button variant="primary">{event.registerCta}</Button>
          </a>
        </div>
      </div>

      {/* Scroll hint — floats gently */}
      <div
        ref={scrollRef}
        className="absolute bottom-10 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
        style={{ animation: "heroFloat 3s ease-in-out infinite" }}
      >
        <span style={{
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: 11, fontWeight: 400,
          letterSpacing: "0.3em", textTransform: "uppercase",
          color: "#303030", opacity: 0.45,
        }}>
          {heroCopy.scrollHint}
        </span>
        <span className="block h-16 w-px" style={{ background: "#D9D9D9" }} aria-hidden />
      </div>

      <style>{`
        @keyframes heroFloat {
          0%, 100% { transform: translateX(-50%) translateY(0px); }
          50%       { transform: translateX(-50%) translateY(10px); }
        }
      `}</style>
    </section>
  );
}
