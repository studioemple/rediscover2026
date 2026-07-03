"use client";

import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { WordReveal } from "@/components/ui/WordReveal";
import { useContent } from "@/components/i18n/LanguageProvider";
import { ensureGsap, gsap, prefersReducedMotion } from "@/lib/animations";

// Diagonal cut at the bottom-right corner (notch like the testimonial cards).
const WHY_CUT = 30; // px
const WHY_CUT_CLIP = `polygon(0 0, 100% 0, 100% calc(100% - ${WHY_CUT}px), calc(100% - ${WHY_CUT}px) 100%, 0 100%)`;

export function WhyReturnSection() {
  const { whyReturn } = useContent();
  // One tile is always open; first one by default.
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  /* Scroll-in: tiles rise + blur-clear, staggered. */
  useEffect(() => {
    ensureGsap();
    if (!listRef.current) return;

    const tiles = listRef.current.querySelectorAll<HTMLElement>(".why-tile");
    if (!tiles.length) return;

    if (prefersReducedMotion()) {
      gsap.set(tiles, { autoAlpha: 1, y: 0, filter: "blur(0px)" });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(tiles, { autoAlpha: 0, y: 28, filter: "blur(10px)" });
      gsap.to(tiles, {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: listRef.current,
          start: "top 80%",
          once: true,
        },
      });
    }, listRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative px-4 pt-20 pb-20 lg:pt-44 lg:pb-44">
      <Container className="flex flex-col items-center">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <p
            className="text-sm uppercase tracking-[0.12em] lg:text-base"
            style={{ color: "#1C9DD9", fontWeight: 600 }}
          >
            {whyReturn.eyebrow}
          </p>
          <WordReveal
            as="h2"
            text={whyReturn.bigHeadline}
            className="section-headline mt-4 text-center text-ink lg:mt-6 2xl:whitespace-nowrap"
          />
        </div>

        {/* Accordion tiles */}
        <div
          ref={listRef}
          /* Mobile: boxes sit just INSIDE the outer vertical bg lines (lines at
             10vw / 90vw; width 74vw centred → edges at ~13vw / 87vw, a small
             inset so the lines stay visible just outside the boxes).
             Desktop: revert to the max-width column. */
          className="mt-12 flex w-[74vw] flex-col gap-3 lg:mt-16 lg:w-full lg:max-w-[920px] lg:gap-4"
        >
          {whyReturn.items.map((item, i) => {
            const isActive = active === i;
            return (
              <div
                key={item.title}
                className="why-tile group relative cursor-pointer"
                onMouseEnter={() => setActive(i)}
                onClick={() => setActive(i)}
              >
                {/* Clipped body: bg + straight borders + the corner cut.
                    The diagonal edge of the cut is drawn separately below
                    (a clip-path clips the CSS border on that edge). */}
                <div
                  className="relative overflow-hidden border transition-all duration-500"
                  style={{
                    background: isActive ? "#FFFFFF" : "transparent",
                    borderColor: "rgba(10,10,15,0.12)",
                    clipPath: `${WHY_CUT_CLIP}`,
                    // box-shadow gets clipped by clip-path, so active depth
                    // uses a drop-shadow filter that follows the cut shape.
                    filter: isActive
                      ? "drop-shadow(0 18px 34px rgba(10,10,15,0.16))"
                      : "none",
                    transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                >
                <button
                  type="button"
                  aria-expanded={isActive}
                  className="flex w-full items-center gap-4 px-5 py-4 text-left lg:gap-7 lg:px-9 lg:py-7"
                  style={{ cursor: "pointer" }}
                >
                  {/* Index */}
                  <span
                    className="shrink-0 tabular-nums transition-colors duration-500"
                    style={{
                      fontFamily: "var(--font-sora), sans-serif",
                      fontSize: "clamp(1.5rem, 2.4vw, 2.25rem)",
                      fontWeight: 300,
                      letterSpacing: "-0.04em",
                      lineHeight: 1,
                      color: isActive ? "#1C9DD9" : "rgba(10,10,15,0.3)",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Title */}
                  <h3
                    className="headline flex-1 leading-[1.2] text-ink"
                    style={{
                      fontSize: "clamp(1rem, 2.2vw, 1.75rem)",
                      fontWeight: 600,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {item.title}
                  </h3>

                  {/* Chevron */}
                  <span
                    aria-hidden
                    className="flex size-9 shrink-0 items-center justify-center transition-transform duration-500 lg:size-10"
                    style={{
                      transform: isActive ? "rotate(180deg)" : "rotate(0deg)",
                      color: isActive ? "#1C9DD9" : "rgba(10,10,15,0.4)",
                      transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </span>
                </button>

                {/* Expandable body */}
                <div
                  className="grid transition-[grid-template-rows] duration-500"
                  style={{
                    gridTemplateRows: isActive ? "1fr" : "0fr",
                    transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                >
                  <div className="min-h-0 overflow-hidden">
                    <p
                      className="pb-5 pl-5 pr-5 text-[15px] leading-[1.5] text-ink-soft lg:pb-8 lg:pl-[calc(clamp(1.5rem,2.4vw,2.25rem)+1.75rem)] lg:pr-16 lg:text-[18px] lg:leading-[1.55]"
                      style={{
                        opacity: isActive ? 1 : 0,
                        transform: isActive
                          ? "translateY(0)"
                          : "translateY(-6px)",
                        transition: "opacity 0.5s, transform 0.5s",
                        transitionTimingFunction:
                          "cubic-bezier(0.22, 1, 0.36, 1)",
                        transitionDelay: isActive ? "0.12s" : "0s",
                      }}
                    >
                      {item.body}
                    </p>
                  </div>
                </div>
                </div>

                {/* Diagonal hairline along the bottom-right cut — drawn on
                    the (unclipped) outer wrapper so it stays visible where
                    clip-path removes the CSS border. */}
                <span
                  aria-hidden
                  style={{
                    position: "absolute",
                    right: -1,
                    bottom: WHY_CUT,
                    width: WHY_CUT * 1.4142,
                    height: 1,
                    background: "rgba(10,10,15,0.12)",
                    transformOrigin: "right bottom",
                    transform: "rotate(-45deg)",
                  }}
                />
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
