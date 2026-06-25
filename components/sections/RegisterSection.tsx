"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { WordReveal } from "@/components/ui/WordReveal";
import { register } from "@/lib/content";
import { ensureGsap, gsap, prefersReducedMotion } from "@/lib/animations";

/* 6 large event photos in the side gutters around the title + form —
   same orbit pattern used in the Audience section so the two pages feel
   visually paired. Positions in % so they stay inside the section
   regardless of viewport. */
type Tile = {
  src: string;
  side: "left" | "right";
  topPct: number;     // 0..100 (vertical anchor inside section)
  offsetPct: number;  // horizontal offset from the section edge, in %
  size: number;       // px (lg)
  rot: number;
  dur: number;
  delay: number;
};

const ORBIT_IMAGES: Tile[] = [
  { src: "/register/reg-1.png", side: "left",  topPct: 24, offsetPct: 10, size: 300, rot: -6, dur: 7.5, delay: 0.0 },
  { src: "/register/reg-2.png", side: "right", topPct: 26, offsetPct: 10, size: 290, rot:  5, dur: 8.2, delay: 1.2 },
  { src: "/event/07.png",       side: "left",  topPct: 52, offsetPct: 8,  size: 340, rot:  4, dur: 9.0, delay: 0.5 },
  { src: "/register/reg-3.png", side: "right", topPct: 50, offsetPct: 8,  size: 320, rot: -5, dur: 7.8, delay: 1.8 },
  { src: "/register/reg-4.png", side: "left",  topPct: 78, offsetPct: 12, size: 300, rot: -3, dur: 8.5, delay: 0.3 },
  { src: "/register/reg-5.png", side: "right", topPct: 78, offsetPct: 12, size: 310, rot:  5, dur: 8.0, delay: 1.5 },
];

