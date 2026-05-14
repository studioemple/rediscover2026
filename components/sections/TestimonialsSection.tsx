"use client";

import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { WordReveal } from "@/components/ui/WordReveal";
import { testimonials } from "@/lib/content";
import { ensureGsap, gsap, prefersReducedMotion } from "@/lib/animations";

const VISIBLE_COUNT = 5;

/* Pentagram-ish orbit around the centered title.
   Each card has a gentle continuous float animation. */
type Tile = {
  left: string;
  top: string;
  rot: number;
  dur: number;
  delay: number;
};

const POSITIONS: Tile[] = [
  // top-left
  { left: "1%",  top: "10%", rot: -5, dur: 8.0, delay: 0.0 },
  // top-right
  { left: "77%", top: "10%", rot:  4, dur: 8.6, delay: 1.4 },
  // mid-left (lower)
  { left: "0%",  top: "60%", rot:  6, dur: 9.0, delay: 0.6 },
  // mid-right (lower)
  { left: "78%", top: "60%", rot: -4, dur: 7.8, delay: 1.8 },
  // bottom-center
  { left: "37%", top: "82%", rot: -3, dur: 8.4, delay: 0.3 },
];

export function TestimonialsSection() {
  const [page, setPage] = useState(0);
  const stripRef = useRef<HTMLDivElement>(null);

  const visible = Array.from({ length: VISIBLE_COUNT }, (_, i) => {
    const idx = (page * VISIBLE_COUNT + i) % testimonials.quotes.length;
    return testimonials.quotes[idx];
  });

  /* Entrance animation — re-runs on every page change because key={page}
     remounts the cards. Bottom-to-top stagger. */
  useEffect(() => {
    ensureGsap();
    if (!stripRef.current) return;

    const cards = stripRef.current.querySelectorAll<HTMLElement>(
      ".testimonial-card",
    );
    if (!cards.length) return;

    if (prefersReducedMotion()) {
      gsap.set(cards, { autoAlpha: 1, y: 0, filter: "blur(0px)" });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(cards, {
        autoAlpha: 0,
        y: 60,
        filter: "blur(14px)",
        scale: 0.9,
      });
      gsap.to(cards, {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
        scale: 1,
        duration: 1.2,
        ease: "expo.out",
        stagger: { each: 0.12, from: "random" },
        scrollTrigger: {
          trigger: stripRef.current,
          start: "top 85%",
          once: true,
        },
      });
    }, stripRef);

    return () => ctx.revert();
  }, [page]);

  const total = Math.max(
    1,
    Math.ceil(testimonials.quotes.length / VISIBLE_COUNT),
  );
  const prev = () => setPage((p) => (p - 1 + total) % total);
  const next = () => setPage((p) => (p + 1) % total);

  return (
    <section className="relative overflow-hidden px-4 pt-30 pb-30 lg:pt-44 lg:pb-44">
      {/* Soft blue glow behind the centered title */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[1000px] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(28,157,217,0.08), transparent 65%)",
          filter: "blur(100px)",
        }}
      />

      {/* Stage: orbit of cards around a centered title block */}
      <div
        ref={stripRef}
        key={page}
        className="relative mx-auto w-full max-w-[1600px]"
      >
        {/* Desktop orbit — cards positioned absolutely around centered title */}
        <div className="relative hidden h-[820px] lg:block">
          {/* Centered title block (z above cards) */}
          <Container className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center">
            <p
              className="text-sm uppercase tracking-[0.2em] lg:text-base"
              style={{ color: "#1C9DD9" }}
            >
              {testimonials.eyebrow}
            </p>
            <WordReveal
              as="h2"
              text={testimonials.bigHeadline}
              className="headline mt-4 max-w-[900px] leading-[1.02] text-ink lg:mt-6"
              style={{
                fontSize: "clamp(2.5rem, 6.4vw, 104px)",
                fontWeight: 600,
                letterSpacing: "-3px",
              }}
            />
          </Container>

          {/* Orbiting cards */}
          {visible.map((q, i) => {
            const pos = POSITIONS[i];
            return (
              <div
                key={`${page}-${i}`}
                className="testimonial-card absolute z-10"
                style={{
                  left: pos.left,
                  top: pos.top,
                  width: "clamp(300px, 22vw, 380px)",
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    animation: `testimonialFloat${i % 4} ${pos.dur}s ease-in-out ${pos.delay}s infinite`,
                    ["--r" as never]: `${pos.rot}deg`,
                  }}
                >
                  <TestimonialCard quote={q} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile / tablet — title on top, cards stacked below */}
        <div className="lg:hidden">
          <Container className="flex flex-col items-center text-center">
            <p
              className="text-sm uppercase tracking-[0.2em]"
              style={{ color: "#1C9DD9" }}
            >
              {testimonials.eyebrow}
            </p>
            <WordReveal
              as="h2"
              text={testimonials.bigHeadline}
              className="headline mt-4 max-w-[900px] leading-[1.02] text-ink"
              style={{
                fontSize: "clamp(2.25rem, 8vw, 56px)",
                fontWeight: 600,
                letterSpacing: "-1.6px",
              }}
            />
          </Container>

          <div className="mt-12 flex flex-col items-center gap-5 px-2">
            {visible.map((q, i) => (
              <div
                key={`m-${page}-${i}`}
                className="testimonial-card w-full max-w-[400px]"
              >
                <TestimonialCard quote={q} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Arrows */}
      <div className="mt-14 flex items-center justify-center gap-5 lg:mt-12">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous testimonials"
          className="flex size-12 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors duration-300 hover:bg-ink hover:text-paper lg:size-14"
          style={{ cursor: "pointer" }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>

        <span className="min-w-[60px] text-center text-sm uppercase tracking-[0.2em] text-ink-soft">
          {page + 1} / {total}
        </span>

        <button
          type="button"
          onClick={next}
          aria-label="Next testimonials"
          className="flex size-12 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors duration-300 hover:bg-ink hover:text-paper lg:size-14"
          style={{ cursor: "pointer" }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <style>{`
        @keyframes testimonialFloat0 {
          0%, 100% { transform: rotate(var(--r, 0deg)) translate3d(0, 0, 0); }
          50%      { transform: rotate(calc(var(--r, 0deg) + 1deg)) translate3d(6px, -14px, 0); }
        }
        @keyframes testimonialFloat1 {
          0%, 100% { transform: rotate(var(--r, 0deg)) translate3d(0, 0, 0); }
          50%      { transform: rotate(calc(var(--r, 0deg) - 1.5deg)) translate3d(-8px, 12px, 0); }
        }
        @keyframes testimonialFloat2 {
          0%, 100% { transform: rotate(var(--r, 0deg)) translate3d(0, 0, 0); }
          50%      { transform: rotate(calc(var(--r, 0deg) + 2deg)) translate3d(-6px, -10px, 0); }
        }
        @keyframes testimonialFloat3 {
          0%, 100% { transform: rotate(var(--r, 0deg)) translate3d(0, 0, 0); }
          50%      { transform: rotate(calc(var(--r, 0deg) - 1deg)) translate3d(10px, 8px, 0); }
        }
      `}</style>
    </section>
  );
}

/* Card uses the SVG shape from /testimonials/card-shape.svg as its background.
   The SVG already includes:
     - rounded outline with a tab-notch in the top-right
     - soft blue gradient fill + frosted glass border
     - 5 gold stars at top-left
   We layer the quote text on top via padding/positioning that matches the
   star area's vertical offset. */
function TestimonialCard({
  quote,
}: {
  quote: { text: string; author: string; role: string };
}) {
  return (
    <div
      className="relative w-full"
      style={{ aspectRatio: "280 / 203" }}
    >
      {/* SVG shape — fills the card */}
      <img
        src="/testimonials/card-shape.svg"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full select-none"
        draggable={false}
      />

      {/* Quote text — softer black, bigger font, positioned below the stars */}
      <div className="absolute inset-0 flex items-end px-[8%] pb-[10%] pt-[26%]">
        <p
          className="text-[17px] leading-[1.45] lg:text-[19px]"
          style={{
            color: "#2A2A33",
            fontWeight: 400,
          }}
        >
          {quote.text}
        </p>
      </div>
    </div>
  );
}
