"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { WordReveal } from "@/components/ui/WordReveal";
import { Button } from "@/components/ui/Button";
import { audience, event } from "@/lib/content";
import { ensureGsap, gsap, prefersReducedMotion } from "@/lib/animations";

/* 6 large event photos positioned in the SIDE GUTTERS of the section.
   Title block stays centered; images flank it on left/right.
   Positions in % so they remain inside the section regardless of viewport. */
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
  { src: "/audience/made-1.jpg", side: "left",  topPct: 24, offsetPct: 10, size: 300, rot: -7, dur: 7.5, delay: 0.0 },
  { src: "/audience/made-2.jpg", side: "right", topPct: 26, offsetPct: 10, size: 290, rot:  5, dur: 8.2, delay: 1.2 },
  { src: "/audience/made-3.jpg", side: "left",  topPct: 52, offsetPct: 8,  size: 340, rot:  4, dur: 9.0, delay: 0.5 },
  { src: "/audience/made-4.jpg", side: "right", topPct: 50, offsetPct: 8,  size: 320, rot: -5, dur: 7.8, delay: 1.8 },
  { src: "/event/12.png",        side: "left",  topPct: 78, offsetPct: 12, size: 300, rot: -3, dur: 8.5, delay: 0.3 },
  { src: "/event/13.png",        side: "right", topPct: 78, offsetPct: 12, size: 310, rot:  5, dur: 8.0, delay: 1.5 },
];

export function AudienceSection() {
  const titlesRef = useRef<HTMLDivElement>(null);
  const titleEls = useRef<(HTMLDivElement | null)[]>([]);
  const orbitRef = useRef<HTMLDivElement>(null);

  /* Rising reveal — words rise up from below on scroll-in */
  useEffect(() => {
    ensureGsap();
    if (!titlesRef.current) return;

    const inner = titlesRef.current.querySelectorAll<HTMLElement>(".rising-word");
    const masks = titlesRef.current.querySelectorAll<HTMLElement>(".rising-mask");

    const releaseMasks = () => {
      masks.forEach((m) => (m.style.overflow = "visible"));
    };

    if (prefersReducedMotion()) {
      gsap.set(inner, { yPercent: 0, autoAlpha: 1 });
      releaseMasks();
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(inner, { yPercent: 110, autoAlpha: 0 });
      gsap.to(inner, {
        yPercent: 0,
        autoAlpha: 1,
        duration: 1.1,
        ease: "expo.out",
        stagger: { each: 0.07 },
        onComplete: releaseMasks,
        scrollTrigger: {
          trigger: titlesRef.current,
          start: "top 78%",
          once: true,
        },
      });
    }, titlesRef);

    return () => ctx.revert();
  }, []);

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

  return (
    <section
      className="relative px-4 pt-30 pb-30 lg:pt-44 lg:pb-44"
      style={{ overflowX: "clip", overflowY: "visible" }}
    >

      {/* Side-gutter event tiles — visible from tablet upwards.
          z-20 so they sit ABOVE the centered headline/content (Container
          has z-10). pointer-events-none keeps clicks passing through to
          the title + CTA underneath. On tablet (md..lg) the tiles cap at
          ~22vw so they fit beside the smaller centered title without
          crowding it; from lg upwards they grow to the design size. */}
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
                animation: `orbitFloat${i % 4} ${tile.dur}s ease-in-out ${tile.delay}s infinite`,
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
        <p
          className="text-sm uppercase tracking-[0.12em] lg:text-base"
          style={{ color: "#1C9DD9", fontWeight: 600 }}
        >
          {audience.eyebrow}
        </p>

        {/* Headline — sized so it stays in 2 lines on laptops without
            getting crowded by the orbit tiles. */}
        <WordReveal
          as="h2"
          text={audience.bigHeadline}
          className="section-headline mt-4 text-ink lg:mt-6 2xl:whitespace-nowrap"
        />

        {/* Titles stack */}
        <div
          ref={titlesRef}
          className="mt-8 flex flex-col items-center gap-1 lg:mt-12 lg:gap-2"
        >
          {audience.titles.map((title, i) => {
            const words = title.split(" ");
            return (
              <div
                key={title}
                ref={(el) => {
                  titleEls.current[i] = el;
                }}
                className="audience-title-row"
              >
                <div className="flex flex-wrap justify-center gap-x-3 lg:gap-x-4">
                  {words.map((word, j) => (
                    <span
                      key={j}
                      className="rising-mask inline-flex overflow-hidden pb-3 leading-[1.15] lg:pb-4"
                    >
                      <span
                        className="rising-word audience-title-word headline text-[26px] leading-[1.15] tracking-[-1px] lg:text-[42px] lg:tracking-[-1.6px]"
                        style={{ display: "inline-block", fontWeight: 350 }}
                      >
                        {word}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <a href="#register" className="mt-10 lg:mt-14">
          <Button variant="primary">{event.registerCta}</Button>
        </a>
      </Container>

      <style>{`
        @keyframes orbitFloat0 {
          0%, 100% { transform: rotate(var(--r, 0deg)) translate3d(0, 0, 0); }
          50%      { transform: rotate(calc(var(--r, 0deg) + 1deg)) translate3d(6px, -12px, 0); }
        }
        @keyframes orbitFloat1 {
          0%, 100% { transform: rotate(var(--r, 0deg)) translate3d(0, 0, 0); }
          50%      { transform: rotate(calc(var(--r, 0deg) - 1.5deg)) translate3d(-8px, 10px, 0); }
        }
        @keyframes orbitFloat2 {
          0%, 100% { transform: rotate(var(--r, 0deg)) translate3d(0, 0, 0); }
          50%      { transform: rotate(calc(var(--r, 0deg) + 2deg)) translate3d(-6px, -10px, 0); }
        }
        @keyframes orbitFloat3 {
          0%, 100% { transform: rotate(var(--r, 0deg)) translate3d(0, 0, 0); }
          50%      { transform: rotate(calc(var(--r, 0deg) - 1deg)) translate3d(10px, 8px, 0); }
        }
      `}</style>
    </section>
  );
}