export function RegisterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const orbitRef = useRef<HTMLDivElement>(null);

  /* Orbit tiles — stagger entrance on scroll-in */
  useEffect(() => {
    ensureGsap();
    if (!orbitRef.current) return;

    const tiles = orbitRef.current.querySelectorAll<HTMLElement>(".orbit-tile");

    if (prefersReducedMotion()) {
      gsap.set(tiles, { autoAlpha: 1, scale: 1, filter: "blur(0px)" });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(tiles, { autoAlpha: 0, scale: 0.85, filter: "blur(14px)" });
      gsap.to(tiles, {
        autoAlpha: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: 1.3,
        ease: "expo.out",
        stagger: { each: 0.12, from: "random" },
        scrollTrigger: {
          trigger: orbitRef.current,
          start: "top 75%",
          once: true,
        },
      });
    }, orbitRef);

    return () => ctx.revert();
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <section
      id="register"
      className="relative z-30 px-4 pt-28 pb-28 lg:pt-40 lg:pb-40"
      style={{ overflowX: "clip", overflowY: "visible" }}
    >
      {/* Layered soft blue glows reminiscent of rediscover's blurred form */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-1/4 top-1/2 h-[500px] w-[700px] -translate-y-1/2"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(28,157,217,0.22), transparent 65%)",
          filter: "blur(120px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-1/4 top-1/2 h-[500px] w-[700px] -translate-y-1/2"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(28,157,217,0.18), transparent 65%)",
          filter: "blur(120px)",
        }}
      />

      {/* Side-gutter event tiles — visible from tablet upwards.
          z-20 so they sit ABOVE the centered title + form (Container has
          z-10). pointer-events-none keeps clicks passing through to the
          form fields underneath. Same vw-cap as AudienceSection so the
          two paired layouts feel consistent across breakpoints. */}
      <div
        ref={orbitRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 hidden md:block"
      >
        {ORBIT_IMAGES.map((tile, i) => (
          <div
            key={tile.src}
            className="orbit-tile absolute aspect-square"
            style={{
              [tile.side]: `${tile.offsetPct}%`,
              top: `${tile.topPct}%`,
              /* Cap at ~17vw so tiles always leave plenty of room for the
                 centred title even on laptop (1280–1440) screens. */
              width: `clamp(130px, 17vw, ${tile.size}px)`,
              transform: "translateY(-50%)",
            }}
          >
            {/* Inner — continuous float + base rotation */}
            <div
              className="absolute inset-0"
              style={{
                animation: `registerOrbitFloat${i % 4} ${tile.dur}s ease-in-out ${tile.delay}s infinite`,
                ["--r" as never]: `${tile.rot}deg`,
              }}
            >
              <div
                className="relative h-full w-full overflow-hidden bg-surface"
                style={{
                  borderRadius: 28,
                  boxShadow:
                    "0 40px 80px -30px rgba(10,10,15,0.35), 0 12px 30px -12px rgba(10,10,15,0.18)",
                }}
              >
                <Image
                  src={tile.src}
                  alt=""
                  fill
                  sizes="(min-width: 1280px) 500px, 34vw"
                  quality={95}
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Container className="relative z-10 flex flex-col items-center text-center">
        <WordReveal
          as="h2"
          text={register.bigHeadline}
          className="section-headline max-w-[900px] text-ink"
        />

        {/* Big CTA pill */}
        {!submitted ? (
          <form
            onSubmit={submit}
            className="mt-12 flex w-full max-w-[460px] flex-col items-stretch gap-3 lg:mt-16"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={register.emailPlaceholder}
              required
              aria-label="Email"
              className="w-full rounded-full border border-ink/15 bg-paper-pure px-7 py-4 text-center text-base text-ink placeholder:text-ink-muted focus:border-ink/40 focus:outline-none focus:ring-2 focus:ring-[#1C9DD9]/30 lg:py-5 lg:text-lg"
            />
            <button
              type="submit"
              className="register-cta flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-full bg-ink px-9 py-4 text-base font-medium text-paper transition-all duration-200 ease-premium hover:scale-[1.02] hover:shadow-[0_20px_60px_-20px_rgba(28,157,217,0.6)] lg:py-5 lg:text-lg"
              style={{ cursor: "pointer" }}
            >
              {register.cta}
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </form>
        ) : (
          <div
            role="status"
            aria-live="polite"
            className="mt-12 inline-flex items-center gap-3 rounded-full bg-ink px-8 py-5 text-base text-paper lg:mt-16 lg:text-lg"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 13l4 4L19 7" />
            </svg>
            {register.success}
          </div>
        )}

        {/* Alt CTA */}
        <a
          href="#aftermovie"
          className="mt-8 inline-flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-ink-soft transition-colors duration-300 hover:text-ink lg:mt-10"
        >
          {register.altCta}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM9.5 16.5v-9l7 4.5-7 4.5z" />
          </svg>
        </a>
      </Container>

      <style>{`
        @keyframes registerOrbitFloat0 {
          0%, 100% { transform: rotate(var(--r, 0deg)) translate3d(0, 0, 0); }
          50%      { transform: rotate(calc(var(--r, 0deg) + 1deg)) translate3d(6px, -12px, 0); }
        }
        @keyframes registerOrbitFloat1 {
          0%, 100% { transform: rotate(var(--r, 0deg)) translate3d(0, 0, 0); }
          50%      { transform: rotate(calc(var(--r, 0deg) - 1.5deg)) translate3d(-8px, 10px, 0); }
        }
        @keyframes registerOrbitFloat2 {
          0%, 100% { transform: rotate(var(--r, 0deg)) translate3d(0, 0, 0); }
          50%      { transform: rotate(calc(var(--r, 0deg) + 2deg)) translate3d(-6px, -10px, 0); }
        }
        @keyframes registerOrbitFloat3 {
          0%, 100% { transform: rotate(var(--r, 0deg)) translate3d(0, 0, 0); }
          50%      { transform: rotate(calc(var(--r, 0deg) - 1deg)) translate3d(10px, 8px, 0); }
        }
      `}</style>
    </section>
  );
}
