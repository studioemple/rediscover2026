"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { useContent } from "@/components/i18n/LanguageProvider";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { gsap, ensureGsap, prefersReducedMotion } from "@/lib/animations";

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
  const { heroCopy, event } = useContent();
  const sectionRef   = useRef<HTMLDivElement>(null);
  const brandRef     = useRef<HTMLDivElement>(null);
  const rediscoverRef = useRef<HTMLHeadingElement>(null);
  const headerRef    = useRef<HTMLDivElement>(null);
  const questionRef  = useRef<HTMLDivElement>(null);
  const starsRef     = useRef<HTMLDivElement>(null);
  const venueLineRef = useRef<HTMLParagraphElement>(null);
  const ctasRef      = useRef<HTMLDivElement>(null);

  // The venue wrapper itself stays visible (layout container); its stars +
  // line are hidden/animated individually so the intro can morph the venue
  // line into place and pop the stars in above it.
  const hiddenEls = () =>
    [
      brandRef.current,
      rediscoverRef.current,
      headerRef.current,
      questionRef.current,
      starsRef.current,
      venueLineRef.current,
      ctasRef.current,
    ].filter(Boolean);

  useEffect(() => {
    ensureGsap();
    // Reduced motion → hero is fully formed on first paint (no morph plays).
    // Otherwise start hidden; the IntroSequence's shared-element morph is the
    // single source of truth that reveals these elements.
    if (prefersReducedMotion()) {
      gsap.set(hiddenEls(), { autoAlpha: 1, clearProps: "transform,filter" });
    } else {
      gsap.set(hiddenEls(), { autoAlpha: 0 });
    }
  }, []);

  // Safety net: once the intro finishes (introDone), guarantee the hero is
  // visible. The intro's morph already revealed these nodes during play, so
  // this is idempotent — it just snaps any residual state / covers the case
  // where the morph bailed out.
  useEffect(() => {
    if (!shouldAnimate) return;
    ensureGsap();
    const els = hiddenEls();
    gsap.set(els, { autoAlpha: 1 });
  }, [shouldAnimate]);

  return (
    <section
      id={id}
      ref={sectionRef}
      className="relative flex min-h-screen w-full flex-col items-center"
      /* No explicit bg — cream comes from the page-level <main>, so the
         PageGeometry behind it is visible through the hero.
         overflow-x clipped (headline whitespace-nowrap can run wide) but
         overflow-y VISIBLE so that when the viewport is short (browser zoom,
         small laptops) the content grows the section + scrolls instead of
         being vertically centered up UNDER the fixed top brand/switcher. */
      style={{ overflowX: "clip", overflowY: "visible" }}
    >
      {/* HeroGeometry removed — page-wide PageGeometry now provides the
          geometric backdrop across the entire site. */}

      {/* Rentlio brand mark. Shares a fixed-height band (h-9) with the language
          switcher so both sit on the exact same horizontal line regardless of
          their differing intrinsic heights. Mobile: pinned LEFT. Desktop:
          centered. */}
      <div
        ref={brandRef}
        data-hero="brand"
        aria-label="Rentlio"
        className="absolute left-4 top-5 z-10 flex h-9 items-center lg:left-1/2 lg:top-8 lg:h-11 lg:-translate-x-1/2"
      >
        <Image
          src="/rentlio-logo.svg"
          alt="Rentlio"
          width={336}
          height={76}
          className="h-[22px] w-auto lg:h-[30px]"
        />
      </div>

      {/* Language switcher — same top-band as the brand mark (top-right). */}
      <div className="absolute right-4 top-5 z-20 flex h-9 items-center lg:right-8 lg:top-8 lg:h-11">
        <LanguageSwitcher />
      </div>

      {/* my-auto centers the block vertically like justify-center did, BUT when
          the block is taller than the viewport the auto margins collapse to 0
          and it top-aligns (overflowing DOWNWARD) instead of rising up under
          the brand mark. pt reserves the top brand/switcher band. */}
      <div className="relative z-10 mx-auto my-auto flex w-full max-w-6xl flex-col items-center px-6 pt-24 pb-16 text-center lg:pt-28">

        {/* Header — 5th EDITION / 2026 November */}
        <div
          ref={headerRef}
          data-hero="header"
          className="mb-8 flex flex-col items-center lg:mb-10"
          style={{ color: "#303030", fontFamily: "var(--font-sora), sans-serif" }}
        >
          <p data-hero="edition" style={{ fontSize: "clamp(15px, 4.3vw, 26px)", fontWeight: 300, lineHeight: 1.2 }}>{heroCopy.edition}</p>
          <p
            data-hero="date"
            className="whitespace-nowrap"
            style={{ fontSize: "clamp(26px, 7vw, 48px)", fontWeight: 300, letterSpacing: "-0.038em", lineHeight: 1.2 }}
          >
            {heroCopy.date}
          </p>
        </div>

        {/* The Next Chapter — main headline, blurs in first.
            whitespace-nowrap keeps it on ONE line; the 11vw clamp scales the
            size so the single line always fits the container (≈8.4em wide). */}
        <h1
          ref={rediscoverRef}
          data-hero="headline"
          className="hero-headline leading-[1.0] md:whitespace-nowrap"
          style={{
            fontFamily: "var(--font-sora), sans-serif",
            fontWeight: 600,
            letterSpacing: "-0.04em",
            color: "#0A0A0F",
          }}
        >
          {/* Mobile: breaks to "The Next" / "Chapter". Desktop: one line. */}
          <span className="block md:inline">The Next</span>{" "}
          <span className="block md:inline">Chapter</span>
        </h1>

        {/* Rediscover — wordmark below the headline */}
        <div
          ref={questionRef}
          data-hero="logo"
          aria-label="Rediscover"
          className="relative mt-8 w-full max-w-[200px] sm:max-w-[300px] lg:mt-12 lg:max-w-[440px]"
          style={{ aspectRatio: "1199 / 181" }}
        >
          <Image
            src="/rediscover-logo-2026.svg"
            alt="Rediscover"
            fill
            priority
            sizes="(min-width: 1280px) 440px, 60vw"
            className="object-contain"
          />
        </div>

        {/* Stars + location */}
        <div data-hero="venue-wrap" className="mt-16 flex flex-col items-center gap-3">
          <div ref={starsRef} data-hero="stars">
            <StarRow />
          </div>
          <p
            ref={venueLineRef}
            data-hero="venue"
            className="max-w-[280px] sm:max-w-none"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "clamp(11.5px, 3.6vw, 18px)",
              fontWeight: 400,
              lineHeight: 1.5,
              textTransform: "uppercase",
              color: "#303030",
              letterSpacing: "0.02em",
            }}
          >
            Falkensteiner Punta Skala Resort&nbsp;&nbsp;•&nbsp;&nbsp;Zadar, Petrčane
          </p>
        </div>

        {/* CTAs */}
        <div ref={ctasRef} data-hero="cta" className="mt-12 flex justify-center">
          <a href="#register">
            <Button variant="primary">{event.registerCta}</Button>
          </a>
        </div>
      </div>

    </section>
  );
}
